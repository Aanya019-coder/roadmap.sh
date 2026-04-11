import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { callOpenRouter } from '../lib/openrouter';

const router = Router();

// POST /api/onboarding/save — save answers without generating
router.post('/save', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('onboarding_answers')
      .upsert(
        { user_id: req.user!.id, answers: req.body, completed_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/onboarding/answers
router.get('/answers', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('onboarding_answers')
      .select('*')
      .eq('user_id', req.user!.id)
      .maybeSingle();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/onboarding/roadmap
router.get('/roadmap', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('personalized_roadmaps')
      .select('*')
      .eq('user_id', req.user!.id)
      .maybeSingle();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/onboarding/generate — save + generate roadmap
router.post('/generate', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const answers = req.body;

    // Save answers
    await supabase
      .from('onboarding_answers')
      .upsert(
        { user_id: req.user!.id, answers, completed_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      );

    const roadmapData = await generatePersonalizedRoadmap(answers);

    // Save roadmap
    const { data, error } = await supabase
      .from('personalized_roadmaps')
      .upsert(
        { user_id: req.user!.id, roadmap_data: roadmapData, version: 1, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/onboarding/regenerate
router.post('/regenerate', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const answers = req.body;

    // Get current version
    const { data: existing } = await supabase
      .from('personalized_roadmaps')
      .select('version')
      .eq('user_id', req.user!.id)
      .maybeSingle();

    const newVersion = (existing?.version || 0) + 1;
    const roadmapData = await generatePersonalizedRoadmap(answers);

    const { data, error } = await supabase
      .from('personalized_roadmaps')
      .upsert(
        { user_id: req.user!.id, roadmap_data: roadmapData, version: newVersion, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

async function generatePersonalizedRoadmap(answers: any): Promise<any> {
  const prompt = `You are a senior developer career coach. A student has answered an onboarding questionnaire. Based on their background, skills, goals, time availability, and learning style, generate a complete personalized learning roadmap as a JSON object.

Student profile:
- Name: ${answers.name}, from ${answers.hometown || 'unknown'}, studies at ${answers.college || 'unknown'}
- Current skills: ${(answers.currentSkills || []).join(', ') || 'none'}
- Coding level: ${answers.codingLevel || 'beginner'}
- Main goal: ${answers.mainGoal || 'learn to code'}
- Interest area: ${answers.interestArea || 'full stack'}
- Available time: ${answers.weeklyHours || '5-10 hours'}/week
- Biggest constraint: ${answers.biggestConstraint || 'lack of guidance'}
- Learning style: ${(answers.learningStyles || []).join(', ') || 'hands-on'}
- Dream project: ${answers.dreamProject || 'not specified'}
- Country: ${answers.country || 'unknown'}

Generate a roadmap JSON with this EXACT structure (return ONLY valid JSON, no markdown):
{
  "title": "string",
  "description": "string (2-3 sentences explaining why this roadmap fits this specific person)",
  "estimatedWeeks": number,
  "weeklyHours": number,
  "phases": [
    {
      "id": "string",
      "title": "string",
      "duration": "string (e.g. '2 weeks')",
      "description": "string",
      "nodes": [
        {
          "id": "string",
          "label": "string",
          "type": "topic | project | milestone",
          "priority": "essential | recommended | optional",
          "estimatedHours": number,
          "resources": [
            { "title": "string", "url": "string", "type": "article | video | course | docs", "isFree": true }
          ],
          "whyThisMatters": "string (1 sentence for their specific goal)"
        }
      ],
      "edges": [{ "source": "string", "target": "string" }]
    }
  ]
}

Make it realistic for someone with ${answers.weeklyHours || '5-10 hours'}/week. Prioritize practical skills over theory for their goal of ${answers.mainGoal}. Include at least one hands-on project node per phase. Include 3-5 phases total.`;

  const response = await callOpenRouter([
    { role: 'system', content: 'You are an expert developer roadmap generator. Return only raw JSON.' },
    { role: 'user', content: prompt }
  ]);
  
  const result = await response.json();
  const text = result.choices[0].message.content;

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('AI did not return valid JSON');
  return JSON.parse(jsonMatch[0]);
}

export default router;

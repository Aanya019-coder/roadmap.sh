import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { callOpenRouter } from '../lib/openrouter';

const router = Router();

// POST /api/ai/chat — SSE streaming chat
router.post('/chat', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message, chat_id, context } = req.body;

    // Load chat history from Supabase
    let messages: { role: string; content: string }[] = [];
    let chatId = chat_id;

    if (chatId) {
      const { data } = await supabase
        .from('ai_chat_history')
        .select('messages')
        .eq('id', chatId)
        .eq('user_id', req.user!.id)
        .maybeSingle();
      if (data?.messages) messages = data.messages;
    }

    const systemPrompt = `You are a developer career AI tutor on roadmap.sh. Help developers learn and grow with clear, actionable advice. ${context ? `Context: The user is learning about ${context}.` : ''}`;

    const openRouterMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ];

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:4321');

    const response = await callOpenRouter(openRouterMessages, true); // true for streaming

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      
      // OpenRouter sends standard SSE "data: {...}" format
      const lines = chunk.split('\n').filter(line => line.trim().startsWith('data: '));
      
      for (const line of lines) {
        const dataStr = line.replace('data: ', '').trim();
        if (dataStr === '[DONE]') continue;
        
        try {
          const json = JSON.parse(dataStr);
          const chunkText = json.choices[0]?.delta?.content || '';
          if (chunkText) {
            fullResponse += chunkText;
            res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
          }
        } catch (e) {
          // Ignore parse errors on partial chunks
        }
      }
    }

    // Save messages to DB
    const newMessages = [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: fullResponse },
    ];

    if (chatId) {
      await supabase
        .from('ai_chat_history')
        .update({ messages: newMessages, updated_at: new Date().toISOString() })
        .eq('id', chatId);
    } else {
      const { data } = await supabase
        .from('ai_chat_history')
        .insert({ user_id: req.user!.id, messages: newMessages, title: message.substring(0, 50), roadmap_context: context || null })
        .select('id')
        .single();
      chatId = data?.id;
    }

    res.write(`data: ${JSON.stringify({ done: true, chat_id: chatId })}\n\n`);
    res.end();
  } catch (err: any) {
    console.error('AI Chat Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/ai/chats — list all chats
router.get('/chats', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('ai_chat_history')
      .select('id, title, roadmap_context, created_at, updated_at')
      .eq('user_id', req.user!.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/ai/chat/:id — get one chat with messages
router.get('/chat/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('ai_chat_history')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user!.id)
      .single();

    if (error || !data) {
      res.status(404).json({ success: false, error: 'Chat not found' });
      return;
    }
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ai/generate — generate roadmap/course/quiz/plan
router.post('/generate', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, topic, prompt: userPrompt } = req.body;

    const structures: Record<string, string> = {
      roadmap: '{ "nodes": [{ "id": "string", "label": "string", "type": "topic|project|milestone" }], "edges": [{ "source": "string", "target": "string" }] }',
      course: '{ "title": "string", "modules": [{ "title": "string", "lessons": [{ "title": "string", "content": "markdown..." }] }] }',
      quiz: '{ "questions": [{ "question": "string", "options": ["a", "b", "c", "d"], "correctAnswer": "string", "explanation": "string" }] }',
      plan: '{ "title": "string", "weeks": [{ "week": 1, "goals": ["string"], "tasks": ["string"] }] }',
    };

    const finalPrompt = `Task: Generate a ${type} for the topic: "${topic}". ${userPrompt ? `Additional instructions: ${userPrompt}` : ''}\nReturn ONLY valid JSON matching this structure: ${structures[type] || '{}'}`;

    const response = await callOpenRouter([
      { role: 'system', content: 'You are a helpful education AI. Return only raw JSON.' },
      { role: 'user', content: finalPrompt }
    ]);
    
    const result = await response.json();
    const responseText = result.choices[0].message.content;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonData = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

    const { data, error } = await supabase
      .from('ai_library')
      .insert({ user_id: req.user!.id, type, topic, data: jsonData })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('AI Generate Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/ai/library
router.get('/library', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const typeFilter = req.query.type as string | undefined;
    let query = supabase
      .from('ai_library')
      .select('*')
      .eq('user_id', req.user!.id)
      .order('created_at', { ascending: false });

    if (typeFilter) query = query.eq('type', typeFilter);

    const { data, error } = query as any;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/ai/library/:id
router.get('/library/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('ai_library')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user!.id)
      .single();

    if (error || !data) {
      res.status(404).json({ success: false, error: 'Content not found' });
      return;
    }
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

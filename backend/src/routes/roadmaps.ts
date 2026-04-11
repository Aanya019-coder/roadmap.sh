import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/roadmaps — list all pre-built roadmaps
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('prebuilt_roadmaps')
      .select('slug, title, description, category, icon, estimated_weeks, topic_count')
      .order('title');

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/roadmaps/custom/mine — user's custom roadmaps
router.get('/custom/mine', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('custom_roadmaps')
      .select('*')
      .eq('user_id', req.user!.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/roadmaps/custom/share/:shareToken — public share link
router.get('/custom/share/:shareToken', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('custom_roadmaps')
      .select('title, description, nodes, edges')
      .eq('share_token', req.params.shareToken)
      .eq('is_public', true)
      .single();

    if (error || !data) {
      res.status(404).json({ success: false, error: 'Roadmap not found or is private' });
      return;
    }
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/roadmaps/custom — create custom roadmap
router.post('/custom', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, nodes, edges, is_public } = req.body;
    const share_token = crypto.randomUUID();

    const { data, error } = await supabase
      .from('custom_roadmaps')
      .insert({ user_id: req.user!.id, title, description, nodes, edges, is_public: is_public || false, share_token })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/roadmaps/custom/:id
router.put('/custom/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, nodes, edges, is_public } = req.body;

    const { data, error } = await supabase
      .from('custom_roadmaps')
      .update({ title, description, nodes, edges, is_public, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .eq('user_id', req.user!.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/roadmaps/custom/:id
router.delete('/custom/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { error } = await supabase
      .from('custom_roadmaps')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user!.id);

    if (error) throw error;
    res.json({ success: true, data: { message: 'Deleted' } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/roadmaps/:slug/projects
router.get('/:slug/projects', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('roadmap_projects')
      .select('*')
      .eq('roadmap_slug', req.params.slug)
      .order('difficulty');

    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/roadmaps/:slug — get one pre-built roadmap with nodes/edges
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('prebuilt_roadmaps')
      .select('*')
      .eq('slug', req.params.slug)
      .single();

    if (error || !data) {
      res.status(404).json({ success: false, error: 'Roadmap not found' });
      return;
    }
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

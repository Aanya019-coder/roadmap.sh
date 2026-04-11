import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/progress — upsert node status
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { roadmap_id, roadmap_type, node_id, status } = req.body;

    const { data, error } = await supabase
      .from('user_progress')
      .upsert(
        { user_id: req.user!.id, roadmap_id, roadmap_type, node_id, status, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,roadmap_id,node_id' }
      )
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/progress/summary — all roadmaps user has touched
router.get('/summary', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('roadmap_id, roadmap_type, status')
      .eq('user_id', req.user!.id);

    if (error) throw error;

    // Aggregate by roadmap_id
    const summaryMap: Record<string, { total: number; done: number; roadmap_type: string }> = {};
    for (const row of data) {
      if (!summaryMap[row.roadmap_id]) {
        summaryMap[row.roadmap_id] = { total: 0, done: 0, roadmap_type: row.roadmap_type };
      }
      summaryMap[row.roadmap_id].total++;
      if (row.status === 'done') summaryMap[row.roadmap_id].done++;
    }

    const summary = Object.entries(summaryMap).map(([roadmap_id, v]) => ({
      roadmap_id,
      roadmap_type: v.roadmap_type,
      total: v.total,
      done: v.done,
      percent: Math.round((v.done / v.total) * 100),
    }));

    res.json({ success: true, data: summary });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/progress/:roadmapId — all node statuses for one roadmap
router.get('/:roadmapId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('node_id, status')
      .eq('user_id', req.user!.id)
      .eq('roadmap_id', req.params.roadmapId);

    if (error) throw error;

    // Return as map: { nodeId: status }
    const progressMap: Record<string, string> = {};
    for (const row of data) {
      progressMap[row.node_id] = row.status;
    }

    res.json({ success: true, data: progressMap });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/progress/:roadmapId/:nodeId — reset a node
router.delete('/:roadmapId/:nodeId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', req.user!.id)
      .eq('roadmap_id', req.params.roadmapId)
      .eq('node_id', req.params.nodeId);

    if (error) throw error;
    res.json({ success: true, data: { message: 'Progress reset' } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/users/me
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user!.id)
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/users/me
router.put('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, bio, github_username, linkedin_url, website_url, avatar_url } = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update({ name, bio, github_username, linkedin_url, website_url, avatar_url, updated_at: new Date().toISOString() })
      .eq('id', req.user!.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/users/:username (public profile)
router.get('/:username', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, bio, avatar_url, github_username, linkedin_url, website_url, created_at')
      .or(`github_username.eq.${req.params.username},name.eq.${req.params.username}`)
      .single();

    if (error || !data) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/users/me
router.delete('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Delete auth user (cascades to profile via DB trigger)
    const { error } = await supabase.auth.admin.deleteUser(req.user!.id);
    if (error) throw error;
    res.json({ success: true, data: { message: 'Account deleted' } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

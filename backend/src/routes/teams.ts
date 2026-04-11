import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import crypto from 'crypto';

const router = Router();

// POST /api/teams — create team
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + crypto.randomBytes(3).toString('hex');

    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({ name, slug, description, owner_id: req.user!.id })
      .select()
      .single();

    if (teamError) throw teamError;

    // Add creator as admin member
    await supabase
      .from('team_members')
      .insert({ team_id: team.id, user_id: req.user!.id, role: 'admin' });

    res.status(201).json({ success: true, data: team });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/teams/me/all — user's teams
router.get('/me/all', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('role, teams(id, name, slug, description, created_at)')
      .eq('user_id', req.user!.id);

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/teams/:slug
router.get('/:slug', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: team, error } = await supabase
      .from('teams')
      .select('*, team_members(user_id, role, joined_at, profiles(name, email, avatar_url))')
      .eq('slug', req.params.slug)
      .single();

    if (error || !team) {
      res.status(404).json({ success: false, error: 'Team not found' });
      return;
    }

    const isMember = (team.team_members as any[]).some((m: any) => m.user_id === req.user!.id);
    if (!isMember) {
      res.status(403).json({ success: false, error: 'Not a member of this team' });
      return;
    }

    res.json({ success: true, data: team });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/teams/:slug/insights — aggregated skill-gap data
router.get('/:slug/insights', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: team, error: teamErr } = await supabase
      .from('teams')
      .select('id, owner_id, team_members(user_id)')
      .eq('slug', req.params.slug)
      .single();

    if (teamErr || !team) {
      res.status(404).json({ success: false, error: 'Team not found' });
      return;
    }

    const memberIds = (team.team_members as any[]).map((m: any) => m.user_id);
    if (!memberIds.includes(req.user!.id)) {
      res.status(403).json({ success: false, error: 'Forbidden' });
      return;
    }

    const { data: progressData, error: progressErr } = await supabase
      .from('user_progress')
      .select('user_id, roadmap_id, node_id, status')
      .in('user_id', memberIds);

    if (progressErr) throw progressErr;

    // Aggregate per member per roadmap
    const insights: Record<string, { done: number; total: number }> = {};
    for (const row of progressData) {
      const key = `${row.user_id}::${row.roadmap_id}`;
      if (!insights[key]) insights[key] = { done: 0, total: 0 };
      insights[key].total++;
      if (row.status === 'done') insights[key].done++;
    }

    res.json({ success: true, data: insights });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/teams/:slug/invite
router.post('/:slug/invite', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const token = crypto.randomBytes(16).toString('hex');

    const { data: team } = await supabase.from('teams').select('id, name').eq('slug', req.params.slug).single();
    if (!team) {
      res.status(404).json({ success: false, error: 'Team not found' });
      return;
    }

    await supabase.from('team_invites').insert({
      team_id: team.id,
      email,
      token,
      invited_by: req.user!.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // TODO: send invite email via Resend
    res.json({ success: true, data: { message: `Invite sent to ${email}`, token } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/teams/:slug/join/:token
router.post('/:slug/join/:token', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: invite } = await supabase
      .from('team_invites')
      .select('*')
      .eq('token', req.params.token)
      .eq('email', req.user!.email)
      .maybeSingle();

    if (!invite || new Date(invite.expires_at) < new Date()) {
      res.status(400).json({ success: false, error: 'Invalid or expired invite' });
      return;
    }

    await supabase.from('team_members').insert({ team_id: invite.team_id, user_id: req.user!.id, role: 'member' });
    await supabase.from('team_invites').delete().eq('id', invite.id);

    res.json({ success: true, data: { message: 'Joined team' } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/teams/:slug/members/:userId
router.delete('/:slug/members/:userId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: myMembership } = await supabase
      .from('team_members')
      .select('role, teams!inner(slug, owner_id)')
      .eq('user_id', req.user!.id)
      .filter('teams.slug', 'eq', req.params.slug)
      .maybeSingle();

    if (!myMembership || myMembership.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Only admins can remove members' });
      return;
    }

    const { data: team } = await supabase.from('teams').select('id, owner_id').eq('slug', req.params.slug).single();
    if (team?.owner_id === req.params.userId) {
      res.status(400).json({ success: false, error: 'Cannot remove the team owner' });
      return;
    }

    await supabase.from('team_members').delete().eq('team_id', team!.id).eq('user_id', req.params.userId);
    res.json({ success: true, data: { message: 'Member removed' } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/teams/:slug
router.delete('/:slug', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data: team } = await supabase.from('teams').select('id, owner_id').eq('slug', req.params.slug).single();

    if (!team) {
      res.status(404).json({ success: false, error: 'Team not found' });
      return;
    }
    if (team.owner_id !== req.user!.id) {
      res.status(403).json({ success: false, error: 'Only the owner can delete this team' });
      return;
    }

    await supabase.from('teams').delete().eq('id', team.id);
    res.json({ success: true, data: { message: 'Team deleted' } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

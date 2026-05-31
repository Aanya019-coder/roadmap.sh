import { supabase, isSupabaseConfigured } from './supabase';

export async function saveNodeProgress(
  roadmapId: string, 
  nodeId: string, 
  status: 'done' | 'in-progress' | 'skipped' | null
) {
  // Try Supabase first
  if (isSupabaseConfigured()) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      if (!status) {
        await supabase.from('roadmap_progress')
          .delete()
          .eq('user_id', user.id)
          .eq('roadmap_id', roadmapId)
          .eq('node_id', nodeId);
      } else {
        await supabase.from('roadmap_progress')
          .upsert({ user_id: user.id, roadmap_id: roadmapId, node_id: nodeId, status });
      }
      return;
    }
  }

  // localStorage fallback for guests
  const key = `progress:${roadmapId}`;
  const cur = JSON.parse(localStorage.getItem(key) || '{}');
  if (status) {
    cur[nodeId] = status;
  } else {
    delete cur[nodeId];
  }
  localStorage.setItem(key, JSON.stringify(cur));
}

export async function getRoadmapProgress(roadmapId: string): Promise<Record<string, string>> {
  // Try Supabase first
  if (isSupabaseConfigured()) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('roadmap_progress')
        .select('node_id, status')
        .eq('user_id', user.id)
        .eq('roadmap_id', roadmapId);
      return Object.fromEntries((data || []).map(r => [r.node_id, r.status]));
    }
  }

  // localStorage fallback
  return JSON.parse(localStorage.getItem(`progress:${roadmapId}`) || '{}');
}

export function getProgressPercentage(
  progress: Record<string, string>, 
  totalNodes: number
): number {
  const doneCount = Object.values(progress).filter(s => s === 'done').length;
  return totalNodes > 0 ? Math.round((doneCount / totalNodes) * 100) : 0;
}

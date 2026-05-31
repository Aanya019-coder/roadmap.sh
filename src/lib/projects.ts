import { supabase, isSupabaseConfigured } from './supabase';

export async function startProject(projectId: string) {
  if (!isSupabaseConfigured()) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return supabase.from('user_projects')
    .upsert({ user_id: user.id, project_id: projectId, status: 'started' });
}

export async function submitSolution(projectId: string, githubUrl: string) {
  if (!isSupabaseConfigured()) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  await supabase.from('user_projects')
    .upsert({ user_id: user.id, project_id: projectId, status: 'submitted' });
  return supabase.from('project_solutions')
    .insert({ project_id: projectId, user_id: user.id, github_url: githubUrl });
}

export async function upvoteSolution(solutionId: string) {
  if (!isSupabaseConfigured()) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return supabase.from('solution_votes')
    .insert({ solution_id: solutionId, user_id: user.id });
}

export async function getSolutions(projectId: string) {
  if (!isSupabaseConfigured()) return [];
  const { data } = await supabase.from('project_solutions')
    .select('*')
    .eq('project_id', projectId)
    .order('upvotes', { ascending: false });
  return data || [];
}

export async function getUserProjectStatus(projectId: string) {
  if (!isSupabaseConfigured()) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('user_projects')
    .select('status')
    .eq('user_id', user.id)
    .eq('project_id', projectId)
    .single();
  return data?.status || null;
}

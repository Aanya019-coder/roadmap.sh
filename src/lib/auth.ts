import { supabase, isSupabaseConfigured } from './supabase';

export const signUp = async (email: string, password: string, name: string) => {
  if (!isSupabaseConfigured()) {
    return { error: { message: 'Supabase not configured. Please add your credentials to .env' } };
  }
  return supabase.auth.signUp({ 
    email, 
    password, 
    options: { data: { full_name: name } } 
  });
};

export const signIn = async (email: string, password: string) => {
  if (!isSupabaseConfigured()) {
    return { error: { message: 'Supabase not configured. Please add your credentials to .env' } };
  }
  return supabase.auth.signInWithPassword({ email, password });
};

export const signInWithGitHub = async () => {
  if (!isSupabaseConfigured()) {
    alert('Supabase not configured. Please add your credentials to .env');
    return;
  }
  return supabase.auth.signInWithOAuth({ 
    provider: 'github',
    options: { redirectTo: `${window.location.origin}/account` }
  });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

export const getSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const getUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

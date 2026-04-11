// Central API fetch wrapper — all requests go through here
const BACKEND_URL = import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:5000';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error?: string;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<ApiResponse<T>> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BACKEND_URL}${path}`, {
    credentials: 'include',
    ...fetchOptions,
    headers,
  });

  const json = await res.json().catch(() => ({ success: false, error: 'Invalid response' }));

  if (!res.ok) {
    throw new ApiError(json.error || 'Request failed', res.status, json.code);
  }

  return json;
}

// ─── Typed API helpers ─────────────────────────────────────────────────────

export const api = {
  // Roadmaps
  getRoadmaps: () => apiFetch('/api/roadmaps'),
  getRoadmap: (slug: string) => apiFetch(`/api/roadmaps/${slug}`),
  getRoadmapProjects: (slug: string) => apiFetch(`/api/roadmaps/${slug}/projects`),
  createCustomRoadmap: (data: any, token: string) =>
    apiFetch('/api/roadmaps/custom', { method: 'POST', body: JSON.stringify(data), token }),
  getMyCustomRoadmaps: (token: string) => apiFetch('/api/roadmaps/custom/mine', { token }),
  updateCustomRoadmap: (id: string, data: any, token: string) =>
    apiFetch(`/api/roadmaps/custom/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
  deleteCustomRoadmap: (id: string, token: string) =>
    apiFetch(`/api/roadmaps/custom/${id}`, { method: 'DELETE', token }),

  // Progress
  updateProgress: (data: { roadmap_id: string; roadmap_type: string; node_id: string; status: string }, token: string) =>
    apiFetch('/api/progress', { method: 'POST', body: JSON.stringify(data), token }),
  getRoadmapProgress: (roadmapId: string, token: string) =>
    apiFetch(`/api/progress/${roadmapId}`, { token }),
  getProgressSummary: (token: string) => apiFetch('/api/progress/summary', { token }),
  resetNode: (roadmapId: string, nodeId: string, token: string) =>
    apiFetch(`/api/progress/${roadmapId}/${nodeId}`, { method: 'DELETE', token }),

  // Onboarding
  saveOnboarding: (answers: any, token: string) =>
    apiFetch('/api/onboarding/save', { method: 'POST', body: JSON.stringify(answers), token }),
  generateRoadmap: (answers: any, token: string) =>
    apiFetch('/api/onboarding/generate', { method: 'POST', body: JSON.stringify(answers), token }),
  regenerateRoadmap: (answers: any, token: string) =>
    apiFetch('/api/onboarding/regenerate', { method: 'POST', body: JSON.stringify(answers), token }),
  getOnboardingAnswers: (token: string) => apiFetch('/api/onboarding/answers', { token }),
  getPersonalizedRoadmap: (token: string) => apiFetch('/api/onboarding/roadmap', { token }),

  // Users
  getMe: (token: string) => apiFetch('/api/users/me', { token }),
  updateMe: (data: any, token: string) =>
    apiFetch('/api/users/me', { method: 'PUT', body: JSON.stringify(data), token }),
  getUserByUsername: (username: string) => apiFetch(`/api/users/${username}`),

  // AI
  getAiLibrary: (token: string, type?: string) =>
    apiFetch(`/api/ai/library${type ? `?type=${type}` : ''}`, { token }),
  getAiLibraryItem: (id: string, token: string) => apiFetch(`/api/ai/library/${id}`, { token }),
  generateAiContent: (data: { type: string; topic: string; prompt?: string }, token: string) =>
    apiFetch('/api/ai/generate', { method: 'POST', body: JSON.stringify(data), token }),
  getChats: (token: string) => apiFetch('/api/ai/chats', { token }),
  getChat: (id: string, token: string) => apiFetch(`/api/ai/chat/${id}`, { token }),

  // Teams
  getMyTeams: (token: string) => apiFetch('/api/teams/me/all', { token }),
  getTeam: (slug: string, token: string) => apiFetch(`/api/teams/${slug}`, { token }),
  createTeam: (data: { name: string; description?: string }, token: string) =>
    apiFetch('/api/teams', { method: 'POST', body: JSON.stringify(data), token }),
  getTeamInsights: (slug: string, token: string) => apiFetch(`/api/teams/${slug}/insights`, { token }),
  inviteToTeam: (slug: string, email: string, token: string) =>
    apiFetch(`/api/teams/${slug}/invite`, { method: 'POST', body: JSON.stringify({ email }), token }),
  joinTeam: (slug: string, inviteToken: string, token: string) =>
    apiFetch(`/api/teams/${slug}/join/${inviteToken}`, { method: 'POST', token }),
  deleteTeam: (slug: string, token: string) =>
    apiFetch(`/api/teams/${slug}`, { method: 'DELETE', token }),

  // Payments
  createCheckout: (token: string) =>
    apiFetch('/api/payments/create-checkout-session', { method: 'POST', token }),
  getSubscription: (token: string) => apiFetch('/api/payments/subscription', { token }),

  // Email
  subscribe: (email: string) =>
    apiFetch('/api/email/subscribe', { method: 'POST', body: JSON.stringify({ email }) }),
  submitFeedback: (data: { message: string; page_url?: string }) =>
    apiFetch('/api/email/feedback', { method: 'POST', body: JSON.stringify(data) }),
};

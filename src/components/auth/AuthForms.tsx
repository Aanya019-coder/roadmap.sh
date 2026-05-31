import React, { useState } from 'react';
import { signUp, signIn, signInWithGitHub } from '../../lib/auth';

interface AuthFormsProps {
  initialMode?: 'login' | 'signup';
}

export default function AuthForms({ initialMode = 'login' }: AuthFormsProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const res = await signUp(email, password, name);
        if (res?.error) {
          setError(res.error.message);
        } else {
          setSuccess('Account created! Please check your email for verification.');
        }
      } else {
        const res = await signIn(email, password);
        if (res?.error) {
          setError(res.error.message);
        } else {
          setSuccess('Successfully logged in! Redirecting...');
          setTimeout(() => {
            window.location.href = '/roadmaps';
          }, 1000);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setError(null);
    try {
      await signInWithGitHub();
    } catch (err: any) {
      setError(err.message || 'GitHub OAuth failed.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-bg-secondary/70 backdrop-blur-md border border-border-default rounded-xl p-8 shadow-2xl">
      {/* Tabs */}
      <div className="flex border-b border-border-default mb-6">
        <button
          onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
          className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
            mode === 'login' ? 'text-white border-b-2 border-accent-yellow' : 'text-text-secondary hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => { setMode('signup'); setError(null); setSuccess(null); }}
          className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
            mode === 'signup' ? 'text-white border-b-2 border-accent-yellow' : 'text-text-secondary hover:text-white'
          }`}
        >
          Create Account
        </button>
      </div>

      <h2 className="text-xl font-bold text-white mb-2 text-center">
        {mode === 'login' ? 'Welcome back' : 'Join roadmap.sh'}
      </h2>
      <p className="text-xs text-text-secondary text-center mb-6">
        {mode === 'login' ? 'Track your progress and projects' : 'Create a free account to unlock progress tracking'}
      </p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-md p-3 mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-md p-3 mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-bg-tertiary/50 border border-border-default rounded-md px-3.5 py-2 text-sm text-white focus:outline-none focus:border-border-hover transition-colors"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-bg-tertiary/50 border border-border-default rounded-md px-3.5 py-2 text-sm text-white focus:outline-none focus:border-border-hover transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-bg-tertiary/50 border border-border-default rounded-md px-3.5 py-2 text-sm text-white focus:outline-none focus:border-border-hover transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent-yellow text-gray-900 font-semibold py-2 rounded-md hover:bg-yellow-300 transition-colors text-sm disabled:opacity-50"
        >
          {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <span className="flex-1 h-[1px] bg-border-default" />
        <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">or</span>
        <span className="flex-1 h-[1px] bg-border-default" />
      </div>

      {/* GitHub Auth */}
      <button
        onClick={handleGitHubLogin}
        className="w-full flex items-center justify-center gap-2 border border-border-default bg-bg-tertiary/30 text-white hover:bg-bg-tertiary/60 font-medium py-2 rounded-md transition-colors text-sm"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        Continue with GitHub
      </button>
    </div>
  );
}

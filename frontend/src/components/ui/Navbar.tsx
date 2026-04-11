import React, { useEffect, useState } from 'react';
import { supabase, getUser, signOut } from '../../lib/supabase';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    getUser().then(u => {
      setUser(u);
      setLoading(false);
    });

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav style={{ 
      background: scrolled ? 'rgba(5, 5, 5, 0.8)' : 'transparent', 
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: 72,
      display: 'flex',
      alignItems: 'center',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{ 
            width: 34, 
            height: 34, 
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
            borderRadius: 10, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
          }}>
            <span style={{ color: '#fff', fontWeight: 950, fontSize: '1.1rem' }}>R</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.35rem', color: 'var(--color-text-primary)', letterSpacing: '-0.04em' }}>roadmap.sh</span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <div style={{ display: 'none', gap: '1.75rem', alignItems: 'center' }} className="md:flex">
             <a href="/roadmaps" style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}>Roadmaps</a>
             <a href="/guides" style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}>Guides</a>
             <a href="/ai" style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}>AI Tutor</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            {loading ? (
              <div style={{ width: 40, height: 40, borderRadius: '50%' }} className="skeleton" />
            ) : user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <a href="/dashboard" className="btn btn-primary" style={{ padding: '0.5rem 1.125rem', fontSize: '0.875rem', borderRadius: 10 }}>Dashboard</a>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => signOut()}>
                   <span style={{ fontSize: '0.75rem' }}>🚪</span>
                </div>
              </div>
            ) : (
              <>
                <a href="/login" className="btn btn-ghost" style={{ textDecoration: 'none', fontSize: '0.9375rem' }}>Login</a>
                <a href="/signup" className="btn btn-primary" style={{ textDecoration: 'none', fontSize: '0.9375rem', padding: '0.55rem 1.35rem', borderRadius: 10 }}>Get Started</a>
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .md\\:flex { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

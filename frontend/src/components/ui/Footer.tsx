import React from 'react';

export default function Footer() {
  return (
    <footer style={{ 
      background: 'var(--color-bg-secondary)', 
      borderTop: '1px solid var(--color-border)',
      padding: '4rem 0 2rem'
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
          <div>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
              <div style={{ width: 28, height: 28, background: 'var(--color-accent)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: '0.875rem' }}>R</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--color-text-primary)' }}>roadmap.sh</span>
            </a>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: 240 }}>
              Community-driven developer roadmaps, guides and other educational content to help developers grow in their careers.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--color-text-primary)', fontSize: '0.9375rem', marginBottom: '1.25rem' }}>Roadmaps</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><a href="/roadmaps/frontend" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>Frontend</a></li>
              <li><a href="/roadmaps/backend" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>Backend</a></li>
              <li><a href="/roadmaps/devops" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>DevOps</a></li>
              <li><a href="/roadmaps/fullstack" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>Full Stack</a></li>
            </ul>
          </div>

          <div>
             <h4 style={{ color: 'var(--color-text-primary)', fontSize: '0.9375rem', marginBottom: '1.25rem' }}>Features</h4>
             <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
               <li><a href="/ai" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>AI Tutor</a></li>
               <li><a href="/onboarding" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>Personalized Roadmaps</a></li>
               <li><a href="/premium" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>Plan & Pricing</a></li>
             </ul>
          </div>

          <div>
             <h4 style={{ color: 'var(--color-text-primary)', fontSize: '0.9375rem', marginBottom: '1.25rem' }}>Company</h4>
             <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
               <li><a href="/about" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>About us</a></li>
               <li><a href="/contact" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>Contact</a></li>
               <li><a href="/terms" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>Terms</a></li>
               <li><a href="/privacy" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>Privacy</a></li>
             </ul>
          </div>
        </div>

        <div style={{ 
          borderTop: '1px solid var(--color-border)', 
          paddingTop: '2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
            © {new Date().getFullYear()} roadmap.sh. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
             <a href="https://github.com" style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>GitHub</a>
             <a href="https://twitter.com" style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>Twitter</a>
             <a href="https://youtube.com" style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

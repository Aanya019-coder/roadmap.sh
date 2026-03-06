import React, { useState } from 'react';

/** Footer with 4 columns matching roadmap.sh structure. */
const Footer: React.FC = () => {
    const columns = [
        {
            heading: 'Roadmaps',
            links: [
                { label: 'Frontend', href: '/roadmaps/frontend' },
                { label: 'Backend', href: '/roadmaps/backend' },
                { label: 'DevOps', href: '/roadmaps/devops' },
                { label: 'AI & Data Science', href: '/roadmaps/ai-data-scientist' },
                { label: 'Android', href: '/roadmaps/android' },
                { label: 'iOS', href: '/roadmaps/ios' },
                { label: 'React', href: '/roadmaps/react' },
                { label: 'Vue', href: '/roadmaps/vue' },
            ],
        },
        {
            heading: 'Best Practices',
            links: [
                { label: 'Backend Performance', href: '/best-practices/backend-performance' },
                { label: 'Frontend Performance', href: '/best-practices/frontend-performance' },
                { label: 'Code Review', href: '/best-practices/code-review' },
                { label: 'API Security', href: '/best-practices/api-security' },
                { label: 'AWS', href: '/best-practices/aws' },
            ],
        },
        {
            heading: 'Questions',
            links: [
                { label: 'JavaScript', href: '/questions/javascript' },
                { label: 'React', href: '/questions/react' },
                { label: 'Node.js', href: '/questions/nodejs' },
                { label: 'Python', href: '/questions/python' },
                { label: 'SQL', href: '/questions/sql' },
            ],
        },
        {
            heading: 'Company',
            links: [
                { label: 'About', href: '/about' },
                { label: 'Changelog', href: '/changelog' },
                { label: 'Get Started', href: '/get-started' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
            ],
        },
    ];

    return (
        <footer style={{
            borderTop: '1px solid var(--color-border)',
            background: 'var(--color-bg-secondary)',
            marginTop: 'auto',
        }}>
            <div className="container" style={{ padding: '4rem 1.5rem 2rem' }}>
                {/* Top: logo + columns grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr repeat(4, minmax(140px, 1fr))',
                    gap: '2rem',
                    marginBottom: '3rem',
                }}>
                    {/* Brand */}
                    <div>
                        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', textDecoration: 'none' }}>
                            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                                <rect width="28" height="28" rx="6" fill="var(--color-accent)" />
                                <path d="M7 8h14M7 14h10M7 20h7" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-primary)' }}>
                                roadmap<span style={{ color: 'var(--color-accent)' }}>.sh</span>
                            </span>
                        </a>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.6, maxWidth: 200 }}>
                            Community-driven learning roadmaps and best practices for developers.
                        </p>

                        {/* Newsletter */}
                        <div style={{ marginTop: '1.5rem', maxWidth: '240px' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Weekly Newsletter</p>
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
                                    const res = await fetch('http://localhost:5000/api/email/subscribe', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ email })
                                    });
                                    if (res.ok) alert('Subscribed!');
                                }}
                                style={{ display: 'flex', gap: '0.5rem' }}
                            >
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    required
                                    style={{
                                        flex: 1, padding: '0.5rem', fontSize: '0.8rem',
                                        background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)',
                                        borderRadius: '6px', color: 'var(--color-text-primary)', outline: 'none'
                                    }}
                                />
                                <button type="submit" style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Join</button>
                            </form>
                        </div>
                        {/* Social links */}
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                            {[
                                { label: 'GitHub', href: 'https://github.com', icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' },
                                { label: 'Twitter', href: 'https://twitter.com', icon: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' },
                                { label: 'Discord', href: 'https://discord.com', icon: 'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z' },
                            ].map(s => (
                                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                                    aria-label={s.label}
                                    style={{
                                        width: 34, height: 34, borderRadius: 'var(--radius-md)',
                                        background: 'var(--color-bg-elevated)',
                                        border: '1px solid var(--color-border)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--color-text-muted)',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-text-primary)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-hover)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; }}
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <path d={s.icon} />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Columns */}
                    {columns.map(col => (
                        <div key={col.heading}>
                            <p style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--color-text-primary)', marginBottom: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {col.heading}
                            </p>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {col.links.map(link => (
                                    <li key={link.href}>
                                        <a href={link.href} style={{
                                            fontSize: '0.8125rem', color: 'var(--color-text-muted)', textDecoration: 'none',
                                            transition: 'color 0.15s ease',
                                        }}
                                            onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--color-text-primary)'}
                                            onMouseLeave={e => (e.target as HTMLElement).style.color = 'var(--color-text-muted)'}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div style={{
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                        © {new Date().getFullYear()} roadmap.sh clone. Open source project.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <a href="https://github.com" target="_blank" style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
                            Star on GitHub ⭐
                        </a>
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 900px) {
          footer > .container > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 540px) {
          footer > .container > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </footer>
    );
};

export default Footer;

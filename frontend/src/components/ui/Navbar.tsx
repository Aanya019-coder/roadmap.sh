import React, { useState, useEffect } from 'react';
import SearchModal from './SearchModal';

/**
 * Sticky top Navbar with logo, center nav links, and right auth buttons.
 * Shows avatar dropdown when `isLoggedIn` is true.
 */
const Navbar: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const isLoggedIn = !!user;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/auth/me', {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (err) {
                console.error('Failed to fetch user', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            setUser(null);
            window.location.href = '/login';
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    const navLinks = [
        { label: 'Roadmaps', href: '/roadmaps' },
        { label: 'Guides', href: '/guides' },
        { label: 'Best Practices', href: '/best-practices/api-security' },
        { label: 'Questions', href: '/questions/javascript' },
        { label: 'Build Roadmap', href: '/roadmaps/create' },
        { label: 'AI Tutor', href: '/ai' },
        { label: '🚀 Pro Access', href: '/premium', highlight: true },
    ];

    return (
        <nav
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 40,
                borderBottom: '1px solid var(--color-border)',
                backdropFilter: 'blur(12px)',
                background: 'rgba(10,10,10,0.85)',
            }}
        >
            <div className="container" style={{ display: 'flex', alignItems: 'center', height: '60px', gap: '1.5rem' }}>

                {/* Logo */}
                <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, textDecoration: 'none' }}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <rect width="28" height="28" rx="6" fill="var(--color-accent)" />
                        <path d="M7 8h14M7 14h10M7 20h7" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    <span style={{ fontWeight: 700, fontSize: '1.125rem', letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
                        roadmap<span style={{ color: 'var(--color-accent)' }}>.sh</span>
                    </span>
                </a>

                {/* Center Nav Links – desktop */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                    className="hidden-mobile">
                    {navLinks.map(link => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="nav-link"
                            style={link.highlight ? {
                                background: 'rgba(22,163,74,0.1)',
                                color: '#16a34a',
                                border: '1px solid rgba(22,163,74,0.2)',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '6px'
                            } : {}}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Right Actions */}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                        onClick={() => setSearchOpen(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            background: '#1c1c1c', border: '1px solid #262626',
                            color: '#a3a3a3', padding: '0.4rem 0.75rem', borderRadius: '8px',
                            cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem'
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        <span className="hidden-mobile">Search</span>
                        <span className="hidden-mobile" style={{ background: '#262626', padding: '0.1rem 0.3rem', borderRadius: '4px', fontSize: '0.7rem' }}>⌘K</span>
                    </button>

                    <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                        {isLoggedIn ? (
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-primary)',
                                        fontFamily: 'inherit',
                                    }}
                                >
                                    <div style={{
                                        width: 32, height: 32, borderRadius: '50%',
                                        background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.875rem', fontWeight: 600, color: '#fff',
                                    }}>
                                        {user.name[0]}
                                    </div>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </button>
                                {dropdownOpen && (
                                    <div style={{
                                        position: 'absolute', top: '2.5rem', right: 0, minWidth: '180px',
                                        background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
                                        overflow: 'hidden', zIndex: 50,
                                    }}>
                                        {[
                                            { label: 'Profile', href: `/${user.githubUsername || user._id}` },
                                            { label: 'My Roadmaps', href: '/settings' },
                                            { label: 'Settings', href: '/settings' },
                                        ].map(item => (
                                            <a key={item.href} href={item.href} style={{
                                                display: 'block', padding: '0.6rem 1rem',
                                                fontSize: '0.875rem', color: 'var(--color-text-secondary)',
                                                transition: 'all 0.15s ease',
                                            }}
                                                onMouseEnter={e => { (e.target as HTMLElement).style.background = 'var(--color-bg-elevated)'; (e.target as HTMLElement).style.color = 'var(--color-text-primary)' }}
                                                onMouseLeave={e => { (e.target as HTMLElement).style.background = ''; (e.target as HTMLElement).style.color = 'var(--color-text-secondary)' }}>
                                                {item.label}
                                            </a>
                                        ))}
                                        <div style={{ borderTop: '1px solid var(--color-border)' }}>
                                            <button
                                                onClick={handleLogout}
                                                style={{
                                                    display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.6rem 1rem', fontSize: '0.875rem', color: '#ef4444', cursor: 'pointer'
                                                }}
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <a href="/login" className="btn btn-ghost btn-sm">Login</a>
                                <a href="/signup" className="btn btn-primary btn-sm">Sign Up</a>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-primary)', padding: '0.25rem' }}
                    className="show-mobile"
                    aria-label="Toggle menu"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {mobileOpen
                            ? <path d="M18 6 6 18M6 6l12 12" />
                            : <path d="M3 12h18M3 6h18M3 18h18" />
                        }
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div style={{
                    borderTop: '1px solid var(--color-border)',
                    padding: '1rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                }}>
                    {navLinks.map(link => (
                        <a key={link.href} href={link.href} className="nav-link" style={{ display: 'block', padding: '0.625rem 0.75rem' }}>
                            {link.label}
                        </a>
                    ))}
                    <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                        <a href="/login" className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Login</a>
                        <a href="/signup" className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Sign Up</a>
                    </div>
                </div>
            )}

            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

            <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
        </nav>
    );
};

export default Navbar;

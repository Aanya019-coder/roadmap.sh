import React, { useState, useEffect, useRef } from 'react';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            setQuery('');
            setResults([]);
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        let active = true;
        if (!query) {
            setResults([]);
            return;
        }

        const search = async () => {
            // If Pagefind is available, use it (for full production static search)
            if ((window as any).pagefind) {
                const searchRes = await (window as any).pagefind.search(query);
                const data = await Promise.all(searchRes.results.map((r: any) => r.data()));
                if (active) setResults(data);
            } else {
                // Fallback or development mock
                const allItems = [
                    { url: '/roadmaps/frontend', meta: { title: 'Frontend Developer Roadmap', type: 'Roadmaps' }, excerpt: 'Step by step guide to becoming a modern frontend developer in 2024.' },
                    { url: '/guides/api-security', meta: { title: 'API Security Best Practices', type: 'Guides' }, excerpt: 'Learn how to secure your APIs against common vulnerabilities like SQL injection, XSS, and broken authentication.' },
                    { url: '/guides/react-hooks', meta: { title: 'React Hooks Explained', type: 'Guides' }, excerpt: 'A deep dive into React hooks, covering useState, useEffect, and custom hooks.' },
                    { url: '/best-practices/api-security', meta: { title: 'API Security Best Practices', type: 'Best Practices' }, excerpt: 'Interactive best practices checklist for securing your backend APIs.' },
                    { url: '/questions/javascript', meta: { title: 'JavaScript Quiz', type: 'Questions' }, excerpt: 'Test your knowledge on javascript with our comprehensive quiz.' },
                    { url: '/roadmaps/backend', meta: { title: 'Backend Developer Roadmap', type: 'Roadmaps' }, excerpt: 'Step by step guide to becoming a backend developer in 2024.' }
                ];

                const filtered = allItems.filter(item =>
                    item.meta.title.toLowerCase().includes(query.toLowerCase()) ||
                    item.excerpt.toLowerCase().includes(query.toLowerCase())
                );

                if (active) setResults(filtered);
            }
        };

        // Simple debounce
        const timeoutId = setTimeout(search, 150);
        return () => {
            active = false;
            clearTimeout(timeoutId);
        };
    }, [query]);

    // Group by type
    const grouped = results.reduce((acc, curr) => {
        const type = curr.meta.type || 'Other';
        if (!acc[type]) acc[type] = [];
        acc[type].push(curr);
        return acc;
    }, {} as Record<string, any[]>);

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 100,
                background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '10vh'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#0a0a0a', width: '100%', maxWidth: '640px',
                    borderRadius: '16px', border: '1px solid #262626',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
                    overflow: 'hidden', display: 'flex', flexDirection: 'column',
                    maxHeight: '80vh', margin: '0 1rem'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ padding: '1.25rem', borderBottom: '1px solid #262626', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search roadmaps, guides, questions..."
                        style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1.25rem', outline: 'none', fontFamily: 'inherit' }}
                    />
                    <button
                        onClick={onClose}
                        style={{ background: '#1c1c1c', border: '1px solid #262626', color: '#a3a3a3', cursor: 'pointer', padding: '0.4rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}
                    >
                        ESC
                    </button>
                </div>

                <div style={{ overflowY: 'auto', flex: 1, padding: query ? '1.5rem' : 0 }}>
                    {query && results.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#737373' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
                            <p>No results found for "{query}"</p>
                        </div>
                    ) : (
                        Object.entries(grouped).map(([type, items]) => (
                            <div key={type} style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#737373', margin: '0 0 1rem', paddingLeft: '0.25rem' }}>
                                    {type}
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {items.map((item, i) => (
                                        <a
                                            key={i}
                                            href={item.url}
                                            style={{
                                                display: 'block', padding: '1rem',
                                                background: '#161616', borderRadius: '12px',
                                                textDecoration: 'none', border: '1px solid #262626',
                                                transition: 'all 0.15s ease'
                                            }}
                                            onMouseEnter={e => { (e.currentTarget.style as any).background = '#1c1c1c'; (e.currentTarget.style as any).borderColor = '#404040'; }}
                                            onMouseLeave={e => { (e.currentTarget.style as any).background = '#161616'; (e.currentTarget.style as any).borderColor = '#262626'; }}
                                        >
                                            <h4 style={{ margin: '0 0 0.375rem', color: '#fff', fontSize: '1.0625rem', fontWeight: 600 }}>{item.meta.title}</h4>
                                            <p style={{ margin: 0, color: '#a3a3a3', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.excerpt}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

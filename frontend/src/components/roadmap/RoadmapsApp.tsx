import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../lib/api';
import RoadmapCard from '../roadmap/RoadmapCard';

type Tab = 'all' | 'role' | 'skill' | 'best-practice' | 'project';

export default function RoadmapsApp() {
    const [roadmaps, setRoadmaps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        api.getRoadmaps().then(resp => {
            if (resp.success) setRoadmaps(resp.data);
            setLoading(false);
        });
    }, []);

    const filtered = useMemo(() => {
        let list = activeTab === 'all' ? roadmaps : roadmaps.filter(r => r.category === activeTab);
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(r =>
                r.title.toLowerCase().includes(q) ||
                r.description?.toLowerCase().includes(q)
            );
        }
        return list;
    }, [roadmaps, activeTab, search]);

    const tabs: { id: Tab; label: string; count: number }[] = [
        { id: 'all', label: 'All', count: roadmaps.length },
        { id: 'role', label: 'Role-based', count: roadmaps.filter(r => r.category === 'role').length },
        { id: 'skill', label: 'Skill-based', count: roadmaps.filter(r => r.category === 'skill').length },
        { id: 'best-practice', label: 'Best Practices', count: roadmaps.filter(r => r.category === 'best-practice').length },
        { id: 'project', label: 'Project Ideas', count: roadmaps.filter(r => r.category === 'project').length },
    ];

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ position: 'relative', maxWidth: 480 }}>
                    <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2"
                        style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                    >
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="search"
                        placeholder="Search roadmaps…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input"
                        style={{ paddingLeft: '2.5rem' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            style={{
                                padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid var(--color-border)',
                                background: activeTab === tab.id ? 'var(--color-accent)' : 'var(--color-bg-card)',
                                color: activeTab === tab.id ? '#fff' : 'var(--color-text-secondary)',
                                cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s'
                            }}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                            <span style={{
                                marginLeft: '0.5rem', opacity: 0.6, fontSize: '0.75rem'
                            }}>({tab.count})</span>
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="grid-roadmaps">
                    {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 160, borderRadius: 16 }} />)}
                </div>
            ) : (
                <>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                        {filtered.length === 0 ? 'No roadmaps found.' : `Showing ${filtered.length} roadmap${filtered.length === 1 ? '' : 's'}`}
                        {search && ` for "${search}"`}
                    </p>

                    <div className="grid-roadmaps">
                        {filtered.map(r => (
                            <RoadmapCard key={r.slug} roadmap={r} />
                        ))}
                    </div>

                    {!loading && filtered.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                            <p>No matches found.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

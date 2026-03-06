import React, { useState, useMemo } from 'react';
import { roadmaps } from '../../data/roadmaps/roadmaps';
import type { Roadmap } from '../../data/roadmaps/roadmaps';
import RoadmapCard from '../roadmap/RoadmapCard';

type Tab = 'all' | 'role' | 'skill' | 'best-practice' | 'project';

const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: roadmaps.length },
    { id: 'role', label: 'Role-based', count: roadmaps.filter(r => r.category === 'role').length },
    { id: 'skill', label: 'Skill-based', count: roadmaps.filter(r => r.category === 'skill').length },
    { id: 'best-practice', label: 'Best Practices', count: roadmaps.filter(r => r.category === 'best-practice').length },
    { id: 'project', label: 'Project Ideas', count: roadmaps.filter(r => r.category === 'project').length },
];

/**
 * Roadmaps listing with filter tabs and live search.
 */
const RoadmapsApp: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('all');
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        let list: Roadmap[] = activeTab === 'all' ? roadmaps : roadmaps.filter(r => r.category === activeTab);
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(r =>
                r.title.toLowerCase().includes(q) ||
                r.description.toLowerCase().includes(q)
            );
        }
        return list;
    }, [activeTab, search]);

    return (
        <div>
            {/* Search + Filter bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {/* Search input */}
                <div style={{ position: 'relative', maxWidth: 480 }}>
                    <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2"
                        style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                    >
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        id="roadmaps-search"
                        type="search"
                        placeholder="Search roadmaps…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input"
                        style={{ paddingLeft: '2.5rem' }}
                        aria-label="Search roadmaps"
                    />
                </div>

                {/* Filter tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            id={`tab-${tab.id}`}
                            className={`filter-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                            <span style={{
                                marginLeft: '0.4rem',
                                fontSize: '0.7rem',
                                padding: '0.1rem 0.4rem',
                                borderRadius: '999px',
                                background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'var(--color-bg-elevated)',
                                color: activeTab === tab.id ? '#fff' : 'var(--color-text-muted)',
                            }}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Results count */}
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                {filtered.length === 0
                    ? 'No roadmaps found.'
                    : `Showing ${filtered.length} roadmap${filtered.length === 1 ? '' : 's'}`
                }
                {search && ` for "${search}"`}
            </p>

            {/* Grid */}
            {filtered.length > 0 ? (
                <div className="grid-roadmaps">
                    {filtered.map(r => (
                        <RoadmapCard key={r.id} roadmap={r} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                    <p style={{ fontSize: '1rem' }}>No roadmaps match your search. Try a different keyword.</p>
                    <button
                        onClick={() => { setSearch(''); setActiveTab('all'); }}
                        className="btn btn-ghost btn-sm"
                        style={{ marginTop: '1rem' }}
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default RoadmapsApp;

import React from 'react';
import type { Roadmap } from '../../data/roadmaps/roadmaps';

interface RoadmapCardProps {
    roadmap: Roadmap;
}

/**
 * Card displaying a roadmap with icon, title, description, badges, and contributor count.
 */
const RoadmapCard: React.FC<RoadmapCardProps> = ({ roadmap }) => {
    return (
        <a href={`/roadmaps/${roadmap.id}`} className="roadmap-card" style={{ textDecoration: 'none' }}>
            {/* Status badges */}
            {(roadmap.isNew || roadmap.isUpdated) && (
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    {roadmap.isNew && <span className="badge badge-green">New</span>}
                    {roadmap.isUpdated && <span className="badge badge-yellow">Updated</span>}
                </div>
            )}

            {/* Icon + Title */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                <div style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-md)',
                    background: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem', flexShrink: 0,
                }}>
                    {roadmap.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        lineHeight: 1.3,
                        marginBottom: '0.375rem',
                    }}>
                        {roadmap.title}
                    </h3>
                    <p style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.55,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}>
                        {roadmap.description}
                    </p>
                </div>
            </div>

            {/* Footer: contributor count */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--color-border)',
                marginTop: '0.5rem',
            }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {roadmap.contributors.toLocaleString()} contributors
                </span>
                <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-accent)' }}>
                    View
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </span>
            </div>
        </a>
    );
};

export default RoadmapCard;

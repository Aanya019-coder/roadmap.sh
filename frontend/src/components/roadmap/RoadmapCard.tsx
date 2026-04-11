import React from 'react';

interface Roadmap {
  slug: string;
  title: string;
  icon: string;
  description?: string;
  category: string;
  topic_count?: number;
  estimated_weeks?: number;
}

export default function RoadmapCard({ roadmap }: { roadmap: Roadmap }) {
  const isRole = roadmap.category === 'role';
  const badgeClass = isRole ? 'badge-blue' : roadmap.category === 'skill' ? 'badge-yellow' : 'badge-gray';

  return (
    <a href={`/roadmaps/${roadmap.slug}`} className="roadmap-card" style={{ textDecoration: 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{roadmap.icon}</div>
        <span className={`badge ${badgeClass}`}>{roadmap.category}</span>
      </div>
      <div>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.375rem' }}>{roadmap.title}</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {roadmap.description}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
          <span>📚</span>
          <span>{roadmap.topic_count || 0} topics</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
          <span>⏱️</span>
          <span>~{roadmap.estimated_weeks || 0}w</span>
        </div>
      </div>
    </a>
  );
}

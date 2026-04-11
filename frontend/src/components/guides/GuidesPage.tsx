import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api } from '../../lib/api';

interface Guide {
  slug: string;
  title: string;
  description: string;
  author: string;
  type: 'textual' | 'video' | 'question';
  tags: string[];
  reading_time_minutes: number;
}

function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Stubbed for now, or fetch from backend if I implement GET /api/guides
    const mockGuides: Guide[] = [
      { slug: 'absolute-beginner', title: 'Absolute Beginner Guide', description: 'Start here if you have never written a line of code.', author: 'roadmap.sh', type: 'textual', tags: ['Beginner', 'Basics'], reading_time_minutes: 5 },
      { slug: 'web-development', title: 'Web Development Basics', description: 'Learn the core pillars of the web: HTML, CSS, and JS.', author: 'Kamran Ahmed', type: 'textual', tags: ['Frontend', 'Web'], reading_time_minutes: 12 },
      { slug: 'system-design', title: 'System Design for Beginners', description: 'How to design scalable systems from scratch.', author: 'roadmap.sh', type: 'video', tags: ['Backend', 'Architecture'], reading_time_minutes: 20 },
      { slug: 'asynchronous-javascript', title: 'Advanced JS: Async/Await', description: 'Master the event loop and asynchronous patterns.', author: 'John Doe', type: 'textual', tags: ['JavaScript', 'Advanced'], reading_time_minutes: 8 },
    ];
    setGuides(mockGuides);
    setLoading(false);
  }, []);

  const filtered = activeTab === 'all' ? guides : guides.filter(g => g.tags.some(t => t.toLowerCase() === activeTab.toLowerCase()));

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Learning Guides</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem', maxWidth: 600 }}>
          Deep-dive articles, videos, and interactive questions to help you master specific skills.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {['All', 'Beginner', 'Frontend', 'Backend', 'Architecture', 'JavaScript'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            style={{
              padding: '0.5rem 1.25rem', borderRadius: 999, border: '1px solid var(--color-border)',
              background: activeTab === tab.toLowerCase() ? 'var(--color-accent)' : 'var(--color-bg-card)',
              color: activeTab === tab.toLowerCase() ? '#fff' : 'var(--color-text-secondary)',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
         <div className="grid-roadmaps">
           {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 200, borderRadius: 16 }} />)}
         </div>
      ) : (
        <div className="grid-roadmaps">
          {filtered.map(guide => (
            <a key={guide.slug} href={`/guides/${guide.slug}`} className="roadmap-card" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge badge-gray" style={{ textTransform: 'capitalize' }}>{guide.type}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{guide.reading_time_minutes} min read</span>
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>{guide.title}</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, flex: 1 }}>{guide.description}</p>
              <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {guide.tags.map(tag => <span key={tag} className="badge badge-blue" style={{ fontSize: '0.65rem' }}>#{tag}</span>)}
              </div>
              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                By {guide.author}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function mountGuidesPage(el: HTMLElement) {
  const root = createRoot(el);
  root.render(<GuidesPage />);
}

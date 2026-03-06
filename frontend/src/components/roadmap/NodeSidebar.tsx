import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { NodeStatus } from './RoadmapRenderer';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  TYPES                                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */

interface Resource {
    title: string;
    url: string;
    type: 'article' | 'video' | 'course' | 'book';
}

interface Project {
    title: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    description: string;
}

interface NodeContent {
    markdown: string;
    resources: Resource[];
    projects: Project[];
}

interface NodeSidebarProps {
    nodeId: string | null;
    nodeLabel: string | null;
    roadmapId: string;
    status: NodeStatus;
    onClose: () => void;
    onStatusChange: (nodeId: string, status: NodeStatus) => void;
    contentMap: Record<string, string>; // nodeId -> markdown string
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  CURATED RESOURCES                                                          */
/* ─────────────────────────────────────────────────────────────────────────── */

const resourceMap: Record<string, Resource[]> = {
    internet: [
        { title: 'How does the Internet work? — MDN', url: 'https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work', type: 'article' },
        { title: 'The Internet Explained — Vox', url: 'https://www.vox.com/2014/6/16/18076282/the-internet', type: 'article' },
        { title: 'Computer Networking — Khan Academy', url: 'https://www.khanacademy.org/computing/computers-and-internet/xcae6f4a7ff015e7d:the-internet', type: 'course' },
        { title: 'HTTP: The protocol every web developer must know', url: 'https://code.tutsplus.com/tutorials/http-the-protocol-every-web-developer-must-know-part-1--net-31177', type: 'article' },
    ],
    html: [
        { title: 'MDN HTML Learning Guide', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML', type: 'article' },
        { title: 'HTML Full Course — freeCodeCamp', url: 'https://www.youtube.com/watch?v=pQN-pnXPaVg', type: 'video' },
        { title: 'Structuring the Web with HTML — MDN', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML', type: 'article' },
    ],
    css: [
        { title: 'CSS Tricks — Flexbox Guide', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', type: 'article' },
        { title: 'CSS Tricks — Grid Guide', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/', type: 'article' },
        { title: 'Kevin Powell — CSS YouTube Channel', url: 'https://www.youtube.com/@KevinPowell', type: 'video' },
        { title: 'CSS for JavaScript Developers — Josh Comeau', url: 'https://css-for-js.dev/', type: 'course' },
    ],
    javascript: [
        { title: 'The Modern JavaScript Tutorial', url: 'https://javascript.info/', type: 'article' },
        { title: 'Eloquent JavaScript — Free Book', url: 'https://eloquentjavascript.net/', type: 'book' },
        { title: 'JavaScript30 — Wes Bos', url: 'https://javascript30.com/', type: 'course' },
        { title: 'You Don\'t Know JS — Book Series', url: 'https://github.com/getify/You-Dont-Know-JS', type: 'book' },
    ],
    react: [
        { title: 'React Official Documentation', url: 'https://react.dev', type: 'article' },
        { title: 'Full Stack Open — React', url: 'https://fullstackopen.com/en/part1', type: 'course' },
        { title: 'Scrimba — Learn React', url: 'https://scrimba.com/learn/learnreact', type: 'course' },
        { title: 'Build UI — React Patterns', url: 'https://buildui.com/', type: 'article' },
    ],
    typescript: [
        { title: 'TypeScript Handbook — Official', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', type: 'article' },
        { title: 'Total TypeScript — Matt Pocock', url: 'https://totaltypescript.com/', type: 'course' },
        { title: 'Execute Program — TypeScript', url: 'https://www.executeprogram.com/courses/typescript', type: 'course' },
    ],
    'version-control': [
        { title: 'Pro Git — Free Book', url: 'https://git-scm.com/book/en/v2', type: 'book' },
        { title: 'Learn Git Branching — Interactive', url: 'https://learngitbranching.js.org/', type: 'article' },
        { title: 'Git & GitHub Crash Course — freeCodeCamp', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk', type: 'video' },
    ],
};

const projectMap: Record<string, Project[]> = {
    html: [
        { title: 'Personal Portfolio Page', difficulty: 'Beginner', description: 'Build a static portfolio with sections for About, Skills, and Projects using only HTML.' },
        { title: 'Recipe Book', difficulty: 'Beginner', description: 'Create a multi-page recipe site using semantic HTML, forms, and proper heading structure.' },
        { title: 'Wikipedia-style Article', difficulty: 'Intermediate', description: 'Recreate a Wikipedia article page with a table of contents, infobox, and proper semantic markup.' },
    ],
    css: [
        { title: 'CSS Grid Dashboard', difficulty: 'Intermediate', description: 'Build a responsive admin dashboard layout using only CSS Grid — no frameworks.' },
        { title: 'Animated Landing Page', difficulty: 'Intermediate', description: 'Create a marketing landing page with CSS animations, hover effects, and smooth transitions.' },
        { title: 'Dark Mode UI Library', difficulty: 'Advanced', description: 'Build a set of reusable CSS component classes with both light and dark mode support using CSS variables.' },
    ],
    javascript: [
        { title: 'Todo App', difficulty: 'Beginner', description: 'Build a CRUD todo app using vanilla JS — add, complete, filter, and persist tasks to localStorage.' },
        { title: 'Weather App', difficulty: 'Intermediate', description: 'Fetch live weather data from an API, display forecasts with icons, and handle loading/error states.' },
        { title: 'Kanban Board', difficulty: 'Advanced', description: 'Build a Trello-like drag-and-drop kanban board from scratch using vanilla JS.' },
    ],
    react: [
        { title: 'GitHub Profile Viewer', difficulty: 'Beginner', description: 'Search GitHub users and display their profile info using the GitHub REST API and React hooks.' },
        { title: 'E-commerce Product Page', difficulty: 'Intermediate', description: 'Build a product page with image gallery, size selector, cart functionality, and animations.' },
        { title: 'Real-time Chat App', difficulty: 'Advanced', description: 'Build a chat interface with React, WebSockets, and optimistic UI updates.' },
    ],
};

const typeIcon: Record<string, string> = {
    article: '📄',
    video: '▶️',
    course: '🎓',
    book: '📚',
};

const difficultyColors: Record<string, string> = {
    Beginner: 'badge-green',
    Intermediate: 'badge-yellow',
    Advanced: 'badge-blue',
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  SIDEBAR COMPONENT                                                          */
/* ─────────────────────────────────────────────────────────────────────────── */

type Tab = 'overview' | 'resources' | 'projects';

/**
 * Slides in from the right when a roadmap node is clicked.
 * Shows Overview (markdown), Resources, and Projects tabs.
 */
const NodeSidebar: React.FC<NodeSidebarProps> = ({
    nodeId,
    nodeLabel,
    roadmapId,
    status,
    onClose,
    onStatusChange,
    contentMap,
}) => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const isOpen = Boolean(nodeId);

    // Reset tab when node changes
    useEffect(() => {
        if (nodeId) setActiveTab('overview');
    }, [nodeId]);

    const content = nodeId ? contentMap[nodeId] ?? null : null;
    const resources = nodeId ? (resourceMap[nodeId] ?? []) : [];
    const projects = nodeId ? (projectMap[nodeId] ?? []) : [];

    const statusOptions: { value: NodeStatus; label: string; color: string }[] = [
        { value: 'done', label: '✓ Done', color: '#16a34a' },
        { value: 'in-progress', label: '◐ In Progress', color: '#ca8a04' },
        { value: 'skipped', label: '↷ Skip', color: '#525252' },
        { value: 'default', label: '○ Reset', color: '#737373' },
    ];

    return (
        <>
            {/* Sidebar panel */}
            <aside
                style={{
                    position: 'fixed',
                    top: 0,
                    right: isOpen ? 0 : '-480px',
                    width: '100%',
                    maxWidth: '480px',
                    height: '100vh',
                    background: '#111111',
                    borderLeft: '1px solid #262626',
                    zIndex: 30,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isOpen ? '-8px 0 32px rgba(0,0,0,0.7)' : 'none',
                    overflowY: 'hidden',
                }}
                aria-label="Node detail panel"
            >
                {/* ── Header ── */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 1.25rem 1rem',
                    borderBottom: '1px solid #262626',
                    flexShrink: 0,
                    gap: '0.75rem',
                }}>
                    <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#fff', lineHeight: 1.3, flex: 1 }}>
                        {nodeLabel ?? 'Select a node'}
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Close sidebar"
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#737373', padding: '0.25rem', borderRadius: '6px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1c1c1c'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.color = '#737373'; }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* ── Status Buttons ── */}
                {nodeId && (
                    <div style={{
                        padding: '0.75rem 1.25rem',
                        borderBottom: '1px solid #1c1c1c',
                        display: 'flex',
                        gap: '0.5rem',
                        flexShrink: 0,
                        flexWrap: 'wrap',
                    }}>
                        {statusOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => onStatusChange(nodeId, opt.value)}
                                style={{
                                    padding: '0.3rem 0.75rem',
                                    borderRadius: '999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    fontFamily: 'inherit',
                                    cursor: 'pointer',
                                    border: `1px solid ${status === opt.value ? opt.color : '#262626'}`,
                                    background: status === opt.value ? `${opt.color}22` : 'transparent',
                                    color: status === opt.value ? opt.color : '#737373',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Tab Bar ── */}
                <div style={{
                    display: 'flex',
                    borderBottom: '1px solid #262626',
                    padding: '0 1.25rem',
                    flexShrink: 0,
                    gap: '0',
                }}>
                    {(['overview', 'resources', 'projects'] as Tab[]).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                fontSize: '0.8125rem',
                                fontWeight: activeTab === tab ? 600 : 400,
                                color: activeTab === tab ? '#fff' : '#737373',
                                padding: '0.75rem 1rem',
                                borderBottom: `2px solid ${activeTab === tab ? '#16a34a' : 'transparent'}`,
                                transition: 'all 0.15s ease',
                                textTransform: 'capitalize',
                                marginBottom: '-1px',
                            }}
                        >
                            {tab}
                            {tab === 'resources' && resources.length > 0 && (
                                <span style={{ marginLeft: '0.3rem', fontSize: '0.65rem', background: '#1c1c1c', border: '1px solid #262626', borderRadius: '999px', padding: '0 0.35rem', color: '#737373' }}>
                                    {resources.length}
                                </span>
                            )}
                            {tab === 'projects' && projects.length > 0 && (
                                <span style={{ marginLeft: '0.3rem', fontSize: '0.65rem', background: '#1c1c1c', border: '1px solid #262626', borderRadius: '999px', padding: '0 0.35rem', color: '#737373' }}>
                                    {projects.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ── Tab Content ── */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>

                    {/* OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div>
                            {content ? (
                                <div className="markdown-body">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {content}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', paddingTop: '3rem', color: '#525252' }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📄</div>
                                    <p style={{ fontSize: '0.9rem' }}>No content available for this node yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* RESOURCES */}
                    {activeTab === 'resources' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                            {resources.length > 0 ? resources.map((r, i) => (
                                <a
                                    key={i}
                                    href={r.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '0.75rem',
                                        padding: '0.875rem 1rem',
                                        background: '#161616',
                                        border: '1px solid #262626',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        transition: 'border-color 0.15s ease',
                                    }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#404040'}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#262626'}
                                >
                                    <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: '1px' }}>{typeIcon[r.type]}</span>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#e5e5e5', marginBottom: '0.2rem', lineHeight: 1.4 }}>
                                            {r.title}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: '#525252', textTransform: 'capitalize' }}>{r.type}</p>
                                    </div>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="2" style={{ flexShrink: 0, marginTop: '3px' }}>
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                                    </svg>
                                </a>
                            )) : (
                                <div style={{ textAlign: 'center', paddingTop: '3rem', color: '#525252' }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔗</div>
                                    <p>No resources curated for this node yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* PROJECTS */}
                    {activeTab === 'projects' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {projects.length > 0 ? projects.map((p, i) => (
                                <div
                                    key={i}
                                    style={{
                                        padding: '1rem',
                                        background: '#161616',
                                        border: '1px solid #262626',
                                        borderRadius: '8px',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>{p.title}</h3>
                                        <span className={`badge ${difficultyColors[p.difficulty]}`} style={{ flexShrink: 0 }}>{p.difficulty}</span>
                                    </div>
                                    <p style={{ fontSize: '0.8125rem', color: '#a3a3a3', lineHeight: 1.6 }}>{p.description}</p>
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', paddingTop: '3rem', color: '#525252' }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🛠️</div>
                                    <p>No projects available for this node yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                {nodeId && (
                    <div style={{
                        padding: '0.875rem 1.25rem',
                        borderTop: '1px solid #1c1c1c',
                        flexShrink: 0,
                        display: 'flex',
                        gap: '0.625rem',
                    }}>
                        <a
                            href={`/roadmaps/${roadmapId}/projects`}
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                                padding: '0.5rem',
                                background: '#161616',
                                border: '1px solid #262626',
                                borderRadius: '8px',
                                fontSize: '0.8125rem',
                                color: '#a3a3a3',
                                textDecoration: 'none',
                                fontFamily: 'inherit',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#404040'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#262626'; (e.currentTarget as HTMLElement).style.color = '#a3a3a3'; }}
                        >
                            🛠️ View Projects
                        </a>
                    </div>
                )}
            </aside>
        </>
    );
};

export default NodeSidebar;

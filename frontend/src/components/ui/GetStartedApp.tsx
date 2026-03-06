import React, { useState } from 'react';
import { roadmaps } from '../../data/roadmaps/roadmaps';
import RoadmapCard from '../roadmap/RoadmapCard';

const roles = [
    {
        id: 'frontend',
        icon: '🌐',
        title: 'Frontend Developer',
        desc: 'Build beautiful user interfaces and interactive web experiences.',
        roadmaps: ['frontend', 'react', 'vue', 'angular', 'typescript'],
    },
    {
        id: 'backend',
        icon: '⚙️',
        title: 'Backend Developer',
        desc: 'Build scalable APIs, services, and server-side applications.',
        roadmaps: ['backend', 'nodejs', 'python', 'docker', 'kubernetes'],
    },
    {
        id: 'devops',
        icon: '🚀',
        title: 'DevOps Engineer',
        desc: 'Automate deployment, manage infrastructure, and ensure reliability.',
        roadmaps: ['devops', 'docker', 'kubernetes', 'aws'],
    },
    {
        id: 'fullstack',
        icon: '💻',
        title: 'Full Stack Developer',
        desc: 'Master both frontend and backend to build complete products.',
        roadmaps: ['full-stack', 'react', 'nodejs', 'typescript'],
    },
    {
        id: 'mobile',
        icon: '📱',
        title: 'Mobile Developer',
        desc: 'Build native or cross-platform mobile apps for iOS and Android.',
        roadmaps: ['android', 'ios'],
    },
    {
        id: 'ai',
        icon: '🤖',
        title: 'AI / ML Engineer',
        desc: 'Work with machine learning models, data pipelines, and AI systems.',
        roadmaps: ['ai-data-scientist', 'python'],
    },
];

/**
 * Get Started onboarding — picks a role, shows suggested roadmaps.
 */
const GetStartedApp: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    const selected = roles.find(r => r.id === selectedRole);
    const suggestedRoadmaps = selected
        ? roadmaps.filter(rm => selected.roadmaps.includes(rm.id)).slice(0, 4)
        : [];

    return (
        <div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                Select the role you're most interested in and we'll suggest the best roadmaps to start with.
            </p>

            {/* Role picker grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1rem',
                marginBottom: '2.5rem',
            }}>
                {roles.map(role => (
                    <button
                        key={role.id}
                        className={`role-card ${selectedRole === role.id ? 'selected' : ''}`}
                        onClick={() => setSelectedRole(selectedRole === role.id ? null : role.id)}
                        style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'inherit' }}
                    >
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{role.icon}</div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{role.title}</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>{role.desc}</p>
                        {selectedRole === role.id && (
                            <div style={{ marginTop: '0.75rem' }}>
                                <span className="badge badge-green">✓ Selected</span>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Suggested roadmaps */}
            {selected && suggestedRoadmaps.length > 0 && (
                <div className="animate-slide-up">
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        marginBottom: '1.25rem',
                    }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                            Suggested for {selected.title}
                        </h2>
                        <span className="badge badge-green">{suggestedRoadmaps.length} roadmaps</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                        {suggestedRoadmaps.map(rm => (
                            <RoadmapCard key={rm.id} roadmap={rm} />
                        ))}
                    </div>
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <a href="/signup" className="btn btn-primary btn-lg">
                            Create Free Account to Track Progress →
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GetStartedApp;

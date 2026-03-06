import React, { useState, useEffect } from 'react';

const TeamsList = () => {
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/teams/me/all', { credentials: 'include' });
                if (res.ok) {
                    setTeams(await res.json());
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeams();
    }, []);

    if (loading) return <div style={{ color: '#737373' }}>Loading your teams...</div>;

    if (teams.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#111', borderRadius: '24px', border: '2px dashed #262626' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>👥</div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>No Teams Yet</h2>
                <p style={{ color: '#a3a3a3', maxWidth: '400px', margin: '0 auto 2rem', lineStyle: 1.6 }}>Create a team to invite your colleagues, assign roadmaps, and track skill gaps together.</p>
                <a href="/teams/create" className="btn btn-primary">Get Started</a>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {teams.map(team => (
                <a
                    key={team.slug}
                    href={`/teams/${team.slug}`}
                    style={{
                        display: 'block', textDecoration: 'none', background: '#111', padding: '1.5rem',
                        borderRadius: '16px', border: '1px solid #262626', transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#404040'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#262626'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'linear-gradient(135deg, #16a34a, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.25rem', color: '#fff' }}>
                            {team.name[0]}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff', margin: 0 }}>{team.name}</h3>
                            <p style={{ fontSize: '0.8rem', color: '#737373' }}>{team.members.length} member{team.members.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {team.assignedRoadmaps.slice(0, 3).map((r: string) => (
                            <span key={r} style={{ fontSize: '0.7rem', background: '#1c1c1c', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#a3a3a3', textTransform: 'capitalize' }}>
                                {r}
                            </span>
                        ))}
                        {team.assignedRoadmaps.length > 3 && <span style={{ fontSize: '0.7rem', color: '#525252' }}>+{team.assignedRoadmaps.length - 3} more</span>}
                    </div>
                </a>
            ))}
        </div>
    );
};

export default TeamsList;

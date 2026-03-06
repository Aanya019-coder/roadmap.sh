import React, { useState, useEffect } from 'react';

const TeamDashboard = ({ slug }: { slug: string }) => {
    const [team, setTeam] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const meRes = await fetch('http://localhost:5000/api/auth/me', { credentials: 'include' });
                if (meRes.ok) {
                    const me = await meRes.json();
                    setCurrentUserId(me._id);
                }

                const res = await fetch(`http://localhost:5000/api/teams/${slug}`, { credentials: 'include' });
                if (res.ok) {
                    setTeam(await res.json());
                } else {
                    const data = await res.json();
                    setError(data.message || 'Team not found');
                }
            } catch (err) {
                setError('Network error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    const handleDeleteTeam = async () => {
        if (!confirm('Are you sure you want to delete this team? This cannot be undone.')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/teams/${slug}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) window.location.href = '/teams';
        } catch (err) { console.error(err); }
    };

    const handleLeaveTeam = async () => {
        if (!confirm('Leave this team?')) return;
        // Logic for leaving would involve removing self as member
        try {
            const res = await fetch(`http://localhost:5000/api/teams/${slug}/members/${currentUserId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) window.location.href = '/teams';
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="container" style={{ padding: '4rem 1.5rem', color: '#737373' }}>Loading dashboard...</div>;
    if (error) return <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '1rem' }}>{error}</h1>
        <a href="/teams" className="btn btn-secondary">Back to Teams</a>
    </div>;

    const membership = team.members.find((m: any) => m.userId._id === currentUserId);
    const isAdmin = membership?.role === 'admin' || team.ownerId === currentUserId;
    const isOwner = team.ownerId === currentUserId;

    return (
        <div className="container" style={{ padding: '3rem 1.5rem' }}>
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <a href="/teams" style={{ color: '#525252', textDecoration: 'none', fontSize: '0.85rem' }}>← Teams</a>
                        <span style={{ color: '#262626' }}>/</span>
                        <span style={{ color: '#a3a3a3', fontSize: '0.85rem' }}>{team.slug}</span>
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>{team.name}</h1>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => window.location.href = `/teams/${slug}/insights`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
                        Insights
                    </button>
                    {isAdmin && <button className="btn btn-primary btn-sm">Invite Member</button>}
                    {isOwner ? (
                        <button className="btn btn-secondary btn-sm text-danger" onClick={handleDeleteTeam}>Delete Team</button>
                    ) : (
                        <button className="btn btn-secondary btn-sm" onClick={handleLeaveTeam}>Leave Team</button>
                    )}
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '3rem' }}>
                {/* Main Content: Roadmaps */}
                <main>
                    <section style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Team Roadmaps</h2>
                            <button className="btn btn-sm" style={{ background: '#1c1c1c', border: '1px solid #262626', color: '#a3a3a3' }}>Manage Roadmaps</button>
                        </div>

                        {team.assignedRoadmaps.length === 0 ? (
                            <div style={{ padding: '3rem', background: '#111', borderRadius: '20px', border: '1px solid #262626', textAlign: 'center' }}>
                                <p style={{ color: '#737373', marginBottom: '1.5rem' }}>No roadmaps assigned to the team yet.</p>
                                <button className="btn btn-secondary btn-sm">Assign First Roadmap</button>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                                {team.assignedRoadmaps.map((r: string) => (
                                    <div key={r} style={{ background: '#111', border: '1px solid #262626', borderRadius: '16px', padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <div style={{ width: 40, height: 40, borderRadius: '8px', background: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                                🗺️
                                            </div>
                                            <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 600, background: 'rgba(22,163,74,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Active</span>
                                        </div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', textTransform: 'capitalize', marginBottom: '0.5rem' }}>{r}</h3>
                                        <p style={{ fontSize: '0.8rem', color: '#525252', marginBottom: '1rem' }}>Team-wide learning path</p>
                                        <div style={{ height: '4px', background: '#1c1c1c', borderRadius: '2px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: '45%', background: '#16a34a' }} />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.7rem', color: '#525252' }}>
                                            <span>Team Progress</span>
                                            <span>45%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Activity</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#111', borderRadius: '12px', border: '1px solid #262626' }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#262626' }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.875rem', margin: 0 }}><strong>Member</strong> marked <strong>Node</strong> as done in <strong>Roadmap</strong></p>
                                        <small style={{ color: '#525252' }}>2 hours ago</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                {/* Sidebar: Members */}
                <aside>
                    <div style={{ background: '#111', borderRadius: '24px', border: '1px solid #262626', padding: '1.5rem', position: 'sticky', top: '100px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Members <span style={{ color: '#525252', fontWeight: 400, marginLeft: '4px' }}>{team.members.length}</span></h2>
                            <button style={{ background: 'none', border: 'none', color: '#16a34a', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>Invite</button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {team.members.map((m: any) => (
                                <div key={m.userId._id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1c1c1c', border: '1px solid #262626', overflow: 'hidden', flexShrink: 0 }}>
                                        {m.userId.avatar ? <img src={m.userId.avatar} style={{ width: '100%', height: '100%' }} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{m.userId.name[0]}</div>}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.userId.name}</span>
                                            {m.role === 'admin' && <span style={{ fontSize: '0.65rem', background: 'rgba(22,163,74,0.1)', color: '#16a34a', padding: '0.1rem 0.3rem', borderRadius: '4px', border: '1px solid rgba(22,163,74,0.2)' }}>ADMIN</span>}
                                        </div>
                                        <div style={{ height: '4px', width: '100%', background: '#1c1c1c', borderRadius: '2px', marginTop: '0.5rem', position: 'relative' }}>
                                            <div style={{ height: '100%', width: `${Math.random() * 80 + 10}%`, background: '#22c55e', borderRadius: '2px' }} />
                                        </div>
                                    </div>
                                    <div style={{ color: '#525252' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default TeamDashboard;

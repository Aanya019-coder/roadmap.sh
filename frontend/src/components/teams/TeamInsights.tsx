import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    Cell
} from 'recharts';

const TeamInsights = ({ slug }: { slug: string }) => {
    const [team, setTeam] = useState<any>(null);
    const [insights, setInsights] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const teamRes = await fetch(`http://localhost:5000/api/teams/${slug}`, { credentials: 'include' });
                const insightsRes = await fetch(`http://localhost:5000/api/teams/${slug}/insights`, { credentials: 'include' });

                if (teamRes.ok && insightsRes.ok) {
                    setTeam(await teamRes.json());
                    setInsights(await insightsRes.json());
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    if (loading) return <div className="container" style={{ padding: '4rem 1.5rem', color: '#737373' }}>Loading insights...</div>;
    if (!team) return <div>Team not found.</div>;

    // Format data for charts
    // Mocking some data if insights is empty for better UI demo
    const barData = team.members.map((m: any) => ({
        name: m.userId.name,
        done: Math.floor(Math.random() * 50) + 10,
    }));

    const radarData = [
        { subject: 'HTML/CSS', A: 120, B: 110, fullMark: 150 },
        { subject: 'JavaScript', A: 98, B: 130, fullMark: 150 },
        { subject: 'React', A: 86, B: 130, fullMark: 150 },
        { subject: 'Node.js', A: 99, B: 100, fullMark: 150 },
        { subject: 'Testing', A: 85, B: 90, fullMark: 150 },
        { subject: 'DevOps', A: 65, B: 85, fullMark: 150 },
    ];

    return (
        <div className="container" style={{ padding: '3rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <a href={`/teams/${slug}`} style={{ color: '#525252', textDecoration: 'none', fontSize: '0.85rem' }}>← Dashboard</a>
                <span style={{ color: '#262626' }}>/</span>
                <span style={{ color: '#a3a3a3', fontSize: '0.85rem' }}>Insights</span>
            </div>

            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>{team.name} Insights</h1>
                <p style={{ color: '#a3a3a3' }}>Skill gap analysis and team-wide progression metrics.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', marginBottom: '3rem' }}>
                {/* Radar Chart: Skill Coverage */}
                <div style={{ background: '#111', borderRadius: '24px', border: '1px solid #262626', padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '2rem' }}>Skill Coverage</h3>
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#262626" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#737373', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar name="Team Avg" dataKey="B" stroke="#16a34a" fill="#16a34a" fillOpacity={0.4} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart: Member Completion */}
                <div style={{ background: '#111', borderRadius: '24px', border: '1px solid #262626', padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '2rem' }}>Member Progress (Nodes Done)</h3>
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" vertical={false} />
                                <XAxis dataKey="name" tick={{ fill: '#737373', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#737373', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ background: '#161616', border: '1px solid #262626', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="done" fill="#16a34a" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Table: Skill Gap Analysis */}
            <div style={{ background: '#111', borderRadius: '24px', border: '1px solid #262626', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #262626' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Skill Gap Details</h3>
                    <p style={{ fontSize: '0.85rem', color: '#525252' }}>Nodes with lowest completion rates across the team.</p>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #262626' }}>
                            <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', color: '#525252', fontWeight: 600, textTransform: 'uppercase' }}>Topic / Node</th>
                            <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', color: '#525252', fontWeight: 600, textTransform: 'uppercase' }}>Team Adoption</th>
                            <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', color: '#525252', fontWeight: 600, textTransform: 'uppercase' }}>Missing By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { name: 'Typescript Generics', rate: 15, missing: '8 members' },
                            { name: 'Redux Saga / Thunk', rate: 25, missing: '6 members' },
                            { name: 'WebSockets (Socket.io)', rate: 40, missing: '5 members' },
                            { name: 'CI/CD Pipelines (GitHub Actions)', rate: 60, missing: '3 members' },
                        ].map(node => (
                            <tr key={node.name} style={{ borderBottom: '1px solid #1c1c1c' }}>
                                <td style={{ padding: '1.25rem 2rem', fontSize: '0.9rem', fontWeight: 600 }}>{node.name}</td>
                                <td style={{ padding: '1.25rem 2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ height: 6, width: 100, background: '#1c1c1c', borderRadius: 3, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${node.rate}%`, background: node.rate < 30 ? '#ef4444' : '#f59e0b' }} />
                                        </div>
                                        <span style={{ fontSize: '0.85rem', color: node.rate < 30 ? '#ef4444' : '#f59e0b' }}>{node.rate}%</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: '#737373' }}>{node.missing}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeamInsights;

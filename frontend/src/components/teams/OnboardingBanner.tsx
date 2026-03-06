import React, { useState, useEffect } from 'react';

const OnboardingBanner = () => {
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/teams/me/all', { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setTeams(data.filter((t: any) => t.onboardingPlan && t.onboardingPlan.length > 0));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeams();
    }, []);

    if (loading || teams.length === 0) return null;

    const currentTeam = teams[0]; // Just show the first one for now

    return (
        <div style={{ background: 'linear-gradient(135deg, rgba(22,163,74,0.1), rgba(34,197,94,0.05))', border: '1px solid rgba(22,163,74,0.2)', borderRadius: '16px', padding: '1.5rem', marginBottom: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ background: '#16a34a', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>Onboarding</span>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Welcome to {currentTeam.name}!</h3>
                </div>
                <p style={{ color: '#a3a3a3', fontSize: '0.9rem', margin: 0 }}>You have <strong>{currentTeam.onboardingPlan.length}</strong> tasks in your team onboarding plan.</p>
            </div>
            <a href={`/teams/${currentTeam.slug}`} className="btn btn-primary btn-sm" style={{ padding: '0.6rem 1.25rem' }}>View Onboarding Plan</a>
        </div>
    );
};

export default OnboardingBanner;

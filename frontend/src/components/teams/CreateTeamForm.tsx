import React, { useState } from 'react';

const CreateTeamForm = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('http://localhost:5000/api/teams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
                credentials: 'include'
            });

            if (res.ok) {
                const team = await res.json();
                window.location.href = `/teams/${team.slug}`;
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to create team');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                width: '100%', maxWidth: '400px', background: '#111', padding: '2.5rem',
                borderRadius: '24px', border: '1px solid #262626', boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
        >
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#a3a3a3', marginBottom: '0.75rem', fontWeight: 500 }}>Team Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Acme Engineering or Frontend Squad"
                    required
                    style={{
                        width: '100%', padding: '0.875rem', background: '#0a0a0a', border: '1px solid #262626',
                        borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s'
                    }}
                    onFocus={e => e.target.style.borderColor = '#16a34a'}
                    onBlur={e => e.target.style.borderColor = '#262626'}
                />
            </div>

            {error && (
                <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', border: '1px solid rgba(239,68,68,0.2)' }}>
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading || !name}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', fontWeight: 600 }}
            >
                {loading ? 'Creating...' : 'Create Team'}
            </button>
            <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#525252' }}>
                You'll be able to invite members and assign roadmaps on the next screen.
            </p>
        </form>
    );
};

export default CreateTeamForm;

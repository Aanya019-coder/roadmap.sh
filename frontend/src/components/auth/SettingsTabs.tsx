import React, { useState, useEffect } from 'react';

const SettingsTabs = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications'>('profile');
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/auth/me', { credentials: 'include' });
                if (res.ok) {
                    setUser(await res.json());
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        try {
            const res = await fetch('http://localhost:5000/api/users/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: user.name,
                    bio: user.bio,
                    githubUsername: user.githubUsername,
                    linkedinUrl: user.linkedinUrl,
                    websiteUrl: user.websiteUrl
                }),
                credentials: 'include'
            });
            if (res.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to update profile.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Network error.' });
        }
    };

    if (loading) return <div style={{ color: '#a3a3a3' }}>Loading settings...</div>;
    if (!user) return <div style={{ color: '#ef4444' }}>Please log in to view settings.</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #262626', marginBottom: '2.5rem' }}>
                {['profile', 'account', 'notifications'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        style={{
                            padding: '1rem 0.5rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === tab ? '2px solid #16a34a' : '2px solid transparent',
                            color: activeTab === tab ? '#fff' : '#737373',
                            fontWeight: activeTab === tab ? 600 : 400,
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            fontSize: '0.95rem'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {message && (
                <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '2rem', background: message.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(22,163,74,0.1)', color: message.type === 'error' ? '#ef4444' : '#22c55e', border: `1px solid ${message.type === 'error' ? '#ef4444' : '#22c55e'}` }}>
                    {message.text}
                </div>
            )}

            {activeTab === 'profile' && (
                <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                            {user.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : user.name[0]}
                        </div>
                        <button type="button" className="btn btn-secondary btn-sm">Change Avatar</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#a3a3a3', marginBottom: '0.5rem' }}>Full Name</label>
                            <input type="text" value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #262626', borderRadius: '8px', color: '#fff' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#a3a3a3', marginBottom: '0.5rem' }}>Public Email</label>
                            <input type="email" value={user.email} disabled style={{ width: '100%', padding: '0.75rem', background: '#0a0a0a', border: '1px solid #262626', borderRadius: '8px', color: '#525252', cursor: 'not-allowed' }} />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#a3a3a3', marginBottom: '0.5rem' }}>Bio</label>
                        <textarea value={user.bio || ''} onChange={e => setUser({ ...user, bio: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #262626', borderRadius: '8px', color: '#fff', minHeight: '100px' }} placeholder="Tell us about yourself..." />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#a3a3a3', marginBottom: '0.5rem' }}>GitHub Username</label>
                            <input type="text" value={user.githubUsername || ''} onChange={e => setUser({ ...user, githubUsername: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #262626', borderRadius: '8px', color: '#fff' }} placeholder="johndoe" />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#a3a3a3', marginBottom: '0.5rem' }}>LinkedIn URL</label>
                            <input type="text" value={user.linkedinUrl || ''} onChange={e => setUser({ ...user, linkedinUrl: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #262626', borderRadius: '8px', color: '#fff' }} placeholder="https://linkedin.com/in/..." />
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem', borderTop: '1px solid #262626', paddingTop: '2rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Save Changes</button>
                    </div>
                </form>
            )}

            {activeTab === 'account' && (
                <div style={{ color: '#a3a3a3' }}>
                    <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>Security</h3>
                    <button className="btn btn-secondary" style={{ marginBottom: '1rem' }}>Change Password</button>
                    <p style={{ fontSize: '0.85rem' }}>An email will be sent to <strong>{user.email}</strong> to reset your password.</p>
                </div>
            )}

            {activeTab === 'notifications' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Notification Preferences</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: '#111', border: '1px solid #262626', borderRadius: '16px' }}>
                            <div>
                                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: '#fff' }}>Weekly Newsletter</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#737373' }}>Get latest roadmaps, guides, and career growth tips.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={user.notificationSettings?.newsletter}
                                onChange={async (e) => {
                                    const updated = { ...user, notificationSettings: { ...(user.notificationSettings || {}), newsletter: e.target.checked } };
                                    setUser(updated);
                                    // In a real app, you'd call an API to save this specific setting
                                }}
                                style={{ width: '1.25rem', height: '1.25rem', accentColor: '#16a34a', cursor: 'pointer' }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: '#111', border: '1px solid #262626', borderRadius: '16px' }}>
                            <div>
                                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: '#fff' }}>Activity Notifications</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#737373' }}>Get notified about team activity, comments, and replies.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={user.notificationSettings?.activity}
                                onChange={async (e) => {
                                    const updated = { ...user, notificationSettings: { ...(user.notificationSettings || {}), activity: e.target.checked } };
                                    setUser(updated);
                                }}
                                style={{ width: '1.25rem', height: '1.25rem', accentColor: '#16a34a', cursor: 'pointer' }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={async () => {
                            try {
                                const res = await fetch('http://localhost:5000/api/users/me', {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ notificationSettings: user.notificationSettings }),
                                    credentials: 'include'
                                });
                                if (res.ok) setMessage({ type: 'success', text: 'Notifications updated!' });
                            } catch (err) { console.error(err); }
                        }}
                        className="btn btn-primary"
                        style={{ alignSelf: 'flex-start', padding: '0.75rem 2rem' }}
                    >
                        Save Preferences
                    </button>
                </div>
            )}
        </div>
    );
};

export default SettingsTabs;

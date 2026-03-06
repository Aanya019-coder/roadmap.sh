import React, { useState, useEffect } from 'react';

const AiContentLibrary = () => {
    const [content, setContent] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'course' | 'roadmap' | 'quiz' | 'plan'>('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [contentRes, userRes] = await Promise.all([
                    fetch('http://localhost:5000/api/ai/library', { credentials: 'include' }),
                    fetch('http://localhost:5000/api/auth/me', { credentials: 'include' })
                ]);
                if (contentRes.ok) setContent(await contentRes.json());
                if (userRes.ok) setUser(await userRes.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filtered = activeTab === 'all' ? content : content.filter(item => item.type === activeTab);

    if (loading) return <div style={{ color: '#737373' }}>Loading library...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '4rem auto', padding: '0 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>AI Library</h1>
                <a href="/ai/generate" className="btn btn-primary btn-sm">+ Generate New</a>
            </div>

            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #1f1f1f', marginBottom: '2rem' }}>
                {['all', 'course', 'roadmap', 'quiz', 'plan'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        style={{
                            padding: '0.75rem 1rem', background: 'none', border: 'none',
                            borderBottom: activeTab === tab ? '2px solid #16a34a' : '2px solid transparent',
                            color: activeTab === tab ? '#fff' : '#525252', cursor: 'pointer',
                            textTransform: 'capitalize', fontWeight: activeTab === tab ? 600 : 400
                        }}
                    >
                        {tab}s
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 0', background: '#111', borderRadius: '24px', border: '1px solid #262626' }}>
                    <p style={{ color: '#525252' }}>No AI generated {activeTab === 'all' ? 'content' : activeTab} found.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {filtered.map((item, index) => {
                        const typeItems = content.filter(c => c.type === item.type);
                        const sortedItems = [...typeItems].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                        const itemIndexInType = sortedItems.findIndex(i => i._id === item._id);
                        const isPro = user?.role === 'pro' || user?.role === 'admin';
                        const isLocked = !isPro && itemIndexInType >= 2;

                        return (
                            <div
                                key={item._id}
                                style={{
                                    background: '#111', padding: '1.5rem', borderRadius: '16px', border: '1px solid #262626',
                                    display: 'flex', flexDirection: 'column', gap: '1rem',
                                    opacity: isLocked ? 0.6 : 1, position: 'relative'
                                }}
                            >
                                {isLocked && (
                                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#f59e0b' }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', background: '#1c1c1c', padding: '0.2rem 0.5rem', borderRadius: '4px', color: isLocked ? '#525252' : '#16a34a', fontWeight: 600 }}>
                                        {item.type}
                                    </span>
                                    <span style={{ fontSize: '0.7rem', color: '#525252' }}>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>{item.topic}</h3>
                                <button
                                    onClick={() => isLocked ? window.location.href = '/premium' : window.location.href = `/${item.type}s/${item._id}`}
                                    className="btn btn-secondary btn-sm"
                                    style={{ marginTop: 'auto' }}
                                >
                                    {isLocked ? 'Upgrade to Unlock' : `View ${item.type}`}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AiContentLibrary;

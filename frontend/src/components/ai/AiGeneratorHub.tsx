import React, { useState } from 'react';

const AiGeneratorHub = () => {
    const [type, setType] = useState<'course' | 'roadmap' | 'quiz' | 'plan'>('course');
    const [topic, setTopic] = useState('');
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('http://localhost:5000/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, topic, prompt }),
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                alert(`${type} generated successfully! Redirecting to library...`);
                window.location.href = '/ai/library';
            } else {
                const data = await res.json();
                if (data.code === 'UPGRADE_REQUIRED') {
                    setError(<>
                        {data.message} <a href="/premium" style={{ color: '#22c55e', textDecoration: 'underline' }}>Upgrade to Pro</a>
                    </> as any);
                } else {
                    setError(data.message || 'Generation failed.');
                }
            }
        } catch (err) {
            setError('Network error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>AI Content Creator</h1>
                <p style={{ color: '#a3a3a3' }}>Generate personalized learning materials instantly with Gemini AI.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
                {(['course', 'roadmap', 'quiz', 'plan'] as const).map(t => (
                    <button
                        key={t}
                        onClick={() => setType(t)}
                        style={{
                            padding: '1.5rem', borderRadius: '16px', background: type === t ? 'rgba(22,163,74,0.1)' : '#111',
                            border: `1px solid ${type === t ? '#16a34a' : '#262626'}`, color: type === t ? '#22c55e' : '#a3a3a3',
                            cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center'
                        }}
                    >
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                            {t === 'course' ? '🎓' : t === 'roadmap' ? '🗺️' : t === 'quiz' ? '📝' : '📅'}
                        </div>
                        <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{t}</div>
                    </button>
                ))}
            </div>

            <form onSubmit={handleGenerate} style={{ background: '#111', padding: '2.5rem', borderRadius: '24px', border: '1px solid #262626' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#737373', marginBottom: '0.75rem' }}>Topic or Goal</label>
                    <input
                        type="text"
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        placeholder="e.g. Master React Hooks or Become a Backend Engineer"
                        required
                        style={{ width: '100%', padding: '1rem', background: '#0a0a0a', border: '1px solid #262626', borderRadius: '12px', color: '#fff' }}
                    />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#737373', marginBottom: '0.75rem' }}>Additional Instructions (Optional)</label>
                    <textarea
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="e.g. Focus on intermediate topics, include projects, or keep it under 2 weeks."
                        style={{ width: '100%', padding: '1rem', background: '#0a0a0a', border: '1px solid #262626', borderRadius: '12px', color: '#fff', minHeight: '100px' }}
                    />
                </div>

                {error && <div style={{ marginBottom: '1.5rem', color: '#ef4444', fontSize: '0.875rem' }}>{error}</div>}

                <button
                    type="submit"
                    disabled={loading || !topic}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '1rem' }}
                >
                    {loading ? 'Generating Content...' : `Generate ${type}`}
                </button>
            </form>
        </div>
    );
};

export default AiGeneratorHub;

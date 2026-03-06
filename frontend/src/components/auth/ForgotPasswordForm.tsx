import React, { useState } from 'react';

const API_URL = 'http://localhost:5000/api';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: data.message });
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to send reset link' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Network error. Try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto', background: '#111', padding: '2rem', borderRadius: '16px', border: '1px solid #262626' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 1rem', textAlign: 'center' }}>Reset Password</h2>
            <p style={{ color: '#a3a3a3', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1.5rem' }}>Enter your email address and we'll send you a link to reset your password.</p>

            {message && (
                <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', background: message.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)', color: message.type === 'error' ? '#ef4444' : '#22c55e', border: `1px solid ${message.type === 'error' ? '#ef4444' : '#22c55e'}` }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.75rem 1rem', background: '#1c1c1c', border: `1px solid #262626`, borderRadius: '8px', color: '#fff', outline: 'none' }} placeholder="john@example.com" />
                </div>

                <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.875rem', background: '#16a34a', color: '#fff', fontWeight: 600, border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer' }}>
                    {loading ? 'Sending link...' : 'Send Reset Link'}
                </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#a3a3a3', marginTop: '1.5rem' }}>
                Remember your password? <a href="/login" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 600 }}>Log in</a>
            </p>
        </div>
    );
};

export default ForgotPasswordForm;

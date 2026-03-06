import React, { useState } from 'react';

const API_URL = 'http://localhost:5000/api';

const SignupForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const validate = (name: string, value: string) => {
        let error = '';
        if (name === 'name' && value.length < 2) error = 'Name must be at least 2 characters';
        if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
        if (name === 'password' && value.length < 6) error = 'Password must be at least 6 characters';
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        validate(name, value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.values(errors).some(err => err) || !formData.name || !formData.email || !formData.password) {
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: data.message });
            } else {
                setMessage({ type: 'error', text: data.message || 'Registration failed' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Network error. Try again.' });
        } finally {
            setLoading(false);
        }
    };

    const oauthButton = (provider: string, icon: string, bgColor: string) => (
        <a
            href={`${API_URL}/auth/${provider.toLowerCase()}`}
            style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                padding: '0.75rem', background: bgColor, color: '#fff', borderRadius: '8px',
                textDecoration: 'none', fontWeight: 600, border: '1px solid #262626'
            }}
        >
            <span style={{ fontSize: '1.25rem' }}>{icon}</span> Continue with {provider}
        </a>
    );

    return (
        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto', background: '#111', padding: '2rem', borderRadius: '16px', border: '1px solid #262626' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 1.5rem', textAlign: 'center' }}>Create an Account</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {oauthButton('GitHub', '🐙', '#1c1c1c')}
                {oauthButton('Google', 'G', '#db4437')}
                {oauthButton('LinkedIn', 'in', '#0077b5')}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0', color: '#737373', fontSize: '0.875rem' }}>
                <div style={{ height: '1px', flex: 1, background: '#262626' }}></div>
                <span>OR</span>
                <div style={{ height: '1px', flex: 1, background: '#262626' }}></div>
            </div>

            {message && (
                <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', background: message.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)', color: message.type === 'error' ? '#ef4444' : '#22c55e', border: `1px solid ${message.type === 'error' ? '#ef4444' : '#22c55e'}` }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, margin: '0 0 0.5rem', color: '#e5e5e5' }}>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem 1rem', background: '#1c1c1c', border: `1px solid ${errors.name ? '#ef4444' : '#262626'}`, borderRadius: '8px', color: '#fff', outline: 'none' }} placeholder="John Doe" />
                    {errors.name && <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>{errors.name}</p>}
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, margin: '0 0 0.5rem', color: '#e5e5e5' }}>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem 1rem', background: '#1c1c1c', border: `1px solid ${errors.email ? '#ef4444' : '#262626'}`, borderRadius: '8px', color: '#fff', outline: 'none' }} placeholder="john@example.com" />
                    {errors.email && <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>{errors.email}</p>}
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, margin: '0 0 0.5rem', color: '#e5e5e5' }}>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem 1rem', background: '#1c1c1c', border: `1px solid ${errors.password ? '#ef4444' : '#262626'}`, borderRadius: '8px', color: '#fff', outline: 'none' }} placeholder="••••••••" />
                    {errors.password && <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>{errors.password}</p>}
                </div>

                <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.875rem', background: '#16a34a', color: '#fff', fontWeight: 600, border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem' }}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#a3a3a3', marginTop: '1.5rem' }}>
                Already have an account? <a href="/login" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 600 }}>Log in</a>
            </p>
        </div>
    );
};

export default SignupForm;

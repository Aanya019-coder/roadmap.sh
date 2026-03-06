import React, { useState } from 'react';

const PricingCards = () => {
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/payments/create-checkout-session', {
                method: 'POST',
                credentials: 'include'
            });
            if (res.ok) {
                const { url } = await res.json();
                window.location.href = url;
            } else {
                alert('Login required to subscribe.');
                window.location.href = '/login';
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const plans = [
        {
            name: 'Free',
            price: '$0',
            description: 'For curious developers just starting out.',
            features: [
                'Access to all standard roadmaps',
                'Track progress on 3 roadmaps',
                '2 AI Course generations',
                '2 AI Roadmap generations',
                'Basic AI Tutor access'
            ],
            buttonText: 'Current Plan',
            buttonAction: null,
            highlight: false
        },
        {
            name: 'Pro',
            price: '$8',
            period: '/mo',
            description: 'For serious learners and professionals.',
            features: [
                'Everything in Free, plus:',
                'Unlimited AI Course generations',
                'Unlimited AI Roadmap generations',
                'Priority AI Tutor (Gemini 1.5 Pro)',
                'Create & Share Unlimited Teams',
                'Custom Roadmap builder',
                'Download roadmaps as PDF',
                'Ad-free experience'
            ],
            buttonText: 'Get Pro Access',
            buttonAction: handleSubscribe,
            highlight: true
        }
    ];

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', maxWidth: '1000px', margin: '0 auto' }}>
            {plans.map((plan, i) => (
                <div key={i} style={{
                    flex: '1', minWidth: '320px', maxWidth: '400px',
                    background: plan.highlight ? '#111' : '#0a0a0a',
                    padding: '3rem', borderRadius: '32px',
                    border: plan.highlight ? '2px solid #16a34a' : '1px solid #1f1f1f',
                    textAlign: 'left', display: 'flex', flexDirection: 'column',
                    boxShadow: plan.highlight ? '0 20px 40px rgba(22, 163, 74, 0.1)' : 'none',
                    position: 'relative', overflow: 'hidden'
                }}>
                    {plan.highlight && (
                        <div style={{
                            position: 'absolute', top: '1.5rem', right: '-2.5rem',
                            background: '#16a34a', color: '#fff', fontSize: '0.75rem',
                            fontWeight: 700, padding: '0.5rem 3rem', transform: 'rotate(45deg)',
                            textTransform: 'uppercase'
                        }}>Popular</div>
                    )}
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{plan.name}</h2>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '3rem', fontWeight: 800 }}>{plan.price}</span>
                        {plan.period && <span style={{ color: '#525252' }}>{plan.period}</span>}
                    </div>
                    <p style={{ color: '#a3a3a3', fontSize: '0.95rem', marginBottom: '2.5rem', minHeight: '3rem' }}>{plan.description}</p>

                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 3rem', flex: 1 }}>
                        {plan.features.map((feat, j) => (
                            <li key={j} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', color: '#d4d4d4', fontSize: '0.95rem' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={plan.highlight ? '#16a34a' : '#525252'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                {feat}
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => plan.buttonAction?.()}
                        disabled={loading || !plan.buttonAction}
                        style={{
                            width: '100%', padding: '1rem', borderRadius: '14px',
                            background: plan.highlight ? '#16a34a' : '#1f1f1f',
                            color: '#fff', fontWeight: 700, border: 'none',
                            cursor: plan.buttonAction ? 'pointer' : 'default',
                            transition: 'all 0.2s',
                            opacity: (loading && plan.highlight) ? 0.7 : 1
                        }}
                        onMouseEnter={e => plan.buttonAction && (e.currentTarget.style.transform = 'scale(1.02)')}
                        onMouseLeave={e => plan.buttonAction && (e.currentTarget.style.transform = 'scale(1)')}
                    >
                        {loading && plan.highlight ? 'Processing...' : plan.buttonText}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default PricingCards;

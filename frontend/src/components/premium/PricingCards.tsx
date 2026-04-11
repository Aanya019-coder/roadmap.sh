import React from 'react';

const plans = [
    {
        name: 'Free',
        price: '0',
        features: [
            'Standard Roadmaps',
            'Community Guides',
            'Progress Tracking',
            'Basic AI Tutor (Limited)'
        ],
        btnText: 'Current Plan',
        current: true
    },
    {
        name: 'Pro',
        price: '12',
        best: true,
        features: [
            'AI-Personalized Roadmaps',
            'Advanced AI Tutor (Unlimited)',
            'Custom Path Builder',
            'Early Access to Guides',
            'No Ads'
        ],
        btnText: 'Upgrade to Pro'
    },
    {
        name: 'Lifetime',
        price: '99',
        features: [
            'All Pro Features',
            'One-time Payment',
            'VIP Discord Access',
            'Customizable Profile URL',
            'Support the Platform'
        ],
        btnText: 'Get Lifetime'
    }
];

export default function PricingCards() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', paddingBottom: '4rem' }}>
            {plans.map((plan, i) => (
                <div key={i} className="roadmap-card" style={{
                    padding: '3rem 2rem', border: plan.best ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                    position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column'
                }}>
                    {plan.best && (
                        <div style={{ 
                            position: 'absolute', top: 20, right: -30, background: 'var(--color-accent)', 
                            color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '4px 40px', 
                            transform: 'rotate(45deg)', letterSpacing: '0.05em' 
                        }}>BEST VALUE</div>
                    )}
                    
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{plan.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.25rem', marginBottom: '2rem' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff' }}>${plan.price}</span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>/forever</span>
                    </div>

                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem', flex: 1 }}>
                        {plan.features.map((f, j) => (
                            <li key={j} style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', display: 'flex', gap: '0.75rem' }}>
                                <span style={{ color: 'var(--color-accent)' }}>✓</span> {f}
                            </li>
                        ))}
                    </ul>

                    <button className={`btn ${plan.best ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', justifyContent: 'center' }}>
                        {plan.btnText}
                    </button>
                </div>
            ))}
        </div>
    );
}

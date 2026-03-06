import React, { useState, useEffect } from 'react';

const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed', bottom: '2rem', left: '2rem', right: '2rem',
            background: '#111', border: '1px solid #262626', borderRadius: '16px',
            padding: '1.5rem', zIndex: 1000, display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)', maxWidth: '800px', margin: '0 auto'
        }}>
            <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#a3a3a3', lineHeight: 1.5 }}>
                    We use cookies to improve your experience and analyze traffic. By clicking "Accept All", you consent to our use of cookies.
                    Read our <a href="/privacy" style={{ color: '#16a34a', textDecoration: 'none' }}>Privacy Policy</a>.
                </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                    onClick={() => setIsVisible(false)}
                    style={{ background: 'none', border: '1px solid #404040', color: '#a3a3a3', padding: '0.6rem 1.25rem', borderRadius: '8px', fontSize: '0.875rem', cursor: 'pointer' }}
                >
                    Decline
                </button>
                <button
                    onClick={handleAccept}
                    style={{ background: '#16a34a', border: 'none', color: '#fff', padding: '0.6rem 1.25rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
                >
                    Accept All
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;

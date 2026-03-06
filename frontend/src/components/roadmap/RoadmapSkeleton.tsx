import React from 'react';

const RoadmapSkeleton: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0a0a0a', overflow: 'hidden' }}>
            {/* Top Bar Skeleton */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #262626', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '200px', height: '24px', background: '#1c1c1c', borderRadius: '4px' }}></div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '100px', height: '36px', background: '#1c1c1c', borderRadius: '8px' }}></div>
                    <div style={{ width: '100px', height: '36px', background: '#1c1c1c', borderRadius: '8px' }}></div>
                </div>
            </div>

            {/* Graph Area Skeleton */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '80%', height: '80%', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem' }}>
                    {[...Array(16)].map((_, i) => (
                        <div key={i} style={{ width: '100%', height: '50px', background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0% { opacity: 0.5; }
                    50% { opacity: 0.8; }
                    100% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

export default RoadmapSkeleton;

import React from 'react';

interface RoadmapProgressBarProps {
    doneCount: number;
    totalCount: number;
}

const RoadmapProgressBar: React.FC<RoadmapProgressBarProps> = ({ doneCount, totalCount }) => {
    const percentage = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

    return (
        <div style={{
            position: 'sticky',
            top: '60px',
            zIndex: 30,
            background: 'rgba(10,10,10,0.8)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid #1f1f1f',
            padding: '12px 0',
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8125rem', fontWeight: 500 }}>
                        <span style={{ color: '#a3a3a3' }}>Progress Tracking</span>
                        <span style={{ color: '#22c55e' }}>{doneCount} / {totalCount} nodes ({percentage}%)</span>
                    </div>
                    <div style={{ height: '6px', background: '#262626', borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${percentage}%`,
                            background: 'linear-gradient(90deg, #16a34a, #22c55e)',
                            borderRadius: '100px',
                            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoadmapProgressBar;

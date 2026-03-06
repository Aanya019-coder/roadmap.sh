import React, { useEffect, useRef } from 'react';

interface ContextMenuProps {
    x: number;
    y: number;
    nodeId: string;
    onClose: () => void;
    onStatusChange: (nodeId: string, status: 'done' | 'in-progress' | 'skipped' | 'default') => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, nodeId, onClose, onStatusChange }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const items = [
        { label: 'Mark as Done', status: 'done', color: '#22c55e' },
        { label: 'Mark In Progress', status: 'in-progress', color: '#eab308' },
        { label: 'Mark Skipped', status: 'skipped', color: '#a3a3a3' },
        { label: 'Reset Progress', status: 'default', color: '#ef4444' },
    ];

    return (
        <div
            ref={menuRef}
            style={{
                position: 'fixed',
                top: y,
                left: x,
                zIndex: 1000,
                background: '#161616',
                border: '1px solid #262626',
                borderRadius: '8px',
                padding: '4px',
                minWidth: '160px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
            }}
        >
            {items.map((item) => (
                <button
                    key={item.status}
                    onClick={() => {
                        onStatusChange(nodeId, item.status as any);
                        onClose();
                    }}
                    style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        background: 'none',
                        border: 'none',
                        color: '#d4d4d4',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#262626')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                    <span style={{ color: item.color, marginRight: '8px' }}>●</span>
                    {item.label}
                </button>
            ))}
        </div>
    );
};

export default ContextMenu;

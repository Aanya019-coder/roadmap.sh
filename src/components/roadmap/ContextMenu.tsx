import React, { useEffect, useRef } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  nodeId: string;
  currentStatus: 'done' | 'in-progress' | 'skipped' | null;
  onStatusChange: (nodeId: string, status: 'done' | 'in-progress' | 'skipped' | null) => void;
  onClose: () => void;
}

export default function ContextMenu({ x, y, nodeId, currentStatus, onStatusChange, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as HTMLElement)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const items = [
    { 
      label: 'Mark as Done', 
      icon: '✓', 
      status: 'done' as const,
      active: currentStatus === 'done',
      color: 'text-green-400'
    },
    { 
      label: 'Mark as In Progress', 
      icon: '⟳', 
      status: 'in-progress' as const,
      active: currentStatus === 'in-progress',
      color: 'text-yellow-400'
    },
    { 
      label: 'Mark as Skipped', 
      icon: '→', 
      status: 'skipped' as const,
      active: currentStatus === 'skipped',
      color: 'text-gray-400'
    },
    { 
      label: 'Reset', 
      icon: '×', 
      status: null,
      active: false,
      color: 'text-red-400'
    },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-bg-secondary border border-border-default rounded-lg shadow-xl py-1 min-w-[180px] animate-fade-in"
      style={{ left: x, top: y }}
    >
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => onStatusChange(nodeId, item.status)}
          className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
            item.active 
              ? 'bg-bg-tertiary text-white' 
              : 'text-text-secondary hover:bg-bg-tertiary hover:text-white'
          }`}
        >
          <span className={`text-base ${item.color}`}>{item.icon}</span>
          <span>{item.label}</span>
          {item.active && (
            <span className="ml-auto text-xs text-text-muted">Active</span>
          )}
        </button>
      ))}
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import type { RoadmapNode } from './index';

interface ResourcePanelProps {
  node: RoadmapNode;
  onClose: () => void;
}

const typeIcons: Record<string, string> = {
  article: '📄',
  video: '▶️',
  course: '🎓',
  website: '🔗',
  official: '🏛️',
};

const typeBadgeColors: Record<string, string> = {
  article: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  video: 'bg-red-500/10 text-red-400 border-red-500/20',
  course: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  website: 'bg-green-500/10 text-green-400 border-green-500/20',
  official: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export default function ResourcePanel({ node, onClose }: ResourcePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 md:bg-transparent"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 h-full w-80 bg-bg-secondary border-l border-border-default z-50 overflow-y-auto animate-slide-in-right"
      >
        {/* Header */}
        <div className="sticky top-0 bg-bg-secondary border-b border-border-default px-4 py-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary truncate pr-2">{node.label}</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-white p-1 transition-colors flex-shrink-0"
            aria-label="Close panel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Resources */}
        <div className="p-4">
          {node.resources && node.resources.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
                Resources ({node.resources.length})
              </p>
              {node.resources.map((resource, i) => (
                <a
                  key={i}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-bg-tertiary transition-colors group"
                >
                  <span className="text-base flex-shrink-0 mt-0.5">{typeIcons[resource.type] || '📄'}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-text-primary group-hover:text-accent-yellow transition-colors line-clamp-2">
                      {resource.title}
                    </span>
                    <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium border rounded mt-1 ${typeBadgeColors[resource.type] || typeBadgeColors.article}`}>
                      {resource.type}
                    </span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted flex-shrink-0 mt-1">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-text-muted text-sm">No resources available for this topic yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

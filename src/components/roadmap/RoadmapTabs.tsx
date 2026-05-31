import React, { useState } from 'react';

interface RoadmapTabsProps {
  roadmapId: string;
  activeTab: 'roadmap' | 'projects' | 'ai-tutor';
}

export default function RoadmapTabs({ roadmapId, activeTab }: RoadmapTabsProps) {
  const tabs = [
    { id: 'roadmap', label: 'Roadmap', href: `/${roadmapId}` },
    { id: 'projects', label: 'Projects', href: `/${roadmapId}/projects` },
    { id: 'ai-tutor', label: 'AI Tutor', href: '#', disabled: true },
  ];

  return (
    <div className="flex items-center gap-1 border-b border-border-default">
      {tabs.map(tab => (
        <a
          key={tab.id}
          href={tab.disabled ? undefined : tab.href}
          className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
            tab.disabled 
              ? 'text-text-muted cursor-not-allowed' 
              : activeTab === tab.id
                ? 'text-white'
                : 'text-text-secondary hover:text-white'
          }`}
          title={tab.disabled ? 'AI features coming soon' : undefined}
          onClick={tab.disabled ? (e: React.MouseEvent) => e.preventDefault() : undefined}
        >
          {tab.label}
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-yellow rounded-full" />
          )}
          {tab.disabled && (
            <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-bg-tertiary text-text-muted rounded">Soon</span>
          )}
        </a>
      ))}
    </div>
  );
}

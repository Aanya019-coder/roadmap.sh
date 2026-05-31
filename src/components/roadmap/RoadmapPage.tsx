import React, { useState, useEffect, useCallback } from 'react';
import RoadmapDiagram from './RoadmapDiagram/index';
import RoadmapTabs from './RoadmapTabs';
import ProgressStrip from './ProgressStrip';
import { saveNodeProgress, getRoadmapProgress, getProgressPercentage } from '../../lib/progress';
import type { RoadmapNode, RoadmapEdge, RoadmapGroup } from './RoadmapDiagram/index';

interface RoadmapPageProps {
  roadmapId: string;
  title: string;
  description: string;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  groups: RoadmapGroup[];
}

export default function RoadmapPage({ roadmapId, title, description, nodes, edges, groups }: RoadmapPageProps) {
  const [progress, setProgress] = useState<Record<string, 'done' | 'in-progress' | 'skipped'>>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const topicNodes = nodes.filter(n => n.type === 'topic' || n.type === 'subtopic');
  const percentage = getProgressPercentage(progress, topicNodes.length);

  useEffect(() => {
    getRoadmapProgress(roadmapId).then(p => setProgress(p as any));
  }, [roadmapId]);

  const handleNodeStatusChange = useCallback(async (nodeId: string, status: 'done' | 'in-progress' | 'skipped' | null) => {
    setProgress(prev => {
      const next = { ...prev };
      if (status) {
        next[nodeId] = status;
      } else {
        delete next[nodeId];
      }
      return next;
    });
    await saveNodeProgress(roadmapId, nodeId, status);
  }, [roadmapId]);

  return (
    <div>
      {/* Partner Banner */}
      <div className="bg-amber-900/20 border-b border-amber-700/30 py-2 px-4">
        <div className="max-w-[1280px] mx-auto flex items-center justify-center gap-2 text-xs text-amber-300">
          <span className="font-medium">Partner</span>
          <span className="text-amber-400/60">—</span>
          <span>
            Get the latest {title} news from our sister site{' '}
            <a href="https://thenewstack.io" target="_blank" rel="noopener" className="underline hover:text-amber-200">
              TheNewStack.io
            </a>
          </span>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4">
        {/* Breadcrumb */}
        <div className="py-3">
          <a href="/roadmaps" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
            ← All Roadmaps
          </a>
        </div>

        {/* Newsletter Strip */}
        <div className="flex items-center gap-3 py-2 mb-4">
          <span className="text-xs font-medium text-text-muted">Weekly Newsletter</span>
          <span className="text-text-muted">#</span>
        </div>

        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          <p className="text-text-secondary text-sm">{description}</p>
        </div>

        {/* Tabs */}
        <RoadmapTabs roadmapId={roadmapId} activeTab="roadmap" />

        {/* Progress */}
        <ProgressStrip percentage={percentage} isLoggedIn={isLoggedIn} />

        {/* Action buttons */}
        <div className="flex items-center gap-2 py-3 justify-end">
          <button className="px-3 py-1.5 text-xs border border-border-default text-text-secondary rounded-md hover:border-border-hover hover:text-white transition-all">
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Download
            </span>
          </button>
          <button className="px-3 py-1.5 text-xs border border-border-default text-text-secondary rounded-md hover:border-border-hover hover:text-white transition-all">
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
              Share
            </span>
          </button>
          <a href="/signup" className="px-3 py-1.5 text-xs font-medium bg-accent-yellow text-gray-900 rounded-md hover:bg-yellow-300 transition-colors">
            Subscribe
          </a>
        </div>
      </div>

      {/* Diagram */}
      <RoadmapDiagram
        nodes={nodes}
        edges={edges}
        groups={groups}
        progress={progress}
        onNodeStatusChange={handleNodeStatusChange}
        roadmapId={roadmapId}
      />
    </div>
  );
}

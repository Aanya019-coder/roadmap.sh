import React, { useState, useRef, useCallback, useEffect } from 'react';
import ResourcePanel from './ResourcePanel';
import ContextMenu from '../ContextMenu';

export interface RoadmapNode {
  id: string;
  type: 'topic' | 'subtopic' | 'section';
  label: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  style?: 'filled' | 'outline';
  resources?: Array<{
    type: 'article' | 'video' | 'course' | 'website' | 'official';
    title: string;
    url: string;
  }>;
}

export interface RoadmapEdge {
  from: string;
  to: string;
  type: 'solid' | 'dashed';
}

export interface RoadmapGroup {
  id: string;
  label: string;
  nodeIds: string[];
  color?: string;
}

interface DiagramProps {
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  groups: RoadmapGroup[];
  progress: Record<string, 'done' | 'in-progress' | 'skipped'>;
  onNodeStatusChange: (nodeId: string, status: 'done' | 'in-progress' | 'skipped' | null) => void;
  roadmapId: string;
}

const nodeColors = {
  default: { fill: '#1e293b', stroke: '#334155' },
  done: { fill: '#166534', stroke: '#22c55e' },
  'in-progress': { fill: '#1e293b', stroke: '#fbbf24' },
  skipped: { fill: '#1e293b', stroke: '#334155' },
};

export default function RoadmapDiagram({ nodes, edges, groups, progress, onNodeStatusChange, roadmapId }: DiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [contextMenu, setContextMenu] = useState<{ node: RoadmapNode; x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-center the diagram
  useEffect(() => {
    if (nodes.length > 0 && svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const minX = Math.min(...nodes.map(n => n.x));
      const maxX = Math.max(...nodes.map(n => n.x + (n.width || 200)));
      const contentWidth = maxX - minX;
      const centerX = (svgRect.width - contentWidth * transform.scale) / 2 - minX * transform.scale;
      setTransform(prev => ({ ...prev, x: centerX, y: 20 }));
    }
  }, [nodes.length]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const scaleFactor = e.deltaY > 0 ? 0.95 : 1.05;
    setTransform(prev => {
      const newScale = Math.max(0.3, Math.min(2.0, prev.scale * scaleFactor));
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return prev;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const newX = mx - (mx - prev.x) * (newScale / prev.scale);
      const newY = my - (my - prev.y) * (newScale / prev.scale);
      return { x: newX, y: newY, scale: newScale };
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  }, [transform]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    setTransform(prev => ({
      ...prev,
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y,
    }));
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleNodeClick = useCallback((node: RoadmapNode) => {
    if (node.resources && node.resources.length > 0) {
      setSelectedNode(node);
    }
  }, []);

  const handleNodeContextMenu = useCallback((node: RoadmapNode, e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ node, x: e.clientX, y: e.clientY });
  }, []);

  const handleStatusChange = useCallback((nodeId: string, status: 'done' | 'in-progress' | 'skipped' | null) => {
    onNodeStatusChange(nodeId, status);
    setContextMenu(null);
  }, [onNodeStatusChange]);

  // Mobile accordion view
  if (isMobile) {
    return (
      <div className="space-y-2 px-4">
        {groups.map(group => (
          <details key={group.id} className="border border-border-default rounded-lg overflow-hidden">
            <summary className="flex items-center justify-between px-4 py-3 bg-bg-secondary cursor-pointer hover:bg-bg-tertiary transition-colors">
              <span className="text-sm font-medium text-text-primary">{group.label}</span>
              <span className="text-xs text-text-muted">
                {group.nodeIds.filter(id => progress[id] === 'done').length}/{group.nodeIds.length}
              </span>
            </summary>
            <div className="divide-y divide-border-default">
              {group.nodeIds.map(nodeId => {
                const node = nodes.find(n => n.id === nodeId);
                if (!node) return null;
                const status = progress[nodeId];
                return (
                  <div key={nodeId} className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleStatusChange(nodeId, status === 'done' ? null : 'done')}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          status === 'done'
                            ? 'bg-accent-green border-accent-green'
                            : status === 'in-progress'
                            ? 'border-accent-yellow'
                            : 'border-border-hover'
                        }`}
                      >
                        {status === 'done' && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => handleNodeClick(node)}
                        className={`text-sm text-left flex-1 transition-colors ${
                          status === 'done' ? 'text-green-400 line-through' : 
                          status === 'skipped' ? 'text-text-muted line-through opacity-50' : 
                          'text-text-primary hover:text-accent-yellow'
                        }`}
                      >
                        {node.label}
                      </button>
                    </div>
                    {/* Inline resources could be expanded here */}
                  </div>
                );
              })}
            </div>
          </details>
        ))}

        {/* Resource Panel for mobile */}
        {selectedNode && (
          <ResourcePanel 
            node={selectedNode} 
            onClose={() => setSelectedNode(null)} 
          />
        )}
      </div>
    );
  }

  // Desktop SVG diagram
  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 300px)', minHeight: '500px' }}>
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#334155" />
          </marker>
        </defs>

        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
          {/* Groups */}
          {groups.map(group => {
            const groupNodes = group.nodeIds
              .map(id => nodes.find(n => n.id === id))
              .filter(Boolean) as RoadmapNode[];
            if (groupNodes.length === 0) return null;

            const minX = Math.min(...groupNodes.map(n => n.x)) - 20;
            const minY = Math.min(...groupNodes.map(n => n.y)) - 36;
            const maxX = Math.max(...groupNodes.map(n => n.x + (n.width || 200))) + 20;
            const maxY = Math.max(...groupNodes.map(n => n.y + (n.height || 40))) + 20;

            return (
              <g key={group.id}>
                <rect
                  x={minX}
                  y={minY}
                  width={maxX - minX}
                  height={maxY - minY}
                  fill={group.color || '#0f172a'}
                  stroke="#1e293b"
                  rx={8}
                  opacity={0.7}
                />
                <text
                  x={minX + 12}
                  y={minY + 20}
                  fill="#475569"
                  fontSize={11}
                  fontWeight={600}
                  letterSpacing="0.1em"
                  style={{ textTransform: 'uppercase' }}
                >
                  {group.label}
                </text>
              </g>
            );
          })}

          {/* Edges */}
          {edges.map((edge, i) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const sx = fromNode.x + (fromNode.width || 200) / 2;
            const sy = fromNode.y + (fromNode.height || 40);
            const ex = toNode.x + (toNode.width || 200) / 2;
            const ey = toNode.y;
            const path = `M ${sx} ${sy} C ${sx} ${sy + 50}, ${ex} ${ey - 50}, ${ex} ${ey}`;

            return (
              <path
                key={`edge-${i}`}
                d={path}
                stroke="#334155"
                strokeWidth={1.5}
                fill="none"
                strokeDasharray={edge.type === 'dashed' ? '6,4' : undefined}
                markerEnd="url(#arrowhead)"
              />
            );
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const status = progress[node.id] as keyof typeof nodeColors;
            const colors = nodeColors[status] || nodeColors.default;
            const w = node.width || 200;
            const h = node.height || 40;

            return (
              <g
                key={node.id}
                onClick={() => handleNodeClick(node)}
                onContextMenu={(e) => handleNodeContextMenu(node, e)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={node.x}
                  y={node.y}
                  width={w}
                  height={h}
                  rx={6}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={1.5}
                  opacity={status === 'skipped' ? 0.4 : 1}
                />
                <text
                  x={node.x + w / 2}
                  y={node.y + h / 2 + 5}
                  textAnchor="middle"
                  fill={status === 'done' ? '#86efac' : '#f1f5f9'}
                  fontSize={13}
                  fontFamily="Inter, sans-serif"
                  fontWeight={500}
                  textDecoration={status === 'skipped' ? 'line-through' : undefined}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Resource Panel */}
      {selectedNode && (
        <ResourcePanel 
          node={selectedNode} 
          onClose={() => setSelectedNode(null)} 
        />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          nodeId={contextMenu.node.id}
          currentStatus={progress[contextMenu.node.id] || null}
          onStatusChange={handleStatusChange}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

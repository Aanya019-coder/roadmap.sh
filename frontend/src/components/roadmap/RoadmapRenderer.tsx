import React, { useCallback, useState } from 'react';
import {
  ReactFlow, Background, Controls, MiniMap,
  type Node, type Edge, type NodeProps,
  Handle, Position, useNodesState, useEdgesState, addEdge,
  MarkerType, ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { api } from '../../lib/api';
import { supabase } from '../../lib/supabase';

// ─── Node Colors ──────────────────────────────────────────────────────────────
const TYPE_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  topic:     { bg: 'rgba(59, 130, 246, 0.08)',  border: 'rgba(59,130,246,0.3)', text: '#60a5fa', glow: 'rgba(59,130,246,0.2)' },
  project:   { bg: 'rgba(16, 185, 129, 0.08)',  border: 'rgba(16,185,129,0.3)', text: '#34d399', glow: 'rgba(16,185,129,0.2)' },
  milestone: { bg: 'rgba(245, 158, 11, 0.08)',  border: 'rgba(245,158,11,0.3)', text: '#fbbf24', glow: 'rgba(245,158,11,0.2)' },
};

const STATUS_BORDER: Record<string, string> = {
  not_started: 'rgba(255,255,255,0.08)',
  in_progress: '#f59e0b',
  done:        '#10b981',
  skipped:     'rgba(255,255,255,0.03)',
};

// ─── Custom Node ──────────────────────────────────────────────────────────────
function RoadmapNode({ data }: NodeProps) {
  const nodeData = data as any;
  const typeStyle = TYPE_COLORS[nodeData.type] || TYPE_COLORS.topic;
  const statusBorder = STATUS_BORDER[nodeData.status || 'not_started'];

  return (
    <>
      <Handle type="target" position={Position.Top} style={{ background: 'var(--color-border)', width: 6, height: 6 }} />
      <div
        onClick={() => nodeData.onNodeClick?.(nodeData)}
        className="glass-card"
        style={{
          minWidth: 160, maxWidth: 220, padding: '0.75rem 1rem',
          borderRadius: 14, 
          border: `1.5px solid ${statusBorder}`,
          background: nodeData.status === 'done' ? 'rgba(16,185,129,0.1)' : 'rgba(15,20,25,0.7)',
          cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: nodeData.status === 'done' ? '0 0 20px rgba(16,185,129,0.25)' : '0 4px 15px rgba(0,0,0,0.4)',
          opacity: nodeData.status === 'skipped' ? 0.4 : 1,
        }}
      >
        {/* Type Icon/Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{
            fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em',
            color: typeStyle.text, padding: '2px 6px', borderRadius: 4, background: typeStyle.bg, border: `1px solid ${typeStyle.border}`
          }}>{nodeData.type}</span>
          
          <div style={{ display: 'flex', gap: '4px' }}>
            {nodeData.status === 'done' && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />}
            {nodeData.status === 'in_progress' && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />}
          </div>
        </div>

        {/* Label */}
        <div style={{
          fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)',
          lineHeight: 1.3, textAlign: 'center', letterSpacing: '-0.02em',
          textDecoration: nodeData.status === 'skipped' ? 'line-through' : 'none'
        }}>{nodeData.label}</div>

        {/* Priority indicator */}
        {nodeData.priority === 'essential' && (
          <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.55rem', color: '#ef4444', fontWeight: 900, background: 'rgba(239,68,68,0.1)', padding: '1px 5px', borderRadius: 4, letterSpacing: '0.05em' }}>CRITICAL</span>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: 'var(--color-border)', width: 6, height: 6 }} />
    </>
  );
}

const nodeTypes = { roadmapNode: RoadmapNode };

// ─── Node Detail Sidebar ──────────────────────────────────────────────────────
function NodeSidebar({ node, onClose, onStatusChange, progress }: {
  node: any; onClose: () => void; onStatusChange: (nodeId: string, status: string) => void; progress: Record<string, string>
}) {
  const currentStatus = progress[node.id] || 'not_started';
  const [saving, setSaving] = useState(false);

  const handleStatusChange = async (status: string) => {
    setSaving(true);
    onStatusChange(node.id, status);
    setSaving(false);
  };

  const statusButtons = [
    { value: 'not_started', label: '○ Not Started', color: '#525252' },
    { value: 'in_progress', label: '⟳ In Progress', color: '#eab308' },
    { value: 'done',        label: '✓ Done',        color: '#22c55e' },
    { value: 'skipped',     label: '↷ Skip',        color: '#737373' },
  ];

  const resourceIcons: Record<string, string> = { article: '📄', video: '🎥', course: '🎓', docs: '📚' };

  return (
    <div style={{
      position: 'absolute', top: 0, right: 0, width: 360, height: '100%',
      background: 'var(--color-bg-card)', borderLeft: '1px solid var(--color-border)',
      zIndex: 20, display: 'flex', flexDirection: 'column', animation: 'slideRight 0.25s ease',
      overflowY: 'auto'
    }}>
      <style>{`@keyframes slideRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

      {/* Header */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div>
          <span style={{
            fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
            color: TYPE_COLORS[node.type]?.text || '#93c5fd', padding: '2px 8px', borderRadius: 4,
            background: TYPE_COLORS[node.type]?.bg || 'transparent'
          }}>{node.type}</span>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '0.5rem', lineHeight: 1.3 }}>{node.label}</h3>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '1.25rem', padding: '0.25rem' }}>×</button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Why this matters */}
        {node.whyThisMatters && (
          <div style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: 8, padding: '0.875rem 1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-green-light)', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Why this matters for you</div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{node.whyThisMatters}</p>
          </div>
        )}

        {/* Estimate */}
        {node.estimatedHours && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ background: 'var(--color-bg-elevated)', borderRadius: 8, padding: '0.625rem 0.875rem', flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{node.estimatedHours}h</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Estimated hours</div>
            </div>
            {node.priority && (
              <div style={{ background: 'var(--color-bg-elevated)', borderRadius: 8, padding: '0.625rem 0.875rem', flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: node.priority === 'essential' ? '#f87171' : node.priority === 'recommended' ? '#fcd34d' : '#9ca3af', textTransform: 'capitalize' }}>{node.priority}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Priority</div>
              </div>
            )}
          </div>
        )}

        {/* Resources */}
        {node.resources && node.resources.length > 0 && (
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resources</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {node.resources.map((r: any, i: number) => (
                <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.875rem',
                  background: 'var(--color-bg-elevated)', borderRadius: 8, textDecoration: 'none',
                  border: '1px solid var(--color-border)', transition: 'border-color 0.15s'
                }}>
                  <span style={{ fontSize: '1rem' }}>{resourceIcons[r.type] || '🔗'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{r.type}</div>
                  </div>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                    background: r.isFree ? 'var(--color-green-bg)' : 'rgba(202,138,4,0.1)',
                    color: r.isFree ? 'var(--color-green-light)' : '#fcd34d'
                  }}>{r.isFree ? 'FREE' : 'PAID'}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Progress Buttons */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.625rem' }}>Mark progress:</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          {statusButtons.map(btn => (
            <button key={btn.value} onClick={() => handleStatusChange(btn.value)} disabled={saving} style={{
              padding: '0.5rem 0.75rem', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
              fontSize: '0.8125rem', fontWeight: 500, transition: 'all 0.15s',
              border: `2px solid ${currentStatus === btn.value ? btn.color : 'var(--color-border)'}`,
              background: currentStatus === btn.value ? `${btn.color}20` : 'transparent',
              color: currentStatus === btn.value ? btn.color : 'var(--color-text-muted)'
            }}>{btn.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── RoadmapRenderer ──────────────────────────────────────────────────────────
interface RoadmapRendererProps {
  roadmapId: string;
  roadmapType?: 'prebuilt' | 'personalized' | 'custom';
  initialNodes: Node[];
  initialEdges: Edge[];
  token?: string;
}

function RoadmapRendererInner({ roadmapId, roadmapType = 'prebuilt', initialNodes, initialEdges, token }: RoadmapRendererProps) {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [progress, setProgress] = useState<Record<string, string>>({});

  // Convert API nodes to React Flow format
  const rfNodes: Node[] = initialNodes.map(n => ({
    id: (n as any).id,
    type: 'roadmapNode',
    position: (n as any).position || { x: 0, y: 0 },
    data: {
      ...(n as any),
      status: progress[(n as any).id] || 'not_started',
      onNodeClick: (data: any) => setSelectedNode(data),
    },
  }));

  const rfEdges: Edge[] = initialEdges.map(e => ({
    id: (e as any).id || `${(e as any).source}-${(e as any).target}`,
    source: (e as any).source,
    target: (e as any).target,
    type: 'smoothstep',
    style: { stroke: '#404040', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#404040' },
  }));

  const [nodes, , onNodesChange] = useNodesState(rfNodes);
  const [edges, , onEdgesChange] = useEdgesState(rfEdges);

  const handleStatusChange = useCallback(async (nodeId: string, status: string) => {
    setProgress(prev => ({ ...prev, [nodeId]: status }));
    if (token) {
      try {
        await api.updateProgress({ roadmap_id: roadmapId, roadmap_type: roadmapType, node_id: nodeId, status }, token);
      } catch (e) {
        console.error('Failed to save progress', e);
      }
    }
  }, [roadmapId, roadmapType, token]);

  // Progress stats
  const totalNodes = nodes.filter(n => n.type === 'roadmapNode').length;
  const doneCount = Object.values(progress).filter(s => s === 'done').length;
  const pct = totalNodes > 0 ? Math.round((doneCount / totalNodes) * 100) : 0;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Progress Bar */}
      <div style={{
        position: 'absolute', top: 12, left: 12, zIndex: 10,
        background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
        borderRadius: 8, padding: '0.5rem 0.875rem', minWidth: 200,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.8125rem' }}>
          <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Progress</span>
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>{doneCount}/{totalNodes} ({pct}%)</span>
        </div>
        <div style={{ width: '100%', height: 4, background: 'var(--color-border)', borderRadius: 999 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--color-accent)', borderRadius: 999, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        style={{ background: 'var(--color-bg-primary)' }}
      >
        <Background color="#262626" gap={20} />
        <Controls style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }} />
        <MiniMap
          nodeColor={(n) => {
            const st = progress[n.id] || 'not_started';
            if (st === 'done') return '#22c55e';
            if (st === 'in_progress') return '#eab308';
            return '#404040';
          }}
          style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
        />
      </ReactFlow>

      {/* Node Detail Sidebar */}
      {selectedNode && (
        <NodeSidebar
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onStatusChange={handleStatusChange}
          progress={progress}
        />
      )}
    </div>
  );
}

export default function RoadmapRenderer(props: RoadmapRendererProps) {
  return (
    <ReactFlowProvider>
      <RoadmapRendererInner {...props} />
    </ReactFlowProvider>
  );
}

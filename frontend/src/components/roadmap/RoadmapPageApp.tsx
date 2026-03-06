import { useState, useCallback, useEffect } from 'react';
import RoadmapProgressBar from './RoadmapProgressBar';
import RoadmapRenderer from './RoadmapRenderer';
import NodeSidebar from './NodeSidebar';
import type { RoadmapData, NodeStatus } from './RoadmapRenderer';

interface RoadmapPageAppProps {
    roadmapData: RoadmapData;
    contentMap: Record<string, string>;
    roadmapId: string;
}

/**
 * Full roadmap page experience:
 * - Heading section with title, description, action buttons
 * - Interactive React Flow graph
 * - Sliding node detail sidebar
 * - Personalization (Standard / Beginner view)
 * - Download as PDF
 */
const RoadmapPageApp: React.FC<RoadmapPageAppProps> = ({
    roadmapData,
    contentMap,
    roadmapId,
}) => {
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [selectedNodeLabel, setSelectedNodeLabel] = useState<string | null>(null);
    const [statusMap, setStatusMap] = useState<Record<string, NodeStatus>>({});
    const [viewMode, setViewMode] = useState<'standard' | 'beginner'>('standard');
    const [showPersonalize, setShowPersonalize] = useState(false);

    /* ── Fetch Progress ── */
    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/progress/${roadmapId}`, {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    setStatusMap(data);
                }
            } catch (err) {
                console.error('Failed to fetch progress', err);
            }
        };
        fetchProgress();
    }, [roadmapId]);

    /* ── Status change ── */
    const handleStatusChange = useCallback(async (nodeId: string, status: NodeStatus) => {
        // Optimistic update
        setStatusMap(prev => ({ ...prev, [nodeId]: status }));

        try {
            if (status === 'default') {
                await fetch(`http://localhost:5000/api/progress/${roadmapId}/${nodeId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
            } else {
                await fetch(`http://localhost:5000/api/progress`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ roadmapId, nodeId, status }),
                    credentials: 'include'
                });
            }
        } catch (err) {
            console.error('Failed to sync progress', err);
        }
    }, [roadmapId]);

    /* ── Node click handler ── */
    const handleNodeClick = useCallback((nodeId: string) => {
        const node = roadmapData.nodes.find(n => n.id === nodeId);
        setSelectedNodeId(nodeId);
        setSelectedNodeLabel(node?.label ?? nodeId);
    }, [roadmapData.nodes]);

    /* ── Close sidebar ── */
    const handleClose = useCallback(() => {
        setSelectedNodeId(null);
        setSelectedNodeLabel(null);
    }, []);

    /* ── Progress stats ── */
    const totalNodes = roadmapData.nodes.length;
    const doneCount = Object.values(statusMap).filter(s => s === 'done').length;
    const inProgCount = Object.values(statusMap).filter(s => s === 'in-progress').length;

    /* ── Beginner mode: only show 'primary' style nodes ── */
    const visibleRoadmapData: RoadmapData = viewMode === 'beginner'
        ? {
            ...roadmapData,
            nodes: roadmapData.nodes.filter(n => n.style === 'primary' || n.style === 'highlight'),
            edges: roadmapData.edges.filter(e => {
                const visibleIds = new Set(
                    roadmapData.nodes
                        .filter(n => n.style === 'primary' || n.style === 'highlight')
                        .map(n => n.id)
                );
                return visibleIds.has(e.source) && visibleIds.has(e.target);
            }),
        }
        : roadmapData;

    /* ── Download as PDF ── */
    const handleDownload = () => window.print();

    const currentStatus = selectedNodeId ? (statusMap[selectedNodeId] ?? 'default') : 'default';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

            {/* ── Top Bar ── */}
            <div style={{
                borderBottom: '1px solid #262626',
                background: 'rgba(10,10,10,0.9)',
                backdropFilter: 'blur(12px)',
                flexShrink: 0,
                zIndex: 20,
            }}>
                <div className="container" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>

                    {/* Title */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <a href="/roadmaps" style={{ fontSize: '0.8rem', color: '#525252', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                ← Roadmaps
                            </a>
                        </div>
                        <h1 style={{ fontSize: 'clamp(1rem, 3vw, 1.375rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.2 }}>
                            {roadmapData.title}
                        </h1>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <a
                            href={`/ai/roadmap-chat/${roadmapId}`}
                            className="btn btn-secondary btn-sm"
                            style={{ background: 'rgba(22,163,74,0.1)', color: '#22c55e', borderColor: 'rgba(22,163,74,0.2)' }}
                        >
                            ✨ Ask AI Tutor
                        </a>
                        <button
                            onClick={() => setShowPersonalize(!showPersonalize)}
                            className="btn btn-secondary btn-sm"
                        >
                            Personalize
                        </button>

                        <button
                            onClick={handleDownload}
                            className="btn btn-secondary btn-sm"
                        >
                            Download
                        </button>
                    </div>
                </div>

                <RoadmapProgressBar doneCount={doneCount} totalCount={totalNodes} />
            </div>

            {/* ── Progress indicators (color legend) ── */}
            <div className="container" style={{ padding: '0.75rem 1.5rem', display: 'flex', gap: '1.25rem', borderBottom: '1px solid #1f1f1f', background: '#0a0a0a' }}>
                {[
                    { color: '#16a34a', label: 'Done', count: doneCount },
                    { color: '#ca8a04', label: 'In Progress', count: inProgCount },
                    { color: '#525252', label: 'Skipped', count: Object.values(statusMap).filter(s => s === 'skipped').length },
                ].map(s => (
                    <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                        <span style={{ fontSize: '0.75rem', color: '#737373' }}>{s.label}</span>
                        {s.count > 0 && <span style={{ fontSize: '0.7rem', color: s.color, fontWeight: 600 }}>({s.count})</span>}
                    </div>
                ))}
                <span style={{ fontSize: '0.75rem', color: '#525252', marginLeft: 'auto' }}>
                    Right-click nodes to update progress
                </span>
            </div>

            {/* ── Graph Area ── */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <RoadmapRenderer
                    roadmapData={visibleRoadmapData}
                    statusMap={statusMap}
                    onNodeClick={handleNodeClick}
                    onStatusChange={handleStatusChange}
                />

                {/* Beginner mode badge */}
                {viewMode === 'beginner' && (
                    <div style={{
                        position: 'absolute', top: '1rem', left: '1rem',
                        background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.3)',
                        borderRadius: '999px', padding: '0.3rem 0.75rem',
                        fontSize: '0.75rem', color: '#22c55e', fontWeight: 500,
                        zIndex: 5,
                    }}>
                        Beginner Mode Active
                    </div>
                )}
            </div>

            {/* Sidebar */}
            <NodeSidebar
                nodeId={selectedNodeId}
                nodeLabel={selectedNodeLabel}
                roadmapId={roadmapId}
                status={currentStatus}
                onClose={handleClose}
                onStatusChange={handleStatusChange}
                contentMap={contentMap}
            />

            {/* Personalize Modal Placeholder */}
            {showPersonalize && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)' }} onClick={() => setShowPersonalize(false)}>
                    <div style={{ background: '#111', padding: '2rem', borderRadius: '16px', border: '1px solid #262626', maxWidth: '400px', width: '90%' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginBottom: '1rem' }}>View Mode</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <button onClick={() => { setViewMode('standard'); setShowPersonalize(false); }} style={{ padding: '1rem', textAlign: 'left', background: viewMode === 'standard' ? '#262626' : 'transparent', border: '1px solid #262626', color: '#fff', cursor: 'pointer', borderRadius: '8px' }}>
                                <strong>Standard</strong>
                                <p style={{ fontSize: '0.8rem', color: '#a3a3a3' }}>All topics and subtopics</p>
                            </button>
                            <button onClick={() => { setViewMode('beginner'); setShowPersonalize(false); }} style={{ padding: '1rem', textAlign: 'left', background: viewMode === 'beginner' ? '#262626' : 'transparent', border: '1px solid #262626', color: '#fff', cursor: 'pointer', borderRadius: '8px' }}>
                                <strong>Beginner</strong>
                                <p style={{ fontSize: '0.8rem', color: '#a3a3a3' }}>Core topics only</p>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoadmapPageApp;

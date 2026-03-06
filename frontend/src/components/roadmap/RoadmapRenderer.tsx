import React, { useCallback, useMemo, useState, useEffect } from 'react';
import ContextMenu from './ContextMenu';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    BackgroundVariant,
    useNodesState,
    useEdgesState,
    addEdge,
    type Node,
    type Edge,
    type NodeTypes,
    type Connection,
    Handle,
    Position,
    MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  TYPE DEFINITIONS                                                           */
/* ─────────────────────────────────────────────────────────────────────────── */

export type NodeStatus = 'done' | 'in-progress' | 'skipped' | 'default';

export interface RoadmapNodeData {
    label: string;
    style: 'primary' | 'secondary' | 'highlight' | 'checklist';
    status?: NodeStatus;
    onNodeClick?: (id: string) => void;
    [key: string]: unknown;
}

export interface RoadmapJsonNode {
    id: string;
    label: string;
    type: 'topic' | 'subtopic';
    position: { x: number; y: number };
    style: 'primary' | 'secondary' | 'highlight' | 'checklist';
    group?: string;
}

export interface RoadmapData {
    id: string;
    title: string;
    description: string;
    nodes: RoadmapJsonNode[];
    edges: Array<{ id: string; source: string; target: string }>;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  STATUS COLORS                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */

const statusStyles: Record<NodeStatus, { bg: string; border: string; text: string }> = {
    done: { bg: 'rgba(22,163,74,0.18)', border: '#16a34a', text: '#22c55e' },
    'in-progress': { bg: 'rgba(202,138,4,0.18)', border: '#ca8a04', text: '#eab308' },
    skipped: { bg: 'rgba(82,82,82,0.2)', border: '#525252', text: '#737373' },
    default: { bg: 'rgba(28,28,28,0.95)', border: '#262626', text: '#ffffff' },
};

const nodeStyleVariant = {
    primary: { borderWidth: 1.5, fontSize: '0.8125rem', fontWeight: 600, minWidth: 150 },
    secondary: { borderWidth: 1, fontSize: '0.75rem', fontWeight: 500, minWidth: 130 },
    highlight: { borderWidth: 2, fontSize: '0.8125rem', fontWeight: 700, minWidth: 150 },
    checklist: { borderWidth: 1, fontSize: '0.8125rem', fontWeight: 500, minWidth: 200 },
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  CUSTOM NODE                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */

const RoadmapNode: React.FC<{ id: string; data: RoadmapNodeData; selected: boolean }> = ({
    id,
    data,
    selected,
}) => {
    const status = data.status ?? 'default';
    const variant = data.style ?? 'secondary';
    const colors = statusStyles[status];
    const varStyle = nodeStyleVariant[variant];

    const statusIcon = {
        done: '✓',
        'in-progress': '◐',
        skipped: '↷',
        default: '',
    }[status];

    const handleClick = () => data.onNodeClick?.(id);

    return (
        <>
            {/* Target handle (top) */}
            <Handle
                type="target"
                position={Position.Top}
                style={{ background: colors.border, border: 'none', width: 6, height: 6 }}
            />

            <div
                onClick={handleClick}
                title={data.label as string}
                style={{
                    background: colors.bg,
                    border: `${varStyle.borderWidth}px solid ${selected ? '#16a34a' : colors.border}`,
                    borderRadius: variant === 'primary' ? '8px' : '6px',
                    padding: variant === 'primary' ? '8px 16px' : '6px 12px',
                    minWidth: varStyle.minWidth,
                    maxWidth: 240,
                    cursor: 'pointer',
                    userSelect: 'none',
                    boxShadow: selected ? '0 0 0 2px rgba(22,163,74,0.4), 0 4px 16px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.4)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backdropFilter: 'blur(4px)',
                }}
            >
                {variant === 'checklist' ? (
                    <div style={{
                        width: '16px', height: '16px', borderRadius: '4px',
                        border: `1px solid ${status === 'done' ? '#16a34a' : '#525252'}`,
                        background: status === 'done' ? '#16a34a' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        {status === 'done' && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                    </div>
                ) : statusIcon && (
                    <span style={{ color: colors.text, fontSize: '0.75rem', flexShrink: 0 }}>
                        {statusIcon}
                    </span>
                )}
                <span style={{
                    color: colors.text,
                    fontSize: varStyle.fontSize,
                    fontWeight: varStyle.fontWeight,
                    lineHeight: 1.3,
                    fontFamily: 'Inter, system-ui, sans-serif',
                }}>
                    {data.label as string}
                </span>
            </div>

            {/* Source handle (bottom) */}
            <Handle
                type="source"
                position={Position.Bottom}
                style={{ background: colors.border, border: 'none', width: 6, height: 6 }}
            />
        </>
    );
};

const nodeTypes: NodeTypes = {
    roadmapNode: RoadmapNode as unknown as NodeTypes['roadmapNode'],
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  MAIN RENDERER COMPONENT                                                    */
/* ─────────────────────────────────────────────────────────────────────────── */

interface RoadmapRendererProps {
    roadmapData: RoadmapData;
    statusMap?: Record<string, NodeStatus>;
    onNodeClick?: (nodeId: string) => void;
    onStatusChange?: (nodeId: string, status: NodeStatus) => void;
}

/**
 * Interactive roadmap graph using React Flow.
 * Supports zoom/pan, node status coloring, and click callbacks.
 */
const RoadmapRenderer: React.FC<RoadmapRendererProps> = ({
    roadmapData,
    statusMap = {},
    onNodeClick,
    onStatusChange,
}) => {
    const [menu, setMenu] = useState<{ x: number; y: number; nodeId: string } | null>(null);
    /* Build React Flow nodes from JSON */
    const initialNodes = useMemo<Node[]>(() =>
        roadmapData.nodes.map(n => ({
            id: n.id,
            type: 'roadmapNode',
            position: n.position,
            data: {
                label: n.label,
                style: n.style,
                status: statusMap[n.id] ?? 'default',
                onNodeClick,
            },
            draggable: false,
        })),
        [roadmapData.nodes, statusMap, onNodeClick]
    );

    /* Build React Flow edges from JSON */
    const initialEdges = useMemo<Edge[]>(() =>
        roadmapData.edges.map(e => ({
            id: e.id,
            source: e.source,
            target: e.target,
            type: 'smoothstep',
            style: { stroke: '#404040', strokeWidth: 1.5 },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 12,
                height: 12,
                color: '#404040',
            },
        })),
        [roadmapData.edges]
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);

    /* Update nodes when statusMap changes */
    useEffect(() => {
        setNodes((nds) =>
            nds.map((node) => ({
                ...node,
                data: {
                    ...node.data,
                    status: statusMap[node.id] ?? 'default',
                },
            }))
        );
    }, [statusMap, setNodes]);

    const onNodeContextMenu = useCallback(
        (event: React.MouseEvent, node: Node) => {
            event.preventDefault();
            setMenu({
                x: event.clientX,
                y: event.clientY,
                nodeId: node.id,
            });
        },
        [setMenu]
    );

    const onConnect = useCallback((params: Connection) =>
        console.log('connect', params), []);

    return (
        <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeContextMenu={onNodeContextMenu}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.15 }}
                minZoom={0.2}
                maxZoom={2}
                proOptions={{ hideAttribution: true }}
                style={{ background: '#0a0a0a' }}
                onClick={() => setMenu(null)}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={24}
                    size={1}
                    color="#262626"
                />
                <Controls
                    style={{
                        background: '#161616',
                        border: '1px solid #262626',
                        borderRadius: '8px',
                    }}
                />
                <MiniMap
                    style={{
                        background: '#111',
                        border: '1px solid #262626',
                    }}
                    nodeColor={n => {
                        const status = (n.data as RoadmapNodeData).status ?? 'default';
                        if (status === 'done') return '#16a34a';
                        if (status === 'in-progress') return '#ca8a04';
                        if (status === 'skipped') return '#525252';
                        return '#262626';
                    }}
                    maskColor="rgba(0,0,0,0.5)"
                />
            </ReactFlow>

            {menu && (
                <ContextMenu
                    x={menu.x}
                    y={menu.y}
                    nodeId={menu.nodeId}
                    onClose={() => setMenu(null)}
                    onStatusChange={(id, status) => onStatusChange?.(id, status)}
                />
            )}
        </div>
    );
};

export default RoadmapRenderer;

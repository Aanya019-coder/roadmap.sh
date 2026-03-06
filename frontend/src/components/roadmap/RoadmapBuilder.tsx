import React, { useState, useCallback, useRef } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
    {
        id: '1',
        type: 'default',
        data: { label: 'Start Here' },
        position: { x: 250, y: 5 },
    },
];

const RoadmapBuilder = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
    const [title, setTitle] = useState('My Custom Roadmap');
    const [saving, setSaving] = useState(false);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            if (!reactFlowInstance) return;

            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const newNode = {
                id: (nodes.length + 1).toString(),
                type,
                position,
                data: { label: `${type} node` },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, nodes, setNodes]
    );

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('http://localhost:5000/api/roadmaps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    nodes,
                    edges
                }),
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                alert(`Roadmap saved! Shared URL: /roadmaps/v/${data.slug}`);
            } else {
                alert('Failed to save roadmap. Are you logged in?');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const addNode = () => {
        const newNode = {
            id: (nodes.length + 1).toString(),
            data: { label: 'New Topic' },
            position: { x: Math.random() * 400, y: Math.random() * 400 },
        };
        setNodes((nds) => nds.concat(newNode));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', background: '#0a0a0a', border: '1px solid #262626', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #262626', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.25rem', fontWeight: 700, outline: 'none', width: '300px' }}
                />
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={addNode} className="btn btn-secondary btn-sm">Add Node</button>
                    <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm">
                        {saving ? 'Saving...' : 'Save Roadmap'}
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative' }} ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    fitView
                    style={{ background: '#0a0a0a' }}
                >
                    <Background color="#222" gap={20} />
                    <Controls />
                </ReactFlow>
            </div>

            <div style={{ padding: '0.75rem', borderTop: '1px solid #262626', background: '#111', fontSize: '0.8rem', color: '#737373', textAlign: 'center' }}>
                Double-click node to edit label (upcoming). Drag edges to connect. Backspace to delete selected.
            </div>
        </div>
    );
};

export default RoadmapBuilder;

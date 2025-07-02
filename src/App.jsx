import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls as FlowControls,
  Background,
  MiniMap,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Controls from './components/Controls.jsx';
import NodeComponent from './components/NodeComponent.jsx';
import { validateDag } from './components/ValidationService.jsx';
import JSONPreview from './components/JSONPreview.jsx';
import NodeModal from './components/NodeModal.jsx';
import dagre from 'dagre';
import { FaTrash } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';
import { createPortal } from 'react-dom';
import { useRef as useReactRef } from 'react';

const initialNodes = [];
const initialEdges = [];

const NODE_TYPES = [
  { value: 'data', label: 'Data Source', color: '#4f8cff' },
  { value: 'process', label: 'Processing', color: '#ffb347' },
  { value: 'output', label: 'Output', color: '#4fd18b' },
];

function DagFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [validation, setValidation] = useState({ isValid: false, message: '' });
  const [rfInstance, setRfInstance] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [edgeMidpoint, setEdgeMidpoint] = useState(null);
  const idRef = useRef(1);
  const selectedNodesRef = useRef([]);
  const selectedEdgesRef = useRef([]);
  const flowWrapperRef = useReactRef();

  useEffect(() => {
    setValidation(validateDag(nodes, edges));
  }, [nodes, edges]);

  const onDeleteNode = useCallback((id) => {
    setNodes(nds => nds.filter(n => n.id !== id));
    setEdges(eds => eds.filter(e => e.source !== id && e.target !== id));
  }, [setNodes, setEdges]);

  // Memoize nodeTypes to avoid React Flow warning
  const nodeTypes = useMemo(() => ({
    custom: (props) => (
      <NodeComponent
        {...props}
        selected={props.selected}
        onDelete={onDeleteNode}
      />
    )
  }), [onDeleteNode]);

  // Track selected edge and its midpoint for delete icon
  const onSelectionChange = useCallback(({ nodes: selNodes, edges: selEdges }) => {
    selectedNodesRef.current = selNodes;
    selectedEdgesRef.current = selEdges;
    if (selEdges && selEdges.length > 0) {
      setSelectedEdge(selEdges[0]);
      // Find the edge and calculate its midpoint
      const edge = edges.find(e => e.id === selEdges[0].id);
      if (edge && rfInstance) {
        const sourceNode = rfInstance.getNode(edge.source);
        const targetNode = rfInstance.getNode(edge.target);
        if (sourceNode && targetNode) {
          const midX = (sourceNode.position.x + sourceNode.width / 2 + targetNode.position.x + targetNode.width / 2) / 2;
          const midY = (sourceNode.position.y + sourceNode.height / 2 + targetNode.position.y + targetNode.height / 2) / 2;
          setEdgeMidpoint({ x: midX, y: midY, edgeId: edge.id });
        }
      }
    } else {
      setSelectedEdge(null);
      setEdgeMidpoint(null);
    }
  }, [edges, rfInstance]);

  // Add Node (open modal)
  const handleAddNode = useCallback(() => {
    setShowModal(true);
  }, []);

  // Add Node (from modal)
  const handleAddNodeModal = useCallback((label) => {
    const newNode = {
      id: `${idRef.current++}`,
      type: 'custom',
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: { label },
    };
    setNodes((nds) => [...nds, newNode]);
    setShowModal(false);
  }, [setNodes]);

  // When rendering nodes, just pass through
  const nodesWithHandler = nodes;

  // Edge connect
  const onConnect = useCallback(
    (params) => {
      if (params.source === params.target) return; // no self-loop
      setEdges((eds) => addEdge({ ...params, markerEnd: { type: 'arrowclosed' } }, eds));
    },
    [setEdges]
  );

  // Delete selected nodes/edges with Delete key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        setNodes((nds) => nds.filter((n) => !selectedNodesRef.current.some((sn) => sn.id === n.id)));
        setEdges((eds) =>
          eds.filter(
            (e) =>
              !selectedEdgesRef.current.some((se) => se.id === e.id) &&
              !selectedNodesRef.current.some((sn) => sn.id === e.source || sn.id === e.target)
          )
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setNodes, setEdges]);

  // Auto Layout
  const handleAutoLayout = useCallback(() => {
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: 'LR' });
    nodes.forEach((node) => {
      g.setNode(node.id, { width: 120, height: 40 });
    });
    edges.forEach((edge) => {
      g.setEdge(edge.source, edge.target);
    });
    dagre.layout(g);
    const newNodes = nodes.map((node) => {
      const pos = g.node(node.id);
      return pos
        ? { ...node, position: { x: pos.x - 60, y: pos.y - 20 } }
        : node;
    });
    setNodes(newNodes);
    if (rfInstance) rfInstance.fitView();
  }, [nodes, edges, setNodes, rfInstance]);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 12, background: '#f7faff', borderBottom: '1px solid #e0e7ef', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <Controls onAddNode={handleAddNode} onAutoLayout={handleAutoLayout} />
        <div style={{ fontWeight: 'bold', fontSize: 18, color: validation.isValid ? '#1ca97a' : '#e74c3c', background: validation.isValid ? '#e8f9f1' : '#fbeaea', borderRadius: 6, padding: '6px 18px', minWidth: 160, textAlign: 'center', boxShadow: '0 2px 8px #0001' }}>
          {validation.isValid ? 'Valid DAG' : `Invalid DAG: ${validation.message}`}
        </div>
      </div>
      <div ref={flowWrapperRef} style={{ flex: 1, minHeight: 0, border: '1px solid #eee', borderRadius: 8, margin: 12, overflow: 'hidden', position: 'relative' }}>
        <ReactFlow
          nodes={nodesWithHandler}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onInit={setRfInstance}
          onSelectionChange={onSelectionChange}
          fitView
        >
          <MiniMap />
          <FlowControls />
          <Background gap={16} />
        </ReactFlow>
        {/* Delete icon overlay for selected edge */}
        {edgeMidpoint && flowWrapperRef.current && createPortal(
          <span
            data-tip="Delete edge"
            style={{
              position: 'absolute',
              left: edgeMidpoint.x,
              top: edgeMidpoint.y,
              zIndex: 10,
              cursor: 'pointer',
              background: '#fff',
              borderRadius: '50%',
              boxShadow: '0 2px 8px #0002',
              padding: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={e => {
              e.stopPropagation();
              setEdges((eds) => eds.filter(e => e.id !== edgeMidpoint.edgeId));
              setSelectedEdge(null);
              setEdgeMidpoint(null);
            }}
          >
            <FaTrash color="#e74c3c" size={18} />
            <ReactTooltip effect="solid" />
          </span>,
          flowWrapperRef.current
        )}
      </div>
      <JSONPreview nodes={nodes} edges={edges} panelStyle={{ background: '#222', color: '#fff', border: '2px solid #4f8cff', boxShadow: '0 2px 16px #0008' }} />
      <NodeModal open={showModal} onAdd={handleAddNodeModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <DagFlow />
    </ReactFlowProvider>
  );
}

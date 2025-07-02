import React from 'react';
import { FaPlus, FaProjectDiagram } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';

const Controls = ({ onAddNode, onAutoLayout }) => {
  return (
    <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
      <button
        onClick={onAddNode}
        data-tip="Add Node"
        style={{
          background: '#4f8cff',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '8px 14px',
          fontWeight: 600,
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
          boxShadow: '0 2px 8px #4f8cff33',
        }}
      >
        <FaPlus /> Add Node
      </button>
      <button
        onClick={onAutoLayout}
        data-tip="Auto Layout"
        style={{
          background: '#222',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '8px 14px',
          fontWeight: 600,
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
          boxShadow: '0 2px 8px #2228',
        }}
      >
        <FaProjectDiagram /> Auto Layout
      </button>
      <ReactTooltip effect="solid" />
    </div>
  );
};

export default Controls; 
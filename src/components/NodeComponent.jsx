import React from 'react';
import { Handle, Position } from 'reactflow';
import { FaTrash } from 'react-icons/fa';

const NodeComponent = ({ data, id, selected, onDelete }) => {
  return (
    <div
      style={{
        padding: 12,
        border: '2.5px solid #4f8cff',
        borderRadius: 10,
        background: '#fff',
        minWidth: 80,
        textAlign: 'center',
        boxShadow: '0 2px 8px #4f8cff33',
        position: 'relative',
        fontWeight: 600,
        fontSize: 16,
        color: '#222',
        transition: 'border 0.2s, box-shadow 0.2s',
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#4f8cff' }} />
      <div>{data.label}</div>
      {selected && (
        <span
          title="Delete node"
          style={{
            position: 'absolute',
            top: 4,
            right: 4,
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
            onDelete && onDelete(id);
          }}
        >
          <FaTrash color="#e74c3c" size={16} />
        </span>
      )}
      <Handle type="source" position={Position.Right} style={{ background: '#4f8cff' }} />
    </div>
  );
};

export default NodeComponent; 
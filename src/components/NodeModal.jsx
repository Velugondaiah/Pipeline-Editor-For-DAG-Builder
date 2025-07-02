import React, { useState } from 'react';

const modalBg = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
};
const modalBox = {
  background: '#fff',
  borderRadius: 10,
  padding: 24,
  minWidth: 320,
  boxShadow: '0 4px 32px #0002',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};
const inputStyle = {
  padding: 8,
  borderRadius: 6,
  border: '1px solid #ccc',
  fontSize: 16,
};
const btnRow = {
  display: 'flex',
  gap: 12,
  justifyContent: 'flex-end',
};
const btn = {
  padding: '8px 18px',
  borderRadius: 6,
  border: 'none',
  fontWeight: 600,
  fontSize: 16,
  cursor: 'pointer',
};

const NodeModal = ({ open, onAdd, onClose }) => {
  const [label, setLabel] = useState('');

  if (!open) return null;

  return (
    <div style={modalBg}>
      <div style={modalBox}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Add Node</h2>
        <label>
          Label
          <input
            style={inputStyle}
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="Node label"
            autoFocus
          />
        </label>
        <div style={btnRow}>
          <button style={{ ...btn, background: '#eee', color: '#333' }} onClick={onClose}>Cancel</button>
          <button
            style={{ ...btn, background: '#4f8cff', color: '#fff' }}
            onClick={() => {
              if (label.trim()) onAdd(label.trim());
              setLabel('');
            }}
            disabled={!label.trim()}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeModal; 
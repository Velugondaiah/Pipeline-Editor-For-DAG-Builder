import React, { useState } from 'react';

const JSONPreview = ({ nodes, edges, panelStyle }) => {
  const [open, setOpen] = useState(false);
  const defaultStyle = {
    position: 'fixed',
    bottom: 10,
    right: 10,
    width: 350,
    background: '#f7f7f7',
    border: '1px solid #ccc',
    borderRadius: 6,
    boxShadow: '0 2px 8px #0001',
    zIndex: 1000,
  };
  return (
    <div style={{ ...defaultStyle, ...panelStyle }}>
      <div style={{ padding: 8, cursor: 'pointer', fontWeight: 'bold', borderBottom: '1px solid #eee' }} onClick={() => setOpen(o => !o)}>
        {open ? '▼' : '▶'} JSON Preview
      </div>
      {open && (
        <pre style={{ margin: 0, padding: 8, fontSize: 12, maxHeight: 250, overflow: 'auto' }}>
          {JSON.stringify({ nodes, edges }, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default JSONPreview; 
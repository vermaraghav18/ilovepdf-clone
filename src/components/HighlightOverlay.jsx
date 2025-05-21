import React from 'react';
import Draggable from 'react-draggable';
import '../styles/overlays.css';

function HighlightOverlay({ data, remove }) {
  const isEraser = data.type === 'erase';
  const background = isEraser ? '#fff' : (data.color || 'yellow');
  const opacity = isEraser ? 1 : 0.4;

  return (
    <Draggable defaultPosition={{ x: data.x, y: data.y }}>
      <div
        className="highlight-overlay"
        style={{
          top: data.y,
          left: data.x,
          width: data.width,
          height: data.height,
          backgroundColor: background,
          opacity,
          position: 'absolute',
          border: '1px dashed gray',
        }}
      >
        <button className="remove-btn" onClick={() => remove(data.id)}>×</button>
      </div>
    </Draggable>
  );
}

export default HighlightOverlay;

import React from 'react';
import Draggable from 'react-draggable';
import '../styles/overlays.css';

function ImageOverlay({ data, remove }) {
  return (
    <Draggable defaultPosition={{ x: data.x, y: data.y }}>
      <div
        className="image-overlay"
        style={{
          width: data.width,
          height: data.height,
          position: 'absolute',
        }}
      >
        <img
          src={data.url}
          alt="User overlay"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        <button className="remove-btn" onClick={() => remove(data.id)}>×</button>
      </div>
    </Draggable>
  );
}

export default ImageOverlay;

import React, { useState } from 'react';
import Draggable from 'react-draggable';
import '../styles/overlays.css';

function TextOverlay({ data, remove }) {
  const [text, setText] = useState(data.text);
  const [fontSize, setFontSize] = useState(data.fontSize || 14);
  const [color, setColor] = useState(data.color || '#000');

  return (
    <Draggable defaultPosition={{ x: data.x, y: data.y }}>
      <div className="text-overlay" style={{ fontSize: `${fontSize}px`, color }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="text-input"
          style={{ fontSize: `${fontSize}px`, color }}
        />
        <div className="text-controls">
          <label>
            Size:
            <input
              type="number"
              min="10"
              max="50"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
          </label>
          <label>
            Color:
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </label>
          <button className="remove-btn" onClick={() => remove(data.id)}>×</button>
        </div>
      </div>
    </Draggable>
  );
}

export default TextOverlay;

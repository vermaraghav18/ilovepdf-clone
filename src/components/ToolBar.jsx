import React from 'react';
import '../styles/ToolBar.css';

function ToolBar({ tool, setTool }) {
  return (
    <div className="toolbar">
      <button className={tool === 'text' ? 'active' : ''} onClick={() => setTool('text')} title="Add Text">
        ✏️
      </button>
      <button className={tool === 'image' ? 'active' : ''} onClick={() => setTool('image')} title="Add Image">
        🖼
      </button>
      <button className={tool === 'highlight' ? 'active' : ''} onClick={() => setTool('highlight')} title="Highlight">
        ✍️
      </button>
      <button className={tool === 'erase' ? 'active' : ''} onClick={() => setTool('erase')} title="Eraser">
        🧹
      </button>
      <button className={tool === 'draw' ? 'active' : ''} onClick={() => setTool('draw')} title="Free Draw">
        🖌
      </button>
      <button onClick={() => alert('Add page logic here')} title="Add Page">
        ➕
      </button>
      <button onClick={() => alert('Delete page logic here')} title="Delete Page">
        ➖
      </button>
    </div>
  );
}

export default ToolBar;

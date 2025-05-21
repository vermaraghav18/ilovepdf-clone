import React from 'react';
import TextOverlay from './TextOverlay';
import ImageOverlay from './ImageOverlay';
import HighlightOverlay from './HighlightOverlay';
import '../styles/overlays.css';

function OverlayManager({ tool, overlays, addOverlay, removeOverlay }) {
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const id = Date.now();

    if (tool === 'text') {
      addOverlay({ id, type: 'text', x, y, text: 'New Text', fontSize: 14, color: '#000' });
    } else if (tool === 'image') {
      const imageUrl = prompt('Enter image URL');
      if (imageUrl) {
        addOverlay({ id, type: 'image', x, y, url: imageUrl, width: 100, height: 100 });
      }
    } else if (tool === 'highlight') {
      addOverlay({ id, type: 'highlight', x, y, width: 150, height: 30, color: 'yellow' });
    } else if (tool === 'erase') {
      addOverlay({ id, type: 'erase', x, y, width: 150, height: 30 });
    }
    // drawing tool is handled separately
  };

  return (
    <div className="overlay-layer" onClick={handleClick}>
      {overlays.map((overlay) => {
        switch (overlay.type) {
          case 'text':
            return <TextOverlay key={overlay.id} data={overlay} remove={removeOverlay} />;
          case 'image':
            return <ImageOverlay key={overlay.id} data={overlay} remove={removeOverlay} />;
          case 'highlight':
            return <HighlightOverlay key={overlay.id} data={overlay} remove={removeOverlay} />;
          case 'erase':
            return (
              <div
                key={overlay.id}
                className="eraser-box"
                style={{
                  top: overlay.y,
                  left: overlay.x,
                  width: overlay.width,
                  height: overlay.height,
                }}
              >
                <button className="remove-btn" onClick={() => removeOverlay(overlay.id)}>×</button>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

export default OverlayManager;

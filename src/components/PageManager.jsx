import React from 'react';

function PageManager({ addOverlay }) {
  const handleRotate = () => {
    addOverlay({
      type: 'rotate',
      page: 1,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      properties: { angle: 90 },
    });
  };

  const handleAddPage = () => {
    addOverlay({
      type: 'addPage',
      page: 1,
      x: 0,
      y: 0,
      width: 600,
      height: 800,
      properties: {},
      index: 1, // insert after page 1 (adjust as needed)
    });
  };

  const handleDeletePage = () => {
    addOverlay({
      type: 'delete',
      page: 1,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      properties: {},
    });
  };

  return (
    <div className="page-manager">
      <button onClick={handleRotate}>Rotate Page</button>
      <button onClick={handleAddPage}>Add Page</button>
      <button onClick={handleDeletePage}>Delete Page</button>
    </div>
  );
}

export default PageManager;

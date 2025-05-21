import React, { useRef, useState, useEffect } from 'react';
import '../styles/overlays.css';

function DrawCanvas({ tool }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [context, setContext] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000';
      ctx.lineJoin = 'round';
      setContext(ctx);
    }
  }, []);

  const getCoordinates = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseDown = (e) => {
    if (tool !== 'draw') return;
    setDrawing(true);
    const { x, y } = getCoordinates(e);
    context.beginPath();
    context.moveTo(x, y);
  };

  const handleMouseMove = (e) => {
    if (!drawing || tool !== 'draw') return;
    const { x, y } = getCoordinates(e);
    context.lineTo(x, y);
    context.stroke();
  };

  const handleMouseUp = () => {
    if (drawing) {
      setDrawing(false);
      context.closePath();
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="draw-canvas"
      width={600}
      height={800}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
}

export default DrawCanvas;

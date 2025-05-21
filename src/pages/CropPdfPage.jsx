// src/pages/IframeCropPdfPage.jsx
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CropPdfPage.css';

function IframeCropPdfPage() {
  const [pdfFile, setPdfFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [cropBox, setCropBox] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (pdfFile) {
      setPreviewUrl(URL.createObjectURL(pdfFile));
    }
  }, [pdfFile]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setCropBox(null);
    }
  };

  const handleMouseDown = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    setStartPoint({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e) => {
    if (!startPoint) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    setCropBox({
      x: Math.min(startPoint.x, currentX),
      y: Math.min(startPoint.y, currentY),
      width: Math.abs(currentX - startPoint.x),
      height: Math.abs(currentY - startPoint.y),
    });
  };

  const handleMouseUp = () => {
    setStartPoint(null);
  };

  const handleCrop = async () => {
  if (!cropBox || !pdfFile || !containerRef.current) return;

  const previewWidth = containerRef.current.clientWidth;
  const previewHeight = containerRef.current.clientHeight;

  const formData = new FormData();
  formData.append('pdf', pdfFile);
  formData.append('cropBox', JSON.stringify(cropBox));
  formData.append('previewSize', JSON.stringify({ width: previewWidth, height: previewHeight }));

  const res = await axios.post('http://localhost:5000/crop-pdf', formData, {
    responseType: 'blob',
  });

  const blob = new Blob([res.data], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'cropped.pdf';
  link.click();
};

  return (
    <div className="crop-container">
      <h2>Crop PDF with Iframe Preview</h2>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />
      {previewUrl && (
        <div
          className="iframe-wrapper"
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <iframe
            src={previewUrl}
            width="600"
            height="800"
            title="PDF Preview"
            className="pdf-iframe"
          />
          {cropBox && (
            <div
              className="crop-box"
              style={{
                left: cropBox.x,
                top: cropBox.y,
                width: cropBox.width,
                height: cropBox.height,
              }}
            />
          )}
        </div>
      )}
      {cropBox && <button onClick={handleCrop}>Crop PDF</button>}
    </div>
  );
}

export default IframeCropPdfPage;

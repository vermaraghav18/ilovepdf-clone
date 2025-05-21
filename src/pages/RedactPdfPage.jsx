import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import '../styles/RedactPdfPage.css';

// Fix worker path
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`;

function RedactPdfPage() {
  const [pdfFile, setPdfFile] = useState(null);
  const [redactions, setRedactions] = useState([]);
  const [tool, setTool] = useState('redact');
  const [startPoint, setStartPoint] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const containerRef = useRef();

  const handleUpload = (e) => {
    setRedactions([]);
    setPdfFile(e.target.files[0]);
  };

  const handleMouseDown = (e) => {
    if (tool !== 'redact') return;
    const rect = containerRef.current.getBoundingClientRect();
    setStartPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseUp = (e) => {
    if (!startPoint || tool !== 'redact') return;
    const rect = containerRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const x = Math.min(startPoint.x, endX);
    const y = Math.min(startPoint.y, endY);
    const width = Math.abs(startPoint.x - endX);
    const height = Math.abs(startPoint.y - endY);

    setRedactions((prev) => [...prev, { pageIndex: 0, x, y, width, height }]);
    setStartPoint(null);
  };

  const handleClick = (e) => {
    if (tool !== 'erase') return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const filtered = redactions.filter(
      (r) => !(x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height)
    );
    setRedactions(filtered);
  };

  const handleRedact = async () => {
    const formData = new FormData();
    formData.append('file', pdfFile);
    formData.append('redactions', JSON.stringify(redactions));

    const res = await axios.post('http://localhost:5000/api/redact', formData, {
      responseType: 'blob',
    });

    const blob = new Blob([res.data], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'redacted.pdf';
    link.click();
  };

  return (
    <div className="redact-page">
      <h2>PDF Redaction Tool</h2>
      <div className="tools">
        <input type="file" accept="application/pdf" onChange={handleUpload} />
        <button onClick={() => setTool('redact')} className={tool === 'redact' ? 'active' : ''}>Redact Tool</button>
        <button onClick={() => setTool('erase')} className={tool === 'erase' ? 'active' : ''}>Eraser Tool</button>
        <button onClick={handleRedact}>Redact PDF</button>
      </div>

      {pdfFile && (
        <div
          ref={containerRef}
          className="pdf-container"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onClick={handleClick}
        >
          <div className="preview-wrapper">
          <iframe
            src={URL.createObjectURL(pdfFile)}
            title="PDF Preview"
            width="600"
            height="800"
            className="pdf-frame"
          ></iframe>

          <div
            ref={containerRef}
            className="overlay"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={handleClick}
          >
            {redactions.map((r, idx) => (
              <div
                key={idx}
                className="redaction-box"
                style={{
                  left: r.x,
                  top: r.y,
                  width: r.width,
                  height: r.height,
                }}
              />
            ))}
          </div>
        </div>

          {redactions.map((r, idx) => (
            <div
              key={idx}
              className="redaction-box"
              style={{ left: r.x, top: r.y, width: r.width, height: r.height }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default RedactPdfPage;

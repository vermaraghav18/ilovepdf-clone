// src/pages/PdfToPdfAPage.jsx
import React, { useState } from 'react';
import '../styles/ComponentStyles.css';

function PdfToPdfAPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(`📂 Selected file: ${file?.name}`);
  };

  const handleConvertClick = () => {
    if (!selectedFile) {
      setMessage('❌ Please select a PDF file to convert to PDF/A.');
      return;
    }

    setMessage('🗃️ Converting to PDF/A...');
    setTimeout(() => {
      setMessage(`✅ "${selectedFile.name}" converted to PDF/A (archival format)! (Simulation)`);
    }, 2000);
  };

  return (
    <div className="tool-page">
      <h2>PDF to PDF/A</h2>
      <p>Convert your PDF into the ISO-standardized PDF/A format for long-term archiving.</p>
      <div className="upload-section">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button className="upload-button" onClick={handleConvertClick}>Convert to PDF/A</button>
      </div>

      {message && (
        <div className="upload-feedback">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default PdfToPdfAPage;

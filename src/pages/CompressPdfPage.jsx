// src/pages/CompressPdfPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function CompressPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState('recommended');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(file ? `📂 Selected file: ${file.name}` : '');
  };

  const handleCompressClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a PDF file to compress.');
      return;
    }

    setMessage('📉 Compressing PDF...');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('level', compressionLevel); // send compression level

    try {
      const response = await axios.post('http://localhost:5000/compress', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'compressed.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage(`✅ Successfully compressed "${selectedFile.name}"! Downloading...`);
    } catch (error) {
      console.error(error);
      setMessage('❌ Something went wrong while compressing the PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="merge-pdf-container">
      <h2 className="page-heading">Compress Your PDF</h2>

      <label htmlFor="file-input" className="custom-upload-box">
        📁 Drag & Drop or Click to Upload PDF
      </label>
      <input
        id="file-input"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="file-input hidden-input"
      />

      <div className="compression-options">
        <div
          className={`compression-choice ${compressionLevel === 'extreme' ? 'active' : ''}`}
          onClick={() => setCompressionLevel('extreme')}
        >
          <h4>Extreme Compression</h4>
          <p>Less quality, high compression</p>
        </div>

        <div
          className={`compression-choice ${compressionLevel === 'recommended' ? 'active' : ''}`}
          onClick={() => setCompressionLevel('recommended')}
        >
          <h4>Recommended Compression</h4>
          <p>Good quality, good compression</p>
        </div>
      </div>

      <p className="message">{message}</p>

      <button
        className="merge-btn compress-btn"
        onClick={handleCompressClick}
        disabled={loading}
      >
        {loading ? 'Compressing...' : 'Compress PDF'}
      </button>

      {loading && <div className="loading-spinner"></div>}
    </div>
  );
}

export default CompressPdfPage;

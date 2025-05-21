// src/pages/SplitPdfPage.jsx
import React, { useState } from 'react';
import '../styles/ComponentStyles.css';
import axios from 'axios';

function SplitPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [splitMode, setSplitMode] = useState('');
  const [range, setRange] = useState('');
  const [pages, setPages] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(file ? `📂 Selected file: ${file.name}` : '');
  };

  const handleSplitClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a PDF file to split.');
      return;
    }

    if (splitMode === 'range' && !range) {
      setMessage('❌ Please enter a valid page range.');
      return;
    }

    if (splitMode === 'pages' && !pages) {
      setMessage('❌ Please enter specific pages.');
      return;
    }

    setMessage('⚙️ Splitting file...');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('mode', splitMode);
    if (splitMode === 'range') formData.append('range', range);
    if (splitMode === 'pages') formData.append('pages', pages);

    try {
      const response = await axios.post('http://localhost:5000/split', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'split_pages.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage(`✅ Successfully split "${selectedFile.name}"! Downloading...`);
    } catch (error) {
      console.error(error);
      setMessage('❌ Something went wrong while splitting the PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="merge-pdf-container">
      <h2 className="page-heading">Split PDF</h2>

      <label htmlFor="split-upload" className="custom-upload-box">
        📎 Drag & Drop or Click to Upload PDF
      </label>
      <input
        id="split-upload"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="file-input"
      />

      {selectedFile && (
        <div className="split-options">
          <button 
            className={`split-btn ${splitMode === 'range' ? 'active' : ''}`} 
            onClick={() => setSplitMode('range')}
          >
            Split by Range
          </button>
          <button 
            className={`split-btn ${splitMode === 'pages' ? 'active' : ''}`} 
            onClick={() => setSplitMode('pages')}
          >
            Split by Pages
          </button>
        </div>
      )}

      {splitMode === 'range' && (
        <input
          type="text"
          placeholder="e.g. 2-5"
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="range-input"
        />
      )}

      {splitMode === 'pages' && (
        <input
          type="text"
          placeholder="e.g. 1,3,5"
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          className="range-input"
        />
      )}

      <p className="message">{message}</p>

      <button
        className="merge-btn"
        onClick={handleSplitClick}
        disabled={loading}
      >
        {loading ? 'Splitting...' : 'Split PDF'}
      </button>

      {loading && <div className="loading-spinner"></div>}
    </div>
  );
}

export default SplitPdfPage;

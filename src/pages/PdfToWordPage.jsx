// src/pages/PdfToWordPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function PdfToWordPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(file ? `📂 Selected file: ${file.name}` : '');
  };

  const handleConvertClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a PDF file to convert.');
      return;
    }

    setMessage('⚙️ Converting PDF to Word...');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/convert-pdf-to-word', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'converted_document.docx';
      link.click();

      setMessage('✅ Successfully converted the PDF to Word!');
    } catch (error) {
      console.error(error);
      setMessage('❌ Conversion failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="merge-pdf-container">
      <h2 className="page-heading">Convert PDF to Word</h2>

      <label htmlFor="file-input-word" className="custom-upload-box">
        📁 Drag & Drop or Click to Upload PDF
      </label>
      <input
        id="file-input-word"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="file-input hidden-input"
      />

      <p className="message">{message}</p>

      <button
        className="merge-btn"
        onClick={handleConvertClick}
        disabled={loading}
      >
        {loading ? 'Converting...' : 'Convert to Word'}
      </button>

      {loading && <div className="loading-spinner"></div>}
    </div>
  );
}

export default PdfToWordPage;

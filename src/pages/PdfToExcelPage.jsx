// src/pages/PdfToExcelPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/PdfToExcel.css';

function PdfToExcelPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setMessage('❌ Please select a PDF file.');
      return;
    }

    setLoading(true);
    setMessage('⏳ Converting... Please wait.');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await axios.post('http://localhost:5000/convert-pdf-to-excel', formData, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'converted.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage('✅ Excel file downloaded!');
    } catch (err) {
      console.error(err);
      setMessage('❌ Conversion failed. Please check the file or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pdf-to-excel-container">
      <h2>📄 Convert PDF to Excel</h2>

      <label htmlFor="pdf-upload" className="upload-box">
        {file ? file.name : '📁 Click or Drag to Upload PDF'}
      </label>
      <input
        id="pdf-upload"
        type="file"
        accept="application/pdf"
        onChange={e => setFile(e.target.files[0])}
        className="hidden-input"
      />

      <button className="convert-btn" onClick={handleUpload} disabled={loading}>
        {loading ? 'Converting...' : 'Convert to Excel'}
      </button>

      <p className="conversion-message">{message}</p>
    </div>
  );
}

export default PdfToExcelPage;

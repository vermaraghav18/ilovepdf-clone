import React, { useState } from 'react';
import axios from 'axios';
import '../styles/OcrPdf.css'; // Make sure to place OcrPdf.css inside /styles

const OCRPdfPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage(`📂 Selected file: ${e.target.files[0]?.name}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!file) {
      setMessage('❌ Please upload a PDF.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file); // ✅ Correct key for multer
  
    setLoading(true);
    setMessage('🔍 Performing OCR on PDF...');
  
    try {
      const response = await axios.post('http://localhost:5000/ocr-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'text', // expects plain text
      });
  
      const blob = new Blob([response.data], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'ocr_output.txt';
      link.click();
  
      setMessage('✅ OCR complete! Downloading text file...');
    } catch (error) {
      console.error('Error performing OCR:', error);
      setMessage('❌ Failed to perform OCR. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="merge-pdf-container">
      <h2 className="page-heading">OCR – Convert PDF to Text</h2>
      <p className="message">Upload a scanned PDF to extract text using Optical Character Recognition (OCR).</p>

      <form onSubmit={handleSubmit} className="file-upload-container">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="file-input"
          required
        />
        <button
          type="submit"
          className="merge-btn"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Perform OCR'}
        </button>
      </form>

      {loading && <div className="loading-spinner"></div>}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default OCRPdfPage;

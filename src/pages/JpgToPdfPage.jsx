import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function JpgToPdfPage() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setMessage(`🖼 Selected ${files.length} image(s)`);
  };

  const handleConvertClick = async () => {
    if (selectedFiles.length === 0) {
      setMessage('❌ Please select JPG images.');
      return;
    }

    setMessage('📄 Converting images to PDF...');
    setLoading(true);

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('files', file));

    try {
      const response = await axios.post('http://localhost:5000/convert-multiple-jpg-to-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'combined_images.pdf';
      link.click();
      URL.revokeObjectURL(url);

      setMessage(`✅ Successfully converted ${selectedFiles.length} image(s) to PDF!`);
    } catch (error) {
      console.error('Conversion failed:', error);
      setMessage('❌ Failed to convert images to PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="merge-pdf-container">
      <h2 className="page-heading">Multiple JPGs to PDF</h2>

      <label htmlFor="jpg-upload" className="custom-upload-box">
        🖼 Drag & Drop or Click to Upload JPGs
      </label>
      <input
        id="jpg-upload"
        type="file"
        accept="image/jpeg"
        multiple
        onChange={handleFileChange}
        className="file-input hidden-input"
      />

      <p className="message">{message}</p>

      <button className="merge-btn" onClick={handleConvertClick} disabled={loading}>
        {loading ? 'Converting...' : 'Convert All to PDF'}
      </button>

      {loading && <div className="loading-spinner"></div>}
    </div>
  );
}

export default JpgToPdfPage;

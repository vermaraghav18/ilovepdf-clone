import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function PdfToJpgPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(`📂 Selected file: ${file?.name}`);
  };

  const handleConvertClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a PDF file to convert.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setMessage('⚙️ Converting PDF to JPG...');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/convert-pdf-to-jpg', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/zip' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'converted_images.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl); // ✅ Free memory

      setMessage(`✅ Successfully converted "${selectedFile.name}" to JPG images (ZIP).`);
    } catch (error) {
      console.error(error);
      setMessage('❌ Something went wrong while converting the PDF to JPG.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="merge-pdf-container">
      <h2 className="page-heading">PDF to JPG</h2>

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

      <p className="message">{message}</p>

      <button className="merge-btn" onClick={handleConvertClick} disabled={loading}>
        {loading ? 'Converting...' : 'Convert to JPG (ZIP)'}
      </button>

      {loading && <div className="loading-spinner"></div>}
    </div>
  );
}

export default PdfToJpgPage;

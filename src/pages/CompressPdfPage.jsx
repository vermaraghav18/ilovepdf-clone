// src/pages/CompressPdfPage.jsx
import React, { useState } from 'react';
import axios from 'axios';  // Import axios for API requests
import '../styles/ComponentStyles.css';

function CompressPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(`📂 Selected file: ${file?.name}`);
  };

  const handleCompressClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a PDF file to compress.');
      return;
    }

    setMessage('📉 Compressing PDF...');
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/compress', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob', // Expecting a binary file (compressed PDF)
      });

      // Create a URL for the blob response
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'compressed.pdf'); // Set file name for download
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage(`✅ Successfully compressed "${selectedFile.name}"! Downloading...`);
    } catch (error) {
      console.error(error);
      setMessage('❌ Something went wrong while compressing the PDF.');
    }
  };

  return (
    <div className="tool-page">
      <h2>Compress PDF</h2>
      <p>Reduce the size of your PDF files without losing quality.</p>
      <div className="upload-section">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button className="upload-button" onClick={handleCompressClick}>Compress PDF</button>
      </div>

      {message && (
        <div className="upload-feedback">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default CompressPdfPage;

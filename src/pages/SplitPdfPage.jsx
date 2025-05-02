import React, { useState } from 'react';
import '../styles/ComponentStyles.css';
import axios from 'axios';

function SplitPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(`📂 Selected file: ${file?.name}`);
  };

  const handleSplitClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a PDF file to split.');
      return;
    }

    setMessage('⚙️ Splitting file...');
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/split', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob', // Expecting a zip file of split PDFs
      });

      // Create a URL for the zip file (split PDFs)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'split_pages.zip'); // Set file name for download
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage(`✅ Successfully split "${selectedFile.name}"! Downloading...`);
    } catch (error) {
      console.error(error);
      setMessage('❌ Something went wrong while splitting the PDF.');
    }
  };

  return (
    <div className="tool-page">
      <h2>Split PDF</h2>
      <p>Upload a PDF and split it into multiple files or select specific pages.</p>
      <div className="upload-section">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button className="upload-button" onClick={handleSplitClick}>Split PDF</button>
      </div>

      {message && (
        <div className="upload-feedback">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default SplitPdfPage;

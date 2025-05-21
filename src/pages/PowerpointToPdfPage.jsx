import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function PowerpointToPdfPage() {
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
      setMessage('❌ Please select a PowerPoint file to convert.');
      return;
    }

    setMessage('📄 Converting PowerPoint to PDF...');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/convert-powerpoint-to-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      const blob = response.data;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'converted.pdf';
      link.click();

      setMessage(`✅ Successfully converted "${selectedFile.name}" to PDF!`);
    } catch (error) {
      console.error('Error during conversion:', error);
      setMessage('❌ Something went wrong while converting the PowerPoint to PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="merge-pdf-container">
      <h2 className="page-heading">PowerPoint to PDF</h2>
      <div className="file-upload-container">
        <input
          type="file"
          accept=".ppt,.pptx,application/vnd.ms-powerpoint"
          onChange={handleFileChange}
          className="file-input"
        />
        <p className="message">{message}</p>
      </div>

      <button
        className="merge-btn"
        onClick={handleConvertClick}
        disabled={loading}
      >
        {loading ? 'Converting...' : 'Convert to PDF'}
      </button>

      {loading && <div className="loading-spinner"></div>}
    </div>
  );
}

export default PowerpointToPdfPage;

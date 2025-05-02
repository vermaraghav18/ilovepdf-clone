import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function WordToPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(`📂 Selected file: ${file?.name}`);
  };

  const handleConvertClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a Word file to convert.');
      return;
    }

    setMessage('📊 Converting Word to PDF...');
    setIsLoading(true); // Start loading

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/convert-word-to-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'converted.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage(`✅ Successfully converted "${selectedFile.name}" to PDF!`);
    } catch (error) {
      console.error('Error during conversion:', error);
      setMessage('❌ Something went wrong while converting the Word to PDF.');
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="tool-page">
      <h2>Word to PDF</h2>
      <p>Convert Word documents into PDF files.</p>
      <div className="upload-section">
        <input
          type="file"
          accept=".docx"
          onChange={handleFileChange}
        />
        <button
          className="upload-button"
          onClick={handleConvertClick}
          disabled={isLoading}
        >
          {isLoading ? 'Converting...' : 'Convert to PDF'}
        </button>
      </div>

      {message && (
        <div className="upload-feedback">
          <p>{message}</p>
        </div>
      )}

      {isLoading && (
        <div className="loading-spinner">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}

export default WordToPdfPage;

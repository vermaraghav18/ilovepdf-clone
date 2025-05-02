import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function PdfToPowerpointPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [isConverting, setIsConverting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(`📂 Selected file: ${file?.name}`);
    setProgress(0);
  };

  const handleConvertClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a PDF file to convert.');
      return;
    }

    setIsConverting(true);
    setMessage('⚙️ Converting PDF to PowerPoint...');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
        'http://localhost:5000/convert-to-powerpoint',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          responseType: 'blob',
          timeout: 120000, // 2 minutes timeout
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'converted.pptx');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage(`✅ Successfully converted "${selectedFile.name}" to PowerPoint!`);
    } catch (error) {
      console.error('Conversion error:', error);
      if (error.code === 'ECONNABORTED') {
        setMessage('❌ Conversion timed out. Please try a smaller file.');
      } else {
        setMessage('❌ Conversion failed. ' + (error.response?.data || error.message));
      }
    } finally {
      setIsConverting(false);
      setProgress(100);
    }
  };

  return (
    <div className="tool-page">
      <h2>Convert PDF to PowerPoint</h2>
      <p>Upload a PDF and convert it into a PowerPoint presentation.</p>
      
      <div className="upload-section">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={isConverting}
        />
        <button
          className="upload-button"
          onClick={handleConvertClick}
          disabled={!selectedFile || isConverting}
        >
          {isConverting ? 'Converting...' : 'Convert PDF to PowerPoint'}
        </button>
      </div>

      {progress > 0 && (
        <div className="progress-bar">
          <div style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {message && (
        <div className="upload-feedback">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default PdfToPowerpointPage;
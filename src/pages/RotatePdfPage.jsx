import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function RotatePdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [rotationDirection, setRotationDirection] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(`📄 Selected: ${file?.name}`);
  };

  const handleRotate = async () => {
    if (!selectedFile || !rotationDirection) {
      setMessage('❌ Please upload a PDF and select rotation direction.');
      return;
    }

    setLoading(true);
    setMessage('🔁 Rotating PDF...');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('direction', rotationDirection);

    try {
      const response = await axios.post('http://localhost:5000/rotate-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'rotated.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage('✅ Successfully rotated and downloaded the PDF.');
    } catch (error) {
      console.error('Error rotating PDF:', error);
      setMessage('❌ Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="merge-pdf-container">
      <h2 className="page-heading">Rotate PDF</h2>

      <label htmlFor="pdf-upload" className="custom-upload-box">
        📁 Click or Drag to Upload PDF
      </label>
      <input
        id="pdf-upload"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="file-input hidden-input"
      />

      {selectedFile && (
        <iframe
          src={URL.createObjectURL(selectedFile)}
          title="PDF Preview"
          width="100%"
          height="400px"
          className="pdf-preview"
        />
      )}

      {selectedFile && (
        <div className="rotate-buttons">
          <button
            className={`split-btn ${rotationDirection === 'left' ? 'active' : ''}`}
            onClick={() => setRotationDirection('left')}
          >
            ⬅️ Rotate Left
          </button>
          <button
            className={`split-btn ${rotationDirection === 'right' ? 'active' : ''}`}
            onClick={() => setRotationDirection('right')}
          >
            ➡️ Rotate Right
          </button>
        </div>
      )}

      <p className="message">{message}</p>

      <button
        className="merge-btn"
        onClick={handleRotate}
        disabled={loading}
      >
        {loading ? 'Rotating...' : 'Rotate PDF'}
      </button>

      {loading && <div className="loading-spinner"></div>}
    </div>
  );
}

export default RotatePdfPage;

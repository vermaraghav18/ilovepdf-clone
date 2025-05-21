import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

const ScanToPdfPage = () => {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setMessage(`🖼 Selected image: ${file.name}`);
    }
  };

  // Convert image to PDF
  const convertToPdf = async () => {
    if (!image) {
      setMessage('❌ Please upload an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    setLoading(true);
    setMessage('⚙️ Converting image to PDF...');

    try {
      const response = await axios.post('http://localhost:5000/scan-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'scanned_document.pdf';
      link.click();

      setMessage('✅ Successfully converted image to PDF!');
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Failed to convert image to PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="merge-pdf-container">
      <h2 className="page-heading">Image to Scanned PDF</h2>
      <p className="message">Upload an image to convert it into a scanned-style PDF.</p>

      <div className="file-upload-container">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input"
        />
      </div>

      <button
        className="merge-btn"
        onClick={convertToPdf}
        disabled={loading}
      >
        {loading ? 'Converting...' : 'Convert to PDF'}
      </button>

      {loading && <div className="loading-spinner"></div>}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ScanToPdfPage;

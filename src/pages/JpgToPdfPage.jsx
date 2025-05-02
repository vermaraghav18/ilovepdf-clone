import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function JpgToPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setMessage(`🖼 Selected file: ${file.name}`);
    }
  };

  // Handle conversion on button click
  const handleConvertClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setMessage('📄 Converting image to PDF...');

    try {
      // Sending the image file to the backend for conversion
      const response = await axios.post('http://localhost:5000/convert-jpg-to-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      // Create a link to download the PDF after conversion
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = 'converted_image.pdf';
      link.click();

      // Provide feedback to the user
      setMessage('✅ Successfully converted to PDF!');
    } catch (error) {
      console.error('Error converting JPG to PDF:', error);
      setMessage('❌ Conversion failed. Please try again.');
    }
  };

  return (
    <div className="tool-page">
      <h2>JPG to PDF</h2>
      <p>Convert JPG/PNG images into a PDF document.</p>
      <div className="upload-section">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button className="upload-button" onClick={handleConvertClick}>
          Convert to PDF
        </button>
      </div>

      {message && (
        <div className="upload-feedback">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default JpgToPdfPage;

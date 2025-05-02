import React, { useState } from 'react';
import axios from 'axios';

function WatermarkPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(`📂 Selected file: ${file?.name}`);
  };

  const handleWatermarkTextChange = (e) => {
    setWatermarkText(e.target.value);
  };

  const handleConvertClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a PDF file to add a watermark.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('watermark', watermarkText);  // Add watermark text to form data

    setMessage('⚙️ Adding watermark to PDF...');

    try {
      const response = await axios.post('http://localhost:5000/add-watermark', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob', // Expect PDF file as a Blob
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = 'watermarked_pdf.pdf';  // PDF filename
      link.click();

      setMessage('✅ Successfully added watermark to PDF!');
    } catch (error) {
      console.error('Error adding watermark:', error);
      setMessage('❌ Something went wrong while adding the watermark.');
    }
  };

  return (
    <div className="tool-page">
      <h2>Add Watermark to PDF</h2>
      <p>Upload a PDF file and add a watermark text to it.</p>

      <div className="upload-section">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="Enter watermark text"
          value={watermarkText}
          onChange={handleWatermarkTextChange}
        />
        <button className="upload-button" onClick={handleConvertClick}>
          Add Watermark
        </button>
      </div>

      {message && <div className="upload-feedback"><p>{message}</p></div>}
    </div>
  );
}

export default WatermarkPdfPage;

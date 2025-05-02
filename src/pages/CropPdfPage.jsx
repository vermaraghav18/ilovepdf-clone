import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function CropPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(`📂 Selected file: ${file?.name}`);
  };

  const handleConvertClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a PDF file to crop.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setMessage('⚙️ Cropping PDF...');

    try {
      // Sending the PDF file to the backend for cropping
      const response = await axios.post('http://localhost:5000/crop-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      // Create a link to download the cropped PDF after conversion
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = 'cropped_document.pdf';
      link.click();

      // Provide feedback to the user
      setMessage('✅ Successfully cropped the PDF!');
    } catch (error) {
      console.error(error);
      setMessage('❌ Conversion failed. Please try again.');
    }
  };

  return (
    <div className="tool-page">
      <h2>Crop PDF</h2>
      <p>Upload a PDF, and we will crop it to your desired size.</p>

      <div className="upload-section">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button className="upload-button" onClick={handleConvertClick}>
          Crop PDF
        </button>
      </div>

      {message && <div className="upload-feedback"><p>{message}</p></div>}
    </div>
  );
}

export default CropPdfPage;

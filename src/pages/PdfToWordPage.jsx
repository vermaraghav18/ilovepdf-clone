import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function PdfToWordPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(`📂 Selected file: ${file?.name}`);
  };

  // Handle conversion on button click
  const handleConvertClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a PDF file to convert.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setMessage('⚙️ Converting PDF to Word...');

    try {
      // Sending the PDF file to the backend for conversion
      const response = await axios.post('http://localhost:5000/convert-pdf-to-word', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      // Create a link to download the Word document after conversion
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = 'converted_document.docx';
      link.click();

      // Provide feedback to the user
      setMessage('✅ Successfully converted the PDF to Word!');
    } catch (error) {
      console.error(error);
      setMessage('❌ Conversion failed. Please try again.');
    }
  };

  return (
    <div className="tool-page">
      <h2>Convert PDF to Word</h2>
      <p>Upload a PDF, and we will convert it to a Word document.</p>

      <div className="upload-section">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button className="upload-button" onClick={handleConvertClick}>
          Convert to Word
        </button>
      </div>

      {message && <div className="upload-feedback"><p>{message}</p></div>}
    </div>
  );
}

export default PdfToWordPage;

import React, { useState } from 'react';
import axios from 'axios';

const OCRPdfPage = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload a PDF.");
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await axios.post('http://localhost:5000/ocr-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // Handling binary file response
      });

      // Create a download link for the OCR text file
      const blob = new Blob([response.data], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'ocr_output.txt';
      link.click();
    } catch (error) {
      console.error('Error performing OCR:', error);
      alert('Failed to perform OCR. Please try again.');
    }
  };

  return (
    <div>
      <h1>Perform OCR on PDF</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Perform OCR</button>
      </form>
    </div>
  );
};

export default OCRPdfPage;

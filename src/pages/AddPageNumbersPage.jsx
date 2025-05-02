import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';  // Add your own CSS path if needed

function AddPageNumbersPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  // Handle file selection for adding page numbers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(`📂 Selected file: ${file?.name}`);
  };

  // Handle add page numbers click
  const handleAddPageNumbersClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a file to add page numbers.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setMessage('⚙️ Adding page numbers to PDF...');

    try {
      const response = await axios.post('http://localhost:5000/add-page-numbers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob', // Expect PDF file as a Blob
      });

      // Create a link to download the modified PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = 'pdf_with_page_numbers.pdf';
      link.click();

      setMessage('✅ Page numbers added successfully!');
    } catch (error) {
      console.error('Error adding page numbers to PDF:', error);
      setMessage('❌ Adding page numbers failed. Please try again.');
    }
  };

  return (
    <div className="tool-page">
      <h2>Add Page Numbers to PDF</h2>
      <p>Upload a PDF and add page numbers to it.</p>

      <div className="upload-section">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button className="upload-button" onClick={handleAddPageNumbersClick}>
          Add Page Numbers
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

export default AddPageNumbersPage;

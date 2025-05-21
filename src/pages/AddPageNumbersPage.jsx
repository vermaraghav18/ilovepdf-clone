import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function AddPageNumbersPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(`📂 Selected file: ${file?.name}`);
  };

  const handleAddPageNumbersClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a file to add page numbers.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setMessage('⚙️ Adding page numbers to PDF...');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/add-page-numbers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pdf_with_page_numbers.pdf';
      link.click();

      setMessage('✅ Page numbers added successfully!');
    } catch (error) {
      console.error('Error adding page numbers to PDF:', error);
      setMessage('❌ Adding page numbers failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="merge-pdf-container">
      <h2 className="page-heading">Add Page Numbers</h2>
      <p className="message">Upload a PDF to automatically insert page numbers in sequence.</p>

      <div className="file-upload-container">
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="file-input" />
      </div>

      <button className="merge-btn" onClick={handleAddPageNumbersClick} disabled={loading}>
        {loading ? 'Adding Page Numbers...' : 'Add Page Numbers'}
      </button>

      {loading && <div className="loading-spinner"></div>}
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default AddPageNumbersPage;

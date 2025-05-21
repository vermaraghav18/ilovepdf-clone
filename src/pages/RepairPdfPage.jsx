import React, { useState } from 'react';
import axios from 'axios';
import '../styles/RepairPdf.css'; // 👈 Make sure this path matches your project

function RepairPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setMessage(`📂 Selected file: ${e.target.files[0]?.name}`);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a PDF file to repair.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setMessage('🔧 Repairing PDF...');
      setLoading(true);
      const response = await axios.post('http://localhost:5000/repair-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'repaired_output.pdf';
      link.click();

      setMessage('✅ PDF repaired successfully!');
    } catch (error) {
      console.error('Error repairing PDF:', error);
      setMessage('❌ Failed to repair PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="merge-pdf-container">
      <h2 className="page-heading">Repair PDF</h2>
      <p className="message">Fix corrupted or unreadable PDF files for smooth access.</p>

      <div className="file-upload-container">
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="file-input" />
      </div>

      <button className="merge-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Repairing...' : 'Repair PDF'}
      </button>

      {loading && <div className="loading-spinner"></div>}
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default RepairPdfPage;

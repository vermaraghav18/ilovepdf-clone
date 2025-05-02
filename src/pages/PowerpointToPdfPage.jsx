import React, { useState } from 'react';
import axios from 'axios';  // Import axios for making API calls
import '../styles/ComponentStyles.css';

function PowerpointToPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(`📂 Selected file: ${file?.name}`);
  };

  const handleConvertClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a PowerPoint file to convert.');
      return;
    }

    setMessage('📄 Converting PowerPoint to PDF...');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/convert-powerpoint-to-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // Ensure to receive the PDF as a Blob
      });

      // Create a link element to trigger the file download
      const blob = response.data;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'converted.pdf';  // Set the filename for the downloaded PDF
      link.click();

      setMessage(`✅ Successfully converted "${selectedFile.name}" to PDF!`);
    } catch (error) {
      console.error('Error during conversion:', error);
      setMessage('❌ Something went wrong while converting the PowerPoint to PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-page">
      <h2>PowerPoint to PDF</h2>
      <p>Convert your PowerPoint presentations to PDF documents.</p>
      <div className="upload-section">
        <input
          type="file"
          accept=".ppt,.pptx,application/vnd.ms-powerpoint"
          onChange={handleFileChange}
        />
        <button className="upload-button" onClick={handleConvertClick} disabled={loading}>
          {loading ? 'Converting...' : 'Convert to PDF'}
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

export default PowerpointToPdfPage;

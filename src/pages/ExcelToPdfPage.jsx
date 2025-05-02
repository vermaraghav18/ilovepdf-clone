import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function ExcelToPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);  // For loading state

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(`📂 Selected file: ${file?.name}`);
  };

  const handleConvertClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select an Excel file to convert.');
      return;
    }

    setMessage('⚙️ Converting file...');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Make the POST request to the backend
      const response = await axios.post('http://localhost:5000/convert-excel-to-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob', // To receive PDF as a Blob
      });

      // Create a URL for the PDF blob and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'converted.pdf');  // Name of the downloaded file
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage(`✅ Successfully converted "${selectedFile.name}" to PDF!`);
    } catch (error) {
      console.error(error);
      setMessage('❌ Something went wrong while converting the Excel file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-page">
      <h2>Excel to PDF</h2>
      <p>Upload an Excel file and convert it into a PDF.</p>

      <div className="upload-section">
        <input
          type="file"
          accept=".xls,.xlsx,application/vnd.ms-excel"
          onChange={handleFileChange}
        />
        <button className="upload-button" onClick={handleConvertClick} disabled={loading}>
          {loading ? 'Converting...' : 'Convert to PDF'}
        </button>
      </div>

      {message && <div className="upload-feedback"><p>{message}</p></div>}
    </div>
  );
}

export default ExcelToPdfPage;

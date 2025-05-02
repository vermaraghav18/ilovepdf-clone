import React, { useState } from 'react';
import axios from 'axios'; // Add axios to make API requests
import '../styles/ComponentStyles.css';

function PdfToExcelPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // To show loading spinner

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(`📂 Selected file: ${file?.name}`);
  };

  const handleConvertClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a PDF file to convert.');
      return;
    }

    setMessage('📊 Converting PDF to Excel...');
    setIsLoading(true); // Start loading

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/convert-pdf-to-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob', // Expect a file to be returned as a blob
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'converted.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage(`✅ Successfully converted "${selectedFile.name}" to Excel!`);
    } catch (error) {
      console.error('Error during conversion:', error);
      setMessage('❌ Something went wrong while converting the PDF to Excel.');
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="tool-page">
      <h2>PDF to Excel</h2>
      <p>Convert tables in PDFs into editable Excel spreadsheets.</p>
      <div className="upload-section">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        <button
          className="upload-button"
          onClick={handleConvertClick}
          disabled={isLoading} // Disable button during loading
        >
          {isLoading ? 'Converting...' : 'Convert to Excel'}
        </button>
      </div>

      {message && (
        <div className="upload-feedback">
          <p>{message}</p>
        </div>
      )}

      {isLoading && (
        <div className="loading-spinner">
          {/* You can replace this with a custom spinner if you prefer */}
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}

export default PdfToExcelPage;

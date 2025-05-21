import React, { useState } from 'react';
import axios from 'axios';
import '../styles/PdfToPowerpointPage.css';

function PdfToPowerpointPage() {
  const [file, setFile] = useState(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please upload a PDF file.');
      return;
    }

    try {
      setConverting(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:5000/api/convert-pdf-to-ppt', formData, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'converted.pptx';
      link.click();
    } catch (err) {
      console.error(err);
      setError('Failed to convert PDF to PowerPoint.');
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="ppt-page">
      <h2>Convert PDF to PowerPoint</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleConvert} disabled={converting}>
        {converting ? 'Converting...' : 'Convert to PPT'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default PdfToPowerpointPage;

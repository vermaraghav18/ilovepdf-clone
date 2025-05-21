// src/pages/ExcelToPdfPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ExcelToPdf.css';

function ExcelToPdfPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setMessage('❌ Please select an Excel file.');
      return;
    }

    setMessage('⏳ Converting to PDF...');

    const formData = new FormData();
    formData.append('excel', file);

    try {
      const res = await axios.post('http://localhost:5000/convert-excel-to-pdf', formData, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'converted.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage('✅ PDF downloaded!');
    } catch (err) {
      console.error(err);
      setMessage('❌ Conversion failed.');
    }
  };

  return (
    <div className="excel-to-pdf-container">
      <h2>Convert Excel to PDF</h2>
      <input type="file" accept=".xls,.xlsx" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Convert to PDF</button>
      <p>{message}</p>
    </div>
  );
}

export default ExcelToPdfPage;

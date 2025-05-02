import React, { useState } from 'react';
import axios from 'axios';

function RepairPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setMessage('Please select a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setMessage('Repairing PDF...');
      const response = await axios.post('http://localhost:5000/repair-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(response.data);
      link.download = 'repaired_output.pdf';
      link.click();

      setMessage('PDF repaired successfully!');
    } catch (error) {
      console.error('Error repairing PDF:', error);
      setMessage('Failed to repair PDF');
    }
  };

  return (
    <div>
      <h2>Repair PDF</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Repair PDF</button>
      <p>{message}</p>
    </div>
  );
}

export default RepairPdfPage;

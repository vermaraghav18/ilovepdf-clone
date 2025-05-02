import React, { useState } from 'react';
import axios from 'axios';

const UnlockPdfPage = () => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !password) {
      alert("Please upload a PDF and enter a password.");
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('password', password);

    try {
      const response = await axios.post('http://localhost:5000/unlock-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // Handling binary file response
      });

      // Create a download link for the unlocked PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'unlocked.pdf';
      link.click();
    } catch (error) {
      console.error('Error unlocking PDF:', error);
      alert('Failed to unlock PDF. Please try again.');
    }
  };

  return (
    <div>
      <h1>Unlock Your PDF</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          required
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Unlock PDF</button>
      </form>
    </div>
  );
};

export default UnlockPdfPage;

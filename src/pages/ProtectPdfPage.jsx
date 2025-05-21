// src/pages/ProtectPdfFile.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ProtectPdfStyles.css';

const ProtectPdfFile = () => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setMessage(`📂 Selected: ${selected?.name}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !password) {
      setMessage('❌ Please upload a PDF and enter a password.');
      return;
    }

    setMessage('🔒 Protecting PDF...');
    setLoading(true);

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('password', password);

    try {
      const response = await axios.post('http://localhost:5000/protect-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'protected.pdf';
      link.click();

      setMessage('✅ PDF protected and downloaded!');
    } catch (error) {
      console.error('Protection error:', error);
      setMessage('❌ Failed to protect PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="protect-pdf-container">
      <h2 className="page-heading">Protect PDF</h2>
      <p className="subtext">Add a password to your PDF to secure it from unauthorized access.</p>

      <form className="protect-form" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="input-field"
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />

        <button type="submit" className="protect-btn" disabled={loading}>
          {loading ? 'Protecting...' : 'Protect PDF'}
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default ProtectPdfFile;

import React, { useState } from 'react';
import axios from 'axios';
import '../styles/UnlockPdfStyles.css'; // ✅ Custom CSS

function UnlockPdfPage() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setMessage(`📂 Selected: ${selectedFile?.name}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !password) {
      setMessage('❌ Please upload a PDF and enter the correct password.');
      return;
    }

    setLoading(true);
    setMessage('🔓 Unlocking PDF...');

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('password', password);

    try {
      const response = await axios.post('http://localhost:5000/unlock-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'unlocked.pdf';
      link.click();

      setMessage('✅ PDF unlocked and downloaded!');
    } catch (err) {
      console.error('Error unlocking PDF:', err);
      setMessage('❌ Failed to unlock PDF. Check password or file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="unlock-pdf-container">
      <h2 className="page-heading">Unlock PDF</h2>
      <p>Remove password protection from your PDF using the correct password.</p>

      <form onSubmit={handleSubmit} className="unlock-form">
        <label htmlFor="pdf-upload" className="upload-box">
          📎 Click or Drag to Upload PDF
        </label>
        <input
          id="pdf-upload"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden-input"
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="password-input"
        />

        <button type="submit" className="unlock-btn" disabled={loading}>
          {loading ? 'Unlocking...' : 'Unlock PDF'}
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default UnlockPdfPage;

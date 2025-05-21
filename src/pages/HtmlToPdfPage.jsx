// src/pages/HtmlToPdfPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function HtmlToPdfPage() {
  const [htmlContent, setHtmlContent] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleHtmlChange = (e) => {
    setHtmlContent(e.target.value);
  };

  const handleConvertClick = async () => {
    if (!htmlContent.trim()) {
      setMessage('❌ Please enter some HTML content to convert.');
      return;
    }

    setMessage('⚙️ Converting HTML to PDF...');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/convert-html-to-pdf',
        { html: htmlContent },
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'converted.pdf';
      link.click();

      setMessage('✅ Successfully converted HTML to PDF!');
    } catch (error) {
      console.error('Error converting HTML to PDF:', error);
      setMessage('❌ Something went wrong while converting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="merge-pdf-container">
      <h2 className="page-heading">Convert HTML to PDF</h2>
      <p>Paste raw HTML code or enter a full website link (like https://example.com)</p>

      {/* Textarea Input */}
      <div className="html-input-container">
        <textarea
          placeholder="Paste HTML or enter a website URL..."
          value={htmlContent}
          onChange={handleHtmlChange}
          rows={12}
          className="html-textarea"
        />
      </div>

      {/* Message */}
      {message && <p className="message">{message}</p>}

      {/* Button */}
      <button
        className="merge-btn"
        onClick={handleConvertClick}
        disabled={loading}
      >
        {loading ? 'Converting...' : 'Convert to PDF'}
      </button>

      {loading && <div className="loading-spinner"></div>}
    </div>
  );
}

export default HtmlToPdfPage;

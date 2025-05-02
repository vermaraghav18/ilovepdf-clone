import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function HtmlToPdfPage() {
  const [htmlContent, setHtmlContent] = useState('');
  const [message, setMessage] = useState('');

  // Handle HTML input change
  const handleHtmlChange = (e) => {
    setHtmlContent(e.target.value);
  };

  // Handle conversion on button click
  const handleConvertClick = async () => {
    if (!htmlContent) {
      setMessage('❌ Please enter some HTML content to convert.');
      return;
    }

    setMessage('⚙️ Converting HTML to PDF...');

    try {
      // Sending HTML content to the backend for conversion
      const response = await axios.post('http://localhost:5000/convert-html-to-pdf', 
        { html: htmlContent },
        { responseType: 'blob' }
      );

      // Create a link to download the PDF after conversion
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = 'converted.pdf';
      link.click();

      setMessage('✅ Successfully converted HTML to PDF!');
    } catch (error) {
      console.error('Error converting HTML to PDF:', error);
      setMessage('❌ Something went wrong while converting the HTML to PDF.');
    }
  };

  return (
    <div className="tool-page">
      <h2>Convert HTML to PDF</h2>
      <p>Enter your HTML content and convert it to PDF.</p>

      <div className="html-input-section">
        <textarea
          placeholder="Enter HTML content here"
          value={htmlContent}
          onChange={handleHtmlChange}
        />
      </div>

      <button className="upload-button" onClick={handleConvertClick}>Convert to PDF</button>

      {message && (
        <div className="upload-feedback">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default HtmlToPdfPage;

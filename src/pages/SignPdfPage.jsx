import React, { useState } from 'react';
import axios from 'axios';

function SignPdfPage() {
  const [pdfFile, setPdfFile] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);
  const [message, setMessage] = useState('');

  const handlePdfChange = (e) => {
    setPdfFile(e.target.files[0]);
    setMessage(`📂 Selected PDF: ${e.target.files[0]?.name}`);
  };

  const handleSignatureChange = (e) => {
    setSignatureImage(e.target.files[0]);
    setMessage(`🖼 Selected signature: ${e.target.files[0]?.name}`);
  };

  const handleConvertClick = async () => {
    if (!pdfFile || !signatureImage) {
      setMessage('❌ Please select both PDF and signature image.');
      return;
    }

    const formData = new FormData();
    formData.append('pdfFile', pdfFile);
    formData.append('signatureImage', signatureImage);

    setMessage('⚙️ Signing PDF...');

    try {
      const response = await axios.post('http://localhost:5000/sign-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',  // Expect PDF file as a Blob
      });

      // Create a link to download the signed PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = 'signed_pdf.pdf';  // Set filename for download
      link.click();

      setMessage('✅ Successfully signed the PDF!');
    } catch (error) {
      console.error('Error signing the PDF:', error);
      setMessage('❌ Signing failed. Please try again.');
    }
  };

  return (
    <div className="tool-page">
      <h2>Sign PDF</h2>
      <p>Upload a PDF and a signature image to digitally sign the PDF.</p>

      <div className="upload-section">
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handlePdfChange} 
        />
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleSignatureChange} 
        />
        <button 
          className="upload-button" 
          onClick={handleConvertClick}
        >
          Sign PDF
        </button>
      </div>

      {message && (
        <div className="upload-feedback">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default SignPdfPage;

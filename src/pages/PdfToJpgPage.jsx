import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function PdfToJpgPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

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

    const formData = new FormData();
    formData.append('file', selectedFile);

    setMessage('⚙️ Converting PDF to JPG...');

    try {
      // Sending the PDF file to the backend for conversion
      const response = await axios.post('http://localhost:5000/convert-pdf-to-jpg', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob', // Expect PDF file as a Blob
      });

      // Check if the response is a zip file
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition && contentDisposition.includes('attachment')) {
        const zipUrl = window.URL.createObjectURL(new Blob([response.data]));
        const zipLink = document.createElement('a');
        zipLink.href = zipUrl;
        zipLink.setAttribute('download', 'converted_images.zip');
        document.body.appendChild(zipLink);
        zipLink.click();
        zipLink.remove();

        setMessage(`✅ Successfully converted "${selectedFile.name}" to JPG images!`);
      } else {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'converted_image.jpg');
        document.body.appendChild(link);
        link.click();
        link.remove();

        setMessage(`✅ Successfully converted "${selectedFile.name}" to JPG!`);
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Something went wrong while converting the PDF to JPG.');
    }
  };

  return (
    <div className="tool-page">
      <h2>Convert PDF to JPG</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button className="upload-button" onClick={handleConvertClick}>Convert to JPG</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default PdfToJpgPage;

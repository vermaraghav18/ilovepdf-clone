import React, { useState } from 'react';
import axios from 'axios';

const ScanToPdfPage = () => {
  const [image, setImage] = useState(null);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Store the uploaded image file
    }
  };

  // Convert image to PDF
  const convertToPdf = async () => {
    if (!image) {
      alert('Please upload an image first!');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:5000/scan-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // Handling binary file response
      });

      // Create a download link for the PDF file
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'scanned_document.pdf'; // Filename for the downloaded PDF
      link.click();
    } catch (error) {
      console.error('Error converting image to PDF:', error);
      alert('Failed to convert image to PDF. Please try again.');
    }
  };

  return (
    <div>
      <h1>Convert Image to Scanned PDF</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={convertToPdf}>Convert to PDF</button>
    </div>
  );
};

export default ScanToPdfPage;

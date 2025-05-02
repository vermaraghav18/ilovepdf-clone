import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function RotatePdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [rotationAngle, setRotationAngle] = useState(90); // Default angle is 90
  const [message, setMessage] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setMessage(`📂 Selected file: ${file.name}`);
    }
  };

  // Handle angle selection
  const handleAngleChange = (e) => {
    setRotationAngle(parseInt(e.target.value, 10));
  };

  // Handle conversion on button click
  const handleConvertClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a PDF file to rotate.');
      return;
    }

    setMessage('⚙️ Rotating PDF...');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('angle', rotationAngle); // Add rotation angle to the request

    try {
      // Sending the PDF file and rotation angle to the backend for processing
      const response = await axios.post('http://localhost:5000/rotate-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      // Create a link to download the rotated PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = 'rotated_output.pdf';
      link.click();

      // Provide feedback to the user
      setMessage(`✅ Successfully rotated the PDF!`);
    } catch (error) {
      console.error('Error rotating PDF:', error);
      setMessage('❌ Something went wrong while rotating the PDF.');
    }
  };

  return (
    <div className="tool-page">
      <h2>Rotate PDF</h2>
      <p>Upload a PDF file and select the angle to rotate it.</p>

      <div className="upload-section">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        
        <div className="rotation-selection">
          <label>Rotation Angle:</label>
          <select value={rotationAngle} onChange={handleAngleChange}>
            <option value={90}>90°</option>
            <option value={180}>180°</option>
            <option value={270}>270°</option>
          </select>
        </div>

        <button className="upload-button" onClick={handleConvertClick}>Rotate PDF</button>
      </div>

      {message && (
        <div className="upload-feedback">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default RotatePdfPage;

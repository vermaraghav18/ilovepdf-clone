import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';// Importing the CSS file

function MergePdfPage() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type === 'application/pdf');

    if (validFiles.length !== files.length) {
      setMessage('❌ Only PDF files are allowed.');
      return;
    }

    setSelectedFiles(validFiles);
    setMessage(`📁 ${validFiles.length} PDF(s) ready to merge.`);
  };

  const resetFiles = () => {
    setSelectedFiles([]);
    setMessage('');
  };

  const handleMergeClick = async () => {
    if (selectedFiles.length < 2) {
      setMessage('❌ Please select at least 2 PDF files to merge.');
      return;
    }

    setLoading(true);
    setMessage('⏳ Merging in progress...');
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('files', file));

    try {
      const response = await axios.post('http://localhost:5000/merge', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'merged.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage('✅ Successfully merged! Downloading now...');
      setSelectedFiles([]);
    } catch (error) {
      console.error(error);
      setMessage('❌ Failed to merge PDFs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="merge-container">
      <h2 className="merge-heading">Merge Your PDFs</h2>

      <div className="upload-zone">
        <label className="drop-zone">
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
            hidden
          />
          <div className="drop-message">
            📎 Drag & Drop or Click to Upload PDFs
          </div>
        </label>

        {selectedFiles.length > 0 && (
          <div className="file-list">
            {selectedFiles.map((file, index) => (
              <div key={index} className="file-item">📄 {file.name}</div>
            ))}
            <button onClick={resetFiles} className="reset-button">Clear Files</button>
          </div>
        )}
      </div>

      <button 
        className="merge-action-button"
        onClick={handleMergeClick}
        disabled={loading || selectedFiles.length < 2}
      >
        {loading ? 'Merging...' : 'Merge PDFs'}
      </button>

      {loading && <div className="loader"></div>}
      {message && <p className="merge-message">{message}</p>}
    </div>
  );
}

export default MergePdfPage;

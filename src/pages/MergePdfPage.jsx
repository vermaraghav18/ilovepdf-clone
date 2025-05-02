import React, { useState } from 'react';
import axios from 'axios';

function MergePdfPage() {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const files = e.target.files;
    const validFiles = Array.from(files).filter(file => file.type === 'application/pdf');
    
    if (validFiles.length !== files.length) {
      setMessage('❌ Please select only PDF files.');
      return;
    }

    setSelectedFiles(validFiles);
    setMessage(`📂 Selected files: ${validFiles.length} files.`);
  };

  const handleMergeClick = async () => {
    if (!selectedFiles || selectedFiles.length !== 2) {
      setMessage('❌ Please select exactly two PDF files.');
      return;
    }

    setMessage('🔄 Merging PDFs...');
    const formData = new FormData();
    
    selectedFiles.forEach(file => {
      formData.append('files', file); // Append files under the same field name 'files'
    });

    try {
      const response = await axios.post('http://localhost:5000/merge', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'merged.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage('✅ PDF Merged successfully! Downloading...');
    } catch (error) {
      console.error(error);
      setMessage('❌ Something went wrong while merging PDFs.');
    }
  };

  return (
    <div>
      <h2>Merge PDFs</h2>
      <input type="file" accept="application/pdf" multiple onChange={handleFileChange} />
      <button onClick={handleMergeClick}>Merge PDFs</button>
      {message && <div>{message}</div>}
    </div>
  );
}

export default MergePdfPage;

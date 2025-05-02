import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function ComparePdfsPage() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [differences, setDifferences] = useState([]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    setSelectedFiles(files);
    setMessage(`📂 Selected ${files.length} files.`);
  };

  const handleCompareClick = async () => {
    if (selectedFiles.length !== 2) {
      setMessage('❌ Please select exactly two PDF files.');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('pdfs', selectedFiles[i]);
    }

    setMessage('⚙️ Comparing PDFs...');

    try {
      const response = await axios.post('http://localhost:5000/compare-pdfs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setDifferences(response.data.differences);
      setMessage('✅ PDF comparison complete!');
    } catch (error) {
      console.error('Error comparing PDFs:', error);
      setMessage('❌ Comparison failed. Please try again.');
    }
  };

  return (
    <div className="tool-page">
      <h2>Compare PDFs</h2>
      <p>Upload two PDF files, and we will compare their contents for differences.</p>

      <div className="upload-section">
        <input type="file" accept="application/pdf" multiple onChange={handleFileChange} />
        <button className="upload-button" onClick={handleCompareClick}>Compare PDFs</button>
      </div>

      {message && <div className="upload-feedback"><p>{message}</p></div>}

      {differences.length > 0 && (
        <div>
          <h3>Differences:</h3>
          <ul>
            {differences.map((diff, index) => (
              <li key={index}>
                Line {diff.line} - PDF 1: {diff.pdf1} <br />
                Line {diff.line} - PDF 2: {diff.pdf2}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ComparePdfsPage;

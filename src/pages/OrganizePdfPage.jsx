import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';  // Add your own CSS path if needed

function OrganizePdfPage() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [rearrangeOrder, setRearrangeOrder] = useState('');
  const [pagesToRemove, setPagesToRemove] = useState('');

  // Handle file selection for merging PDFs
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setMessage(`📂 Selected files: ${files.map(file => file.name).join(', ')}`);
  };

  // Handle file selection for rearranging PDFs
  const handleSingleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(`📂 Selected file: ${file?.name}`);
  };

  // Handle rearrange order input
  const handleRearrangeChange = (e) => {
    setRearrangeOrder(e.target.value);
  };

  // Handle remove pages input
  const handleRemovePagesChange = (e) => {
    setPagesToRemove(e.target.value);
  };

  // Handle merging PDFs
  const handleMergeClick = async () => {
    if (selectedFiles.length < 2) {
      setMessage('❌ Please select at least two PDF files to merge.');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('files', file));

    setMessage('⚙️ Merging PDFs...');

    try {
      const response = await axios.post('http://localhost:5000/merge-pdfs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      // Create a link to download the merged PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = 'merged.pdf';
      link.click();

      setMessage('✅ PDFs successfully merged!');
    } catch (error) {
      console.error('Error merging PDFs:', error);
      setMessage('❌ Merging failed. Please try again.');
    }
  };

  // Handle rearranging PDF pages
  const handleRearrangeClick = async () => {
    if (!selectedFile || !rearrangeOrder) {
      setMessage('❌ Please select a file and enter the rearrange order.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('order', rearrangeOrder);  // Order input for rearranging

    setMessage('⚙️ Rearranging PDF pages...');

    try {
      const response = await axios.post('http://localhost:5000/rearrange-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      // Create a link to download the rearranged PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = 'rearranged.pdf';
      link.click();

      setMessage('✅ PDF pages rearranged successfully!');
    } catch (error) {
      console.error('Error rearranging PDF:', error);
      setMessage('❌ Rearranging failed. Please try again.');
    }
  };

  // Handle removing PDF pages
  const handleRemovePagesClick = async () => {
    if (!selectedFile || !pagesToRemove) {
      setMessage('❌ Please select a file and enter the pages to remove.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('pagesToRemove', pagesToRemove);  // Pages to remove

    setMessage('⚙️ Removing pages from PDF...');

    try {
      const response = await axios.post('http://localhost:5000/remove-pages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      // Create a link to download the modified PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = 'modified.pdf';
      link.click();

      setMessage('✅ PDF pages removed successfully!');
    } catch (error) {
      console.error('Error removing pages from PDF:', error);
      setMessage('❌ Removal failed. Please try again.');
    }
  };

  return (
    <div className="tool-page">
      <h2>Organize PDF</h2>
      <p>Merge PDFs, rearrange pages, or remove pages from a PDF.</p>

      {/* Merge PDFs */}
      <div className="upload-section">
        <input 
          type="file" 
          accept="application/pdf" 
          multiple
          onChange={handleFileChange} 
        />
        <button className="upload-button" onClick={handleMergeClick}>Merge PDFs</button>
      </div>

      {/* Rearrange PDF Pages */}
      <div className="upload-section">
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleSingleFileChange} 
        />
        <input 
          type="text" 
          placeholder="Enter page order (e.g., 2,1)" 
          value={rearrangeOrder} 
          onChange={handleRearrangeChange} 
        />
        <button className="upload-button" onClick={handleRearrangeClick}>Rearrange Pages</button>
      </div>

      {/* Remove PDF Pages */}
      <div className="upload-section">
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleSingleFileChange} 
        />
        <input 
          type="text" 
          placeholder="Enter pages to remove (e.g., 2)" 
          value={pagesToRemove} 
          onChange={handleRemovePagesChange} 
        />
        <button className="upload-button" onClick={handleRemovePagesClick}>Remove Pages</button>
      </div>

      {message && (
        <div className="upload-feedback">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default OrganizePdfPage;

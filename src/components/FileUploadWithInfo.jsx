import React, { useState } from 'react';
import '../styles/ComponentStyles.css';

function FileUploadWithInfo({ label, name, accept = ".pdf", onFileSelect }) {
  const [fileInfo, setFileInfo] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const info = {
      name: file.name,
      type: file.type,
      sizeMB: (file.size / 1024 / 1024).toFixed(2),
    };

    setFileInfo(info);
    if (onFileSelect) onFileSelect(file);
  };

  return (
    <div className="file-upload-block">
      <label>{label}</label><br />
      <input type="file" name={name} accept={accept} onChange={handleChange} />

      {fileInfo && (
        <div className="file-info">
          <p><strong>📄 Name:</strong> {fileInfo.name}</p>
          <p><strong>🗂 Type:</strong> {fileInfo.type}</p>
          <p><strong>📦 Size:</strong> {fileInfo.sizeMB} MB</p>
        </div>
      )}
    </div>
  );
}

export default FileUploadWithInfo;

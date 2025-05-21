import React, { useState } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import '../styles/ComparePdf.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

function ComparePdfsPage() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileUrls, setFileUrls] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [numPages1, setNumPages1] = useState(0);
  const [numPages2, setNumPages2] = useState(0);
  const [differences, setDifferences] = useState([]);
  const [similarity, setSimilarity] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length !== 2) {
      setMessage('❌ Please select exactly two PDF files.');
      return;
    }
    setSelectedFiles(files);
    setFileUrls([]);
    setDifferences([]);
    setSimilarity(null);
    setMessage(`📂 Selected 2 files.`);
  };

  const handlePreviewClick = () => {
    if (selectedFiles.length !== 2) {
      setMessage('❌ Please select exactly two PDF files.');
      return;
    }

    const urls = selectedFiles.map(file => URL.createObjectURL(file));
    setFileUrls(urls);
    setMessage('✅ Side-by-side preview ready.');
  };

  const handleCompareClick = async () => {
    if (selectedFiles.length !== 2) {
      setMessage('❌ Please select exactly two PDF files.');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('pdfs', file));

    setMessage('⚙️ Comparing PDFs...');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/compare-pdfs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { differences, similarity } = response.data;
      setDifferences(differences || []);
      setSimilarity(similarity);
      setMessage('✅ PDF comparison complete!');
    } catch (error) {
      console.error('Error comparing PDFs:', error);
      setMessage('❌ Comparison failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="merge-pdf-container">
      <h2 className="page-heading">Compare PDF Files</h2>
      <p className="message">Upload two PDF documents to view them side by side visually and compare their content.</p>

      <div className="file-upload-container">
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileChange}
          className="file-input"
        />
        <button
          className="merge-btn"
          onClick={handlePreviewClick}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Preview Side by Side'}
        </button>
        <button
          className="merge-btn"
          onClick={handleCompareClick}
          disabled={loading}
        >
          {loading ? 'Comparing...' : 'Compare PDFs'}
        </button>
      </div>

      {message && <p className="message">{message}</p>}

      {fileUrls.length === 2 && (
        <div className="side-by-side-preview">
          <div className="pdf-panel">
            <h4>📄 PDF 1</h4>
            <Document
              file={fileUrls[0]}
              onLoadSuccess={({ numPages }) => setNumPages1(numPages)}
            >
              {numPages1 > 0 && Array.from({ length: numPages1 }, (_, index) => (
                <Page key={`p1-${index + 1}`} pageNumber={index + 1} />
              ))}
            </Document>
          </div>
          <div className="pdf-panel">
            <h4>📄 PDF 2</h4>
            <Document
              file={fileUrls[1]}
              onLoadSuccess={({ numPages }) => setNumPages2(numPages)}
            >
              {numPages2 > 0 && Array.from({ length: numPages2 }, (_, index) => (
                <Page key={`p2-${index + 1}`} pageNumber={index + 1} />
              ))}
            </Document>
          </div>
        </div>
      )}

      {similarity !== null && (
        <div className="comparison-result">
          <h3>📊 Similarity Score: {similarity}%</h3>
        </div>
      )}

      {differences.length > 0 && (
        <div className="comparison-result">
          <h3>🔍 Differences Found:</h3>
          <ul style={{ textAlign: 'left', marginTop: '1rem' }}>
            {differences.map((diff, index) => (
              <li key={index}>
                <strong>Line {diff.line}</strong> — PDF 1: <em>{diff.pdf1}</em> <br />
                PDF 2: <em>{diff.pdf2}</em> <br />
                Similarity: {diff.similarity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ComparePdfsPage;

import { useState, useRef } from 'react';
import axios from 'axios';
import '../styles/WatermarkPdfPage.css';

// ✅ Correct PDF preview setup
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// ✅ Correct worker entry (no CDN mismatch)
import pdfWorker from 'pdfjs-dist/build/pdf.worker.entry';
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;


function WatermarkPdfPage() {
  const [pdfFile, setPdfFile] = useState(null);
  const [watermarkText, setWatermarkText] = useState('Confidential');
  const [watermarkImage, setWatermarkImage] = useState(null);
  const [fontSize, setFontSize] = useState(28);
  const [opacity, setOpacity] = useState(0.5);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [dragPos, setDragPos] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0); // ✅ New

  const [pdfDimensions, setPdfDimensions] = useState({ width: 1, height: 1 }); // ✅ PDF real size

  const previewRef = useRef(null);
  const watermarkRef = useRef(null);

  const handleFileUpload = (e) => {
    setPdfFile(e.target.files[0]);
    setWatermarkImage(null);
    setWatermarkText('Confidential');
    setDragPos({ x: 50, y: 50 });
    setDownloadUrl('');
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging || !previewRef.current) return;
    const bounds = previewRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    setDragPos({ x, y });
    if (watermarkRef.current) {
      watermarkRef.current.style.left = `${x}px`;
      watermarkRef.current.style.top = `${y}px`;
    }
    const imageElem = document.getElementById('watermark-image');
    if (imageElem) {
      imageElem.style.left = `${x}px`;
      imageElem.style.top = `${y}px`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) return alert('Please upload a PDF');

    const formData = new FormData();
    
    formData.append('pdf', pdfFile);
    formData.append('fontSize', fontSize);
    formData.append('opacity', opacity);
    formData.append('rotation', rotation); // ✅ Add rotation


    // ✅ Normalize coordinates to match real PDF space
    const previewW = previewRef.current.offsetWidth;
    const previewH = previewRef.current.offsetHeight;
    const scaledX = ((dragPos.x / previewW) * pdfDimensions.width)+(parseInt(fontSize) * 2.6);
    const scaledY = ((dragPos.y / previewH) * pdfDimensions.height)-(parseInt(fontSize) * 1);

    formData.append('customX', scaledX);
    formData.append('customY', scaledY);

    if (watermarkImage) {
      formData.append('image', watermarkImage);
    } else {
      formData.append('watermarkText', watermarkText);
    }

    try {
      const res = await axios.post('http://localhost:5000/api/add-watermark', formData);
      const finalUrl = `http://localhost:5000${res.data.url}?t=${Date.now()}`;
      console.log('✅ PDF Download URL:', finalUrl);
      setDownloadUrl(finalUrl);
    } catch (err) {
      console.error('Upload failed:', err.message);
      alert('Something went wrong!');
    }
      };

  return (
    <div className="watermark-container">
      <h2>Add Watermark to PDF</h2>
      <form onSubmit={handleSubmit}>
  <input type="file" accept="application/pdf" onChange={handleFileUpload} />
  
  {!watermarkImage && (
    <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} placeholder="Watermark text" />
  )}
    <input
    type="number"
    value={rotation}
    onChange={(e) => setRotation(e.target.value)}
    placeholder="Rotation (degrees)"
  />

  <input type="file" accept="image/png, image/jpeg" onChange={(e) => setWatermarkImage(e.target.files[0])} />
  <input type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} placeholder="Font size" />
  <input type="number" step="0.1" value={opacity} onChange={(e) => setOpacity(e.target.value)} placeholder="Opacity (0-1)" />

  <button type="submit">Add Watermark</button>

  {typeof downloadUrl === 'string' && downloadUrl.trim() !== '' && (
    <a href={downloadUrl} download target="_blank" rel="noopener noreferrer">
      <button type="button" style={{ marginLeft: '10px', backgroundColor: '#007bff', color: 'white' }}>
        Download Watermarked PDF
      </button>
    </a>
  )}
</form>


      {pdfFile && (
        <div
          className="preview-container"
          ref={previewRef}
          style={{ width: '200px', height: '520px', position: 'relative' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseDown={handleMouseDown}
        >
          <h4>Preview:</h4>
          <Document
            file={pdfFile}
            onLoadSuccess={(loadedPdf) => {
              loadedPdf.getPage(1).then((page) => {
                const viewport = page.getViewport({ scale: 1 });
                setPdfDimensions({ width: viewport.width, height: viewport.height });
              });
            }}
          >
            <Page pageNumber={1} width={400} />
          </Document>


          {watermarkImage && (
            <img
              id="watermark-image"
              src={URL.createObjectURL(watermarkImage)}
              alt="Watermark"
              style={{
                position: 'absolute',
                top: dragPos.y,
                left: dragPos.x,
                width: '120px',
                opacity,
                cursor: 'grab',
                transform: `rotate(${rotation}deg)`,
              }}
            />
          )}

          {!watermarkImage && (
            <div
              ref={watermarkRef}
              className="draggable-watermark"
              style={{
                position: 'absolute',
                top: dragPos.y,
                left: dragPos.x,
                fontSize: `${fontSize}px`,
                opacity,
                cursor: 'grab',
                color: 'black',
                transform: `rotate(${rotation}deg)`,
              }}
            >
              {watermarkText}
            </div>
          )}
        </div>
      )}

      {typeof downloadUrl === 'string' && downloadUrl.trim() !== '' && (
      <a href={downloadUrl} download target="_blank" rel="noopener noreferrer">
        <button>Download Watermarked PDF</button>
      </a>
)}

    </div>
  );
}

export default WatermarkPdfPage;

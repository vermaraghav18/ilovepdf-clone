import React, { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import '../styles/react-pdf-overrides.css';
import '../styles/EditPdfPage.css';
import Draggable from 'react-draggable';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function EditPdfPage() {
  const pageRefs = useRef({});
  const [pageRects, setPageRects] = useState({});
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const containerRef = useRef(null);
  const [textBoxes, setTextBoxes] = useState([]);

const annotations = textBoxes.map((tb) => {
  const pageRect = pageRects[tb.page] || { width: 800, height: 1131 };

  if (tb.type === 'shape') {
    return {
      type: 'shape',
      shape: tb.shape,
      page: tb.page,
      xPercent: tb.xPercent ?? tb.x / pageRect.width,
      yPercent: tb.yPercent ?? tb.y / pageRect.height,
      width: tb.width || 100,
      height: tb.height || 50,
      styles: {
        color: tb.styles?.color || '#FF0000',
        borderWidth: tb.styles?.borderWidth || 2,
      },
    };
  }

  // Fallback to text
  return {
    type: 'text',
    content: tb.content,
    page: tb.page,
    xPercent: tb.xPercent ?? tb.x / pageRect.width,
    yPercent: tb.yPercent ?? tb.y / pageRect.height,
    textHeightPercent: (tb.textHeight || 20) / pageRect.height,
    styles: {
      fontSize: 16,
      color: "#000",
    },
  };
});


  const exportEditedPdf = async () => {
    if (!pdfFile) return alert("Please upload a PDF first");

    const uploadedFileName = await uploadPdfToServer();
    if (!uploadedFileName) return alert("Failed to upload PDF");

    const response = await fetch('http://localhost:5000/edit-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        annotations,
        pdfPath: `uploads/${uploadedFileName}`,
      }),
    });

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'edited.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
const addShape = (shapeType) => {
  const newShape = {
    id: Date.now(),
    type: "shape",
    shape: shapeType, // 'rectangle', 'circle', 'line'
    x: 100,
    y: 100,
    page: 1,
    width: 100,
    height: shapeType === 'line' ? 2 : 50,
    styles: {
      color: "#FF0000",
      borderWidth: 2,
    },
  };
  setTextBoxes((prev) => [...prev, newShape]);
};
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file?.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = () => {
        setPdfUrl(reader.result);
        setPdfFile(file);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const handlePdfLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleAddText = () => {
    const newText = {
      id: Date.now(),
      content: 'Edit me',
      x: 100,
      y: 100,
      xPercent: 100 / 800,
      yPercent: 100 / 1131,
      page: 1,
    };
    setTextBoxes([...textBoxes, newText]);
  };

  const uploadPdfToServer = async () => {
    if (!pdfFile) return null;
    const formData = new FormData();
    formData.append('pdf', pdfFile);
    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.filename;
  };

  return (
    <div className="edit-pdf-container">
      <h2>Edit PDF</h2>
      <div className="upload-section">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
      </div>
      <div className="edit-toolbar">
        <button onClick={handleAddText} className="tool-btn">➕ Add Text</button>
        <button onClick={exportEditedPdf} className="tool-btn">⬇️ Export PDF</button>
        <button onClick={() => addShape('rectangle')} className="tool-btn">🔲 Add Rectangle</button>
<button onClick={() => addShape('circle')} className="tool-btn">⚪ Add Circle</button>
<button onClick={() => addShape('line')} className="tool-btn">➖ Add Line</button>

      </div>
      <div className="pdf-viewer" ref={containerRef}>
        {pdfUrl && (
          <Document file={pdfUrl} onLoadSuccess={handlePdfLoadSuccess} loading="Loading PDF...">
            {Array.from({ length: numPages }, (_, index) => {
              const pageNum = index + 1;
              return (
                <div
                  key={pageNum}
                  className="pdf-page-wrapper"
                  ref={(el) => {
                    if (el) pageRefs.current[pageNum] = el;
                  }}
                >
                  <Page
                    pageNumber={pageNum}
                    width={800}
                    onRenderSuccess={() => {
                      const el = pageRefs.current[pageNum];
                      if (el) {
                        const rect = el.getBoundingClientRect();
                        setPageRects((prev) => ({
                          ...prev,
                          [pageNum]: {
                            width: rect.width,
                            height: rect.height,
                          },
                        }));
                      }
                    }}
                  />
                  <div className="page-overlay" data-page={pageNum}>
                    {textBoxes
                      .filter((tb) => tb.page === pageNum)
                      .map((tb) => (
                        <Draggable
                          key={tb.id}
                          defaultPosition={{ x: tb.x, y: tb.y }}
                          onStop={(e, data) => {
                            const pageRect = pageRects[tb.page] || { width: 800, height: 1131 };
                            const xPercent = data.x / pageRect.width;
                            const yPercent = data.y / pageRect.height;

                            setTextBoxes((prev) =>
                              prev.map((box) =>
                                box.id === tb.id
                                  ? { ...box, x: data.x, y: data.y, xPercent, yPercent }
                                  : box
                              )
                            );
                          }}
                        >
                          <div
                            contentEditable
                            suppressContentEditableWarning
                            className="text-box"
                            onInput={(e) => {
                              e.target.style.width = `${e.target.scrollWidth}px`;
                            }}
                            onBlur={(e) => {
                              const updatedText = e.target.innerText;
                              const rect = e.target.getBoundingClientRect();
                              const height = rect.height;

                              setTextBoxes((prev) =>
                                prev.map((box) =>
                                  box.id === tb.id
                                    ? { ...box, content: updatedText, textHeight: height }
                                    : box
                                )
                              );
                            }}
                          >
                            {tb.content}
                          </div>
                          
                          
                        </Draggable>
                      ))}
                  </div>
                </div>
              );
            })}
          </Document>
        )}
      </div>
    </div>
  );
}

export default EditPdfPage;

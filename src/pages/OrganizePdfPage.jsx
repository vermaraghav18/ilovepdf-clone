import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

import "../styles/OrganizePdfPage.css";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import axios from "axios";
import { PDFDocument, degrees } from "pdf-lib";

function OrganizePdfPage() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [originalPages, setOriginalPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [insertIndex, setInsertIndex] = useState(-1);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") return;
    setPdfFile(file);
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const loadedPages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.5 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: context, viewport }).promise;

      loadedPages.push({
        id: `${i}-${Date.now()}`,
        src: canvas.toDataURL("image/jpeg"),
        rotation: 0,
        pageIndex: i - 1,
      });
    }

    setPages(loadedPages);
    setOriginalPages(loadedPages);
    setSelectedPages([]);
  };

  const handleInsertPdf = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") return;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    if (pdf.numPages < 1) return;

    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 0.5 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: context, viewport }).promise;

    const insertedPage = {
      id: `inserted-${Date.now()}`,
      src: canvas.toDataURL("image/jpeg"),
      rotation: 0,
      pageIndex: null,
    };

    const updated = [...pages];
    const index = insertIndex === -1 ? 0 : insertIndex + 1;
    updated.splice(index, 0, insertedPage);
    setPages(updated);
    e.target.value = "";
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(pages);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setPages(reordered);
  };

  const rotatePage = (index) => {
    const updated = [...pages];
    updated[index].rotation = (updated[index].rotation + 90) % 360;
    setPages(updated);
  };

  const deletePage = (index) => {
    const updated = [...pages];
    const removedId = updated[index].id;
    updated.splice(index, 1);
    setPages(updated);
    setSelectedPages(selectedPages.filter((id) => id !== removedId));
  };

  const duplicatePage = (index) => {
    const updated = [...pages];
    const duplicate = {
      ...pages[index],
      id: `${pages[index].id}-copy-${Date.now()}`,
    };
    updated.splice(index + 1, 0, duplicate);
    setPages(updated);
  };

  const handleReset = () => {
    setPages(originalPages);
    setSelectedPages([]);
  };

  const handleDownloadFromBackend = async () => {
    if (!pdfFile || pages.length === 0) return;

    const operations = pages
      .filter(p => typeof p.pageIndex === "number")
      .map(p => ({
        pageIndex: p.pageIndex,
        rotation: p.rotation || 0
      }));

    const formData = new FormData();
    formData.append("pdf", pdfFile);
    formData.append("operations", JSON.stringify(operations));

    try {
      const response = await axios.post("http://localhost:5000/organize", formData, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "final-organized.pdf";
      link.click();
    } catch (error) {
      console.error("PDF organization failed:", error);
      alert("Failed to process PDF.");
    }
  };

  const handleExtractPdf = async () => {
    if (!pdfFile || selectedPages.length === 0) return;

    const originalPdfBytes = await pdfFile.arrayBuffer();
    const originalPdf = await PDFDocument.load(originalPdfBytes);
    const newPdf = await PDFDocument.create();

    const validPageOps = pages
      .filter(p => selectedPages.includes(p.id) && typeof p.pageIndex === 'number')
      .map(p => ({
        index: p.pageIndex,
        rotation: p.rotation || 0,
      }));

    if (validPageOps.length === 0) {
      alert("No valid original pages selected to extract.");
      return;
    }

    const copiedPages = await newPdf.copyPages(
      originalPdf,
      validPageOps.map(p => p.index)
    );

    copiedPages.forEach((page, i) => {
      const rotation = validPageOps[i].rotation;
      if (rotation) {
        page.setRotation(degrees(rotation));
      }
      newPdf.addPage(page);
    });

    const finalPdfBytes = await newPdf.save();
    const blob = new Blob([finalPdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "extracted-pages.pdf";
    link.click();
  };

  return (
    <div className={`organize-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="theme-toggle">
        <label className="switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <span className="slider round"></span>
        </label>
        <span>{darkMode ? "Dark Mode" : "Light Mode"}</span>
      </div>

      <h2>Organise PDF</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        className="upload-input"
      />

      {pages.length > 0 && (
        <>
          <div className="button-bar">
            <button onClick={handleDownloadFromBackend} className="download-btn">
              Download Organized PDF
            </button>
            <button onClick={handleExtractPdf} className="extract-btn">
              Extract Selected Pages
            </button>
            <button onClick={handleReset} className="reset-btn">
              Reset
            </button>
          </div>

          <div className="insert-bar">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleInsertPdf}
              className="insert-input"
            />
            <select
              value={insertIndex}
              onChange={(e) => setInsertIndex(parseInt(e.target.value))}
              className="insert-select"
            >
              {pages.map((_, i) => (
                <option key={i} value={i}>
                  Insert after Page {i + 1}
                </option>
              ))}
              <option value={-1}>Insert at Start</option>
            </select>
          </div>
        </>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="pdf-pages" direction="horizontal">
          {(provided) => (
            <div
              className="thumbnail-grid"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {pages.map((page, index) => (
                <Draggable key={page.id} draggableId={page.id} index={index}>
                  {(provided) => (
                    <div
                      className="thumbnail-box"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPages.includes(page.id)}
                        onChange={() => {
                          if (selectedPages.includes(page.id)) {
                            setSelectedPages(
                              selectedPages.filter((id) => id !== page.id)
                            );
                          } else {
                            setSelectedPages([...selectedPages, page.id]);
                          }
                        }}
                        className="page-checkbox"
                      />

                      <img
                        src={page.src}
                        alt={`Page ${index + 1}`}
                        style={{ transform: `rotate(${page.rotation}deg)` }}
                      />
                      <p>Page {index + 1}</p>
                      <div className="action-buttons">
                        <button onClick={() => rotatePage(index)} title="Rotate">↻</button>
                        <button onClick={() => deletePage(index)} title="Delete">❌</button>
                        <button onClick={() => duplicatePage(index)} title="Duplicate">➕</button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default OrganizePdfPage;

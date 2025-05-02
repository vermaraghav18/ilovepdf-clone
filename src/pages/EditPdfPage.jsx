import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const EditPdfPage = () => {
  const [pdfFile, setPdfFile] = useState(null);  // PDF file state
  const [image, setImage] = useState(null);      // Image for inserting into PDF
  const [annotations, setAnnotations] = useState([]); // Annotations (if needed)

  // Handle PDF upload
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
    }
  };

  // Handle image upload for editing
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Convert image to object URL for preview
    }
  };

  // Edit PDF (add text, annotations, images)
  const handleEditPdf = async () => {
    if (!pdfFile) {
      alert('Please upload a PDF first!');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', pdfFile); // Append the PDF file

    if (image) {
      formData.append('image', image); // Append the image if it's provided
    }

    try {
      const response = await axios.post('http://localhost:5000/edit-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob', // Expecting the modified PDF from backend
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'edited_pdf.pdf';
      link.click();
    } catch (error) {
      console.error('Error editing PDF:', error);
      alert('Error editing PDF. Please try again.');
    }
  };

  // Add annotation (basic feature, could be expanded to draw, highlight, etc.)
  const addAnnotation = () => {
    const text = prompt('Enter annotation text:');
    if (text) {
      setAnnotations([...annotations, text]); // Add annotation to state
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit PDF</h1>

      {/* Toolbar for editing options */}
      <div className="mb-6 flex space-x-4">
        <button onClick={addAnnotation} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Add Annotation
        </button>
        <button onClick={handleEditPdf} className="p-2 bg-green-500 text-white rounded hover:bg-green-700">
          Edit PDF
        </button>
      </div>

      {/* PDF and Image Upload */}
      <div className="mb-4">
        <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="mb-2 p-2 border rounded" />
        <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2 p-2 border rounded" />
      </div>

      {/* Display Image Preview */}
      {image && <img src={image} alt="Image Preview" className="mt-4 w-40 h-40" />}

      {/* Display annotations (for now as text) */}
      <div className="mt-4">
        {annotations.length > 0 && (
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold">Annotations:</h3>
            <ul>
              {annotations.map((annotation, index) => (
                <li key={index} className="mt-2">{annotation}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPdfPage;

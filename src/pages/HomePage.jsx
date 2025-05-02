// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ComponentStyles.css';

function HomePage() {
  return (
    <div className="homepage">
      <section className="hero">
        <h1>Every tool you need to work with PDFs in one place</h1>
        <p>Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.</p>
      </section>

      <section className="tool-grid">
        <Link to="/merge_pdf" className="tool-card">Merge PDF</Link>
        <Link to="/split_pdf" className="tool-card">Split PDF</Link>
        <Link to="/compress_pdf" className="tool-card">Compress PDF</Link>
        <Link to="/pdf_to_word" className="tool-card">PDF to Word</Link>
        <Link to="/edit_pdf" className="tool-card">Edit PDF</Link>
        <Link to="/pdf_to_powerpoint" className="tool-card">PDF to PowerPoint</Link>
        <Link to="/pdf_to_excel" className="tool-card">PDF to Excel</Link>
        <Link to="/word_to_pdf" className="tool-card">Word to PDF</Link>
        <Link to="/powerpoint_to_pdf" className="tool-card">PowerPoint to PDF</Link>
        <Link to="/excel_to_pdf" className="tool-card">Excel to PDF</Link>
        <Link to="/pdf_to_jpg" className="tool-card">PDF to JPG</Link>
        <Link to="/jpg_to_pdf" className="tool-card">JPG to PDF</Link>
        <Link to="/sign_pdf" className="tool-card">Sign PDF</Link>
        <Link to="/watermark_pdf" className="tool-card">Watermark PDF</Link>
        <Link to="/rotate_pdf" className="tool-card">Rotate PDF</Link>
        <Link to="/html_to_pdf" className="tool-card">HTML to PDF</Link>
        <Link to="/unlock_pdf" className="tool-card">Unlock PDF</Link>
        <Link to="/protect_pdf" className="tool-card">Protect PDF</Link>
        <Link to="/organize_pdf" className="tool-card">Organize PDF</Link>
        <Link to="/pdf_to_pdfa" className="tool-card">PDF to PDF/A</Link>
        <Link to="/repair_pdf" className="tool-card">Repair PDF</Link>
        <Link to="/add_page_numbers" className="tool-card">Add Page Numbers</Link>
        <Link to="/scan_to_pdf" className="tool-card">Scan to PDF</Link>
        <Link to="/ocr_pdf" className="tool-card">OCR PDF</Link>
        <Link to="/compare_pdf" className="tool-card">Compare PDF</Link>
        <Link to="/redact_pdf" className="tool-card">Redact PDF</Link>
        <Link to="/crop_pdf" className="tool-card">Crop PDF</Link>

        {/* Later we will add more tools */}
      </section>
    </div>
  );
}

export default HomePage;


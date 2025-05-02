// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ComponentStyles.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">I ❤️ PDF</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/merge_pdf">Merge PDF</Link></li>
        <li><Link to="/split_pdf">Split PDF</Link></li>
        <li><Link to="/compress_pdf">Compress PDF</Link></li>
        <li><Link to="/pdf_to_word">PDF to Word</Link></li>
        <li><Link to="/edit_pdf">Edit PDF</Link></li>
        {/* Later you can add dropdown for "All PDF Tools" like original iLovePDF */}
      </ul>
    </nav>
  );
}

export default Navbar;


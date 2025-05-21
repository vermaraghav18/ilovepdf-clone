import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ComponentStyles.css'; // Ensure your styles are imported

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
      </div>

      <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
      
      </div>

      {/* Hamburger Menu Icon */}
      <div className="hamburger-menu" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </nav>
  );
}

export default Navbar;

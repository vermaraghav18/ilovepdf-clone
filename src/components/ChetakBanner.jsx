import React from 'react';
import '../styles/ChetakBanner.css';

function ChetakBanner() {
  return (
    <div className="chetak-banner">
      <img src="/assets/bg.png" alt="Background" className="bg-image" />
      <div className="banner-content">
        <img src="/assets/bajajSign.png" alt="Bajaj Logo" className="brand-logo" />

        <div className="banner-text">
          <h1 className="main-heading">Bajaj Chetak:<br />The Future of Electric Scooters</h1>
          <p className="subtext">
            Discover the sleek, powerful, and eco-friendly Bajaj Chetak. The perfect blend of style and sustainability.
          </p>
          <button className="learn-btn">Learn More</button>
        </div>

        <img src="/assets/scotter.png" alt="Scooter" className="scooter-img" />
      </div>
    </div>
  );
}

export default ChetakBanner;

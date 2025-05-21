
import React, { useState } from 'react';
import '../styles/ComponentStyles.css'; // Make sure to import the CSS for the ticker

const BannerWithClose = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false); // Hide the banner when the cross button is clicked
  };

  return (
    <>
      {isVisible && (
        <div className="notification-banner">
          <div className="banner-content">
            <span className="ticker-message">
             For booking of Advertisement Slot, Whastapp : 8847584216 or Email : raghav18verma@gmail.com
            </span>
            <button className="close-btn" onClick={handleClose}>X</button>
          </div>
        </div>
      )}
    </>
  );
};

export default BannerWithClose;
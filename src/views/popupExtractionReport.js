// Popup.js or Popup.tsx
import React from 'react';
import '../styling/popUpExtractionReport.css';

const Popup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close-button" onClick={onClose}>
          ×
        </button>
        <h2>Extraction Details</h2>
        <p>This is a dummy popup content. Customize as needed!</p>
        {children}
      </div>
    </div>
  );
};

export default Popup;

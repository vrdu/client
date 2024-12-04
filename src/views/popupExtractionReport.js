// Popup.js or Popup.tsx
import React, { useState, useEffect } from 'react';
import '../styling/popUpExtractionReport.css';
import Extraction from '../models/extraction';
import { api } from '../helpers/api';

const Popup = ({ isOpen, onClose, children }) => {
  const [extraction, setExtraction] = useState(null);

  useEffect(() => {
    const fetchDocumentsAndReport = async () => {
      
      try {
        const username = sessionStorage.getItem('username');
        const projectName = sessionStorage.getItem('projectName');
        const extractionName = sessionStorage.getItem('extractionName');
        const response = await api(false).get(`/projects/${username}/${projectName}/${extractionName}/documentsAndReport`, {
          withCredentials: true,  
        });
        const extractionData = new Extraction(response.data);
        setExtraction(extractionData);

       } catch (error) {
         console.error('Error fetching documents:', error);
       }
    };
    fetchDocumentsAndReport();
  }, []);

  //store them in button with corrected true/false if clicked on one, the view to correct the extraction will be shown

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close-button" onClick={onClose}>
          ×
        </button>
         <div>
      {extraction ? (
        <div>
          <h2>{extraction.name}</h2>
          <p>F1 Score: {extraction.f1}</p>
          <p>ANLS: {extraction.anls}</p>
          <ul>
            {extraction.documentNames.map((doc, index) => (
              <li key={index}>{doc}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
      </div>
    </div>
  );
};

export default Popup;

// Popup.js or Popup.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/popUpExtractionReport.css';
import Extraction from '../models/extraction';
import { api } from '../helpers/api';

const Popup = ({ isOpen, onClose, extraction: initialExtraction }) => {
  const [extraction, setExtraction] = useState(initialExtraction);
  const projectName = sessionStorage.getItem('projectName');
  const navigate = useNavigate(); 
  
  useEffect(() => {
    const fetchDocumentsAndReport = async () => {
      if (!initialExtraction) return;

      console.log("Fetching documents and report...");
      try {
        const username = sessionStorage.getItem('username');
        const projectName = sessionStorage.getItem('projectName');
        const response = await api(false).get(
          `/projects/${username}/${projectName}/${initialExtraction.name}/documentsAndReport`,
          {
            withCredentials: true,
          }
        );
        console.log('Documents and report fetched:', response.data);
        // Assuming response.data contains updated extraction details
        setExtraction((prevExtraction) => ({
          ...prevExtraction,
          ...response.data, // Merge additional data into the current extraction state
        }));
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocumentsAndReport();
  }, [initialExtraction]);

  const openDocument = (docCorrect) => {
    sessionStorage.setItem('docCorrect', docCorrect);
    navigate(`/projects/${projectName}/correctExtraction`);
  };

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
             <span
             onClick={() => openDocument(doc)} 
             className="clickable-index"
           >
             {doc}
           </span>
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

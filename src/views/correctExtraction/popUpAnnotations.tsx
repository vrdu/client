import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../helpers/api';  // Adjust path as needed
import LabelFamily from '../../models/labelFamily';
import Label from '../../models/label';
import { Annotation } from "../../models/annotation"; 
import { Button } from '@mui/material';

interface PopUpAnnotationsProps {
  onConfirm: () => void;
  onOpen: () => void;
  setAnnotation: (annotation: Annotation) => void;
}

const PopUpAnnotations: React.FC<PopUpAnnotationsProps> = ({ onConfirm, onOpen, setAnnotation }) => {

  const [labelFamilies, setLabelFamilies] = useState<LabelFamily[]>([]);
  const [expandedFamilyId, setExpandedFamilyId] = useState<number | null>(null);
  const [localAnnotation, setLocalAnnotation] = useState<Annotation>(new Annotation());
  const fetchFamilies = useCallback(async () => {
    const username = sessionStorage.getItem('username');
    try {
      const projectName = sessionStorage.getItem('projectName');
      const response = await api(false).get(`/projects/${username}/${projectName}/label-families`, {
        withCredentials: true,
      });
      setLabelFamilies(Array.isArray(response.data) ? (response.data as LabelFamily[]) : []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, []);

  useEffect(() => {
    fetchFamilies();
    onOpen();
  }, [fetchFamilies, onOpen]);

  // Toggle the expanded label family
  const toggleFamily = (id: number | null) => {
    setExpandedFamilyId((prevId) => (prevId === id ? null : id));
  };

  const handleLabelClick = (label: Label) => {
    const newAnnotation = new Annotation({ labelName: label.labelName, familyName: label.familyName });
    setLocalAnnotation(newAnnotation);
    console.log(localAnnotation)
  };

  const handleClose = () => {
    setAnnotation(localAnnotation);
    console.log("annotation:", localAnnotation);
    onConfirm();
  };

  return (
    <div className="custom-tip" style={{ padding: "1rem", backgroundColor: "#f9f9f9", borderRadius: "5px" }}>
      <h4>Annotate</h4>
      
      {labelFamilies.map((family) => (
        <div key={family.id}>  
          <h5 onClick={() => toggleFamily(family.id)} style={{ cursor: 'pointer' }}>
            {family.labelFamilyName} {expandedFamilyId === family.id ? '▼' : '▶'}
          </h5>
          
          {expandedFamilyId === family.id && (
            <ul>
              {family.labels.map((label) => (
                <li key={label.id}>  
                  <Button variant="contained" color="primary" style={{ marginRight: "1rem" }}onClick={() => handleLabelClick(label)} >
                  <strong>{label.labelName}</strong>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      
      <button onClick={handleClose}>Save</button>
    </div>
  );
};

export default PopUpAnnotations;

import React, { useState, useCallback } from 'react';
import '../styling/home.css'; 
import '../styling/configureLabels.css'; 
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"; // For zooming functionality
import AddIcon from '@mui/icons-material/Add';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import labelFamily from '../models/labelFamily';
import label from '../models/label';
// import { Document, Page } from 'react-pdf';

const ConfigureLabels = () => {
  const [droppedFile, setDroppedFile] = useState(null);
  const [zoomEnabled, setZoomEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openLabel, setOpenLabel] = useState(false);
  const [labelName, setLabelName] = useState('');
  const [labelDescription, setLabelDescription] = useState('');
  const [submittedLabelFamilies, setSubmittedLabelFamilies] = useState([]);
  const [editingLabelIndex, setEditingLabelIndex] = useState(null);
  const [labelFamilyIndex, setLabelFamilyIndex] = useState(null); // Index of label family to add label to
  const [newLabel, setNewLabel] = useState({ name: '', description: '', descriptionShown: false });
  const [expandedLabels, setExpandedLabels] = useState({});
  const [expandedFamilies, setExpandedFamilies] = useState({});
  const [labelFamilies, setLabelFamilies] = useState([]);
  const [activeLabelFamilyId, setActiveLabelFamilyId] = useState(null); // Track which label family is being edited
  // const [numPages, setNumPages] = useState(null);
  // const [pageNumber, setPageNumber] = useState(1);
  
  // Logic concerning the Label Families
  const handleAddLabelFamily = () => {
    setLabelName("");
    setLabelDescription("");
    const newId = generateUniqueId(); 
    const newLabelFamily = new labelFamily({id: newId}); 
    setLabelFamilies((prevFamilies) => [...prevFamilies, newLabelFamily]);
    setActiveLabelFamilyId(newId); 
    setOpen(true); 
  };

  const generateUniqueId = () => {
    return labelFamilies.length === 0 ? 1 : Math.max(...labelFamilies.map(f => f.id)) + 1;
  };

  const handleSubmitLabelFamily = () => {
    setLabelFamilies((prevFamilies) =>
      prevFamilies.map((family) =>
        family.id === activeLabelFamilyId
          ? { ...family, labelFamilyName: labelName, labelFamilyDescription: labelDescription }
          : family
      )
    );
  
    handleClose();
  };

  const handleEditLabelFamily = (id) => {
    const familyToEdit = labelFamilies.find(family => family.id === id);
    
    if (familyToEdit) {
      setLabelName(familyToEdit.labelFamilyName); // Populate the form with the current name
      setLabelDescription(familyToEdit.labelFamilyDescription); // Populate the form with the current description
      setActiveLabelFamilyId(id); // Track the ID of the label family being edited
      setOpen(true); // Open the dialog
    }
  };

  const handleSubmitEditFamily = () => {
    setLabelFamilies((prevFamilies) =>
      prevFamilies.map((family) =>
        family.id === activeLabelFamilyId
          ? { ...family, labelFamilyName: labelName, labelFamilyDescription: labelDescription }
          : family
      )
    );
  
    // Close the dialog and reset form
    handleClose();
  };
  
  

  // Toggle the expansion of the specific label family
  const toggleFamilyExpansion = (id, e) => {
    e.stopPropagation(); 
    setExpandedFamilies((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the specific label family's expansion state
    }));
  };

    // Toggle the expansion of the specific label
    const toggleLabelExpansion = (labelIndex, e) => {
      e.stopPropagation();
      setExpandedLabels((prev) => ({
        ...prev,
        [labelIndex]: !prev[labelIndex], // Toggle the current label's expansion
      }));
    };

  const handleAddLabel = (family) => {
    setLabelFamilyIndex(family.id);
    setOpenLabel(true); // Show popup to add label
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const fileURL = URL.createObjectURL(acceptedFiles[0]); // Create a preview URL for the dropped file
      setDroppedFile(fileURL); // Update state with the URL
      setZoomEnabled(true); // Enable zoom once a file is dropped
      console.log(fileURL); // Log the generated URL
    }
  }, []);

  const handleZoomIn = () => {
    // Zoom in by 10%
  }
  const handleZoomOut = () => { 
    // Zoom out by 10%
  }
  
  // const onDocumentLoadSuccess = ({ numPages }) => {
  //   setNumPages(numPages);
  // };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.pdf', // You can limit to specific file types
  });

  
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    // Reset input fields and close popup
    setLabelName('');
    setLabelDescription('');
    setEditingLabelIndex(null);
    setOpen(false);
    setOpenLabel(false);
    setActiveLabelFamilyId(null);
  };
  
  const handleSubmitLabel = () => {
    const updatedLabelFamilies = [...submittedLabelFamilies];
    
    // Ensure the labelFamilyIndex is valid
    if (labelFamilyIndex !== null && updatedLabelFamilies[labelFamilyIndex]) {
      updatedLabelFamilies[labelFamilyIndex].labels.push(newLabel); // Add the new label
      setSubmittedLabelFamilies(updatedLabelFamilies); // Update state
    }
    
    setOpen(false); // Close popup
    setNewLabel({ name: '', description: '' }); // Reset input fields
  };
  
  const handleEditLabel = (label, family) => {
    setLabelName(label.name);  // Set the clicked label's name and description
    setLabelDescription(label.description);
    setEditingLabelIndex(family.id); // Track which label is being edited
    setOpen(true); // Open the popup
  };
  

  return (
    <div>
      <div className="blob">
        <h1 className="heading">Configure Labels</h1>

        <div className="content-container">
          
          <div className="left-container">
            {!droppedFile ? (
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop your PDF here...</p>
                ) : (
                  <p>Drag and drop a PDF document here, or click to select one</p>
                )}
              </div>
            ) : (
              <div>
                <div className="document-controls">
                  <Button variant="outlined" onClick={handleZoomOut}>-</Button>
                  <Button variant="outlined" onClick={handleZoomIn}>+</Button>
                </div>
                
                <div className="document-container">
                  {/* PDF Document Component can be added later */}
                </div>
              </div>
            )}
          </div>

          {/* Right Placeholder */}
          <div className="right-placeholder">
            <Button 
              variant="outlined" 
              onClick={() => {}} 
              className="import-button"
            >
              Import labels
            </Button>
            <div>
              
            {/* Pop-up Dialog For adding new LabelFamilies*/}
            <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{activeLabelFamilyId  !== null ? 'Edit Label Family' : 'Add New Label Family'}</DialogTitle>
              <DialogContent>
                {/* Content inside pop-up */}
                <div className="form-container">
            
                  {/* TextField for Label Name */}
                  <TextField
                    label="Label Name"
                    variant="outlined"
                    className="label-name-field"
                    value={labelName}
                    onChange={(e) => setLabelName(e.target.value)}
                    fullWidth={false}
                    size="small" 
                  />

                  {/* TextField for Label Description */}
                  <TextField
                    label="Label Family Description"
                    variant="outlined"
                    className="label-description-field"
                    multiline
                    value={labelDescription}
                    onChange={(e) => setLabelDescription(e.target.value)}
                    rows = {4}
                  />
                
                
                    {/* Submit Button */}
                    <div className="button-container">
                      <Button 
                      variant="contained" 
                      onClick={handleSubmitEditFamily}
                      style={{ marginTop: '20px' }}
                      type="submit" 
                    >
                      submit
                    </Button>
                      <Button onClick={handleClose} variant="outlined" color="primary" className="half-width-button">
                        Cancel
                      </Button>
                    </div>
                  </div>
                      </DialogContent>
                    </Dialog>
            </div>
            {/*pop-up for adding new label */}
            <Dialog open={openLabel} onClose={handleClose}>
              <DialogTitle>{editingLabelIndex !== null ? 'Edit Label' : 'Add New Label'}</DialogTitle>
                <DialogContent>
                  {/* Content inside pop-up */}
                  <div className="form-container">
              
                    {/* TextField for Label Name */}
                    <TextField
                      label="Label Name"
                      variant="outlined"
                      className="label-name-field"
                      value={newLabel.name}
                      onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
                      fullWidth={false}
                      size="small" 
                    />

                    {/* TextField for Label Description */}
                    <TextField
                      label="Label Description"
                      variant="outlined"
                      className="label-description-field"
                      multiline
                      value={newLabel.description}
                      onChange={(e) => setNewLabel({ ...newLabel, description: e.target.value })}
                      rows = {4}
                    />
                  
                  {/* Submit Button */}
                  <div className="button-container">
                    <Button 
                    variant="contained" 
                    onClick={handleSubmitLabel}
                    style={{ marginTop: '20px' }}
                    type="submit" 
                  >
                    submit
                  </Button>
                    <Button onClick={handleClose} variant="outlined" color="primary" className="half-width-button">
                      Cancel
                    </Button>
                  </div>
                </div>
                </DialogContent>
            </Dialog>
    
            {/* Display submitted label */}
            <div className="submitted-label-families">
              {labelFamilies.map((family) => (
              <div className="label-family" key={family.id}>  {/* Wrapper for each label family */}
                <Button
                  onClick={() => handleEditLabelFamily(labelFamily, family.id)}  // Open popup to edit this label family
                  className="label-box"
                  variant="outlined"
                  fullWidth
                  style={{ textAlign: 'left', marginBottom: '10px', color: 'black' }} // Style for layout
                >
                  <div className="label-family-container">
                    <div className="label-family-name">
                      <p>
                        <strong class="nowrap">Label family name:</strong><br />
                        <span className="custom-label-name-distance">{family.labelFamilyName || 'Unnamed'}</span>
                      </p>
                    </div>
                    <div className="family-container">
                      {/* Toggle Button for Description */}
                      <div className="label-description-container" style={{ textAlign: 'left' }}>
                        <Button
                          variant="text"
                          onClick={(e) => toggleFamilyExpansion(family.id, e)} // Toggle description visibility
                          endIcon={expandedFamilies[family.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />} // Toggle icon
                          style={{ padding: '0', margin: '0', textAlign: 'left', color: 'black', whiteSpace: 'nowrap', flexGrow: 1, textAlign: 'left' }}
                          >
                          {expandedFamilies[family.id] ? <strong>Label family description:</strong> : <strong>Label family description</strong>}
                        </Button>
                        
                        {/* Conditionally render the description */}
                        {expandedFamilies[family.id] && (
                          <div className="label-description">
                            {family.labelFamilyDescription || 'No description'}
                          </div>
                        )}
                      </div>

                    </div>
                    
                  </div>
                </Button>

                {/* Display the list of labels under each label family */}
                <div className="label-list">
                  {family.labels.length > 0 && (
                    family.labels.map((label, labelIndex) => (
                      <div key={labelIndex}>
                        <Button
                          onClick={() => handleEditLabel(label, labelIndex)} // Function to handle editing the label
                          className="label-button"
                          variant="outlined"
                          fullWidth
                          style={{ textAlign: 'left', marginBottom: '10px', color: 'black' }} // Style for layout
                        >
                          <div className="label-header">
                            <div className="label-name"> 
                              <p>
                                <strong class="nowrap">Label name:</strong><br />
                                <span className="custom-label-name-distance">{label.name}</span>
                              </p>
                            </div>

                            
                            <div className="label-description-container" style={{ textAlign: 'left' }}>
                              <Button
                                variant="text"
                                onClick={(e) => toggleLabelExpansion(labelIndex, e)} // Toggle description visibility
                                endIcon={expandedLabels[labelIndex] ? <ExpandLessIcon /> : <ExpandMoreIcon />} // Toggle icon
                                style={{ padding: '0', margin: '0', textAlign: 'left', color: 'black', whiteSpace: 'nowrap', flexGrow: 1,textAlign: 'left' }}
                              >
                                {expandedLabels[labelIndex] ? <strong>Label description:</strong>: <strong>Label description</strong>}
                              </Button>
                              
                              {expandedLabels[labelIndex] && (
                                <div className="label-description">
                                  {label.description}
                                </div>
                              )}

                            </div>
                              
                          </div>
                        </Button>

                      
                      </div>
                      ))
                    )}
                </div>

                  {/* Add label button */}
                  <Button 
                    variant="contained" 
                    onClick={() => handleAddLabel(family.id)}  // Trigger add label popup
                    style={{ alignSelf: 'flex-start', marginLeft: '0px' }}
                    >
                    + Add Label
                  </Button>
              </div>
                    ))}
            </div>

                  {/* Button with Plus Icon and Text */}
            <Button 
              variant="outlined" 
              className="add-label-family-button" 
              onClick={handleAddLabelFamily}
              startIcon={<AddIcon />}
            >
              Add Label Family
            </Button>

          </div>                         
        </div>                       
          <div className="button-container">
            <Link to="/uploadInstructionDocuments">
            <Button variant="contained" color="primary">
              Upload Instruction Documents 
            </Button>
            </Link>
          </div>
      </div>
    </div>
  );

};

export default ConfigureLabels;

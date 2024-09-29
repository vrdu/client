import React, { useState, useCallback } from 'react';
import '../styling/home.css'; 
import '../styling/configureLabels.css'; 
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"; // For zooming functionality
import AddIcon from '@mui/icons-material/Add';
// import { Document, Page } from 'react-pdf';

const ConfigureLabels = () => {
  const [droppedFile, setDroppedFile] = useState(null);
  const [zoomEnabled, setZoomEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [labelName, setLabelName] = useState('');
  const [labelDescription, setLabelDescription] = useState('');
  const [submittedLabelFamilies, setSubmittedLabelFamilies] = useState([]);
  const [editingLabelIndex, setEditingLabelIndex] = useState(null);
  // const [numPages, setNumPages] = useState(null);
  // const [pageNumber, setPageNumber] = useState(1); 

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const fileURL = URL.createObjectURL(acceptedFiles[0]); // Create a preview URL for the dropped file
      setDroppedFile(fileURL); // Update state with the URL
      setZoomEnabled(true); // Enable zoom once a file is dropped
      console.log(fileURL); // Log the generated URL
    }
  }, []);
  
  // const onDocumentLoadSuccess = ({ numPages }) => {
  //   setNumPages(numPages);
  // };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.pdf', // You can limit to specific file types
  });

  const handleZoomIn = () => {
    // Logic to zoom in the document
  };

  const handleZoomOut = () => {
    // Logic to zoom out the document
  };
  const selectPopUp = () => {
    //place holder
  }
  
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    // Reset input fields and close popup
    setLabelName('');
    setLabelDescription('');
    setEditingLabelIndex(null);
    setOpen(false);
  };
  
  const handleSubmision = () => {
    const newLabel = {
      name: labelName,
      description: labelDescription
    };

    if (editingLabelIndex !== null) {
      // Edit existing label
      const updatedLabels = [...submittedLabelFamilies];
      updatedLabels[editingLabelIndex] = newLabel;
      setSubmittedLabelFamilies(updatedLabels);
    } else {
      // Add new label
      setSubmittedLabelFamilies([...submittedLabelFamilies, newLabel]);
    }
    setLabelName('');
    setLabelDescription('');
    setEditingLabelIndex(null);
    setOpen(false);
  };

  const handleEditLabel = (label, index) => {
    setLabelName(label.name);  // Set the clicked label's name and description
    setLabelDescription(label.description);
    setEditingLabelIndex(index); // Track which label is being edited
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
      {/* Button with Plus Icon and Text */}
      <Button 
        variant="outlined" 
        className="add-label-family-button" 
        onClick={handleClickOpen}
        startIcon={<AddIcon />}
      >
        Add Label Family
      </Button>

      {/* Pop-up Dialog */}
      <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{editingLabelIndex !== null ? 'Edit Label Family' : 'Add New Label Family'}</DialogTitle>
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
        <Button onClick={handleSubmision} variant="contained" color="primary" className="half-width-button">
          Submit
        </Button>
        <Button onClick={handleClose} variant="outlined" color="primary" className="half-width-button">
          Cancel
        </Button>
      </div>
    </div>
        </DialogContent>
      </Dialog>
    </div>
    {/* Display submitted labels */}
    <div className="submitted-label-families">
        {submittedLabelFamilies.map((label, index) => (
          <Button
            key={index}
            onClick={() => handleEditLabel(label, index)}  // Open popup to edit this label
            className="label-box"
            variant="outlined"
            fullWidth
            style={{ textAlign: 'left', marginBottom: '10px' }}
          >
            <p><strong>Label name:</strong> {label.name}</p>
            <p><strong>Label family description:</strong> {label.description}</p>
          </Button>
        ))}
      </div>
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

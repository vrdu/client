import React, { useState, useCallback, useEffect} from 'react';
import '../styling/home.css'; 
import '../styling/configureLabels.css'; 
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"; // For zooming functionality
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { api } from '../helpers/api';

import labelFamily from '../models/labelFamily';
import label from '../models/label';

import  { useLabelFamiliesWithReducer } from '../helpers/useLabelFamiliesWithReducer';
import { South } from '@mui/icons-material';
console.log("useLabelFamiliesWithReducer:", useLabelFamiliesWithReducer);
// import { Document, Page } from 'react-pdf';



const ConfigureLabels = () => {
  const [droppedFile, setDroppedFile] = useState(null);
  const [zoomEnabled, setZoomEnabled] = useState(false);

  const [openAddFamily, setOpenAddFamily] = useState(false);
  const [openLabel, setOpenLabel] = useState(false);
  const [expandedLabels, setExpandedLabels] = useState({});
  const [expandedFamilies, setExpandedFamilies] = useState({});

  //for checking if label (family) is being added or edited
  const [activeLabelFamilyId, setActiveLabelFamilyId] = useState(null); //to track if editing 
  const [addedLabelFamilyId, setAddedLabelFamilyId] = useState(null); //to track if added
  const [editingLabelId, setEditingLabelId] = useState(null); //editing
  const [addingLabelId, setAddingLabelId] = useState(null); //adding

  const [newLabel, setNewLabel] = useState({ id: null, labelName: '', labelDescription: '', register: true, descriptionShown: false });
  //used to store the label families (and their labels) 
  //const {labelFamilies, addLabelFamily, updateLabelFamily, addOrUpdateLabel } = useLabelFamiliesWithReducer();
  const [labelFamilies, setLabelFamilies] = useState([]);
  const [newLabelFamily, setNewLabelFamily] = useState({id: null, index: null, labelFamilyName: '', oldLabelFamilyName: '',register: true, labelFamilyDescription: '',inUse: true, labels: []});
  const [updatedNewLabelFamily, setUpdatedNewLabelFamily] = useState({id: null, index: null, labelFamilyName: '', oldLabelFamilyName: '',register: true, labelFamilyDescription: '',inUse: true, labels: []});
  // Error handling
  const [alertStatus, setAlertStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//make calls to backend

//load all labels when loading the website

const sendLabelFamiliesToBackend = async () => {
  console.log("sendLabelFamiliesToBackend");
  try {
    const username = sessionStorage.getItem('username');
    const projectName = sessionStorage.getItem('projectName');

    await api(false).post(`/projects/${username}/${projectName}/label-families`, labelFamilies, {
      withCredentials: true,  
    });

  } catch (error) {
    raiseError(error.response.data.detail);
    
  }
};

//Error handling
const raiseError = (error) => {
  console.log("error:")
  console.log(error);
  setAlertStatus(true);
  setErrorMessage(error)
  
}
//when deleting a label family, make a delete request to backend

//when deleting a label, make a delete request to backend
//hook to send the data to the backend at the right time:
/*
useEffect(() => {
  if (newLabel.id === null && newLabelFamily.id === null && labelFamilies.length > 0 && open ===false && openLabel === false) {

    sendLabelFamiliesToBackend();
  }
}, [labelFamilies, newLabel, newLabelFamily]);  

*/

  // Logic concerning the Label Families
  const handleAddLabelFamily = () => {
    const newId = generateUniqueIdLabelFamily(); 
    const newIndex = labelFamilies.length;
    const newLabelFamily = new labelFamily({id: newId, index: newIndex, labelFamilyName: '', oldLabelFamilyName: '', labelFamilyDescription: '',register:true, labels: []}); 
    setNewLabelFamily(newLabelFamily);
    setAddedLabelFamilyId(newId); 
    setOpenAddFamily(true); 
  };

  const generateUniqueIdLabelFamily = () => {
    return labelFamilies.length === 0 ? 1 : Math.max(...labelFamilies.map(f => f.id)) + 1;
  };

  const handleEditLabelFamily = (id) => {
    const familyToEdit = labelFamilies.find(labelFamily => labelFamily.id === id);
    if (familyToEdit) {
      setNewLabelFamily({oldLabelFamilyName: familyToEdit.labelFamilyName, labelFamilyName: familyToEdit.labelFamilyName, labelFamilyDescription: familyToEdit.labelFamilyDescription, register: false, labels: familyToEdit.labels});
      setActiveLabelFamilyId(id); // Track the ID of the label family being edited
      setOpenAddFamily(true); // Open the dialog
      console.log(openAddFamily)
    }
  };

  useEffect(() => {
    // Check if the 'inUse' field is false
    console.log("useEffect newLabelFamily.inUse"+ newLabelFamily.inUse)
    if (newLabelFamily.inUse === false) {
      console.log("newLabelFamily.inUse === false")
      // Send request to backend
      const sendRequest = async () => {
        try {
          const username = sessionStorage.getItem('username');
          const projectName = sessionStorage.getItem('projectName');
      
          await api(false).post(`/projects/${username}/${projectName}/label-families`, labelFamilies, {
            withCredentials: true,  
          });
      
        } catch (error) {
          raiseError(error.response.data.detail);
          
        }
      };

      sendRequest(); // Trigger the request when `inUse` is false
    }
  }, [newLabelFamily]);


  const handleSubmitLabelFamily = async (e) => {
    console.log("handleSubmitLabelFamily");
    e.preventDefault(); 
    try {
      // First, update the updatedNewLabelFamily with 'inUse' set to false
      const updatedNewLabelFamily = { ...newLabelFamily, inUse: false };
    
      // Set updatedNewLabelFamily and wait for the new value in setNewLabel
      setUpdatedNewLabelFamily(updatedNewLabelFamily);
      console.log("updatedNewLabelFamily"+ updatedNewLabelFamily)
      // Use a callback to ensure the second set happens after the first finishes

      // Then, update label families array with the new label family
      setLabelFamilies((prevFamilies) => [...prevFamilies, updatedNewLabelFamily]);
      console.log("labelFamilies"+ labelFamilies)
    } catch (error) {
      console.error("Error updating or adding label family:", error);
    }
    sendLabelFamiliesToBackend();
    // Close the modal or handle the UI after all state updates
    handleClose();
    
};

  const handleSubmitEditFamily = async (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page
  
    // Make sure the submission happens after this block completes
    const labelFamilyId = activeLabelFamilyId !== null ? activeLabelFamilyId : addedLabelFamilyId;
    
    if (labelFamilyId !== null && newLabelFamily) {
      console.log("dispatching label family:", newLabelFamily);
      
      try {
        if (addedLabelFamilyId !== null) {
          // Adding a new label family
          //await addLabelFamily(newLabelFamily); // Ensures this operation finishes first
        } else {
          // Editing an existing label family
          //await updateLabelFamily(newLabelFamily); // Ensures this operation finishes first
        }
        
        console.log("Label family updated successfully");
  
        // Perform updates that should happen right after the submission
        handleClose(); // Close the dialog
        sendLabelFamiliesToBackend(); // Send updated data to the backend
      } catch (error) {
        console.error("Error updating or adding label family:", error);
      }
    }
  };
  
  
  //Editing labels
  const handleAddLabel = (labelFamily) => {
    const newId = generateUniqueIdLabel(labelFamily); 
    const newIndex = labelFamily.labels.length;
    const newLabel = new label({ id: newId, labelName: '', labelDescription: '', index: newIndex, register: true });
    //addOrUpdateLabel(labelFamily.id, newLabel);  // Add or update a label within a family
    //console.log("newId in handleAddLabel" + newId);
    setActiveLabelFamilyId(labelFamily.id); 
    setAddingLabelId(newId);
    setOpenLabel(true); 
  };
    
  const generateUniqueIdLabel = (labelFamily) => {
    return labelFamily.labels.length === 0 
      ? 1 
      : Math.max(...labelFamily.labels.map(label => label.id)) + 1;
  };
  
  const handleClose = () => {
    setNewLabelFamily({ id: null, labelFamilyName: '', labelFamilyDescription: '', register: true, labels: [] });
    setNewLabel({ id: null, labelName: '', labelDescription: '', descriptionShown: false, index: null }); 
    setEditingLabelId(null);
    setOpenAddFamily(false);
    setOpenLabel(false);
    setActiveLabelFamilyId(null);
    setAddedLabelFamilyId(null);

  };

  const handleSubmitLabel = () => {
    const labelId = addingLabelId !== null ? addingLabelId : editingLabelId;
  
    const updatedNewLabel = {
      ...newLabel,   
      id: labelId,   
    };
  
    // Use addOrUpdateLabel from the reducer to update the label in the active family
    labelFamilies.forEach((family) => {
      if (family.id === activeLabelFamilyId) {
        //addOrUpdateLabel(family.id, updatedNewLabel); // Update the label in the matching family
      }
    });
    // Close the popup and reset fields
    setOpenAddFamily(false);
    
    handleClose();

  };
  
  const handleEditLabel = (label, labelFamilyId) => {
    setNewLabel({ id: label.id, labelName: label.labelName, labelDescription: label.labelDescription, descriptionShown: false}); // Set the label name for editing
    setActiveLabelFamilyId(labelFamilyId); // Keep track of which labelFamily is being edited
    setEditingLabelId(label.id); // Track the specific label being edited
    setOpenLabel(true); // Open the dialog for editing
    
  };

  // Functionalities for expanding and collapsing the description of label families and labels
  const toggleFamilyExpansion = (id, e) => {
    e.stopPropagation(); 
    setExpandedFamilies((prev) => ({
      ...prev,
      [id]: !prev[id], 
    }));
  };

    
    const toggleLabelExpansion = (labelIndex, e) => {
      e.stopPropagation();
      setExpandedLabels((prev) => ({
        ...prev,
        [labelIndex]: !prev[labelIndex], 
      }));
    };

  // Drop PDF Functionality
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

  return (
    <div>
      {/* Pop-up Dialog For adding new LabelFamilies*/}
      <Dialog open={openAddFamily} onClose={handleClose}>
            <DialogTitle>{ 'Add New Label Family'}</DialogTitle>
            <form onSubmit={handleSubmitLabelFamily}>
              <DialogContent>
                {/* Content inside pop-up */}
                <div className="form-container">
            
                  {/* TextField for Label Name */}
                  <TextField
                    label="Label Family Name"
                    variant="outlined"
                    className="label-name-field"
                    value={newLabelFamily.labelFamilyName}
                    onChange={(e) => {setNewLabelFamily({ ...newLabelFamily, labelFamilyName: e.target.value, register: true, inUse: true })}}
                    fullWidth={false}
                    size="small" 
                  />

                  {/* TextField for Label Description */}
                  <TextField
                    label="Label Family Description"
                    variant="outlined"
                    className="label-description-field"
                    multiline
                    value={newLabelFamily.labelFamilyDescription}
                    
                    onChange={(e) => {setNewLabelFamily({ ...newLabelFamily, labelFamilyDescription: e.target.value, register: true, inUse: true })}}
                    rows = {4}
                  />
                </div>
              </DialogContent>
                      <DialogActions>
                        {/* Submit Button */}
                        <div className="button-container">
                          <Button 
                            variant="contained" 
                            style={{ marginTop: '20px' }}
                            type="submit" 
                            >
                            submit
                          </Button>
                          <Button onClick={handleClose} variant="outlined" color="primary" className="half-width-button">
                            Cancel
                          </Button>
                        </div>
                      </DialogActions>
                      </form>
                    </Dialog>

                    {/*pop-up for adding new label */}
            <Dialog open={openLabel} onClose={handleClose}>
              <DialogTitle>{editingLabelId !== null ? 'Edit Label' : 'Add New Label'}</DialogTitle>
                <DialogContent>
                  {/* Content inside pop-up */}
                  <div className="form-container">
              
                    {/* TextField for Label Name */}
                    <TextField
                      label="Label Name"
                      variant="outlined"
                      className="label-name-field"
                      value={newLabel.labelName}
                      onChange={(e) => setNewLabel({ ...newLabel, labelName: e.target.value })}
                      fullWidth={false}
                      size="small" 
                    />

                    {/* TextField for Label Description */}
                    <TextField
                      label="Label Description"
                      variant="outlined"
                      className="label-description-field"
                      multiline
                      value={newLabel.labelDescription}
                      onChange={(e) => setNewLabel({ ...newLabel, labelDescription: e.target.value })}
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
              
            
            </div>
            
    
            {/* Display submitted label */}
            <div className="submitted-label-families">
              {labelFamilies.map((newLabelFamily) => (
              <div className="label-family" key={newLabelFamily.index}>  {/* Wrapper for each label family */}
                <Button

                  onClick={() => handleEditLabelFamily(newLabelFamily.id)}  // Open popup to edit this label family
                  className="label-box"
                  variant="outlined"
                  fullWidth
                  style={{ textAlign: 'left', marginBottom: '10px', color: 'black',textTransform: 'none' }} // Style for layout
                >
                  <div className="label-family-container">
                    <div className="label-family-name">
                      <p>
                        <strong className="nowrap">Label family name:</strong><br />
                        <span className="custom-label-name-distance">{newLabelFamily.labelFamilyName || 'Unnamed'}</span>
                      </p>
                    </div>
                    <div className="family-container">
                      {/* Toggle Button for Description */}
                      <div className="label-description-container" style={{ textAlign: 'left' }}>
                        <Button
                          variant="text"
                          onClick={(e) => toggleFamilyExpansion(newLabelFamily.id, e)} // Toggle description visibility
                          endIcon={expandedFamilies[newLabelFamily.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />} // Toggle icon
                          style={{ padding: '0', margin: '0', textAlign: 'left', color: 'black', whiteSpace: 'nowrap', flexGrow: 1, textAlign: 'left',textTransform: 'none' }}
                          >
                          {expandedFamilies[newLabelFamily.id] ? <strong>Label family description:</strong> : <strong>Label family description</strong>}
                        </Button>
                        
                        {/* Conditionally render the description */}
                        {expandedFamilies[newLabelFamily.id] && (
                          <div className="label-description">
                            {newLabelFamily.labelFamilyDescription || 'No description'}
                          </div>
                        )}
                      </div>

                    </div>
                    
                  </div>
                </Button>

                {/* Display the list of labels under each label family */}
                <div className="label-list">
                  {newLabelFamily.labels.length > 0 && (
                    newLabelFamily.labels.map((label) => (
                      <div key={label.index}>
                        <Button
                          onClick={() => handleEditLabel(label, newLabelFamily.id)} // Pass the label and labelFamily's id to handle editing
                          className="label-button"
                          variant="outlined"
                          fullWidth
                          style={{ textAlign: 'left', marginBottom: '10px', color: 'black',textTransform: 'none' }} // Style for layout
                        >
                          <div className="label-header">
                            <div className="label-name"> 
                              <p>
                                <strong className="nowrap">Label name:</strong><br />
                                <span className="custom-label-name-label-description">{label.labelName || 'Unnamed'}</span>
                              </p>
                            </div>

                            <div className="label-description-container" style={{ textAlign: 'left' }}>
                              <Button
                                variant="text"
                                onClick={(e) => toggleLabelExpansion(label.id, e)} // Toggle description visibility by label's id
                                endIcon={expandedLabels[label.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />} // Toggle icon based on label's id
                                style={{ padding: '0', margin: '0', textAlign: 'left', color: 'black', whiteSpace: 'nowrap', flexGrow: 1, textAlign: 'left',textTransform: 'none' }}
                              >
                                {expandedLabels[label.id] ? <strong>Label description:</strong> : <strong>Label description</strong>}
                              </Button>
                              
                              {expandedLabels[label.id] && (
                                <div className="label-description">
                                  {label.labelDescription || 'No description available'}
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
                    onClick={() => handleAddLabel(newLabelFamily)}  // Trigger add label popup
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

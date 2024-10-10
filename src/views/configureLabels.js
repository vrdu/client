import React, { useState, useCallback, useEffect} from 'react';
import '../styling/home.css'; 
import '../styling/configureLabels.css'; 
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
//import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"; // For zooming functionality
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { api } from '../helpers/api';

import { CloseButton } from '../components/closeButton';
import labelFamily from '../models/labelFamily';
import label from '../models/label';

import  { useLabelFamiliesWithReducer } from '../helpers/useLabelFamiliesWithReducer';
console.log("useLabelFamiliesWithReducer:", useLabelFamiliesWithReducer);
// import { Document, Page } from 'react-pdf';

const ConfigureLabels = () => {
  const [droppedFile, setDroppedFile] = useState(null);
  //const [zoomEnabled, setZoomEnabled] = useState(false);

  const [openAddFamily, setOpenAddFamily] = useState(false);
  const [openUpdateFamily, setopenUpdateFamily] = useState(false);
  const [openAddLabel, setOpenAddLabel] = useState(false);
  const [openUpdateLabel, setOpenUpdateLabel] = useState(false);

  const [expandedLabels, setExpandedLabels] = useState({});
  const [expandedFamilies, setExpandedFamilies] = useState({});

  const [newLabel, setNewLabel] = useState({  id: null, 
                                              labelName: '',
                                              labelDescription: '',
                                              register: true,
                                              descriptionShown: false,
                                              index: '',
                                              familyName: '',
                                              oldLabelName: ''});
  //used to store the label families (and their labels) 
  //const {labelFamilies, addLabelFamily, updateLabelFamily, addOrUpdateLabel } = useLabelFamiliesWithReducer();
  const [labelFamilies, setLabelFamilies] = useState([]);
  const [newLabelFamily, setNewLabelFamily] = useState({id: null, 
                                                        index: null, 
                                                        labelFamilyName: '', 
                                                        oldLabelFamilyName: '',
                                                        register: true, 
                                                        labelFamilyDescription: '',
                                                        inUse: true, 
                                                        labels: []});

  // Error handling
  const [errorMessage, setErrorMessage] = useState("");

  //console logs
  useEffect(() => {
    console.log("labelFamiles: ", labelFamilies);
  }, [labelFamilies]);
  useEffect(() => {
    console.log("NewLabel: ", newLabel);
  }, [newLabel]);

//make calls to backend

//load all labels when loading the website

  const sendLabelFamilyToBackend = async (e) => {
    e.preventDefault();

    console.log("sendLabelFamilyToBackend");
    
    try {
      const username = sessionStorage.getItem('username');
      const projectName = sessionStorage.getItem('projectName');
      const response = await api(false).post(`/projects/${username}/${projectName}/label-families`, newLabelFamily, {
        withCredentials: true,  
      });
      if (!response.data.exists){
        setLabelFamilies((prevFamilies) => [...prevFamilies, newLabelFamily]);

        handleClose();
      }

    } catch (error) {
      raiseError(error.response.data.detail);
      
    }

    
  };

  const sendUpdateLabelFamilyToBackend = async (e) => {
    e.preventDefault();
    
    console.log("sendUpdatedLabelFamilyToBackend");
    setLabelFamilies((prevFamilies) => {
      const familyExists = prevFamilies.some(family => family.id === newLabelFamily.id);

      if (familyExists) {
        // Update the existing label family
        return prevFamilies.map(family =>
          family.id === newLabelFamily.id
            ? newLabelFamily  // Replace the existing family with the updated one
            : family
        );
      } else {
        // Add the new label family
        return [...prevFamilies, newLabelFamily];
      }
    });

    try {
      const username = sessionStorage.getItem('username');
      const projectName = sessionStorage.getItem('projectName');
      const response = await api(false).post(`/projects/${username}/${projectName}/label-families`, newLabelFamily, {
        withCredentials: true,  
      });
      if (!response.data.exists){
          handleClose();
      }

    } catch (error) {
      raiseError(error.response.data.detail);
      
    }
  };

  const sendUpdateLabelToBackend = async (e) => {
    e.preventDefault();

    console.log("sendUpdateLabelToBackend"+ newLabel);

    setLabelFamilies((prevFamilies) => {
      return prevFamilies.map(family => {
        if (family.labelFamilyName === newLabel.familyName) {
          // We found the labelFamily that matches the labelFamilyName in newLabel
          const labelExists = family.labels.some(label => label.id === newLabel.id);
  
          // If the label exists, update it; if not, add it to the labels[] array
          const updatedLabels = labelExists
            ? family.labels.map(label => label.id === newLabel.id ? newLabel : label)
            : [...family.labels, newLabel]; // Add the new label
  
          // Return the updated labelFamily with updated labels[]
          return {
            ...family,
            labels: updatedLabels
          };
        }
  
        // Return unchanged labelFamily for others
        return family;
      });
    });
  
    try {
      const username = sessionStorage.getItem('username');
      const projectName = sessionStorage.getItem('projectName');
      const response = await api(false).post(`/projects/${username}/${projectName}/labels`, newLabel, {
        withCredentials: true,  
      });
      if (!response.data.exists){
        handleClose();
    }


    } catch (error) {
      raiseError(error.response.data.detail);
    }
  };

  const sendLabelToBackend = async (e) => {
    e.preventDefault();

    console.log("sendLabelToBackend"+ newLabel);
    
    
    
    try {
      const username = sessionStorage.getItem('username');
      const projectName = sessionStorage.getItem('projectName');
      const response = await api(false).post(`/projects/${username}/${projectName}/labels`, newLabel, {
        withCredentials: true,  
      });
      if (!response.data.exists){
        labelFamilies.forEach((family) => {
          if (family.id === newLabel.labelFamilyId) {
            
          }
        });
        const updatedLabelFamilies = labelFamilies.map((family) => {
          if (family.labelFamilyName === newLabel.familyName) {
            return {
              ...family,
              labels: [...family.labels, newLabel], 
            };
          }
          return family; 
        });
      
        setLabelFamilies(updatedLabelFamilies);

        handleClose();

      }
    } catch (error) {
      raiseError(error.response.data.detail);
    }

  };

  //Error handling
  const raiseError = (error) => {
    console.log("error:")
    console.log(error);
    setErrorMessage(error)
    
  }
//when deleting a label family, make a delete request to backend

//when deleting a label, make a delete request to backend
//hook to send the data to the backend at the right time:


  // Logic concerning the Label Families
  const handleAddLabelFamily = () => {
    const newId = generateUniqueIdLabelFamily(); 
    const newIndex = labelFamilies.length;
    const newLabelFamily = new labelFamily({id: newId, 
                                            index: newIndex, 
                                            labelFamilyName: '', 
                                            oldLabelFamilyName: '', 
                                            labelFamilyDescription: '',
                                            register:true, 
                                            labels: []}); 
    setNewLabelFamily(newLabelFamily);
    setOpenAddFamily(true); 
  };

  const handleEditLabelFamily = (id) => {
    const familyToEdit = labelFamilies.find(labelFamily => labelFamily.id === id);
    if (familyToEdit) {
      setNewLabelFamily({oldLabelFamilyName: familyToEdit.labelFamilyName, 
                          labelFamilyName: familyToEdit.labelFamilyName, 
                          labelFamilyDescription: familyToEdit.labelFamilyDescription, 
                          register: false, 
                          labels: familyToEdit.labels,
                          id: familyToEdit.id,
                          index: familyToEdit.index,
                          });
      setopenUpdateFamily(true); 
    }
  };

  const generateUniqueIdLabelFamily = () => {
    return labelFamilies.length === 0 ? 1 : Math.max(...labelFamilies.map(f => f.id)) + 1;
  };

  //Editing labels
  const handleAddLabel = (labelFamily) => {
    const newId = generateUniqueIdLabel(labelFamily); 
    const newIndex = labelFamily.labels.length;
    const newLabel = new label({  id: newId, 
                                  familyId: labelFamily.id,
                                  labelName: '', 
                                  labelDescription: '', 
                                  index: newIndex,
                                  descriptionShown: false, 
                                  register: true,
                                  familyName: labelFamily.labelFamilyName,
                                  oldLabelName: ''});
    setNewLabel(newLabel);
    setOpenAddLabel(true); 
  };

  const handleEditLabel = (label, labelFamily) => {
    setNewLabel({ id: label.id, 
                  labelName: label.labelName, 
                  labelDescription: label.labelDescription, 
                  descriptionShown: false,
                  familyId: labelFamily.id,
                  index: label.index,
                  register: false,
                  familyName: labelFamily.labelFamilyName,
                  oldLabelName: label.labelName }); 
    setOpenUpdateLabel(true); // Open the dialog for editing
    
  };
    
  const generateUniqueIdLabel = (labelFamily) => {
    return labelFamily.labels.length === 0 
      ? 1 
      : Math.max(...labelFamily.labels.map(label => label.id)) + 1;
  };
  
  const handleClose = () => {
    setNewLabelFamily({ id: null, labelFamilyName: '', labelFamilyDescription: '', register: true, labels: [] });
    setNewLabel({ id: null, labelName: '', labelDescription: '', descriptionShown: false, index: null }); 

    //cloing all different pop-ups 
    setOpenAddFamily(false);
    setOpenAddLabel(false);
    setopenUpdateFamily(false);
    setOpenUpdateLabel(false);

    setErrorMessage("");
  };
  
  //Deleting of label families/labels
  const deleteLabelFamily = (id) => {
  }

  const deleteLabel = (id) => {
  }
  
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
      //setZoomEnabled(true); // Enable zoom once a file is dropped
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
      <Dialog open={openAddFamily} onClose={errorMessage ? null : handleClose}>
        <DialogTitle>{ 'Add New Label Family'}</DialogTitle>
        <form onSubmit={sendLabelFamilyToBackend}>
          <DialogContent>
            {/* Content inside pop-up */}
            <div className="form-container">

              {/* TextField for Label Name */}
              <TextField
                label="Label Family Name"                  
                variant="outlined"
                className="label-name-field"
                value={newLabelFamily.labelFamilyName|| ''}
                onChange={(e) => {setNewLabelFamily({ ...newLabelFamily, labelFamilyName: e.target.value, register: true, inUse: true })}}
                fullWidth={false}
                helperText={errorMessage}
                error={!!errorMessage}
                size="small" 
              />

              {/* TextField for Label Description */}               
              <TextField
                label="Label Family Description"
                variant="outlined"
                className="label-description-field"
                multiline
                value={newLabelFamily.labelFamilyDescription|| ''}
                  
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

      {/* Pop-up Dialog For updating new LabelFamilies*/}
      <Dialog open={openUpdateFamily} onClose={errorMessage ? null : handleClose}>
              <DialogTitle>{ 'Update Label Family'}</DialogTitle>
              <form onSubmit={sendUpdateLabelFamilyToBackend}>
                <DialogContent>
                  {/* Content inside pop-up */}
                  <div className="form-container">

                    {/* TextField for Label Name */}
                    <TextField
                      label="Label Family Name"                  
                      variant="outlined"
                      className="label-name-field"
                      value={newLabelFamily.labelFamilyName|| ''}
                      onChange={(e) => {setNewLabelFamily({ ...newLabelFamily, labelFamilyName: e.target.value, register: false, inUse: true })}}
                      fullWidth={false}
                      helperText={errorMessage}
                      error={!!errorMessage}
                      size="small" 
                    />

                    {/* TextField for Label Description */}               
                    <TextField
                      label="Label Family Description"
                      variant="outlined"
                      className="label-description-field"
                      multiline
                      value={newLabelFamily.labelFamilyDescription|| ''}
                        
                      onChange={(e) => {setNewLabelFamily({ ...newLabelFamily, labelFamilyDescription: e.target.value, register: false, inUse: true })}}
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
            <Dialog open={openAddLabel} onClose={errorMessage ? null : handleClose}>
              <DialogTitle>{'Add New Label'}</DialogTitle>
              <form onSubmit={sendLabelToBackend}>
                <DialogContent>
                  <div className="form-container">
                    <TextField
                      label="Label Name"
                      variant="outlined"
                      className="label-name-field"
                      value={newLabel.labelName|| ''}
                      onChange={(e) => setNewLabel({ ...newLabel, labelName: e.target.value, register: true})}
                      fullWidth={false}
                      helperText={errorMessage}
                      error={!!errorMessage}
                      size="small" 
                    />

                    <TextField
                      label="Label Description"
                      variant="outlined"
                      className="label-description-field"
                      multiline
                      value={newLabel.labelDescription|| ''}
                      onChange={(e) => setNewLabel({ ...newLabel, labelDescription: e.target.value, register: true})}
                      rows = {4}
                    />
                  
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
                  </div>
                </DialogContent>
              </form>
            </Dialog>

            <Dialog open={openUpdateLabel} onClose={errorMessage ? null : handleClose}>
              <DialogTitle>{'Update Label'}</DialogTitle>
              <form onSubmit={sendUpdateLabelToBackend}>
                <DialogContent>
                  <div className="form-container">
                    <TextField
                      label="Label Name"
                      variant="outlined"
                      className="label-name-field"
                      value={newLabel.labelName|| ''}
                      onChange={(e) => setNewLabel({ ...newLabel, labelName: e.target.value, register: false})}
                      fullWidth={false}
                      helperText={errorMessage}
                      error={!!errorMessage}
                      size="small" 
                    />

                    <TextField
                      label="Label Description"
                      variant="outlined"
                      className="label-description-field"
                      multiline
                      value={newLabel.labelDescription|| ''}
                      onChange={(e) => setNewLabel({ ...newLabel, labelDescription: e.target.value, register: false})}
                      rows = {4}
                    />
                  
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
                  </div>
                </DialogContent>
              </form>
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
                  onMouseEnter={(e) => {
                    e.currentTarget.querySelector('.close-button').style.visibility = 'visible'; 
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.querySelector('.close-button').style.visibility = 'hidden'; 
                  }}
                >
                  <div className="label-family-container">
                  <CloseButton  className="close-button" styling={{right:'-400px', top:"-12px"}}onClick={() =>deleteLabelFamily(newLabelFamily.id)} />
                      
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

                        <div
                          className="label-container"
                          style={{ textAlign: 'left', marginBottom: '10px', color: 'black', textTransform: 'none' }} 
                          onClick={() => handleEditLabel(label, newLabelFamily)} 
                          onMouseEnter={(e) => {
                            e.currentTarget.querySelector('.close-button').style.visibility = 'visible'; 
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.querySelector('.close-button').style.visibility = 'hidden'; 
                          }}
                        >
                         <CloseButton styling={{right: "-380px", top:'-18px'}} onClick={() =>deleteLabel(label.id)} />

                          <div className="label-header">

                            <div className="label-name"> 

                              <p>
                                <strong className="nowrap">Label name:</strong><br />
                                <span className="custom-label-name-label-description">{label.labelName || 'Unnamed'}</span>
                              </p>
                            </div>

                            <div className="label-description-container" style={{ textAlign: 'left', color: 'black' }}>

                              <Button
                                variant="text"
                                onClick={(e) => toggleLabelExpansion(label.id, e)} // Toggle description visibility by label's id
                                endIcon={expandedLabels[label.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />} // Toggle icon based on label's id
                                style={{ padding: '0', margin: '0', textAlign: 'left', color: 'black', whiteSpace: 'nowrap', flexGrow: 1, textAlign: 'left', textTransform: 'none' }}
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
                        </div>
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

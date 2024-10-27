import React, { useState, useCallback, useEffect} from 'react';
import '../styling/home.css'; 
import '../styling/configureLabels.css'; 
import '../styling/index.css';
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

  //Adding stuff
  const [openAddFamily, setOpenAddFamily] = useState(false);
  const [openUpdateFamily, setopenUpdateFamily] = useState(false);
  const [openAddLabel, setOpenAddLabel] = useState(false);
  const [openUpdateLabel, setOpenUpdateLabel] = useState(false);
  //deleting stuff
  const [deleteLabelFamily, setDeleteLabelFamily] = useState(false);
  const [deleteLabel, setDeleteLabel] = useState(false);

  //pop-up for importing label (families)
  const [importLabelFamily, setImportLabelFamily] = useState(false);

  //projects Array to store all projects, that will be imported
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState({id: null, toImport: false, projectName: '', labelFamilies: []});
  const[expandedImportProjects, setExpandedImportProjects] = useState({});

  const [expandedLabels, setExpandedLabels] = useState({});
  const [expandedFamilies, setExpandedFamilies] = useState({});

  const [newLabel, setNewLabel] = useState({  id: null, 
                                              labelName: '',
                                              labelDescription: '',
                                              register: true,
                                              toImport: false,
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
                                                        toImport: true,
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

//useEffect to load all label families when loading the website
useEffect(() => {
  const fetchProjects = async () => {
    const username = sessionStorage.getItem('username');
    try {
      const projectName = sessionStorage.getItem('projectName');
      const response = await api(false).get(`/projects/${username}/${projectName}/label-families`, {
        withCredentials: true,  
      });
      setLabelFamilies(response.data);  
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  fetchProjects();
}, []);

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
    setDeleteLabelFamily(false);
    setDeleteLabel(false);
    setImportLabelFamily(false);

    setErrorMessage("");
  };
  
  //Deleting of label families/labels
  const handleDeleteLabelFamily = (id) => {
    const familyToDelete = labelFamilies.find(labelFamily => labelFamily.id === id);
    if (familyToDelete) {
      setNewLabelFamily({oldLabelFamilyName: familyToDelete.labelFamilyName, 
                          labelFamilyName: familyToDelete.labelFamilyName, 
                          labelFamilyDescription: familyToDelete.labelFamilyDescription, 
                          register: false, 
                          labels: familyToDelete.labels,
                          id: familyToDelete.id,
                          index: familyToDelete.index,
                          });
      setDeleteLabelFamily(true); 
                        }
  };

  const sendDeleteLabelFamilyToBackend = async (e) => {
    e.preventDefault();

    console.log("sendDeleteLabelFamilyToBackend");
    
    try {
      const username = sessionStorage.getItem('username');
      const projectName = sessionStorage.getItem('projectName');
      const response = await api(false).delete(`/projects/${username}/${projectName}/label-families`,  {
        data: newLabelFamily,
        withCredentials: true,  
      });
      if (response.status === 200) {
        setLabelFamilies((prevFamilies) => 
          prevFamilies.filter(family => family.id !== newLabelFamily.id)  
        );
        handleClose();
      }

    } catch (error) {
      raiseError(error.response.data.detail);
      
    }

    
  };


  const handleDeleteLabel = (labelFamily, id) => {
    // Find the matching labelFamily by its name
    const foundFamily = labelFamilies.find(family => family.labelFamilyName === labelFamily.labelFamilyName);
    
    // If the labelFamily is found, look for the specific label by its id
    if (foundFamily) {
      const deleteLabel = foundFamily.labels.find(label => label.id === id);
      setNewLabelFamily(labelFamily)
      if (deleteLabel) {
        setNewLabel(deleteLabel);  // Set the found label as the newLabel
        setDeleteLabel(true);      // Trigger the delete action
      }
    }
  };
  

  const sendDeleteLabelToBackend = async (e) => {
    e.preventDefault();
    try {
      const username = sessionStorage.getItem('username');
      const projectName = sessionStorage.getItem('projectName');
      const response = await api(false).delete(`/projects/${username}/${projectName}/labels`,  {
        data: newLabel,
        withCredentials: true,  
      });
      if (response.status === 200) {
        setLabelFamilies((prevFamilies) =>
          prevFamilies.map((family) => {
            if (family.id === newLabelFamily.id) {
              console.log("matched a familyId")
              return {
                ...family,
                labels: family.labels.filter((label) => label.id !== newLabel.id),
              };
            }
            return family;
          })
        );
          handleClose();  
      }

    } catch (error) {
      raiseError(error.response.data.detail);
      
    }

  };

  //Importing label families
  const sendGetLabelFamilyToBackend = async (e) => {
    e.preventDefault();
  
      const username = sessionStorage.getItem('username');
      try {
      
        const response = await api(false).post(`/projects/${username}`, projects, {
          withCredentials: true,  
        });
        setLabelFamilies(response.data);  
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
  };

  const sendGetProjectsToBackend = async (e) => {
    
    try {
      const username = sessionStorage.getItem('username');
      const response = await api(false).get(`/projects/${username}`, {
        withCredentials: true,  
      });
      if (!response.data.exists){
        const projectNameFromStorage = sessionStorage.getItem('projectName');
        const matchedProject = response.data.find(project => project.projectName === projectNameFromStorage);
         if (matchedProject) {

          const unmatchedProjects = response.data.filter(project => project.projectName !== projectNameFromStorage);
          let Id = 0;
          const parsedProjects = unmatchedProjects.map(project => {
            Id += 1  
            return {
              id: Id, 
              projectName: project.projectName, 
              labelFamilies: project.labelFamilies || [] 
            };
          });
        
        setProjects(parsedProjects);
      } else {
        console.log("No matching project found with projectName: ", projectNameFromStorage);
      }
          
      }

    } catch (error) {
      raiseError(error.response.data.detail);
      
    }

  }


  useEffect(() => {
    if (projects && projects.length > 0 && projects[0].projectName) {
      setImportLabelFamily(true);
      
    }
}, [projects]);
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
  //Toggling of the import label family pop-up

// Function to toggle project expansion
const toggleImportLabelFamilyExpansion = async (id, e) => {
  e.stopPropagation();

  try {
    const username = sessionStorage.getItem('username');
    const projectName = projects.find(project => project.id === id).projectName;

    const response = await api(false).get(`/projects/${username}/${projectName}/label-families`, {
      withCredentials: true,
    });
    console.log("response: ", response.data);
    
    if (response.data) {
      let Id = -1;
      const parsedLabelFamilies = response.data.map(family => {
        Id += 1;
        const StrId = Id.toString();
        return {
          index: StrId,
          id: Id,
          labelFamilyName: family.labelFamilyName,
          labelFamilyDescription: family.labelFamilyDescription,
          toImport: true,
          labels: family.labels.map(label => ({
            index: label.index,
            labelName: label.labelName,
            labelDescription: label.labelDescription,
            toImport: false,
          })),
        };
      });

      // Update the labelFamilies in the correct project
      const updatedProjects = projects.map(project => {
        if (project.id === id) {
          return {
            ...project,
            labelFamilies: parsedLabelFamilies, // Set labelFamilies for this project
          };
        }
        return project;
      });
      setProjects(updatedProjects);
      console.log("projectsInFetching: ", projects);
      // Toggle expansion state for this project
      setExpandedImportProjects(prevState => ({
        ...prevState,
        [id]: !prevState[id], // Toggle the boolean for this project ID
      }));
      console.log("before")
      console.log("expandedImportProjects: ", expandedImportProjects);
    } else {
      console.log("No label families found for the project.");
    }

  } catch (error) {
    raiseError(error.response?.data?.detail || 'Error fetching label families');
  }
};

const toggleToImportProject = (id) => {
  setProjects(prevProjects => 
    prevProjects.map(project => 
      project.id === id 
        ? { ...project, toImport: !project.toImport }  // Toggle toImport
        : project
    )
  );
};

const toggleToImportLabelFamily = (projectId, labelFamilyIndex) => {
  console.log("Before update - projects: ", typeof(labelFamilyIndex));
  const strFamilyIndex = toString(labelFamilyIndex);
  setProjects(prevProjects => {
    const updatedProjects = prevProjects.map(project => 
      project.id === projectId
        ? {
            ...project,
            labelFamilies: project.labelFamilies.map(labelFamily =>
              labelFamily.id === labelFamilyIndex
                ? { ...labelFamily, toImport: !labelFamily.toImport }  
                : labelFamily
            )
          }
        : project
    );

    console.log("Updated projects: ", updatedProjects);
    return updatedProjects;
  });
};


useEffect(() => {
  console.log("Updated projects: ", projects);
}, [projects]);  // Runs every time `projects` is updated





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
<Dialog open={importLabelFamily} onClose={handleClose}>
  <DialogTitle>
    {`Select the label (families) you want to import`} <br />
  </DialogTitle>
  <div className="projects-container">
    {projects && projects.length > 0 ? (
      <div className="projects-list">
        {projects.map((project, index) => (
          <div className="project-item" key={index}>
            <div className="project-container">
              {/* Left blue button */}
              <button className="import-labels-button"
              onClick={() => toggleToImportProject(project.id)}
              style={{
                backgroundColor: project.toImport ? 'var(--blue)' : 'white'
              }}
              ></button>

              {/* Project name in the middle */}
              <strong className="project-name">
                Project Name: {project.projectName}
              </strong>

              {/* Expand button for labelFamilies */}
              <button
                className="expand-button"
                onClick={(e) =>
                  toggleImportLabelFamilyExpansion(project.id, e)
                }
              >
                {expandedImportProjects[project.id] ? (
                  <ExpandLessIcon className="expand-icon" />
                ) : (
                  <ExpandMoreIcon className="expand-icon" />
                )}
              </button>
            </div>

            {/* LabelFamilies list, shown when expanded */}
            {expandedImportProjects[project.id] && (
              <div className="family-list">
                {project.labelFamilies && project.labelFamilies.length > 0 ? (
                  project.labelFamilies.map((labelFamily, labelIndex) => (
                    <div className="label-family-item" key={labelIndex}>
                      <button className="import-labelFamily-button"
                      onClick={() => toggleToImportLabelFamily(project.id, labelIndex)}
                      style={{
                        backgroundColor:  labelFamily.toImport ? 'var(--blue)' : 'white'
                      }}
                      ></button>
                      <strong className="label-family-name">
                        Label Family: {labelFamily.labelFamilyName}
                      </strong>
                      
                      {/* You can expand further here for label details if needed */}
                    </div>
                  ))
                ) : (
                  <p>No label families available</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p>No projects available</p>
    )}
  </div>
  <form onSubmit={sendGetLabelFamilyToBackend}>
    <DialogActions>
      {/* Submit Button */}
      <div className="button-container">
        <Button 
          variant="contained" 
          className="half-width-button"
          style={{ marginTop: '20px', background: 'var(--blue)' }}
          type="submit"
        >
          IMPORT
        </Button>
        <Button 
          onClick={handleClose} 
          variant="outlined" 
          color="primary" 
          className="half-width-button"
          style={{ marginTop: '20px' }}
        >
          Cancel
        </Button>
      </div>
    </DialogActions>
  </form>
</Dialog>



      {/* pop-up deleting label family */}
      <Dialog open={deleteLabelFamily} onClose={handleClose}>
        <DialogTitle>
          {`Sure to Delete Label Family with Name:`} <br />
          <strong style={{ display: 'block', textAlign: 'center' }}>
            {`${newLabelFamily.labelFamilyName}`}
          </strong>
        </DialogTitle>
       <form onSubmit={sendDeleteLabelFamilyToBackend}>
          <DialogActions>
            {/* Submit Button */}
            <div className="button-container">
              <Button 
                variant="contained" 
                className="half-width-button"
                style={{ marginTop: '20px', background: 'var(--red)' }}
                type="submit" 
                 >
                Delete
              </Button>
              <Button onClick={handleClose} 
              variant="outlined" 
              color="primary" 
              className="half-width-button"
              style={{ marginTop: '20px' }}
              >
                Cancel
              </Button>
            </div>
          </DialogActions>
        </form>
      </Dialog>

      {/* Pop-up Dialog For deleteing labels*/}
      <Dialog open={deleteLabel} onClose={handleClose}>
        <DialogTitle>
          {`Sure to Delete Label  with Name:`} <br />
          <strong style={{ display: 'block', textAlign: 'center' }}>
            {`${newLabel.labelName}`}
            {`${newLabelFamily.labelFamilyName}`}
          </strong>
        </DialogTitle>
       <form onSubmit={sendDeleteLabelToBackend}>
          <DialogActions>
            {/* Submit Button */}
            <div className="button-container">
              <Button 
                variant="contained" 
                className="half-width-button"
                style={{ marginTop: '20px', background: 'var(--red)' }}
                type="submit" 
                 >
                Delete
              </Button>
              <Button onClick={handleClose} 
              variant="outlined" 
              color="primary" 
              className="half-width-button"
              style={{ marginTop: '20px' }}
              >
                Cancel
              </Button>
            </div>
          </DialogActions>
        </form>
      </Dialog>

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
              <Button onClick={handleClose} 
              variant="outlined" 
              color="primary" 
              style={{ marginTop: '20px' }}className="half-width-button"
              >
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
              <Button onClick={handleClose} 
                variant="outlined" 
                color="primary" 
                style={{ marginTop: '20px' }}className="half-width-button"
                >
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
                <Button onClick={handleClose} 
                variant="outlined" 
                color="primary" 
                style={{ marginTop: '20px' }}className="half-width-button"
                >
                Cancel
              </Button>
              </div>
            </div>
          </DialogContent>
        </form>
      </Dialog>
      {/*pop-up for updating label */}
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
                <Button onClick={handleClose} 
                  variant="outlined" 
                  color="primary" 
                  style={{ marginTop: '20px' }}className="half-width-button"
                  >
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
              onClick = {() => sendGetProjectsToBackend() } 
              className="import-button"
            >
              Import labels
            </Button>
            
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
                  <CloseButton  className="close-button" styling={{right:'-400px', top:"-12px"}}onClick={(e) =>{handleDeleteLabelFamily(newLabelFamily.id); e.stopPropagation();}} />
                      
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
                          style={{ padding: '0', margin: '0', textAlign: 'left', color: 'black', whiteSpace: 'nowrap', flexGrow: 1,textTransform: 'none' }}
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
                         <CloseButton styling={{right: "-380px", top:'-18px'}} onClick={(e) =>{handleDeleteLabel(newLabelFamily, label.id); e.stopPropagation();}} />

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
                                style={{ padding: '0', margin: '0', textAlign: 'left', color: 'black', whiteSpace: 'nowrap', flexGrow: 1, textTransform: 'none' }}
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

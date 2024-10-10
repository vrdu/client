import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../helpers/api';  
import '../styling/project.css';  
import '../styling/index.css';  

const Project = ({ onClose }) => {
  const [projectName, setProjectName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/home');  // Redirect to /hub on closing the popup
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const username = sessionStorage.getItem('username');  
      const requestBody = JSON.stringify({ projectName });
      
      const response = await api().post(`/projects/create/${username}`, requestBody, {
        withCredentials: true
      });

      if (!response.data.exists) {
        // On success, navigate to the project page
        sessionStorage.setItem('projectName', projectName);
        navigate(`/projects/${projectName}/configureLabels`);
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        setErrorMessage(error.response.data.detail);
      }
    }
  };

  

  return (
    <div className='dialog-content'>
      <Dialog open={true} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle className="dialog-title">Name your Project</DialogTitle>

        <form onSubmit={handleSubmit}> {/* Wrap content in a form */}
          <DialogContent>
            <TextField
              autoFocus
              className="text-field"
              label="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              helperText={errorMessage}
              error={!!errorMessage}
              placeholder="Enter a name for the project"
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              type="submit" 
            >
              Submit
            </Button>
            <Button onClick={handleClose} className="close-button" variant="outlined">
              Close
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Project;

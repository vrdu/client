import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../helpers/api';  
import '../styling/enterAiName.css';  
import '../styling/index.css';  

const EnterAiName = ({ onClose }) => {
  const [aiName, setAiName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/home');  // Redirect to /hub on closing the popup
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submitting")
    try {
        const username = sessionStorage.getItem('username'); 
        const requestBody = JSON.stringify({ 
            projectName: `${username}${aiName}` 
          });
        console.log("requestBody")
        console.log(requestBody);
        const response = await api().post(`/projects/create/${username}`,requestBody,{
            withCredentials: true});         
      if (response.data.exists) {
        setErrorMessage('This name is already taken');
      } else {
        // Handle success - close the popup
        onClose();
      }
    } catch (error) {
      console.log(error);
      setErrorMessage('An error occurred while checking the name');
    }
  };

  return (
    <div className='dialog-content'>
      <Dialog open={true} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle className="dialog-title">My Dialog Title</DialogTitle>

        <form onSubmit={handleSubmit}> {/* Wrap content in a form */}
          <DialogContent>
            <TextField
              autoFocus
              className="text-field"
              label="AI Name"
              value={aiName}
              onChange={(e) => setAiName(e.target.value)}
              helperText={errorMessage}
              error={!!errorMessage}
              placeholder="Enter a name for the project"
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              type="submit" // This allows "Enter" to submit the form
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


export default EnterAiName;

import React from 'react';
import '../styling/home.css';  
import { Button, TextField, Container, Box, Alert, AlertTitle } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const ConfigureLabels = () => {
  return (
    <div className="container">
      <div className="blob">
        <h1 className="heading">Configure Labels</h1>
        <div className="buttonContainer">
          
          <Link to="/uploadInstructionDocuments">
          <Button
            variant="contained"
            color="primary" 
          >
            Upload Instruction Documents
          </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfigureLabels;

import React from 'react';
import '../styling/home.css';  
import { Button, TextField, Container, Box, Alert, AlertTitle } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container">
      <div className="blob">
        <h1 className="heading">Extraction AIs</h1>
        <div className="buttonContainer">
          
          <Link to="/ConfigureLabels">
          <Button
            variant="contained"
            color="primary" 
          >
            Add AI
          </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

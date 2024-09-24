import React, {useState} from 'react';
import '../styling/home.css';  
import { Button} from '@mui/material';
import { Link} from 'react-router-dom';
import Project from './project';

const ConfigureLabels = () => {
  const [popupVisible, setPopupVisible] = useState(true);

  const handleClosePopup = () => {
    setPopupVisible(false); 
  };

  return (
    <div>
    {popupVisible && <Project onClose={handleClosePopup} />}
    {!popupVisible && (
      <div>
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
        <h1>AI Configurations</h1>
      </div>
    )}
  </div>
      
    
  );
};

export default ConfigureLabels;

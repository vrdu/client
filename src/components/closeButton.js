// ReusableComponents.js
import React from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CloseButton = ({ onClick, styling }) => {
    console.log("exported.")
    const defaultStyle = {  
        width: '16px', 
      height: '16px', 
      backgroundColor: 'red', 
      color: 'white', 
      borderRadius: '50%', 
      padding: '3px', 
      position: 'relative', 
      top: '-10px',
      right: '-10px',
      visibility: 'hidden'
    };

    const mergedStyles = {...defaultStyle, ...styling};
return(
    <IconButton
    aria-label="delete"
    size="small"
    className="close-button"  
    style={ mergedStyles}
    onClick={onClick}
  >
    <CloseIcon style={{ color: 'white', fontSize: '12px' }} />
  </IconButton>


);
  
};
    

export {CloseButton}  ;

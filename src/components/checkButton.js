import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import '../components/checkButton.css'

const CheckButton = ({ checked, onClick }) => {
  return (
    <div>
      <button className="check-button" onClick={onClick}>
        {checked && ( // Render the icon only if `checked` is true
          <CheckIcon style={{ color: 'green', fontSize: '20px' }} />
        )}
      </button>
    </div>
  );
};

export default CheckButton;
import React, { useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import '../components/checkButton.css'

const CheckButton = () => {
  const [isButtonVisible, setButtonVisible] = useState(false);

  const handleButtonClick = () => {
    setButtonVisible(!isButtonVisible); 
  };

  return (
    <div>

    {isButtonVisible ? (
      <button className="checked-button" onClick={handleButtonClick}>
        <CheckIcon style={{ color: 'green', fontSize: '20px' }} />
      </button>
    ) : (
      <button className="check-button" onClick={handleButtonClick}>

      </button>
    )}
  </div>
  );
};

export default CheckButton;

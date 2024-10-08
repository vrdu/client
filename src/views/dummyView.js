import React, { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const DummyView = () => {
    const [labelFamilies, setLabelFamilies] = useState([]);
    const [labelFamily, setLabelFamily] = useState({ id: null, familyName: '', register: true, labels: [] });
    const [newLabel, setNewLabel] = useState({ id: null, labelName: '', register: true });
    const [open, setOpen] = useState(false);

    const handleAddLabelFamily = () => {
    setOpen(true);};
    const handleAddLabel = () => {    
        };

    const handleClose = () => { 
        setOpen(false);}

    const handleSubmit = (e) => {
        e.preventDefault();
        setLabelFamilies([...labelFamilies, labelFamily]);
        setLabelFamily({ id: null, familyName: '', register: true, labels: [] });
        setOpen(false);
        console.log(labelFamilies);
    }
    
    useEffect(() => {
      // This code will execute every time labelFamilies changes
      console.log("labelFamilies has changed:", labelFamilies);
  
      // You can perform any other action here, such as fetching data,
      // updating the backend, or triggering any side effects.
  
    }, [labelFamilies]); // Dependency array ensures it runs only when labelFamilies changes
  
    

    return (
    <div>
      <div className="label-family-container">
      <h1>labelFamilies:</h1>
        <ul>
          {labelFamilies.map((labelFamily) => (
            <li className="label-family" key={labelFamily.id}>
              {labelFamily.familyName}
              <ul>
                {labelFamily.labels.map((label) => (
                  <li key={label.id}>
                    {label.labelName}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <Button 
              variant="outlined" 
              className="add-label-family-button" 
              onClick={handleAddLabelFamily}
            >
              Add Label Family
        </Button>
        <Button 
              variant="outlined" 
              className="add-label-family-button" 
              onClick={handleAddLabel}
            >
              Add Label
        </Button>


        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle className="dialog-title">Add LabelFamily</DialogTitle>

        <form onSubmit={handleSubmit}> {/* Wrap content in a form */}
          <DialogContent>
            <TextField
              autoFocus
              className="text-field"
              label="Project Name"
              value={labelFamily.labelFamilyName}
              onChange={(e) => {setLabelFamily({ ...labelFamily, labelFamilyName: e.target.value })}}
              placeholder="Enter a name for the label Family"
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

export default DummyView;

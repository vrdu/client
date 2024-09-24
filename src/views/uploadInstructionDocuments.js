import React, { useCallback, useState } from 'react';
import '../styling/home.css'; 
import '../styling/uploadInstructionDocuments.css'; 
import { Button, IconButton  } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@mui/icons-material/Close';

const UploadInstructionDocuments = () => {

    const [files, setFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        setFiles((prevFiles) => {
          const existingFileNames = prevFiles.map((file) => file.name);
          const newFiles = acceptedFiles.filter((file) => !existingFileNames.includes(file.name));
          
          return [...prevFiles, ...newFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )];
        });
      }, []);
    
    const removeFile = (fileName) => {
        setFiles(files.filter(file => file.name !== fileName));
    };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.pdf,.doc,.docx,.txt', 
  });

  const renderFiles = () => (
    files.map((file, index) => (
      <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{file.name} - {file.size} bytes</span>
        <IconButton
          aria-label="delete"
          size="small"
          style={{ backgroundColor: 'red', color: 'white', borderRadius: '50%', padding: '5px' }}
          onClick={() => removeFile(file.name)}
        >
          <CloseIcon style={{ color: 'white', fontSize: '16px' }} />
        </IconButton>
      </li>
    ))
  );

  return (
    <div className="container">
      <div className="blob">
        <h1 className="heading">Configure Labels</h1>
        <div className="dropzone-container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop it like its hot!</p>
        ) : (
          <p>Drag and drop some files here</p>
        )}
      </div>
      <aside>
        <h4>Files:</h4>
        <ul>{renderFiles()}</ul>
      </aside>
    </div>
        <div className="buttonContainer">
          
          <Link to="/uploadInstructionDocuments">
          <Button
            variant="contained"
            color="primary" 
          >
            Annotate example documents
          </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UploadInstructionDocuments;

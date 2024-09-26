import React, { useCallback, useState } from 'react';
import '../styling/home.css'; 
import '../styling/uploadInstructionDocuments.css'; 
import { Button, IconButton, CircularProgress, LinearProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@mui/icons-material/Close';
import { api } from '../helpers/api';

const UploadInstructionDocuments = () => {

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false); // Track if uploading
  const [progress, setProgress] = useState(0); // Track upload progress

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
      <li 
        key={index} 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          position: 'relative', 
          padding: '2px',
          margin: '1px',  
          border: '1px solid var(--blue)', 
          borderRadius: '5px',
          backgroundColor: 'white',
          width: '400px',
          boxSizing: 'border-box',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.querySelector('.close-button').style.visibility = 'visible'; 
        }}
        onMouseLeave={(e) => {
          e.currentTarget.querySelector('.close-button').style.visibility = 'hidden'; 
        }}
      >
        <span>{file.name}</span> 
        <IconButton
          aria-label="delete"
          size="small"
          className="close-button"  
          style={{ 
            width: '16px', 
            height: '16px', 
            backgroundColor: 'red', 
            color: 'white', 
            borderRadius: '50%', 
            padding: '3px', 
            position: 'absolute', 
            top: '-10px',
            right: '-10px',
            visibility: 'hidden',  
          }}
          onClick={() => removeFile(file.name)}
        >
          <CloseIcon style={{ color: 'white', fontSize: '12px' }} />
        </IconButton>
      </li>
    ))
  );

  const uploadFiles = async () => {
    setLoading(true);
    try {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);  // Append files correctly
        });

        const username = sessionStorage.getItem('username'); 
        const projectName = sessionStorage.getItem('projectName');
        const concatProjectName = `${username}&${projectName}`;

        await api().post(`/projects/${concatProjectName}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',  // Important: set content type to multipart/form-data
            },
            onUploadProgress: (progressEvent) => {
                const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(percentage);  // Show upload progress
            }
        });

        setLoading(false);  // Remove loader after upload is done
    } catch (error) {
        console.error(error);
        setLoading(false);
    }
};


  return (
      <div className="blob">
        <h1 className="heading">Upload Instruction Documents</h1>
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

          {/* Progress Bar */}
          {loading && (
            <div style={{ width: '100%' }}>
              <LinearProgress variant="determinate" value={progress} />
              <span>{progress}% uploaded</span>
            </div>
          )}
        </div>
        <div className="buttonContainer">
          <Button
            variant="contained"
            color="primary"
            onClick={uploadFiles}  // Start upload
            disabled={loading} // Disable button when uploading
          >
            {loading ? <CircularProgress size={24} /> : 'Upload Files'}
          </Button>
        </div>
      </div>
  );
};

export default UploadInstructionDocuments;

import React, { useCallback, useState } from 'react';
import '../styling/home.css'; 
import '../styling/uploadInstructionDocuments.css'; 
import { Button, IconButton, CircularProgress, LinearProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';  // Icon for the checkmark
import { api } from '../helpers/api';

const UploadInstructionDocuments = () => {
  const [files, setFiles] = useState([]);
  const [fileStatuses, setFileStatuses] = useState({});  // Track upload status for each file
  const [clickedFile, setClickedFile] = useState(null);  // Track which file name was clicked

  const handleNameClick = (fileName) => {
    if (clickedFile === fileName) {
      setClickedFile(null); // Reset if clicked again
    } else {
      setClickedFile(fileName); // Set clicked file
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.filter(file => !files.some(f => f.name === file.name));

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);

    // Upload each new file as soon as it is dropped
    newFiles.forEach(file => {
      uploadFile(file);
    });
  }, [files]);

  const uploadFile = async (file) => {
    setFileStatuses((prevStatuses) => ({
      ...prevStatuses,
      [file.name]: { loading: true, completed: false, progress: 0 },
    }));

    try {
      const formData = new FormData();
      formData.append('files', file);  // Append the file

      const username = sessionStorage.getItem('username'); 
      const projectName = sessionStorage.getItem('projectName');
      const concatProjectName = `${username}&${projectName}`;

      await api().post(`/projects/${concatProjectName}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }, withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setFileStatuses((prevStatuses) => ({
            ...prevStatuses,
            [file.name]: { loading: true, progress: percentage },
          }));
        },
      });

      // After successful upload, show the checkmark
      setFileStatuses((prevStatuses) => ({
        ...prevStatuses,
        [file.name]: { loading: false, completed: true },
      }));
    } catch (error) {
      console.error(error);
      setFileStatuses((prevStatuses) => ({
        ...prevStatuses,
        [file.name]: { loading: false, error: true },
      }));
    }
  };

  const removeFile = (fileName) => {
    setFiles(files.filter(file => file.name !== fileName));
    setFileStatuses((prevStatuses) => {
      const newStatuses = { ...prevStatuses };
      delete newStatuses[fileName];
      return newStatuses;
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.pdf,.doc,.docx,.txt', 
  });

  const renderFiles = () => (
    files.map((file, index) => {
      const { loading, progress, completed } = fileStatuses[file.name] || {};

      return (
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
            width: '600px',
            boxSizing: 'border-box',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.querySelector('.close-button').style.visibility = 'visible'; 
          }}
          onMouseLeave={(e) => {
            e.currentTarget.querySelector('.close-button').style.visibility = 'hidden'; 
          }}
          >
          <span 
            onClick={() => handleNameClick(file.name)} 
            style={{
            width: clickedFile === file.name ? '100%' : '75%', 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            cursor: 'pointer',
            textAlign: 'left',
            }}
            >
            {file.name}
          </span>
          {/* Display progress or checkmark */}
          <div style={{ width: '30%', textAlign: 'center', visibility: clickedFile === file.name ? 'hidden' : 'visible' }}>
          {loading ? (
          <CircularProgress size={16} value={progress} />
            ) : completed ? (
          <div className="upload-status">
              <CheckCircleIcon style={{ color: 'lightgreen' }} />
              <span className="upload-text">uploaded</span>
          </div>
            ) : null}
          </div>

          {clickedFile !== file.name && (
          <>
          <span> {/* Add loading animation or checkmark here */} </span>
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
              visibility: 'visible',  
            }}
            onClick={() => removeFile(file.name)}
          >
            <CloseIcon style={{ color: 'white', fontSize: '12px' }} />
          </IconButton>
          </>
          )}
        </li>
      );
    })
  );

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
      </div>
      <div className="buttonContainer">
        <Link to="/uploadInstructionDocuments">
          <Button variant="contained" color="primary">
            Annotate example documents
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UploadInstructionDocuments;

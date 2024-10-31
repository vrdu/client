import React, { useCallback, useState,useEffect } from 'react';
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


  const [errorMessage, setErrorMessage] = useState("");

  const raiseError = (error) => {
    console.log("error:")
    console.log(error);
    setErrorMessage(error)
    
    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
    
  }

  //useEffect to load all label families when loading the website
useEffect(() => {
  const fetchDocuments = async () => {
    const username = sessionStorage.getItem('username');
    try {
      const projectName = sessionStorage.getItem('projectName');
      const response = await api(false).get(`/projects/${username}/${projectName}/documents`, {
        withCredentials: true,  
      });
       // Set the files
       const files = Array.isArray(response.data) ? response.data : [];
       console.log("files: " + files);
       setFiles(files);
       
       console.log(response.data)
       files.forEach(file => {
        console.log("File name:", file.name);
      });
       // Update fileStatuses for each file to indicate they are completed
       const updatedStatuses = {};
       files.forEach(file => {
         updatedStatuses[file.name] = { loading: false, completed: true };
       });
       setFileStatuses(updatedStatuses);
 
     } catch (error) {
       console.error('Error fetching documents:', error);
     }
  };

  fetchDocuments();
}, []);

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

  const deleteFile = async (fileName) => {
    console.log("fileName: " + fileName);
    
    try {
      const username = sessionStorage.getItem('username');
      const projectName = sessionStorage.getItem('projectName');
      await api(false).delete(`/projects/${username}/${projectName}/delete`, {
        data: fileName,
        withCredentials: true,  
      });

    } catch (error) {
      raiseError(error.response.data.detail);
      
    }

  };

  const removeFile = (fileName) => {
    console.log("deleting file");
    deleteFile(fileName);
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
          className='file'
          key={index} 
          onMouseEnter={(e) => {
            e.currentTarget.querySelector('.close-button').style.visibility = 'visible'; 
          }}
          onMouseLeave={(e) => {
            e.currentTarget.querySelector('.close-button').style.visibility = 'hidden'; 
          }}
          >
          <span 
            className="file-name"
            onClick={() => handleNameClick(file.name)} 
            style={{
              width: clickedFile === file.name ? '100%' : '75%'
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

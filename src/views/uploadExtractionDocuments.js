import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/uploadInstructionDocuments.css'; 
import '../styling/uploadExtractionDocuments.css';
import  Popup from '../views/popupExtractionReport';
import { Button, IconButton, CircularProgress, LinearProgress } from '@mui/material';
import CheckButton from '../components/checkButton';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';  
import { api } from '../helpers/api';
import  File  from '../models/file';

const UploadExtractionDocuments = () => {
  const projectName = sessionStorage.getItem('projectName');
  const documentName = sessionStorage.getItem('documentName');
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [fileStatuses, setFileStatuses] = useState({});  // Track upload status for each file
  const [isPopupOpen, setPopupOpen] = useState(false);
  
  const fileCounter = useRef(0);
  
  const [errorMessage, setErrorMessage] = useState("");

  const raiseError = (error) => {
    console.log("error:")
    console.log(error);
    setErrorMessage(error)
    
    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
    
  }
  const openPopup = () => setPopupOpen(true);
  const closePopup = () => setPopupOpen(false);
  
    //useEffect to load all documents when loading the website
    useEffect(() => {
    const fetchDocuments = async () => {
        
        try {
        const username = sessionStorage.getItem('username');
        const projectName = sessionStorage.getItem('projectName');
        const response = await api(false).get(`/projects/${username}/${projectName}/documentsAndExtractions`, {
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
    sessionStorage.setItem('documentName', fileName);
    navigate(`/projects/${projectName}/annotate`);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.filter(
      file => !files.some(f => f.fileName === file.name)
    );

    const fileInstances = newFiles.map(fileData => {
      console.log("fileData: ", fileData);
      fileCounter.current += 1; 
      return new File({
        id: fileCounter.current, 
        file: fileData,
        extract: false,
        status: { loading: true, completed: false, progress: 0 }, 
      });
    });

    setFiles((prevFiles) => [...prevFiles, ...fileInstances]);

    fileInstances.forEach(fileInstance => {
      uploadFile(fileInstance);
    });
  }, [files]);

  const uploadFile = async (file) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) =>
        f.fileName === file.fileName
          ? { ...f, status: { ...f.status, loading: false, completed: true, progress: 100 } }
          : f
      )
    );

    try {
      const formData = new FormData();
      formData.append('files', file.file);  

      const username = sessionStorage.getItem('username'); 
      const projectName = sessionStorage.getItem('projectName');
      
      console.log("formData: ", formData);
      await api().post(`/projects/${username}/${projectName}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }, withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);

        setFiles((prevFiles) =>
                  prevFiles.map((f) =>
                    f.fileName === file.fileName
                      ? { ...f, status: { ...f.status, loading: true, progress: percentage, completed: false } }
                      : f
                  )
                );
          },
      });

      // successful
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.fileName === file.fileName
            ? { ...f, status: { ...f.status, loading: false, completed: true, progress: 100 } }
            : f
        )
      );
    } catch (error) {
      console.error(error);
      
      // Error
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.fileName === file.fileName
            ? { ...f, status: { ...f.status, loading: false, error: true } }
            : f
        )
      );
    }
  };

  const handleClickCheckButton = (fileName) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) => {
        if (file.file.name === fileName) {
          console.log("Toggling extract for file: ", file);
          file.toggleExtract(); // Call the method directly on the instance
          return file; // Return the modified instance
        }
        return file;
      })
    );
  };
  
  

  useEffect(() => {
    console.log("Updated files: ", files);
  }, [files]);
  

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
}

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.pdf,.doc,.docx,.txt', 
  });

  const renderFiles = () => (
    files.map((file, index) => {
      const { loading, progress, completed } = fileStatuses[file.file.name] || {};

      return (
        <li 
          className='file'
          key={index}
          onMouseEnter={(e) => {
            const closeButton = e.currentTarget.querySelector('.close-button');
            if (closeButton) {
              closeButton.style.visibility = 'visible';
            }
          }}
          onMouseLeave={(e) => {
            const closeButton = e.currentTarget.querySelector('.close-button');
            if (closeButton) {
              closeButton.style.visibility = 'hidden';
            }
          }}
          >
          <CheckButton onClick={() => handleClickCheckButton(file.file.name)} />
            
          <span 
            className="file-name"
            onClick={() => handleNameClick(file.file.name)} 
            style={{
              width: documentName === file.file.name ? '100%' : '75%'
            }}
            >
            {file.file.name}
          </span>
          {/* Display progress or checkmark */}
          <div style={{ width: '30%', textAlign: 'center', visibility: documentName === file.file.name ? 'hidden' : 'visible' }}>
            {loading ? (
            <CircularProgress size={16} value={progress} />
              ) : completed ? (
            <div className="upload-status">
                <CheckCircleIcon style={{ color: 'lightgreen' }} />
                <span className="upload-text">uploaded</span>
            </div>
              ) : null}
          </div>

          {documentName !== file.file.name && (
          <>
          <span> {/* Add loading animation or checkmark here */} </span>
          <IconButton
            aria-label="delete"
            size="small"
            className="close-button"  
            onClick={() => removeFile(file.file.name)}
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
    <div className="site-container">
      <div className="blob">
        <h1 className="heading">Upload documents to extract</h1>
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

            <Button variant="contained" color="primary" disabled={files.length === 0}>
              Start extraction
            </Button>
          
        </div>
          
      </div>
          <div className="overview-extractions">
            <h1 className="heading">overview extractions</h1>
            <Button variant="contained" color="primary" onClick= {openPopup} >
              One PopUp One Extraction
            </Button>
          </div>
          <Popup isOpen={isPopupOpen} onClose={closePopup}>
           
          </Popup>
    </div>

  );
};

export default UploadExtractionDocuments;

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
import  CustomFile  from '../models/file';
import Extraction from '../models/extraction';
import CheckIcon from '@mui/icons-material/Check';


const UploadExtractionDocuments = () => {
  const projectName = sessionStorage.getItem('projectName');
  const documentName = sessionStorage.getItem('documentName');
  const navigate = useNavigate();
  const [fileStatuses, setFileStatuses] = useState({});  
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileCounter = useRef(0);
  const [files, setFiles] = useState([]);
  const [extractions, setExtractions] = useState([]);
  const [activeExtraction, setActiveExtraction] = useState(null); 
  

  const raiseError = (error) => {
    console.log("error:")
    console.log(error);
    setErrorMessage(error)
    
    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
    
  }
  const openPopup = (extraction) => {
    setActiveExtraction(extraction);
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setActiveExtraction(null);
  };
  
  

  
    //useEffect to load all documents when loading the website
    useEffect(() => {
    const fetchDocuments = async () => {
        //noProblemWithCredentials
        try {
        const username = sessionStorage.getItem('username');
        const projectName = sessionStorage.getItem('projectName');
        const response = await api(false).get(`/projects/${username}/${projectName}/documentsAndExtractions`,{
          withCredentials: true,  
        });
        // Set the files
        const files = Array.isArray(response.data) ? response.data : [];
        console.log("files: " + files);
        setExtractions(files);
        
        console.log(response.data.extractions);
        const extractionData = Array.isArray(response.data.extractions) ? response.data.extractions : [];
        console.log("extractionData: " + extractionData.extractionName);
        // Set the state for extractions
        setExtractions(extractionData);
        
        
    
        } catch (error) {
        console.error('Error fetching documents:', error);
        }
    };

    fetchDocuments();
    }, []);

  const handleNameClick = (fileName) => {
    console.log("fileName: ", fileName);
    sessionStorage.setItem('documentName', fileName);
    navigate(`/projects/${projectName}/annotate`);
  };
  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      // Define the callback for when the file is read
      reader.onload = (event) => {
        resolve(event.target.result); // `result` contains the file content
      };
  
      // Handle errors
      reader.onerror = (error) => {
        reject(error);
      };
  
      // Read the file as text
      reader.readAsText(file);
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
    const newFiles = []
  
    for (const fileData of acceptedFiles) {
      const isTxt = fileData.name.endsWith('.txt');
      const baseName = fileData.name.replace(/\.txt$/, '');
      const matchingPdf = files.find(f => f.name === `${baseName}.pdf`);

      if (isTxt) {
        if (matchingPdf) {
          console.log(`Found matching .pdf for ${fileData.name}. Updating extraction results...`);
          const content = await readFileContent(fileData);
          console.log(`Content of ${fileData.name}:`, content);
          // Update the existing `.pdf` file instance with `extractionResults`
          const updatedFile = new CustomFile({ ...matchingPdf, extractionResults: content });

          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.name === matchingPdf.name ? updatedFile : f
            )
          );

          console.log("updatedFile: ", updatedFile);

          // Make call to uploadFile here for the updated instance
          if (updatedFile) {
            console.log(`Uploading updated file: ${updatedFile.originalFile.extractionResults}`);
            await uploadFile(updatedFile);
          }
        } else {
          console.warn(`No matching .pdf found for ${fileData.name}. Skipping.`);
        }
      } else {
        // Handle `.pdf` and other file types normally
        newFiles.push(fileData);
      }
    };

    const fileInstances = newFiles.map(fileData => {
      fileCounter.current += 1; 
      return new CustomFile(fileData, { // Pass the native File object as the first argument
        id: fileCounter.current,
        extract: false,
        extractionResults: null,
        status: { loading: true, completed: false, progress: 0 },
      });
    });
    // Add the new `CustomFile` instances to the state
    setFiles((prevFiles) => [...prevFiles, ...fileInstances]);
    fileInstances.forEach((file) => uploadFile(file));
    }, [files]
  );
  

  const uploadFile = async (file) => {
    setFileStatuses((prevStatuses) => ({
      ...prevStatuses,
      [file.name]: { loading: true, completed: false, progress: 0 },
      
    }));

    try {

      const formData = new FormData();
      const validFile = new File([file.originalFile], file.originalFile.name, { type: file.originalFile.type });
      formData.append('files', validFile);  
      console.log(validFile instanceof File)
      // Add extractionResults as a JSON string
      const extractionResults = file.originalFile.extractionResults;

      formData.append('extractionResults', JSON.stringify(extractionResults));


      const username = sessionStorage.getItem('username'); 
      const projectName = sessionStorage.getItem('projectName');
      
      console.log("formData: ", formData);
      await api().post(`/projects/${username}/${projectName}/uploadExtraction`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);

          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.name === file.name 
                ? new CustomFile({ ...f, status: { ...f.status, loading: true, progress: percentage, completed: false } }) 
                : f instanceof CustomFile ? f : new CustomFile(f) 
            )
          );
          
          },
      });

      // successful
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.name === file.name
            ? new CustomFile({ ...f, status: { ...f.status, loading: false, completed: true, progress: 100 } })
            : f instanceof CustomFile ? f : new CustomFile(f) // Ensure File instances
        )
      );
    } catch (error) {
      console.error(error);
      
      // Error
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.name === file.name
            ? new CustomFile({ ...f, status: { ...f.status, loading: false, error: true } })
            : f instanceof CustomFile ? f : new CustomFile(f) // Ensure File instances
        )
      );
    }
  };

  const handleClickCheckButton = (fileName) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) => {
        if (file.name === fileName) {
          console.log("Toggling extract for file: ", file);
          file.toggleExtract(); 
          return file; 
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
      await api(false).delete(`/projects/${username}/${projectName}/delete`, 
        fileName,{
        withCredentials: true,  
      });
      setFiles((prevFiles) => 
        prevFiles
          .filter((file) => file.name !== fileName) 
          .map((file) => (file instanceof CustomFile ? file : new CustomFile(file))) 
      );
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
  accept: {
    'application/pdf': ['.pdf'],
    'text/plain': ['.txt'],
  },
});


  const renderFiles = () => (
    files.map((file, index) => {
      const { loading, progress, completed } = fileStatuses[file.name] || {};

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
          <CheckButton
            checked={file.extract}
            onClick={() => {
              setFiles((prevFiles) =>
                prevFiles.map((f) =>
                  f.name === file.name ? { ...f, extract: !f.extract } : f
                )
              );
            }}
          />


          <span 
            className="file-name"
            onClick={() => handleNameClick(file.name)} 
            style={{
              width: documentName === file.name ? '100%' : '75%'
            }}
            >
            {file.name}
          </span>
          {/* Display progress or checkmark */}
          <div style={{ width: '30%', textAlign: 'center', visibility: documentName === file.name ? 'hidden' : 'visible' }}>
            {loading ? (
            <CircularProgress size={16} value={progress} />
              ) : completed ? (
            <div className="upload-status">
                <CheckCircleIcon style={{ color: 'lightgreen' }} />
                <span className="upload-text">uploaded</span>
            </div>
              ) : null}
          </div>
          <div className="extraction-indicator-container">
            {file.originalFile.extractionResults && (
              <>
                <div className="extraction-indicator">
                  <CheckIcon className="check-icon-white" />
                </div>
                <div className="extraction-indicator-tooltip">
                  <span>results</span>
                </div>
              </>
            )}
          </div>
                  
          {documentName !== file.name && (
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

  
  const sendExtractionRequest = async () => {
    console.log("in send extraction request");
    const newExtraction = new Extraction({
      name: `Extraction-${Date.now()}`,
      documentNames: [],
    });

    const remainingFiles = [];
    files.forEach((file) => {
      if (file.extract) {
        newExtraction.documentNames.push(file.name); 
      } else {
        remainingFiles.push(file); 
      }
    });

    setFiles(remainingFiles);

    setExtractions([...extractions, newExtraction]);
    console.log("Extractions: ", extractions);
    try {
      const username = sessionStorage.getItem('username'); 
      const projectName = sessionStorage.getItem('projectName');
      
      await api(false).post(`/projects/${username}/${projectName}/extractions`, 
        newExtraction,{
        withCredentials: true,
      });
      console.log('Extraction sent successfully:', newExtraction);
    } catch (error) {
      console.error('Error sending extraction to backend:', error);
    }


  }


  const handleExtraction = () =>{
    for (let i = 0; i < files.length; i++) {
      if (files[i].extract) {
        sendExtractionRequest();
        return;
      }
      throw new Error("No files selected for extraction");
    }
  };
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

            <Button variant="contained" color="primary" disabled={files.length === 0} onClick={()=> handleExtraction()}>
              Start extraction
            </Button>
          
        </div>
          
      </div>
      <div className="overview-extractions">
        <h1 className="heading">overview extractions</h1>
        <div className="extraction-container">
          <ul>
            {extractions.map((extraction, index) => (
              <li key={index}>
                <span
                  onClick={() => openPopup(extraction)} // Pass the extraction object
                  className="clickable-index"
                >
                  {extraction.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <Popup
        isOpen={isPopupOpen}
        onClose={closePopup}
        extraction={activeExtraction} // Pass the active extraction to Popup
        />
      </div>
    </div>
  );
};

export default UploadExtractionDocuments;

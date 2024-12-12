import type { IHighlight } from "react-pdf-highlighter";
import React, { useState, useEffect  } from 'react';
import { api } from '../../helpers/api';  
import { useNavigate } from "react-router-dom"; 

interface Props {
  highlights: Array<IHighlight>;
}
type DataType = Record<string, string>;

export function Sidebar({
  highlights,
  
}: Props) {

  const navigate = useNavigate();
  const [data, setData] = useState<DataType>({});

  const safeCorrection = async () => {
    try {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
  
      const username = sessionStorage.getItem('username'); 
      const projectName = sessionStorage.getItem('projectName');
      const documentName = sessionStorage.getItem('docCorrect');
  
        await api(false).post(`/projects/${username}/${projectName}/${documentName}/setCorrection`, 
          {formData},
          {
           withCredentials: true,
          });
        console.log("Annotations saved successfully and set as Instruction");
        navigate(`/projects/${projectName}/uploadExtractionDocuments`);    
      } catch (error) {
        console.error("Error saving annotations", error);
      }
    }

    const getCorrections = async () => {
      try {
    
        const username = sessionStorage.getItem('username'); 
        const projectName = sessionStorage.getItem('projectName');
        const documentName = sessionStorage.getItem('docCorrect');
    
        const response = await api(false).get(`/projects/${username}/${projectName}/${documentName}/getCorrection`, 
            {
             withCredentials: true,
            });
          console.log("Annotations saved successfully and set as Instruction");
          setData(response.data);    
        } catch (error) {
          console.error("Error saving annotations", error);
        }
      }
      useEffect(() => {
        getCorrections();
      }, []); 

     const handleChange = (key: string, value: string) => {
    // Update the state when a value is edited
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };
  
  return (
    <div className="sidebar" style={{ width: "25vw" }}>
      <div className="description" style={{ padding: "1rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>
          Extractions        
        </h2>
        <p>
          Please correct the extractions below.
        </p>
      </div>

      {Object.entries(data).map(([key, value]) => (
        <div key={key} style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: '10px' }}>{key}:</label>
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
      ))}
      
      <div style={{ padding: "1rem" }}>
        <button type="button" onClick={safeCorrection}>
          Save Corrections
        </button>
      </div>
       
    </div>
  );
}
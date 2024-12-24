import type { IHighlight } from "react-pdf-highlighter";
import React, { useState, useEffect  } from 'react';
import { api } from '../../helpers/api';  
import { useNavigate } from "react-router-dom"; 

interface Props {
  highlights: Array<IHighlight>;
}

export function Sidebar({
  highlights,
  
}: Props) {

  const navigate = useNavigate();
  const [data, setData] = useState<Record<string, string>>({});

  const safeCorrection = async () => {
    try {
      const formData = new FormData();
      
      const wrappedData = {
        extractionSolution: { ...data }, 
      };
      
      formData.append('extractionSolution', JSON.stringify(wrappedData.extractionSolution));


      
      const username = sessionStorage.getItem('username'); 
      const projectName = sessionStorage.getItem('projectName');
      const documentName = sessionStorage.getItem('docCorrect');
  
        await api(false).post(`/projects/${username}/${projectName}/${documentName}/setCorrection`, 
          formData,
          {
           withCredentials: true,
           headers: {
            'Content-Type': 'application/json',
           },
          });
        console.log("Annotations saved successfully and set as Instruction");
        console.log(formData)
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
          const parsedData = JSON.parse(response.data.extractionResult);
          const sanitizedData = Object.fromEntries(
            Object.entries(parsedData).map(([key, value]) => [
              key.replace(/[*"]/g, '').trim(),
              typeof value === 'string' ? value.replace(/[*",]/g, '').trim() : value,
            ])
          ) as Record<string, string>;
          

          setData(sanitizedData); 
          console.log("responseDAta"+response.data.extractionResult); 
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
          Safe Corrections
        </button>
      </div>
       
    </div>
  );
}
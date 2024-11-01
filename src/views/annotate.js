import React, { useCallback, useState,useEffect } from 'react';
import '../styling/home.css'; 
import '../styling/annotate.css'; 
import { Button, IconButton, CircularProgress, LinearProgress } from '@mui/material';

import { api } from '../helpers/api';


const Annotate = () => {
      const [document, setDocument] = useState([]);

        //useEffect to load all label families when loading the website
useEffect(() => {
      const fetchDocuments = async () => {
        
        try {
            const username = sessionStorage.getItem('username');
            const projectName = sessionStorage.getItem('projectName');
            const documentName = sessionStorage.getItem('documentName');
            const response = await api(false).get(`/projects/${username}/${projectName}/${documentName}/annotate`, {
                  withCredentials: true,  
            });
                        
            setDocument(response.data);
            console.log(response.data)
      
            } catch (error) {
                  console.error('Error fetching documents:', error);
            }
      };
    
      fetchDocuments();
    }, []);

      return (
            <div>
                  document:{document.ocrData}
            </div>
      );
};

export default Annotate;

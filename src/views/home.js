import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { api } from '../helpers/api';  
import '../styling/home.css';  

const Home = () => {
  const [projects, setProjects] = useState([]);

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      const username = sessionStorage.getItem('username');
      try {
        const response = await api().get(`/projects/${username}`,{
          withCredentials: true});         
        setProjects(response.data);  // Assuming the API returns a list of projects
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
      <div className="blob">
        <h1 className="heading">Projects</h1>
        <div className="projects-list">
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <div key={index} className="project">
              <p>Name: {project.projectName} F1: {project.f1} Anls: {project.anls} Informations</p>
            </div>
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </div>
        <div className="buttonContainer">
          
          <Link to="/project">
          <Button
            variant="contained"
            color="primary" 
          >
            Add Project
          </Button>
          </Link>
        </div>
      </div>
  );
};

export default Home;

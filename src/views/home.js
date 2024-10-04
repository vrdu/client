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
        const response = await api().get(`/projects/${username}`, {
          withCredentials: true
        });
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
              <Link to={`/projects/${project.projectName}/configureLabels`} key={index} style={{ textDecoration: 'none' }}
              onClick={() => {sessionStorage.setItem('projectName', project.projectName); console.log("sessionStorage updated")}}
              >
                <div className="project clickable">
                  <span className="project-name">{project.projectName}</span>
                  <div className="project-metrics">
                    <span>F1: {project.f1}</span>
                    <span>Anls: {project.anls}</span>
                    <span>Informations</span>
                  </div>
                </div>
              </Link>
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

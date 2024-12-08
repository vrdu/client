import type { IHighlight } from "react-pdf-highlighter";
import React, { useState } from 'react';
import { api } from '../../helpers/api';  
import { useNavigate } from "react-router-dom"; 

interface Props {
  highlights: Array<IHighlight>;
}

const updateHash = (highlight: IHighlight) => {
  console.log("Updating hash", highlight.id);
  document.location.hash = `highlight-${highlight.id}`;
};


export function Sidebar({
  highlights,
  
}: Props) {

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const safeAnnotations = async () => {
    try {
      const formData = new FormData();
  
      const username = sessionStorage.getItem('username'); 
      const projectName = sessionStorage.getItem('projectName');
      const documentName = sessionStorage.getItem('documentName');
  
        await api(false).post(`/projects/${username}/${projectName}/${documentName}/setAnnotate`, 
          {},
          {
           withCredentials: true,
          });
        console.log("Annotations saved successfully and set as Instruction");
        navigate(`/projects/${projectName}/uploadInstructionDocuments`);    
      } catch (error) {
        console.error("Error saving annotations", error);
      }
    }
  
  return (
    <div className="sidebar" style={{ width: "25vw" }}>
      <div className="description" style={{ padding: "1rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>
          Annotations        
        </h2>
      </div>

      <ul
        className="sidebar__highlights"
        style={{
          height: "80vh",
          overflowY: "auto",
          overflowX: "hidden",
          padding: "0 1rem",
        }}
      >
        {highlights.map((highlight, index) => (
          <li
            key={index}
            className="sidebar__highlight"
            onClick={() => updateHash(highlight)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              borderBottom: index < highlights.length - 1 ? "1px solid black" : "none",
              paddingBottom: "1rem",
              marginBottom: "1rem",
              backgroundColor: hoveredIndex === index ? "#f0f0f0" : "transparent", 
              transition: "background-color 0.3s ease", 
              cursor: "pointer",
            }}
          >
            <div>
              <strong>{highlight.comment.text}</strong>
              {highlight.content.text && (
                <blockquote style={{ marginTop: "0.5rem" }}>
                  {`${highlight.content.text.slice(0, 90).trim()}…`}
                </blockquote>
              )}
              {highlight.content.image && (
                <div className="highlight__image" style={{ marginTop: "0.5rem" }}>
                  <img src={highlight.content.image} alt="Screenshot" />
                </div>
              )}
            </div>
            <div className="highlight__location">
              Page {highlight.position.pageNumber}
            </div>
          </li>
        ))}
      </ul>


      
      
      <div style={{ padding: "1rem" }}>
        <button type="button" onClick={safeAnnotations}>
          Save Annotations
        </button>
      </div>
       
    </div>
  );
}
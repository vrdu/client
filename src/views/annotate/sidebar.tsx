import type { IHighlight } from "react-pdf-highlighter";
import React, { useState } from 'react';

interface Props {
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
}

const updateHash = (highlight: IHighlight) => {
  console.log("Updating hash", highlight.id);
  document.location.hash = `highlight-${highlight.id}`;
};


export function Sidebar({
  highlights,
  resetHighlights,
}: Props) {

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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


      
      {highlights.length > 0 ? (
        <div style={{ padding: "1rem" }}>
          <button type="button" onClick={resetHighlights}>
            Reset highlights
          </button>
        </div>
      ) : null}
    </div>
  );
}
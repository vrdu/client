import React, { useState, useEffect, useCallback, useRef } from "react";

import {
  AreaHighlight,
  Highlight,
  PdfHighlighter,
  PdfLoader,
  Popup,
  
} from "react-pdf-highlighter";
import type {
  Content,
  IHighlight,
  NewHighlight,
  ScaledPosition,
} from "react-pdf-highlighter";

import { Sidebar } from "./sidebar";
import { Spinner } from "./spinner";
import { api } from '../../helpers/api';  


import "react-pdf-highlighter/dist/style.css";
import {Annotation} from "../../models/annotation"; 
import PopUpAnnotations from "./popUpAnnotations";

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({
  comment,
}: {
  comment: { text: string; emoji: string };
}) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

const base64ToArrayBuffer = (base64: string) => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

function Annotate() {

  type HighlightWithAnnotation = IHighlight & {
    annotation: Annotation;
  };
  
  const [url, setUrl] = useState(String);
  const [highlights, setHighlights] = useState<Array<HighlightWithAnnotation>>(
   []
  );
  const [annotation, setAnnotation] = useState<Annotation>(new Annotation());

  //load data when the site is refreshed/loaded
  useEffect(() => {
      const fetchDocuments = async () => {
          try {
              const username = sessionStorage.getItem('username');
              const projectName = sessionStorage.getItem('projectName');
              const documentName = sessionStorage.getItem('documentName');

              const response = await api(false).get(
                  `/projects/${username}/${projectName}/${documentName}/annotate`,
                  { withCredentials: true }
              );
              

              if (response.data) {
                console.log("response: ",response.data);

                const arrayBuffer = base64ToArrayBuffer(response.data.base64PdfData);
                const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob); // create object URL
                setUrl(url);
                
                const annotations = Array.isArray(response.data.highlights)
                ? response.data.highlights.map((annotation: HighlightWithAnnotation) => ({
                    ...annotation,
                    annotation: annotation.annotation || {},
                    comment: annotation.comment || { text: "", emoji: "" },
                    content: annotation.content || { text: "" },
                    position: annotation.position || { boundingRect: {}, rects: [], pageNumber: 1 },
                    id: annotation.id || getNextId(),
                }))
                : [];
                setHighlights(annotations);
                console.log("annotations", annotations);
                  
              }
          } catch (error) {
              console.error('Error fetching documents:', error);
          }
      };
      
      fetchDocuments();

      //cleanup
      return () => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      };
  }, []);




// Effect to send annoations to the backend whenever they are updated
useEffect(() => {
  const sendAnnotationsToBackend = async () => {
    try {
      const username = sessionStorage.getItem('username');
      const projectName = sessionStorage.getItem('projectName');
      const documentName = sessionStorage.getItem('documentName');
      console.log("sending annotations to backend", highlights);
      await api(false).post(
        `/projects/${username}/${projectName}/${documentName}/annotations`,
        { highlights },
        { withCredentials: true }
      );

      console.log('Annotations successfully sent to backend');
    } catch (error) {
      console.error('Error sending annotations to backend:', error);
    }
  };

  if (highlights.length > 0) { 
    sendAnnotationsToBackend();
  }
}, [highlights]); 

  const scrollViewerTo = useRef((highlight: IHighlight) => {
    console.log("scrolling to", highlight);
    // Implement scrolling logic here
  });

  const scrollToHighlightFromHash = useCallback(() => {
    const highlight = getHighlightById(parseIdFromHash());
    if (highlight) {
      scrollViewerTo.current(highlight);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", scrollToHighlightFromHash, false);
    return () => {
      window.removeEventListener(
        "hashchange",
        scrollToHighlightFromHash,
        false,
      );
    };
  }, [scrollToHighlightFromHash]);

  const getHighlightById = (id: string) => {
    return highlights.find((highlight) => highlight.id === id);
  };

  const addHighlight = (highlight: NewHighlight, annotation: Annotation) => {
    console.log("Here annoation", annotation.text);
    if (annotation.labelName && annotation.familyName) {
      annotation.text = highlight.content.text;
      const combinedHighlight = {
        ...highlight,
        annotation: { ...annotation},
        id: getNextId(), 
      };
      console.log("Saving combinedHighlight", combinedHighlight);
      setHighlights((prevHighlights) => [
        combinedHighlight,
        ...prevHighlights,
      ]);
    }
    
  };

  const updateHighlight = (
    highlightId: string,
    position: Partial<ScaledPosition>,
    content: Partial<Content>,
  ) => {
    console.log("Updating highlight", highlightId, position, content);
    setHighlights((prevHighlights) =>
      prevHighlights.map((h) => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
              id,
              position: { ...originalPosition, ...position },
              content: { ...originalContent, ...content },
              ...rest,
            }
          : h;
      }),
    );
  };

  return (
    <div className="App" style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        highlights={highlights}

      />
     <div style={{ height: "100vh", width: "70vw", position: "relative" }}>
  {url ? (
    <PdfLoader url={url} beforeLoad={<Spinner />}>
      {pdfDocument => ( // single child function for PdfLoader
        <PdfHighlighter
          pdfDocument={pdfDocument}
          enableAreaSelection={(event) => event.altKey}
          onScrollChange={resetHash}
          scrollRef={(scrollTo) => {
            //scrollViewerTo.current = scrollTo;
            scrollToHighlightFromHash();
          }}
          onSelectionFinished={(
            position,
            content,
            hideTipAndSelection,
            transformSelection,
          ) => (
            <PopUpAnnotations
              onOpen={transformSelection}
              onConfirm={(selectedAnnotation) => {
                selectedAnnotation.text = content.text;
                addHighlight(
                  { content, position, comment: { text: "", emoji: "" } },
                  selectedAnnotation
                );
                hideTipAndSelection();
              }}
              setAnnotation={setAnnotation}
            />
          )}
          highlightTransform={(
            highlight,
            index,
            setTip,
            hideTip,
            viewportToScaled,
            screenshot,
            isScrolledTo,
          ) => {
            const isTextHighlight = !highlight.content?.image;

            const component = isTextHighlight ? (
              <Highlight
                isScrolledTo={isScrolledTo}
                position={highlight.position}
                comment={highlight.comment}
              />
            ) : (
              <AreaHighlight
                isScrolledTo={isScrolledTo}
                highlight={highlight}
                onChange={(boundingRect) => {
                  updateHighlight(
                    highlight.id,
                    { boundingRect: viewportToScaled(boundingRect) },
                    { image: screenshot(boundingRect) },
                  );
                }}
              />
            );

            return (
              <Popup
                popupContent={<HighlightPopup {...highlight} />}
                onMouseOver={(popupContent) =>
                  setTip(highlight, (highlight) => popupContent)
                }
                onMouseOut={hideTip}
                key={index}
              >
                {component}
              </Popup>
            );
          }}
          highlights={highlights}
        />
      )}
    </PdfLoader>
  ) : (
    <Spinner />
  )}
</div>

    </div>
  );
}
export default Annotate;

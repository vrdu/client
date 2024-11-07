import React, { useEffect, useState } from 'react';
import '../styling/home.css'; 
import '../styling/annotate.css'; 
import { pdfjs } from 'react-pdf';
import 'pdfjs-dist/build/pdf.worker.mjs'; 
import { api } from '../helpers/api';
import Document from '../models/document';
import Annotation from '../models/annotation';
import { South } from '@mui/icons-material';

const Annotate = () => {
    const [documentDisplay, setDocument] = useState(null);
    const [annotations, setAnnotations] = useState([]);

    // useEffect to load the document data when the component mounts
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
                

                // Render the PDF and display the bounding boxes
                if (response.data) {
                    const annotationInstances = Array.isArray(response.data.annotation)
                        ? response.data.annotation.map(item => new Annotation(item))
                        : [];
                    setAnnotations(annotationInstances);

                    // Initialize DocumentModel without waiting for setAnnotations
                    const documentInstance = new Document({
                        base64PdfData: response.data.base64PdfData,
                        boxes: response.data.boxes,
                        annotations: annotationInstances, 
                        name: response.data.name
                    }
                        
                    );
                    setDocument(documentInstance);

                    console.log('Document:', documentInstance);
                    console.log('Annotations:', annotationInstances);
                    console.log('Raw Response:', response.data);

                    //renderPDF(documentInstance.base64PdfData);
                    renderPDFWithHighlighting(documentInstance, documentInstance.base64PdfData, 1.5);

                    //displayBoundingBoxes(documentInstance.boxes);
                }
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };
        
        fetchDocuments();
    }, []);

    // Configure pdf.js
    pdfjs.GlobalWorkerOptions.workerSrc = `pdfjs-dist/build/pdf.worker.mjs`;

    // Function to render the PDF with responsive scaling
    async function renderPDF(base64PdfData, scale = 1) {
        try {
            const loadingTask = pdfjs.getDocument({ data: atob(base64PdfData) });
            const pdf = await loadingTask.promise;
    
            const pdfContainer = document.getElementById('pdfContainer');
            pdfContainer.innerHTML = ''; // Clear previous content
    
            // Loop through each page and render it
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale });
    
                // Create a new canvas for each page
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
    
                canvas.style.width = '100%'; // Responsive scaling for canvas width
                canvas.style.height = 'auto'; // Maintain aspect ratio
    
                canvas.width = viewport.width * scale;
                canvas.height = viewport.height * scale;
                pdfContainer.appendChild(canvas);
    
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
    
                // Render the page on the canvas
                await page.render(renderContext).promise;
            }
        } catch (error) {
            console.error('Error rendering PDF:', error);
        }
    }
    async function renderPDFWithHighlighting(documentObject, base64PdfData, scale = 1) {
        const loadingTask = pdfjs.getDocument({ data: atob(base64PdfData) });
        const pdf = await loadingTask.promise;
    
        const pdfContainer = document.getElementById('pdfContainer');
        pdfContainer.innerHTML = ''; // Clear previous content
    
        // Loop through each page
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale });
    
            // Create a new canvas for each page
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            pdfContainer.appendChild(canvas);
    
            const context = canvas.getContext('2d');
            
            // Render the page on the canvas
            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;
    
            // Add mouse event listener for text selection and highlighting
            addTextSelectionListeners(canvas, page, viewport, context, documentObject, pageNum, scale);
        }
    }

    function addTextSelectionListeners(canvas, page, viewport, context, documentObject, pageNum, scale) {
        let isSelecting = false;
        let startX, startY, endX, endY;
    
        canvas.addEventListener('mousedown', (e) => {
            console.log('mousedown');
            isSelecting = true;
            const [x, y] = viewport.convertToPdfPoint(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
            startX = x;
            startY = y;
        });
    
        canvas.addEventListener('mousemove', (e) => {
            console.log('mousemove');
            if (!isSelecting) return;
            const [x, y] = viewport.convertToPdfPoint(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
            endX = x;
            endY = y;
        });
    
        canvas.addEventListener('mouseup', async (e) => {
            console.log('mouseup');
            if (!isSelecting) return;
            isSelecting = false;
    
            // Retrieve selected text and coordinates
            const { selectedText, x, y, width, height } = await getSelectedTextAndCoordinates(page, viewport, startX, startY, endX, endY, scale, documentObject);
    
            if (selectedText) {
                // Draw the highlight box
                context.beginPath();
                context.rect(x * scale, y * scale, width * scale, height * scale);
                context.fillStyle = 'rgba(255, 255, 0, 0.5)'; // Semi-transparent yellow
                context.fill();
                context.closePath();
    
                // Create an annotation and save it
                const annotation = new Annotation({
                    text: selectedText,
                    page: pageNum,
                    x: x * scale,
                    y: y * scale,
                    width: width * scale,
                    height: height * scale
                });
                documentObject.annotations.push(annotation);
    
                console.log("Annotation created:", annotation);
            }
        });
    }
    async function getSelectedTextAndCoordinates(page, viewport, startX, startY, endX, endY, scale, documentObject) {
        const boxes = documentObject.boxes;
        console.log("boxes: ",boxes)
        let selectedText = '';
        let bounds = { x: startX, y: startY, width: endX - startX, height: endY - startY };
        console.log("bounds: ",bounds)
        // Iterate over text items to find matching selection
        boxes.forEach((box) => {
            const wordXStart = box.x;
            const wordYStart = box.y;
            const wordXEnd = wordXStart + box.width;
            const wordYEnd = wordYStart + box.height;
            
            // Check if the box is within the selection bounds
            if (wordXStart >= startX && wordXEnd <= endX && wordYStart >= startY && wordYEnd <= endY) {
                console.log('Selected Box:', box);
                selectedText += box.word + ' '; // Append selected text
                //make them fit afterwards
                bounds = { x: wordXStart, y: wordYStart, width: box.width, height: box.height };
            }
        });
        
        console.log('Selected Text:', selectedText.trim());
        // Return selected text and bounding box
        return {
            selectedText: selectedText.trim(),
            x: bounds.x,
            y: bounds.y,
            width: bounds.width,
            height: bounds.height
        };
    }
    

    return (
        <div style={{ position: 'relative', height: '100vh', overflowY: 'auto' }}>            
        <div id="pdfContainer" style={{ position: 'relative' }}></div>
        </div>
    );
    
};

export default Annotate;

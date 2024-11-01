import React, { useEffect, useState } from 'react';
import '../styling/home.css'; 
import '../styling/annotate.css'; 
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { api } from '../helpers/api';

const Annotate = () => {
    const [document, setDocument] = useState(null);

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

                setDocument(response.data);
                console.log(response.data);

                // Render the PDF and display the bounding boxes
                if (response.data) {
                    renderPDF(response.data.base64PdfData);
                    displayBoundingBoxes(response.data.boxes);
                }
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        fetchDocuments();
    }, []);

    // Configure pdf.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    // Function to render the PDF
    async function renderPDF(base64PdfData) {
        try {
            const loadingTask = pdfjsLib.getDocument({ data: atob(base64PdfData) });
            const pdf = await loadingTask.promise;

            // Get the first page
            const page = await pdf.getPage(1);
            const canvas = document.getElementById('pdfCanvas');
            const context = canvas.getContext('2d');

            const viewport = page.getViewport({ scale: 1 });
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            // Render the page on the canvas
            await page.render(renderContext).promise;
        } catch (error) {
            console.error('Error rendering PDF:', error);
        }
    }

    // Function to display bounding boxes
    function displayBoundingBoxes(boundingBoxes) {
        const canvas = document.getElementById('pdfCanvas');
        const overlay = document.getElementById('overlay');
        overlay.style.position = 'absolute';
        overlay.style.top = `${canvas.offsetTop}px`;
        overlay.style.left = `${canvas.offsetLeft}px`;
        overlay.style.width = `${canvas.width}px`;
        overlay.style.height = `${canvas.height}px`;

        // Clear any existing bounding boxes
        overlay.innerHTML = '';

        boundingBoxes.forEach(box => {
            const boxElement = document.createElement('div');
            boxElement.style.position = 'absolute';
            boxElement.style.left = `${box.x}px`;
            boxElement.style.top = `${box.y}px`;
            boxElement.style.width = `${box.width}px`;
            boxElement.style.height = `${box.height}px`;
            boxElement.style.border = '1px solid red';  // Highlighting style
            boxElement.style.pointerEvents = 'none';  // Prevent interaction with the boxes

            overlay.appendChild(boxElement);
        });
    }

    return (
        <div style={{ position: 'relative' }}>
            <canvas id="pdfCanvas"></canvas>
            <div id="overlay"></div>
        </div>
    );
};

export default Annotate;

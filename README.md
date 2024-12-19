# Frontend no-code web application for information extraction from PDF documents
## Short description
This is the frontend component of a web application designed to provide a no-code interface for document information extraction. The application guides users through an intuitive process of defining labels, uploading and annotating example documents, and extracting information from target documents. Users can evaluate the effectiveness of the extraction process using the F1-score, ensuring accurate and reliable results.

##Features
- **PDF Support:** Exclusively supports PDF documents for both uploading and processing.
- **Large Document Handling:** Allows uploading of relatively large PDF files (up to 15MB).
- **Annotation Capabilities:** Enables users to upload and annotate example documents. Annotation functionality works best with machine-readable PDF documents.
- **Batch Extraction:** Supports the extraction of information from multiple documents simultaneously.
- **User-Friendly Interface:** Designed for intuitive and straightforward usage.
- **Parallel Extractions:** Facilitates multiple extractions running concurrently.
  


### `npm start` starts the application

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The application should work as is with the backend application.

### Folder structure
src/ <br>
├── components/    # Reusable UI components<br>
├── helpers/       # Helper functions<br>
├── models/        # Models of the data structures used<br>
├── routing/       # Routing of the application<br>
├── styling/       # Makes the application prity<br>
├── views/         # Page components for routing<br>
└── App.tsx        # Main application component<br>


### Dependencies and Tools

#### UI/Styling
- **@emotion/react**: For writing CSS styles with JavaScript. (v11.13.3)
- **@emotion/styled**: Styled-components API for Emotion. (v11.13.0)
- **@mui/material**: Material-UI library for React components. (v6.1.6)
- **@mui/icons-material**: Material Design icons for React components. (v6.1.6)

#### State Management and Drag-and-Drop
- **react-beautiful-dnd**: Library for creating drag-and-drop interfaces. (v13.1.1)
- **react-zoom-pan-pinch**: For zooming, panning, and pinch gestures in React. (v3.6.1)

#### PDF Handling
- **react-pdf**: For rendering PDF documents in the application. (v9.1.1)
- **react-pdf-highlighter**: Highlighter component for annotating PDFs. (v8.0.0-rc.0)
- **pdfjs-dist**: Library for parsing and rendering PDFs. (v4.4.168)

#### File Uploads
- **dropzone**: Library for creating drag-and-drop file uploads. (v6.0.0-beta.2)
- **react-dropzone**: React wrapper for Dropzone.js. (v14.2.3)

#### Routing
- **react-router-dom**: For client-side routing in React applications. (v6.26.2)

#### HTTP Requests
- **axios**: HTTP client for making API calls. (v1.7.7)

#### Testing
- **@testing-library/jest-dom**: Custom matchers for testing DOM nodes. (v5.17.0)
- **@testing-library/react**: Tools for testing React components. (v13.4.0)
- **@testing-library/user-event**: Simulate user interactions in tests. (v13.5.0)

#### Build Tools
- **react-scripts**: Build and configuration scripts for Create React App. (v5.0.1)
- **css-loader**: Resolves `@import` and `url()` in CSS files. (v7.1.2)
- **mini-css-extract-plugin**: Extracts CSS into separate files. (v2.9.2)

#### TypeScript and Type Definitions
- **typescript**: Superset of JavaScript for type safety. (v4.9.5)
- **@types/react**: TypeScript definitions for React. (v18.3.12)
- **@types/react-dom**: TypeScript definitions for React DOM. (v18.3.1)

#### Utilities
- **web-vitals**: Metrics to measure the performance of web applications. (v2.1.4)

#### Application
- **client**: The custom entry for your application itself. (v0.1.0)





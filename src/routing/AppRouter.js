import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterForm from '../views/register';
import LoginForm from '../views/login';
import Home from '../views/home';
import Project from '../views/project';
import ConfigureLabels from '../views/configureLabels';
import UploadInstructionDocuments from '../views/uploadInstructionDocuments';
import Annotate from '../views/annotate';
import ProtectedRoute from './ProtectedRoute';



const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element= {<RegisterForm/>}/>
                <Route path="/" element={<RegisterForm/>} />
                <Route path="/login" element= {<LoginForm/>}/>
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                        <Home/>
                        </ProtectedRoute>
                    }
                    />
                <Route
                    path="/project"
                    element={
                        <ProtectedRoute>
                        <Project/>
                        </ProtectedRoute>
                    }
                    />
                <Route
                    path="/projects/:projectName/configureLabels"
                    element={
                        <ProtectedRoute>
                        <ConfigureLabels/>
                        </ProtectedRoute>
                    }
                    />
                <Route
                    path="/projects/:projectName/uploadInstructionDocuments"
                    element={
                        <ProtectedRoute>
                        <UploadInstructionDocuments/>
                        </ProtectedRoute>
                    }
                    />
                     <Route
                    path="/projects/:projectName/annotate"
                    element={
                        <ProtectedRoute>
                        <Annotate/>
                        </ProtectedRoute>
                    }
                    />
            </Routes>
        </BrowserRouter>
    );
};
export default AppRouter;
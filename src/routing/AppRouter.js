import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterForm from '../views/register';
import LoginForm from '../views/login';
import Home from '../views/home';
import Project from '../views/project';
import ConfigureLabels from '../views/configureLabels';
import UploadInstructionDocuments from '../views/uploadInstructionDocuments';
import ProtectedRoute from './ProtectedRoute';
import DummyView from '../views/dummyView';


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
                    path="/uploadInstructionDocuments"
                    element={
                        <ProtectedRoute>
                        <UploadInstructionDocuments/>
                        </ProtectedRoute>
                    }
                    />
                <Route
                    path="/dummy"
                    element={
                        <ProtectedRoute>
                        <DummyView/>
                        </ProtectedRoute>
                    }
                    />
            </Routes>
        </BrowserRouter>
    );
};
export default AppRouter;
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterForm from '../views/register';
import LoginForm from '../views/login';
import Home from '../views/home';
import ConfigureLabels from '../views/configureLabels';
import UploadInstructionDocuments from '../views/uploadInstructionDocuments';
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
                    path="/projects:projectName"
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
            </Routes>
        </BrowserRouter>
    );
};
export default AppRouter;
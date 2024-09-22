import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import RegisterForm from '../views/register';
import LoginForm from '../views/login';


const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element= {<RegisterForm/>}/>
                <Route path="/" element={<RegisterForm/>} />
                <Route path="/login" element= {<LoginForm/>}/>
            </Routes>
        </BrowserRouter>
    );
};
export default AppRouter;
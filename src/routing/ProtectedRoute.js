import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {api} from '../helpers/api';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Initially, don't know if authenticated
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log("authenticating users")
                // Send request to backend to verify token (e.g., /auth/validate-token)
                const response = await api(false).get('/users/auth', { withCredentials: true });
                if (response.status === 200) {
                    setIsAuthenticated(true);
                    console.log("authenticated")
                } else {
                    setIsAuthenticated(false);
                    console.log("not authenticated")
                }
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        // Optionally show a loading spinner while checking authentication
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        // Redirect to login page if not authenticated
        return <Navigate to="/login" />;
    }

    // Render the children (protected routes) if authenticated
    return children;
};

export default ProtectedRoute;

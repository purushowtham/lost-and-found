// frontend/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

// A component that acts as a wrapper for routes that require authentication
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth(); // Get user and loading state from AuthContext

    // If authentication check is still in progress, show nothing or a loading spinner
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
            </div>
        );
    }

    // If user is authenticated, render the children components (the protected route content)
    // Otherwise, redirect to the authentication page
    return user ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;

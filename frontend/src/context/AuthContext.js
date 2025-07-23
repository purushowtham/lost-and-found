// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axios'; // Import the configured Axios instance

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};

// AuthProvider component to wrap the application and provide auth state
export const AuthProvider = ({ children }) => {
    // State to hold user information (e.g., _id, username, email, token)
    const [user, setUser] = useState(null);
    // State to indicate if authentication check is complete
    const [loading, setLoading] = useState(true);

    // Effect to load user from local storage on initial render
    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false); // Authentication check is complete
    }, []);

    // Function to handle user login
    const login = async (email, password) => {
        try {
            const { data } = await API.post('/auth/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data)); // Store user info in local storage
            setUser(data); // Set user state
            return true; // Indicate successful login
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
            // Return false and throw error for component to handle
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    // Function to handle user registration
    const register = async (username, email, password) => {
        try {
            const { data } = await API.post('/auth/register', { username, email, password });
            localStorage.setItem('userInfo', JSON.stringify(data)); // Store user info
            setUser(data); // Set user state
            return true; // Indicate successful registration
        } catch (error) {
            console.error('Registration failed:', error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    // Function to handle user logout
    const logout = () => {
        localStorage.removeItem('userInfo'); // Remove user info from local storage
        setUser(null); // Clear user state
    };

    // Value provided by the context to its consumers
    const value = {
        user,
        loading,
        login,
        register,
        logout,
    };

    // Render children only after authentication check is complete
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

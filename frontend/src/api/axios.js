// frontend/src/api/axios.js
import axios from 'axios';

// Create an Axios instance with a base URL for the backend API
// IMPORTANT: Adjust this URL if your backend runs on a different address/port
const API = axios.create({
    baseURL: 'http://localhost:5001/api', // Default backend API URL
});

// Request interceptor to add the JWT token to headers for authenticated requests
API.interceptors.request.use((req) => {
    // Check if a token exists in local storage
    if (localStorage.getItem('userInfo')) {
        // Parse the user info to get the token
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        // Add the Authorization header with Bearer token
        req.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return req; // Return the modified request config
});

export default API; // Export the configured Axios instance

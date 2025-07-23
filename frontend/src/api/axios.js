// frontend/src/api/axios.js
import axios from 'axios';

// Use an environment variable for the backend API URL
// In development, this will be 'http://localhost:5000/api'
// In production, you will set REACT_APP_API_URL on your hosting platform (e.g., Netlify/Vercel)
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
});

// Request interceptor to add the JWT token to headers for authenticated requests
API.interceptors.request.use((req) => {
    if (localStorage.getItem('userInfo')) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        req.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return req;
});

export default API;

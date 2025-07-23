// frontend/src/pages/AuthPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import { useNavigate } from 'react-router-dom'; // For programmatic navigation

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and Register forms
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // For success/error messages
    const [loading, setLoading] = useState(false); // For loading state during API calls

    const { login, register, user } = useAuth(); // Get auth functions and user state from context
    const navigate = useNavigate(); // Initialize navigate hook

    // Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            navigate('/'); // Redirect to home page
        }
    }, [user, navigate]); // Rerun effect when user or navigate changes

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setMessage(''); // Clear previous messages
        setLoading(true); // Set loading to true

        try {
            if (isLogin) {
                await login(email, password); // Call login function from context
                setMessage('Login successful!');
            } else {
                await register(username, email, password); // Call register function from context
                setMessage('Registration successful!');
            }
            // No need to navigate here, the useEffect will handle it
        } catch (error) {
            setMessage(error.message || 'An error occurred.'); // Display error message
        } finally {
            setLoading(false); // Set loading to false
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition duration-500 hover:scale-[1.01] hover:shadow-3xl">
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
                    {isLogin ? 'Login' : 'Register'}
                </h2>

                {message && (
                    <div className={`p-4 mb-4 rounded-lg text-center ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                id="username"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required={!isLogin}
                                placeholder="Enter your username"
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="your.email@anurag.edu.in"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                        ) : (
                            isLogin ? 'Login' : 'Register'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-600">
                    {isLogin ? (
                        <p>
                            Don't have an account?{' '}
                            <button
                                onClick={() => setIsLogin(false)}
                                className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition duration-200"
                            >
                                Register
                            </button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{' '}
                            <button
                                onClick={() => setIsLogin(true)}
                                className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition duration-200"
                            >
                                Login
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;

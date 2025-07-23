// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import Navbar from './components/Navbar'; // Import Navbar
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

// Import pages
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import AddItemPage from './pages/AddItemPage';
import ItemDetailPage from './pages/ItemDetailPage';

function App() {
    return (
        // Wrap the entire application with AuthProvider to make auth context available
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen font-inter">
                    <Navbar /> {/* Navbar is always visible */}
                    <main className="flex-grow">
                        <Routes>
                            {/* Public routes */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/auth" element={<AuthPage />} />
                            <Route path="/item/:id" element={<ItemDetailPage />} />

                            {/* Protected routes */}
                            {/* AddItemPage requires authentication */}
                            <Route
                                path="/add-item"
                                element={
                                    <ProtectedRoute>
                                        <AddItemPage />
                                    </ProtectedRoute>
                                }
                            />
                            {/* Add more protected routes here if needed */}

                            {/* Catch-all for undefined routes */}
                            <Route path="*" element={
                                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-100 text-gray-700">
                                    <h1 className="text-6xl font-extrabold text-indigo-600 mb-4">404</h1>
                                    <p className="text-2xl font-semibold mb-2">Page Not Found</p>
                                    <p className="text-lg">The page you are looking for does not exist.</p>
                                    <a href="/" className="mt-6 text-indigo-600 hover:underline text-lg font-medium">Go to Home Page</a>
                                </div>
                            } />
                        </Routes>
                    </main>
                    {/* Optional: Add a Footer component here */}
                    {/* <Footer /> */}
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;

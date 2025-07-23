// frontend/src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

const Navbar = () => {
    const { user, logout } = useAuth(); // Get user and logout function from AuthContext

    return (
        <nav className="bg-gradient-to-r from-indigo-600 to-purple-700 p-4 shadow-lg rounded-b-lg">
            <div className="container mx-auto flex justify-between items-center flex-wrap">
                {/* Brand/Logo */}
                <Link to="/" className="text-white text-3xl font-bold font-inter hover:text-indigo-200 transition duration-300 ease-in-out transform hover:scale-105">
                    Lost & Found
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center space-x-6 mt-4 md:mt-0">
                    <Link to="/" className="text-white text-lg font-medium hover:text-indigo-200 transition duration-300 ease-in-out hover:underline">
                        Home
                    </Link>

                    {user ? (
                        <>
                            {/* Link for authenticated users to add items */}
                            <Link to="/add-item" className="text-white text-lg font-medium hover:text-indigo-200 transition duration-300 ease-in-out hover:underline">
                                Add Item
                            </Link>
                            {/* Display username and logout button */}
                            <span className="text-white text-lg font-medium hidden md:block">
                                Welcome, {user.username}!
                            </span>
                            <button
                                onClick={logout}
                                className="bg-white text-indigo-700 px-5 py-2 rounded-full font-semibold hover:bg-indigo-100 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        // Links for unauthenticated users
                        <Link to="/auth" className="bg-white text-indigo-700 px-5 py-2 rounded-full font-semibold hover:bg-indigo-100 transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
                            Login / Register
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

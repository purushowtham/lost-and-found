// frontend/src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import API from '../api/axios'; // Import the configured Axios instance
import ItemCard from '../components/ItemCard'; // CORRECTED: Import the ItemCard component with relative path
import { Link } from 'react-router-dom'; // Ensure Link is imported

const HomePage = () => {
    const [items, setItems] = useState([]); // State to store the list of items
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [error, setError] = useState(null); // State for error messages

    useEffect(() => {
        // Function to fetch items from the backend
        const fetchItems = async () => {
            try {
                setLoading(true); // Set loading to true before fetching
                const { data } = await API.get('/items'); // Make GET request to /api/items
                setItems(data); // Update items state with fetched data
                setError(null); // Clear any previous errors
            } catch (err) {
                console.error('Error fetching items:', err);
                setError('Failed to load items. Please try again later.'); // Set error message
            } finally {
                setLoading(false); // Set loading to false after fetching (success or error)
            }
        };

        fetchItems(); // Call the fetch function when component mounts
    }, []); // Empty dependency array means this effect runs once on mount

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-500"></div>
                <p className="ml-4 text-xl text-gray-700">Loading items...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-red-50 p-6 rounded-lg shadow-md">
                <p className="text-red-700 text-lg font-semibold">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10 mt-4">
                Recently Found Items at Anurag University
            </h1>

            {items.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-md text-center text-gray-600 text-lg">
                    <p>No items have been posted yet. Be the first to add one!</p>
                    <p className="mt-2">If you've found something, please <Link to="/add-item" className="text-indigo-600 hover:underline font-semibold">add it here</Link>.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {items.map((item) => (
                        <ItemCard key={item._id} item={item} /> // Render ItemCard for each item
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;

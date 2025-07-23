// frontend/src/pages/ItemDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ItemDetailPage = () => {
    const { id } = useParams(); // Get item ID from URL parameters
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [claimMessage, setClaimMessage] = useState('');
    const [deleteMessage, setDeleteMessage] = useState(''); // New state for delete messages
    const [showClaimModal, setShowClaimModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // New state for delete modal

    const { user } = useAuth(); // Get current user from AuthContext
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                setLoading(true);
                const { data } = await API.get(`/items/${id}`); // Fetch single item by ID
                setItem(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching item details:', err);
                setError('Failed to load item details. Item might not exist.');
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]); // Rerun effect if item ID changes

    const handleClaimItem = async () => {
        if (!user) {
            setClaimMessage('Please log in to claim an item.');
            navigate('/auth');
            return;
        }

        // Check if the current user is the one who found the item
        if (item && user._id === item.foundBy._id) {
            setClaimMessage('You cannot claim an item you found!');
            setShowClaimModal(false); // Close modal
            return;
        }

        try {
            setClaimMessage('');
            const { data } = await API.put(`/items/${id}/claim`); // Send PUT request to claim item
            setItem(data); // Update item state with claimed status
            setClaimMessage('Item successfully claimed! Please contact the finder to arrange pickup.');
            setShowClaimModal(false); // Close modal
        } catch (err) {
            console.error('Error claiming item:', err.response?.data?.message || err.message);
            setClaimMessage(err.response?.data?.message || 'Failed to claim item. Please try again.');
        }
    };

    const handleDeleteItem = async () => {
        if (!user) {
            setDeleteMessage('You must be logged in to delete an item.');
            setShowDeleteModal(false);
            navigate('/auth');
            return;
        }

        // This check is also done on the backend, but good for UX
        if (item && user._id !== item.foundBy._id) {
            setDeleteMessage('You are not authorized to delete this item.');
            setShowDeleteModal(false);
            return;
        }

        try {
            setDeleteMessage('');
            await API.delete(`/items/${id}`); // Send DELETE request
            setDeleteMessage('Item successfully removed!');
            setShowDeleteModal(false); // Close modal
            // Redirect to home page after successful deletion
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (err) {
            console.error('Error deleting item:', err.response?.data?.message || err.message);
            setDeleteMessage(err.response?.data?.message || 'Failed to remove item. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-500"></div>
                <p className="ml-4 text-xl text-gray-700">Loading item details...</p>
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

    if (!item) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <p className="text-gray-600 text-lg">Item not found.</p>
            </div>
        );
    }

    // Determine if the current user is the finder
    const isFinder = user && item.foundBy && user._id === item.foundBy._id;

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden p-8 lg:flex lg:items-start lg:space-x-8 transform transition duration-500 hover:scale-[1.005] hover:shadow-3xl">
                {/* Item Image Section */}
                <div className="lg:w-1/2 flex-shrink-0 mb-6 lg:mb-0">
                    <img
                        src={`http://localhost:5000${item.image}`}
                        alt={item.name}
                        className="w-full h-auto object-cover rounded-lg shadow-lg border border-gray-200"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/600x400/E0E0E0/6B7280?text=No+Image`;
                        }}
                    />
                </div>

                {/* Item Details Section */}
                <div className="lg:w-1/2">
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-4">{item.name}</h1>
                    <p className="text-gray-700 text-lg mb-6 leading-relaxed">{item.description}</p>

                    <div className="space-y-3 text-gray-700 mb-6">
                        <p className="flex items-center text-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-semibold">Found At:</span> <span className="ml-2">{item.locationFound}</span>
                        </p>
                        <p className="flex items-center text-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="font-semibold">Found By:</span> <span className="ml-2 text-indigo-600">{item.foundBy.username}</span>
                        </p>
                        <p className="flex items-center text-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-semibold">Date Found:</span> <span className="ml-2">{new Date(item.createdAt).toLocaleDateString()}</span>
                        </p>
                        <p className="flex items-center text-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 4v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7" />
                            </svg>
                            <span className="font-semibold">Finder Contact:</span> <span className="ml-2">{item.contactInfo}</span>
                        </p>
                    </div>

                    {claimMessage && (
                        <div className={`p-4 mb-4 rounded-lg text-center ${claimMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {claimMessage}
                        </div>
                    )}

                    {deleteMessage && (
                        <div className={`p-4 mb-4 rounded-lg text-center ${deleteMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {deleteMessage}
                        </div>
                    )}

                    <div className="flex flex-col space-y-4">
                        {item.isClaimed ? (
                            <div className="bg-green-100 text-green-700 p-4 rounded-lg text-center font-semibold text-xl flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                This item has been claimed by {item.claimedBy?.username || 'an unknown user'} on {new Date(item.claimedDate).toLocaleDateString()}.
                            </div>
                        ) : (
                            // Only show claim button if not claimed and current user is not the finder
                            !isFinder && user ? (
                                <button
                                    onClick={() => setShowClaimModal(true)}
                                    className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg text-xl font-semibold hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002 12c0 2.757 1.124 5.232 2.917 7.078A11.995 11.995 0 0012 22h.008c.768 0 1.53-.098 2.274-.294a12.001 12.001 0 005.817-4.908A11.954 11.954 0 0122 12c0-2.056-.566-3.957-1.542-5.594L18.12 4.414z" />
                                    </svg>
                                    Claim This Item
                                </button>
                            ) : (
                                isFinder ? (
                                    <div className="bg-blue-100 text-blue-700 p-4 rounded-lg text-center font-semibold text-lg">
                                        You found this item.
                                    </div>
                                ) : (
                                    <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg text-center font-semibold text-lg">
                                        Please log in to claim this item.
                                    </div>
                                )
                            )
                        )}

                        {/* Delete Button - Visible only to finder and if item is claimed */}
                        {isFinder && item.isClaimed && (
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="w-full bg-red-600 text-white py-4 px-6 rounded-lg text-xl font-semibold hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-center mt-4"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove Claimed Item
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Claim Confirmation Modal */}
            {showClaimModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Claim</h3>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to claim this item? Once claimed, it will be marked as such.
                            You will then need to contact the finder using the provided contact information to arrange pickup.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleClaimItem}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                            >
                                Yes, Claim It
                            </button>
                            <button
                                onClick={() => setShowClaimModal(false)}
                                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to permanently remove this item? This action cannot be undone.
                            The item will be removed from the list and its image will be deleted from the server.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleDeleteItem}
                                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                            >
                                Yes, Delete It
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemDetailPage;

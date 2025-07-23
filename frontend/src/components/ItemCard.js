// frontend/src/components/ItemCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl border border-gray-200">
            {/* Item Image */}
            <div className="w-full h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                {/* Display image, with a placeholder if image is broken */}
                <img
                    src={`http://localhost:5000${item.image}`} // IMPORTANT: Prepend your backend URL here
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback to a placeholder image if the actual image fails to load
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = `https://placehold.co/400x300/E0E0E0/6B7280?text=No+Image`;
                    }}
                />
            </div>

            {/* Item Details */}
            <div className="p-5">
                <h3 className="text-2xl font-bold text-gray-800 mb-2 truncate">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center text-gray-700 text-sm mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-semibold">Found At:</span> {item.locationFound}
                </div>
                <p className="text-gray-500 text-xs mt-1">
                    Found by: <span className="font-medium text-indigo-600">{item.foundBy.username}</span> on {new Date(item.createdAt).toLocaleDateString()}
                </p>

                {/* Claimed Status */}
                {item.isClaimed && (
                    <div className="mt-3 text-sm font-semibold text-green-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Claimed!
                    </div>
                )}

                {/* View Details Button */}
                <Link to={`/item/${item._id}`} className="mt-4 block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg text-center font-semibold hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default ItemCard;

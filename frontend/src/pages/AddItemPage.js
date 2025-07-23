// frontend/src/pages/AddItemPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios'; // Import the configured Axios instance
import { useAuth } from '../context/AuthContext'; // To check if user is logged in

const AddItemPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [locationFound, setLocationFound] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [image, setImage] = useState(null); // State to store the selected image file
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { user } = useAuth(); // Get user from auth context

    // Redirect if not logged in (though ProtectedRoute should handle this)
    if (!user) {
        navigate('/auth');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        // Create FormData object to send text fields and the file
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('locationFound', locationFound);
        formData.append('contactInfo', contactInfo);
        if (image) {
            formData.append('image', image); // Append the image file
        } else {
            setMessage('Please upload an image for the item.');
            setLoading(false);
            return;
        }

        try {
            // Make POST request to /api/items with FormData
            // Axios will automatically set Content-Type to multipart/form-data
            await API.post('/items', formData);
            setMessage('Item added successfully!');
            // Clear form fields after successful submission
            setName('');
            setDescription('');
            setLocationFound('');
            setContactInfo('');
            setImage(null);
            // Optionally, navigate to home page or item details page
            setTimeout(() => {
                navigate('/');
            }, 1500); // Redirect after 1.5 seconds
        } catch (error) {
            console.error('Error adding item:', error.response?.data?.message || error.message);
            setMessage(error.response?.data?.message || 'Failed to add item. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition duration-500 hover:scale-[1.01] hover:shadow-3xl">
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
                    Add a Found Item
                </h2>

                {message && (
                    <div className={`p-4 mb-4 rounded-lg text-center ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                        <input
                            type="text"
                            id="name"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="e.g., Blue Water Bottle, Black Backpack"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            id="description"
                            rows="4"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder="Provide a detailed description of the item, including unique features, brand, color, etc."
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="locationFound" className="block text-sm font-medium text-gray-700 mb-1">Location Found</label>
                        <input
                            type="text"
                            id="locationFound"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            value={locationFound}
                            onChange={(e) => setLocationFound(e.target.value)}
                            required
                            placeholder="e.g., University Library, C-Block Cafeteria, Football Ground"
                        />
                    </div>
                    <div>
                        <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-1">Your Contact Info</label>
                        <input
                            type="text"
                            id="contactInfo"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            value={contactInfo}
                            onChange={(e) => setContactInfo(e.target.value)}
                            required
                            placeholder="Your email or phone number for the owner to contact you"
                        />
                    </div>
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Item Image</label>
                        <input
                            type="file"
                            id="image"
                            className="mt-1 block w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition duration-200"
                            onChange={(e) => setImage(e.target.files[0])}
                            accept="image/jpeg, image/png, image/gif"
                            required
                        />
                        <p className="mt-2 text-sm text-gray-500">Upload a clear image of the item (Max 5MB, JPG, PNG, GIF).</p>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                        ) : (
                            'Submit Found Item'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddItemPage;

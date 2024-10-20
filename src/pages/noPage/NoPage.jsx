import React from 'react';
import { useNavigate } from 'react-router-dom';

const NoPage = () => {
    const navigate = useNavigate(); // Initialize the navigate function

    const handleHomeClick = () => {
        navigate('/'); // Navigate to the home page
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">404 - No Page Found</h1>
            <p className="text-lg mb-6">The page you are looking for does not exist.</p>
            <button
                onClick={handleHomeClick}
                className="bg-green-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-green-600 hover:scale-105"
            >
                Back to Home
            </button>
        </div>
    );
}

export default NoPage;

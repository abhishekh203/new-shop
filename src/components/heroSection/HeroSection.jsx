import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

// Array of images for the HeroSection slider
const images = [
    "https://cap.img.pmdstatic.net/fit/https.3A.2F.2Fi.2Epmdstatic.2Enet.2Fcap.2F2022.2F11.2F03.2F09cc07e8-23ec-424e-b895-d3ddd84bb652.2Ejpeg/1200x630/cr/wqkgcGljdHVyZSBhbGxpYW5jZS9HZXR0eUltYWdlcyAvIENBUElUQUw%3D/netflix-spotify-amazon-faire-des-economies-en-partageant-son-abonnement-avec-des-inconnus-une-solution-perenne-1450950.jpg",
     "../img/111.webp",
    "https://pbs.twimg.com/media/F1zNhWXWwAA_Y6E.png",
    "https://t3.ftcdn.net/jpg/04/16/93/06/360_F_416930698_zpV7oPMqpFzCUYETC9K2JH0B0BfRlKra.jpg",
    "../img/5.png",
    "../img/1.png",
   
    // Add more image URLs as needed
];

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(true); // Controls modal visibility

    const goToNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    };

    const goToPrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + images.length) % images.length);
    };

    useEffect(() => {
        const intervalId = setInterval(goToNextSlide, 2000); // Change slide every 2 seconds
        return () => clearInterval(intervalId); // Clean up the interval on component unmount
    }, []);

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    return (
        <div className="relative w-full overflow-hidden bg-gradient-to-r from-black to-blue-700">
            {/* Announcement Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
                        {/* Image */}
                        <img 
                            src="../img/diwali.webp" 
                            alt="Diwali Offer" 
                            className="w-full mb-4"
                        />
                        {/* Announcement Title */}
                        <h2 className="text-lg font-bold mb-4">📢 Diwali Special Offer</h2>
                        {/* Announcement Text */}
                        <p className="text-sm mb-4">
                            Get any subscription with up to <strong>40% discount</strong> of up to <strong>100</strong>! 
                            Offer valid until <strong>30th October</strong>.
                        </p>
                        {/* Link to the offer page */}
                        <Link
                            to="/allproduct" // Navigate to the subscription offer page
                            className="text-blue-500 underline mb-4 block"
                            onClick={closeModal} // Close modal on link click
                        >
                            Claim your offer now!
                        </Link>
                        {/* Close Button */}
                       
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={closeModal}
                        >
                            Close 
                            {/* Stay on Home Page */}
                        </button>

                    </div>
                </div>
            )}

            {/* Image Slider */}
            <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {images.map((image, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                        <img 
                            className="w-full h-60 md:h-80 lg:h-96 object-cover" 
                            src={image} 
                            alt={`Slide ${index}`} 
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={goToPrevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg focus:outline-none"
            >
                &lt;
            </button>
            <button
                onClick={goToNextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white p-2 rounded-full shadow-lg focus:outline-none"
            >
                &gt;
            </button>
        </div>
    );
};

export default HeroSection;


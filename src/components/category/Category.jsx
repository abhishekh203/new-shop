import React from "react";
import { useNavigate } from "react-router-dom";

// Category array
const category = [
    { image: '../img/computer.png', name: 'ott', color: 'bg-green-500' },
    { image: '../img/video-player.png', name: 'movies', color: 'bg-yellow-500' },
    { image: '../img/spotify.png', name: 'music', color: 'bg-red-500' },
    { image: '../img/netflix.png', name: 'netflix', color: 'bg-black' },
    { image: '../img/streaming-tv-app.png', name: 'streaming', color: 'bg-teal-500' },
    { image: 'https://cdn-icons-png.flaticon.com/256/1382/1382954.png', name: 'useful-tools', color: 'bg-purple-500' },
    { image: 'https://cdn-icons-png.flaticon.com/256/1855/1855827.png', name: 'bundle', color: 'bg-orange-500' },
    { image: '../img/online-course.png', name: 'education', color: 'bg-blue-500' },
    { image: '../img/vpn.png', name: 'vpn', color: 'bg-gray-500' },
    { image: '../img/game-console.png', name: 'games', color: 'bg-pink-500' },
    { image: '../img/social-media.png', name: 'smm panel', color: 'bg-green-600' },
    { image: '../img/special-tag.png', name: 'special offer', color: 'bg-yellow-600' },
    { image: '../img/antivirus.png', name: 'antivirus', color: 'bg-red-600' },
    { image: '../img/gift-coupon.png', name: 'gift card', color: 'bg-blue-600' },
];

const Category = () => {
    const navigate = useNavigate();

    // Handle navigation when category is clicked
    const handleNavigation = (item) => {
        navigate(`/category/${item.name}`);
    };

    return (
        <div className="px-4 lg:px-0 bg-gradient-to-br from-blue-900 to-black py-5">
            {/* Categories Container */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 lg:gap-12 justify-center">
                {category.map((item, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                        {/* Image Container */}
                        <div
                            onClick={() => handleNavigation(item)}
                            className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full ${item.color} transition-transform hover:scale-110 hover:shadow-xl cursor-pointer flex justify-center items-center`}
                        >
                            <img src={item.image} alt={item.name} className="w-3/4 h-3/4 object-contain" />
                        </div>

                        {/* Category Name */}
                        <h1 className="text-sm lg:text-md text-center font-semibold capitalize text-gray-700 hover:text-pink-500 transition-colors">
                            {item.name}
                        </h1>
                    </div>
                ))}
            </div>

            {/* Custom Scrollbar Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .hide-scroll-bar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scroll-bar::-webkit-scrollbar {
                    display: none;
                }
                `}} />
        </div>
    );
};

export default Category;

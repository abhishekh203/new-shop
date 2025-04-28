import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const categories = [
  { 
    id: 'netflix',
    name: 'Netflix', 
    image: 'https://cdn-icons-png.flaticon.com/512/732/732228.png',
    color: 'bg-red-600'
  },
  { 
    id: 'ott',
    name: 'OTT', 
    image: 'https://cdn-icons-png.flaticon.com/512/2965/2965300.png',
    color: 'bg-green-500'
  },
  { 
    id: 'streaming',
    name: 'Streaming', 
    image: 'https://cdn-icons-png.flaticon.com/512/2965/2965278.png',
    color: 'bg-blue-500'
  },
  { 
    id: 'music',
    name: 'Music', 
    image: 'https://cdn-icons-png.flaticon.com/512/2111/2111624.png',
    color: 'bg-green-400'
  },
  { 
    id: 'software',
    name: 'Software', 
    image: 'https://cdn-icons-png.flaticon.com/512/888/888882.png',
    color: 'bg-purple-500'
  },
  { 
    id: 'games',
    name: 'Games', 
    image: 'https://cdn-icons-png.flaticon.com/512/3652/3652191.png',
    color: 'bg-pink-400'
  },
  { 
    id: 'movies',
    name: 'Movies', 
    image: 'https://cdn-icons-png.flaticon.com/512/4221/4221419.png',
    color: 'bg-yellow-400'
  },
  { 
    id: 'bundle',
    name: 'Bundle', 
    image: 'https://cdn-icons-png.flaticon.com/512/1584/1584892.png',
    color: 'bg-orange-400'
  },
  { 
    id: 'education',
    name: 'Education', 
    image: 'https://cdn-icons-png.flaticon.com/512/3976/3976626.png',
    color: 'bg-blue-400'
  },
  { 
    id: 'vpn',
    name: 'VPN', 
    image: 'https://cdn-icons-png.flaticon.com/512/3059/3059518.png',
    color: 'bg-gray-500'
  },
  { 
    id: 'ai-tools',
    name: 'AI Tools', 
    image: 'https://cdn-icons-png.flaticon.com/512/4341/4341025.png',
    color: 'bg-teal-400'
  },
  { 
    id: 'special-offers',
    name: 'Special Offers', 
    image: 'https://cdn-icons-png.flaticon.com/512/2729/2729007.png',
    color: 'bg-yellow-500'
  },
  { 
    id: 'antivirus',
    name: 'Antivirus', 
    image: 'https://cdn-icons-png.flaticon.com/512/2784/2784401.png',
    color: 'bg-red-500'
  },
  { 
    id: 'gift-cards',
    name: 'Gift Cards', 
    image: 'https://cdn-icons-png.flaticon.com/512/217/217853.png',
    color: 'bg-blue-300'
  }
];

const Category = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const handleNavigation = (category) => {
        navigate(`/category/${category.id}`);
    };

    const checkScrollPosition = () => {
        if (containerRef.current) {
            setShowLeftArrow(containerRef.current.scrollLeft > 0);
            setShowRightArrow(
                containerRef.current.scrollLeft < 
                containerRef.current.scrollWidth - containerRef.current.clientWidth - 10
            );
        }
    };

    const scrollLeft = () => {
        containerRef.current.scrollBy({
            left: -300,
            behavior: "smooth",
        });
    };

    const scrollRight = () => {
        containerRef.current.scrollBy({
            left: 300,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        const container = containerRef.current;
        container.addEventListener('scroll', checkScrollPosition);
        return () => container.removeEventListener('scroll', checkScrollPosition);
    }, []);

    return (
        <div className="mt-12 px-4 lg:px-8 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse Categories</h2>
            
            <div className="relative">
                {/* Left Arrow */}
                {showLeftArrow && (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollLeft}
                        className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 z-10 
                            ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                    >
                        <FiChevronLeft className="text-gray-700 text-xl" />
                    </motion.button>
                )}

                {/* Categories Container */}
                <div
                    ref={containerRef}
                    className="flex overflow-x-auto hide-scroll-bar space-x-6 lg:space-x-8 py-4"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {categories.map((category, index) => (
                        <motion.div 
                            key={category.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex flex-col items-center space-y-3 min-w-[120px] cursor-pointer"
                            onClick={() => handleNavigation(category)}
                        >
                            {/* Category Icon */}
                            <div className={`w-20 h-20 rounded-xl ${category.color} flex items-center justify-center shadow-md`}>
                                <img 
                                    src={category.image} 
                                    alt={category.name} 
                                    className="w-12 h-12 object-contain filter drop-shadow-md"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://cdn-icons-png.flaticon.com/512/3767/3767084.png';
                                    }}
                                />
                            </div>
                            
                            {/* Category Name */}
                            <span className="text-sm font-medium text-gray-700 text-center px-2">
                                {category.name}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Right Arrow */}
                {showRightArrow && (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollRight}
                        className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 z-10 
                            ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                    >
                        <FiChevronRight className="text-gray-700 text-xl" />
                    </motion.button>
                )}
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .hide-scroll-bar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scroll-bar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default Category;
import { useContext, useState, useEffect, useRef } from "react";
import myContext from "../../context/myContext";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMessageSquare, FiSearch } from "react-icons/fi";
import { createProductUrl } from "../../utils/slugUtils";

const SearchBar = () => {
    const context = useContext(myContext);
    const { getAllProduct } = context;
    const [search, setSearch] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const inputRef = useRef(null);

    // Check if mobile device
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearch("");
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

    // Focus input when mounted (for mobile)
    useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
            if (isMobile) {
                // Scroll to input on mobile when focused
                setTimeout(() => {
                    inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
    }, [isFocused, isMobile]);

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState("");
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    // Filter search data with debounce
    const filterSearchData = getAllProduct
        .filter((obj) => obj.title.toLowerCase().includes(debouncedSearch.toLowerCase()))
        .slice(0, 8);

    const clearSearch = () => {
        setSearch("");
        setDebouncedSearch("");
        if (inputRef.current) inputRef.current.focus();
    };

    const handleSearchClick = () => {
        setIsFocused(true);
    };

    const handleResultClick = (item) => {
        navigate(createProductUrl(item));
        setSearch("");
        setIsFocused(false);
    };

    return (
        <div className="relative w-full max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl 2xl:max-w-5xl" ref={searchRef}>
            {/* Search input */}
            <motion.div 
                className="relative w-full"
                whileHover={{ scale: isMobile ? 1 : 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    className="bg-white/20 placeholder-gray-500 rounded-xl px-4 py-2 lg:py-2.5 xl:py-2.5 w-full outline-none text-gray-800
                    focus:bg-white/30 focus:ring-2 focus:ring-blue-500/60 transition duration-200
                    border border-white/30 hover:border-blue-400/60 hover:bg-white/25 hover:shadow-sm backdrop-blur-sm
                    text-sm md:text-base lg:text-base xl:text-base pr-10 min-w-0
                    lg:placeholder:text-base xl:placeholder:text-base"
                />
                
                {/* Search icon (visible on mobile when not focused) */}
                {isMobile && !isFocused && (
                    <button
                        onClick={handleSearchClick}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-600 transition-colors"
                        aria-label="Open search"
                    >
                        <FiSearch size={18} />
                    </button>
                )}

                {/* Clear button (visible when there's text) */}
                {search && (
                    <motion.button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                        aria-label="Clear search"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FiX size={18} />
                    </motion.button>
                )}
            </motion.div>

            {/* Search dropdown */}
            <AnimatePresence>
                {(debouncedSearch && isFocused) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ 
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                            duration: 0.2
                        }}
                        className={`absolute mt-2 w-full rounded-2xl z-50 overflow-hidden shadow-2xl border
                        ${isMobile 
                            ? 'fixed inset-x-4 top-24 max-h-[60vh] backdrop-blur-2xl bg-gray-900/95 border-gray-700/50' 
                            : 'max-h-80 lg:max-h-96 xl:max-h-[28rem] bg-gray-900/95 border-gray-700/50 backdrop-blur-2xl'}`}
                    >
                        {filterSearchData.length > 0 ? (
                            <motion.div 
                                className="overflow-y-auto"
                                style={{ maxHeight: isMobile ? 'calc(60vh - 2rem)' : '20rem' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                {filterSearchData.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.6)" }}
                                        whileTap={{ scale: 0.98 }}
                                        className="py-2 px-3 lg:py-2.5 lg:px-4 xl:py-2.5 xl:px-4 cursor-pointer flex items-center gap-3 transition-colors hover:bg-gray-700/50"
                                        onClick={() => handleResultClick(item)}
                                    >
                                        <motion.img 
                                            className="w-8 h-8 lg:w-10 lg:h-10 xl:w-10 xl:h-10 object-cover rounded-lg border border-gray-700/60"
                                            src={item.productImageUrl} 
                                            alt={item.title}
                                            loading="lazy"
                                            initial={{ scale: 0.9 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 500 }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs lg:text-sm xl:text-sm font-medium text-gray-100 truncate">{item.title}</p>
                                            <p className="text-xs lg:text-xs xl:text-xs text-teal-400 font-semibold">NPR {item.price}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div 
                                className="p-4 text-center"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <motion.div 
                                    className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-3"
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ repeat: 1, duration: 0.5 }}
                                >
                                    <FiMessageSquare size={24} className="text-gray-300" />
                                </motion.div>
                                <p className="text-gray-300 text-sm mb-2">Product not found</p>
                                <p className="text-gray-400 text-xs">Request this item via WhatsApp</p>
                                <motion.button
                                    className="mt-3 text-white text-sm font-medium transition-colors px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500"
                                    onClick={() => {
                                        window.open("https://wa.me/9807677391", "_blank");
                                        setSearch("");
                                        setIsFocused(false);
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Contact Us
                                </motion.button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;
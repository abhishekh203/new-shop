import { useContext, useState, useEffect, useRef } from "react";
import myContext from "../../context/myContext";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMessageSquare, FiSearch } from "react-icons/fi";
import { createProductUrl } from "../../utils/slugUtils";
import { serifTheme } from "../../design-system/themes";

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
                    className={`${serifTheme.colors.background.card} placeholder-gray-500 ${serifTheme.radius.input} px-4 py-2 lg:py-2.5 xl:py-2.5 w-full outline-none ${serifTheme.colors.text.primary}
                    focus:bg-white focus:ring-2 focus:ring-amber-500/60 ${serifTheme.transitions.default}
                    border ${serifTheme.colors.border.primary} hover:border-amber-400/60 hover:bg-white hover:shadow-sm backdrop-blur-sm
                    text-sm md:text-base lg:text-base xl:text-base pr-10 min-w-0
                    lg:placeholder:text-base xl:placeholder:text-base`}
                    style={{ fontFamily: serifTheme.fontFamily.serif }}
                />
                
                {/* Search icon (visible on mobile when not focused) */}
                {isMobile && !isFocused && (
                    <button
                        onClick={handleSearchClick}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${serifTheme.colors.text.secondary} hover:text-amber-600 ${serifTheme.transitions.default}`}
                        aria-label="Open search"
                    >
                        <FiSearch size={18} />
                    </button>
                )}

                {/* Clear button (visible when there's text) */}
                {search && (
                    <motion.button
                        onClick={clearSearch}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${serifTheme.colors.text.secondary} hover:text-gray-800 ${serifTheme.transitions.default}`}
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
                        className={`absolute mt-2 w-full ${serifTheme.radius.card} z-50 overflow-hidden ${serifTheme.colors.shadow.cardHover} border
                        ${isMobile 
                            ? `fixed inset-x-4 top-24 max-h-[60vh] backdrop-blur-xl ${serifTheme.colors.background.overlay} border ${serifTheme.colors.border.primary}` 
                            : `max-h-80 lg:max-h-96 xl:max-h-[28rem] ${serifTheme.colors.background.overlay} border ${serifTheme.colors.border.primary} backdrop-blur-xl`}`}
                        style={{ fontFamily: serifTheme.fontFamily.serif }}
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
                                        whileHover={{ backgroundColor: "rgba(251, 191, 36, 0.1)" }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`py-2 px-3 lg:py-2.5 lg:px-4 xl:py-2.5 xl:px-4 cursor-pointer flex items-center gap-3 ${serifTheme.transitions.default} hover:bg-amber-50/50`}
                                        onClick={() => handleResultClick(item)}
                                    >
                                        <motion.img 
                                            className={`w-8 h-8 lg:w-10 lg:h-10 xl:w-10 xl:h-10 object-cover ${serifTheme.radius.input} border ${serifTheme.colors.border.secondary}`}
                                            src={item.productImageUrl} 
                                            alt={item.title}
                                            loading="lazy"
                                            initial={{ scale: 0.9 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 500 }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs lg:text-sm xl:text-sm font-medium ${serifTheme.colors.text.primary} truncate`}>{item.title}</p>
                                            <p className={`text-xs lg:text-xs xl:text-xs ${serifTheme.colors.text.accent} font-semibold`}>NPR {item.price}</p>
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
                                    className={`mx-auto w-16 h-16 ${serifTheme.colors.background.secondary} ${serifTheme.radius.badge} flex items-center justify-center mb-3`}
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ repeat: 1, duration: 0.5 }}
                                >
                                    <FiMessageSquare size={24} className={serifTheme.colors.text.secondary} />
                                </motion.div>
                                <p className={`${serifTheme.colors.text.primary} text-sm mb-2`}>Product not found</p>
                                <p className={`${serifTheme.colors.text.muted} text-xs`}>Request this item via WhatsApp</p>
                                <motion.button
                                    className={`mt-3 ${serifTheme.colors.text.primary} text-sm font-medium ${serifTheme.transitions.default} px-4 py-2 ${serifTheme.radius.button} ${serifTheme.gradients.button} hover:opacity-90`}
                                    onClick={() => {
                                        window.open("https://wa.me/9807677391", "_blank");
                                        setSearch("");
                                        setIsFocused(false);
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{ fontFamily: serifTheme.fontFamily.serif }}
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
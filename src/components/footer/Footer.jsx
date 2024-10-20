import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTelegramPlane, FaYoutube, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate('/');
        window.scrollTo(0, 0); // Scroll to the top of the page
    };

    return (
        <div>
            {/* footer */}
            <footer className="text-gray-600 body-font bg-gradient-to-r from-black via-blue-900 to-black">
                
                {/* main */}
                <div className="container px-5 py-5 mx-auto flex flex-col lg:flex-row lg:justify-between items-center lg:space-x-10">
                    
                    {/* logo */}
                    <a className="flex title-font font-medium items-center text-white mb-4 lg:mb-0">
                        <span className="text-xl font-bold">Digital Shop Nepal</span>
                    </a>

                    {/* para */}
                    <p className="text-sm text-gray-100 lg:border-l-2 lg:border-gray-200 lg:pl-4 lg:ml-4">
                        © 2024 digitalshopnepal —
                        <Link
                            to={'/'}
                            className="text-gray-100 ml-1"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            @digitalshopnepal
                        </Link>
                    </p>

                    {/* media icon */}
                    <span className="inline-flex mt-4 lg:mt-0 lg:ml-auto justify-center lg:justify-start">
                        {/* Facebook */}
                        <a href="https://www.facebook.com/profile.php?id=61562586557322" className="text-gray-100 cursor-pointer hover:text-blue-500 transition-colors duration-300" target="_blank" rel="noopener noreferrer">
                            <FaFacebookF className="w-5 h-5" />
                        </a>

                        {/* Instagram */}
                        <a href="https://www.instagram.com/?next=%2F" className="ml-3 text-gray-100 cursor-pointer hover:text-pink-500 transition-colors duration-300" target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="w-5 h-5" />
                        </a>

                        {/* Telegram */}
                        <a href="https://t.me/netflixnepalseller" className="ml-3 text-gray-100 cursor-pointer hover:text-blue-500 transition-colors duration-300" target="_blank" rel="noopener noreferrer">
                            <FaTelegramPlane className="w-5 h-5" />
                        </a>

                        {/* YouTube */}
                        <a href="https://www.youtube.com/channel/UCXXXXXX" className="ml-3 text-gray-100 cursor-pointer hover:text-red-500 transition-colors duration-300" target="_blank" rel="noopener noreferrer">
                            <FaYoutube className="w-5 h-5" />
                        </a>

                        {/* WhatsApp */}
                        <a href="https://wa.me/9779807677391" className="ml-3 text-gray-100 cursor-pointer hover:text-green-500 transition-colors duration-300" target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp className="w-5 h-5" />
                        </a>
                    </span>

                    {/* Back to Home Button - Aligned to the right on large devices */}
                    <div className="mt-4 lg:mt-0 lg:ml-auto lg:flex lg:justify-end">
                        <button
                            onClick={handleHomeClick}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-green-600 hover:scale-105"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Footer;

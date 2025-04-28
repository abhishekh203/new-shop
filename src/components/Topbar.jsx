import React from "react";
import Marquee from "react-fast-marquee";
import { FiClock, FiMessageSquare, FiDollarSign, FiBookOpen, FiPhone } from "react-icons/fi";

const TopBar = () => {
    return (
        <div className="bg-black text-white text-xs md:text-sm py-2 border-b border-gray-700">
            <Marquee 
                gradient={false} 
                speed={40} 
                pauseOnHover={true}
                pauseOnClick={true}
                className="flex items-center"
            >
                {/* Working Hours */}
                <div className="flex items-center mx-4 md:mx-6 px-3 py-1 bg-gray-800 rounded-full">
                    <FiClock className="text-green-400 mr-2" />
                    <span>Working Hours: 8 AM - 11 PM GMT +5:30</span>
                </div>

                {/* WhatsApp Community */}
                <a 
                    href="https://chat.whatsapp.com/IXl6YmkAZgEJkveJgbatAP" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center mx-4 md:mx-6 px-3 py-1 bg-gray-800 rounded-full hover:bg-green-900 transition-colors"
                >
                    <FiMessageSquare className="text-green-400 mr-2" />
                    <span>Join Our WhatsApp Community for Exclusive Deals</span>
                </a>

                {/* Payment Methods */}
                <div className="flex items-center mx-4 md:mx-6 px-3 py-1 bg-gray-800 rounded-full">
                    <FiDollarSign className="text-blue-400 mr-2" />
                    <span>We accept Esewa, Khalti, Imepay, and Bank Transfer</span>
                </div>

                {/* Blog Link */}
                <a 
                    href="https://premiumshopnepal.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center mx-4 md:mx-6 px-3 py-1 bg-gray-800 rounded-full hover:bg-yellow-900 transition-colors"
                >
                    <FiBookOpen className="text-yellow-400 mr-2" />
                    <span>Visit Our Blog for the Latest Updates</span>
                </a>

                {/* Contact */}
                <a 
                    href="https://wa.me/9779807677391" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center mx-4 md:mx-6 px-3 py-1 bg-gray-800 rounded-full hover:bg-green-900 transition-colors"
                >
                    <FiPhone className="text-green-400 mr-2" />
                    <span>Contact us on WhatsApp for inquiries</span>
                </a>
            </Marquee>
        </div>
    );
};

export default TopBar;
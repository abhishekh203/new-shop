import React from "react";
import { Facebook, Instagram, Twitter, Telegram, YouTube } from "@mui/icons-material";
import { Link } from "react-router-dom";

const FooterOtt = () => {
    return (
        <footer className="bg-gradient-to-r from-black to-blue-700 text-white py-10 px-5">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {/* About Us Section */}
                <div className="space-y-4">
                    <h5 className="text-2xl font-bold mb-3 text-yellow-300">ABOUT US</h5>
                    <h5 className="text-xl font-semibold">Digital Shop Nepal</h5>
                    <p className="text-white">
                        The Most Trusted <span className="font-bold">Premium Service Provider (PSP)</span> brings up a wide range of
                        Premium Accounts across the web, proudly powered and managed by Our TEAM Members since 2019.
                    </p>
                    <p className="mt-2 text-white">Email or Chat with us for any assistance.</p>
                    <div className="flex space-x-4 mt-3">
                        <a href="https://www.facebook.com" aria-label="Facebook" className="text-blue-500 hover:text-yellow-400 transition-transform transform hover:scale-125" target="_blank" rel="noopener noreferrer">
                            <Facebook fontSize="large" />
                        </a>
                        <a href="https://www.instagram.com" aria-label="Instagram" className="text-pink-500 hover:text-yellow-400 transition-transform transform hover:scale-125" target="_blank" rel="noopener noreferrer">
                            <Instagram fontSize="large" />
                        </a>
                        <a href="https://twitter.com" aria-label="Twitter" className="text-blue-400 hover:text-yellow-400 transition-transform transform hover:scale-125" target="_blank" rel="noopener noreferrer">
                            <Twitter fontSize="large" />
                        </a>
                        <a href="https://t.me" aria-label="Telegram" className="text-blue-400 hover:text-yellow-400 transition-transform transform hover:scale-125" target="_blank" rel="noopener noreferrer">
                            <Telegram fontSize="large" />
                        </a>
                        <a href="https://www.youtube.com" aria-label="YouTube" className="text-red-600 hover:text-yellow-400 transition-transform transform hover:scale-125" target="_blank" rel="noopener noreferrer">
                            <YouTube fontSize="large" />
                        </a>
                    </div>
                </div>

                {/* Customer Section */}
                <div className="space-y-4">
                    <h5 className="text-2xl font-bold mb-3 text-yellow-300">CUSTOMER</h5>
                    <ul className="space-y-2">
                        <li><Link to="/return-policy" className="hover:text-yellow-400 transition-colors duration-300">Return and Refund Policy</Link></li>
                        <li><Link to="/privacy-policy" className="hover:text-yellow-400 transition-colors duration-300">Privacy and Cookies</Link></li>
                        <li><Link to="/support" className="hover:text-yellow-400 transition-colors duration-300">Ticket — Support</Link></li>
                        <li><Link to="/wholesale" className="hover:text-yellow-400 transition-colors duration-300">Wholesale</Link></li>
                    </ul>
                </div>
                
                {/* Policies Section */}
                <div className="space-y-4">
                    <h5 className="text-2xl font-bold mb-3 text-yellow-300">POLICIES</h5>
                    <ul className="space-y-2">
                        <li><Link to="/terms" className="hover:text-yellow-400 transition-colors duration-300">Terms and Conditions</Link></li>
                        <li><Link to="/kyc-aml" className="hover:text-yellow-400 transition-colors duration-300">KYC and AML Policy</Link></li>
                    </ul>
                </div>
                
                {/* Service Section */}
                <div className="space-y-4">
                    <h5 className="text-2xl font-bold mb-3 text-yellow-300">SERVICE</h5>
                    <ul className="space-y-2">
                        <li>100% Safety Guarantee</li>
                        <li>24/7 Customer Support</li>
                        <li>Instant Delivery</li>
                    </ul>
                </div>
                
                {/* Contact Us Section */}
                <div className="space-y-4">
                    <h5 className="text-2xl font-bold mb-3 text-yellow-300">CONTACT US</h5>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/ContactUs" className="hover:text-yellow-400 transition-colors duration-300">Contact Us</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-5">
                {/* Currency Selector */}
                <div className="flex items-center space-x-2">
                    <label htmlFor="currency" className="text-white">Show prices in</label>
                    <select id="currency" defaultValue="INR" className="bg-white text-black rounded p-2">
                        <option value="NPR">Nepali Rupee</option>
                    </select>
                </div>

                {/* Payment Methods */}
                <div className="flex flex-col md:flex-row items-center mt-5 md:mt-0 space-y-2 md:space-y-0 md:space-x-4">
                    <h5 className="text-white">Secure Checkout Guarantee With</h5>
                    <img src="https://play-lh.googleusercontent.com/MRzMmiJAe0-xaEkDKB0MKwv1a3kjDieSfNuaIlRo750_EgqxjRFWKKF7xQyRSb4O95Y=w480-h960-rw" alt="Esewa" className="h-8" />
                    <img src="https://play-lh.googleusercontent.com/Xh_OlrdkF1UnGCnMN__4z-yXffBAEl0eUDeVDPr4UthOERV4Fll9S-TozSfnlXDFzw=w480-h960-rw" alt="Khalti Pay" className="h-8" />
                    <img src="https://play-lh.googleusercontent.com/LzKjYKvzLnyMq9XaRm3RauNI-ni7QwuN4r_IzClSXUNpO6o443SDACRd92ePn03UNHU=w480-h960-rw" alt="ImePay" className="h-8" />
                    <img src="https://st.softgamings.com/uploads/BankTransfer_logo_1200x600.png" alt="Bank Transfer" className="h-8" />
                </div>
            </div>

            <div className="text-center text-white text-sm mt-6">
                By using this website, you agree to the <Link to="/terms" className="text-yellow-400 hover:underline">Terms and Conditions</Link> and <Link to="/privacy-policy" className="text-yellow-400 hover:underline">Privacy Policy</Link>.
            </div>
        </footer>
    );
};

export default FooterOtt;

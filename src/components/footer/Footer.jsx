import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Telegram, 
  YouTube,
  WhatsApp as WhatsAppIcon,
  Email,
  Phone,
  LocationOn,
  CheckCircle,
  ArrowUpward
} from "@mui/icons-material";

const Footer = () => {
    const navigate = useNavigate();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const socialLinks = [
        { 
            href: "https://www.facebook.com/profile.php?id=61562586557322", 
            icon: <Facebook fontSize="medium" />, 
            color: "bg-blue-600 hover:bg-blue-700",
            name: "Facebook"
        },
        { 
            href: "https://www.instagram.com/?next=%2F", 
            icon: <Instagram fontSize="medium" />, 
            color: "bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700",
            name: "Instagram"
        },
        { 
            href: "https://t.me/netflixnepalseller", 
            icon: <Telegram fontSize="medium" />, 
            color: "bg-blue-500 hover:bg-blue-600",
            name: "Telegram"
        },
        { 
            href: "https://www.youtube.com/channel/UCXXXXXX", 
            icon: <YouTube fontSize="medium" />, 
            color: "bg-red-600 hover:bg-red-700",
            name: "YouTube"
        },
        { 
            href: "https://wa.me/9779807677391", 
            icon: <WhatsAppIcon fontSize="medium" />, 
            color: "bg-green-500 hover:bg-green-600",
            name: "WhatsApp"
        },
    ];

    const contactInfo = [
        {
            icon: <Email className="text-orange-400" />,
            text: "digitalshopnepal@gmail.com",
            link: "mailto:digitalshopnepal@gmail.com"
        },
        {
            icon: <Phone className="text-orange-400" />,
            text: "+977 9807677391",
            link: "tel:+9779807677391"
        },
        {
            icon: <LocationOn className="text-orange-400" />,
            text: "Kathmandu, Nepal",
            link: "https://maps.google.com/?q=Kathmandu"
        }
    ];

    const footerSections = [
        {
            title: "About Us",
            content: (
                <>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-sm text-gray-300 mb-4"
                    >
                        Digital Shop Nepal is your trusted provider of premium digital subscriptions since 2019, serving 20,000+ satisfied customers.
                    </motion.p>
                    <div className="flex space-x-3">
                        {socialLinks.map((item, index) => (
                            <motion.a
                                key={index}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-9 h-9 flex items-center justify-center ${item.color} text-white rounded-full`}
                                whileHover={{ y: -5, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label={item.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {item.icon}
                            </motion.a>
                        ))}
                    </div>
                </>
            )
        },
        {
            title: "Quick Links",
            links: [
                { name: "Home", path: "/" },
                { name: "Products", path: "/products" },
                { name: "Categories", path: "/categories" },
                { name: "About Us", path: "/about" },
                { name: "Blog", path: "https://premiumshopnepal.com/" }
            ]
        },
        {
            title: "Support",
            links: [
                { name: "FAQs", path: "/faq" },
                { name: "Return Policy", path: "/return-policy" },
                { name: "Privacy Policy", path: "/privacy-policy" },
                { name: "Terms & Conditions", path: "/terms" },
                { name: "Shipping Policy", path: "/shipping" }
            ]
        },
        {
            title: "Why Choose Us?",
            content: (
                <ul className="space-y-2">
                    {[
                        "100% Secure Payments",
                        "24/7 Customer Support",
                        "Instant Digital Delivery",
                        "Trusted by 20K+ Users",
                        "Hassle-free Replacements"
                    ].map((feature, index) => (
                        <motion.li 
                            key={index}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <CheckCircle className="text-green-500 mr-2 text-sm" />
                            <span className="text-gray-300 text-sm">{feature}</span>
                        </motion.li>
                    ))}
                </ul>
            )
        },
        {
            title: "Contact Us",
            content: (
                <>
                    <div className="space-y-2 mb-4">
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={index}
                                className="flex items-start space-x-2"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <span className="mt-1">{info.icon}</span>
                                <a 
                                    href={info.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-300 hover:text-yellow-400 text-sm transition-colors"
                                >
                                    {info.text}
                                </a>
                            </motion.div>
                        ))}
                    </div>
                    <motion.a 
                        href="https://wa.me/9779807677391"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-green-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                    >
                        <WhatsAppIcon className="mr-2" />
                        Chat on WhatsApp
                    </motion.a>
                </>
            )
        }
    ];

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white pt-16 pb-8 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                    {footerSections.map((section, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="space-y-4"
                        >
                            <h5 className="text-lg font-bold text-yellow-400">{section.title}</h5>
                            
                            {section.content}
                            
                            {section.links && (
                                <ul className="space-y-2">
                                    {section.links.map((link, linkIndex) => (
                                        <motion.li 
                                            key={linkIndex}
                                            whileHover={{ x: 5 }}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: linkIndex * 0.1 }}
                                        >
                                            <Link 
                                                to={link.path} 
                                                className="text-gray-300 hover:text-yellow-400 text-sm transition-colors"
                                                onClick={link.path.startsWith('/') ? scrollToTop : undefined}
                                                target={link.path.startsWith('http') ? '_blank' : undefined}
                                            >
                                                {link.name}
                                            </Link>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Footer Bottom */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="border-t border-gray-800 pt-6 text-center"
                >
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm mb-4 md:mb-0">
                            © {new Date().getFullYear()} Digital Shop Nepal. All Rights Reserved| Registered in Kathmandu, Nepal 
                        </p>
                        <div className="flex space-x-4">
                            <Link 
                                to="/privacy-policy" 
                                className="text-gray-400 hover:text-yellow-400 text-sm transition-colors"
                                onClick={scrollToTop}
                            >
                                Privacy Policy
                            </Link>
                            <Link 
                                to="/terms" 
                                className="text-gray-400 hover:text-yellow-400 text-sm transition-colors"
                                onClick={scrollToTop}
                            >
                                Terms of Service
                            </Link>
                            <Link 
                                to="/refund-policy" 
                                className="text-gray-400 hover:text-yellow-400 text-sm transition-colors"
                                onClick={scrollToTop}
                            >
                                Refund Policy
                            </Link>
                        </div>
                    </div>
                    {/* <motion.p 
                        className="text-gray-500 text-xs mt-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                    >
                        Designed with ❤️ by Digital Shop Nepal Team
                    </motion.p> */}
                </motion.div>

                {/* Back to Top Button - Only visible on large devices */}
                <motion.button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-full shadow-lg hover:shadow-orange-500/30 z-50 hidden md:block"
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    aria-label="Back to top"
                >
                    <ArrowUpward />
                </motion.button>
            </div>
        </footer>
    );
};

export default Footer;
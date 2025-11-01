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
} from "@mui/icons-material";
import { serifTheme } from "../../design-system/themes";

const Footer = () => {
    const navigate = useNavigate();


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
            icon: <Email className="text-amber-600" />,
            text: "digitalshopnepal@gmail.com",
            link: "mailto:digitalshopnepal@gmail.com"
        },
        {
            icon: <Phone className="text-amber-600" />,
            text: "+977 9807677391",
            link: "tel:+9779807677391"
        },
        {
            icon: <LocationOn className="text-amber-600" />,
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
                        className={`text-sm ${serifTheme.colors.text.secondary} mb-4`}
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
                            <CheckCircle className="text-green-600 mr-2 text-sm" />
                            <span className={`${serifTheme.colors.text.secondary} text-sm`}>{feature}</span>
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
                                    className={`${serifTheme.colors.text.secondary} hover:text-amber-800 text-sm ${serifTheme.transitions.default}`}
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
                        className={`inline-flex items-center ${serifTheme.colors.button.primary} ${serifTheme.colors.button.textPrimary} font-medium py-2 px-4 ${serifTheme.radius.button} ${serifTheme.transitions.default} ${serifTheme.colors.shadow.button}`}
                        whileHover={{ y: -2, scale: 1.02 }}
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
        <footer className={`${serifTheme.gradients.background} pt-16 pb-8 px-4 sm:px-6 relative overflow-hidden`} style={{ fontFamily: serifTheme.fontFamily.serif }}>
            {/* Background Elements - Serif Theme */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 ${serifTheme.gradients.overlay}`}></div>
                
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(180,83,9,0.2)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                </div>
                
                {/* Floating Orbs - Warm Amber/Orange Tones */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>
            <div className="max-w-7xl mx-auto relative z-10">
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
                            <h5 className={`text-lg font-bold ${serifTheme.colors.text.accent}`}>{section.title}</h5>
                            
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
                                                className={`${serifTheme.colors.text.secondary} hover:text-amber-800 text-sm ${serifTheme.transitions.default}`}
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
                    className={`border-t ${serifTheme.colors.border.primary} pt-6 text-center`}
                >
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className={`${serifTheme.colors.text.muted} text-sm mb-4 md:mb-0`}>
                            © {new Date().getFullYear()} Digital Shop Nepal. All Rights Reserved| Registered in Kathmandu, Nepal 
                        </p>
                        <div className="flex space-x-4">
                            <Link 
                                to="/privacy-policy" 
                                className={`${serifTheme.colors.text.muted} hover:text-amber-800 text-sm ${serifTheme.transitions.default}`}
                            >
                                Privacy Policy
                            </Link>
                            <Link 
                                to="/terms" 
                                className={`${serifTheme.colors.text.muted} hover:text-amber-800 text-sm ${serifTheme.transitions.default}`}
                            >
                                Terms of Service
                            </Link>
                            <Link 
                                to="/refund-policy" 
                                className={`${serifTheme.colors.text.muted} hover:text-amber-800 text-sm ${serifTheme.transitions.default}`}
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

            </div>
        </footer>
    );
};

export default Footer;
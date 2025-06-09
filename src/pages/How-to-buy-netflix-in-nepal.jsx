import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { HelmetProvider } from 'react-helmet-async';
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import SEOHelmet from "../components/SEO/SEOHelmet";
import OptimizedImage from "../components/SEO/OptimizedImage";
import NepalFAQ from "../components/SEO/NepalFAQ";
import Nepal from "./nepal";

const HowToBuyNetflixNepal = () => {
    const meta = {
        title: "How to Buy Netflix in Nepal 2024 - Complete Guide with Best Prices",
        description: "Complete guide on how to buy Netflix in Nepal 2024. Get Netflix premium subscription at best prices in NPR. Step-by-step guide for Kathmandu, Pokhara & all Nepal. eSewa, Khalti payment accepted. No VPN required.",
        keywords: "how to buy Netflix in Nepal, Netflix purchase guide Nepal, buy Netflix Nepal 2024, Netflix subscription Nepal, Netflix price Nepal, Netflix NPR, Netflix Kathmandu, Netflix Pokhara, eSewa Netflix Nepal, Khalti Netflix payment, Netflix without VPN Nepal, cheap Netflix Nepal, best Netflix price Nepal, Netflix account Nepal, streaming guide Nepal, digital subscription Nepal, Netflix payment methods Nepal",
        canonical: "https://www.digitalshopnepal.com/How-to-buy-netflix-in-nepal"
    };

    // Enhanced structured data for How-to Guide
    const howToStructuredData = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Buy Netflix in Nepal",
        "description": "Complete step-by-step guide to purchase Netflix subscription in Nepal with best prices and payment methods",
        "image": "https://digitalshopnepal.com/img/netflix.png",
        "totalTime": "PT10M",
        "estimatedCost": {
            "@type": "MonetaryAmount",
            "currency": "NPR",
            "value": "399"
        },
        "supply": [
            {
                "@type": "HowToSupply",
                "name": "Internet Connection"
            },
            {
                "@type": "HowToSupply",
                "name": "Payment Method (eSewa, Khalti, Bank Transfer)"
            },
            {
                "@type": "HowToSupply",
                "name": "Email Address"
            }
        ],
        "tool": [
            {
                "@type": "HowToTool",
                "name": "Computer or Mobile Device"
            },
            {
                "@type": "HowToTool",
                "name": "Digital Wallet (eSewa/Khalti)"
            }
        ],
        "step": [
            {
                "@type": "HowToStep",
                "position": 1,
                "name": "Visit Digital Shop Nepal",
                "text": "Go to digitalshopnepal.com and browse Netflix subscription plans",
                "url": "https://digitalshopnepal.com/NetflixNepal"
            },
            {
                "@type": "HowToStep",
                "position": 2,
                "name": "Choose Your Plan",
                "text": "Select from monthly (NPR 399), 3-month (NPR 1,169), 6-month (NPR 2,300), or yearly (NPR 4,499) plans"
            },
            {
                "@type": "HowToStep",
                "position": 3,
                "name": "Add to Cart",
                "text": "Add your selected Netflix plan to the shopping cart"
            },
            {
                "@type": "HowToStep",
                "position": 4,
                "name": "Make Payment",
                "text": "Pay using eSewa, Khalti, IME Pay, or bank transfer. All payments in NPR"
            },
            {
                "@type": "HowToStep",
                "position": 5,
                "name": "Contact for Delivery",
                "text": "Contact us at +9779807677391 or digitalshopnepalstore@gmail.com for instant account delivery"
            },
            {
                "@type": "HowToStep",
                "position": 6,
                "name": "Start Streaming",
                "text": "Receive your Netflix account details and start streaming immediately. No VPN required in Nepal"
            }
        ],
        "author": {
            "@type": "Organization",
            "name": "Digital Shop Nepal",
            "url": "https://digitalshopnepal.com"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Digital Shop Nepal",
            "logo": {
                "@type": "ImageObject",
                "url": "https://digitalshopnepal.com/img/digital.jpg"
            }
        }
    };

    const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Guides", url: "/guides" },
        { name: "How to Buy Netflix in Nepal", url: "/How-to-buy-netflix-in-nepal", isLast: true }
    ];

    return (
        <HelmetProvider>
            <SEOHelmet
                title={meta.title}
                description={meta.description}
                keywords={meta.keywords}
                canonical={meta.canonical}
                structuredData={howToStructuredData}
                breadcrumbs={breadcrumbs}
                ogType="article"
            />
            <Layout showBreadcrumb={true} customBreadcrumbs={breadcrumbs}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-screen bg-gradient-to-b from-black via-blue-900 to-black p-8 text-white relative"
                >
                    {/* Hero Background Image */}
                    <div className="absolute inset-0 z-0">
                        <OptimizedImage
                            src="/img/netflix.png"
                            alt="How to Buy Netflix in Nepal Guide Background"
                            className="w-full h-full opacity-10"
                            priority={true}
                        />
                    </div>

                    {/* Content Section */}
                    <div className="relative z-10">
                        {/* Enhanced Hero Section */}
                        <motion.section
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="text-center p-10"
                        >
                            <motion.h1
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-red-600 mb-6"
                            >
                                How to Buy Netflix in Nepal 2024
                            </motion.h1>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
                            >
                                Complete step-by-step guide to buy Netflix subscription in Nepal at best prices!
                                Available in Kathmandu, Pokhara & all Nepal. Pay with eSewa, Khalti, or bank transfer.
                                No VPN required - start streaming immediately!
                            </motion.p>

                            {/* Quick Stats */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-3xl mx-auto"
                            >
                                <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700/30">
                                    <div className="text-2xl font-bold text-cyan-400">NPR 399</div>
                                    <div className="text-sm text-gray-300">Starting Price</div>
                                </div>
                                <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700/30">
                                    <div className="text-2xl font-bold text-green-400">5 Min</div>
                                    <div className="text-sm text-gray-300">Instant Delivery</div>
                                </div>
                                <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700/30">
                                    <div className="text-2xl font-bold text-yellow-400">No VPN</div>
                                    <div className="text-sm text-gray-300">Required</div>
                                </div>
                            </motion.div>
                        </motion.section>

                        {/* Enhanced Subscription Plans Section */}
                        <motion.section
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="my-16 max-w-6xl mx-auto"
                        >
                            <motion.h2
                                initial={{ y: -20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-4xl font-bold text-center mb-12 text-white"
                            >
                                Netflix Subscription Plans in Nepal
                            </motion.h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Monthly Plan */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-xl p-6 border border-gray-700/30 hover:border-cyan-500/50 transition-all duration-300"
                                >
                                    <div className="text-center">
                                        <h3 className="text-xl font-semibold text-cyan-400 mb-2">Monthly</h3>
                                        <div className="text-3xl font-bold text-white mb-2">NPR 399</div>
                                        <p className="text-gray-300 text-sm mb-4">Perfect for trying out</p>
                                        <div className="flex items-center justify-center text-green-400 text-sm">
                                            <CheckCircleOutlineIcon className="w-4 h-4 mr-1" />
                                            Instant activation
                                        </div>
                                    </div>
                                </motion.div>

                                {/* 3 Months Plan */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    viewport={{ once: true }}
                                    className="bg-gradient-to-br from-blue-800/80 to-blue-900/80 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300"
                                >
                                    <div className="text-center">
                                        <h3 className="text-xl font-semibold text-blue-400 mb-2">3 Months</h3>
                                        <div className="text-3xl font-bold text-white mb-2">NPR 1,169</div>
                                        <p className="text-gray-300 text-sm mb-4">Save NPR 28</p>
                                        <div className="flex items-center justify-center text-green-400 text-sm">
                                            <CheckCircleOutlineIcon className="w-4 h-4 mr-1" />
                                            Popular choice
                                        </div>
                                    </div>
                                </motion.div>

                                {/* 6 Months Plan */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    viewport={{ once: true }}
                                    className="bg-gradient-to-br from-purple-800/80 to-purple-900/80 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300"
                                >
                                    <div className="text-center">
                                        <h3 className="text-xl font-semibold text-purple-400 mb-2">6 Months</h3>
                                        <div className="text-3xl font-bold text-white mb-2">NPR 2,300</div>
                                        <p className="text-gray-300 text-sm mb-4">Save NPR 94</p>
                                        <div className="flex items-center justify-center text-green-400 text-sm">
                                            <CheckCircleOutlineIcon className="w-4 h-4 mr-1" />
                                            Great value
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Yearly Plan */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    viewport={{ once: true }}
                                    className="bg-gradient-to-br from-green-800/80 to-green-900/80 backdrop-blur-xl rounded-xl p-6 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 relative"
                                >
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-green-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                                            BEST VALUE
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-semibold text-green-400 mb-2">Yearly</h3>
                                        <div className="text-3xl font-bold text-white mb-2">NPR 4,499</div>
                                        <p className="text-gray-300 text-sm mb-4">Save NPR 289</p>
                                        <div className="flex items-center justify-center text-green-400 text-sm">
                                            <CheckCircleOutlineIcon className="w-4 h-4 mr-1" />
                                            Maximum savings
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.section>

                        {/* Enhanced Step-by-Step Guide Section */}
                        <motion.section
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="my-16 max-w-6xl mx-auto"
                        >
                            <motion.h2
                                initial={{ y: -20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-4xl font-bold text-center mb-12 text-white"
                            >
                                Step-by-Step Guide to Buy Netflix in Nepal
                            </motion.h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {/* Step 1 */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-gradient-to-br from-blue-800/50 to-blue-900/50 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30"
                                >
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">1</div>
                                        <h3 className="text-xl font-semibold text-blue-400 mb-3">Visit Our Website</h3>
                                        <p className="text-gray-300 text-sm">
                                            Go to <span className="text-cyan-400">digitalshopnepal.com</span> and browse our Netflix subscription plans
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Step 2 */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    viewport={{ once: true }}
                                    className="bg-gradient-to-br from-green-800/50 to-green-900/50 backdrop-blur-xl rounded-xl p-6 border border-green-500/30"
                                >
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">2</div>
                                        <h3 className="text-xl font-semibold text-green-400 mb-3">Choose Your Plan</h3>
                                        <p className="text-gray-300 text-sm">
                                            Select from monthly (NPR 399) to yearly (NPR 4,499) plans based on your needs
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Step 3 */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    viewport={{ once: true }}
                                    className="bg-gradient-to-br from-purple-800/50 to-purple-900/50 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30"
                                >
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">3</div>
                                        <h3 className="text-xl font-semibold text-purple-400 mb-3">Make Payment</h3>
                                        <p className="text-gray-300 text-sm">
                                            Pay using eSewa, Khalti, IME Pay, or bank transfer. All payments in NPR
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Step 4 */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    viewport={{ once: true }}
                                    className="bg-gradient-to-br from-yellow-800/50 to-yellow-900/50 backdrop-blur-xl rounded-xl p-6 border border-yellow-500/30"
                                >
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">4</div>
                                        <h3 className="text-xl font-semibold text-yellow-400 mb-3">Contact Us</h3>
                                        <p className="text-gray-300 text-sm">
                                            Call +977 980-767-7391 or email us for instant account delivery
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Step 5 */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    viewport={{ once: true }}
                                    className="bg-gradient-to-br from-red-800/50 to-red-900/50 backdrop-blur-xl rounded-xl p-6 border border-red-500/30"
                                >
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">5</div>
                                        <h3 className="text-xl font-semibold text-red-400 mb-3">Get Account</h3>
                                        <p className="text-gray-300 text-sm">
                                            Receive your Netflix login details within 5-10 minutes via email or WhatsApp
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Step 6 */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                    viewport={{ once: true }}
                                    className="bg-gradient-to-br from-cyan-800/50 to-cyan-900/50 backdrop-blur-xl rounded-xl p-6 border border-cyan-500/30"
                                >
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">6</div>
                                        <h3 className="text-xl font-semibold text-cyan-400 mb-3">Start Streaming</h3>
                                        <p className="text-gray-300 text-sm">
                                            Login to Netflix and enjoy unlimited streaming. No VPN required in Nepal!
                                        </p>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Payment Methods Section */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                viewport={{ once: true }}
                                className="mt-12 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl p-8 border border-gray-700/30"
                            >
                                <h3 className="text-2xl font-bold text-center text-white mb-6">
                                    Accepted Payment Methods in Nepal
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                                    <div className="bg-green-600/20 rounded-lg p-4 border border-green-500/30">
                                        <div className="text-green-400 font-semibold">eSewa</div>
                                    </div>
                                    <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-500/30">
                                        <div className="text-purple-400 font-semibold">Khalti</div>
                                    </div>
                                    <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-500/30">
                                        <div className="text-blue-400 font-semibold">IME Pay</div>
                                    </div>
                                    <div className="bg-yellow-600/20 rounded-lg p-4 border border-yellow-500/30">
                                        <div className="text-yellow-400 font-semibold">Bank Transfer</div>
                                    </div>
                                    <div className="bg-red-600/20 rounded-lg p-4 border border-red-500/30">
                                        <div className="text-red-400 font-semibold">Cash Payment</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.section>

                        {/* Nepal-specific FAQ Section */}
                        <NepalFAQ service="netflix" />

                        <Nepal />

                        {/* Enhanced Footer Section */}
                        <motion.footer
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-center mt-16 py-8 border-t border-gray-700/30"
                        >
                            <div className="max-w-4xl mx-auto">
                                <h3 className="text-xl font-semibold text-white mb-4">
                                    Ready to Buy Netflix in Nepal?
                                </h3>
                                <p className="text-gray-300 mb-6">
                                    Get your Netflix subscription today and start streaming your favorite content!
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                                    <a
                                        href="tel:+9779807677391"
                                        className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                                    >
                                        📞 Call: +977 980-767-7391
                                    </a>
                                    <a
                                        href="mailto:digitalshopnepalstore@gmail.com"
                                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                                    >
                                        ✉️ Email: digitalshopnepalstore@gmail.com
                                    </a>
                                </div>
                                <p className="text-gray-500 text-sm">
                                    &copy; 2024 How to Buy Netflix in Nepal - Digital Shop Nepal. All Rights Reserved.
                                </p>
                            </div>
                        </motion.footer>
                    </div>
                </motion.div>
            </Layout>
        </HelmetProvider>
    );
};

export default HowToBuyNetflixNepal;

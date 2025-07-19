import React from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { 
  CheckCircleOutline as CheckIcon,
  Devices as DevicesIcon,
  HighQuality as QualityIcon,
  Lock as LockIcon,
  Autorenew as RenewIcon,
  Security as SecurityIcon,
  Public as NoVpnIcon,
  LocalMovies as MoviesIcon,
  Discount as DiscountIcon,
  Support as SupportIcon,
  TheaterComedy as OriginalsIcon,
  Subscriptions as SubscriptionIcon
} from '@mui/icons-material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Layout from "../components/layout/Layout";
import SEOHelmet from "../components/SEO/SEOHelmet";
import OptimizedImage from "../components/SEO/OptimizedImage";
import Nepal from "./nepal";
import { nepalSEOKeywords, generateNepalMetaDescription, generateNepalTitle, generateNepalProductSchema } from "../utils/nepalSEOKeywords";

const AltBalajiNepal = () => {
    // Dynamic Nepal SEO using the utility functions
    const serviceName = "AltBalaji";
    const seoFeatures = ["Indian web series", "Original content", "HD streaming", "No VPN required"];
    
    const meta = {
        title: generateNepalTitle(serviceName, "subscription"),
        description: generateNepalMetaDescription("altBalaji", seoFeatures),
        keywords: nepalSEOKeywords.altBalaji.join(", "),
        canonical: "https://www.digitalshopnepal.com/AltBalajiNepal"
    };

    const pricingPlans = [
        { duration: "1 Month", price: "Rs. 199" },
        { duration: "3 Months", price: "Rs. 549", discount: "Save 8%" },
        { duration: "6 Months", price: "Rs. 999", discount: "Save 16%" },
        { duration: "1 Year", price: "Rs. 1,799", discount: "Save 25%" }
    ];

    const features = [
        { icon: <OriginalsIcon className="text-purple-500" />, text: "Exclusive Indian originals not available elsewhere" },
        { icon: <LockIcon className="text-purple-500" />, text: "Private profile with secure access" },
        { icon: <QualityIcon className="text-purple-500" />, text: "HD Streaming: Enjoy high-quality content" },
        { icon: <RenewIcon className="text-purple-500" />, text: "Easy renewal without losing your watch history" },
        { icon: <SecurityIcon className="text-purple-500" />, text: "100% secure accounts with login credentials" },
        { icon: <NoVpnIcon className="text-purple-500" />, text: "No VPN required - works directly in Nepal" }
    ];

    const benefits = [
        { icon: <OriginalsIcon />, text: "Exclusive access to Indian original series" },
        { icon: <QualityIcon />, text: "HD streaming for best viewing experience" },
        { icon: <SubscriptionIcon />, text: "Multiple subscription plans to choose from" },
        { icon: <RenewIcon />, text: "Seamless subscription renewals" },
        { icon: <NoVpnIcon />, text: "Works in Nepal without any VPN" },
        { icon: <SupportIcon />, text: "24/7 dedicated customer support" },
        { icon: <DiscountIcon />, text: "Special discounts on long-term plans" },
        { icon: <MoviesIcon />, text: "Unlimited access to AltBalaji's entire library" }
    ];

    const rules = [
        "Use only the provided profile for streaming",
        "Do not change the account email or password",
        "Avoid simultaneous logins from multiple devices",
        "Contact support for any account-related issues"
    ];

    // Generate dynamic structured data using Nepal SEO utilities
    const altBalajiStructuredData = generateNepalProductSchema(serviceName, "199", "NPR");

    const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Subscriptions", url: "/subscription" },
        { name: "AltBalaji Nepal", url: "/AltBalajiNepal", isLast: true }
    ];

    return (
        <HelmetProvider>
            <SEOHelmet
                title={meta.title}
                description={meta.description}
                keywords={meta.keywords}
                canonical={meta.canonical}
                structuredData={altBalajiStructuredData}
                breadcrumbs={breadcrumbs}
                ogType="product"
            />
            <Layout showBreadcrumb={true} customBreadcrumbs={breadcrumbs}>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white"
                >
                    {/* Hero Section */}
                    <div className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/60 z-0"></div>
                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="text-center"
                            >
                                <h1 className="text-4xl md:text-5xl font-bold text-purple-500 mb-6">
                                    AltBalaji Nepal Subscription
                                </h1>
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                    Premium Indian content with HD quality. No VPN required. Private profile with secure access.
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        {/* Features Section */}
                        <motion.section 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="mb-16"
                        >
                            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Our AltBalaji Subscription?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ y: -5 }}
                                        className="bg-gray-800/50 p-6 rounded-lg border border-gray-700"
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                {feature.icon}
                                            </div>
                                            <p className="text-gray-300">{feature.text}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Pricing Section */}
                        <motion.section
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="mb-16"
                        >
                            <h2 className="text-3xl font-bold mb-8 text-center">Subscription Plans</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {pricingPlans.map((plan, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.03 }}
                                        className={`bg-gradient-to-br ${index % 2 === 0 ? 'from-gray-800 to-gray-900' : 'from-purple-900/80 to-gray-900'} rounded-xl p-6 shadow-lg border border-gray-700`}
                                    >
                                        <h3 className="text-xl font-bold mb-2">{plan.duration}</h3>
                                        <p className="text-2xl font-bold mb-2">{plan.price}</p>
                                        {plan.discount && (
                                            <p className="text-green-400 text-sm mb-4">{plan.discount}</p>
                                        )}
                                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition duration-300">
                                            Get Now
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Accordion Sections */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="max-w-4xl mx-auto space-y-4"
                        >
                            <Accordion className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon className="text-white" />}
                                    className="hover:bg-gray-700/50 transition"
                                >
                                    <h2 className="text-xl font-semibold">Subscription Benefits</h2>
                                </AccordionSummary>
                                <AccordionDetails className="bg-gray-900/50">
                                    <ul className="space-y-3">
                                        {benefits.map((benefit, index) => (
                                            <li key={index} className="flex items-start space-x-3">
                                                <span className="text-purple-500 mt-1">{benefit.icon}</span>
                                                <span className="text-gray-300">{benefit.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon className="text-white" />}
                                    className="hover:bg-gray-700/50 transition"
                                >
                                    <h2 className="text-xl font-semibold">How to Use</h2>
                                </AccordionSummary>
                                <AccordionDetails className="bg-gray-900/50">
                                    <p className="text-gray-300 mb-4">
                                        After subscribing, you'll receive login credentials to access AltBalaji's premium content. Stream instantly on your preferred device.
                                    </p>
                                    <ul className="space-y-2 text-gray-300">
                                        <li className="flex items-start">
                                            <CheckIcon className="text-green-500 mr-2 mt-1" />
                                            <span>For mobile and tablet: Download the AltBalaji app and login</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckIcon className="text-green-500 mr-2 mt-1" />
                                            <span>For web: Visit the AltBalaji website and sign in</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckIcon className="text-green-500 mr-2 mt-1" />
                                            <span>For TV: Use casting or contact support for assistance</span>
                                        </li>
                                    </ul>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon className="text-white" />}
                                    className="hover:bg-gray-700/50 transition"
                                >
                                    <h2 className="text-xl font-semibold">Rules to Follow</h2>
                                </AccordionSummary>
                                <AccordionDetails className="bg-gray-900/50">
                                    <ul className="space-y-2">
                                        {rules.map((rule, index) => (
                                            <li key={index} className="flex items-start">
                                                <CheckIcon className="text-purple-500 mr-2 mt-1" />
                                                <span className="text-gray-300">{rule}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionDetails>
                            </Accordion>
                        </motion.div>

                        {/* Nepal Component */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            viewport={{ once: true }}
                            className="mt-16"
                        >
                            <Nepal />
                        </motion.div>
                    </div>

                    {/* Footer */}
                    <footer className="bg-black/50 py-8 text-center text-gray-400">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <p>&copy; {new Date().getFullYear()} Digital Shop Nepal. All Rights Reserved.</p>
                        </div>
                    </footer>
                </motion.div>
            </Layout>
        </HelmetProvider>
    );
};

export default AltBalajiNepal;
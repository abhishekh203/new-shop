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
  Support as SupportIcon
} from '@mui/icons-material';
import { HelmetProvider } from 'react-helmet-async';
import Layout from "../components/layout/Layout";
import SEOHelmet from "../components/SEO/SEOHelmet";
import Nepal from "./nepal";

const NetflixNepal = () => {
    const meta = {
        title: "Netflix Nepal - Premium Subscription at Best Prices in NPR",
        description: "Get Netflix premium subscription in Nepal at best prices. Stream unlimited movies & TV shows in Kathmandu, Pokhara & all Nepal. No VPN required, instant delivery, NPR pricing, local support available.",
        keywords: "Netflix Nepal, Netflix subscription Nepal, buy Netflix Nepal, Netflix premium Nepal, Netflix account Nepal, watch Netflix Nepal, Netflix price Nepal, Netflix NPR, Netflix Kathmandu, Netflix Pokhara, Netflix streaming Nepal, how to get Netflix in Nepal, Netflix without VPN Nepal, Netflix family plan Nepal, cheap Netflix Nepal, affordable Netflix Nepal, best Netflix price Nepal, Netflix subscription service Nepal, digital subscription Nepal",
        canonical: "https://www.digitalshopnepal.com/NetflixNepal"
    };

    const pricingPlans = [
        { duration: "1 Month", price: "Rs. 399" },
        { duration: "3 Months", price: "Rs. 1,169", discount: "Save 2%" },
        { duration: "6 Months", price: "Rs. 2,300", discount: "Save 4%" },
        { duration: "1 Year", price: "Rs. 4,499", discount: "Save 6%" }
    ];

    const features = [
        { icon: <DevicesIcon className="text-red-500" />, text: "1 Screen means only 1 user but private profile" },
        { icon: <LockIcon className="text-red-500" />, text: "Pin-Locked Profile: A secure profile protected with a PIN" },
        { icon: <QualityIcon className="text-red-500" />, text: "Ultra HD Streaming: Experience high-quality streaming" },
        { icon: <RenewIcon className="text-red-500" />, text: "Easily renew your account without losing settings" },
        { icon: <SecurityIcon className="text-red-500" />, text: "100% secure accounts, delivered with Email ID and Password" },
        { icon: <NoVpnIcon className="text-red-500" />, text: "No VPN required for any country" }
    ];

    const benefits = [
        { icon: <DevicesIcon />, text: "One Screen Access: Stream content on one device at a time" },
        { icon: <QualityIcon />, text: "Ultra HD for an immersive viewing experience" },
        { icon: <LockIcon />, text: "Secure PIN-locked profile" },
        { icon: <RenewIcon />, text: "Seamless subscription renewals" },
        { icon: <NoVpnIcon />, text: "Works in Nepal without VPN" },
        { icon: <SupportIcon />, text: "Dedicated support for account-related issues" },
        { icon: <DiscountIcon />, text: "Access to promotions and discounts" },
        { icon: <MoviesIcon />, text: "Unlimited access to Netflix's entire library" }
    ];

    const rules = [
        "Use only the provided profile to ensure smooth streaming",
        "Do not change the account email or password",
        "Do not add a mobile number to the account settings",
        "Log out from the current device before logging in on another"
    ];

    const netflixStructuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Netflix Premium Subscription Nepal",
        "description": "Premium Netflix subscription for Nepal with Ultra HD streaming, no VPN required. Available in Kathmandu, Pokhara and all major cities of Nepal.",
        "brand": {
            "@type": "Brand",
            "name": "Netflix"
        },
        "offers": [
            {
                "@type": "Offer",
                "name": "1 Month Netflix Nepal",
                "price": "399",
                "priceCurrency": "NPR",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2024-12-31",
                "seller": {
                    "@type": "Organization",
                    "name": "Digital Shop Nepal",
                    "address": {
                        "@type": "PostalAddress",
                        "addressCountry": "NP",
                        "addressLocality": "Kathmandu",
                        "addressRegion": "Bagmati Province"
                    }
                },
                "areaServed": {
                    "@type": "Country",
                    "name": "Nepal"
                },
                "eligibleRegion": {
                    "@type": "Country",
                    "name": "Nepal"
                }
            },
            {
                "@type": "Offer",
                "name": "3 Months Netflix Nepal",
                "price": "1169",
                "priceCurrency": "NPR",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2024-12-31"
            },
            {
                "@type": "Offer",
                "name": "1 Year Netflix Nepal",
                "price": "4499",
                "priceCurrency": "NPR",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2024-12-31"
            }
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "150"
        },
        "category": "Digital Subscription Services",
        "audience": {
            "@type": "Audience",
            "geographicArea": {
                "@type": "Country",
                "name": "Nepal"
            }
        }
    };

    const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Subscriptions", url: "/subscription" },
        { name: "Netflix Nepal", url: "/NetflixNepal", isLast: true }
    ];

    return (
        <HelmetProvider>
            <SEOHelmet
                title={meta.title}
                description={meta.description}
                keywords={meta.keywords}
                canonical={meta.canonical}
                structuredData={netflixStructuredData}
                breadcrumbs={breadcrumbs}
                ogType="product"
            />
            <Layout showBreadcrumb={true} customBreadcrumbs={breadcrumbs}>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white"
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
                                <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-6">
                                    Netflix Nepal Subscription
                                </h1>
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                    Premium streaming with Ultra HD quality. No VPN required. Private profile with PIN protection.
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
                            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Our Netflix Subscription?</h2>
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
                                        className={`bg-gradient-to-br ${index % 2 === 0 ? 'from-gray-800 to-gray-900' : 'from-red-900/80 to-gray-900'} rounded-xl p-6 shadow-lg border border-gray-700`}
                                    >
                                        <h3 className="text-xl font-bold mb-2">{plan.duration}</h3>
                                        <p className="text-2xl font-bold mb-2">{plan.price}</p>
                                        {plan.discount && (
                                            <p className="text-green-400 text-sm mb-4">{plan.discount}</p>
                                        )}
                                        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-300">
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
                                                <span className="text-red-500 mt-1">{benefit.icon}</span>
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
                                        After subscribing, you'll receive a personal account under our shared subscription. You can start watching instantly.
                                    </p>
                                    <ul className="space-y-2 text-gray-300">
                                        <li className="flex items-start">
                                            <CheckIcon className="text-green-500 mr-2 mt-1" />
                                            <span>For mobile, laptop, or tablet access, follow the instructions sent to your email</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckIcon className="text-green-500 mr-2 mt-1" />
                                            <span>For TV, sign in using a provided code or by contacting us for support</span>
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
                                                <CheckIcon className="text-red-500 mr-2 mt-1" />
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

export default NetflixNepal;
import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { HelmetProvider } from 'react-helmet-async';
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import SEOHelmet from "../components/SEO/SEOHelmet";
import OptimizedImage from "../components/SEO/OptimizedImage";
import Nepal from "./nepal";

const Zee5Nepal = () => {
    const meta = {
        title: "Zee5 Nepal - Watch Zee5 Shows & Movies Online",
        description: "Dive into the world of Zee5 in Nepal and enjoy your favorite shows, movies, and original content. With a subscription, stream a wide array of regional and international content anytime, anywhere, on your preferred device.",
        keywords: "Zee5 Nepal, zee5 subscription nepal, Watch Zee5 online Nepal, Zee5 shows, Zee5 movies",
        canonical: "https://www.digitalshopnepal.com/Zee5Nepal"
    };

    const zee5StructuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Zee5 Premium Subscription Nepal",
        "description": "Premium Zee5 subscription for Nepal with unlimited shows, movies, and original content",
        "brand": {
            "@type": "Brand",
            "name": "Zee5"
        },
        "offers": {
            "@type": "Offer",
            "priceCurrency": "NPR",
            "price": "999",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "Digital Shop Nepal"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.4",
            "reviewCount": "65"
        }
    };

    const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Subscriptions", url: "/subscription" },
        { name: "Zee5 Nepal", url: "/Zee5Nepal", isLast: true }
    ];

    return (
        <HelmetProvider>
            <SEOHelmet
                title={meta.title}
                description={meta.description}
                keywords={meta.keywords}
                canonical={meta.canonical}
                structuredData={zee5StructuredData}
                breadcrumbs={breadcrumbs}
                ogType="product"
            />
            <Layout showBreadcrumb={true} customBreadcrumbs={breadcrumbs}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-screen bg-gradient-to-b from-black via-yellow-900 to-black p-8 text-white relative"
                >
                    <div className="absolute inset-0 z-0">
                        <OptimizedImage
                            src="/img/zee5.png"
                            alt="Zee5 Nepal Background"
                            className="w-full h-full opacity-10"
                            priority={true}
                        />
                    </div>

                    <div className="relative z-10">
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
                                className="text-5xl md:text-6xl font-bold text-yellow-400 mb-6"
                            >
                                Zee5 Nepal
                            </motion.h1>
                            <p className="text-xl text-gray-300 text-justify w-full leading-relaxed">
                                Dive into the world of Zee5 in Nepal and enjoy your favorite shows, movies, and original content. With a subscription, stream a wide array of regional and international content anytime, anywhere, on your preferred device.
                            </p>
                            <ul className="text-gray-400 list-disc list-inside text-left mt-8 max-w-3xl mx-auto">
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    No VPN required for access in Nepal.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    High-definition streaming for a superior viewing experience.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    Extensive library of Zee5 Originals and popular content.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    Multi-device support for streaming on your preferred screens.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    Affordable subscription plans available.
                                </li>
                            </ul>
                        </motion.section>

                        {/* Accordion Sections */}
                        <div className="my-8 max-w-4xl mx-auto">
                            {/* Description Section */}
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    className="bg-gray-800 text-white hover:bg-gray-700 transition duration-300"
                                >
                                    <h2 className="text-lg font-semibold">Description</h2>
                                </AccordionSummary>
                                <AccordionDetails className="bg-gray-900 shadow-md border-t border-gray-700 transition-all">
                                    <p className="text-gray-300">
                                        A Zee5 subscription offers access to a wide range of shows, movies, and exclusive content tailored for Nepal. Enjoy seamless streaming without interruptions and explore genres from drama to action, all in one place.
                                    </p>
                                    <ul className="text-gray-400 list-disc list-inside mt-3">
                                        <p className="mt-3 text-white"><strong>Subscription Validity and Pricing:</strong></p>
                                        <li>Yearly Subscription: NPR 1,299</li>
                                    </ul>
                                </AccordionDetails>
                            </Accordion>

                            {/* Subscription Benefits Section */}
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    className="bg-gray-800 text-white hover:bg-gray-700 transition duration-300"
                                >
                                    <h2 className="text-lg font-semibold">Subscription Benefits</h2>
                                </AccordionSummary>
                                <AccordionDetails className="bg-gray-900 shadow-md border-t border-gray-700 transition-all">
                                    <ul className="text-gray-400 list-disc list-inside">
                                        <li>Access to a wide variety of shows and movies.</li>
                                        <li>High-definition streaming for an immersive experience.</li>
                                        <li>Download content for offline viewing.</li>
                                        <li>Multi-device compatibility for your convenience.</li>
                                        <li>Dedicated support for account-related inquiries.</li>
                                    </ul>
                                </AccordionDetails>
                            </Accordion>

                            {/* How to Use Section */}
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    className="bg-gray-800 text-white hover:bg-gray-700 transition duration-300"
                                >
                                    <h2 className="text-lg font-semibold">How to Use</h2>
                                </AccordionSummary>
                                <AccordionDetails className="bg-gray-900 shadow-md border-t border-gray-700 transition-all">
                                    <p className="text-gray-300">
                                        After subscribing, you will receive an email with your account details. Simply log in to start streaming your favorite content instantly. Ensure your app is up to date for the best performance.
                                    </p>
                                    <ul className="text-gray-400 list-disc list-inside mt-2">
                                        <li>Download the Zee5 app from your app store for mobile or tablet access.</li>
                                        <li>For TV, sign in using the provided credentials or access via smart TV apps.</li>
                                    </ul>
                                </AccordionDetails>
                            </Accordion>

                            {/* Rules Section */}
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    className="bg-gray-800 text-white hover:bg-gray-700 transition duration-300"
                                >
                                    <h2 className="text-lg font-semibold">Rules to Follow</h2>
                                </AccordionSummary>
                                <AccordionDetails className="bg-gray-900 shadow-md border-t border-gray-700 transition-all">
                                    <ul className="text-gray-400 list-disc list-inside">
                                        <li>Do not share your account information with others.</li>
                                        <li>Ensure you log out from public or shared devices.</li>
                                        <li>Keep your account details confidential for security.</li>
                                        <li>Use supported devices for optimal streaming experience.</li>
                                    </ul>
                                </AccordionDetails>
                            </Accordion>
                        </div>

                        <Nepal />

                        {/* Footer Section */}
                        <footer className="text-center mt-16 text-gray-500">
                            <p>&copy; 2024 Zee5 Nepal. All Rights Reserved.</p>
                        </footer>
                    </div>
                </motion.div>
            </Layout>
        </HelmetProvider>
    );
};

export default Zee5Nepal;

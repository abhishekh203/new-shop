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
import { nepalSEOKeywords, generateNepalMetaDescription, generateNepalTitle, generateNepalProductSchema } from "../utils/nepalSEOKeywords";

const PrimeVideoNepal = () => {
    // Dynamic Nepal SEO using the utility functions
    const serviceName = "Prime Video";
    const seoFeatures = ["Movies streaming", "TV shows", "Amazon Originals", "Ultra HD"];
    
    const meta = {
        title: generateNepalTitle(serviceName, "subscription"),
        description: generateNepalMetaDescription("primeVideo", seoFeatures),
        keywords: nepalSEOKeywords.primeVideo.join(", "),
        canonical: "https://www.digitalshopnepal.com/PrimeVideoNepal"
    };

    const primeVideoStructuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Amazon Prime Video Subscription Nepal",
        "description": "Premium Amazon Prime Video subscription for Nepal with unlimited streaming, offline downloads, and exclusive content",
        "brand": {
            "@type": "Brand",
            "name": "Amazon Prime Video"
        },
        "offers": [
            {
                "@type": "Offer",
                "name": "Monthly Subscription",
                "priceCurrency": "NPR",
                "price": "199",
                "availability": "https://schema.org/InStock"
            },
            {
                "@type": "Offer",
                "name": "3 Months Subscription",
                "priceCurrency": "NPR",
                "price": "399",
                "availability": "https://schema.org/InStock"
            },
            {
                "@type": "Offer",
                "name": "6 Months Subscription",
                "priceCurrency": "NPR",
                "price": "599",
                "availability": "https://schema.org/InStock"
            },
            {
                "@type": "Offer",
                "name": "Yearly Subscription",
                "priceCurrency": "NPR",
                "price": "1099",
                "availability": "https://schema.org/InStock"
            }
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.6",
            "reviewCount": "95"
        }
    };

    const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Subscriptions", url: "/subscription" },
        { name: "Prime Video Nepal", url: "/PrimeVideoNepal", isLast: true }
    ];

    return (
        <HelmetProvider>
            <SEOHelmet
                title={meta.title}
                description={meta.description}
                keywords={meta.keywords}
                canonical={meta.canonical}
                structuredData={primeVideoStructuredData}
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
                    {/* Hero Background Image */}
                    <div className="absolute inset-0 z-0">
                        <OptimizedImage
                            src="/img/hero.png"
                            alt="Prime Video Nepal Background"
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
                                className="text-5xl md:text-6xl font-bold text-yellow-500 mb-6"
                            >
                                Prime Video Nepal
                            </motion.h1>
                            <p className="text-xl text-gray-300 text-justify w-full leading-relaxed">
                                Enjoy unlimited streaming of movies and TV shows with Amazon Prime Video in Nepal. With our affordable subscription, you can access thousands of titles, including exclusive Amazon Originals, all in stunning picture quality. Stream your favorite content on multiple devices anytime, anywhere.
                            </p>
                            <ul className="text-gray-400 list-disc list-inside text-left mt-8 max-w-3xl mx-auto">
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-yellow-500 mr-2" />
                                    Access to exclusive Amazon Originals and popular movies.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-yellow-500 mr-2" />
                                    Watch on multiple devices: TV, mobile, tablet, and PC.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-yellow-500 mr-2" />
                                    Download content for offline viewing anytime, anywhere.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-yellow-500 mr-2" />
                                    Enjoy high-quality streaming with no interruptions.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-yellow-500 mr-2" />
                                    100% secure accounts, delivered with Email ID and Password.
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
                                        With an Amazon Prime Video subscription in Nepal, you can enjoy a vast library of movies, TV shows, and exclusive content. The subscription allows streaming on multiple devices, and you can download your favorite titles for offline viewing. Experience a seamless and enjoyable streaming experience with no ads.
                                    </p>
                                    <ul className="text-gray-400 list-disc list-inside mt-3">
                                        <p className="mt-3 text-white"><strong>Subscription Validity and Pricing:</strong></p>
                                        <li>Monthly Subscription: Rs. 199</li>
                                        <li>3 Months Subscription: Rs. 399</li>
                                        <li>6 Months Subscription: Rs. 599</li>
                                        <li>Yearly Subscription: Rs. 1099</li>
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
                                        <li>Unlimited access to movies, TV shows, and Amazon Originals.</li>
                                        <li>Download content for offline viewing.</li>
                                        <li>Watch on multiple devices: smart TVs, smartphones, tablets, and PCs.</li>
                                        <li>High-quality streaming with no ads.</li>
                                        <li>Access to exclusive promotions and discounts.</li>
                                        <li>Dedicated support for account-related issues.</li>
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
                                        After subscribing, you will receive an email with your account details. You can sign in on the Prime Video app available on mobile, desktop, or tablet. Start streaming your favorite movies and TV shows instantly, or download content for offline viewing.
                                    </p>
                                    <ul className="text-gray-400 list-disc list-inside mt-2">
                                        <li>Install the Prime Video app on your preferred device.</li>
                                        <li>Log in using the provided credentials and start streaming.</li>
                                        <li>Contact support for any issues or account assistance.</li>
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
                                        <li>Do not share your account credentials with others.</li>
                                        <li>Do not change the account email or password without proper authorization.</li>
                                        <li>Contact support for any account-related issues.</li>
                                        <li>Keep your account secure by not adding unnecessary information to the profile settings.</li>
                                    </ul>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        <Nepal />

                        {/* Footer Section */}
                        <footer className="text-center mt-16 text-gray-500">
                            <p>&copy; 2024 Prime Video Nepal. All Rights Reserved.</p>
                        </footer>
                    </div>
                </motion.div>
            </Layout>
        </HelmetProvider>
    );
};

export default PrimeVideoNepal;

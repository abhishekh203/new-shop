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

const DisneyPlusHotstarNepal = () => {
    const meta = {
        title: "DisneyPlus Hotstar Nepal - Stream Disney, Marvel & More",
        description: "Stream Disney, Marvel, Star Wars, Pixar, and Hotstar Originals on DisneyPlus Hotstar in Nepal. HD streaming with no VPN required.",
        keywords: "DisneyPlus Hotstar Nepal, Disney+ Nepal, Watch Hotstar Nepal, Marvel movies Nepal, Stream Disney Nepal",
        canonical: "https://www.digitalshopnepal.com/DisneyPlusHotstarNepal"
    };

    const disneyStructuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Disney+ Hotstar Premium Subscription Nepal",
        "description": "Premium Disney+ Hotstar subscription for Nepal with Disney, Marvel, Star Wars, and Pixar content",
        "brand": {
            "@type": "Brand",
            "name": "Disney+ Hotstar"
        },
        "offers": {
            "@type": "Offer",
            "priceCurrency": "NPR",
            "price": "1299",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "Digital Shop Nepal"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.7",
            "reviewCount": "110"
        }
    };

    const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Subscriptions", url: "/subscription" },
        { name: "Disney+ Hotstar Nepal", url: "/DisneyPlusHotstarNepal", isLast: true }
    ];

    return (
        <HelmetProvider>
            <SEOHelmet
                title={meta.title}
                description={meta.description}
                keywords={meta.keywords}
                canonical={meta.canonical}
                structuredData={disneyStructuredData}
                breadcrumbs={breadcrumbs}
                ogType="product"
            />
            <Layout showBreadcrumb={true} customBreadcrumbs={breadcrumbs}>

                <div className="min-h-screen bg-gradient-to-b from-black via-blue-900 to-black p-8 text-white relative">
                    {/* Content Section */}
                    <div className="relative z-10">

                        {/* Hero Section */}
                        <section className="text-center p-10 fade-in">
                            <h1 className="text-5xl font-bold text-red-600 mb-6">DisneyPlus Hotstar Nepal</h1>
                            <p className="text-xl text-gray-300 text-justify w-full leading-relaxed">
                                Stream a vast library of movies and TV shows, including Disney, Marvel, Star Wars, Pixar, and Hotstar Originals, all available in Nepal. Enjoy the ultimate entertainment experience with no VPN required.
                            </p>
                            <ul className="text-gray-400 list-disc list-inside text-left mt-8 max-w-3xl mx-auto">
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    Access to exclusive Hotstar Originals available for streaming.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    VPN required; for seamless experience in Nepal.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    Available on multiple devices for seamless viewing but 1 subscription provides permission login in 1 device.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    Flexible subscription plans to suit your needs.
                                </li>
                            </ul>
                        </section>

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
                                        DisneyPlus Hotstar offers an extensive library of content ranging from blockbuster movies to popular TV shows. With a subscription, you can stream your favorite titles and access exclusive content available only on the platform.
                                    </p>
                                    <ul className="text-gray-400 list-disc list-inside mt-3">
                                        <p className="mt-3 text-white"><strong>Subscription Validity and Pricing:</strong></p>
                                        <li>6 Month Subscription: NPR 2699</li>
                                        <li>Yearly Subscription: NPR 4000</li>
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
                                        <li>Unlimited streaming of Disney, Marvel, Star Wars, and more.</li>
                                        <li>Access to exclusive Hotstar Originals.</li>
                                        <li>Multi-device streaming for convenience.</li>
                                        <li>Ad-free experience for uninterrupted viewing.</li>
                                        <li>Download content for offline viewing.</li>
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
                                        After subscribing to DisneyPlus Hotstar, you can easily access your account via the app or website. Browse through the extensive library and start streaming your favorite content instantly.
                                    </p>
                                    <ul className="text-gray-400 list-disc list-inside mt-2">
                                        <li>Download the DisneyPlus Hotstar app from your app store.</li>
                                        <li>Create an account or log in using your credentials.</li>
                                        <li>Explore the library and select your desired content to watch.</li>
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
                                        <li>Use only your account for streaming content.</li>
                                        <li>Do not share your login credentials with others.</li>
                                        <li>Report any technical issues to customer support immediately.</li>
                                        <li>Ensure a stable internet connection for uninterrupted streaming.</li>
                                    </ul>
                                </AccordionDetails>
                            </Accordion>
                        </div>

                        <Nepal />

                        {/* Footer Section */}
                        <footer className="text-center mt-16 text-gray-500">
                            <p>&copy; 2024 DisneyPlus Hotstar Nepal. All Rights Reserved.</p>
                        </footer>
                    </div>
                </div>
            </Layout>
        </HelmetProvider>
    );
};

export default DisneyPlusHotstarNepal;

import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Importing icons for lists
import { Helmet, HelmetProvider } from 'react-helmet-async'; // Import HelmetProvider and Helmet
import Layout from "../components/layout/Layout"; // Import Layout component
import Nepal from "./nepal";

const Zee5Nepal = () => {
    const meta = {
        title: "Zee5 Nepal - Watch Zee5 Shows & Movies Online",
        description: "Dive into the world of Zee5 in Nepal and enjoy your favorite shows, movies, and original content. With a subscription, stream a wide array of regional and international content anytime, anywhere, on your preferred device.",
        keywords: "Zee5 Nepal, zee5 subscription nepal, Watch Zee5 online Nepal, Zee5 shows, Zee5 movies",
        canonical: "https://www.digitalshopnepal.com/Zee5Nepal" // Update this with the actual URL of your page
    };

    return (
        <HelmetProvider>
            <Layout>
                <Helmet>
                    <title>{meta.title}</title>
                    <meta name="description" content={meta.description} />
                    <meta name="keywords" content={meta.keywords} />
                    <link rel="canonical" href={meta.canonical} /> {/* Add canonical link */}
                </Helmet>

                <div className="min-h-screen bg-gradient-to-b from-black via-blue-900 to-black p-8 text-white relative">
                    {/* Content Section */}
                    <div className="relative z-10">

                        {/* Hero Section */}
                        <section className="text-center p-10 fade-in">
                            <h1 className="text-5xl font-bold text-yellow-400 mb-6">Zee5 Nepal</h1>
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
                </div>
            </Layout>
        </HelmetProvider>
    );
};

export default Zee5Nepal;

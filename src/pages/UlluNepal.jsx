import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Helmet, HelmetProvider } from 'react-helmet-async'; // Import HelmetProvider and Helmet
import Layout from "../components/layout/Layout"; // Import Layout component
import Nepal from "./nepal";

const UlluNepal = () => {
    const meta = {
        title: "Ullu Nepal - Watch Ullu Web Series & Movies",
        description: "Stream Ullu Originals, web series, and movies in Nepal. Get access to exclusive Indian content and enjoy streaming across devices.",
        keywords: "Ullu Nepal, Watch Ullu online Nepal, Stream Ullu Nepal, Ullu web series Nepal, Ullu subscription Nepal",
        canonical: "https://www.digitalshopnepal.com/UlluNepal" // Update with your actual page URL
    };

    return (
        <HelmetProvider>
            <Layout>
                <Helmet>
                    <title>{meta.title}</title>
                    <meta name="description" content={meta.description} />
                    <meta name="keywords" content={meta.keywords} />
                    <link rel="canonical" href={meta.canonical} />
                </Helmet>

                <div className="min-h-screen bg-gradient-to-b from-black via-red-900 to-black p-8 text-white relative">
                    {/* Content Section */}
                    <div className="relative z-10">

                        {/* Hero Section */}
                        <section className="text-center p-10 fade-in">
                            <h1 className="text-5xl font-bold text-yellow-500 mb-6">Ullu Nepal</h1>
                            <p className="text-xl text-gray-300 text-justify w-full leading-relaxed">
                                Dive into a world of captivating stories and original content with Ullu Nepal. Enjoy a variety of shows and movies that cater to diverse tastes, all available without any hassles!
                            </p>
                            <ul className="text-gray-400 list-disc list-inside text-left mt-8 max-w-3xl mx-auto">
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    Exclusive Originals: Access to unique web series.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    Stream Anywhere: Available on multiple devices.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    No VPN Required: Watch directly in Nepal.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    HD Streaming: Experience high-quality content.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    Affordable Plans: Competitive pricing for all users.
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
                                        Ullu provides a platform for unique storytelling, showcasing a variety of genres from drama to thriller. The platform features original series, short films, and documentaries that are sure to entertain.
                                    </p>
                                    <ul className="text-gray-400 list-disc list-inside mt-3">
                                        <p className="mt-3 text-white"><strong>Subscription Validity and Pricing:</strong></p>
                                        <li>Yearly Subscription: Rs. 1,499</li>
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
                                        <li>Exclusive access to original content and shows.</li>
                                        <li>High-definition streaming for a superior experience.</li>
                                        <li>No geographical restrictions; available in Nepal.</li>
                                        <li>Access on multiple devices including smartphones and tablets.</li>
                                        <li>Regular updates with new content added frequently.</li>
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
                                        Subscribe to Ullu Nepal, and you'll receive your login details via email. Sign in on the Ullu app or website and start exploring a world of entertainment instantly!
                                    </p>
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
                                        <li>Use only the provided account details for access.</li>
                                        <li>Do not share your login credentials with others.</li>
                                        <li>Log out after watching to maintain account security.</li>
                                        <li>Contact support for any issues related to your account.</li>
                                    </ul>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        <Nepal />

                        {/* Footer Section */}
                        <footer className="text-center mt-16 text-gray-500">
                            <p>&copy; 2024 Ullu Nepal. All Rights Reserved.</p>
                        </footer>
                    </div>
                </div>
            </Layout>
        </HelmetProvider>
    );
};

export default UlluNepal;

import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Importing icons for lists
import { Helmet, HelmetProvider } from 'react-helmet-async'; // Import HelmetProvider and Helmet
import Layout from "../components/layout/Layout"; // Import Layout component
import Nepal from "./nepal"; // Importing a reusable component related to Nepal info (if needed)

const YoutubePremiumNepal = () => {
    // Meta information for SEO
    const meta = {
        title: "YouTube Premium Nepal - Stream Ad-Free Videos & Music",
        description: "Enjoy YouTube Premium in Nepal. Watch ad-free videos, download for offline viewing, and access YouTube Music. No VPN required.",
        keywords: "YouTube Premium Nepal, youtube nepal, youtube subscription nepal, buy youtube premium nepal, YouTube subscription, Watch ad-free videos Nepal, Stream YouTube Music, VPN Free YouTube Premium Nepal",
        canonical: "https://www.digitalshopnepal.com/YoutubePremiumNepal"
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
                            <h1 className="text-5xl font-bold text-red-500 mb-6">YouTube Premium Nepal</h1>
                            {/* Ensure full-width paragraph on all devices */}
                            <p className="text-xl text-gray-300 text-justify w-full leading-relaxed sm:w-full">
                                Enjoy ad-free video streaming with YouTube Premium in Nepal. With our subscription, you can watch your favorite videos, listen to music, and access exclusive content without interruptions. Download videos for offline viewing and enjoy background play on any device.
                            </p>

                            <ul className="text-gray-400 list-disc list-inside text-left mt-8 max-w-3xl mx-auto">
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-red-500 mr-2" />
                                    Available with a personal email for easy access and secure login.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-red-500 mr-2" />
                                    Ad-free video streaming and music listening.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-red-500 mr-2" />
                                    Download your favorite videos for offline viewing.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-red-500 mr-2" />
                                    Background play to listen while using other apps.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-red-500 mr-2" />
                                    Access to YouTube Originals and exclusive content.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-red-500 mr-2" />
                                    Accessible on any device: mobile, desktop, or tablet.
                                </li>
                            </ul>
                        </section>

                        {/* Accordion Sections */}
                        <div className="my-8 w-full mx-auto"> {/* Changed to w-full for mobile responsiveness */}
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
                                        With a YouTube Premium subscription in Nepal, you can enjoy uninterrupted video playback, access to YouTube Originals, and download content for offline viewing. Experience YouTube like never before, completely ad-free.
                                    </p>
                                    <ul className="text-gray-400 list-disc list-inside mt-3">
                                        <p className="mt-3 text-white"><strong>Subscription Pricing:</strong></p>
                                        <li>Monthly Subscription: Rs. 299</li>
                                        <li>3 Months Subscription: Rs. 849</li>
                                        <li>6 Months Subscription: Rs. 1,599</li>
                                        <li>Yearly Subscription: Rs. 2,999</li>
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
                                        <li>Ad-free video streaming and music listening.</li>
                                        <li>Download videos for offline viewing.</li>
                                        <li>Background play to listen while using other apps.</li>
                                        <li>Access to YouTube Originals and exclusive content.</li>
                                        <li>Available with a personal email for easy access and secure login.</li>
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
                                        Once you subscribe to YouTube Premium, we will share an invite link through which you can join. If the invite is not accepted, we are happy to guide you through the process. You can sign in on the YouTube app available on mobile, desktop, or tablet. Enjoy streaming your favorite videos instantly, or download content for offline viewing.
                                    </p>
                                    <ul className="text-gray-400 list-disc list-inside mt-2">
                                        <li>Install the YouTube app on your preferred device.</li>
                                        <li>Login using the provided credentials and start streaming.</li>
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
                                        <li>Do not change the account email or password unless you haven't subscribed with your email.</li>
                                        <li>Contact support for account-related issues.</li>
                                        <li>Keep your account secure by not adding unnecessary information to the profile settings.</li>
                                    </ul>
                                </AccordionDetails>
                            </Accordion>
                        </div>

                        <Nepal />

                        {/* Footer Section */}
                        <footer className="text-center mt-16 text-gray-500">
                            <p>&copy; 2024 YouTube Premium Nepal. All Rights Reserved.</p>
                        </footer>
                    </div>
                </div>
            </Layout>
        </HelmetProvider>
    );
};

export default YoutubePremiumNepal;

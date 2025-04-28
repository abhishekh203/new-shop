import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Helmet, HelmetProvider } from 'react-helmet-async'; // Import HelmetProvider and Helmet
import Layout from "../components/layout/Layout";  // Import Layout component
import Nepal from "./nepal";

const GrammarlyNepal = () => {
    const meta = {
        title: "Grammarly Nepal - Improve Your Writing Instantly",
        description: "Improve your writing with Grammarly in Nepal. Correct grammar, punctuation, and spelling mistakes with real-time suggestions. Perfect for professionals and students.",
        keywords: "Grammarly Nepal, Grammarly subscription Nepal, Grammarly writing tool Nepal, Correct grammar Nepal, Writing assistant Nepal, Grammar checker Nepal",
        canonical: "https://www.digitalshopnepal.com/GrammarlyNepal" // Update this with the actual URL of your page
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

                <div className="min-h-screen bg-gradient-to-b from-black via-blue-800 to-black p-8 text-white relative">
                    {/* Content Section */}
                    <div className="relative z-10">

                        {/* Hero Section */}
                        <section className="text-center p-10 fade-in">
                            <h1 className="text-5xl font-bold text-yellow-500 mb-6">Grammarly Nepal</h1>
                            <p className="text-xl text-gray-300 text-justify w-full leading-relaxed">
                                Unlock the full potential of your writing with Grammarly in Nepal! Our subscription offers comprehensive grammar checks, style suggestions, and plagiarism detection, ensuring your content is polished and professional. Perfect for students, professionals, and writers looking to enhance their communication skills.
                            </p>
                            <ul className="text-gray-400 list-disc list-inside text-left mt-8 max-w-3xl mx-auto">
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    Advanced Grammar and Spelling Checks.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    Style and Tone Adjustments for clarity.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    Plagiarism Detection for original content.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    Easy-to-use interface available on multiple platforms.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    No VPN required for seamless access in Nepal.
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
                                        Grammarly helps you write better by providing real-time feedback on your writing. With Grammarly in Nepal, you'll enjoy access to premium features, including vocabulary enhancement suggestions, genre-specific writing style checks, and more to ensure your documents are error-free and engaging.
                                    </p>
                                    <ul className="text-gray-400 list-disc list-inside mt-3">
                                        <p className="mt-3 text-white"><strong>Subscription Validity and Pricing:</strong></p>
                                        <li>Monthly Subscription: Rs. 999</li>
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
                                        <li>Comprehensive grammar, punctuation, and style checks.</li>
                                        <li>Suggestions for improving clarity and tone.</li>
                                        <li>Plagiarism detection to maintain originality.</li>
                                        <li>Accessible across devices without a VPN.</li>
                                        <li>24/7 customer support for any account-related issues.</li>
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
                                        After subscribing, simply log into your Grammarly account and start writing! The tool will provide real-time suggestions and improvements as you type, helping you craft your documents effectively.
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
                                        <li>Ensure you are using the correct account credentials.</li>
                                        <li>Do not share your account information with others.</li>
                                        <li>Utilize the tool regularly for best results.</li>
                                    </ul>
                                </AccordionDetails>
                            </Accordion>
                        </div>

                        <Nepal />

                        {/* Footer Section */}
                        <footer className="text-center mt-16 text-gray-500">
                            <p>&copy; 2024 Grammarly Nepal. All Rights Reserved.</p>
                        </footer>
                    </div>
                </div>
            </Layout>
        </HelmetProvider>
    );
};

export default GrammarlyNepal;

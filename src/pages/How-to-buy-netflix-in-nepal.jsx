import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Helmet, HelmetProvider } from 'react-helmet-async'; // Import HelmetProvider and Helmet
import Layout from "../components/layout/Layout"; // Import Layout component
import Nepal from "./nepal";

const HowToBuyNetflixNepal = () => {
    const meta = {
        title: "How to Buy Netflix in Nepal - Step-by-Step Guide",
        description: "Learn how to purchase Netflix in Nepal with our easy step-by-step guide. Discover affordable subscription plans and payment methods for a seamless experience.",
        keywords: "How to buy Netflix in Nepal, Netflix purchase guide Nepal, Netflix subscription options Nepal, Affordable Netflix plans in Nepal, Buy Netflix online Nepal, Purchase Netflix in Nepal, Netflix Nepal subscription, Best way to buy Netflix in Nepal, Netflix subscription options in Nepal, Payment methods for Netflix in Nepal, Buy Netflix account in Nepal, Streaming services in Nepal, Digital products in Nepal, Buy Netflix using Esewa in Nepal, Netflix subscription payment methods Nepal",
        canonical: "https://www.digitalshopnepal.com/How-to-buy-netflix-in-nepal" // Update this with the actual URL of your page
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
                            <h1 className="text-5xl font-bold text-red-600 mb-6">How to Buy Netflix in Nepal</h1>
                            <p className="text-xl text-gray-300 text-justify w-full leading-relaxed">
                                Buying a Netflix subscription in Nepal is simple and affordable! Choose a plan that suits your viewing preferences, and start enjoying unlimited streaming of your favorite movies and series. Follow these steps to get started!
                            </p>
                        </section>

                        {/* Subscription Details Section */}
                        <div className="my-8 max-w-4xl mx-auto">
                            <h2 className="text-2xl font-semibold text-center mb-6">Affordable Subscription Plans</h2>
                            <ul className="text-gray-300 list-disc list-inside text-left mt-8 mx-4">
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    <strong>Monthly Subscription:</strong> NPR 399 - Ideal for short-term users.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    <strong>3 Months Subscription:</strong> NPR 1,169 - More savings with a quarterly plan.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    <strong>6 Months Subscription:</strong> NPR 2,300 - Great for avid viewers.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    <strong>Yearly Subscription:</strong> NPR 4,499 - Best value for unlimited access.
                                </li>
                            </ul>
                        </div>

                        {/* How to Purchase Section */}
                        <div className="my-8 max-w-4xl mx-auto">
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    className="bg-gray-800 text-white hover:bg-gray-700 transition duration-300"
                                >
                                    <h2 className="text-lg font-semibold">How to Purchase</h2>
                                </AccordionSummary>
                                <AccordionDetails className="bg-gray-900 shadow-md border-t border-gray-700 transition-all">
                                    <ul className="text-gray-400 list-disc list-inside">
                                        <li>Click on "All Products" or scroll down to check prices.</li>
                                        <li>Add your desired subscription plan to your cart.</li>
                                        <li>Make the payment through our easy and seamless checkout process.</li>
                                        <li>Alternatively, you can contact us via our website <a href="https://www.digitalshopnepal.com" className="text-blue-400 underline">digitalshopnepal.com</a>.</li>
                                        <li>Payment options include Esewa, Khalti, IMEpay, Bank Transfer, and Fonepay.</li>
                                        <li>Once payment is completed, send us a message by clicking on the contact us option or by sending an email via our form!</li>
                                        <li>Note: No VPN is required to stream Netflix in Nepal if you buy from us.</li>
                                    </ul>
                                </AccordionDetails>
                            </Accordion>
                        </div>

                        <Nepal />

                        {/* Footer Section */}
                        <footer className="text-center mt-16 text-gray-500">
                            <p>&copy; 2024 How to Buy Netflix in Nepal. All Rights Reserved.</p>
                        </footer>
                    </div>
                </div>
            </Layout>
        </HelmetProvider>
    );
};

export default HowToBuyNetflixNepal;

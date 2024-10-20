import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Importing icons for lists
import Layout from "../components/layout/Layout";  // Import Layout component
import Nepal from "./nepal";

const PrimeVideoNepal = () => {
    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-black via-yellow-900 to-black p-8 text-white relative">
                {/* Adding a background image for a more cinematic look */}

                {/* Content Section */}
                <div className="relative z-10">

                    {/* Hero Section */}
                    <section className="text-center p-10 fade-in">
                        <h1 className="text-5xl font-bold text-yellow-500 mb-6">Prime Video Nepal</h1>
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
                    <Nepal/>

                    {/* Footer Section */}
                    <footer className="text-center mt-16 text-gray-500">
                        <p>&copy; 2024 Prime Video Nepal. All Rights Reserved.</p>
                    </footer>
                </div>
            </div>
        </Layout>
    );
};

export default PrimeVideoNepal;

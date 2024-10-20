import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Importing icons for lists
import Layout from "../components/layout/Layout"; // Import Layout component
import Nepal from "./nepal";

const AltBalajiNepal = () => {
    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black p-8 text-white relative">
                {/* Content Section */}
                <div className="relative z-10">

                    {/* Hero Section */}
                    <section className="text-center p-10 fade-in">
                        <h1 className="text-5xl font-bold text-purple-600 mb-6">AltBalaji Nepal</h1>
                      <p className="text-xl text-gray-300 text-justify w-full leading-relaxed">
                            Discover a world of original content with AltBalaji Nepal. Enjoy a variety of Indian web series and shows with our affordable subscription plan. Stream your favorites anytime, anywhere, without interruptions.
                        </p>
                        <ul className="text-gray-400 list-disc list-inside text-left mt-8 max-w-3xl mx-auto">
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                Exclusive Originals: Access to a wide range of unique web series.
                            </li>
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                HD Streaming: Enjoy high-quality content without buffering.
                            </li>
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                No VPN Required: Watch from Nepal without any restrictions.
                            </li>
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                Multi-device Access: Stream on your TV, mobile, or laptop.
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
                                    AltBalaji offers a vast library of original shows and series across various genres. Whether you’re into drama, comedy, or thrillers, there's something for everyone.
                                </p>
                                <ul className="text-gray-400 list-disc list-inside mt-3">
                                    <p className="mt-3 text-white"><strong>Subscription Validity and Pricing:</strong></p>
                                    <li>Monthly Subscription: Rs. 199</li>
                                    <li>Quarterly Subscription: Rs. 499</li>
                                    <li>Yearly Subscription: Rs. 1,799</li>
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
                                    <li>Exclusive access to original series and movies.</li>
                                    <li>High-definition streaming for an immersive experience.</li>
                                    <li>No restrictions; watch seamlessly from Nepal.</li>
                                    <li>Multi-device compatibility.</li>
                                    <li>Affordable pricing with flexible plans.</li>
                                    <li>Regular updates and new content added frequently.</li>
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
                                    To start enjoying AltBalaji, subscribe to your preferred plan, and receive your login details via email. Simply log in through the app or website, and you’re ready to start streaming!
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
                                    <li>Only use the provided account details to access content.</li>
                                    <li>Do not share your account credentials with others.</li>
                                    <li>Log out of the account after use to ensure security.</li>
                                    <li>Contact support for any account-related issues.</li>
                                </ul>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                    <Nepal />

                    {/* Footer Section */}
                    <footer className="text-center mt-16 text-gray-500">
                        <p>&copy; 2024 AltBalaji Nepal. All Rights Reserved.</p>
                    </footer>
                </div>
            </div>
        </Layout>
    );
};

export default AltBalajiNepal;

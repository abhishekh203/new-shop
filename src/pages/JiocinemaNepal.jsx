import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Importing icons for lists
import Layout from "../components/layout/Layout"; // Import Layout component
import Nepal from "./nepal";

const JioCinemaNepal = () => {
    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black p-8 text-white relative">
                {/* Content Section */}
                <div className="relative z-10">

                    {/* Hero Section */}
                    <section className="text-center p-10 fade-in">
                        <h1 className="text-5xl font-bold text-red-600 mb-6">JioCinema Nepal</h1>
                         <p className="text-xl text-gray-300 text-justify w-full leading-relaxed">
                           Enjoy unlimited streaming of your favorite movies and TV shows with JioCinema in Nepal. Access a diverse library of regional and international content in high definition (HD), tailored to satisfy all your entertainment needs. From blockbuster films to popular TV series, JioCinema offers an extensive selection that caters to every taste. Stream seamlessly on your devices and never miss out on the latest hits, all available using VPN. Subscribe today for an immersive viewing experience and explore the best of entertainment with JioCinema in Nepal.
                        </p>
                        <ul className="text-gray-400 list-disc list-inside text-left mt-8 max-w-3xl mx-auto">
                        <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                To access JioCinema in Nepal, a VPN is essential for bypassing geographical restrictions and ensuring a seamless streaming experience.  
                            </li>
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                Unlimited access to a vast library of content.
                            </li>
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                HD streaming available on multiple devices.
                            </li>
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                User-friendly interface for easy navigation.
                            </li>
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                Affordable subscription plans tailored for everyone.
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
                                    JioCinema is your go-to platform for streaming the latest movies, TV shows, and exclusive JioCinema originals. With a seamless streaming experience and no VPN required, enjoy all your favorite content right from Nepal.
                                </p>
                                <ul className="text-gray-400 list-disc list-inside mt-3">
                                    <p className="mt-3 text-white"><strong>Subscription Validity and Pricing:</strong></p>
                                    <li>Monthly Subscription: NPR 199</li>
                                    <li>Yearly Subscription: NPR 1,999</li>
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
                                    <li>Unlimited streaming of movies and TV shows.</li>
                                    <li>Access to exclusive JioCinema originals.</li>
                                    <li>High-definition streaming on multiple devices.</li>
                                    <li>No ads or interruptions during viewing.</li>
                                    <li>Offline viewing available for downloaded content.</li>
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
                                    After subscribing to JioCinema, you can easily access your account on the app or website. Start streaming your favorite content instantly with no additional setup.
                                </p>
                                <ul className="text-gray-400 list-disc list-inside mt-2">
                                    <li>Download the JioCinema app from the app store.</li>
                                    <li>Create an account or log in using your credentials.</li>
                                    <li>Browse the library and select your desired content to watch.</li>
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
                        <p>&copy; 2024 JioCinema Nepal. All Rights Reserved.</p>
                    </footer>
                </div>
            </div>
        </Layout>
    );
};

export default JioCinemaNepal;

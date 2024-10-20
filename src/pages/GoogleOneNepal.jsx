import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Importing icons for lists
import Layout from "../components/layout/Layout";  // Import Layout component
import Nepal from "./nepal";

const GoogleOneNepal = () => {
    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-black via-blue-900 to-black p-8 text-white relative">
                {/* Content Section */}
                <div className="relative z-10">

                    {/* Hero Section */}
                    <section className="text-center p-10 fade-in">
                        <h1 className="text-5xl font-bold text-yellow-400 mb-6">Google One Nepal</h1>
                       <p className="text-xl text-gray-300 text-justify w-full leading-relaxed">
                            Unlock a world of possibilities with Google One Nepal! Enjoy expansive cloud storage, family sharing features, and exclusive Google services to enhance your digital experience. Whether you're backing up photos or managing your files, Google One has you covered with security and convenience.
                        </p>
                        <ul className="text-gray-400 list-disc list-inside text-left mt-8 max-w-3xl mx-auto">
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                Up to 2TB of cloud storage for your files and photos.
                            </li>
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                Family sharing with up to 5 family members.
                            </li>
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                Access to Google experts for assistance.
                            </li>
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                Member-exclusive offers and discounts.
                            </li>
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                Automatically back up your device data.
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
                                    Google One Nepal offers a comprehensive cloud storage solution that integrates seamlessly with your Google account. With enhanced features like automatic backups, family sharing, and premium support, it is designed to meet all your digital storage needs.
                                </p>
                                <ul className="text-gray-400 list-disc list-inside mt-3">
                                    <p className="mt-3 text-white"><strong>Subscription Validity and Pricing:</strong></p>
                                    <li>100GB Plan: Rs. 250/month</li>
                                    <li>200GB Plan: Rs. 400/month</li>
                                    <li>2TB Plan: Rs. 1,700/month</li>
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
                                    <li>Flexible storage options for all your needs.</li>
                                    <li>Automatic backups to keep your data safe.</li>
                                    <li>Expert support available 24/7.</li>
                                    <li>Exclusive discounts and offers from Google.</li>
                                    <li>Easy sharing with family members.</li>
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
                                    After subscribing to Google One, you can easily access your storage through Google Drive. Just log into your Google account to manage your files and utilize all the premium features available.
                                </p>
                                <ul className="text-gray-400 list-disc list-inside mt-2">
                                    <li>For backup settings, visit the Google One app.</li>
                                    <li>Share your plan from the Google One interface.</li>
                                    <li>Contact Google support for any issues or inquiries.</li>
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
                                    <li>Ensure backups are configured properly for all devices.</li>
                                    <li>Adhere to Google’s terms of service for account use.</li>
                                </ul>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                    <Nepal />

                    {/* Footer Section */}
                    <footer className="text-center mt-16 text-gray-500">
                        <p>&copy; 2024 Google One Nepal. All Rights Reserved.</p>
                    </footer>
                </div>
            </div>
        </Layout>
    );
};

export default GoogleOneNepal;

import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Importing icons for lists
import Layout from "../components/layout/Layout";  // Import Layout component
import Nepal from "./nepal";

const NetflixNepal = () => {
    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-black via-blue-900 to-black p-8 text-white relative">
                {/* Adding a background image for a more cinematic look */}
                

                {/* Content Section */}
                <div className="relative z-10">

                    {/* Hero Section */}
                    <section className="text-center p-10 fade-in">
                        <h1 className="text-5xl font-bold text-red-600 mb-6">Netflix Nepal</h1>
                       <p className="text-xl text-gray-300 text-justify w-full leading-relaxed">
    Looking for a Netflix subscription in Nepal that fits your personal needs? Our 1 private profile Screen Netflix Nepal subscription allows one user to enjoy Netflix on one device at a time. With this affordable plan, you can stream your favorite movies and TV shows on your smart TV, PC, mobile phone, or tablet without any interruptions. It’s perfect for personal use, and with Ultra HD quality, your viewing experience will be crisp and immersive.
</p>

                        <ul className="text-gray-400 list-disc list-inside text-left mt-8 max-w-3xl mx-auto">
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                1 Screen means only 1 user but private profile.
                            </li>
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                Pin-Locked Profile: A secure profile protected with a PIN.
                            </li>
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                Ultra HD Streaming: Experience high-quality streaming.
                            </li>
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                Easily renew your account without losing settings.
                            </li>
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                100% secure accounts, delivered with Email ID and Password.
                            </li>
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                No VPN required for any country.
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
                                    When you purchase a Netflix Nepal subscription, you get a personalized profile with a secure PIN lock for added privacy. Each profile allows access to your own content, with Netflix streaming on one device at a time, in stunning Ultra HD quality.
                                </p>
                                <ul className="text-gray-400 list-disc list-inside mt-3">
                                    <p className="mt-3 text-white"><strong>Subscription Validity and Pricing:</strong></p>
                                    <li>Monthly Subscription: Rs. 399</li>
                                    <li>3 Months Subscription: Rs. 1,169</li>
                                    <li>6 Months Subscription: Rs. 2,300</li>
                                    <li>Yearly Subscription: Rs. 4,499</li>
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
                                    <li>One Screen Access: Stream content on one device at a time.</li>
                                    <li>Ultra HD for an immersive viewing experience.</li>
                                    <li>Secure PIN-locked profile.</li>
                                    <li>Seamless subscription renewals.</li>
                                    <li>Works in Nepal without VPN.</li>
                                    <li>Dedicated support for account-related issues.</li>
                                    <li>Access to promotions and discounts.</li>
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
                                    After subscribing, you'll receive a personal account under our shared subscription. You can start watching instantly. The 1 Screen subscription allows only one active device at a time.
                                </p>
                                <ul className="text-gray-400 list-disc list-inside mt-2">
                                    <li>For mobile, laptop, or tablet access, follow the instructions sent to your email to request a login code.</li>
                                    <li>For TV, sign in using a provided code or by contacting us for support.</li>
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
                                    <li>Use only the provided profile to ensure smooth streaming.</li>
                                    <li>Do not change the account email or password.</li>
                                    <li>Do not add a mobile number to the account settings.</li>
                                    <li>Log out from the current device before logging in on another.</li>
                                </ul>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                    <Nepal/>

                    {/* Footer Section */}
                    <footer className="text-center mt-16 text-gray-500">
                        <p>&copy; 2024 Netflix Nepal. All Rights Reserved.</p>
                    </footer>
                </div>
            </div>
        </Layout>
    );
};

export default NetflixNepal;

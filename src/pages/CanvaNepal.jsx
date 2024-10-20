import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Importing icons for lists
import Layout from "../components/layout/Layout"; // Import Layout component
import Nepal from "./nepal";

const CanvaNepal = () => {
    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-black via-blue-900 to-black p-8 text-white relative">
                {/* Content Section */}
                <div className="relative z-10">

                    {/* Hero Section */}
                    <section className="text-center p-10 fade-in">
                        <h1 className="text-5xl font-bold text-blue-400 mb-6">Canva Nepal</h1>
                           <p className="text-xl text-gray-300 text-justify w-full leading-relaxed">
                            Unlock your creativity with Canva, the ultimate design tool that empowers you to create stunning graphics, presentations, and more. Available in Nepal, Canva offers a user-friendly interface and a vast library of templates and resources to bring your ideas to life.
                        </p>
                        <ul className="text-gray-400 list-disc list-inside text-left mt-8 max-w-3xl mx-auto">
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                Access to thousands of customizable templates for every need.
                            </li>
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                User-friendly drag-and-drop interface makes designing easy.
                            </li>
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                Collaborate with team members in real time.
                            </li>
                            <li className="mb-1 flex items-center">
                                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                Download and share your designs in various formats.
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
                                    Canva is a powerful graphic design tool that allows users to create stunning visuals without needing extensive design skills. Whether you're making social media posts, flyers, or presentations, Canva provides an array of features to simplify the design process.
                                </p>
                                <ul className="text-gray-400 list-disc list-inside mt-3">
                                    <p className="mt-3 text-white"><strong>Subscription Validity and Pricing:</strong></p>
                                    <li>Free Plan: Access to basic features and templates.</li>
                                    <li>Pro Plan: NPR 2,250 per year, offering advanced features and additional resources.</li>
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
                                    <li>Unlimited access to premium templates and design elements.</li>
                                    <li>Advanced editing tools for enhanced creativity.</li>
                                    <li>Collaboration features for teamwork on designs.</li>
                                    <li>Option to create brand kits for consistent branding.</li>
                                    <li>Cloud storage for your projects, accessible anywhere.</li>
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
                                    To get started with Canva, simply sign up for an account and choose a plan that suits your needs. We provide an invite link to your personal email, and you must accept it to access your Canva account. Explore the extensive library of templates and begin designing your projects with ease.
                                </p>
                                <ul className="text-gray-400 list-disc list-inside mt-2">
                                    <li>Create an account on the Canva website or app.</li>
                                    <li>Check your email for an invite link and accept it.</li>
                                    <li>Choose a template or start from scratch.</li>
                                    <li>Use the drag-and-drop editor to customize your design.</li>
                                    <li>Save and share your work in various formats.</li>
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
                                    <li>Respect copyright when using images and templates.</li>
                                    <li>Do not share your Canva account credentials.</li>
                                    <li>Use designs for personal or authorized commercial use only.</li>
                                    <li>Report any technical issues to Canva support.</li>
                                </ul>
                            </AccordionDetails>
                        </Accordion>
                    </div>

                    <Nepal />

                    {/* Footer Section */}
                    <footer className="text-center mt-16 text-gray-500">
                        <p>&copy; 2024 Canva Nepal. All Rights Reserved.</p>
                    </footer>
                </div>
            </div>
        </Layout>
    );
};

export default CanvaNepal;

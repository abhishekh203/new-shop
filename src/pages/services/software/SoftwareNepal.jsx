import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Helmet, HelmetProvider } from 'react-helmet-async'; // Import HelmetProvider and Helmet
import Layout from "../../../components/layout/Layout"; // Import Layout component
import Nepal from "../../nepal";

const SoftwareNepal = () => {
    const meta = {
        title: "Software Nepal - Access Genuine Software Licenses Easily",
        description: "Discover and access genuine software licenses in Nepal with ease. Get software like Office 365, Windows, IDM, and more at competitive prices with instant delivery.",
        keywords: "Software Nepal, genuine software licenses Nepal, buy software online Nepal, Microsoft Office Nepal, Windows software Nepal, IDM Nepal, antivirus software Nepal, software keys Nepal",
        canonical: "https://www.digitalshopnepal.com/SoftwareNepal" // Update this with the actual URL of your page
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

                <div className="min-h-screen bg-gradient-to-b from-black via-gray-800 to-black p-8 text-white relative">
                    {/* Content Section */}
                    <div className="relative z-10">

                        {/* Hero Section */}
                        <section className="text-center p-10 fade-in">
                            <h1 className="text-5xl font-bold text-blue-500 mb-6">Software Nepal</h1>
                            <p className="text-xl text-gray-300 text-justify w-full leading-relaxed">
                                Discover and access genuine software licenses in Nepal with ease. Whether you need Office 365, Windows, IDM, or other essential software, we provide hassle-free key facilitation services tailored for you.
                            </p>
                            <ul className="text-gray-400 list-disc list-inside text-left mt-8 max-w-3xl mx-auto">
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    Genuine software keys at competitive prices.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    Easy and secure online purchasing process.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    Instant delivery of activation keys via email.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    Dedicated customer support for all queries.
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
                                        At Software Nepal, we facilitate software keys for popular applications such as Microsoft Office 365, Windows operating systems, Internet Download Manager (IDM), and many more. Our goal is to make software access easy, affordable, and reliable for users across Nepal.
                                    </p>
                                    <ul className="text-gray-400 list-disc list-inside mt-3">
                                        <p className="mt-3 text-white"><strong>Software Keys Offered:</strong></p>
                                        <li>Office 365: NPR 2,000</li>
                                        <li>Windows 10 Pro: NPR 2,000</li>
                                        <li>Internet Download Manager (IDM): NPR 2,000</li>
                                        <li>Antivirus Software: NPR 1,500</li>
                                        <li>Adobe Creative Cloud: NPR 5,000</li>
                                    </ul>
                                </AccordionDetails>
                            </Accordion>

                            {/* Subscription Benefits Section */}
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    className="bg-gray-800 text-white hover:bg-gray-700 transition duration-300"
                                >
                                    <h2 className="text-lg font-semibold">Benefits of Choosing Us</h2>
                                </AccordionSummary>
                                <AccordionDetails className="bg-gray-900 shadow-md border-t border-gray-700 transition-all">
                                    <ul className="text-gray-400 list-disc list-inside">
                                        <li>100% genuine software keys to ensure product authenticity.</li>
                                        <li>Affordable pricing compared to market rates.</li>
                                        <li>Secure payment methods for your peace of mind.</li>
                                        <li>Quick and easy installation instructions provided.</li>
                                        <li>Lifetime customer support for any technical issues.</li>
                                    </ul>
                                </AccordionDetails>
                            </Accordion>

                            {/* How to Use Section */}
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    className="bg-gray-800 text-white hover:bg-gray-700 transition duration-300"
                                >
                                    <h2 className="text-lg font-semibold">How to Purchase and Use</h2>
                                </AccordionSummary>
                                <AccordionDetails className="bg-gray-900 shadow-md border-t border-gray-700 transition-all">
                                    <p className="text-gray-300">
                                        To purchase a software key, simply browse our selection, add your desired software to the cart, and complete the secure checkout process. Once your payment is confirmed, you will receive your activation key via email.
                                    </p>
                                    <ul className="text-gray-400 list-disc list-inside mt-2">
                                        <li>Follow the installation instructions included in your email.</li>
                                        <li>Activate your software using the provided key.</li>
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
                                        <li>Do not share your activation key with others.</li>
                                        <li>Ensure to download software only from trusted sources.</li>
                                        <li>Contact support for any issues related to activation.</li>
                                        <li>Keep your software updated to avoid security risks.</li>
                                    </ul>
                                </AccordionDetails>
                            </Accordion>
                        </div>

                        <Nepal />

                        {/* Footer Section */}
                        <footer className="text-center mt-16 text-gray-500">
                            <p>&copy; 2024 Software Nepal. All Rights Reserved.</p>
                        </footer>
                    </div>
                </div>
            </Layout>
        </HelmetProvider>
    );
};

export default SoftwareNepal;

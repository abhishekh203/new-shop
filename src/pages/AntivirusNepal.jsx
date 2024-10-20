import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Importing icons for lists
import Layout from "../components/layout/Layout"; // Import Layout component
import Nepal from "./nepal";

const AntivirusNepal = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-red-800 to-black p-8 text-white relative">
        {/* Content Section */}
        <div className="relative z-10">

          {/* Hero Section */}
          <section className="text-center p-10 fade-in">
            <h1 className="text-5xl font-bold text-red-400 mb-6">Antivirus Nepal</h1>
            <p className="text-xl text-gray-300 text-justify w-full leading-relaxed">
              Protect your devices from malware, ransomware, and online threats with the best antivirus solutions in Nepal. Our services ensure robust security for your personal and professional needs.
            </p>
            <ul className="text-gray-300 list-disc list-inside text-left mt-8 max-w-3xl mx-auto">
              <li className="mb-1 flex items-center">
                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                Comprehensive protection against various online threats.
              </li>
              <li className="mb-1 flex items-center">
                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                Real-time scanning and threat detection.
              </li>
              <li className="mb-1 flex items-center">
                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                User-friendly interface for easy navigation.
              </li>
              <li className="mb-1 flex items-center">
                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                Affordable subscription plans tailored for Nepali users.
              </li>
              <li className="mb-1 flex items-center">
                <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                24/7 customer support to assist with any issues.
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
                  Our antivirus solutions offer powerful protection against malware, phishing attacks, and other online threats. With a focus on user experience and security, we ensure your devices remain safe while you browse the internet.
                </p>
                <ul className="text-gray-400 list-disc list-inside mt-3">
                  <p className="mt-3 text-white"><strong>Subscription Validity and Pricing:</strong></p>
                  <li>Monthly Subscription: NPR 500</li>
                  <li>Yearly Subscription: NPR 5,500</li>
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
                  <li>Real-time protection against all types of malware.</li>
                  <li>Automatic updates to ensure your antivirus is always up-to-date.</li>
                  <li>User-friendly dashboard for easy management.</li>
                  <li>Access to premium features for enhanced security.</li>
                  <li>Priority customer support for quick resolutions.</li>
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
                  After subscribing, you'll receive an activation link in your email. Click on the link to activate your antivirus software. Follow the installation instructions to set it up on your device.
                </p>
                <ul className="text-gray-400 list-disc list-inside mt-2">
                  <li>Check your email for the activation link.</li>
                  <li>Click the link to begin the installation process.</li>
                  <li>Follow the on-screen instructions to complete the setup.</li>
                  <li>Start scanning your device for threats.</li>
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
                  <li>Ensure you use the activation link provided in your email.</li>
                  <li>Do not share your subscription details with others.</li>
                  <li>Regularly update your antivirus software for optimal performance.</li>
                  <li>Contact customer support for any issues during installation or use.</li>
                </ul>
              </AccordionDetails>
            </Accordion>
          </div>

          <Nepal />

          {/* Footer Section */}
          <footer className="text-center mt-16 text-gray-500">
            <p>&copy; 2024 Antivirus Nepal. All Rights Reserved.</p>
          </footer>
        </div>
      </div>
    </Layout>
  );
};

export default AntivirusNepal;

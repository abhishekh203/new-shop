import React from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { 
  CheckCircleOutline as CheckIcon,
  Security as SecurityIcon,
  Update as UpdateIcon,
  Shield as ShieldIcon,
  SupportAgent as SupportIcon,
  Devices as DevicesIcon,
  VerifiedUser as VerifiedIcon,
  Settings as SettingsIcon,
  Discount as DiscountIcon
} from '@mui/icons-material';
import { HelmetProvider } from 'react-helmet-async';
import Layout from "../components/layout/Layout";
import SEOHelmet from "../components/SEO/SEOHelmet";
import OptimizedImage from "../components/SEO/OptimizedImage";
import Nepal from "./nepal";
import { nepalSEOKeywords, generateNepalMetaDescription, generateNepalTitle, generateNepalProductSchema } from "../utils/nepalSEOKeywords";

const AntivirusNepal = () => {
  // Dynamic Nepal SEO using the utility functions
  const serviceName = "Antivirus";
  const seoFeatures = ["Device protection", "Malware protection", "Online security", "Comprehensive security"];
  
  const meta = {
    title: generateNepalTitle(serviceName, "subscription"),
    description: generateNepalMetaDescription("antivirus", seoFeatures),
    keywords: nepalSEOKeywords.antivirus.join(", "),
    canonical: "https://www.digitalshopnepal.com/AntivirusNepal"
  };

  const antivirusStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Premium Antivirus Protection Nepal",
    "description": "Comprehensive antivirus solution for Nepal with real-time protection and multi-device support",
    "brand": {
      "@type": "Brand",
      "name": "Digital Shop Nepal"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "6 Months Protection",
        "priceCurrency": "NPR",
        "price": "1299",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "name": "1 Year Protection",
        "priceCurrency": "NPR",
        "price": "1999",
        "availability": "https://schema.org/InStock"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "85"
    }
  };

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Subscriptions", url: "/subscription" },
    { name: "Antivirus Nepal", url: "/AntivirusNepal", isLast: true }
  ];

  const pricingPlans = [
    
    { duration: "6 Months", price: "Rs. 1299", discount: "Save 10%" },
    { duration: "1 Year", price: "Rs. 1999", discount: "Save 15%" },
  
  ];

  const features = [
    { icon: <SecurityIcon className="text-red-500" />, text: "Real-time protection against all types of malware" },
    { icon: <UpdateIcon className="text-red-500" />, text: "Automatic updates for continuous security" },
    { icon: <ShieldIcon className="text-red-500" />, text: "Advanced firewall and network protection" },
    { icon: <DevicesIcon className="text-red-500" />, text: "Protection for multiple devices" },
    { icon: <VerifiedIcon className="text-red-500" />, text: "Phishing and fraud protection" },
    { icon: <SupportIcon className="text-red-500" />, text: "24/7 dedicated customer support" }
  ];

  const benefits = [
    { icon: <SecurityIcon />, text: "Comprehensive protection against viruses and malware" },
    { icon: <UpdateIcon />, text: "Regular automatic updates for latest threat definitions" },
    { icon: <ShieldIcon />, text: "Advanced ransomware protection" },
    { icon: <DevicesIcon />, text: "Cross-platform compatibility (Windows, Mac, Android)" },
    { icon: <VerifiedIcon />, text: "Secure browsing and online transaction protection" },
    { icon: <SupportIcon />, text: "Priority technical support" },
    { icon: <DiscountIcon />, text: "Special discounts on renewals" },
    { icon: <SettingsIcon />, text: "Easy-to-use management dashboard" }
  ];

  const rules = [
    "Use the activation link provided in your email",
    "Do not share your subscription details with others",
    "Keep your antivirus updated for optimal protection",
    "Contact support for any installation or usage issues"
  ];

  return (
    <HelmetProvider>
      <SEOHelmet
        title={meta.title}
        description={meta.description}
        keywords={meta.keywords}
        canonical={meta.canonical}
        structuredData={antivirusStructuredData}
        breadcrumbs={breadcrumbs}
        ogType="product"
      />
      <Layout showBreadcrumb={true} customBreadcrumbs={breadcrumbs}>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white"
        >
          {/* Hero Section */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <OptimizedImage
                src="/img/antivirus.png"
                alt="Antivirus Nepal Background"
                className="w-full h-full opacity-10"
                priority={true}
              />
            </div>
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-6">
                  Premium Antivirus Protection in Nepal
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Complete security solution for your devices. Real-time protection against viruses, malware, and online threats.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Features Section */}
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Our Antivirus Solution?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-gray-800/50 p-6 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {feature.icon}
                      </div>
                      <p className="text-gray-300">{feature.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Pricing Section */}
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-8 text-center">Subscription Plans</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {pricingPlans.map((plan, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    className={`bg-gradient-to-br ${index % 2 === 0 ? 'from-gray-800 to-gray-900' : 'from-red-900/80 to-gray-900'} rounded-xl p-6 shadow-lg border border-gray-700`}
                  >
                    <h3 className="text-xl font-bold mb-2">{plan.duration}</h3>
                    <p className="text-2xl font-bold mb-2">{plan.price}</p>
                    {plan.discount && (
                      <p className="text-green-400 text-sm mb-4">{plan.discount}</p>
                    )}
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-300">
                      Get Protection
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Accordion Sections */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto space-y-4"
            >
              <Accordion className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="text-white" />}
                  className="hover:bg-gray-700/50 transition"
                >
                  <h2 className="text-xl font-semibold">Subscription Benefits</h2>
                </AccordionSummary>
                <AccordionDetails className="bg-gray-900/50">
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="text-red-500 mt-1">{benefit.icon}</span>
                        <span className="text-gray-300">{benefit.text}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Accordion className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="text-white" />}
                  className="hover:bg-gray-700/50 transition"
                >
                  <h2 className="text-xl font-semibold">How to Use</h2>
                </AccordionSummary>
                <AccordionDetails className="bg-gray-900/50">
                  <p className="text-gray-300 mb-4">
                    After subscribing, you'll receive an email with activation instructions to set up your antivirus protection.
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <CheckIcon className="text-green-500 mr-2 mt-1" />
                      <span>Check your email for the activation link and license key</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="text-green-500 mr-2 mt-1" />
                      <span>Download and install the antivirus software from our secure server</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="text-green-500 mr-2 mt-1" />
                      <span>Activate using the provided license key</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="text-green-500 mr-2 mt-1" />
                      <span>Run your first scan to ensure complete protection</span>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Accordion className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className="text-white" />}
                  className="hover:bg-gray-700/50 transition"
                >
                  <h2 className="text-xl font-semibold">Rules to Follow</h2>
                </AccordionSummary>
                <AccordionDetails className="bg-gray-900/50">
                  <ul className="space-y-2">
                    {rules.map((rule, index) => (
                      <li key={index} className="flex items-start">
                        <CheckIcon className="text-red-500 mr-2 mt-1" />
                        <span className="text-gray-300">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionDetails>
              </Accordion>
            </motion.div>

            {/* Nepal Component */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <Nepal />
            </motion.div>
          </div>

          {/* Footer */}
          <footer className="bg-black/50 py-8 text-center text-gray-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p>&copy; {new Date().getFullYear()} Digital Shop Nepal. All Rights Reserved.</p>
            </div>
          </footer>
        </motion.div>
      </Layout>
    </HelmetProvider>
  );
};

export default AntivirusNepal;
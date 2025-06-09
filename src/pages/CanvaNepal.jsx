import React from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { 
  CheckCircle as CheckIcon,
  Palette as TemplateIcon,
  DragIndicator as DragIcon,
  Group as TeamIcon,
  CloudDownload as DownloadIcon,
  Brush as EditIcon,
  BrandingWatermark as BrandIcon,
  Storage as CloudIcon,
  Copyright as CopyrightIcon,
  Lock as LockIcon,
  Report as ReportIcon
} from '@mui/icons-material';
import { HelmetProvider } from 'react-helmet-async';
import Layout from "../components/layout/Layout";
import SEOHelmet from "../components/SEO/SEOHelmet";
import OptimizedImage from "../components/SEO/OptimizedImage";
import Nepal from "./nepal";

const CanvaNepal = () => {
    const meta = {
        title: "Canva Nepal - Create Stunning Graphics & Designs",
        description: "Unlock your creativity with Canva in Nepal. Access thousands of customizable templates and collaborate with your team in real-time. Ideal for all your design needs.",
        keywords: "Canva Nepal, canva buy nepal, canva subscription nepal, Canva design Nepal, Canva templates, Create designs Nepal, Online design tool Nepal, Create graphics Nepal",
        canonical: "https://www.digitalshopnepal.com/CanvaNepal"
    };

    const canvaStructuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Canva Pro Subscription Nepal",
        "description": "Premium Canva subscription for Nepal with unlimited templates, advanced design tools, and team collaboration",
        "brand": {
            "@type": "Brand",
            "name": "Canva"
        },
        "offers": {
            "@type": "Offer",
            "name": "Pro Plan",
            "priceCurrency": "NPR",
            "price": "2250",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "Digital Shop Nepal"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "75"
        }
    };

    const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Subscriptions", url: "/subscription" },
        { name: "Canva Nepal", url: "/CanvaNepal", isLast: true }
    ];

    const pricingPlans = [
        { 
            name: "Free Plan", 
            price: "Free", 
            features: ["Basic templates", "Limited design elements", "Standard images"] 
        },
        { 
            name: "Pro Plan", 
            price: "NPR 2,250/year", 
            features: ["Premium templates", "Advanced design tools", "Brand kits", "Cloud storage", "Team collaboration"],
            popular: true
        }
    ];

    const features = [
        { icon: <TemplateIcon className="text-blue-400" />, text: "Access to thousands of customizable templates" },
        { icon: <DragIcon className="text-blue-400" />, text: "User-friendly drag-and-drop interface" },
        { icon: <TeamIcon className="text-blue-400" />, text: "Real-time collaboration with team members" },
        { icon: <DownloadIcon className="text-blue-400" />, text: "Download designs in multiple formats" }
    ];

    const benefits = [
        { icon: <TemplateIcon />, text: "Unlimited premium templates and design elements" },
        { icon: <EditIcon />, text: "Advanced editing tools for enhanced creativity" },
        { icon: <TeamIcon />, text: "Collaboration features for teamwork" },
        { icon: <BrandIcon />, text: "Create brand kits for consistent branding" },
        { icon: <CloudIcon />, text: "Cloud storage for projects, accessible anywhere" }
    ];

    const usageSteps = [
        "Create an account on the Canva website or app",
        "Check your email for an invite link and accept it",
        "Choose a template or start from scratch",
        "Use the drag-and-drop editor to customize",
        "Save and share your work in various formats"
    ];

    const rules = [
        { icon: <CopyrightIcon />, text: "Respect copyright when using images and templates" },
        { icon: <LockIcon />, text: "Do not share your Canva account credentials" },
        { icon: <BrandIcon />, text: "Use designs for personal or authorized commercial use only" },
        { icon: <ReportIcon />, text: "Report any technical issues to Canva support" }
    ];

    return (
        <HelmetProvider>
            <SEOHelmet
                title={meta.title}
                description={meta.description}
                keywords={meta.keywords}
                canonical={meta.canonical}
                structuredData={canvaStructuredData}
                breadcrumbs={breadcrumbs}
                ogType="product"
            />
            <Layout showBreadcrumb={true} customBreadcrumbs={breadcrumbs}>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-white"
                >
                    {/* Hero Section */}
                    <div className="relative overflow-hidden">
                        <div className="absolute inset-0 z-0">
                            <OptimizedImage
                                src="/img/canva.png"
                                alt="Canva Nepal Background"
                                className="w-full h-full opacity-10"
                                priority={true}
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70 z-10"></div>
                        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="text-center"
                            >
                                <h1 className="text-4xl md:text-5xl font-bold text-blue-400 mb-6">
                                    Canva Nepal Subscription
                                </h1>
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                    Create stunning designs with ease using Canva's powerful tools and templates
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
                            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Canva?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {pricingPlans.map((plan, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.02 }}
                                        className={`bg-gradient-to-br ${plan.popular ? 'from-blue-800/80 to-purple-900/80' : 'from-gray-800 to-gray-900'} rounded-xl p-8 shadow-lg border ${plan.popular ? 'border-blue-500' : 'border-gray-700'} relative`}
                                    >
                                        {plan.popular && (
                                            <div className="absolute -top-3 -right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                POPULAR
                                            </div>
                                        )}
                                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                        <p className="text-3xl font-bold mb-4">{plan.price}</p>
                                        <ul className="space-y-2 mb-6">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <CheckIcon className="text-green-400 mr-2 mt-1" />
                                                    <span className="text-gray-300">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                            Get Started
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
                                                <span className="text-blue-400 mt-1">{benefit.icon}</span>
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
                                        Get started with Canva in just a few simple steps:
                                    </p>
                                    <ul className="space-y-2 text-gray-300">
                                        {usageSteps.map((step, index) => (
                                            <li key={index} className="flex items-start">
                                                <CheckIcon className="text-blue-400 mr-2 mt-1" />
                                                <span>{step}</span>
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
                                    <h2 className="text-xl font-semibold">Rules to Follow</h2>
                                </AccordionSummary>
                                <AccordionDetails className="bg-gray-900/50">
                                    <ul className="space-y-2">
                                        {rules.map((rule, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="text-blue-400 mr-2 mt-1">{rule.icon}</span>
                                                <span className="text-gray-300">{rule.text}</span>
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

export default CanvaNepal;
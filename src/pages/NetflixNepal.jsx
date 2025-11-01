import React from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { 
  CheckCircleOutline as CheckIcon,
  Devices as DevicesIcon,
  HighQuality as QualityIcon,
  Lock as LockIcon,
  Autorenew as RenewIcon,
  Security as SecurityIcon,
  Public as NoVpnIcon,
  LocalMovies as MoviesIcon,
  Discount as DiscountIcon,
  Support as SupportIcon
} from '@mui/icons-material';
import { HelmetProvider } from 'react-helmet-async';
import Layout from "../components/layout/Layout";
import SEOHelmet from "../components/SEO/SEOHelmet";
import Nepal from "./nepal";
import { nepalSEOKeywords, generateNepalMetaDescription, generateNepalTitle, generateNepalProductSchema } from "../utils/nepalSEOKeywords";

const NetflixNepal = () => {
    // Dynamic Nepal SEO using the utility functions
    const serviceName = "Netflix";
    const seoFeatures = ["Ultra HD streaming", "No VPN required", "Private profile", "Instant delivery"];
    
    const meta = {
        title: "Netflix Nepal - Premium Subscription at Best Prices NPR 399 | Digital Shop Nepal",
        description: "Get Netflix Premium subscription in Nepal at lowest prices starting NPR 399. Ultra HD streaming, no VPN required, instant delivery. Available in Kathmandu, Pokhara & all Nepal. eSewa, Khalti payment accepted. 24/7 support.",
        keywords: [
            ...nepalSEOKeywords.netflix,
            "netflix nepal 2025", "netflix subscription nepal 2025", "netflix premium nepal 2024",
            "netflix esewa nepal", "netflix khalti nepal", "netflix bank transfer nepal",
            "netflix ultra hd nepal", "netflix 4k nepal", "netflix original nepal",
            "netflix mobile nepal", "netflix tv nepal", "netflix laptop nepal",
            "netflix family nepal", "netflix sharing nepal", "netflix profile nepal",
            "digital shop nepal netflix", "best netflix price nepal", "cheapest netflix nepal",
            "netflix instant delivery nepal", "netflix customer support nepal"
        ].join(", "),
        canonical: "https://www.digitalshopnepal.com/NetflixNepal"
    };

    const pricingPlans = [
        { duration: "1 Month", price: "Rs. 399" },
        { duration: "3 Months", price: "Rs. 1,169", discount: "Save 2%" },
        { duration: "6 Months", price: "Rs. 2,300", discount: "Save 4%" },
        { duration: "1 Year", price: "Rs. 4,499", discount: "Save 6%" }
    ];

    const features = [
        { icon: <DevicesIcon className="text-red-500" />, text: "1 Screen means only 1 user but private profile" },
        { icon: <LockIcon className="text-red-500" />, text: "Pin-Locked Profile: A secure profile protected with a PIN" },
        { icon: <QualityIcon className="text-red-500" />, text: "Ultra HD Streaming: Experience high-quality streaming" },
        { icon: <RenewIcon className="text-red-500" />, text: "Easily renew your account without losing settings" },
        { icon: <SecurityIcon className="text-red-500" />, text: "100% secure accounts, delivered with Email ID and Password" },
        { icon: <NoVpnIcon className="text-red-500" />, text: "No VPN required for any country" }
    ];

    const benefits = [
        { icon: <DevicesIcon />, text: "One Screen Access: Stream content on one device at a time" },
        { icon: <QualityIcon />, text: "Ultra HD for an immersive viewing experience" },
        { icon: <LockIcon />, text: "Secure PIN-locked profile" },
        { icon: <RenewIcon />, text: "Seamless subscription renewals" },
        { icon: <NoVpnIcon />, text: "Works in Nepal without VPN" },
        { icon: <SupportIcon />, text: "Dedicated support for account-related issues" },
        { icon: <DiscountIcon />, text: "Access to promotions and discounts" },
        { icon: <MoviesIcon />, text: "Unlimited access to Netflix's entire library" }
    ];

    const rules = [
        "Use only the provided profile to ensure smooth streaming",
        "Do not change the account email or password",
        "Do not add a mobile number to the account settings",
        "Log out from the current device before logging in on another"
    ];

    // Enhanced structured data for Netflix Nepal
    const netflixStructuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Netflix Premium Subscription Nepal",
        "description": "Premium Netflix subscription for Nepal with Ultra HD streaming, no VPN required, PIN-protected profiles, and instant delivery. Stream unlimited movies, TV shows, and Netflix Originals.",
        "brand": {
            "@type": "Brand",
            "name": "Netflix"
        },
        "category": "Digital Entertainment Subscription",
        "image": "https://digitalshopnepal.com/img/netflix.png",
        "offers": [
            {
                "@type": "Offer",
                "name": "1 Month Netflix Nepal",
                "price": "399",
                "priceCurrency": "NPR",
                "availability": "https://schema.org/InStock",
                "validFrom": new Date().toISOString(),
                "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                "seller": {
                    "@type": "Organization",
                    "name": "Digital Shop Nepal"
                }
            },
            {
                "@type": "Offer",
                "name": "3 Months Netflix Nepal",
                "price": "1169",
                "priceCurrency": "NPR",
                "availability": "https://schema.org/InStock",
                "validFrom": new Date().toISOString(),
                "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                "seller": {
                    "@type": "Organization",
                    "name": "Digital Shop Nepal"
                }
            },
            {
                "@type": "Offer",
                "name": "6 Months Netflix Nepal",
                "price": "2300",
                "priceCurrency": "NPR",
                "availability": "https://schema.org/InStock",
                "validFrom": new Date().toISOString(),
                "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                "seller": {
                    "@type": "Organization",
                    "name": "Digital Shop Nepal"
                }
            },
            {
                "@type": "Offer",
                "name": "1 Year Netflix Nepal",
                "price": "4499",
                "priceCurrency": "NPR",
                "availability": "https://schema.org/InStock",
                "validFrom": new Date().toISOString(),
                "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                "seller": {
                    "@type": "Organization",
                    "name": "Digital Shop Nepal"
                }
            }
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "2847",
            "bestRating": "5",
            "worstRating": "1"
        },
        "audience": {
            "@type": "Audience",
            "geographicArea": {
                "@type": "Country",
                "name": "Nepal"
            }
        },
        "isAccessibleForFree": false,
        "hasPart": [
            {
                "@type": "Service",
                "name": "Ultra HD Streaming",
                "description": "Stream content in Ultra HD 4K quality"
            },
            {
                "@type": "Service", 
                "name": "Netflix Originals",
                "description": "Access to exclusive Netflix Original content"
            },
            {
                "@type": "Service",
                "name": "PIN Protection",
                "description": "Secure PIN-protected personal profile"
            },
            {
                "@type": "Service",
                "name": "No VPN Required",
                "description": "Works directly in Nepal without VPN"
            }
        ]
    };

    // FAQ structured data for Netflix Nepal
    const faqStructuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What's the cheapest Netflix Premium price in Nepal?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Netflix Premium subscription in Nepal starts from NPR 399 for 1 month. We also offer 3 months for NPR 1,169, 6 months for NPR 2,300, and 1 year for NPR 4,499 with additional savings."
                }
            },
            {
                "@type": "Question", 
                "name": "Do I need VPN to use Netflix in Nepal?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No, you don't need any VPN to use Netflix in Nepal. Our Netflix subscriptions work directly in Nepal without requiring any VPN or proxy services."
                }
            },
            {
                "@type": "Question",
                "name": "What quality can I stream Netflix in Nepal?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can stream Netflix in Ultra HD 4K quality in Nepal. Our subscriptions support high-definition streaming for the best viewing experience on all compatible devices."
                }
            },
            {
                "@type": "Question",
                "name": "How do I get Netflix subscription in Nepal?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Simply choose your preferred plan, add to cart, and complete payment using eSewa, Khalti, or bank transfer. You'll receive your Netflix account details via email within minutes for instant access."
                }
            },
            {
                "@type": "Question",
                "name": "Is Netflix account sharing safe in Nepal?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, our Netflix subscriptions provide you with a secure, PIN-protected personal profile. Your viewing history and preferences remain private and secure."
                }
            },
            {
                "@type": "Question",
                "name": "Can I use Netflix on multiple devices in Nepal?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our Netflix subscription allows streaming on one screen at a time, but you can use it on multiple devices like mobile, laptop, tablet, or TV by logging in and out as needed."
                }
            }
        ]
    };

    const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Subscriptions", url: "/subscription" },
        { name: "Netflix Nepal", url: "/NetflixNepal", isLast: true }
    ];

    return (
        <HelmetProvider>
            <SEOHelmet
                title={meta.title}
                description={meta.description}
                keywords={meta.keywords}
                canonical={meta.canonical}
                structuredData={[netflixStructuredData, faqStructuredData]}
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
                        <div className="absolute inset-0 bg-black/60 z-0"></div>
                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="text-center"
                            >
                                <h1 className="text-4xl md:text-6xl font-bold text-red-600 mb-6 leading-tight">
                                    Netflix Nepal Premium Subscription
                                    <span className="block text-3xl md:text-4xl text-white mt-2">
                                        Starting NPR 399 Only 🔥
                                    </span>
                                </h1>
                                <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-6 leading-relaxed">
                                    Get Netflix Premium subscription in Nepal at the <strong className="text-red-400">lowest prices</strong>. 
                                    Stream unlimited Ultra HD movies, TV shows & Netflix Originals. 
                                    <strong className="text-green-400"> No VPN required</strong>, instant delivery, secure PIN-protected profiles.
                                </p>
                                <div className="bg-gradient-to-r from-red-600/20 to-black/20 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto mb-6">
                                    <p className="text-lg text-yellow-300 font-semibold mb-2">
                                        🎯 Why Choose Digital Shop Nepal for Netflix?
                                    </p>
                                    <p className="text-gray-200">
                                        Trusted by <strong>10,000+ customers</strong> across Nepal. Best prices, instant delivery, 
                                        24/7 support, and works perfectly in Kathmandu, Pokhara, Lalitpur & all Nepal cities.
                                    </p>
                                </div>
                                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                                    <span className="flex items-center bg-gray-800/50 px-4 py-2 rounded-full">
                                        <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                                        Works in Kathmandu, Pokhara & all Nepal
                                    </span>
                                    <span className="flex items-center bg-gray-800/50 px-4 py-2 rounded-full">
                                        <CheckIcon className="w-5 h-5 text-blue-500 mr-2" />
                                        eSewa, Khalti & Bank Transfer
                                    </span>
                                    <span className="flex items-center bg-gray-800/50 px-4 py-2 rounded-full">
                                        <CheckIcon className="w-5 h-5 text-yellow-500 mr-2" />
                                        Instant Delivery (2-5 minutes)
                                    </span>
                                    <span className="flex items-center bg-gray-800/50 px-4 py-2 rounded-full">
                                        <CheckIcon className="w-5 h-5 text-purple-500 mr-2" />
                                        24/7 Nepal Customer Support
                                    </span>
                                    <span className="flex items-center bg-gray-800/50 px-4 py-2 rounded-full">
                                        <CheckIcon className="w-5 h-5 text-red-500 mr-2" />
                                        Ultra HD 4K Quality
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        {/* Nepal Trust Indicators Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="mb-16"
                        >
                            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-3xl p-8 border border-green-500/20">
                                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-green-400">
                                    🇳🇵 Trusted Netflix Provider in Nepal
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                                    <div className="space-y-3">
                                        <div className="text-4xl font-bold text-yellow-400">10,000+</div>
                                        <p className="text-gray-300">Happy Customers in Nepal</p>
                                        <p className="text-sm text-gray-400">From Kathmandu to Pokhara</p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="text-4xl font-bold text-green-400">2-5 Min</div>
                                        <p className="text-gray-300">Instant Account Delivery</p>
                                        <p className="text-sm text-gray-400">Fastest in Nepal</p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="text-4xl font-bold text-blue-400">24/7</div>
                                        <p className="text-gray-300">Nepal Customer Support</p>
                                        <p className="text-sm text-gray-400">Nepali & English</p>
                                    </div>
                                </div>
                                
                                {/* Customer Reviews */}
                                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50">
                                        <div className="flex items-center mb-4">
                                            <div className="flex text-yellow-400 mr-3">
                                                ⭐⭐⭐⭐⭐
                                            </div>
                                            <span className="font-semibold">Rajesh K. - Kathmandu</span>
                                        </div>
                                        <p className="text-gray-300 text-sm">
                                            "Best Netflix price in Nepal! Got my account in 3 minutes. Works perfectly without VPN. 
                                            Highly recommend Digital Shop Nepal for Netflix subscription."
                                        </p>
                                    </div>
                                    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50">
                                        <div className="flex items-center mb-4">
                                            <div className="flex text-yellow-400 mr-3">
                                                ⭐⭐⭐⭐⭐
                                            </div>
                                            <span className="font-semibold">Priya S. - Pokhara</span>
                                        </div>
                                        <p className="text-gray-300 text-sm">
                                            "Amazing service! Paid through eSewa and got Netflix instantly. 
                                            Ultra HD quality works great in Pokhara. Customer support is excellent!"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* Features Section */}
                        <motion.section 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="mb-16"
                        >
                            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Netflix Premium Nepal?</h2>
                            <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
                                Get the best Netflix experience in Nepal with our premium subscriptions. Stream unlimited content with Ultra HD quality, 
                                no VPN required, and enjoy secure PIN-protected profiles with instant delivery across Kathmandu, Pokhara, and all Nepal.
                            </p>
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
                            <h2 className="text-3xl font-bold mb-4 text-center">Netflix Nepal Pricing Plans - Best Prices Guaranteed</h2>
                            <div className="text-center mb-8">
                                <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                                    🔥 LIMITED TIME: Extra 5% OFF on Annual Plans
                                </span>
                            </div>
                            <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
                                Choose from our affordable Netflix subscription plans in Nepal. All plans include <strong className="text-red-400">Ultra HD 4K streaming</strong>, 
                                no VPN requirement, and <strong className="text-green-400">instant account delivery</strong>. 
                                Pay with <strong className="text-blue-400">eSewa, Khalti, or bank transfer</strong>.
                            </p>
                            
                            {/* Payment Methods Display */}
                            <div className="flex justify-center items-center gap-6 mb-12 flex-wrap">
                                <div className="bg-blue-600/20 px-4 py-2 rounded-xl border border-blue-500/30">
                                    <span className="text-blue-300 font-semibold">💳 eSewa</span>
                                </div>
                                <div className="bg-purple-600/20 px-4 py-2 rounded-xl border border-purple-500/30">
                                    <span className="text-purple-300 font-semibold">💳 Khalti</span>
                                </div>
                                <div className="bg-green-600/20 px-4 py-2 rounded-xl border border-green-500/30">
                                    <span className="text-green-300 font-semibold">🏦 Bank Transfer</span>
                                </div>
                                <div className="bg-yellow-600/20 px-4 py-2 rounded-xl border border-yellow-500/30">
                                    <span className="text-yellow-300 font-semibold">📱 Mobile Banking</span>
                                </div>
                            </div>
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
                                            Get Now
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
                                        After subscribing, you'll receive a personal account under our shared subscription. You can start watching instantly.
                                    </p>
                                    <ul className="space-y-2 text-gray-300">
                                        <li className="flex items-start">
                                            <CheckIcon className="text-green-500 mr-2 mt-1" />
                                            <span>For mobile, laptop, or tablet access, follow the instructions sent to your email</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckIcon className="text-green-500 mr-2 mt-1" />
                                            <span>For TV, sign in using a provided code or by contacting us for support</span>
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

                        {/* FAQ Section */}
                        <motion.section
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            viewport={{ once: true }}
                            className="mb-16"
                        >
                            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                            <div className="max-w-4xl mx-auto space-y-4">
                                <Accordion className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon className="text-white" />}
                                        className="hover:bg-gray-700/50 transition"
                                    >
                                        <h3 className="text-lg font-semibold">What's the cheapest Netflix Premium price in Nepal?</h3>
                                    </AccordionSummary>
                                    <AccordionDetails className="bg-gray-900/50">
                                        <p className="text-gray-300">
                                            Netflix Premium subscription in Nepal starts from <strong className="text-red-400">NPR 399 for 1 month</strong>. 
                                            We also offer 3 months for NPR 1,169, 6 months for NPR 2,300, and 1 year for NPR 4,499 with additional savings. 
                                            These are the best prices available in Nepal with instant delivery and local support.
                                        </p>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon className="text-white" />}
                                        className="hover:bg-gray-700/50 transition"
                                    >
                                        <h3 className="text-lg font-semibold">Do I need VPN to use Netflix in Nepal?</h3>
                                    </AccordionSummary>
                                    <AccordionDetails className="bg-gray-900/50">
                                        <p className="text-gray-300">
                                            <strong className="text-green-400">No, you don't need any VPN</strong> to use Netflix in Nepal. 
                                            Our Netflix subscriptions work directly in Nepal without requiring any VPN or proxy services. 
                                            You can stream content seamlessly in Kathmandu, Pokhara, Lalitpur, and all cities across Nepal.
                                        </p>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon className="text-white" />}
                                        className="hover:bg-gray-700/50 transition"
                                    >
                                        <h3 className="text-lg font-semibold">What quality can I stream Netflix in Nepal?</h3>
                                    </AccordionSummary>
                                    <AccordionDetails className="bg-gray-900/50">
                                        <p className="text-gray-300">
                                            You can stream Netflix in <strong className="text-red-400">Ultra HD 4K quality</strong> in Nepal. 
                                            Our subscriptions support high-definition streaming for the best viewing experience on all compatible devices 
                                            including mobile phones, laptops, tablets, and smart TVs.
                                        </p>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon className="text-white" />}
                                        className="hover:bg-gray-700/50 transition"
                                    >
                                        <h3 className="text-lg font-semibold">How do I get Netflix subscription in Nepal?</h3>
                                    </AccordionSummary>
                                    <AccordionDetails className="bg-gray-900/50">
                                        <p className="text-gray-300">
                                            Simply choose your preferred plan, add to cart, and complete payment using <strong className="text-blue-400">eSewa, Khalti, or bank transfer</strong>. 
                                            You'll receive your Netflix account details via email within minutes for instant access. 
                                            Our customer support team is available to help with any setup questions.
                                        </p>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon className="text-white" />}
                                        className="hover:bg-gray-700/50 transition"
                                    >
                                        <h3 className="text-lg font-semibold">Is Netflix account sharing safe in Nepal?</h3>
                                    </AccordionSummary>
                                    <AccordionDetails className="bg-gray-900/50">
                                        <p className="text-gray-300">
                                            Yes, our Netflix subscriptions provide you with a <strong className="text-green-400">secure, PIN-protected personal profile</strong>. 
                                            Your viewing history and preferences remain private and secure. We ensure 100% account safety with proper profile management.
                                        </p>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon className="text-white" />}
                                        className="hover:bg-gray-700/50 transition"
                                    >
                                        <h3 className="text-lg font-semibold">Can I use Netflix on multiple devices in Nepal?</h3>
                                    </AccordionSummary>
                                    <AccordionDetails className="bg-gray-900/50">
                                        <p className="text-gray-300">
                                            Our Netflix subscription allows <strong className="text-red-400">streaming on one screen at a time</strong>, 
                                            but you can use it on multiple devices like mobile, laptop, tablet, or TV by logging in and out as needed. 
                                            This provides flexibility while maintaining account security.
                                        </p>
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        </motion.section>

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

export default NetflixNepal;
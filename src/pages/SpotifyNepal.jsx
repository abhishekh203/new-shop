import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { HelmetProvider } from 'react-helmet-async';
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import SEOHelmet from "../components/SEO/SEOHelmet";
import OptimizedImage from "../components/SEO/OptimizedImage";
import Nepal from "./nepal";
import { nepalSEOKeywords, generateNepalMetaDescription, generateNepalTitle, generateNepalProductSchema } from "../utils/nepalSEOKeywords";

const SpotifyNepal = () => {
    // Dynamic Nepal SEO using the utility functions
    const serviceName = "Spotify";
    const seoFeatures = ["Music streaming", "Podcasts", "Offline downloads", "No VPN required"];
    
    const meta = {
        title: "Spotify Premium Nepal - Best Prices | Ad-Free Music Streaming | Digital Shop Nepal",
        description: "Buy Spotify Premium subscription in Nepal at best prices starting from NPR 499. Ad-free music streaming, offline downloads, unlimited skips. No VPN required. Instant activation with genuine accounts.",
        keywords: nepalSEOKeywords.spotify.join(", "),
        canonical: "https://www.digitalshopnepal.com/SpotifyNepal"
    };

    const spotifyStructuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Spotify Premium Subscription Nepal",
        "description": "Premium Spotify subscription for Nepal with ad-free music streaming, offline downloads, unlimited skips, and high-quality audio. No VPN required, works perfectly in Nepal.",
        "brand": {
            "@type": "Brand",
            "name": "Spotify",
            "logo": "https://www.digitalshopnepal.com/img/spotify.png"
        },
        "image": [
            "https://www.digitalshopnepal.com/img/spotify.png",
            "https://www.digitalshopnepal.com/img/digital.jpg"
        ],
        "category": "Digital Music Streaming Service",
        "keywords": "Spotify Premium Nepal, music streaming Nepal, ad-free music, offline downloads, unlimited skips",
        "offers": [
            {
                "@type": "Offer",
                "name": "1 Month Spotify Premium Nepal",
                "priceCurrency": "NPR",
                "price": "499",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2024-12-31",
                "itemCondition": "https://schema.org/NewCondition",
                "seller": {
                    "@type": "Organization",
                    "name": "Digital Shop Nepal",
                    "url": "https://www.digitalshopnepal.com",
                    "address": {
                        "@type": "PostalAddress",
                        "addressCountry": "NP",
                        "addressLocality": "Kathmandu",
                        "addressRegion": "Bagmati Province"
                    }
                },
                "areaServed": {
                    "@type": "Country",
                    "name": "Nepal"
                },
                "eligibleRegion": {
                    "@type": "Country",
                    "name": "Nepal"
                }
            },
            {
                "@type": "Offer",
                "name": "3 Months Spotify Premium Nepal",
                "priceCurrency": "NPR",
                "price": "1349",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2024-12-31",
                "itemCondition": "https://schema.org/NewCondition",
                "seller": {
                    "@type": "Organization",
                    "name": "Digital Shop Nepal",
                    "url": "https://www.digitalshopnepal.com",
                    "address": {
                        "@type": "PostalAddress",
                        "addressCountry": "NP",
                        "addressLocality": "Kathmandu",
                        "addressRegion": "Bagmati Province"
                    }
                },
                "areaServed": {
                    "@type": "Country",
                    "name": "Nepal"
                },
                "eligibleRegion": {
                    "@type": "Country",
                    "name": "Nepal"
                }
            },
            {
                "@type": "Offer",
                "name": "6 Months Spotify Premium Nepal",
                "priceCurrency": "NPR",
                "price": "2149",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2024-12-31",
                "itemCondition": "https://schema.org/NewCondition",
                "seller": {
                    "@type": "Organization",
                    "name": "Digital Shop Nepal",
                    "url": "https://www.digitalshopnepal.com",
                    "address": {
                        "@type": "PostalAddress",
                        "addressCountry": "NP",
                        "addressLocality": "Kathmandu",
                        "addressRegion": "Bagmati Province"
                    }
                },
                "areaServed": {
                    "@type": "Country",
                    "name": "Nepal"
                },
                "eligibleRegion": {
                    "@type": "Country",
                    "name": "Nepal"
                }
            },
            {
                "@type": "Offer",
                "name": "1 Year Spotify Premium Nepal",
                "priceCurrency": "NPR",
                "price": "3649",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2024-12-31",
                "itemCondition": "https://schema.org/NewCondition",
                "seller": {
                    "@type": "Organization",
                    "name": "Digital Shop Nepal",
                    "url": "https://www.digitalshopnepal.com",
                    "address": {
                        "@type": "PostalAddress",
                        "addressCountry": "NP",
                        "addressLocality": "Kathmandu",
                        "addressRegion": "Bagmati Province"
                    }
                },
                "areaServed": {
                    "@type": "Country",
                    "name": "Nepal"
                },
                "eligibleRegion": {
                    "@type": "Country",
                    "name": "Nepal"
                }
            }
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "150",
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
                "name": "Ad-free Music Streaming",
                "description": "Listen to unlimited music without advertisements"
            },
            {
                "@type": "Service", 
                "name": "Offline Downloads",
                "description": "Download songs and listen offline without internet"
            },
            {
                "@type": "Service",
                "name": "Unlimited Skips",
                "description": "Skip any song unlimited times"
            },
            {
                "@type": "Service",
                "name": "High Quality Audio",
                "description": "Stream music in high quality up to 320kbps"
            }
        ]
    };

    const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Subscriptions", url: "/subscription" },
        { name: "Spotify Nepal", url: "/SpotifyNepal", isLast: true }
    ];

    // FAQ Structured Data for better search visibility
    const faqStructuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Does Spotify Premium work in Nepal without VPN?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! Our Spotify Premium subscriptions work perfectly in Nepal without requiring any VPN. You can stream music directly from Kathmandu, Pokhara, Lalitpur, or anywhere in Nepal."
                }
            },
            {
                "@type": "Question", 
                "name": "What's the cheapest Spotify Premium price in Nepal?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We offer the cheapest Spotify Premium in Nepal starting from just NPR 499 for 1 month. Our pricing: 1 month (NPR 499), 3 months (NPR 1349), 6 months (NPR 2149), 1 year (NPR 3649)."
                }
            },
            {
                "@type": "Question",
                "name": "How do I pay for Spotify Premium in Nepal?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We accept all major Nepali payment methods including eSewa, Khalti, IME Pay, bank transfer, and cash payments. All prices are in NPR."
                }
            },
            {
                "@type": "Question",
                "name": "Is this genuine Spotify Premium or fake?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We provide 100% genuine Spotify Premium accounts. You'll get all official features including ad-free streaming, offline downloads, unlimited skips, and high-quality audio."
                }
            },
            {
                "@type": "Question",
                "name": "How fast is the activation for Spotify Premium Nepal?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Activation is instant! Once payment is confirmed, you'll receive your Spotify Premium access within 5-10 minutes. Our team works 24/7 to ensure quick delivery."
                }
            }
        ]
    };

    return (
        <HelmetProvider>
            <SEOHelmet
                title={meta.title}
                description={meta.description}
                keywords={meta.keywords}
                canonical={meta.canonical}
                structuredData={spotifyStructuredData}
                breadcrumbs={breadcrumbs}
                ogType="product"
            />
            
            {/* Additional FAQ Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(faqStructuredData)}
            </script>
            <Layout showBreadcrumb={true} customBreadcrumbs={breadcrumbs}>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-screen bg-gradient-to-b from-black via-green-900 to-black p-8 text-white relative"
                >
                    {/* Hero Background Image */}
                    <div className="absolute inset-0 z-0">
                        <OptimizedImage
                            src="/img/spotify.png"
                            alt="Spotify Premium Nepal Background"
                            className="w-full h-full opacity-10"
                            priority={true}
                        />
                    </div>

                    {/* Content Section */}
                    <div className="relative z-10">
                        {/* Enhanced Hero Section */}
                        <motion.section
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="text-center p-10"
                        >
                            <motion.h1
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-5xl md:text-6xl font-bold text-green-500 mb-6"
                            >
                                Spotify Premium Nepal - Best Prices
                            </motion.h1>
                            <div className="text-xl text-gray-300 leading-relaxed space-y-4">
                                <p>
                                    Get <strong className="text-green-400">Spotify Premium subscription in Nepal</strong> at the most affordable prices starting from just <strong className="text-yellow-400">NPR 499</strong>. Enjoy unlimited ad-free music streaming, offline downloads, and unlimited skips without any VPN requirements.
                                </p>
                                <p>
                                    Our <strong className="text-green-400">genuine Spotify Premium accounts</strong> work perfectly in Nepal across all major cities including Kathmandu, Pokhara, Lalitpur, Bhaktapur, and Chitwan. Experience high-quality audio streaming with instant activation and 24/7 customer support.
                                </p>
                                <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 p-4 rounded-lg border border-green-500/20">
                                    <p className="text-green-300 font-semibold">
                                        🎵 Why Choose Our Spotify Premium Nepal Service?
                                    </p>
                                    <p className="text-sm text-gray-300 mt-2">
                                        ✅ Cheapest prices in Nepal • ✅ No VPN required • ✅ Instant activation • ✅ Works on all devices • ✅ 24/7 support
                                    </p>
                                </div>
                            </div>
                            <ul className="text-gray-400 list-disc list-inside text-left mt-8 max-w-3xl mx-auto">
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    Available with a personal email for easy access and secure login.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    Unlimited skips and ad-free listening.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    Download your favorite tracks and listen offline.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    High-quality audio for the best listening experience.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    Create and share personalized playlists.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    Accessible on any device: mobile, desktop, or tablet.
                                </li>
                                <li className="mb-1 flex items-center">
                                    <CheckCircleOutlineIcon className="text-green-500 mr-2" />
                                    No VPN required for Spotify in Nepal.
                                </li>
                            </ul>
                        </motion.section>

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
                                    <div className="space-y-4">
                                        <p className="text-gray-300">
                                            <strong className="text-green-400">Spotify Premium Nepal</strong> offers the best music streaming experience at unbeatable prices. Our genuine Spotify Premium subscriptions work seamlessly across Nepal without requiring any VPN. Perfect for music lovers in Kathmandu, Pokhara, Lalitpur, and all major Nepali cities.
                                        </p>
                                        
                                        <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30">
                                            <h4 className="text-green-300 font-semibold mb-2">🎯 Why We're Nepal's #1 Choice for Spotify Premium:</h4>
                                            <ul className="text-gray-300 text-sm space-y-1">
                                                <li>• <strong>Cheapest prices in Nepal</strong> - Save up to 70% compared to official rates</li>
                                                <li>• <strong>No VPN required</strong> - Works directly in Nepal</li>
                                                <li>• <strong>Instant activation</strong> - Get access within minutes</li>
                                                <li>• <strong>Genuine accounts</strong> - 100% original Spotify Premium</li>
                                                <li>• <strong>Local support</strong> - Customer service in Nepali/English</li>
                                            </ul>
                                        </div>

                                        <div className="bg-gray-800/50 p-4 rounded-lg">
                                            <p className="text-white font-semibold mb-2">💰 Spotify Premium Nepal Pricing (NPR):</p>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                <div className="bg-green-900/30 p-3 rounded border border-green-500/30">
                                                    <div className="text-green-400 font-bold">1 Month</div>
                                                    <div className="text-white text-lg">NPR 499</div>
                                                    <div className="text-xs text-gray-400">Try it out</div>
                                                </div>
                                                <div className="bg-green-900/30 p-3 rounded border border-green-500/30">
                                                    <div className="text-green-400 font-bold">3 Months</div>
                                                    <div className="text-white text-lg">NPR 1349</div>
                                                    <div className="text-xs text-gray-400">Popular choice</div>
                                                </div>
                                                <div className="bg-green-900/30 p-3 rounded border border-green-500/30">
                                                    <div className="text-green-400 font-bold">6 Months</div>
                                                    <div className="text-white text-lg">NPR 2149</div>
                                                    <div className="text-xs text-gray-400">Great value</div>
                                                </div>
                                                <div className="bg-green-900/30 p-3 rounded border border-green-500/30">
                                                    <div className="text-green-400 font-bold">1 Year</div>
                                                    <div className="text-white text-lg">NPR 3649</div>
                                                    <div className="text-xs text-gray-400">Best deal</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                                        <li>Ad-free music streaming.</li>
                                        <li>Unlimited skips and high-quality audio.</li>
                                        <li>Download music for offline listening.</li>
                                        <li>Access exclusive content, podcasts, and playlists.</li>
                                        <li>No VPN required for streaming in Nepal.</li>
                                        <li>Personalized playlists based on your listening habits.</li>
                                        <li>Available with a personal email for easy access and secure login.</li>
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
                                        Once you subscribe to Spotify Premium, we will share an invite link through which you can join. If the invite is not accepted, we are happy to guide you through the process. You can sign in on the Spotify app available on mobile, desktop, or tablet. Start streaming your favorite songs instantly, or download tracks for offline listening.
                                    </p>
                                    <ul className="text-gray-400 list-disc list-inside mt-2">
                                        <li>Install the Spotify app on your preferred device.</li>
                                        <li>Login using the provided credentials and start streaming.</li>
                                        <li>Contact support for any issues or account assistance.</li>
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
                                        <li>Do not share your account credentials with others.</li>
                                        <li>Do not change the account email or password unless you haven't subscribed in your email.</li>
                                        <li>Contact support for account-related issues.</li>
                                        <li>Keep your account secure by not adding unnecessary information to the profile settings.</li>
                                    </ul>
                                </AccordionDetails>
                            </Accordion>

                            {/* Nepal-specific FAQ Section */}
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    className="bg-gray-800 text-white hover:bg-gray-700 transition duration-300"
                                >
                                    <h2 className="text-lg font-semibold">Frequently Asked Questions - Spotify Premium Nepal</h2>
                                </AccordionSummary>
                                <AccordionDetails className="bg-gray-900 shadow-md border-t border-gray-700 transition-all">
                                    <div className="space-y-4">
                                        <div className="border-b border-gray-700 pb-3">
                                            <h4 className="text-green-400 font-semibold mb-2">Q: Does Spotify Premium work in Nepal without VPN?</h4>
                                            <p className="text-gray-300 text-sm">A: Yes! Our Spotify Premium subscriptions work perfectly in Nepal without requiring any VPN. You can stream music directly from Kathmandu, Pokhara, Lalitpur, or anywhere in Nepal.</p>
                                        </div>
                                        
                                        <div className="border-b border-gray-700 pb-3">
                                            <h4 className="text-green-400 font-semibold mb-2">Q: What's the cheapest Spotify Premium price in Nepal?</h4>
                                            <p className="text-gray-300 text-sm">A: We offer the cheapest Spotify Premium in Nepal starting from just NPR 499 for 1 month. Our pricing: 1 month (NPR 499), 3 months (NPR 1349), 6 months (NPR 2149), 1 year (NPR 3649).</p>
                                        </div>
                                        
                                        <div className="border-b border-gray-700 pb-3">
                                            <h4 className="text-green-400 font-semibold mb-2">Q: How do I pay for Spotify Premium in Nepal?</h4>
                                            <p className="text-gray-300 text-sm">A: We accept all major Nepali payment methods including eSewa, Khalti, IME Pay, bank transfer, and cash payments. All prices are in NPR.</p>
                                        </div>
                                        
                                        <div className="border-b border-gray-700 pb-3">
                                            <h4 className="text-green-400 font-semibold mb-2">Q: Is this genuine Spotify Premium or fake?</h4>
                                            <p className="text-gray-300 text-sm">A: We provide 100% genuine Spotify Premium accounts. You'll get all official features including ad-free streaming, offline downloads, unlimited skips, and high-quality audio.</p>
                                        </div>
                                        
                                        <div className="border-b border-gray-700 pb-3">
                                            <h4 className="text-green-400 font-semibold mb-2">Q: How fast is the activation for Spotify Premium Nepal?</h4>
                                            <p className="text-gray-300 text-sm">A: Activation is instant! Once payment is confirmed, you'll receive your Spotify Premium access within 5-10 minutes. Our team works 24/7 to ensure quick delivery.</p>
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-green-400 font-semibold mb-2">Q: Can I use Spotify Premium on multiple devices in Nepal?</h4>
                                            <p className="text-gray-300 text-sm">A: Yes! You can use your Spotify Premium account on your phone, laptop, tablet, and other devices simultaneously. Perfect for families and individuals with multiple devices.</p>
                                        </div>
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        </div>

                        <Nepal />

                        {/* Footer Section */}
                        <footer className="text-center mt-16 text-gray-500">
                            <p>&copy; 2024 Spotify Nepal. All Rights Reserved.</p>
                        </footer>
                    </div>
                </motion.div>
            </Layout>
        </HelmetProvider>
    );
};

export default SpotifyNepal;

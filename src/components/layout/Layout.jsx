/* eslint-disable react/prop-types */
import React from "react";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import Breadcrumb from "../SEO/Breadcrumb";
import StickyMobileCart from "../StickyMobileCart/StickyMobileCart";

const Layout = ({ children, showBreadcrumb = false, customBreadcrumbs = null }) => {
    return (
        <div className="bg-gradient-to-r from-black to-blue-600 min-h-screen">
            <Navbar />
            <main className="main-content" role="main">
                {showBreadcrumb && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                        <Breadcrumb customBreadcrumbs={customBreadcrumbs} />
                    </div>
                )}
                {children}
            </main>
            <Footer />
            {/* Sticky Mobile Cart - Only shows on mobile when cart has items */}
            <StickyMobileCart />
        </div>
    );
}

export default Layout;

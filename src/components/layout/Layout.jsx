/* eslint-disable react/prop-types */
import React from "react";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import Breadcrumb from "../SEO/Breadcrumb";
import { serifTheme } from "../../design-system/themes/serifTheme";
// import StickyMobileCart from "../StickyMobileCart/StickyMobileCart";

const Layout = ({ children, showBreadcrumb = false, customBreadcrumbs = null }) => {
    return (
        <div className={`${serifTheme.gradients.background} min-h-screen`} style={{ fontFamily: serifTheme.fontFamily.serif }}>
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
            {/* Sticky Mobile Cart - Disabled in favor of bottom navigation bar */}
            {/* <StickyMobileCart /> */}
        </div>
    );
}

export default Layout;

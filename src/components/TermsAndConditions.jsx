import React from "react";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold text-center text-yellow-500 mb-6">
        Terms and Conditions
      </h1>
      <p className="mb-4">
        Welcome to <span className="font-semibold">Digital Shop Nepal</span>. By accessing our website and purchasing our digital products, you agree to abide by the following terms and conditions.
      </p>
      
      <h2 className="text-xl font-semibold text-gray-900 mt-6">1. General Terms</h2>
      <p className="mb-4">
        By using our services, you confirm that you are at least 18 years old or have parental consent to use this website.
      </p>
      
      <h2 className="text-xl font-semibold text-gray-900 mt-6">2. Digital Products</h2>
      <p className="mb-4">
        All purchases are final. Once a digital product has been purchased, it cannot be returned or refunded.
      </p>
      
      <h2 className="text-xl font-semibold text-gray-900 mt-6">3. Intellectual Property</h2>
      <p className="mb-4">
        All content on this site, including text, graphics, logos, and digital products, are the property of Digital Shop Nepal and are protected by copyright laws.
      </p>
      
      <h2 className="text-xl font-semibold text-gray-900 mt-6">4. Payment and Security</h2>
      <p className="mb-4">
        We ensure a secure payment process. However, we are not responsible for any third-party payment issues.
      </p>
      
      <h2 className="text-xl font-semibold text-gray-900 mt-6">5. Changes to Terms</h2>
      <p className="mb-4">
        We reserve the right to update these terms at any time. Users will be notified of any significant changes.
      </p>
      
      <h2 className="text-xl font-semibold text-gray-900 mt-6">6. Contact Us</h2>
      <p className="mb-4">
        If you have any questions about our Terms and Conditions, feel free to contact us at <a href="mailto:support@digitalshopnepal.com" className="text-blue-500">support@digitalshopnepal.com</a>.
      </p>
      
      <div className="mt-8 text-center">
        <Link to="/" className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default TermsAndConditions;
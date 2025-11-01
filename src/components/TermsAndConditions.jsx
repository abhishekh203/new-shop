import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../design-system/components/Button";
import { colors, textStyles } from "../design-system";

const TermsAndConditions = () => {
  const { Neutral, Amber, Blue } = colors;

  return (
    <div 
      className="max-w-4xl mx-auto px-6 py-12"
      style={{ color: Neutral.N900 }}
    >
      <h1 
        className="text-center mb-6"
        style={{ 
          ...textStyles.h1,
          color: Amber.A500 
        }}
      >
        Terms and Conditions
      </h1>
      
      <p 
        className="mb-4"
        style={textStyles.body1Reg}
      >
        Welcome to <span style={{ fontWeight: 600 }}>Digital Shop Nepal</span>. By accessing our website and purchasing our digital products, you agree to abide by the following terms and conditions.
      </p>
      
      <h2 
        className="mt-6"
        style={{ 
          ...textStyles.h3,
          color: Neutral.N900 
        }}
      >
        1. General Terms
      </h2>
      <p 
        className="mb-4"
        style={textStyles.body1Reg}
      >
        By using our services, you confirm that you are at least 18 years old or have parental consent to use this website.
      </p>
      
      <h2 
        className="mt-6"
        style={{ 
          ...textStyles.h3,
          color: Neutral.N900 
        }}
      >
        2. Digital Products
      </h2>
      <p 
        className="mb-4"
        style={textStyles.body1Reg}
      >
        All purchases are final. Once a digital product has been purchased, it cannot be returned or refunded.
      </p>
      
      <h2 
        className="mt-6"
        style={{ 
          ...textStyles.h3,
          color: Neutral.N900 
        }}
      >
        3. Intellectual Property
      </h2>
      <p 
        className="mb-4"
        style={textStyles.body1Reg}
      >
        All content on this site, including text, graphics, logos, and digital products, are the property of Digital Shop Nepal and are protected by copyright laws.
      </p>
      
      <h2 
        className="mt-6"
        style={{ 
          ...textStyles.h3,
          color: Neutral.N900 
        }}
      >
        4. Payment and Security
      </h2>
      <p 
        className="mb-4"
        style={textStyles.body1Reg}
      >
        We ensure a secure payment process. However, we are not responsible for any third-party payment issues.
      </p>
      
      <h2 
        className="mt-6"
        style={{ 
          ...textStyles.h3,
          color: Neutral.N900 
        }}
      >
        5. Changes to Terms
      </h2>
      <p 
        className="mb-4"
        style={textStyles.body1Reg}
      >
        We reserve the right to update these terms at any time. Users will be notified of any significant changes.
      </p>
      
      <h2 
        className="mt-6"
        style={{ 
          ...textStyles.h3,
          color: Neutral.N900 
        }}
      >
        6. Contact Us
      </h2>
      <p 
        className="mb-4"
        style={textStyles.body1Reg}
      >
        If you have any questions about our Terms and Conditions, feel free to contact us at{" "}
        <a 
          href="mailto:support@digitalshopnepal.com"
          style={{ 
            color: Blue.B500,
            textDecoration: 'underline'
          }}
          className="hover:opacity-80 transition-opacity"
        >
          support@digitalshopnepal.com
        </a>.
      </p>
      
      <div className="mt-8 text-center">
        <Button
          as={Link}
          to="/"
          variant="secondary"
          size="medium"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default TermsAndConditions;
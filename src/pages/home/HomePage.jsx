import React from "react";
import { HelmetProvider } from "react-helmet-async";
import Layout from "../../components/layout/Layout";
import SEOHelmet from "../../components/SEO/SEOHelmet";
import SubscriptionPage from "../Subscription/SubscriptionPage";
import HeroSection from "../../components/heroSection/HeroSection";
import Category from "../../components/category/Category";
import HomePageProductCard from "../../components/homePageProductCard/HomePageProductCard";
import Track from "../../components/track/Track";
import BrandsStock from "../../components/Brandstock/BrandStock";
import OTTSubscriptionInfo from "../../components/Ottsubscriptioninfo/OTTSubscriptionInfo";
import Testimonial from "../../components/testimonial/Testimonial";
import FooterOtt from "../../components/footerott/FooterOtt";
import CombinedChat from "../../components/chat/CombinedChat";

const HomePage = () => {
  const homePageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Digital Shop Nepal",
    "url": "https://digitalshopnepal.com",
    "description": "Nepal's #1 digital subscription store providing discounted premium subscriptions worldwide",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://digitalshopnepal.com/allproduct?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Digital Shop Nepal",
      "logo": {
        "@type": "ImageObject",
        "url": "https://digitalshopnepal.com/img/digital.jpg"
      }
    }
  };

  return (
    <HelmetProvider>
      <SEOHelmet
        title="Digital Shop Nepal - Premium Subscriptions at Best Prices in NPR"
        description="Nepal's #1 digital subscription store in Kathmandu, Pokhara & all Nepal. Get Netflix, Spotify, Disney+, Prime Video subscriptions at best prices in NPR. Instant delivery, no VPN required, local support, eSewa/Khalti payment accepted."
        keywords="Digital Shop Nepal, Netflix Nepal, Spotify Nepal, Disney+ Nepal, Prime Video Nepal, YouTube Premium Nepal, digital subscriptions Nepal, streaming services Nepal, subscription Nepal, buy subscription Nepal, cheap subscription Nepal, NPR pricing Nepal, Kathmandu subscription, Pokhara subscription, eSewa payment, Khalti payment, no VPN Nepal, instant delivery Nepal"
        canonical="/"
        structuredData={homePageStructuredData}
        ogType="website"
      />
      <Layout>
        <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
          <HeroSection />
          {/* <Category /> */}
          <HomePageProductCard />
          {/* <Track /> */}
          <OTTSubscriptionInfo />
          <BrandsStock />

          <Testimonial />
            <SubscriptionPage />
          <FooterOtt />
          <CombinedChat />
        </div>
      </Layout>
    </HelmetProvider>
  );
};

export default HomePage;
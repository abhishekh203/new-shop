import React from "react";
import { HelmetProvider } from "react-helmet-async";
import Layout from "../../components/layout/Layout";
import SEOHelmet from "../../components/SEO/SEOHelmet";
import SubscriptionPage from "../subscription/SubscriptionPage";
import HeroSection from "../../components/HeroSection/HeroSection";
import { seoMetadata, productGallery } from "../../config/homepageConfig";

import HomePageProductCard from "../../components/home-page-product-card/HomePageProductCard";
import OTTSubscriptionInfo from "../../components/ott-subscription-info/OTTSubscriptionInfo";
import FooterOtt from "../../components/footer-ott/FooterOtt";
import HorizontalProductGallery from "../../components/product-gallery/HorizontalProductGallery";


const HomePage = () => {
  return (
    <HelmetProvider>
      <SEOHelmet
        title={seoMetadata.homepage.title}
        description={seoMetadata.homepage.description}
        keywords={seoMetadata.homepage.keywords}
        canonical="/"
        structuredData={seoMetadata.structuredData}
        ogType="website"
      />
      <Layout>
          {/* Hero Section */}
          <HeroSection />
          
          {/* All Products Gallery */}
          <HorizontalProductGallery 
            title={productGallery.trendingTitle} 
          />

          {/* Original Components */}
          <HomePageProductCard />
          <OTTSubscriptionInfo />

          <SubscriptionPage />
          <FooterOtt />
      </Layout>
    </HelmetProvider>
  );
};

export default HomePage;
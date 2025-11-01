import React from "react";
import { HelmetProvider } from "react-helmet-async";
import Layout from "../../components/layout/Layout";
import SEOHelmet from "../../components/SEO/SEOHelmet";
import SubscriptionPage from "../Subscription/SubscriptionPage";
import HeroSection from "../../components/heroSection/HeroSection";
import { seoMetadata, productGallery } from "../../config/homepageConfig";




import HomePageProductCard from "../../components/homePageProductCard/HomePageProductCard";
import Track from "../../components/track/Track";
import BrandsStock from "../../components/Brandstock/BrandStock";
import OTTSubscriptionInfo from "../../components/Ottsubscriptioninfo/OTTSubscriptionInfo";
import FooterOtt from "../../components/footerott/FooterOtt";
import HorizontalProductGallery from "../../components/productGallery/HorizontalProductGallery";
// import AIChat from "../../components/aiChat/AIChat"; // Disabled AI Chat


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
          {/* <Track /> */}
          <OTTSubscriptionInfo />
          {/* <BrandsStock /> */} {/* Premium Brands We Offer section - Hidden */}

          <SubscriptionPage />
          <FooterOtt />
        {/* <AIChat /> */} {/* AI Chat Disabled */}
      </Layout>
    </HelmetProvider>
  );
};

export default HomePage;
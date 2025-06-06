import React from "react";
import Layout from "../../components/layout/Layout";
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
  return (
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
  );
};

export default HomePage;
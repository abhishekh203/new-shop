import React from "react";
import Layout from "../../components/layout/Layout";
import SubscriptionPage from "../Subscription/SubscriptionPage"; // Import your SubscriptionPage
import HeroSection from "../../components/heroSection/HeroSection";
import Category from "../../components/category/Category";
import HomePageProductCard from "../../components/homePageProductCard/HomePageProductCard";
import Track from "../../components/track/Track";
import BrandsStock from "../../components/Brandstock/BrandStock";
import OTTSubscriptionInfo from "../../components/Ottsubscriptioninfo/OTTSubscriptionInfo";
import Testimonial from "../../components/testimonial/Testimonial";
import FooterOtt from "../../components/footerott/FooterOtt";
import CombinedChat from "../../components/chat/CombinedChat";
// import FeaturedGames from "../../components/FeaturedGames";


const HomePage = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-b from-gray-200 via-blue-200 to-blue-500">
        <HeroSection />
        {/* <Category /> */}
        <HomePageProductCard />
        {/* <FeaturedGames /> */}
        <Track />
      

        {/* Render the SubscriptionPage */}
      

        <OTTSubscriptionInfo />
         <BrandsStock />
         <SubscriptionPage />
        <Testimonial />
      
          <FooterOtt />
        <CombinedChat />
      </div>
    </Layout>
  );
};

export default HomePage;

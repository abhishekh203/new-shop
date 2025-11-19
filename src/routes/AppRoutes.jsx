import { Routes, Route } from "react-router-dom";

// Core Pages
import HomePage from "../pages/home/HomePage";
import NoPage from "../pages/no-page/NoPage";
import ProductInfo from "../pages/product-info/ProductInfo";
import CartPage from "../pages/cart/CartPage";
import AllProduct from "../pages/all-products/AllProduct";
import CategoryPage from "../pages/category/CategoryPage";
import SubscriptionPage from "../pages/subscription/SubscriptionPage";
import ReviewsPage from "../pages/reviews/ReviewsPage";

// Page Components
import ContactUs from "../pages/contact/ContactUs";
import PurchasePage from "../pages/purchase/PurchasePage";

// Auth Pages
import Signup from "../pages/registration/Signup";
import Login from "../pages/registration/Login";
import UserDashboard from "../pages/user/UserDashboard";
import AuthCallback from "../pages/auth/AuthCallback";
import { ProtectedRouteForUser } from "../protectedRoute/ProtectedRouteForUser";

// Service Pages
import NetflixNepal from "../pages/services/streaming/NetflixNepal";
import SpotifyNepal from "../pages/services/streaming/SpotifyNepal";
import PrimeVideoNepal from "../pages/services/streaming/PrimeVideoNepal";
import YouTubePremiumNepal from "../pages/services/streaming/YouTubePremiumNepal";
import Zee5Nepal from "../pages/services/streaming/Zee5Nepal";
import JioCinemaNepal from "../pages/services/streaming/JiocinemaNepal";
import DisneyPlusHotstarNepal from "../pages/services/streaming/DisneyPlusHotstarNepal";
import UlluNepal from "../pages/services/streaming/UlluNepal";
import AltBalajiNepal from "../pages/services/streaming/AltBalajiNepal";
import CanvaNepal from "../pages/services/productivity/CanvaNepal";
import GoogleOneNepal from "../pages/services/productivity/GoogleOneNepal";
import GrammarlyNepal from "../pages/services/productivity/GrammarlyNepal";
import SoftwareNepal from "../pages/services/software/SoftwareNepal";
import AntivirusNepal from "../pages/services/software/AntivirusNepal";
import VpnNepal from "../pages/services/other/VpnNepal";
import TinderNepal from "../pages/services/other/TinderNepal";
import HowToBuyNetflixNepal from "../pages/how-to-buy-netflix-in-nepal";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Core Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/subscription" element={<SubscriptionPage />} />
      <Route path="/productinfo/:slug" element={<ProductInfo />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/allproduct" element={<AllProduct />} />
      <Route path="/category/:categoryname" element={<CategoryPage />} />
      <Route path="/Contactus" element={<ContactUs />} />
      <Route path="/reviews" element={<ReviewsPage />} />
      <Route path="/purchase" element={<PurchasePage />} />
      
      {/* Auth Routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route 
        path="/user-dashboard" 
        element={
          <ProtectedRouteForUser>
            <UserDashboard />
          </ProtectedRouteForUser>
        } 
      />
      
      {/* Streaming Services */}
      <Route path="/NetflixNepal" element={<NetflixNepal />} />
      <Route path="/SpotifyNepal" element={<SpotifyNepal />} />
      <Route path="/PrimeVideoNepal" element={<PrimeVideoNepal />} />
      <Route path="/YouTubePremiumNepal" element={<YouTubePremiumNepal />} />
      <Route path="/Zee5Nepal" element={<Zee5Nepal />} />
      <Route path="/JioCinemaNepal" element={<JioCinemaNepal />} />
      <Route path="/DisneyPlusHotstarNepal" element={<DisneyPlusHotstarNepal />} />
      <Route path="/UlluNepal" element={<UlluNepal />} />
      <Route path="/AltBalajiNepal" element={<AltBalajiNepal />} />
      
      {/* Productivity & Software */}
      <Route path="/CanvaNepal" element={<CanvaNepal />} />
      <Route path="/GoogleOneNepal" element={<GoogleOneNepal />} />
      <Route path="/SoftwareNepal" element={<SoftwareNepal />} />
      <Route path="/AntivirusNepal" element={<AntivirusNepal />} />
      <Route path="/GrammarlyNepal" element={<GrammarlyNepal />} />
      
      {/* Other Services */}
      <Route path="/VpnNepal" element={<VpnNepal />} />
      <Route path="/TinderNepal" element={<TinderNepal />} />
      
      {/* Guides */}
      <Route path="/How-to-buy-netflix-in-nepal" element={<HowToBuyNetflixNepal />} />
      
      {/* Catch All */}
      <Route path="/*" element={<NoPage />} />
    </Routes>
  );
};

export default AppRoutes;

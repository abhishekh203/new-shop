// src/App.js

import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import NoPage from "./pages/noPage/NoPage";
import ProductInfo from "./pages/productInfo/ProductInfo";
import ScrollTop from "./components/scrollTop/ScrollTop";
import CartPage from "./pages/cart/CartPage";
import AllProduct from "./pages/allproduct/AllProduct";
import Signup from "./pages/registration/Signup";
import Login from "./pages/registration/Login";
import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddProductPage from "./pages/admin/AddProductPage";
import UpdateProductPage from "./pages/admin/UpdateProductPage";
import MyState from "./context/myState";
import { NotificationProvider } from "./context/NotificationContext";
import { ProtectedRouteForUser } from "./protectedRoute/ProtectedRouteForUser";
import { ProtectedRouteForAdmin } from "./protectedRoute/ProtectedRouteForAdmin";
import PerformanceOptimizer from "./components/SEO/PerformanceOptimizer";
import { HelmetProvider } from "react-helmet-async";
import CategoryPage from "./pages/category/CategoryPage";
import ContactUs from "./components/Contactus/ContactUs";
import PurchasePage from "./components/Purchasepage/PurchasePage"; // Import PurchasePage
import SubscriptionPage from "./pages/Subscription/SubscriptionPage"; // Import SubscriptionPage
import NetflixNepal from "./pages/NetflixNepal"; // Import NetflixNepal
import SpotifyNepal from "./pages/SpotifyNepal"; // Import SpotifyNepal
import PrimeVideoNepal from "./pages/PrimeVideoNepal"; // Import PrimeVideoNepal
import YouTubePremiumNepal from "./pages/YouTubePremiumNepal"; // Import YouTubePremiumNepal
import CanvaNepal from "./pages/CanvaNepal"; // Import CanvaNepal
import Zee5Nepal from "./pages/Zee5Nepal"; // Import Zee5Nepal
import VpnNepal from "./pages/VpnNepal"; // Import VpnNepal
import JioCinemaNepal from "./pages/JiocinemaNepal"; // Import JioCinemaNepal
import DisneyPlusHotstarNepal from "./pages/DisneyplusHotstarNepal"; // Import DisneyPlusHotstarNepal
import UlluNepal from "./pages/UlluNepal"; // Import UlluNepal
import AltBalajiNepal from "./pages/AltBalajiNepal"; // Import AltBalajiNepal
import GoogleOneNepal from "./pages/GoogleOneNepal"; // Import GoogleOneNepal
import SoftwareNepal from "./pages/SoftwareNepal"; // Import SoftwareNepal
import AntivirusNepal from "./pages/AntivirusNepal"; // Import AntivirusNepal
import GrammarlyNepal from "./pages/GrammarlyNepal"; // Import GrammarlyNepal
import TinderNepal from "./pages/TinderNepal"; // Import TinderNepal
import HowToBuyNetflixNepal from "./pages/How-to-buy-netflix-in-nepal"; // Import the new page
import ReviewsPage from "./pages/reviews/ReviewsPage"; // Import ReviewsPage
import ErrorBoundary from "./components/ErrorBoundary"; // Import ErrorBoundary
import NetworkStatus from "./components/NetworkStatus"; // Import NetworkStatus
// import AIChatDemo from "./pages/aiChatDemo/AIChatDemo"; // Import AI Chat Demo - DISABLED

const App = () => {
  return (
    <ErrorBoundary>
    <HelmetProvider>
    <MyState>
      <NotificationProvider position="bottom-right">
      <Router>
        <PerformanceOptimizer />
        <ScrollTop />
          <NetworkStatus />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subscription" element={<SubscriptionPage />} /> {/* Subscription page route */}
          <Route path="/*" element={<NoPage />} />
          <Route path="/productinfo/:slug" element={<ProductInfo />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/allproduct" element={<AllProduct />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Contactus" element={<ContactUs />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/purchase" element={<PurchasePage />} />
          <Route path="/category/:categoryname" element={<CategoryPage />} />
          <Route path="/user-dashboard" element={
            <ProtectedRouteForUser>
              <UserDashboard />
            </ProtectedRouteForUser>
          } />
          <Route path="/admin-dashboard" element={
            <ProtectedRouteForAdmin>
              <AdminDashboard />
            </ProtectedRouteForAdmin>
          } />
          <Route path="/addproduct" element={
            <ProtectedRouteForAdmin>
              <AddProductPage />
            </ProtectedRouteForAdmin>
          } />
          <Route path="/updateproduct/:id" element={
            <ProtectedRouteForAdmin>
              <UpdateProductPage />
            </ProtectedRouteForAdmin>
          } />
          {/* OTT Service Routes */}
          <Route path="/NetflixNepal" element={<NetflixNepal />} />
          <Route path="/SpotifyNepal" element={<SpotifyNepal />} />
          <Route path="/PrimeVideoNepal" element={<PrimeVideoNepal />} />
          <Route path="/YouTubePremiumNepal" element={<YouTubePremiumNepal />} />
          <Route path="/CanvaNepal" element={<CanvaNepal />} />
          <Route path="/Zee5Nepal" element={<Zee5Nepal />} />
          <Route path="/VpnNepal" element={<VpnNepal />} />
          <Route path="/JioCinemaNepal" element={<JioCinemaNepal />} />
          <Route path="/DisneyPlusHotstarNepal" element={<DisneyPlusHotstarNepal />} />
          <Route path="/UlluNepal" element={<UlluNepal />} />
          <Route path="/AltBalajiNepal" element={<AltBalajiNepal />} />
          <Route path="/GoogleOneNepal" element={<GoogleOneNepal />} />
          <Route path="/SoftwareNepal" element={<SoftwareNepal />} />
          <Route path="/AntivirusNepal" element={<AntivirusNepal />} />
          <Route path="/GrammarlyNepal" element={<GrammarlyNepal />} />
          <Route path="/TinderNepal" element={<TinderNepal />} />
          <Route path="/How-to-buy-netflix-in-nepal" element={<HowToBuyNetflixNepal />} /> {/* New route for Netflix guide */}
          {/* <Route path="/ai-chat-demo" element={<AIChatDemo />} /> */} {/* AI Chat Demo page - DISABLED */}
        </Routes>
      </Router>
      </NotificationProvider>
    </MyState>
    </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;

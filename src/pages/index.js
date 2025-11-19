/**
 * Pages Barrel Export
 * 
 * Centralized exports for all page components.
 * This allows for cleaner imports like:
 * import { HomePage, ProductInfo, CartPage } from '@pages';
 */

// Core Pages
export { default as HomePage } from './home/HomePage';
export { default as ProductInfo } from './productInfo/ProductInfo';
export { default as CartPage } from './cart/CartPage';
export { default as AllProduct } from './allproduct/AllProduct';
export { default as CategoryPage } from './category/CategoryPage';
export { default as SubscriptionPage } from './Subscription/SubscriptionPage';
export { default as ReviewsPage } from './reviews/ReviewsPage';
export { default as NoPage } from './noPage/NoPage';

// Page Components (formerly in components/)
export { default as ContactUs } from './contact/ContactUs';
export { default as PurchasePage } from './purchase/PurchasePage';

// Auth Pages
export { default as Signup } from './registration/Signup';
export { default as Login } from './registration/Login';
export { default as UserDashboard } from './user/UserDashboard';
export { default as AuthCallback } from './auth/AuthCallback';

// Service Pages - Streaming
export { default as NetflixNepal } from './services/streaming/NetflixNepal';
export { default as SpotifyNepal } from './services/streaming/SpotifyNepal';
export { default as PrimeVideoNepal } from './services/streaming/PrimeVideoNepal';
export { default as YouTubePremiumNepal } from './services/streaming/YouTubePremiumNepal';
export { default as Zee5Nepal } from './services/streaming/Zee5Nepal';
export { default as JioCinemaNepal } from './services/streaming/JiocinemaNepal';
export { default as DisneyPlusHotstarNepal } from './services/streaming/DisneyPlusHotstarNepal';
export { default as UlluNepal } from './services/streaming/UlluNepal';
export { default as AltBalajiNepal } from './services/streaming/AltBalajiNepal';

// Service Pages - Productivity
export { default as CanvaNepal } from './services/productivity/CanvaNepal';
export { default as GoogleOneNepal } from './services/productivity/GoogleOneNepal';
export { default as GrammarlyNepal } from './services/productivity/GrammarlyNepal';

// Service Pages - Software
export { default as SoftwareNepal } from './services/software/SoftwareNepal';
export { default as AntivirusNepal } from './services/software/AntivirusNepal';

// Service Pages - Other
export { default as VpnNepal } from './services/other/VpnNepal';
export { default as TinderNepal } from './services/other/TinderNepal';

// Special Pages
export { default as HowToBuyNetflixNepal } from './How-to-buy-netflix-in-nepal';
export { default as NepalPage } from './nepal';

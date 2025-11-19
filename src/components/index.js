/**
 * Components Barrel Export
 * 
 * Centralized exports for commonly used components.
 * This allows for cleaner imports like:
 * import { Layout, Navbar, Footer, Loader } from '@components';
 */

// Layout Components
export { default as Layout } from './layout/Layout';
export { default as Navbar } from './navbar/Navbar';
export { default as Footer } from './footer/Footer';
export { default as FooterOTT } from './FooterOTT/FooterOtt';

// UI Components
export { default as Loader } from './loader/Loader';
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as NetworkStatus } from './NetworkStatus';
export { default as ScrollTop } from './ScrollTop/ScrollTop';

// Product Components
export { default as HomePageProductCard } from './HomePageProductCard/HomePageProductCard';
export { default as RelatedProducts } from './RelatedProducts/RelatedProducts';
export { default as ProductReviews } from './ProductReviews/ProductReviews';
export { default as HorizontalProductGallery } from './ProductGallery/HorizontalProductGallery';

// Feature Components
export { default as HeroSection } from './HeroSection/HeroSection';
export { default as Category } from './category/Category';

// Interactive Components
export { default as SearchBar } from './SearchBar/SearchBar';
export { default as LoginPopup } from './LoginPopup/LoginPopup';
export { default as BuyNowModal } from './BuyNowModal/BuyNowModal';
export { default as StickyMobileCart } from './StickyMobileCart/StickyMobileCart';

// SEO Components
export { default as SEOHelmet } from './SEO/SEOHelmet';
export { default as Breadcrumb } from './SEO/Breadcrumb';
export { default as NepalSEO } from './SEO/NepalSEO';
export { default as NepalProductSEO } from './SEO/NepalProductSEO';
export { default as NepalFAQ } from './SEO/NepalFAQ';
export { default as OptimizedImage } from './SEO/OptimizedImage';
export { default as PerformanceOptimizer } from './SEO/PerformanceOptimizer';

// OTT Components
export { default as OTTSubscriptionInfo } from './OTTSubscriptionInfo/OTTSubscriptionInfo';

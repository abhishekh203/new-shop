import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Breadcrumb = ({ customBreadcrumbs = null, className = "" }) => {
  const location = useLocation();
  
  // Define custom names for routes
  const routeNames = {
    '': 'Home',
    'NetflixNepal': 'Netflix Nepal',
    'SpotifyNepal': 'Spotify Nepal',
    'PrimeVideoNepal': 'Prime Video Nepal',
    'YouTubePremiumNepal': 'YouTube Premium Nepal',
    'CanvaNepal': 'Canva Nepal',
    'Zee5Nepal': 'Zee5 Nepal',
    'VpnNepal': 'VPN Nepal',
    'JioCinemaNepal': 'JioCinema Nepal',
    'DisneyPlusHotstarNepal': 'Disney+ Hotstar Nepal',
    'UlluNepal': 'Ullu Nepal',
    'AltBalajiNepal': 'AltBalaji Nepal',
    'GoogleOneNepal': 'Google One Nepal',
    'SoftwareNepal': 'Software Nepal',
    'AntivirusNepal': 'Antivirus Nepal',
    'GrammarlyNepal': 'Grammarly Nepal',
    'TinderNepal': 'Tinder Nepal',
    'How-to-buy-netflix-in-nepal': 'How to Buy Netflix in Nepal',
    'subscription': 'Subscriptions',
    'allproduct': 'All Products',
    'Contactus': 'Contact Us',
    'reviews': 'Reviews',
    'cart': 'Shopping Cart',
    'user-dashboard': 'User Dashboard',
    'admin-dashboard': 'Admin Dashboard'
  };

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathnames = location.pathname.split('/').filter(x => x);
    
    const breadcrumbs = [
      { name: 'Home', url: '/', isLast: pathnames.length === 0 }
    ];

    pathnames.forEach((pathname, index) => {
      const url = `/${pathnames.slice(0, index + 1).join('/')}`;
      const isLast = index === pathnames.length - 1;
      const name = routeNames[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
      
      breadcrumbs.push({
        name,
        url,
        isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page unless custom breadcrumbs are provided
  if (location.pathname === '/' && !customBreadcrumbs) {
    return null;
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-gradient-to-r from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-xl border border-gray-700/30 px-4 py-3 mb-6 ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <FiChevronRight className="text-gray-400 mx-2 w-4 h-4" />
            )}
            
            {crumb.isLast ? (
              <span className="text-cyan-400 font-medium flex items-center">
                {index === 0 && <FiHome className="w-4 h-4 mr-1" />}
                {crumb.name}
              </span>
            ) : (
              <Link
                to={crumb.url}
                className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center hover:underline"
              >
                {index === 0 && <FiHome className="w-4 h-4 mr-1" />}
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </motion.nav>
  );
};

export default Breadcrumb;

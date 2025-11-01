/**
 * Centralized Configuration for Homepage Design
 * All hardcoded values should be managed here for easy updates
 */

// ============================================================================
// COMPANY INFORMATION
// ============================================================================
export const companyInfo = {
  name: "Digital Shop Nepal",
  domain: "https://digitalshopnepal.com",
  logoUrl: "https://digitalshopnepal.com/img/digital.jpg",
  established: "July 2019",
  establishedYear: "2019",
  tagline: "Nepal's #1 digital subscription store",
  description: "Nepal's #1 digital subscription store providing discounted premium subscriptions worldwide",
};

// ============================================================================
// STATISTICS & METRICS
// ============================================================================
export const companyStats = {
  hero: {
    happyCustomers: "15,000+",
    averageRating: "4.9★",
    supportHours: "24/7",
    securePercentage: "100%",
  },
  ott: {
    ordersDelivered: "10,000+",
    happyCustomers: "9,500+",
    averageRating: "4.8/5",
    establishedYear: "2019",
  },
  achievements: {
    countriesServed: 15,
    successRate: "99.8%",
  },
};

// ============================================================================
// HERO SECTION
// ============================================================================
export const heroContent = {
  badge: "NEXT GEN DIGITAL MARKETPLACE",
  title: "Digital subscriptions for Nepal",
  subtitle: "Turn your digital needs into premium experiences with marketplace-ready subscriptions and instant delivery",
  description: "Payment through eSewa, IME Pay, and Bank Transfer",
  features: [
    "⚡ Instant Delivery",
    "🔒 Secure Payments",
    "🎯 Best Prices",
    "🇳🇵 Local Support"
  ],
};

// Floating Products for Hero Section
export const floatingProducts = [
  {
    id: 1,
    title: "Netflix Premium",
    price: "NPR 499",
    originalPrice: "NPR 1,200",
    image: "/img/netflix.png",
    badge: "58% OFF",
    color: "from-red-500 to-red-600",
    position: { top: "10%", right: "15%" },
    delay: 0.2,
    url: "/productinfo/netflix-1-month"
  },
  {
    id: 2,
    title: "Spotify Premium",
    price: "NPR 449",
    originalPrice: "NPR 999",
    image: "https://m.media-amazon.com/images/I/51rttY7a+9L._h1_.png",
    badge: "♪ SPOTIFY",
    color: "from-green-500 to-green-600",
    position: { top: "35%", right: "5%" },
    delay: 0.4,
    url: "/productinfo/spotify-1-month-individual-plannot-via-family-invite-read-description"
  },
  {
    id: 3,
    title: "Disney+ Hotstar",
    price: "NPR 3,499",
    originalPrice: "NPR 5,999",
    image: "https://play-lh.googleusercontent.com/gXHdyj_9Dbyz3uJy1EnmLHMUpU33VeD0n6kObv6tzvBveWKDFZQt7yGrnM-L4FW-5P4=w240-h480-rw",
    badge: "NEW",
    color: "from-blue-500 to-blue-600",
    position: { bottom: "25%", right: "20%" },
    delay: 0.6,
    url: "/productinfo/disney-plus-hotstar-1-year-with-vpn"
  },
  {
    id: 4,
    title: "YouTube Premium",
    price: "NPR 2,999",
    originalPrice: "NPR 4,999",
    image: "https://chromeunboxed.com/wp-content/uploads/2023/12/YouTubePremium.jpg",
    badge: "POPULAR",
    color: "from-red-600 to-orange-500",
    position: { bottom: "10%", right: "8%" },
    delay: 0.8,
    url: "/productinfo/youtube-premium-individual-1-year-plan"
  }
];

// ============================================================================
// NOTICE BANNER
// ============================================================================
export const noticeBanner = {
  title: "Important Notice - This Week",
  description: "Please contact admin for product availability before purchasing",
  warning: {
    text: "Many subscriptions are being cancelled",
    subtext: "due to location restrictions"
  },
  contactUrl: "/Contactus",
  contactText: "Contact Admin",
};

// ============================================================================
// PRODUCT GALLERY
// ============================================================================
export const productGallery = {
  trendingTitle: "🔥 Trending Now",
  featuredTitle: "Featured Products",
};

// ============================================================================
// OTT SUBSCRIPTION INFO
// ============================================================================
export const ottInfo = {
  badge: "About Our Company",
  title: "Who We Are?",
  subtitle: "We are proud to be Nepal's #1 digital subscription store",
  fullDescription: "dedicated to providing discounted premium subscriptions to customers worldwide with instant email delivery.",
  
  achievements: {
    badge: "Our Achievements",
    title: "Numbers That Speak",
    subtitle: "Our track record of excellence and customer satisfaction",
    
    journey: {
      badge: "Our Journey",
      title: "Our Achievements",
      description1: "Over the past five years, we've successfully delivered premium subscriptions to customers in over {countries} countries, maintaining an exceptional service record with {successRate} success rate.",
      description2: "Since our establishment in {established}, we've consistently provided top-quality services at unbeatable prices, helping thousands save on their digital subscriptions while building lasting relationships.",
      countries: companyStats.achievements.countriesServed,
      successRate: companyStats.achievements.successRate,
      established: companyInfo.established,
    },
  },
  
  partnership: {
    badge: "Partnership Program",
    title: "Earn with Us!",
    description1: "Tired of overspending on subscriptions? Save money with us, make money with us! Join our exclusive partner program and start earning today.",
    description2: "Not only can you save with our affordable subscriptions, but you can also monetize unused profiles by sharing them through our platform. It's a win-win that turns idle subscriptions into passive income!",
    whatsappUrl: "https://chat.whatsapp.com/IXl6YmkAZgEJkveJgbatAP?text=Hi%20Netflix%20Nepal,%20I%20want%20to%20join%20your%20partner%20program",
    buttonText: "Join Our Partner Program",
    benefits: [
      { text: "Instant Payouts", icon: "check" },
      { text: "Secure Platform", icon: "shield" },
      { text: "24/7 Support", icon: "users" },
    ],
  },
  
  images: {
    globalDelivery: "https://cdn-icons-png.flaticon.com/512/4359/4359963.png",
    earnMoney: "https://cdn-icons-png.flaticon.com/512/3132/3132693.png",
  },
  
  trustIndicators: [
    { text: "Trusted Platform", icon: "shield", color: "green" },
    { text: "Global Delivery", icon: "globe", color: "blue" },
    { text: "Instant Access", icon: "rocket", color: "purple" },
  ],
  
  highlights: [
    { text: "Customer First", icon: "heart", color: "green" },
    { text: "Lightning Fast", icon: "lightning", color: "blue" },
  ],
};

// ============================================================================
// SUBSCRIPTION SERVICES
// ============================================================================
export const subscriptionServices = [
  {
    id: "netflix",
    name: "Netflix Nepal",
    description: "Watch your favorite shows and movies.",
    path: "/NetflixNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "spotify",
    name: "Spotify Nepal",
    description: "Stream unlimited music and podcasts.",
    path: "/SpotifyNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "prime",
    name: "Prime Video Nepal",
    description: "Enjoy movies and TV shows at your fingertips.",
    path: "/PrimeVideoNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "youtube",
    name: "YouTube Premium Nepal",
    description: "Watch ad-free videos and music.",
    path: "/YouTubePremiumNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "canva",
    name: "Canva Nepal",
    description: "Create stunning designs effortlessly.",
    path: "/CanvaNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "zee5",
    name: "Zee5 Nepal",
    description: "Watch regional and Bollywood content.",
    path: "/Zee5Nepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "vpn",
    name: "VPN Nepal",
    description: "Secure your internet connection.",
    path: "/VpnNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "jiocinema",
    name: "JioCinema Nepal",
    description: "Stream Bollywood movies and shows.",
    path: "/JioCinemaNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "disney",
    name: "DisneyPlus Hotstar Nepal",
    description: "Stream Disney, Marvel, and more.",
    path: "/DisneyPlusHotstarNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "ullu",
    name: "Ullu Nepal",
    description: "Watch exclusive web series and movies.",
    path: "/UlluNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "altbalaji",
    name: "AltBalaji Nepal",
    description: "Stream Indian original content.",
    path: "/AltBalajiNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "googleone",
    name: "Google One Nepal",
    description: "Get cloud storage and backup solutions.",
    path: "/GoogleOneNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "software",
    name: "Software Nepal",
    description: "Find the best software solutions.",
    path: "/SoftwareNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "antivirus",
    name: "Antivirus Nepal",
    description: "Protect your devices from threats.",
    path: "/AntivirusNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "grammarly",
    name: "Grammarly Nepal",
    description: "Improve your writing instantly.",
    path: "/GrammarlyNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "tinder",
    name: "Tinder Nepal",
    description: "Meet new people and make connections.",
    path: "/TinderNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "netflix-guide",
    name: "Netflix Guide to Buy in Nepal",
    description: "Step-by-step guide to purchase Netflix.",
    path: "/How-to-buy-netflix-in-nepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70",
    fullWidth: true
  }
];

// ============================================================================
// PRODUCT CATEGORIES
// ============================================================================
export const productCategories = [
  { id: "all", name: "All Products", icon: "grid", color: "from-blue-600 to-cyan-500" },
  { id: "netflix", name: "Netflix", icon: "netflix", color: "from-red-600 to-pink-500" },
  { id: "streaming", name: "Streaming", icon: "streaming", color: "from-green-600 to-emerald-500" },
  { id: "ott", name: "Platforms", icon: "ott", color: "from-blue-600 to-indigo-500" },
  { id: "music", name: "Music", icon: "music", color: "from-purple-600 to-violet-500" },
  { id: "software", name: "Software", icon: "software", color: "from-green-600 to-teal-500" },
  { id: "games", name: "Games", icon: "games", color: "from-yellow-600 to-orange-500" },
  { id: "education", name: "Education", icon: "education", color: "from-gray-600 to-slate-500" },
  { id: "vpn", name: "VPN", icon: "vpn", color: "from-pink-600 to-rose-500" },
  { id: "ai", name: "AI", icon: "ai", color: "from-purple-600 to-indigo-500" }
];

// ============================================================================
// SEO METADATA
// ============================================================================
export const seoMetadata = {
  homepage: {
    title: "Digital Shop Nepal - Premium Subscriptions at Best Prices in NPR",
    description: "Nepal's #1 digital subscription store in Kathmandu, Pokhara & all Nepal. Get Netflix, Spotify, Disney+, Prime Video subscriptions at best prices in NPR. Instant delivery, no VPN required, local support, eSewa/Khalti payment accepted.",
    keywords: "Digital Shop Nepal, Netflix Nepal, Spotify Nepal, Disney+ Nepal, Prime Video Nepal, YouTube Premium Nepal, digital subscriptions Nepal, streaming services Nepal, subscription Nepal, buy subscription Nepal, cheap subscription Nepal, NPR pricing Nepal, Kathmandu subscription, Pokhara subscription, eSewa payment, Khalti payment, no VPN Nepal, instant delivery Nepal",
  },
  structuredData: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": companyInfo.name,
    "url": companyInfo.domain,
    "description": companyInfo.description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${companyInfo.domain}/allproduct?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": companyInfo.name,
      "logo": {
        "@type": "ImageObject",
        "url": companyInfo.logoUrl
      }
    }
  },
};

// ============================================================================
// BRAND TEXT
// ============================================================================
export const brandText = {
  companyName: "Digital Shop Nepal",
};

// ============================================================================
// DEFAULT VALUES
// ============================================================================
export const defaults = {
  discountRange: { min: 10, max: 40 },
  placeholderImage: "/img/placeholder.png",
  fallbackImage: "/img/hero.png",
};


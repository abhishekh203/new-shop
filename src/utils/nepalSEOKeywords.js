// Nepal-specific SEO keywords and content optimization

export const nepalSEOKeywords = {
  // Location-based keywords
  locations: [
    "Nepal", "Kathmandu", "Pokhara", "Lalitpur", "Bhaktapur", "Chitwan", 
    "Butwal", "Biratnagar", "Janakpur", "Dharan", "Hetauda", "Nepalgunj"
  ],
  
  // Service-specific Nepal keywords
  netflix: [
    "Netflix Nepal", "Netflix subscription Nepal", "buy Netflix Nepal", 
    "Netflix premium Nepal", "Netflix account Nepal", "watch Netflix Nepal",
    "Netflix price Nepal", "Netflix NPR", "Netflix Kathmandu", "Netflix streaming Nepal",
    "how to get Netflix in Nepal", "Netflix without VPN Nepal", "Netflix family plan Nepal"
  ],
  
  spotify: [
    "Spotify Nepal", "Spotify premium Nepal", "buy Spotify Nepal",
    "Spotify subscription Nepal", "Spotify music Nepal", "Spotify account Nepal",
    "Spotify price Nepal", "Spotify NPR", "music streaming Nepal", "Spotify family Nepal"
  ],
  
  primeVideo: [
    "Prime Video Nepal", "Amazon Prime Nepal", "Prime Video subscription Nepal",
    "buy Prime Video Nepal", "Prime Video account Nepal", "Prime Video price Nepal",
    "Amazon Prime streaming Nepal", "Prime Video NPR", "Prime Video Kathmandu"
  ],
  
  youtube: [
    "YouTube Premium Nepal", "YouTube subscription Nepal", "YouTube Premium price Nepal",
    "buy YouTube Premium Nepal", "YouTube Premium account Nepal", "YouTube Premium NPR",
    "ad-free YouTube Nepal", "YouTube Music Nepal", "YouTube Premium family Nepal"
  ],
  
  canva: [
    "Canva Nepal", "Canva Pro Nepal", "Canva subscription Nepal",
    "buy Canva Nepal", "Canva design Nepal", "Canva premium Nepal",
    "graphic design Nepal", "Canva templates Nepal", "Canva price Nepal"
  ],
  
  // Payment methods in Nepal
  payments: [
    "eSewa", "Khalti", "IME Pay", "Connect IPS", "SCT Pay", "Prabhu Pay",
    "Nepal bank payment", "online payment Nepal", "digital wallet Nepal",
    "NPR payment", "Nepali rupees", "bank transfer Nepal"
  ],
  
  // General subscription keywords
  general: [
    "digital subscription Nepal", "online subscription Nepal", "streaming services Nepal",
    "premium subscription Nepal", "subscription service Nepal", "digital services Nepal",
    "online streaming Nepal", "entertainment subscription Nepal", "software subscription Nepal",
    "cheap subscription Nepal", "affordable subscription Nepal", "best subscription Nepal"
  ],
  
  // Local context keywords
  localContext: [
    "no VPN required Nepal", "works in Nepal", "Nepal compatible", "Nepali users",
    "local support Nepal", "customer service Nepal", "Nepal delivery",
    "instant activation Nepal", "24/7 support Nepal", "Nepal timezone"
  ]
};

// Generate Nepal-optimized meta descriptions
export const generateNepalMetaDescription = (service, features = []) => {
  const baseDescriptions = {
    netflix: `Get Netflix premium subscription in Nepal at best prices. Stream unlimited movies & TV shows with no VPN required. Instant delivery, NPR pricing, local support.`,
    spotify: `Buy Spotify Premium subscription in Nepal. Enjoy ad-free music streaming, offline downloads. Best prices in NPR with instant activation.`,
    primeVideo: `Amazon Prime Video subscription for Nepal. Watch exclusive content, movies & shows. No VPN needed, NPR pricing, instant access.`,
    youtube: `YouTube Premium Nepal subscription. Ad-free videos, background play, YouTube Music included. Best prices in NPR with local support.`,
    canva: `Canva Pro subscription for Nepal. Access premium templates, design tools. Perfect for businesses & creators in Nepal. NPR pricing available.`,
    default: `Premium ${service} subscription available in Nepal. Best prices in NPR, instant delivery, no VPN required, local customer support.`
  };
  
  const description = baseDescriptions[service.toLowerCase()] || baseDescriptions.default;
  
  if (features.length > 0) {
    return `${description} Features: ${features.join(', ')}.`;
  }
  
  return description;
};

// Generate Nepal-optimized titles
export const generateNepalTitle = (service, type = 'subscription') => {
  const templates = {
    subscription: `${service} Nepal - Premium Subscription at Best Prices`,
    buy: `Buy ${service} Nepal - Instant Delivery & NPR Pricing`,
    stream: `Stream ${service} in Nepal - No VPN Required`,
    premium: `${service} Premium Nepal - Affordable Subscription Plans`,
    account: `${service} Account Nepal - Genuine Subscriptions`
  };
  
  return templates[type] || templates.subscription;
};

// Nepal-specific structured data helpers
export const generateNepalProductSchema = (service, price, currency = 'NPR') => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${service} Nepal Subscription`,
    "description": `Premium ${service} subscription available in Nepal with local pricing and support`,
    "brand": {
      "@type": "Brand",
      "name": service
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": currency,
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2024-12-31",
      "seller": {
        "@type": "Organization",
        "name": "Digital Shop Nepal",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "NP",
          "addressLocality": "Kathmandu",
          "addressRegion": "Bagmati Province"
        }
      },
      "areaServed": {
        "@type": "Country",
        "name": "Nepal"
      },
      "eligibleRegion": {
        "@type": "Country",
        "name": "Nepal"
      }
    },
    "category": "Digital Subscription Services",
    "audience": {
      "@type": "Audience",
      "geographicArea": {
        "@type": "Country",
        "name": "Nepal"
      }
    }
  };
};

// Local business hours for Nepal (NPT timezone)
export const nepalBusinessHours = {
  timezone: "Asia/Kathmandu",
  openingHours: "Mo-Su 00:00-23:59", // 24/7 digital service
  telephone: "+9779807677391",
  email: "digitalshopnepalstore@gmail.com"
};

// Nepal cities for local SEO
export const nepalCities = [
  { name: "Kathmandu", population: "large", priority: 1 },
  { name: "Pokhara", population: "medium", priority: 2 },
  { name: "Lalitpur", population: "medium", priority: 2 },
  { name: "Bhaktapur", population: "medium", priority: 3 },
  { name: "Biratnagar", population: "medium", priority: 3 },
  { name: "Birgunj", population: "medium", priority: 3 },
  { name: "Dharan", population: "small", priority: 4 },
  { name: "Butwal", population: "small", priority: 4 },
  { name: "Hetauda", population: "small", priority: 4 },
  { name: "Janakpur", population: "small", priority: 4 }
];

export default nepalSEOKeywords;

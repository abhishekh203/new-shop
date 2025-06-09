import { Helmet } from 'react-helmet-async';

const SEOHelmet = ({ 
  title, 
  description, 
  keywords, 
  canonical, 
  ogImage = "/img/digital.jpg",
  ogType = "website",
  structuredData = null,
  breadcrumbs = null,
  author = "Digital Shop Nepal",
  publishedTime = null,
  modifiedTime = null
}) => {
  const siteUrl = "https://digitalshopnepal.com";
  const fullCanonical = canonical?.startsWith('http') ? canonical : `${siteUrl}${canonical}`;
  const fullOgImage = ogImage?.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  // Default structured data for organization with Nepal focus
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Digital Shop Nepal",
    "url": siteUrl,
    "logo": `${siteUrl}/img/digital.jpg`,
    "description": "Nepal's #1 digital subscription store providing discounted premium subscriptions",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Kathmandu",
      "addressLocality": "Kathmandu",
      "addressRegion": "Bagmati Province",
      "postalCode": "44600",
      "addressCountry": "NP"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "27.7172",
      "longitude": "85.3240"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+9779807677391",
      "contactType": "customer service",
      "availableLanguage": ["English", "Nepali"],
      "areaServed": "Nepal",
      "email": "digitalshopnepalstore@gmail.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Nepal"
    },
    "currenciesAccepted": "NPR",
    "paymentAccepted": ["Cash", "Credit Card", "eSewa", "Khalti", "IME Pay"],
    "priceRange": "NPR 199 - NPR 4999",
    "sameAs": [
      "https://www.facebook.com/digitalshopnepal",
      "https://www.instagram.com/digitalshopnepal",
      "https://twitter.com/digitalshopnepal"
    ]
  };

  // Breadcrumb structured data
  const breadcrumbStructuredData = breadcrumbs ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url?.startsWith('http') ? crumb.url : `${siteUrl}${crumb.url}`
    }))
  } : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={fullCanonical} />}
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Digital Shop Nepal" />
      <meta property="og:locale" content="en_NP" />
      <meta property="og:country-name" content="Nepal" />

      {/* Geographic and Language Targeting */}
      <meta name="geo.region" content="NP" />
      <meta name="geo.country" content="Nepal" />
      <meta name="geo.placename" content="Kathmandu, Nepal" />
      <meta name="geo.position" content="27.7172;85.3240" />
      <meta name="ICBM" content="27.7172, 85.3240" />
      <meta name="language" content="English" />
      <meta name="content-language" content="en-NP" />

      {/* Nepal-specific business information */}
      <meta name="contact:phone_number" content="+9779807677391" />
      <meta name="contact:email" content="digitalshopnepalstore@gmail.com" />
      <meta name="contact:country_name" content="Nepal" />
      <meta name="contact:region" content="Bagmati Province" />
      <meta name="contact:postal_code" content="44600" />

      {/* Currency and pricing context */}
      <meta name="price:currency" content="NPR" />
      <meta name="price:country" content="Nepal" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:site" content="@digitalshopnepal" />
      
      {/* Article specific meta tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
      
      {/* Breadcrumb Structured Data */}
      {breadcrumbStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
      )}
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
    </Helmet>
  );
};

export default SEOHelmet;

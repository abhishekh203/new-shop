import React from 'react';
import { Helmet } from 'react-helmet-async';
import { generateNepalTitle, generateNepalMetaDescription, generateNepalProductSchema } from '../../utils/nepalSEOKeywords';

const NepalProductSEO = ({
  productName,
  productType = "subscription",
  price = "999",
  currency = "NPR",
  features = [],
  description = "",
  canonicalUrl = "",
  customKeywords = [],
  imageUrl = "/img/digital.jpg",
  rating = "4.8",
  reviewCount = "150"
}) => {
  const siteUrl = "https://digitalshopnepal.com";
  
  // Generate dynamic SEO content
  const title = generateNepalTitle(productName, productType);
  const metaDescription = description || generateNepalMetaDescription(productName.toLowerCase().replace(' ', ''), features);
  const fullCanonicalUrl = canonicalUrl?.startsWith('http') ? canonicalUrl : `${siteUrl}${canonicalUrl}`;
  const fullImageUrl = imageUrl?.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`;
  
  // Create comprehensive keywords
  const baseKeywords = [
    `${productName} Nepal`,
    `${productName} subscription Nepal`,
    `buy ${productName} Nepal`,
    `${productName} price Nepal`,
    `${productName} account Nepal`,
    `${productName} NPR`,
    `${productName} Kathmandu`,
    `${productName} Pokhara`,
    `digital shop nepal`,
    `subscription service nepal`,
    `streaming nepal`,
    `no vpn required nepal`,
    `instant delivery nepal`,
    `esewa payment`,
    `khalti payment`,
    `ime pay`,
    `nepal digital services`
  ];
  
  const allKeywords = [...baseKeywords, ...customKeywords].join(", ");
  
  // Generate structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${productName} Nepal Subscription`,
    "description": metaDescription,
    "brand": {
      "@type": "Brand",
      "name": productName.replace(" Nepal", "")
    },
    "image": fullImageUrl,
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
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "reviewCount": reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  // Breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Subscriptions",
        "item": `${siteUrl}/subscription`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${productName} Nepal`,
        "item": fullCanonicalUrl
      }
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={allKeywords} />
      {canonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}
      <meta name="author" content="Digital Shop Nepal" />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      
      {/* Geographic and Language Targeting */}
      <meta name="geo.region" content="NP" />
      <meta name="geo.country" content="Nepal" />
      <meta name="geo.placename" content="Kathmandu, Nepal" />
      <meta name="geo.position" content="27.7172;85.3240" />
      <meta name="ICBM" content="27.7172, 85.3240" />
      <meta name="language" content="English" />
      <meta name="content-language" content="en-NP" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:type" content="product" />
      <meta property="og:site_name" content="Digital Shop Nepal" />
      <meta property="og:locale" content="en_NP" />
      <meta property="og:country-name" content="Nepal" />
      <meta property="product:price:amount" content={price} />
      <meta property="product:price:currency" content={currency} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@digitalshopnepal" />
      
      {/* Nepal-specific business information */}
      <meta name="contact:phone_number" content="+9779807677391" />
      <meta name="contact:email" content="digitalshopnepalstore@gmail.com" />
      <meta name="contact:country_name" content="Nepal" />
      <meta name="contact:region" content="Bagmati Province" />
      <meta name="contact:postal_code" content="44600" />
      
      {/* Currency and pricing context */}
      <meta name="price:currency" content={currency} />
      <meta name="price:country" content="Nepal" />
      
      {/* Product-specific meta tags */}
      <meta name="product:availability" content="in stock" />
      <meta name="product:condition" content="new" />
      <meta name="product:price" content={`${price} ${currency}`} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Breadcrumb Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbData)}
      </script>
      
      {/* Additional Nepal SEO Meta Tags */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
    </Helmet>
  );
};

export default NepalProductSEO; 
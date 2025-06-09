import { Helmet } from 'react-helmet-async';

const NepalSEO = ({ 
  title, 
  description, 
  keywords, 
  canonical, 
  ogImage = "/img/digital.jpg",
  ogType = "website",
  structuredData = null,
  breadcrumbs = null,
  serviceName = "",
  price = "",
  currency = "NPR"
}) => {
  const siteUrl = "https://digitalshopnepal.com";
  const fullCanonical = canonical?.startsWith('http') ? canonical : `${siteUrl}${canonical}`;
  const fullOgImage = ogImage?.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  // Nepal-specific Local Business Schema
  const nepalBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Digital Shop Nepal",
    "description": "Nepal's #1 digital subscription store providing discounted premium subscriptions",
    "url": siteUrl,
    "logo": `${siteUrl}/img/digital.jpg`,
    "image": `${siteUrl}/img/digital.jpg`,
    "telephone": "+9779807677391",
    "email": "digitalshopnepalstore@gmail.com",
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
    "areaServed": [
      {
        "@type": "Country",
        "name": "Nepal",
        "sameAs": "https://en.wikipedia.org/wiki/Nepal"
      },
      {
        "@type": "City",
        "name": "Kathmandu",
        "sameAs": "https://en.wikipedia.org/wiki/Kathmandu"
      },
      {
        "@type": "City",
        "name": "Pokhara",
        "sameAs": "https://en.wikipedia.org/wiki/Pokhara"
      },
      {
        "@type": "City",
        "name": "Lalitpur",
        "sameAs": "https://en.wikipedia.org/wiki/Lalitpur,_Nepal"
      },
      {
        "@type": "City",
        "name": "Bhaktapur",
        "sameAs": "https://en.wikipedia.org/wiki/Bhaktapur"
      }
    ],
    "currenciesAccepted": "NPR",
    "paymentAccepted": ["Cash", "Credit Card", "eSewa", "Khalti", "IME Pay"],
    "priceRange": "NPR 199 - NPR 4999",
    "openingHours": "Mo-Su 00:00-23:59",
    "sameAs": [
      "https://www.facebook.com/digitalshopnepal",
      "https://www.instagram.com/digitalshopnepal",
      "https://twitter.com/digitalshopnepal"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Digital Subscriptions Nepal",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Netflix Nepal Subscription",
            "description": "Premium Netflix subscription for Nepal"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Spotify Nepal Subscription",
            "description": "Premium Spotify subscription for Nepal"
          }
        }
      ]
    }
  };

  // Nepal-specific Product Schema with local pricing
  const nepalProductSchema = serviceName ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${serviceName} Nepal`,
    "description": `Premium ${serviceName} subscription available in Nepal with local pricing in NPR`,
    "brand": {
      "@type": "Brand",
      "name": serviceName.replace(" Nepal", "")
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
          "addressLocality": "Kathmandu"
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
  } : null;

  // Combine schemas
  const combinedSchema = structuredData || nepalProductSchema || nepalBusinessSchema;

  return (
    <Helmet>
      {/* Basic Meta Tags with Nepal focus */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={fullCanonical} />}
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
      
      {/* Open Graph with Nepal targeting */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Digital Shop Nepal" />
      <meta property="og:locale" content="en_NP" />
      <meta property="og:country-name" content="Nepal" />
      
      {/* Twitter Card with Nepal context */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:site" content="@digitalshopnepal" />
      
      {/* Nepal-specific business information */}
      <meta name="contact:phone_number" content="+9779807677391" />
      <meta name="contact:email" content="digitalshopnepalstore@gmail.com" />
      <meta name="contact:country_name" content="Nepal" />
      <meta name="contact:region" content="Bagmati Province" />
      <meta name="contact:postal_code" content="44600" />
      
      {/* Currency and pricing context */}
      <meta name="price:currency" content="NPR" />
      <meta name="price:country" content="Nepal" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(combinedSchema)}
      </script>
      
      {/* Nepal Business Schema */}
      <script type="application/ld+json">
        {JSON.stringify(nepalBusinessSchema)}
      </script>
      
      {/* Breadcrumb Schema */}
      {breadcrumbs && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": crumb.name,
              "item": crumb.url?.startsWith('http') ? crumb.url : `${siteUrl}${crumb.url}`
            }))
          })}
        </script>
      )}
      
      {/* Additional Nepal SEO Meta Tags */}
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

export default NepalSEO;

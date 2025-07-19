// Generate Dynamic Sitemap for Digital Shop Nepal
// Run this script to update sitemap with new products and pages

const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = 'https://digitalshopnepal.com';
const OUTPUT_FILE = path.join(__dirname, 'sitemap.xml');

// Define all pages with priorities and update frequencies
const staticPages = [
    // Core Pages
    { url: '/', priority: 1.0, changefreq: 'daily', lastmod: getCurrentDate() },
    { url: '/subscription', priority: 0.9, changefreq: 'daily', lastmod: getCurrentDate() },
    
    // Premium Streaming Services (High Priority)
    { url: '/NetflixNepal', priority: 0.9, changefreq: 'weekly', lastmod: getCurrentDate(), 
      image: { loc: '/img/netflix.png', title: 'Netflix Nepal Subscription', caption: 'Premium Netflix subscription for Nepal' }
    },
    { url: '/SpotifyNepal', priority: 0.85, changefreq: 'weekly', lastmod: getCurrentDate(),
      image: { loc: '/img/spotify.png', title: 'Spotify Nepal Subscription', caption: 'Premium Spotify music streaming for Nepal' }
    },
    { url: '/PrimeVideoNepal', priority: 0.85, changefreq: 'weekly', lastmod: getCurrentDate() },
    { url: '/YouTubePremiumNepal', priority: 0.85, changefreq: 'weekly', lastmod: getCurrentDate() },
    { url: '/DisneyPlusHotstarNepal', priority: 0.8, changefreq: 'weekly', lastmod: getCurrentDate() },
    
    // Design & Productivity Tools
    { url: '/CanvaNepal', priority: 0.8, changefreq: 'weekly', lastmod: getCurrentDate() },
    { url: '/GrammarlyNepal', priority: 0.75, changefreq: 'weekly', lastmod: getCurrentDate() },
    { url: '/GoogleOneNepal', priority: 0.75, changefreq: 'weekly', lastmod: getCurrentDate() },
    
    // Regional Streaming Services
    { url: '/Zee5Nepal', priority: 0.8, changefreq: 'weekly', lastmod: getCurrentDate() },
    { url: '/JioCinemaNepal', priority: 0.8, changefreq: 'weekly', lastmod: getCurrentDate() },
    { url: '/UlluNepal', priority: 0.75, changefreq: 'weekly', lastmod: getCurrentDate() },
    { url: '/AltBalajiNepal', priority: 0.75, changefreq: 'weekly', lastmod: getCurrentDate() },
    
    // Software & Security Services
    { url: '/SoftwareNepal', priority: 0.75, changefreq: 'weekly', lastmod: getCurrentDate() },
    { url: '/AntivirusNepal', priority: 0.75, changefreq: 'weekly', lastmod: getCurrentDate() },
    { url: '/VpnNepal', priority: 0.75, changefreq: 'weekly', lastmod: getCurrentDate() },
    
    // Social & Dating
    { url: '/TinderNepal', priority: 0.7, changefreq: 'weekly', lastmod: getCurrentDate() },
    
    // Content Pages
    { url: '/How-to-buy-netflix-in-nepal', priority: 0.8, changefreq: 'monthly', lastmod: getCurrentDate() },
    
    // Product & Category Pages
    { url: '/allproduct', priority: 0.7, changefreq: 'daily', lastmod: getCurrentDate() },
    { url: '/reviews', priority: 0.7, changefreq: 'weekly', lastmod: getCurrentDate() },
    { url: '/Contactus', priority: 0.6, changefreq: 'monthly', lastmod: getCurrentDate() },
    
    // Category Pages
    { url: '/category/netflix', priority: 0.6, changefreq: 'weekly', lastmod: getCurrentDate() },
    { url: '/category/streaming', priority: 0.6, changefreq: 'weekly', lastmod: getCurrentDate() },
    { url: '/category/software', priority: 0.6, changefreq: 'weekly', lastmod: getCurrentDate() },
    { url: '/category/ott', priority: 0.6, changefreq: 'weekly', lastmod: getCurrentDate() }
];

// Nepal-specific keywords and cities for local SEO
const nepalCities = [
    'kathmandu', 'pokhara', 'lalitpur', 'bhaktapur', 'biratnagar', 
    'butwal', 'dharan', 'hetauda', 'janakpur', 'nepalgunj'
];

// Generate current date in ISO format
function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

// Generate XML for a single URL
function generateUrlXML(page) {
    const fullUrl = `${SITE_URL}${page.url}`;
    let xml = `    <url>
        <loc>${fullUrl}</loc>
        <priority>${page.priority}</priority>
        <changefreq>${page.changefreq}</changefreq>
        <lastmod>${page.lastmod}</lastmod>`;
    
    // Add image sitemap if available
    if (page.image) {
        xml += `
        <image:image>
            <image:loc>${SITE_URL}${page.image.loc}</image:loc>
            <image:title>${page.image.title}</image:title>
            <image:caption>${page.image.caption}</image:caption>
        </image:image>`;
    }
    
    xml += `
    </url>`;
    
    return xml;
}

// Generate complete sitemap XML
function generateSitemap() {
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`;
    
    const footer = `</urlset>`;
    
    // Generate URLs
    const urls = staticPages.map(page => generateUrlXML(page)).join('\n');
    
    return `${header}\n${urls}\n${footer}`;
}

// Write sitemap to file
function writeSitemap() {
    try {
        const sitemapContent = generateSitemap();
        fs.writeFileSync(OUTPUT_FILE, sitemapContent, 'utf8');
        console.log(`✅ Sitemap generated successfully: ${OUTPUT_FILE}`);
        console.log(`📊 Total URLs: ${staticPages.length}`);
        console.log(`🌐 Site URL: ${SITE_URL}`);
        console.log(`📅 Last updated: ${getCurrentDate()}`);
    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
    }
}

// Add function to dynamically discover product pages (for future use)
async function discoverProductPages() {
    // This function can be extended to automatically discover product pages
    // from your database or file system for dynamic sitemap generation
    console.log('🔍 Discovering product pages...');
    
    // Example: Add logic to scan for new product pages
    // const productPages = await fetchProductsFromDatabase();
    // return productPages.map(product => ({
    //     url: `/productinfo/${product.id}`,
    //     priority: 0.7,
    //     changefreq: 'weekly',
    //     lastmod: product.updatedAt || getCurrentDate()
    // }));
    
    return [];
}

// Main execution
if (require.main === module) {
    console.log('🚀 Generating sitemap for Digital Shop Nepal...');
    writeSitemap();
}

module.exports = {
    generateSitemap,
    writeSitemap,
    discoverProductPages,
    staticPages
}; 
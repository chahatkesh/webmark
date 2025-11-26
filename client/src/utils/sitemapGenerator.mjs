/**
 * Sitemap Generator Utility
 * 
 * This script generates a sitemap.xml file for the Webmark application.
 * It can be run as part of the build process to ensure the sitemap is always up-to-date.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = 'https://webmark.chahatkesh.me';
const OUTPUT_PATH = path.join(__dirname, '../../public/sitemap.xml');
const CURRENT_DATE = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

// Site pages with their metadata
const SITE_PAGES = [
  {
    path: '/',
    changefreq: 'weekly',
    priority: '1.0',
  },
  {
    path: '/docs',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/about',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/features',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/contact',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/report-problem',
    changefreq: 'monthly',
    priority: '0.6',
  },
  {
    path: '/onboarding',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/privacy-policy',
    changefreq: 'yearly',
    priority: '0.5',
  },
  {
    path: '/terms',
    changefreq: 'yearly',
    priority: '0.5',
  },
];

/**
 * Generate the XML sitemap content
 * @returns {string} The XML sitemap content
 */
function generateSitemapXML() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add each page to the sitemap
  SITE_PAGES.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${page.path}</loc>\n`;
    xml += `    <lastmod>${CURRENT_DATE}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';
  return xml;
}

/**
 * Write the sitemap to disk
 */
export function writeSitemap() {
  const xml = generateSitemapXML();

  try {
    fs.writeFileSync(OUTPUT_PATH, xml);
    console.log(`Sitemap successfully generated at ${OUTPUT_PATH}`);

    // Update the sitemap index lastmod date
    const sitemapIndexPath = path.join(__dirname, '../../public/sitemap-index.xml');
    if (fs.existsSync(sitemapIndexPath)) {
      let sitemapIndexContent = fs.readFileSync(sitemapIndexPath, 'utf8');
      // Update the lastmod dates to current date
      sitemapIndexContent = sitemapIndexContent.replace(/<lastmod>.*?<\/lastmod>/g, `<lastmod>${CURRENT_DATE}</lastmod>`);
      fs.writeFileSync(sitemapIndexPath, sitemapIndexContent);
      console.log(`Sitemap index updated with current date: ${CURRENT_DATE}`);
    }

    // Also update feature and FAQ sitemaps
    const sitemapFeaturesPath = path.join(__dirname, '../../public/sitemap-features.xml');
    const sitemapFaqPath = path.join(__dirname, '../../public/sitemap-faq.xml');

    // Update feature sitemap lastmod dates
    if (fs.existsSync(sitemapFeaturesPath)) {
      let sitemapContent = fs.readFileSync(sitemapFeaturesPath, 'utf8');
      sitemapContent = sitemapContent.replace(/<lastmod>.*?<\/lastmod>/g, `<lastmod>${CURRENT_DATE}</lastmod>`);
      fs.writeFileSync(sitemapFeaturesPath, sitemapContent);
      console.log(`Features sitemap updated with current date: ${CURRENT_DATE}`);
    }

    // Update FAQ sitemap lastmod dates
    if (fs.existsSync(sitemapFaqPath)) {
      let sitemapContent = fs.readFileSync(sitemapFaqPath, 'utf8');
      sitemapContent = sitemapContent.replace(/<lastmod>.*?<\/lastmod>/g, `<lastmod>${CURRENT_DATE}</lastmod>`);
      fs.writeFileSync(sitemapFaqPath, sitemapContent);
      console.log(`FAQ sitemap updated with current date: ${CURRENT_DATE}`);
    }
  } catch (error) {
    console.error('Error writing sitemap:', error);
  }
}

/**
 * Update sitemap references in robots.txt
 */
export function updateRobotsTxt() {
  const robotsPath = path.join(__dirname, '../../public/robots.txt');

  try {
    if (fs.existsSync(robotsPath)) {
      let robotsContent = fs.readFileSync(robotsPath, 'utf8');

      // Add sitemap index if not already there
      if (!robotsContent.includes('sitemap-index.xml')) {
        robotsContent = robotsContent.replace(
          /Sitemap: https:\/\/webmark\.site\/sitemap\.xml/,
          'Sitemap: https://webmark.chahatkesh.me/sitemap-index.xml\nSitemap: https://webmark.chahatkesh.me/sitemap.xml'
        );
      }

      // Add FAQ and feature sitemap references if not already there
      if (!robotsContent.includes('sitemap-faq.xml')) {
        if (robotsContent.includes('sitemap-features.xml')) {
          robotsContent = robotsContent.replace(
            /Sitemap: https:\/\/webmark\.site\/sitemap-features\.xml/,
            'Sitemap: https://webmark.chahatkesh.me/sitemap-features.xml\nSitemap: https://webmark.chahatkesh.me/sitemap-faq.xml'
          );
        } else {
          robotsContent = robotsContent.replace(
            /Sitemap: https:\/\/webmark\.site\/sitemap\.xml/,
            'Sitemap: https://webmark.chahatkesh.me/sitemap.xml\nSitemap: https://webmark.chahatkesh.me/sitemap-features.xml\nSitemap: https://webmark.chahatkesh.me/sitemap-faq.xml'
          );
        }
      }

      // Ensure we have proper user agent rules for Googlebot and Bingbot
      if (!robotsContent.includes('User-agent: Googlebot')) {
        // Add more specific bot rules
        if (robotsContent.includes('User-agent: *')) {
          // Add after the general rules
          const generalRulesEnd = robotsContent.indexOf('User-agent: *') + robotsContent.substring(robotsContent.indexOf('User-agent: *')).indexOf('\n\n');
          if (generalRulesEnd > 0) {
            const before = robotsContent.substring(0, generalRulesEnd);
            const after = robotsContent.substring(generalRulesEnd);

            // Additional rules for specific bots
            const additionalRules = `

# Google-specific crawl rate settings
User-agent: Googlebot
Allow: /
Crawl-delay: 1

# Bing-specific crawl rate settings
User-agent: Bingbot
Allow: /
Crawl-delay: 2
`;
            robotsContent = before + additionalRules + after;
          }
        }
      }

      fs.writeFileSync(robotsPath, robotsContent);
      console.log('Updated robots.txt with all sitemap references and bot-specific rules');
    }
  } catch (error) {
    console.error('Error updating robots.txt:', error);
  }
}

// Execute if run directly
if (import.meta.url === import.meta.main) {
  writeSitemap();
  updateRobotsTxt();
}

export default {
  generateSitemapXML,
  writeSitemap,
  updateRobotsTxt,
};

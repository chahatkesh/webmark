/**
 * Meta Description Generator
 * 
 * This script analyzes page content and generates optimized meta descriptions
 * for each page in the Webmark website.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Page descriptions mapping
const PAGE_DESCRIPTIONS = {
  // Main pages
  'Home': 'Simplify your digital life with Webmark, the ultimate bookmark management tool. Organize, categorize, and access your bookmarks efficiently with our modern, user-friendly interface.',
  'Docs': 'Comprehensive documentation for Webmark bookmark management platform. Learn how to organize, sync, and optimize your bookmark collection with step-by-step guides.',
  'Features': 'Discover powerful features of Webmark: custom categorization, instant search, cloud sync, and more. The modern solution for bookmark management.',
  'About': 'Learn about Webmark\'s mission to simplify digital organization. Our team is dedicated to creating the most user-friendly bookmark management experience.',
  'Privacy': 'Read Webmark\'s privacy policy. We respect your data and are committed to transparency in how we collect, use, and protect your information.',
  'Terms': 'Webmark terms of service and conditions. Learn about the rules and guidelines governing the use of our bookmark management platform.',
  'FAQ': 'Find answers to frequently asked questions about Webmark\'s bookmark management platform. Get help with account setup, bookmark organization, and troubleshooting.',
  'Onboarding': 'Get started with Webmark in minutes. Our simple onboarding process will have you organizing your bookmarks efficiently in no time.',
  'Contact': 'Connect with the Webmark team for support, feedback, or partnership opportunities. We\'re here to help with your bookmark management needs.',
  'Report': 'Report technical issues or suggest improvements for Webmark. Help us make the best bookmark management platform for everyone.',

  // Features-specific pages
  'BookmarkManagement': 'Organize your bookmarks with Webmark\'s intuitive management system. Add, edit, and delete bookmarks with ease.',
  'Categorization': 'Create custom categories and folders in Webmark to organize your bookmarks exactly the way you want them.',
  'Search': 'Find any bookmark instantly with Webmark\'s powerful search functionality. Filter by title, tags, categories, and more.',
  'Sync': 'Keep your bookmarks synchronized across all your devices with Webmark\'s seamless cloud synchronization.',
  'Dashboard': 'View and manage all your bookmarks from Webmark\'s clean, intuitive dashboard. See statistics and usage patterns at a glance.',

  // FAQ sections
  'GeneralFAQ': 'General questions about Webmark bookmark management platform. Learn about our service, features, and capabilities.',
  'AccountFAQ': 'Account management FAQs for Webmark users. Find help with registration, login, password recovery, and account settings.',
  'BookmarkFAQ': 'Bookmark-related FAQs for Webmark users. Learn how to add, organize, tag, and manage your bookmarks effectively.',
  'PrivacyFAQ': 'Privacy and security FAQs for Webmark. Learn how we protect your data and keep your bookmarks secure.',
  'TroubleshootingFAQ': 'Troubleshooting guides for common Webmark issues. Get help with technical problems and find quick solutions.'
};

/**
 * Get optimized meta description for a page
 * 
 * @param {string} pageKey - The page key in the descriptions object
 * @param {number} [maxLength=160] - Maximum length for the meta description
 * @returns {string} Optimized meta description
 */
function getMetaDescription(pageKey, maxLength = 160) {
  const description = PAGE_DESCRIPTIONS[pageKey] || PAGE_DESCRIPTIONS['Home'];

  // Ensure description doesn't exceed max length
  if (description.length <= maxLength) {
    return description;
  }

  // If too long, cut at the last complete sentence within the limit
  const truncated = description.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');

  if (lastPeriod > 0) {
    return truncated.substring(0, lastPeriod + 1);
  }

  // If no period, cut at the last space to avoid cutting words
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace) + '...';
}

/**
 * Update meta description in a page component file
 * 
 * @param {string} filePath - Path to the React component file
 * @param {string} pageKey - Key for the page description
 * @returns {boolean} Whether the update was successful
 */
function updatePageMetaDescription(filePath, pageKey) {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const description = getMetaDescription(pageKey);

    // Check if file already has SEO component
    if (content.includes('<SEO')) {
      // Update description prop if it exists
      if (content.match(/description=["'].*?["']/)) {
        content = content.replace(
          /description=["'].*?["']/,
          `description="${description}"`
        );
      } else {
        // Add description prop if it doesn't exist
        content = content.replace(
          /<SEO/,
          `<SEO description="${description}"`
        );
      }
    } else {
      // If no SEO component, import and add it
      if (!content.includes('import SEO')) {
        // Add import
        content = content.replace(
          /import React.*?;/,
          `$&\nimport SEO from "../components/SEO";`
        );
      }

      // Add SEO component at the start of the return statement
      content = content.replace(
        /(return\s*\(\s*)<([^>]+)/,
        `$1<SEO title="${pageKey}" description="${description}" path="${pageKey.toLowerCase()}" />\n      <$2`
      );
    }

    fs.writeFileSync(filePath, content);
    console.log(`Updated meta description for ${pageKey}`);
    return true;
  } catch (error) {
    console.error(`Error updating ${pageKey}:`, error);
    return false;
  }
}

/**
 * Update meta descriptions for all main pages
 */
function updateAllPageDescriptions() {
  const pagesDir = path.join(__dirname, '../pages');
  const results = {
    success: 0,
    failed: 0,
    pages: {}
  };

  try {
    const pageFiles = fs.readdirSync(pagesDir);

    for (const file of pageFiles) {
      if (file.endsWith('.jsx')) {
        const baseName = file.replace('.jsx', '');
        let pageKey;

        // Map file names to page keys
        if (baseName === 'Home') pageKey = 'Home';
        else if (baseName === 'Docs') pageKey = 'Docs';
        else if (baseName.includes('Privacy')) pageKey = 'Privacy';
        else if (baseName.includes('Terms')) pageKey = 'Terms';
        else if (baseName.includes('NotFound')) continue; // Skip 404 page
        else if (baseName.includes('FAQ')) pageKey = 'FAQ';
        else if (baseName.includes('Onboarding')) pageKey = 'Onboarding';
        else if (baseName.includes('ReportProblem')) pageKey = 'Report';
        else pageKey = baseName;

        const filePath = path.join(pagesDir, file);
        const success = updatePageMetaDescription(filePath, pageKey);

        if (success) {
          results.success++;
        } else {
          results.failed++;
        }

        results.pages[baseName] = {
          success,
          description: getMetaDescription(pageKey)
        };
      }
    }

    console.log('===== Meta Description Update Summary =====');
    console.log(`Successfully updated: ${results.success} pages`);
    console.log(`Failed to update: ${results.failed} pages`);

    return results;
  } catch (error) {
    console.error('Error updating page descriptions:', error);
    return {
      success: 0,
      failed: 0,
      error: error.message
    };
  }
}

// Execute if run directly
if (import.meta.url === import.meta.main) {
  updateAllPageDescriptions();
}

export {
  getMetaDescription,
  updatePageMetaDescription,
  updateAllPageDescriptions
};

export default {
  getMetaDescription,
  updatePageMetaDescription,
  updateAllPageDescriptions
};

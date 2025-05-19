/**
 * JSON-LD Generator for Structured Data
 * 
 * This utility helps generate schema.org JSON-LD structured data for different page types
 * to improve search engine understanding and display of content.
 */

/**
 * Generate WebApplication structured data
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.name - Application name
 * @param {string} options.url - Application URL
 * @param {string} options.description - Application description
 * @param {string} options.applicationCategory - Application category
 * @param {string} options.publishedDate - Date when the application was published
 * @param {string} options.modifiedDate - Date when the application was last modified
 * @returns {Object} JSON-LD structured data
 */
export function generateWebAppSchema({
  name = "Webmark",
  url = "https://webmark.site",
  description = "Modern bookmark management application",
  applicationCategory = "ProductivityApplication",
  publishedDate = "2025-01-01",
  modifiedDate = "2025-05-20",
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": name,
    "url": url,
    "description": description,
    "applicationCategory": applicationCategory,
    "applicationSubCategory": "BookmarkManager",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "156",
      "bestRating": "5",
      "worstRating": "1"
    },
    "datePublished": publishedDate,
    "dateModified": modifiedDate,
  };
}

/**
 * Generate BreadcrumbList structured data
 * 
 * @param {Object[]} items - Array of breadcrumb items
 * @param {string} items[].name - Item name
 * @param {string} items[].url - Item URL
 * @returns {Object} JSON-LD structured data
 */
export function generateBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

/**
 * Generate FAQPage structured data
 * 
 * @param {Object[]} faqs - Array of FAQ items
 * @param {string} faqs[].question - Question text
 * @param {string} faqs[].answer - Answer text (can include HTML)
 * @returns {Object} JSON-LD structured data
 */
export function generateFAQSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Generate HowTo structured data (for tutorial pages)
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.name - Name of the how-to
 * @param {string} options.description - Description of the how-to
 * @param {Object[]} options.steps - Array of step objects
 * @param {string} options.steps[].name - Step name
 * @param {string} options.steps[].text - Step description
 * @param {string} options.totalTime - ISO 8601 duration format (e.g., "PT30M" for 30 minutes)
 * @returns {Object} JSON-LD structured data
 */
export function generateHowToSchema({
  name,
  description,
  steps,
  totalTime = "PT10M"
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "totalTime": totalTime,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "url": step.url || undefined
    }))
  };
}

/**
 * Generate Article structured data
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.headline - Article headline
 * @param {string} options.description - Article description
 * @param {string} options.url - Article URL
 * @param {string} options.imageUrl - Featured image URL
 * @param {string} options.datePublished - Publication date
 * @param {string} options.dateModified - Modification date
 * @param {string} options.authorName - Author name
 * @returns {Object} JSON-LD structured data
 */
export function generateArticleSchema({
  headline,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
  authorName = "Webmark Team"
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "url": url,
    "image": imageUrl,
    "datePublished": datePublished,
    "dateModified": dateModified,
    "author": {
      "@type": "Person",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "Webmark",
      "logo": {
        "@type": "ImageObject",
        "url": "https://webmark.site/logo_color.png"
      }
    }
  };
}

export default {
  generateWebAppSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateArticleSchema
};

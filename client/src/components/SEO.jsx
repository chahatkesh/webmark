import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { getCanonicalUrl } from "../utils/canonicalizer";

/**
 * Enhanced SEO component for managing all document head metadata and tags
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.canonicalUrl - Canonical URL
 * @param {string} props.keywords - Page keywords
 * @param {string} props.ogImage - Open Graph image URL
 * @param {string} props.ogType - Open Graph type
 * @param {string} props.twitterCard - Twitter card type
 * @param {string} props.pageType - Type of page (home, docs, terms, etc.)
 * @param {string} props.publishedDate - Date when content was published
 * @param {string} props.modifiedDate - Date when content was last modified
 * @param {Object} props.structuredData - Additional structured data for this page
 * @param {boolean} props.indexPage - Whether search engines should index this page
 */
const SEO = ({
  title = "Webmark - Modern Bookmark Management Application",
  description = "Simplify your digital life with Webmark, the ultimate bookmark management tool. Organize, categorize, and access your bookmarks efficiently.",
  canonicalUrl = "https://webmark.chahatkesh.me",
  keywords = "bookmark manager, bookmark organization, web bookmarks, bookmark tool",
  ogImage = "https://webmark.chahatkesh.me/hero_image.png",
  ogType = "website",
  twitterCard = "summary_large_image",
  pageType = "website",
  publishedDate = "2025-01-01",
  modifiedDate = "2025-05-20",
  structuredData = null,
  indexPage = true,
  useTrailingSlash = false,
  path = null,
}) => {
  // Generate canonical URL if not explicitly provided, using our canonicalizer
  const finalCanonicalUrl =
    canonicalUrl === "https://webmark.chahatkesh.me" && path
      ? getCanonicalUrl({ path, useTrailingSlash })
      : canonicalUrl;
  // Format the complete title
  const formattedTitle = title.includes("Webmark")
    ? title
    : `${title} | Webmark`;

  // Create default structured data for WebApplication
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Webmark",
    url: finalCanonicalUrl,
    description: description,
    applicationCategory: "ProductivityApplication",
    applicationSubCategory: "BookmarkManager",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "156",
      bestRating: "5",
      worstRating: "1",
    },
    datePublished: publishedDate,
    dateModified: modifiedDate,
    keywords: keywords,
  };

  // Create breadcrumb data if this is not the homepage
  const breadcrumbData =
    finalCanonicalUrl !== "https://webmark.chahatkesh.me"
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://webmark.chahatkesh.me",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: title,
              item: finalCanonicalUrl,
            },
          ],
        }
      : null;

  // FAQ structured data for FAQ pages
  const faqData =
    pageType === "faq"
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [],
          // FAQ items will be added by the FAQ page component
        }
      : null;

  // Merge with any custom structured data
  const finalStructuredData = structuredData
    ? { ...defaultStructuredData, ...structuredData }
    : defaultStructuredData;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Search Engine Directives */}
      <meta
        name="robots"
        content={
          indexPage
            ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
            : "noindex, nofollow"
        }
      />
      <meta
        name="googlebot"
        content={
          indexPage
            ? "index, follow, max-snippet:-1, max-image-preview:large"
            : "noindex"
        }
      />
      <meta name="google" content="notranslate" />
      <meta name="rating" content="general" />

      {/* Date Information */}
      <meta name="article:published_time" content={publishedDate} />
      <meta name="article:modified_time" content={modifiedDate} />

      {/* Language and Locale */}
      <meta name="language" content="English" />
      <meta property="og:locale" content="en_US" />

      {/* Canonical Link */}
      <link rel="canonical" href={finalCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={finalCanonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Webmark" />

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:title" content={formattedTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:url" content={finalCanonicalUrl} />
      <meta property="twitter:image" content={ogImage} />

      {/* Primary Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>

      {/* Breadcrumb Structured Data (if not homepage) */}
      {breadcrumbData && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
      )}

      {/* FAQ Structured Data (if FAQ page) */}
      {faqData && (
        <script type="application/ld+json">{JSON.stringify(faqData)}</script>
      )}
    </Helmet>
  );
};

// Define PropTypes for validation
SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  canonicalUrl: PropTypes.string,
  keywords: PropTypes.string,
  ogImage: PropTypes.string,
  ogType: PropTypes.string,
  twitterCard: PropTypes.string,
  pageType: PropTypes.string,
  publishedDate: PropTypes.string,
  modifiedDate: PropTypes.string,
  structuredData: PropTypes.object,
  indexPage: PropTypes.bool,
  useTrailingSlash: PropTypes.bool,
  path: PropTypes.string,
};

export default SEO;

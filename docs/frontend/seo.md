# SEO

Client-side SEO for the marketing site and public pages.

## Components & Utilities

| Piece             | Path                                           | Role                                            |
| ----------------- | ---------------------------------------------- | ----------------------------------------------- |
| `SEO`             | `client/src/components/SEO.jsx`                | react-helmet meta, robots, OG/Twitter, JSON-LD  |
| Canonicalizer     | `client/src/utils/canonicalizer.js`            | Normalize URLs, strip UTM                       |
| JSON-LD helpers   | `client/src/utils/jsonLDGenerator.js`          | WebApplication, FAQ, Article, Breadcrumb, HowTo |
| Sitemap generator | `client/src/utils/sitemapGenerator.js`         | Build-time sitemap + robots updates             |
| Meta descriptions | `client/src/utils/metaDescriptionGenerator.js` | Page descriptions                               |
| SEO monitor       | `client/src/utils/seoMonitor.js`               | Monitoring script                               |

## Per-Page Usage

```jsx
import SEO from "../components/SEO";

<SEO
  title="Page Title"
  description="Description for search results"
  path="/your-path"
/>;
```

Home also embeds WebApplication structured data. Private routes (auth, dashboard, profile) set `indexPage={false}` where appropriate.

## Static Assets

Under `client/public/`:

- `robots.txt` — disallows `/user/`, `/auth`, `/api/`; references sitemaps
- `sitemap-index.xml`, `sitemap.xml`, `sitemap-features.xml`, `sitemap-faq.xml`

Generated/refreshed during `pnpm --filter client run build` (runs `sitemapGenerator.js` first).

## npm Scripts (client)

| Script                                 | Purpose                           |
| -------------------------------------- | --------------------------------- |
| `generate-sitemap` / `update-sitemaps` | Regenerate sitemap files          |
| `update-meta`                          | Meta description generator        |
| `seo-analyze`                          | Lighthouse against production URL |
| `seo-validate`                         | Schema validation                 |
| `seo-monitor`                          | Monitoring report                 |
| `seo-full-update`                      | Meta + sitemap + analyze          |

## FAQ Schema

`client/src/components/FAQ.jsx` can emit FAQPage JSON-LD. Ensure it is mounted on a public route if you want that markup indexed; sitemap FAQ entries exist independently.

## Performance Hints

- DNS prefetch / preconnect in HTML where configured
- `Prefetcher` idle-loads critical images in production
- Asset cache headers in `client/vercel.json` (`/assets/*` immutable)

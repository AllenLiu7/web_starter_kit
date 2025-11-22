# SEO Setup Guide

## Overview

This starter kit includes comprehensive SEO configuration with metadata helpers, sitemap generation, and search engine optimization.

---

## ⚠️ CRITICAL: WWW vs Non-WWW Decision

**YOU MUST DECIDE NOW: Will your site use `www.yourdomain.com` or `yourdomain.com`?**

### Why This Matters

Search engines treat `www.yourdomain.com` and `yourdomain.com` as **two completely different websites**. If you don't choose one version and enforce it consistently:

- ❌ Google will split your SEO authority between both versions
- ❌ Your rankings will be weaker across both URLs
- ❌ Fixing this later requires waiting weeks/months for Google to re-index
- ❌ You'll lose valuable link equity and ranking signals

### The Rule: Pick ONE and Be Consistent Everywhere

1. **Choose your canonical domain:**
   - Option A: `https://www.yourdomain.com` (with www)
   - Option B: `https://yourdomain.com` (without www)

2. **Update NEXT_PUBLIC_APP_URL in `.env.local`:**

   ```env
   # ✅ GOOD - Consistent choice
   NEXT_PUBLIC_APP_URL=https://www.yourdomain.com

   # ❌ BAD - Don't switch between www and non-www
   NEXT_PUBLIC_APP_URL=https://yourdomain.com  # If you chose www above
   ```

3. **Configure 301 redirects** (on your hosting platform):
   - If you chose **WITH www**: Redirect `yourdomain.com` → `www.yourdomain.com`
   - If you chose **WITHOUT www**: Redirect `www.yourdomain.com` → `yourdomain.com`

4. **Set preferred domain in Google Search Console:**
   - Add BOTH versions as properties
   - Use the Domain property type to consolidate both
   - Verify both versions

5. **Update all canonical URLs** to use your chosen version

### How to Configure Redirects

**Vercel:**

```json
// vercel.json
{
  "redirects": [
    {
      "source": "https://yourdomain.com/:path*",
      "destination": "https://www.yourdomain.com/:path*",
      "permanent": true
    }
  ]
}
```

**Next.js (next.config.ts):**

```typescript
module.exports = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'yourdomain.com' }],
        destination: 'https://www.yourdomain.com/:path*',
        permanent: true,
      },
    ]
  },
}
```

### Common Mistakes

- ❌ Forgetting to redirect one version to the other
- ❌ Using www in some places and non-www in others
- ❌ Not updating NEXT_PUBLIC_APP_URL to match your choice
- ❌ Not setting canonical tags consistently
- ❌ Changing your mind after Google has indexed your site

**Bottom Line:** Google doesn't care which you choose, but you MUST choose one and enforce it everywhere from day one.

---

## Files Created

1. **[src/lib/seo.ts](../src/lib/seo.ts)** - SEO metadata helper functions
2. **[src/app/sitemap.ts](../src/app/sitemap.ts)** - Dynamic sitemap generation
3. **[public/robots.txt](../public/robots.txt)** - Search engine crawler instructions

---

## Features Included

- **Open Graph (OG) Tags** - For social media sharing (Facebook, LinkedIn)
- **Twitter Cards** - Optimized Twitter sharing
- **Canonical URLs** - Prevent duplicate content issues
- **Dynamic Metadata** - Easy per-page SEO customization
- **Sitemap.xml** - Auto-generated for search engines
- **robots.txt** - Crawler configuration

---

## Usage Examples

### Basic Page SEO

```typescript
import { generateSEO } from '@/lib/seo'
import { Metadata } from 'next'

export const metadata: Metadata = generateSEO({
  title: 'About Us',
  description: 'Learn more about our company',
})
```

### Blog Post SEO

```typescript
import { generateBlogPostSEO } from '@/lib/seo'

export const metadata = generateBlogPostSEO({
  title: 'How to Build a Next.js App',
  description: 'A comprehensive guide to building modern web apps',
  slug: 'how-to-build-nextjs-app',
  publishedTime: '2024-01-15T10:00:00Z',
  authors: ['John Doe'],
  tags: ['nextjs', 'react', 'tutorial'],
  image: '/blog/nextjs-guide.jpg', // optional
})
```

### Custom OG Image

```typescript
export const metadata = generateSEO({
  title: 'Product Page',
  description: 'Amazing product description',
  image: '/products/amazing-product.jpg',
  url: '/products/amazing-product',
})
```

### Prevent Indexing (Admin Pages)

```typescript
export const metadata = generateSEO({
  title: 'Admin Dashboard',
  noindex: true,
})
```

---

## Configuration

### Update Site Config

Edit [src/lib/seo.ts](../src/lib/seo.ts) to customize:

```typescript
const siteConfig = {
  name: 'Your Site Name',
  description: 'Your site description',
  url: process.env.NEXT_PUBLIC_APP_URL,
  ogImage: '/og-image.jpg',
  twitterHandle: '@yourhandle',
}
```

### Adding Routes to Sitemap

Edit [src/app/sitemap.ts](../src/app/sitemap.ts):

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}/new-page`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Add more routes...
  ]
}
```

### Robots.txt Configuration

Edit [public/robots.txt](../public/robots.txt) to control crawler access:

```txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://yourdomain.com/sitemap.xml
```

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] **CRITICAL: Decide on www vs non-www** (see warning above)
- [ ] **CRITICAL: Configure 301 redirects** for your chosen canonical domain
- [ ] Update `NEXT_PUBLIC_APP_URL` in `.env.local` to production URL (with your www choice)
- [ ] Configure DNS and verify both www and non-www versions point to your site
- [ ] Set up Google Search Console for BOTH versions (Domain property recommended)
- [ ] Create Open Graph image (1200x630px) at `public/og-image.jpg`
- [ ] Update `siteConfig` in `src/lib/seo.ts` with your details
- [ ] Update Twitter handle in `siteConfig`
- [ ] Update sitemap.xml URL in robots.txt (use your chosen www/non-www version)
- [ ] Add all important routes to sitemap.ts
- [ ] Test meta tags with [metatags.io](https://metatags.io/)
- [ ] Verify sitemap at `/sitemap.xml`
- [ ] Verify robots.txt at `/robots.txt`
- [ ] Test that non-canonical version redirects to canonical version (301 redirect)
- [ ] Check that all internal links use the canonical domain

---

## Testing SEO

### 1. View Page Source

Right-click page → View Page Source

### 2. Check Meta Tags

Look for `<meta property="og:*">` tags in the HTML

### 3. Test Social Sharing

Use [metatags.io](https://metatags.io/) to preview how your site looks when shared

### 4. Verify Sitemap

Visit `http://localhost:3000/sitemap.xml`

### 5. Verify Robots.txt

Visit `http://localhost:3000/robots.txt`

---

## Post-Deployment Tasks

1. **Create OG Image** - Design a 1200x630px image for social sharing
2. **Configure Production URL** - Set `NEXT_PUBLIC_APP_URL` in production environment
3. **Submit Sitemap** - Submit to Google Search Console
4. **Test Social Cards** - Share on Twitter/Facebook to verify OG tags work
5. **Monitor Performance** - Use Google Search Console to track indexing

---

## Resources

### Official Documentation

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js Metadata and OG Images Guide](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Google Search Central](https://developers.google.com/search)
- [Google Canonical URL Documentation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Schema.org](https://schema.org/) - Structured data

### SEO Best Practices (2025)

- [Next.js SEO in 2025: Best Practices](https://www.slatebytes.com/articles/next-js-seo-in-2025-best-practices-meta-tags-and-performance-optimization-for-high-google-rankings)
- [Next.js 15 SEO Checklist for Developers](https://dev.to/vrushikvisavadiya/nextjs-15-seo-checklist-for-developers-in-2025-with-code-examples-57i1)
- [Maximizing SEO with Meta Data in Next.js 15](https://dev.to/joodi/maximizing-seo-with-meta-data-in-nextjs-15-a-comprehensive-guide-4pa7)
- [Next.js 15 SEO: Complete Guide](https://www.digitalapplied.com/blog/nextjs-seo-guide)

### Canonical URL & WWW Resources

- [WWW vs Non-WWW URLs: For Best SEO](https://www.hosted.com/blog/www-vs-non-www-urls/)
- [What Is a Canonical URL? Ultimate Guide](https://www.seo.com/basics/glossary/canonical-url/)
- [Canonical URLs: A Beginner's Guide](https://www.semrush.com/blog/canonical-url-guide/)
- [What is a Canonical URL? Best Practices](https://ahrefs.com/seo/glossary/canonical-url)
- [Google WWW vs Non-WWW Discussion](https://support.google.com/webmasters/thread/15013153/www-or-non-www-user-declared-canonical-or-google-selected-canonical)

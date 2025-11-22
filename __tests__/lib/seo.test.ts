import { expect, test, describe } from 'vitest'

import { generateSEO, generateBlogPostSEO, siteConfig } from '@/lib/seo'

describe('SEO Helper Functions', () => {
  describe('generateSEO', () => {
    test('generates basic metadata with title and description', () => {
      const metadata = generateSEO({
        title: 'About Us',
        description: 'Learn more about our company',
      })

      expect(metadata.title).toBe(`About Us | ${siteConfig.name}`)
      expect(metadata.description).toBe('Learn more about our company')
    })

    test('generates Open Graph metadata', () => {
      const metadata = generateSEO({
        title: 'Product Page',
        description: 'Amazing product',
      })

      expect(metadata.openGraph).toBeDefined()
      expect(metadata.openGraph?.title).toBe(`Product Page | ${siteConfig.name}`)
      expect(metadata.openGraph?.description).toBe('Amazing product')
      expect(metadata.openGraph?.type).toBe('website')
    })

    test('generates Twitter Card metadata', () => {
      const metadata = generateSEO({
        title: 'Blog Post',
        description: 'Interesting article',
      })

      expect(metadata.twitter).toBeDefined()
      expect(metadata.twitter?.card).toBe('summary_large_image')
      expect(metadata.twitter?.title).toBe(`Blog Post | ${siteConfig.name}`)
    })

    test('uses custom image when provided', () => {
      const customImage = '/custom-image.jpg'
      const metadata = generateSEO({
        title: 'Test',
        image: customImage,
      })

      expect(metadata.openGraph?.images?.[0]?.url).toContain(customImage)
    })

    test('sets noindex when specified', () => {
      const metadata = generateSEO({
        title: 'Admin Page',
        noindex: true,
      })

      expect(metadata.robots).toBeDefined()
      expect(metadata.robots?.index).toBe(false)
      expect(metadata.robots?.follow).toBe(false)
    })

    test('generates canonical URL', () => {
      const metadata = generateSEO({
        title: 'Test Page',
        url: '/test',
      })

      expect(metadata.alternates?.canonical).toContain('/test')
    })
  })

  describe('generateBlogPostSEO', () => {
    test('generates blog post metadata with article type', () => {
      const metadata = generateBlogPostSEO({
        title: 'How to Build Apps',
        description: 'A comprehensive guide',
        slug: 'how-to-build-apps',
        publishedTime: '2024-01-15T10:00:00Z',
        authors: ['John Doe'],
        tags: ['nextjs', 'react'],
      })

      expect(metadata.title).toBe(`How to Build Apps | ${siteConfig.name}`)
      expect(metadata.openGraph?.type).toBe('article')
      expect(metadata.openGraph?.publishedTime).toBe('2024-01-15T10:00:00Z')
      expect(metadata.openGraph?.authors).toEqual(['John Doe'])
      expect(metadata.keywords).toEqual(['nextjs', 'react'])
    })

    test('generates correct blog post URL', () => {
      const metadata = generateBlogPostSEO({
        title: 'Test Post',
        description: 'Test description',
        slug: 'test-post',
        publishedTime: '2024-01-15T10:00:00Z',
      })

      expect(metadata.alternates?.canonical).toContain('/blog/test-post')
      expect(metadata.openGraph?.url).toContain('/blog/test-post')
    })
  })

  describe('siteConfig', () => {
    test('has required configuration properties', () => {
      expect(siteConfig.name).toBeDefined()
      expect(siteConfig.description).toBeDefined()
      expect(siteConfig.url).toBeDefined()
      expect(siteConfig.ogImage).toBeDefined()
      expect(siteConfig.twitterHandle).toBeDefined()
    })
  })
})

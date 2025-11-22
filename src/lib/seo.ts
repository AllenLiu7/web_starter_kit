import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  authors?: string[]
  tags?: string[]
  noindex?: boolean
}

const siteConfig = {
  name: 'Next.js 15 Starter Kit',
  description: 'Production-ready Next.js 15 starter with Supabase, Prisma, and TypeScript',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
  twitterHandle: '@yourtwitterhandle',
}

export function generateSEO({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  authors,
  tags,
  noindex = false,
}: SEOProps = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name
  const pageDescription = description || siteConfig.description
  const pageImage = image || `${siteConfig.url}${siteConfig.ogImage}`
  const pageUrl = url ? `${siteConfig.url}${url}` : siteConfig.url

  return {
    title: pageTitle,
    description: pageDescription,
    applicationName: siteConfig.name,
    ...(noindex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    openGraph: {
      type,
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
      ...(type === 'article' && publishedTime && { publishedTime }),
      ...(type === 'article' && authors && { authors }),
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
      creator: siteConfig.twitterHandle,
    },
    ...(tags && {
      keywords: tags,
    }),
    alternates: {
      canonical: pageUrl,
    },
  }
}

export function generateBlogPostSEO({
  title,
  description,
  image,
  slug,
  publishedTime,
  authors,
  tags,
}: {
  title: string
  description: string
  image?: string
  slug: string
  publishedTime: string
  authors?: string[]
  tags?: string[]
}): Metadata {
  return generateSEO({
    title,
    description,
    image,
    url: `/blog/${slug}`,
    type: 'article',
    publishedTime,
    authors,
    tags,
  })
}

export { siteConfig }

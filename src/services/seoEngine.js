// Enterprise SEO, Structured Data (JSON-LD), Dynamic XML Sitemap & Robots.txt Engine for AutoZoneIndia

export const BASE_URL = 'https://autozonindia.vercel.app';

/**
 * Requirement #21: Dynamic XML Sitemap Generator
 * Includes published products, categories, brands, vehicles, blog posts, CMS pages, dynamic landing pages.
 * Excludes admin, account, checkout, cart, drafts, archived, noindex items.
 */
export const generateXMLSitemapIndex = (data = {}) => {
  const {
    products = [],
    categories = [],
    brands = [],
    vehicles = [],
    blogPosts = [],
    cmsPages = []
  } = data;

  const today = new Date().toISOString().split('T')[0];

  const buildUrlNode = (path, priority = '0.7', changefreq = 'weekly') => `
    <url>
      <loc>${BASE_URL}${path}</loc>
      <lastmod>${today}</lastmod>
      <changefreq>${changefreq}</changefreq>
      <priority>${priority}</priority>
    </url>`;

  const staticUrls = [
    buildUrlNode('/', '1.0', 'daily'),
    buildUrlNode('/blog', '0.8', 'daily'),
    buildUrlNode('/faq', '0.7', 'weekly')
  ];

  const productUrls = products
    .filter(p => !p.noindex && p.is_active !== false)
    .map(p => buildUrlNode(`/product/${p.slug || p.id}`, '0.9', 'daily'));

  const categoryUrls = categories
    .filter(c => !c.noindex)
    .map(c => buildUrlNode(`/category/${c.slug || c.id}`, '0.8', 'weekly'));

  const brandUrls = brands
    .filter(b => !b.noindex)
    .map(b => buildUrlNode(`/brand/${b.slug || b.id}`, '0.7', 'monthly'));

  const vehicleUrls = vehicles
    .filter(v => !v.noindex)
    .map(v => buildUrlNode(`/parts-for/${v.slug || v.id}`, '0.8', 'weekly'));

  const blogUrls = blogPosts
    .filter(b => b.status === 'published' && !b.noindex)
    .map(b => buildUrlNode(`/blog/${b.slug}`, '0.8', 'weekly'));

  const cmsUrls = cmsPages
    .filter(p => p.status === 'published' && !p.noindex)
    .map(p => buildUrlNode(`/page/${p.slug}`, '0.7', 'monthly'));

  const allNodes = [
    ...staticUrls,
    ...productUrls,
    ...categoryUrls,
    ...brandUrls,
    ...vehicleUrls,
    ...blogUrls,
    ...cmsUrls
  ].join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allNodes}
</urlset>`;
};

/**
 * Requirement #22: Robots.txt Generator
 */
export const generateRobotsTxt = () => {
  return `User-agent: *
Disallow: /admin
Disallow: /admin/*
Disallow: /checkout
Disallow: /account
Disallow: /account/*
Disallow: /cart
Disallow: /my-garage

Sitemap: ${BASE_URL}/sitemap.xml`;
};

/**
 * Requirement #25: JSON-LD Product Schema
 */
export const generateProductJSONLD = (product) => {
  if (!product) return null;
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name || product.title,
    "image": product.image ? [product.image] : [],
    "description": product.meta_description || product.description || `${product.title || product.name} - Genuine OEM automobile component.`,
    "sku": product.sku || product.part_number || product.id,
    "mpn": product.part_number || product.sku,
    "brand": {
      "@type": "Brand",
      "name": product.brand || (product.brand_rel && product.brand_rel.name) || "AutoZoneIndia"
    },
    "offers": {
      "@type": "Offer",
      "url": `${BASE_URL}/product/${product.slug || product.id}`,
      "priceCurrency": "INR",
      "price": product.price,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": (product.stock > 0 || product.stock_quantity > 0) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "AutoZoneIndia Enterprise"
      }
    }
  };
};

/**
 * Requirement #20: FAQ JSON-LD Schema Generator
 * Only generates schema when FAQ content actually appears on the page.
 */
export const generateFaqJSONLD = (faqs = []) => {
  const publishedFaqs = faqs.filter(f => f.status === 'published' && f.question && f.answer);
  if (!publishedFaqs.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": publishedFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer.replace(/<[^>]*>?/gm, '') // Strip HTML tags for clean text
      }
    }))
  };
};

/**
 * Article JSON-LD Schema Generator for Blog Posts
 */
export const generateArticleJSONLD = (post, authorName = 'AutoZoneIndia Editorial Board') => {
  if (!post) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "image": post.featured_image_url ? [post.featured_image_url] : [],
    "datePublished": post.published_at || post.created_at,
    "dateModified": post.updated_at || post.published_at,
    "author": {
      "@type": "Organization",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "AutoZoneIndia",
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/autozon-logo.png`
      }
    },
    "description": post.meta_description || post.excerpt
  };
};

/**
 * Requirement #24: Breadcrumb JSON-LD Generator
 */
export const generateBreadcrumbJSONLD = (items = []) => {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url ? `${BASE_URL}${item.url}` : undefined
    }))
  };
};

/**
 * Requirement #26: Open Graph & Meta Tags Object Generator
 */
export const getMetaTags = ({ title, description, image, url, type = 'website', noindex = false, canonical }) => {
  const fullUrl = canonical || (url ? `${BASE_URL}${url}` : BASE_URL);
  const metaTitle = title ? `${title} | AutoZoneIndia` : 'AutoZoneIndia - Spare Parts Marketplace';
  const metaDesc = description || 'Shop genuine OEM car spare parts, accessories & components online with vehicle compatibility guarantee.';
  const metaImage = image || `${BASE_URL}/og-default.jpg`;

  return {
    title: metaTitle,
    meta: [
      { name: 'description', content: metaDesc },
      { name: 'robots', content: noindex ? 'noindex, nofollow' : 'index, follow' },
      // Open Graph
      { property: 'og:title', content: metaTitle },
      { property: 'og:description', content: metaDesc },
      { property: 'og:image', content: metaImage },
      { property: 'og:url', content: fullUrl },
      { property: 'og:type', content: type },
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: metaTitle },
      { name: 'twitter:description', content: metaDesc },
      { name: 'twitter:image', content: metaImage }
    ],
    link: [
      { rel: 'canonical', href: fullUrl }
    ]
  };
};

export const calculateSEOHealthScore = (products = [], categories = []) => {
  let score = 85;
  if (products.length > 0) score += 10;
  if (categories.length > 0) score += 5;
  return Math.min(100, score);
};

export const SAMPLE_GSC_PERFORMANCE = {
  totalClicks: 14250,
  totalImpressions: 289000,
  avgCtr: '4.9%',
  avgPosition: '8.4',
  topKeywords: [
    { query: 'maruti swift brake pads online', clicks: 1240, impressions: 18500, position: 2.1 },
    { query: 'bosch spark plug hyundai creta', clicks: 980, impressions: 14200, position: 3.4 },
    { query: 'autozone india car spare parts', clicks: 850, impressions: 9600, position: 1.2 }
  ]
};

import Head from 'next/head';

/**
 * کامپوننت SEO Metadata برای بهینه‌سازی موتورهای جستجو
 */
export default function SEOMetadata({
  title = 'وب‌رایان - خدمات طراحی و توسعه وب',
  description = 'وب‌رایان ارائه‌دهنده خدمات تخصصی طراحی و توسعه وب‌سایت، فروشگاه اینترنتی و اپلیکیشن با جدیدترین تکنولوژی‌ها',
  keywords = 'طراحی وب سایت، توسعه وب، فروشگاه اینترنتی، اپلیکیشن موبایل، SEO، طراحی UI/UX',
  image = '/images/og-image.jpg',
  url = 'https://webrayan.com',
  type = 'website',
  author = 'وب‌رایان',
  siteName = 'وب‌رایان',
  locale = 'fa_IR',
  twitterHandle = '@webrayan',
  jsonLd,
}) {
  const fullTitle = title.includes('وب‌رایان') ? title : `${title} | وب‌رایان`;
  const fullUrl = url.startsWith('http') ? url : `https://webrayan.com${url}`;
  const fullImage = image.startsWith('http')
    ? image
    : `https://webrayan.com${image}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Persian" />
      <meta name="revisit-after" content="7 days" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${title} - ${siteName}`} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={`${title} - ${siteName}`} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      <meta name="msapplication-config" content="/browserconfig.xml" />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Alternate Languages */}
      <link rel="alternate" hrefLang="fa" href={fullUrl} />
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />

      {/* Preconnect to External Domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
}

/**
 * JSON-LD Structured Data Templates
 */
export const structuredData = {
  // Organization Schema
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'وب‌رایان',
    url: 'https://webrayan.com',
    logo: 'https://webrayan.com/images/logo.png',
    description:
      'ارائه‌دهنده خدمات تخصصی طراحی و توسعه وب‌سایت، فروشگاه اینترنتی و اپلیکیشن',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IR',
      addressLocality: 'تهران',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+98-21-xxxxxxxx',
      contactType: 'customer service',
      areaServed: 'IR',
      availableLanguage: 'Persian',
    },
    sameAs: [
      'https://instagram.com/webrayan',
      'https://linkedin.com/company/webrayan',
      'https://github.com/webrayan',
    ],
  },

  // Website Schema
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'وب‌رایان',
    url: 'https://webrayan.com',
    description: 'ارائه‌دهنده خدمات تخصصی طراحی و توسعه وب‌سایت',
    publisher: {
      '@type': 'Organization',
      name: 'وب‌رایان',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://webrayan.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  },

  // Service Schema
  service: (serviceName, description, price) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: description,
    provider: {
      '@type': 'Organization',
      name: 'وب‌رایان',
      url: 'https://webrayan.com',
    },
    areaServed: 'IR',
    availableLanguage: 'Persian',
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'IRR',
      availability: 'https://schema.org/InStock',
    },
  }),

  // Article Schema
  article: (
    title,
    description,
    author,
    datePublished,
    dateModified,
    image
  ) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'وب‌رایان',
      logo: {
        '@type': 'ImageObject',
        url: 'https://webrayan.com/images/logo.png',
      },
    },
    datePublished: datePublished,
    dateModified: dateModified,
    image: image,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://webrayan.com',
    },
  }),

  // FAQ Schema
  faq: faqItems => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }),

  // Breadcrumb Schema
  breadcrumb: items => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),

  // Review Schema
  reviews: reviews => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'وب‌رایان',
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      datePublished: review.date,
      reviewBody: review.text,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: '5',
      },
    })),
  }),
};

/**
 * Hook برای مدیریت SEO metadata
 */
export function useSEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  jsonLd,
}) {
  return {
    title,
    description,
    keywords,
    image,
    url,
    type,
    jsonLd,
  };
}

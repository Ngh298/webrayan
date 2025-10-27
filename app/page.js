import Link from 'next/link';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import ServicesPreview from './components/ServicesPreview';

export const metadata = {
  title: 'وب‌رایان | طراحی سایت حرفه‌ای - توسط Ngh',
  description:
    'سایت رویاهایتان را با تکنولوژی‌های مدرن Next.js، React و طراحی‌های منحصربه‌فرد می‌سازیم. توسط Ngh - توسعه‌دهنده وب.',
  keywords: 'طراحی سایت، توسعه وب، Next.js، React، برنامه نویسی، وب‌رایان، Ngh',
  openGraph: {
    title: 'وب‌رایان  | طراحی سایت حرفه‌ای',
    description: 'سایت رویاهایتان را با تکنولوژی‌های مدرن می‌سازیم',
    type: 'website',
    locale: 'fa_IR',
    url: 'https://webrayandev.ir',
    siteName: 'وب‌رایان ',
    images: [
      {
        url: '/images/home-og.jpg',
        width: 1200,
        height: 630,
        alt: 'وب‌رایان  - طراحی سایت حرفه‌ای',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'وب‌رایان  | طراحی سایت حرفه‌ای',
    description: 'سایت رویاهایتان را با تکنولوژی‌های مدرن می‌سازیم',
    images: ['/images/home-twitter.jpg'],
  },
  alternates: {
    canonical: 'https://webrayandev.ir',
  },
};

export default function HomePage() {
  // JSON-LD Schema برای صفحه اصلی
  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'وب‌رایان ',
    description: 'طراحی سایت حرفه‌ای و توسعه وب با تکنولوژی‌های مدرن',
    url: 'https://webrayandev.ir',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://webrayandev.ir/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    author: {
      '@type': 'Person',
      name: 'Ngh',
      url: 'https://webrayandev.ir/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'وب‌رایان',
      url: 'https://webrayandev.ir',
      logo: {
        '@type': 'ImageObject',
        url: 'https://webrayandev.ir/images/logo.png',
      },
    },
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Stats Section */}
        <StatsSection />

        {/* Services Preview */}
        <ServicesPreview />
      </main>
    </>
  );
}

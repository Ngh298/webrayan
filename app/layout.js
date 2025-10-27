import './styles/globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Header from './components/Header';
import Footer from './components/Footer';
import StructuredData from './components/StructuredData';
import AuthProvider from './components/SessionProvider';
import { FontPreloader } from './components/FontOptimizer';
import { auth } from '@/auth';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

export const metadata = {
  metadataBase: new URL('https://webrayandev.ir'),
  title: {
    default: 'وب‌رایان - طراحی سایت حرفه‌ای و توسعه وب',
    template: '%s | وب‌رایان',
  },
  description:
    'طراحی و توسعه سایت حرفه‌ای، فروشگاه اینترنتی، اپلیکیشن وب و خدمات دیجیتال مارکتینگ توسط تیم متخصص وب‌رایان',
  keywords: [
    'طراحی سایت',
    'توسعه وب',
    'فروشگاه اینترنتی',
    'برنامه‌نویسی',
    'React',
    'Next.js',
    'وب‌رایان',
  ],
  authors: [{ name: 'وب‌رایان', url: 'https://webrayandev.ir' }],
  creator: 'وب‌رایان',
  publisher: 'وب‌رایان',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: 'https://webrayandev.ir',
    title: 'وب‌رایان - طراحی سایت حرفه‌ای و توسعه وب',
    description:
      'طراحی و توسعه سایت حرفه‌ای، فروشگاه اینترنتی، اپلیکیشن وب و خدمات دیجیتال مارکتینگ',
    siteName: 'وب‌رایان',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'وب‌رایان - طراحی سایت حرفه‌ای',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'وب‌رایان - طراحی سایت حرفه‌ای و توسعه وب',
    description:
      'طراحی و توسعه سایت حرفه‌ای، فروشگاه اینترنتی، اپلیکیشن وب و خدمات دیجیتال مارکتینگ',
    images: ['/images/twitter-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      {
        url: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icons/safari-pinned-tab.svg',
        color: '#14b8a6',
      },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'وب‌رایان',
  },
  alternates: {
    canonical: 'https://webrayandev.ir',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  },
};

export default async function RootLayout({ children }) {
  const session = await auth(); // ✅ ساده‌تر شد!

  return (
    <html lang="fa" dir="rtl" className={inter.variable}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="وب‌رایان" />
        <StructuredData type="Organization" />
        <StructuredData type="Website" />
        <StructuredData type="LocalBusiness" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/Vazirmatn-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/Vazirmatn-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/Vazirmatn-SemiBold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
      </head>
      <body
        className={`min-h-screen bg-white text-gray-900 font-vazirmatn ${inter.variable}`}
      >
        <AuthProvider session={session}>
          <FontPreloader />
          <Header />
          <main id="main-content" className="pt-16" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </AuthProvider>

        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                    send_page_view: true
                  });
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}

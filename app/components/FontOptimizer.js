'use client';

import { Inter, Vazirmatn } from 'next/font/google';
import localFont from 'next/font/local';
import { useState, useEffect } from 'react';

/**
 * بهینه‌سازی فونت‌ها برای بهبود عملکرد
 */

// فونت انگلیسی - Inter
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

// فونت فارسی - Vazirmatn از Google Fonts
export const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-vazirmatn',
  preload: true,
  fallback: ['Tahoma', 'Arial'],
});

// فونت محلی Vazirmatn (fallback)
export const vazirmateLocal = localFont({
  src: [
    {
      path: '../../public/fonts/Vazirmatn-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Vazirmatn-ExtraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Vazirmatn-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Vazirmatn-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Vazirmatn-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Vazirmatn-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Vazirmatn-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Vazirmatn-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Vazirmatn-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-vazirmatn-local',
  display: 'swap',
  preload: true,
  fallback: ['Tahoma', 'Arial'],
});

/**
 * کلاس‌های CSS برای فونت‌ها
 */
export const fontClasses = {
  inter: inter.className,
  vazirmatn: vazirmatn.className,
  vazirmateLocal: vazirmateLocal.className,
};

/**
 * متغیرهای CSS برای فونت‌ها
 */
export const fontVariables = `${inter.variable} ${vazirmatn.variable} ${vazirmateLocal.variable}`;

/**
 * کامپوننت Font Preloader برای بهبود عملکرد
 */
export function FontPreloader() {
  return (
    <>
      {/* Preload Critical Fonts */}
      <link
        rel="preload"
        href="/fonts/Vazirmatn-Regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Vazirmatn-Bold.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Vazirmatn-Medium.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />

      {/* Font Display Optimization */}
      <style jsx global>{`
        /* Font Face Declarations with font-display: swap */
        @font-face {
          font-family: 'Vazirmatn';
          src: url('/fonts/Vazirmatn-Regular.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: 'Vazirmatn';
          src: url('/fonts/Vazirmatn-Medium.woff2') format('woff2');
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: 'Vazirmatn';
          src: url('/fonts/Vazirmatn-Bold.woff2') format('woff2');
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }

        /* Fallback Font Stack */
        .font-persian {
          font-family: 'Vazirmatn', 'Tahoma', 'Arial', sans-serif;
          font-feature-settings:
            'kern' 1,
            'liga' 1;
        }

        .font-english {
          font-family: 'Inter', 'system-ui', 'arial', sans-serif;
          font-feature-settings:
            'kern' 1,
            'liga' 1;
        }

        /* Font Loading States */
        .font-loading {
          font-family: 'Tahoma', 'Arial', sans-serif;
        }

        .font-loaded {
          font-family: 'Vazirmatn', 'Tahoma', 'Arial', sans-serif;
        }

        /* Performance Optimizations */
        * {
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </>
  );
}

/**
 * Hook برای تشخیص بارگذاری فونت
 */
export function useFontLoading() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Check if fonts are loaded
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    } else {
      // Fallback for older browsers
      const timer = setTimeout(() => {
        setFontsLoaded(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  return fontsLoaded;
}

/**
 * کامپوننت Text با بهینه‌سازی فونت
 */
export function OptimizedText({
  children,
  className = '',
  lang = 'fa',
  weight = 'normal',
  ...props
}) {
  const fontClass = lang === 'en' ? 'font-english' : 'font-persian';
  const weightClass =
    {
      thin: 'font-thin',
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
      black: 'font-black',
    }[weight] || 'font-normal';

  return (
    <span className={`${fontClass} ${weightClass} ${className}`} {...props}>
      {children}
    </span>
  );
}

/**
 * کامپوننت Heading با بهینه‌سازی فونت
 */
export function OptimizedHeading({
  level = 1,
  children,
  className = '',
  lang = 'fa',
  weight = 'bold',
  ...props
}) {
  const Tag = `h${level}`;
  const fontClass = lang === 'en' ? 'font-english' : 'font-persian';
  const weightClass =
    {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
      black: 'font-black',
    }[weight] || 'font-bold';

  return (
    <Tag className={`${fontClass} ${weightClass} ${className}`} {...props}>
      {children}
    </Tag>
  );
}

/**
 * تنظیمات فونت برای Tailwind CSS
 */
export const tailwindFontConfig = {
  fontFamily: {
    persian: [
      'var(--font-vazirmatn)',
      'var(--font-vazirmatn-local)',
      'Tahoma',
      'Arial',
      'sans-serif',
    ],
    english: ['var(--font-inter)', 'system-ui', 'arial', 'sans-serif'],
    sans: [
      'var(--font-vazirmatn)',
      'var(--font-inter)',
      'system-ui',
      'sans-serif',
    ],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1.5' }],
    sm: ['0.875rem', { lineHeight: '1.6' }],
    base: ['1rem', { lineHeight: '1.7' }],
    lg: ['1.125rem', { lineHeight: '1.7' }],
    xl: ['1.25rem', { lineHeight: '1.6' }],
    '2xl': ['1.5rem', { lineHeight: '1.5' }],
    '3xl': ['1.875rem', { lineHeight: '1.4' }],
    '4xl': ['2.25rem', { lineHeight: '1.3' }],
    '5xl': ['3rem', { lineHeight: '1.2' }],
    '6xl': ['3.75rem', { lineHeight: '1.1' }],
  },
};

// Default export for compatibility
export default {
  inter,
  vazirmatn,
  vazirmateLocal,
  fontVariables,
  FontPreloader,
  OptimizedText,
  OptimizedHeading,
  tailwindFontConfig,
};

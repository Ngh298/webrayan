// app/about/page.js
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Lazy loading برای بهینه‌سازی
// const SkillsSection = dynamic(() => import("./components/SkillsSection"), {
//   loading: () => (
//     <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
//   ),
// });

const ExperienceTimeline = dynamic(
  // () => import("./components/ExperienceTimeline"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 rounded-lg h-96"></div>
    ),
  }
);

// JSON-LD Schema برای SEO
const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ngh - وب‌رایان',
  url: 'https://webrayandev.ir',
  image: 'https://webrayandev.ir/images/ngh-profile.jpg',
  jobTitle: 'توسعه‌دهنده فول‌استک',
  worksFor: {
    '@type': 'Organization',
    name: 'وب‌رایان Studio',
  },
  alumniOf: 'خودآموز',
  birthPlace: 'ایران',
  description:
    'توسعه‌دهنده فول‌استک با بیش از 1 سال تجربه در ساخت وب‌سایت‌های مدرن',
  knowsAbout: ['React.js', 'Next.js', 'Node.js', 'JavaScript', 'TypeScript'],
  sameAs: [
    'https://github.com/webrayandev',
    'https://linkedin.com/in/webrayandev',
  ],
};

// Metadata کامل برای SEO
export const metadata = {
  title: 'درباره من - توسعه‌دهنده فول‌استک | وب‌رایان',
  description:
    'آشنایی با من، توسعه‌دهنده فول‌استک با 1+ سال تجربه. متخصص React، Next.js، Node.js. 5+ پروژه موفق.',
  keywords:
    'Ngh, توسعه‌دهنده فول‌استک, React developer, Next.js expert, وب‌رایان, برنامه‌نویس ایرانی',

  openGraph: {
    title: 'درباره من - توسعه‌دهنده فول‌استک',
    description:
      'داستان من: از دانشجوی کنجکاو تا توسعه‌دهنده حرفه‌ای با 5+ پروژه موفق',
    url: 'https://webrayandev.ir/about',
    siteName: 'وب رایان کدرز',
    images: [
      {
        url: 'https://webrayandev.ir/images/ngh-about-og.jpg',
        width: 1200,
        height: 630,
        alt: 'NGH - توسعه‌دهنده فول‌استک',
      },
    ],
    locale: 'fa_IR',
    type: 'profile',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'درباره من - توسعه‌دهنده فول‌استک',
    description: 'داستان موفقیت من در دنیای برنامه‌نویسی',
    images: ['https://webrayandev.ir/images/ngh-about-twitter.jpg'],
  },

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

  alternates: {
    canonical: 'https://webrayandev.ir/about',
  },

  other: {
    'theme-color': '#2563eb',
    'color-scheme': 'light',
  },
};

const AboutPage = () => {
  const stats = [
    {
      number: '5+',
      label: 'پروژه موفق',
      icon: '🚀',
      // description: 'پروژه‌های متنوع و موفق',
    },

    {
      number: '1+',
      label: 'سال تجربه',
      icon: '⏰',
      // description: ' تجربه حرفه‌ای',
    },
    {
      number: '24/7',
      label: 'پشتیبانی',
      icon: '📞',
      // description: 'پشتیبانی شبانه‌روزی',
    },
  ];

  const values = [
    {
      icon: '💎',
      title: 'کیفیت بالا',
      description: 'همیشه بهترین کیفیت رو در کارم ارائه می دم.',
    },
    {
      icon: '⚡',
      title: 'سرعت در تحویل',
      description: 'پروژه‌ها رو در زمان تعیین شده تحویل می دم.',
    },
    {
      icon: '🤝',
      title: 'ارتباط مؤثر',
      description: 'با مشتریان در ارتباط مداوم و شفاف هستم.',
    },
    {
      icon: '🎯',
      title: 'تمرکز بر هدف',
      description: 'روی اهداف کسب‌وکار مشتری متمرکز می شم.',
    },
    {
      icon: '🔄',
      title: 'به‌روزرسانی مداوم',
      description: 'همیشه با جدیدترین تکنولوژی‌ها کار می کنم.',
    },
    {
      icon: '🛡️',
      title: 'امنیت و اعتماد',
      description: 'امنیت پروژه‌ و اطلاعات مشتریان اولویت اول منه.',
    },
  ];

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutSchema),
        }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb - در ابتدای صفحه */}
        <nav
          className="bg-white py-4 border-b border-gray-200"
          aria-label="Breadcrumb"
        >
          <div className="max-w-6xl mx-auto px-6">
            <ol
              className="flex items-center text-sm text-gray-600"
              itemScope
              itemType="https://schema.org/BreadcrumbList"
            >
              <li
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                     <Link
                  href="/"
                  className="text-blue-700 hover:text-cyan-500 font-medium transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">خانه</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <span className="text-blue-400 mx-2">/</span>
              <li
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <span
                  className="text-blue-500 font-medium"
                  itemProp="name"
                  aria-current="page"
                >
                  درباره من
                </span>
                <meta itemProp="position" content="2" />
              </li>
            </ol>
          </div>
        </nav>

        <main>
          {/* Hero Section - match contact hero */}
          <header className="relative bg-gradient-to-l from-blue-600 to-purple-800 text-white py-20 overflow-hidden">
            {/* Background Animation (like contact) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="animate-wave absolute -top-10 -left-10 w-72 h-72 bg-white rounded-full"></div>
              <div
                className="animate-wave absolute -bottom-10 -right-10 w-96 h-96 bg-white rounded-full"
                style={{ animationDelay: '2s' }}
              ></div>
              <div
                className="animate-wave absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full"
                style={{ animationDelay: '4s' }}
              ></div>
            </div>

            <div className="max-w-6xl mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h1 className="text-5xl font-bold mb-6 leading-tight">
                    سلام، من <span className="text-yellow-400">Ngh</span> هستم!
                    <span
                      className="text-4xl ml-2"
                      role="img"
                      aria-label="دست تکان دادن"
                    >
                      👋
                    </span>
                  </h1>

                  <p className="text-xl text-blue-100 mb-6 leading-relaxed">
                    توسعه‌دهنده فول‌استک با بیش از <strong>1 سال تجربه</strong>{' '}
                    در ساخت وب‌سایت‌های مدرن و کارآمد.
                  </p>
                  <p className="text-xl text-blue-100 mb-6 leading-relaxed">
                    علاقه‌مند به تکنولوژی‌های جدید و ایجاد تجربه‌های کاربری
                    فوق‌العاده.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/contact"
                      className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:scale-105 transition-all duration-300 text-center focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2"
                      aria-label="تماس با NGH برای شروع همکاری"
                    >
                      بیایید همکاری کنیم
                    </Link>

                    <Link
                      href="/portfolio"
                      className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:border-cyan-400 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2"
                      aria-label="مشاهده نمونه کارهای انجام شده"
                    >
                      نمونه کارها
                    </Link>
                  </div>
                </div>

                <div className="hidden md:block" aria-hidden="true">
                  <div className="relative flex justify-center">
                    <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-9xl">
                      👩‍💻
                    </div>
                    <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-green-400 rounded-full flex items-center justify-center text-2xl animate-pulse">
                      💎
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Enhanced Stats Section - align palette with contact main */}
          <section
            className="py-20 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-200 relative overflow-hidden"
            aria-labelledby="stats-heading"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 bg-blue-300 rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-300 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-200 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
              {/* Section Header */}
              <div className="text-center mb-16">
                <h2
                  id="stats-heading"
                  className="text-3xl font-bold text-blue-800 mb-4"
                >
                  چرا مشتریان به من اعتماد می‌کنند؟
                  <span className="text-2xl ml-2" role="img" aria-label="ستاره">
                    ⭐
                  </span>
                </h2>
                <p className="text-lg text-blue-600 max-w-2xl mx-auto">
                  آمار و نتایجی که نشان‌دهنده تعهد من به کیفیت و رضایت مشتریان
                  است:
                </p>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-6 rounded-full"></div>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {stats.map((stat, index) => (
                  <article key={index} className="relative group">
                    {/* Card Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2"></div>

                    {/* Card Content */}
                    <div className="relative bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
                      {/* Icon Background */}
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span
                          className="text-3xl"
                          role="img"
                          aria-hidden="true"
                        >
                          {stat.icon}
                        </span>
                      </div>

                      {/* Number */}
                      <div className="mb-4">
                        <div
                          className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300"
                          aria-label={`${stat.number} ${stat.label}`}
                        >
                          {stat.number}
                        </div>
                        <div className="text-lg font-semibold text-blue-800">
                          {stat.label}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="bg-blue-50 text-sm text-blue-600 leading-relaxed">
                        {stat.label === 'پروژه موفق' &&
                          'پروژه‌های متنوع با کیفیت بالا و رضایت ۱۰۰٪ مشتریان'}
                        {stat.label === 'سال تجربه' &&
                          'تجربه حرفه‌ای در توسعه وب با تکنولوژی‌های مدرن'}
                        {stat.label === 'پشتیبانی' &&
                          'پشتیبانی شبانه‌روزی و پاسخگویی سریع به سوالات شما'}
                      </div>

                      {/* Decorative Element */}
                      <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                      <div className="absolute bottom-4 left-4 w-4 h-4 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Bottom CTA */}

              <div className="text-center mt-16">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-2xl text-blue-600 px-8 py-3 font-bold hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:scale-105 transition-all duration-300 text-center focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 shadow-lg"
                  aria-label="تماس با NGH برای شروع همکاری"
                >
                  <span>آماده همکاری با شما هستم.</span>
                  <span className="bgblu text-xl" role="img" aria-label="دست">
                    🤝
                  </span>
                </Link>
              </div>
            </div>
          </section>

          {/* Philosophy & Mission Section */}
          <section className="py-20 bg-blue-50">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Philosophy Quote */}
                <div className="lg:order-1 ">
                  <div className="bg-gradient-to-br from-blue-200 via-purple-50 to-indigo-200 py-16 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                        <span
                          className="text-2xl"
                          role="img"
                          aria-label="کد و هنر"
                        >
                          💻
                        </span>
                      </div>

                      <blockquote className="text-xl text-blue-900 font-medium leading-relaxed ">
                        کد نویسی فقط یک شغل نیست، یک هنره،
                        <br />
                        <span className="text-blue-700">
                          هر خط کد، قسمتی از رویای کسی رو زنده می‌کنه.
                        </span>
                      </blockquote>

                      <footer className="flex justify-center">
                        <div className="text-center mt-10">
                          {/* Simple signature line */}
                          <div className="w-20 h-px bg-blue-300 mx-auto mb-2"></div>

                          {/* Signature */}
                          <span className="text-xl font-semibold text-blue-600 font-serif italic mb-10">
                            Ngh
                          </span>
                        </div>
                      </footer>
                    </div>
                  </div>
                </div>

                {/* Mission */}
                <div className="lg:order-2">
                  <div className="bg-gradient-to-br from-blue-200 via-purple-50 to-indigo-200 py-16 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-red-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-3xl" role="img" aria-label="هدف">
                          🎯
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-blue-800 mb-2">
                        ماموریت من
                      </h3>
                      <div className="w-12 h-0.5 bg-blue-500 mx-auto"></div>
                    </div>

                    <div className="space-y-6">
                      <p className="text-blue-900 leading-relaxed text-center">
                        ساخت وب‌سایت‌هایی که نه تنها <br />
                        <span className="font-semibold text-blue-600">
                          زیبا و کارآمد
                        </span>{' '}
                        باشن، بلکه واقعاً به{' '}
                        <span className="font-semibold text-blue-600">
                          رشد کسب‌وکار شما
                        </span>{' '}
                        کمک کنن:
                      </p>

                      <div className="flex flex-wrap justify-center gap-2">
                        {['تکنولوژی مدرن', 'طراحی خلاقانه', 'تجربه کاربری'].map(
                          (item, index) => (
                            <span
                              key={index}
                              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {item}
                            </span>
                          )
                        )}
                      </div>

                      <div className="text-center pt-4">
                        <p className="text-blue-800 font-bold">
                          رؤیای دیجیتالی شما رو به واقعیت تبدیل می‌کنم.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Values Section - match contact FAQ gradient & pattern */}
          <section
            className="relative bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-200 py-20 overflow-hidden"
            aria-labelledby="values-heading"
          >
            {/* Background Pattern - مشابه تماس */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full mix-blend-multiply filter blur-2xl transform translate-x-1/2 translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-orange-200 to-red-200 rounded-full mix-blend-multiply filter blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
              <header className="text-center mb-16 max-w-4xl mx-auto">
                <h2
                  id="values-heading"
                  className="text-4xl font-bold text-blue-800 mb-4"
                >
                  ارزش‌ها و اصول کاری من
                  <span
                    className="text-2xl ml-2"
                    role="img"
                    aria-label="ستاره درخشان"
                  >
                    💫
                  </span>
                </h2>
                <p className="text-xl text-blue-600 max-w-3xl mx-auto">
                  اصولی که در تمام پروژه‌هام رعایت می‌کنم و باعث موفقیت مشترک ما
                  می شن:
                </p>
                <div
                  className="w-20 h-1 bg-blue-500 mx-auto mt-6"
                  aria-hidden="true"
                ></div>
              </header>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto ">
                {values.map((value, index) => (
                  <article
                    key={index}
                    className="bg-blue-50 border border-blue-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 text-center focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
                  >
                    <div
                      className="text-4xl mb-4"
                      role="img"
                      aria-hidden="true"
                    >
                      {value.icon}
                    </div>
                    <h3 className="text-lg font-bold text-blue-800 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-blue-600 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-l from-blue-600 to-purple-800 text-white py-16">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold mb-4">
                آماده شروع پروژه بعدی هستید؟
                <span className="text-2xl ml-2" role="img" aria-label="راکت">
                  🚀
                </span>
              </h2>

              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                بیایید با هم رویایی فوق‌العاده بسازیم! از ایده تا اجرا، در کنار
                شما خواهم بود.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2"
                  aria-label="تماس برای شروع پروژه جدید"
                >
                  شروع پروژه
                </Link>

                <Link
                  href="/portfolio"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:border-cyan-400 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2"
                  aria-label="مشاهده نمونه کارهای انجام شده"
                >
                  مشاهده نمونه کارها
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default AboutPage;

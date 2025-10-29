import Link from 'next/link';

export const metadata = {
  title: 'وبلاگ | وب‌رایان - نوشته‌های Ngh',
  description:
    'مقالات آموزشی و تجربیات عملی Ngh در برنامه‌نویسی و توسعه وب - به زودی',
  keywords:
    'آموزش برنامه نویسی، Next.js، React، JavaScript، تجربه عملی، Ngh، وب‌رایان',
  openGraph: {
    title: 'وبلاگ وب‌رایان',
    description: 'مقالات آموزشی و تجربیات عملی در برنامه‌نویسی - به زودی',
    type: 'website',
    locale: 'fa_IR',
    url: 'https://webrayandev.ir/blog',
    siteName: 'وب‌رایان',
    images: [
      {
        url: '/images/blog-og.jpg',
        width: 1200,
        height: 630,
        alt: 'وبلاگ وب‌رایان',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'وبلاگ وب‌رایان',
    description: 'مقالات آموزشی و تجربیات عملی در برنامه‌نویسی - به زودی',
    images: ['/images/blog-twitter.jpg'],
  },
  alternates: {
    canonical: 'https://webrayandev.ir/blog',
  },
};

export default function BlogPage() {
  // JSON-LD Schema برای وبلاگ
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'وبلاگ وب‌رایان',
    description: 'تجربیات عملی و آموزش‌های کاربردی برنامه‌نویسی',
    url: 'https://webrayandev.ir/blog',
    inLanguage: 'fa-IR',
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
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://webrayandev.ir/blog',
    },
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-200 relative overflow-hidden">
 
        {/* Background Pattern - مشابه سوالات متداول صفحه تماس */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full mix-blend-multiply filter blur-2xl transform translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-orange-200 to-red-200 rounded-full mix-blend-multiply filter blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-6 py-20 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/20 mb-8">
              <span className="text-4xl" role="img" aria-label="وبلاگ">
                📝
              </span>
              <span className="text-blue-600 font-semibold">وبلاگ آموزشی</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-blue-500 mb-6 leading-tight">
              دانش و تجربه ام را
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 mt-4">
                با شما به اشتراک می‌گذارم
              </span>
            </h1>

            <p className="text-xl text-blue-600 max-w-3xl mx-auto leading-relaxed">
              مقالات آموزشی، تجربیات عملی و نکات کاربردی برنامه‌نویسی
              <br />
              برای کمک به رشد و پیشرفت شما در دنیای تکنولوژی!
            </p>

            {/* Personal Signature */}
            <footer className="flex justify-center">
              <div className="text-center mt-10">
                {/* Simple signature line */}
                <div className="w-20 h-px bg-purple-400 mx-auto mb-2"></div>

                {/* Signature */}
                <span className="text-xl font-semibold text-purple-500 font-serif italic mb-10">
                  Ngh
                </span>
                <br />
                <span className="font-semibold text-purple-600  italic mb-10">
                            خالق دیجیتال واقعی
                </span>
              </div>
            </footer>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            {/* Coming Soon Card */}
            <div className="relative group mb-8">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-all duration-700"></div>

              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <span className="text-4xl" role="img" aria-label="ساخت">
                      🚧
                    </span>
                  </div>

                  <h2 className="text-3xl font-bold text-blue-800 mb-6">
                    محتوای باکیفیت در حال آماده‌سازی است!
                  </h2>

                  <p className="text-lg text-blue-600 leading-relaxed mb-6 max-w-2xl mx-auto">
                    در حال تهیه مقالات جامع و کاربردی هستم که به شما کمک کند
                    مهارت‌های برنامه‌نویسی‌تان را ارتقا دهید. هر مقاله با دقت و
                    تجربه عملی نوشته می‌شود.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 shadow-2xl text-white">
                <h3 className="text-2xl font-bold mb-4">
                  از انتشار مقالات جدید باخبر شوید
                  <span className="text-xl ml-2" role="img" aria-label="زنگ">
                    🔔
                  </span>
                </h3>

                <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
                  برای اطلاع از انتشار اولین مقالات و دریافت محتوای ویژه، از
                  طریق صفحه تماس در ارتباط باشید.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:scale-105 transition-all duration-300 font-bold shadow-lg"
                  >
                    تماس و اطلاع‌رسانی
                  </Link>

                  <Link
                    href="/about"
                    className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:border-cyan-400 hover:scale-105 transition-all duration-300 font-bold"
                  >
                    بیشتر درباره من
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

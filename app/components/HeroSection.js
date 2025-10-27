'use client';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full mix-blend-multiply filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-300 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-26 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-shadow-lg">
            طراحی سایت حرفه‌ای با
            <span className="block text-yellow-500 font-extrabold mt-2">
              وب‌رایان
            </span>
          </h1>
          <br />

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-blue-50 mb-4 leading-relaxed max-w-3xl mx-auto">
            سایت رویاهایتان را با تکنولوژی‌های مدرن و طراحی‌های منحصر به‌ فرد می
            سازیم.
          </p>
          <br />

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/contact"
              className="btn-primary w-full sm:w-auto text-center"
            >
              مشاوره رایگان
            </Link>
            <Link
              href="/portfolio"
              className="btn-secondary-dark w-full sm:w-auto text-center"
            >
              نمونه کارها
            </Link>
          </div>

<div className="mb-8">
  <p className="text-orange-200 mb-4 text-lg">
    تکنولوژی‌های مورد استفاده:
  </p>

  {/* گروه اول */}
  <div className="flex flex-wrap justify-center gap-3 mb-3 ">
    {[
       'Bootstrap',
       'TailwindCSS',
       'CSS',
       'HTML',
     
    ].map((tech, index) => (
      <span
        key={index}
        className="bg-indigo-800 bg-opacity-80 text-orange-100 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-indigo-400 border-opacity-50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:border-cyan-300 hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        {tech}
      </span>
    ))}
  </div>

  {/* گروه دوم */}
  <div className="flex flex-wrap justify-center gap-3">
    {[
      'MongoDB',
      'Express.js',
      'Node.js',
      'Next.js',
      'React',
      'TypeScript',
      'JavaScript',

    ].map((tech, index) => (
      <span
        key={index}
        className="bg-indigo-800 bg-opacity-80 text-orange-100 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-indigo-400 border-opacity-50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:border-cyan-300 hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        {tech}
      </span>
    ))}
  </div>
</div>


          {/* Scroll Indicator */}
          <div className=" block animate-bounce mt-20">
            <svg
              className="w-6 h-6 mx-auto text-orange-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

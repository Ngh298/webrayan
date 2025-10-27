'use client';
import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import ContactForm from './components/ContactForm';
import ContactInfo from './components/ContactInfo';
import FAQ from './components/FAQ';
import AskQuestionForm from './components/AskQuestionForm';

const ContactPageClient = () => {
  const [submitStatus, setSubmitStatus] = useState('');
  const [isAskOpen, setIsAskOpen] = useState(false);

  // Memoize static data
  const contactInfo = useMemo(
    () => [
      {
        icon: '📞',
        title: 'تماس تلفنی',
        value: '09166530931',
        description: 'شنبه تا چهارشنبه 17-9',
        action: 'tel:+989166530931',
      },
      {
        icon: '✉️',
        title: 'ایمیل',
        value: 'info@webrayandev.ir',
        description: 'پاسخ تا 24 ساعت',
        action: 'mailto:info@webrayandev.ir',
      },

      {
        icon: '📍',
        title: 'آدرس محل کار',
        value: 'خوزستان، بندرماهشهر',
        description: 'ملاقات با هماهنگی قبلی',
        action: null,
      },
    ],
    []
  );

  const socialLinks = useMemo(
    () => [
      {
        name: 'اینستاگرام',
        icon: '📷',
        url: 'https://instagram.com/webrayandev',
        color: 'from-pink-500 to-purple-600',
      },
      {
        name: 'تلگرام',
        icon: '💌',
        url: 'https://t.me/webrayandev',
        color: 'from-blue-500 to-blue-600',
      },
      {
        name: 'لینکدین',
        icon: '💼',
        url: 'https://linkedin.com/in/webrayandev',
        color: 'from-blue-600 to-blue-800',
      },
      {
        name: 'گیت‌هاب',
        icon: '💻',
        url: 'https://github.com/webrayandev',
        color: 'from-gray-700 to-black',
      },
    ],
    []
  );

  const faqs = useMemo(
    () => [
      {
        id: 1,
        question: 'چه مدت زمان برای طراحی سایت نیاز است؟',
        answer:
          'با توجه به پیچیدگی پروژه، معمولاً بین 2 تا 8 هفته زمان نیاز است. پس از بررسی نیازهای شما، زمان دقیق اعلام می‌شود.',
      },
      {
        id: 2,
        question: 'آیا پس از تحویل، پشتیبانی ارائه می‌دهید؟',
        answer:
          'بله، آموزش کامل کار با سایت و همچنین بسته به نوع پروژه بین 3 تا 6 ماه پشتیبانی رایگان ارائه می‌دهیم. پس از آن در صورت تمایل و درخواست، خدمات نگهداری با تعرفه ویژه صورت می پذیرد.',
      },
      {
        id: 3,
        question: 'هزینه طراحی سایت چقدر است؟',
        answer: 'هزینه با توجه به نوع سایت و امکانات درخواستی متغیر است.',
      },
      {
        id: 4,
        question: 'آیا سایت برای موبایل بهینه می‌شود؟',
        answer:
          'بله، تمام سایت‌ها کاملاً Responsive طراحی می‌شوند و روی تمام دستگاه‌ها (موبایل، تبلت، دسکتاپ) عالی کار می‌کنند.',
      },
    ],
    []
  );

  const handleSubmitStatusChange = useCallback(status => {
    setSubmitStatus(status);

    if (status === 'success') {
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus(''), 5000);
    }
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <nav className="bg-white py-4 border-b" aria-label="Breadcrumb">
          <div className="max-w-6xl mx-auto px-6">
            <ol
              className="flex items-center text-sm"
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
                  ارتباط با من
                </span>
                <meta itemProp="position" content="2" />
              </li>
            </ol>
          </div>
        </nav>

        {/* Hero Section with improved animations */}
        <section className="relative bg-gradient-to-l from-blue-600 to-purple-800 text-white py-20 overflow-hidden">
          {/* Background Animation */}
          <div className="absolute inset-0 opacity-10">
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

          <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              بیایید با هم صحبت کنیم!
              <span className="block text-yellow-300 text-3xl md:text-4xl mt-4 md:mt-6">
                💬✨
              </span>
            </h1>
            <p
              className="text-lg md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 animate-fade-in-up leading-relaxed"
              style={{ animationDelay: '0.2s' }}
            >
              آماده‌ام تا ایده‌هاتون رو بشنوم و بهترین راه‌حل رو ارائه بدم.
              <br />
              <span className="text-yellow-200 font-medium block mt-5 text-xl">
                یه قهوه مجازی بخوریم و پروژه رؤیایی‌تون رو با هم بسازیم! ☕
              </span>
            </p>

            {/* Stats */}
            <div
              className="flex flex-wrap justify-center gap-4 animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              {[
                { number: '24/7', label: 'پشتیبانی', icon: '🌟' },
                { number: 'رایگان', label: 'مشاوره اولیه', icon: '💎' },
                { number: '3 ماه', label: 'پشتیبانی', icon: '🛡️' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/15 backdrop-blur-sm rounded-xl px-4 md:px-6 py-4 pulse-glow hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20"
                >
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-xl md:text-2xl font-bold text-white">
                    {stat.number}
                  </div>
                  <div className="text-xs md:text-sm text-blue-100">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="relative bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-200 py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <ContactForm
                  onSubmitStatusChange={handleSubmitStatusChange}
                  submitStatus={submitStatus}
                />
              </div>

              {/* Sidebar */}
              <div className="flex flex-col h-full space-y-4">
                <ContactInfo
                  contactInfo={contactInfo}
                  socialLinks={socialLinks}
                />
              </div>
            </div>
          </div>
        </main>

        {/* FAQ Section with Home Page Background */}
        <section className="relative bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-200 py-20 overflow-hidden">
          {/* Background Pattern - مشابه صفحه اصلی */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full mix-blend-multiply filter blur-2xl transform translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-orange-200 to-red-200 rounded-full mix-blend-multiply filter blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>

          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/20 mb-8">
                <span className="text-4xl" role="img" aria-label="سوالات">
                  🤔
                </span>
                <span className="text-blue-600 font-semibold">
                  سوالات متداول
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                <span className="text-blue-700 ">
                  سوالات متداول
                </span>
                <span className="block  text-cyan-500 font-extrabold mt-2">
                  وب‌رایان
                </span>
              </h2>

              <p className="text-xl text-blue-700 max-w-3xl mx-auto leading-relaxed">
                پاسخ سوالات رایج در مورد خدمات و نحوه همکاری
              </p>
            </div>

            <FAQ faqs={faqs} onAskQuestionClick={() => setIsAskOpen(true)} />

            <div className="mt-10">
              <AskQuestionForm
                isOpen={isAskOpen}
                onClose={() => setIsAskOpen(false)}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Structured Data - Moved to head in page.js to prevent hydration issues */}
    </>
  );
};

export default ContactPageClient;

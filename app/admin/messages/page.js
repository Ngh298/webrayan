'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact');
      const data = await response.json();

      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl font-semibold text-blue-900">
            در حال بارگذاری پیام‌ها...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-900 mb-2">
              💬 پیام‌های تماس
            </h1>
            <p className="text-blue-700">
              مشاهده و مدیریت پیام‌های دریافتی از کاربران
            </p>
          </div>
          <Link
            href="/admin"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-indigo-600 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
          >
            بازگشت به داشبورد
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-100 to-indigo-200 p-6 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-blue-700 mb-2">
              {messages.length}
            </div>
            <div className="text-sm text-blue-600">کل پیام‌ها</div>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-emerald-200 p-6 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-green-700 mb-2">
              {messages.filter(m => m.status === 'new').length}
            </div>
            <div className="text-sm text-green-600">پیام‌های جدید</div>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-pink-200 p-6 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-purple-700 mb-2">
              {messages.filter(m => m.status === 'replied').length}
            </div>
            <div className="text-sm text-purple-600">پاسخ داده شده</div>
          </div>
        </div>

        {/* Messages List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            لیست پیام‌ها
          </h2>

          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message._id || index}
                  className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-blue-900">
                        {message.name}
                      </h3>
                      <p className="text-sm text-blue-600">{message.email}</p>
                      {message.phone && (
                        <p className="text-sm text-blue-600">{message.phone}</p>
                      )}
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-bold ${
                        message.status === 'new'
                          ? 'bg-green-100 text-green-700'
                          : message.status === 'replied'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {message.status === 'new'
                        ? 'جدید'
                        : message.status === 'replied'
                          ? 'پاسخ داده شده'
                          : 'خوانده شده'}
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-blue-800 mb-2">
                      موضوع: {message.subject}
                    </p>
                    <p className="text-blue-700">{message.message}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all text-sm font-semibold">
                      پاسخ
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all text-sm font-semibold">
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-blue-600">
              <svg
                className="w-20 h-20 mx-auto mb-6 text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xl font-bold text-blue-800 mb-2">
                هنوز پیامی دریافت نشده
              </p>
              <p className="text-base text-blue-600">
                پیام‌های جدید اینجا نمایش داده می‌شوند
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo, useEffect } from 'react';
import CategoryFilter from './CategoryFilter';
import ProjectModal from './ProjectModal';
import { PortfolioSkeleton } from './LoadingSkeleton';
import { LazyContent } from './LazyLoad';

const CATEGORIES = [
  { id: 'all', name: 'همه پروژه‌ها', icon: '🎯' },
  { id: 'ecommerce', name: 'فروشگاه', icon: '🛒' },
  { id: 'personal', name: 'سایت شخصی', icon: '👤' },
  { id: 'restaurant', name: 'رستوران و کافه', icon: '☕' },
  { id: 'education', name: 'سایت آموزشی', icon: '📚' },
  { id: 'news', name: 'سایت خبری', icon: '📰' },
];

const PROJECTS_DATA = [
  {
    id: 1,
    category: 'ecommerce',
    title: 'فروشگاه اینترنتی مدرن',
    description: 'فروشگاه کامل با درگاه پرداخت و فیلتر محصولات',
    image: '🛒',
    demoUrl: '#',
    client: 'استارتاپ فشن',
     },
  {
    id: 2,
    category: 'personal',
    title: 'سایت شخصی طراح وب',
    description: 'معرفی نمونه‌کارها و بلاگ شخصی',
    image: '👤',
    demoUrl: '#',
    client: 'طراح آزاد',
  },
  {
    id: 3,
    category: 'restaurant',
    title: 'سایت رستوران و کافه',
    description: 'منوی آنلاین و رزرو میز',
    image: '☕',
    demoUrl: '#',
    client: 'کافه ناب',
   },
  {
    id: 4,
    category: 'education',
    title: 'پلتفرم آموزشی آنلاین',
    description: 'دوره‌های ویدیویی و آزمون آنلاین',
    image: '📚',
    demoUrl: '#',
    client: 'آکادمی پیشرو',
  },
  {
    id: 5,
    category: 'news',
    title: 'سایت خبری هوشمند',
    description: 'نمایش اخبار زنده و عضویت خبرنامه',
    image: '📰',
    demoUrl: '#',
    client: 'رسانه دیجیتال',
  },
];

export default function PortfolioSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState(PROJECTS_DATA); // Start with static data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/portfolio?published=true&limit=20');

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.projects.length > 0) {
            // Use API data if available
            setProjects(data.projects);
          }
          // Otherwise keep static data as fallback
        } else {
          console.warn('Failed to fetch projects from API, using static data');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Keep static data as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return selectedCategory === 'all'
      ? projects
      : projects.filter(p => p.category === selectedCategory);
  }, [selectedCategory, projects]);

  return (
    <section
      aria-labelledby="portfolio-title"
      className="relative py-20 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-200 overflow-hidden"
    >
      {/* Background Pattern - مشابه صفحات contact و about */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full mix-blend-multiply filter blur-2xl transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-orange-200 to-red-200 rounded-full mix-blend-multiply filter blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* عنوان بخش */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/20 mb-8">
            <span className="text-4xl" role="img" aria-label="نمونه کارها">
              💼
            </span>
            <span className="text-blue-600 font-semibold">نمونه کارهای ما</span>
          </div>

          <h2
            id="portfolio-title"
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent"
          >
            نمونه‌کارهای ما
          </h2>

          <p className="text-xl text-blue-700 max-w-3xl mx-auto leading-relaxed">
            پروژه‌هایی که با عشق، دقت و استفاده از جدیدترین تکنولوژی‌ها ساخته
            ایم:
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* فیلتر دسته‌بندی */}
        <CategoryFilter
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* گرید پروژه‌ها */}
        <LazyContent animationType="slideUp" delay={200}>
          {loading && projects.length === 0 ? (
            <PortfolioSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {filteredProjects.map(project => (
                <article
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="group bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:bg-blue-50 hover:shadow-2xl p-8 
                         cursor-pointer flex flex-col items-center justify-center text-center
                         transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 
                         focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
                  style={{ minHeight: '280px' }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedProject(project);
                    }
                  }}
                  aria-label={`مشاهده جزئیات پروژه ${project.title}`}
                >
                  {/* Icon Background */}
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl" role="img" aria-hidden="true">
                      {project.image}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-blue-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-blue-700 text-sm leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {/* Project Meta */}
                    <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                        {project.year}
                      </span>
                      <span className="bg-green-50 text-green-600 px-2 py-1 rounded-full">
                        {project.duration}
                      </span>
                    </div>
                  </div>

                  {/* Hover Effect Indicator */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2 text-blue-600 font-medium text-sm">
                      <span>مشاهده جزئیات</span>
                      <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                        ←
                      </span>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 w-4 h-4 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                </article>
              ))}
            </div>
          )}
        </LazyContent>

        {/* مودال پروژه */}
        <ProjectModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </section>
  );
}

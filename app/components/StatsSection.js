export default function StatsSection() {
  const stats = [
    {
      number: '1+',
      label: 'سال تجربه',
      description: 'در برنامه‌نویسی',
    },
    {
      number: '5+',
      label: 'پروژه موفق',
      description: 'تحویل داده شده',
    },
    {
      number: '95%',
      label: 'رضایت مشتری',
      description: 'تضمین کیفیت',
    },
    {
      number: '24/7',
      label: 'پشتیبانی',
      description: 'آماده خدمات‌رسانی',
    },
  ];

  return (
    <section className="bg-gradient-to-br from-blue-200 via-purple-50 to-indigo-200 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group cursor-pointer">
              <div className="bg-blue/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:bg-blue-50 hover:border-blue-50 hover:-translate-y-2 hover:scale-105 border border-white/50">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <span className="text-lg md:text-2xl text-white font-bold">
                    {index === 0 && '📅'}
                    {index === 1 && '🚀'}
                    {index === 2 && '⭐'}
                    {index === 3 && '🔧'}
                  </span>
                </div>
                <div className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-sm md:text-lg font-semibold text-blue-800 mb-1 group-hover:text-blue-700 transition-colors duration-300">
                  {stat.label}
                </div>
                <div className="text-xs md:text-sm text-blue-600 group-hover:text-blue-600 transition-colors duration-300">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

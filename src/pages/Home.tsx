import { Link } from 'react-router-dom';
import { Brain, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Home = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Brain,
      title: t('feature1.title'),
      description: t('feature1.description'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Sparkles,
      title: t('feature2.title'),
      description: t('feature2.description'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      title: t('feature3.title'),
      description: t('feature3.description'),
      color: 'from-amber-500 to-orange-500'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20 sm:py-32">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 mb-6">
              {t('homePage.title')}
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('homePage.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/test"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Brain className="w-5 h-5 mr-2" />
                {t('test')}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center px-8 py-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
              >
                {t('more')}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{t('stats.process.stat')}</div>
                <div className="text-slate-600">{t('stats.process.text')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{t('stats.type.stat')}</div>
                <div className="text-slate-600">{t('stats.type.text')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">{t('stats.questions.stat')}</div>
                <div className="text-slate-600">{t('stats.questions.text')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              {t('featureList.title')}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {t('featureList.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-8 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            {t('homeFooter.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('homeFooter.description')}
          </p>
          <Link
            to="/test"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Brain className="w-5 h-5 mr-2" />
            {t('test')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

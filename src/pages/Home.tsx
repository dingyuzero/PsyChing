import { Link } from 'react-router-dom';
import { Brain, Sparkles, TrendingUp, ArrowRight, Layers, Clock3, Compass, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Home = () => {
  const { t, language } = useLanguage();
  
  const features = [
    {
      icon: Brain,
      title: t('aiIntelligentAssessment'),
      description: t('aiAssessmentDesc'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Sparkles,
      title: t('hexagramMapping'),
      description: t('hexagramMappingDesc'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      title: t('personalizedAnalysis'),
      description: t('personalizedAnalysisDesc'),
      color: 'from-amber-500 to-orange-500'
    }
  ];

  const journeys = [
    {
      icon: Clock3,
      title: language === 'zh' ? '人生回溯' : 'Life Review',
      description:
        language === 'zh'
          ? '回到五年前的自己，用当时的想法和风格作答，看看这些年你经历了怎样的人格变化。'
          : 'Answer as yourself five years ago and compare that version with who you are now.',
      to: '/journey/past',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Compass,
      title: language === 'zh' ? '未来指引' : 'Future Guide',
      description:
        language === 'zh'
          ? '想象五年后的理想自己，用未来视角作答，并获得当前到未来之间的成长方向建议。'
          : 'Answer as your ideal future self and get guidance on how to grow from now toward that version.',
      to: '/journey/future',
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20 sm:py-32">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 mb-6">
              {t('heroTitle')}
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/test"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Brain className="w-5 h-5 mr-2" />
                {t('startTest')}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center px-8 py-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
              >
                {t('learnMore')}
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">{t('twoStages')}</div>
                  <div className="text-slate-600 text-sm">{t('testProcess')}</div>
                </div>
              </div>
              <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600 mb-2">64</div>
                  <div className="text-slate-600 text-sm">{t('hexagramTypes')}</div>
                </div>
              </div>
              <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-amber-600 mb-2">{t('tenQuestions')}</div>
                  <div className="text-slate-600 text-sm">{t('preciseTest')}</div>
                </div>
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
              {t('coreFeatures')}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {t('coreFeaturesDesc')}
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

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              {language === 'zh' ? '时空人格入口' : 'Time Perspective Journeys'}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {language === 'zh'
                ? '基于你已经完成的当前人格结果，继续探索五年前的自己，或看见五年后的理想方向。'
                : 'Start from your current result and explore either your past self or your ideal future self.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {journeys.map((journey) => {
              const Icon = journey.icon;
              return (
                <Link
                  key={journey.to}
                  to={journey.to}
                  className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${journey.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${journey.color} flex items-center justify-center text-white mb-6`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{journey.title}</h3>
                    <p className="text-slate-600 leading-relaxed mb-6">{journey.description}</p>
                    <div className="inline-flex items-center text-slate-900 font-semibold group-hover:translate-x-1 transition-transform">
                      {language === 'zh' ? '进入这个入口' : 'Enter This Journey'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 p-8 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
                Psyching V2.0.1
              </span>
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                {language === 'zh' ? '测试版本' : 'Beta Version'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              {language === 'zh' ? '版本说明' : 'Version Note'}
            </h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              {language === 'zh'
                ? 'Psyching V2.0.1 新增了“人生回溯”和“未来指引”两个特色入口，帮助用户从五年前的自己与五年后的理想自己两个时间视角，观察人格卦象的变化与成长方向。'
                : 'Psyching V2.0.1 introduces two featured journeys, Life Review and Future Guide, letting users explore their hexagram from the perspective of the self five years ago and the ideal self five years ahead.'}
            </p>
            <p className="text-slate-600 leading-relaxed">
              {language === 'zh'
                ? '当前版本仍为功能测试版本，量表信度、效度以及题目参数会在后续实证阶段继续测试、校验并做微调。'
                : 'This release is still a feature-testing version. Reliability, validity, and item parameters will be tested, validated, and fine-tuned in a later empirical phase.'}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            {t('ctaTitle')}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('ctaSubtitle')}
          </p>
          <Link
            to="/test"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Brain className="w-5 h-5 mr-2" />
            {t('startTest')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

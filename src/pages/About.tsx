import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import {
  ArrowLeft,
  Heart,
  Code,
  Users,
  Star,
  Github,
  ExternalLink,
  BookOpen,
  Lightbulb,
  Shield,
  Globe
} from 'lucide-react';

const About = () => {
  const navigate = useNavigate();
  const { t } = useLanguage()

  const features = [
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: t('aboutFeatures.f1.title'),
      description: t('aboutFeatures.f1.text')
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: t('aboutFeatures.f2.title'),
      description: t('aboutFeatures.f2.text')
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t('aboutFeatures.f3.title'),
      description: t('aboutFeatures.f3.text')
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t('aboutFeatures.f4.title'),
      description: t('aboutFeatures.f4.text')
    }
  ];

  const technologies = [
    { name: 'React 18', description: t('tech.t1') },
    { name: 'TypeScript', description: t('tech.t2') },
    { name: 'Tailwind CSS', description: t('tech.t3') },
    { name: 'Zustand', description: t('tech.t4') },
    { name: 'Vite', description: t('tech.t5') },
    { name: 'Bazi Library', description: t('tech.t6') }
  ];

  const contributors = [
    {
      name: t('thanks.c1.name'),
      role: t('thanks.c1.role'),
      description: t('thanks.c1.description')
    },
    {
      name: t('thanks.c2.name'),
      role: t('thanks.c2.role'),
      description: t('thanks.c2.description')
    },
    {
      name: t('thanks.c3.name'),
      role: t('thanks.c3.role'),
      description: t('thanks.c3.description')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部导航 */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors mr-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('backToHome')}
          </button>
          <h1 className="text-3xl font-bold text-slate-900">{t('aboutProject')}</h1>
        </div>

        {/* 项目介绍 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('aboutPage.title')}</h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
              {t('aboutPage.description')}
            </p>
          </div>
        </div>

        {/* 核心特性 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">{t('aboutFeatures.text')}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 技术栈 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Code className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-2xl font-bold text-slate-900">{t('tech.title')}</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {technologies.map((tech, index) => (
              <div key={index} className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-1">{tech.name}</h4>
                <p className="text-sm text-slate-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 开源信息 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Github className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-2xl font-bold text-slate-900">{t('opensource')}</h3>
          </div>

          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Shield className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="text-lg font-semibold text-green-900">{t('mitLicense.title')}</h4>
              </div>
              <p className="text-green-800 mb-4">
                {t('mitLicense.description')}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Github className="w-4 h-4 mr-2" />
                  {t('mitLicense.check')}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <Star className="w-4 h-4 mr-2" />
                  {t('mitLicense.star')}
                </a>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-blue-900 mb-3">{t('thirdparties.title')}</h4>
              <div className="space-y-3 text-blue-800">
                <div>
                  <strong>Bazi Library:</strong> {t('thirdparties.bazi')}
                  <br />
                  <span className="text-sm">{t('thirdparties.baziText')}</span>
                </div>
                <div>
                  <strong>{t('thirdparties.otherLead')}</strong>{t('thirdparties.others')}
                  <br />
                  <span className="text-sm">{t('thirdparties.othersText')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 贡献者 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Users className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-2xl font-bold text-slate-900">{t('thanks.title')}</h3>
          </div>
          <div className="space-y-4">
            {contributors.map((contributor, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-6">
                <h4 className="text-lg font-semibold text-slate-900">{contributor.name}</h4>
                <p className="text-blue-600 font-medium mb-2">{contributor.role}</p>
                <p className="text-slate-600">{contributor.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 联系信息 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Globe className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-2xl font-bold text-slate-900">{t('contactUs.title')}</h3>
          </div>

          <div className="text-center">
            <p className="text-slate-600 mb-6">
              {t('contactUs.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Github className="w-5 h-5 mr-2" />
                GitHub Issues
              </a>

              <button
                onClick={() => navigate('/test')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t('contactUs.start')}
              </button>
            </div>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="text-center text-slate-500 text-sm">
          <p className="mb-2">
            {t('copyrightLicense')}
          </p>
          <p>
            Built with ❤️ using React, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;

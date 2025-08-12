import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Brain, History, Info, User, Globe } from 'lucide-react';
import { Toaster } from 'sonner';
import { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/LanguageContext';

const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navigation = [
    { name: t('home'), href: '/', icon: Home },
    { name: t('startTest'), href: '/test', icon: Brain },
    { name: t('testHistory'), href: '/history', icon: History },
    { name: t('about'), href: '/about', icon: Info },
  ];

  const handleMemberClick = () => {
    toast.info(t('memberFeatureInDev'), {
      description: t('memberFeatureDesc'),
      duration: 3000,
    });
  };

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* 导航栏 */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{language === 'zh' ? '卦' : 'H'}</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PsyChing
              </span>
            </Link>

            {/* 桌面端导航 */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* 语言切换按钮 */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
                title={language === 'zh' ? 'Switch to English' : '切换到中文'}
              >
                <Globe className="w-4 h-4" />
                <span>{language === 'zh' ? 'EN' : '中'}</span>
              </button>
              
              {/* 会员按钮 */}
              <button
                onClick={handleMemberClick}
                className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <User className="w-4 h-4" />
                <span>{t('member')}</span>
              </button>
            </div>

            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* 移动端导航菜单 */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200">
              <div className="flex flex-col space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                
                <button
                  onClick={() => {
                    toggleLanguage();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>{language === 'zh' ? 'English' : '中文'}</span>
                </button>
                
                <button
                  onClick={() => {
                    handleMemberClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  <span>{t('member')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600">
            <p className="text-sm">
              © 2025 PsyChing. {language === 'zh' ? '本项目采用 MIT 开源协议' : 'This project is licensed under MIT'}
            </p>
            <p className="text-xs mt-2 text-slate-500">
              {language === 'zh' ? '仅供娱乐和自我认知参考，不构成专业心理咨询建议' : 'For entertainment and self-awareness only, not professional psychological advice'}
            </p>
          </div>
        </div>
      </footer>

      {/* Toast 通知 */}
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e2e8f0',
            color: '#334155',
          },
        }}
      />
    </div>
  );
};

export default Layout;
import { Link } from 'react-router-dom';
import { Brain, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI智能测评',
      description: '采用先进的自适应算法，根据你的回答动态生成个性化问题，每次测试仅需10个问题即可深度了解你的内心世界。',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Sparkles,
      title: '卦象映射技术',
      description: '独创的心理测量与周易卦象结合算法，将现代心理学与传统文化智慧完美融合，为你提供独特的人格洞察。',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      title: '个性化分析',
      description: '基于你的测试结果，提供详细的人格特点分析、潜在挑战识别、发展建议和运势预测，助力个人成长。',
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
              探索内在自我，解锁人格密码
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              基于易学智慧与现代心理学的创新人格测试，通过10道精准问题，为你揭示独特的人格卦象
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/test"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Brain className="w-5 h-5 mr-2" />
                开始测试
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/about"
                className="inline-flex items-center px-8 py-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
              >
                了解更多
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">2阶段</div>
                <div className="text-slate-600">测试流程</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">64</div>
                <div className="text-slate-600">卦象类型</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">10题</div>
                <div className="text-slate-600">精准测试</div>
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
              核心特色
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              融合传统智慧与现代科技，为你提供独特的人格洞察体验
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
            准备好探索真实的自己了吗？
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            只需10道问题，即可获得专属的人格卦象分析报告
          </p>
          <Link
            to="/test"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Brain className="w-5 h-5 mr-2" />
            开始测试
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
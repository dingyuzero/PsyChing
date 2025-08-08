import { useNavigate } from 'react-router-dom';
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

  const features = [
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: 'AI智能测评',
      description: '采用先进的自适应算法，根据用户答案动态生成个性化问题，确保测试的准确性和针对性。'
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: '周易卦象映射',
      description: '将现代心理学理论与传统周易智慧相结合，通过科学算法将人格特质映射到对应的卦象。'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: '个性化分析',
      description: '基于测试结果提供详细的人格分析、问题识别、解决方案和近期运势指导。'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '隐私保护',
      description: '所有数据仅存储在本地浏览器中，确保用户隐私安全，无需注册即可使用。'
    }
  ];

  const technologies = [
    { name: 'React 18', description: '现代化前端框架' },
    { name: 'TypeScript', description: '类型安全的JavaScript' },
    { name: 'Tailwind CSS', description: '实用优先的CSS框架' },
    { name: 'Zustand', description: '轻量级状态管理' },
    { name: 'Vite', description: '快速构建工具' },
    { name: 'Bazi Library', description: '周易计算核心库' }
  ];

  const contributors = [
    {
      name: '开发团队',
      role: '项目开发与维护',
      description: '负责整体架构设计、功能开发和用户体验优化'
    },
    {
      name: 'Bazi Library',
      role: '周易计算支持',
      description: '提供专业的周易卦象计算算法和数据支持'
    },
    {
      name: '开源社区',
      role: '技术支持',
      description: '感谢所有开源项目和社区贡献者的无私奉献'
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
            返回首页
          </button>
          <h1 className="text-3xl font-bold text-slate-900">关于项目</h1>
        </div>

        {/* 项目介绍 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">人格卦象映射系统</h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
              这是一个创新的心理测评平台，将现代心理学理论与中国传统周易智慧相结合。
              通过AI驱动的自适应问题生成技术，为用户提供个性化的人格分析和生活指导。
              我们相信，古老的智慧与现代科技的结合，能够为现代人的自我认知和成长提供独特的价值。
            </p>
          </div>
        </div>

        {/* 核心特性 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">核心特性</h3>
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
            <h3 className="text-2xl font-bold text-slate-900">技术栈</h3>
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
            <h3 className="text-2xl font-bold text-slate-900">开源项目</h3>
          </div>
          
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Shield className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="text-lg font-semibold text-green-900">MIT 开源协议</h4>
              </div>
              <p className="text-green-800 mb-4">
                本项目采用 MIT 开源协议，允许任何人自由使用、修改和分发代码。
                我们鼓励社区贡献和协作开发，共同完善这个项目。
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Github className="w-4 h-4 mr-2" />
                  查看源码
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <Star className="w-4 h-4 mr-2" />
                  给个 Star
                </a>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-blue-900 mb-3">第三方库引用</h4>
              <div className="space-y-3 text-blue-800">
                <div>
                  <strong>Bazi Library:</strong> 用于周易卦象计算的核心库。
                  <br />
                  <span className="text-sm">请确保遵守其开源协议要求，在使用时保留原作者信息和协议声明。</span>
                </div>
                <div>
                  <strong>其他依赖:</strong> React、TypeScript、Tailwind CSS 等现代前端技术栈。
                  <br />
                  <span className="text-sm">所有依赖库均为开源项目，感谢开源社区的贡献。</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 贡献者 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Users className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-2xl font-bold text-slate-900">致谢</h3>
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
            <h3 className="text-2xl font-bold text-slate-900">联系我们</h3>
          </div>
          
          <div className="text-center">
            <p className="text-slate-600 mb-6">
              如果您有任何问题、建议或想要参与项目开发，欢迎通过以下方式联系我们：
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
                开始体验
              </button>
            </div>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="text-center text-slate-500 text-sm">
          <p className="mb-2">
            © 2024 人格卦象映射系统. 基于 MIT 协议开源.
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
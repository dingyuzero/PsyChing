import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTestStore } from '../store/useTestStore';
import { HexagramResult } from '../types';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  RefreshCw, 
  Clock,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Star,
  BookOpen,
  Target,
  Layers,
  Network,
  Heart,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { TRIGRAMS } from '../data/hexagramDatabase';
import { TrigramType } from '../types';
import { enhancedBayesianEngine } from '../utils/enhancedBayesianEngine';

// 卦象描述函数
const getHexagramDescription = (hexagramName: string): string => {
  const descriptions: Record<string, string> = {
    '乾为天': '元亨利贞。天行健，君子以自强不息',
    '坤为地': '元亨，利牝马之贞。地势坤，君子以厚德载物',
    '水雷屯': '元亨利贞，勿用有攸往，利建侯',
    '山水蒙': '亨。匪我求童蒙，童蒙求我',
    '水天需': '有孚，光亨，贞吉。利涉大川',
    '天水讼': '有孚，窒惕，中吉，终凶。利见大人，不利涉大川',
    '地水师': '贞，丈人吉，无咎',
    '水地比': '吉。原筮元永贞，无咎',
    '风天小畜': '亨。密云不雨，自我西郊',
    '天泽履': '履虎尾，不咥人，亨',
    '地天泰': '小往大来，吉亨',
    '天地否': '否之匪人，不利君子贞，大往小来',
    '天火同人': '同人于野，亨。利涉大川，利君子贞',
    '火天大有': '元亨',
    '地山谦': '亨，君子有终',
    '雷地豫': '利建侯行师'
  };
  return descriptions[hexagramName] || '此卦蕴含深刻智慧，需要细心体悟';
};

// 卦象含义函数
const getHexagramMeaning = (upperTrigram: string, lowerTrigram: string): string => {
  const upperName = TRIGRAMS[upperTrigram as keyof typeof TRIGRAMS]?.name_zh;
  const lowerName = TRIGRAMS[lowerTrigram as keyof typeof TRIGRAMS]?.name_zh;
  
  const meanings: Record<string, string> = {
    '乾乾': '纯阳之象，刚健不息，创造力无穷',
    '坤坤': '纯阴之象，柔顺包容，承载万物',
    '震坤': '雷动于地，万物复苏，喜悦安乐',
    '坎坎': '重险之象，智慧深沉，需要坚持',
    '离离': '光明之象，文明昌盛，智慧照耀',
    '艮艮': '山之象，止而不动，稳重内敛',
    '兑兑': '泽之象，喜悦交流，和谐共处',
    '巽巽': '风之象，柔顺渐进，深入人心'
  };
  
  return meanings[`${upperName}${lowerName}`] || `${upperName}在上，${lowerName}在下，阴阳调和`;
};

// 三爻卦含义函数
const getTrigramMeaning = (trigram: string): string => {
  const meanings: Record<string, string> = {
    'qian': '天，刚健创造，领导力强',
    'kun': '地，柔顺包容，支持他人',
    'zhen': '雷，震动激发，行动力强',
    'xun': '风，柔顺渐进，适应性强',
    'kan': '水，智慧深沉，分析能力强',
    'li': '火，光明照耀，启发他人',
    'gen': '山，稳重内敛，保护意识强',
    'dui': '泽，喜悦交流，沟通协调'
  };
  return meanings[trigram] || '未知特质';
};

// 人格映射函数
const getPersonalityMapping = (upperTrigram: string, lowerTrigram: string): string => {
  const upperTraits = {
    'qian': '领导型',
    'kun': '支持型',
    'zhen': '行动型',
    'xun': '适应型',
    'kan': '分析型',
    'li': '启发型',
    'gen': '稳重型',
    'dui': '社交型'
  };
  
  const lowerTraits = {
    'qian': '成就导向',
    'kun': '安全导向',
    'zhen': '创新导向',
    'xun': '适应导向',
    'kan': '成长导向',
    'li': '意义导向',
    'gen': '稳定导向',
    'dui': '连接导向'
  };
  
  const upper = upperTraits[upperTrigram as keyof typeof upperTraits] || '平衡型';
  const lower = lowerTraits[lowerTrigram as keyof typeof lowerTraits] || '综合导向';
  
  return `${upper}外在表现与${lower}内在驱动`;
};

// 行为模式函数
const getBehaviorPattern = (trigram: string): string => {
  const patterns: Record<string, string> = {
    'qian': '主导决策，承担责任',
    'kun': '协作支持，服务他人',
    'zhen': '积极行动，推动变革',
    'xun': '灵活适应，循序渐进',
    'kan': '深度思考，理性分析',
    'li': '启发他人，传播智慧',
    'gen': '稳重行事，保护团队',
    'dui': '沟通协调，营造和谐'
  };
  return patterns[trigram] || '平衡发展';
};

// 动机模式函数
const getMotivationPattern = (trigram: string): string => {
  const patterns: Record<string, string> = {
    'qian': '追求卓越和成就',
    'kun': '寻求安全和稳定',
    'zhen': '渴望创新和突破',
    'xun': '适应环境和变化',
    'kan': '探索真理和成长',
    'li': '寻找意义和价值',
    'gen': '维护稳定和秩序',
    'dui': '建立连接和关系'
  };
  return patterns[trigram] || '综合发展';
};

// 三爻卦易经释义
const getTrigramYijingMeaning = (trigram: string): string => {
  const meanings: Record<string, string> = {
    'qian': '天德刚健，象征创造力与领导力，为万物之父',
    'kun': '地德柔顺，象征包容力与承载力，为万物之母',
    'zhen': '雷德震动，象征激发力与行动力，主动而有力',
    'xun': '风德巽入，象征渗透力与适应力，柔而能入',
    'kan': '水德险陷，象征智慧力与坚持力，险中求进',
    'li': '火德光明，象征照耀力与启发力，文明之象',
    'gen': '山德止静，象征稳定力与内敛力，止于至善',
    'dui': '泽德喜悦，象征沟通力与和谐力，泽润万物'
  };
  return meanings[trigram] || '蕴含深刻智慧';
};

// 三爻卦心理学释义
const getTrigramPsychologyMeaning = (trigram: string): string => {
  const meanings: Record<string, string> = {
    'qian': '具有强烈的成就动机，善于承担责任，天生的领导者气质',
    'kun': '具有强烈的安全需求，善于支持他人，天生的协作者气质',
    'zhen': '具有强烈的创新动机，善于推动变革，天生的行动者气质',
    'xun': '具有强烈的适应能力，善于循序渐进，天生的调节者气质',
    'kan': '具有强烈的求知欲望，善于深度思考，天生的分析者气质',
    'li': '具有强烈的表达欲望，善于启发他人，天生的导师者气质',
    'gen': '具有强烈的稳定需求，善于保护他人，天生的守护者气质',
    'dui': '具有强烈的社交需求，善于沟通协调，天生的协调者气质'
  };
  return meanings[trigram] || '具有独特的心理特征';
};

// 生成六爻卦象图形
const generateHexagramLines = (upperTrigram: string, lowerTrigram: string): JSX.Element => {
  const trigramLines: Record<string, string[]> = {
    'qian': ['yang', 'yang', 'yang'],
    'kun': ['yin', 'yin', 'yin'],
    'zhen': ['yin', 'yin', 'yang'],
    'xun': ['yang', 'yang', 'yin'],
    'kan': ['yin', 'yang', 'yin'],
    'li': ['yang', 'yin', 'yang'],
    'gen': ['yang', 'yin', 'yin'],
    'dui': ['yin', 'yang', 'yang']
  };
  
  const upperLines = trigramLines[upperTrigram] || ['yang', 'yang', 'yang'];
  const lowerLines = trigramLines[lowerTrigram] || ['yin', 'yin', 'yin'];
  const allLines = [...upperLines, ...lowerLines];
  
  return (
    <div className="flex flex-col items-center space-y-1">
      {allLines.map((line, index) => (
        <div key={index} className="flex items-center justify-center">
          {line === 'yang' ? (
            <div className="w-12 h-1 bg-slate-800 rounded"></div>
          ) : (
            <div className="flex space-x-1">
              <div className="w-5 h-1 bg-slate-800 rounded"></div>
              <div className="w-5 h-1 bg-slate-800 rounded"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// 获取卦象的周易解释
const getHexagramYijingExplanation = (hexagramName: string): string => {
  const explanations: Record<string, string> = {
    '乾': '乾为天，纯阳之卦。象征刚健、创造、领导。君子以自强不息，体现天道运行的规律。',
    '坤': '坤为地，纯阴之卦。象征柔顺、包容、承载。君子以厚德载物，体现大地承载万物的品德。',
    '屯': '水雷屯，象征初生艰难。如草木初生，需要时间积累力量，宜守不宜进。',
    '蒙': '山水蒙，象征启蒙教育。如蒙昧初开，需要正确引导和耐心教化。'
  };
  return explanations[hexagramName] || `${hexagramName}卦象征变化与发展，体现了阴阳调和的智慧。`;
};

// 获取卦象的心理学解释
const getHexagramPsychologyExplanation = (upperTrigram: string, lowerTrigram: string): string => {
  const upperPsych = getTrigramPsychologyMeaning(upperTrigram);
  const lowerPsych = getTrigramPsychologyMeaning(lowerTrigram);
  return `此卦象反映了内在动机（${TRIGRAMS[lowerTrigram as keyof typeof TRIGRAMS]?.name_zh}）与外在表现（${TRIGRAMS[upperTrigram as keyof typeof TRIGRAMS]?.name_zh}）的结合。${lowerPsych.split('，')[0]}的内在驱动，通过${upperPsych.split('，')[0]}的方式表达出来。`;
};

const Result = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { currentResult, resetTest } = useTestStore();
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  
  // 计算综卦和错卦的概率
  const calculateRelatedHexagramProbability = (hexagram: any, type: 'reverse' | 'opposite') => {
    if (!currentResult) return 0;
    
    // 获取相关卦象的上下卦
    const upperTrigram = hexagram.upper_trigram;
    const lowerTrigram = hexagram.lower_trigram;
    
    // 从贝叶斯引擎获取实际的概率分布
    const probabilities = enhancedBayesianEngine.getCurrentProbabilities();
    
    // 计算相关卦象的匹配概率
    const upperProb = probabilities.outer_behavior[upperTrigram as keyof typeof probabilities.outer_behavior] || 0.125;
    const lowerProb = probabilities.inner_motivation[lowerTrigram as keyof typeof probabilities.inner_motivation] || 0.125;
    
    // 综合概率计算
    const combinedProb = (upperProb + lowerProb) / 2;
    
    // 根据类型调整概率
    if (type === 'reverse') {
      // 综卦概率稍低于主卦
      return Math.round(combinedProb * 0.8 * 100);
    } else {
      // 错卦概率更低
      return Math.round(combinedProb * 0.6 * 100);
    }
  };

  useEffect(() => {
    if (!currentResult) {
      navigate('/');
      return;
    }

    // 自动保存测试结果
    const autoSave = async () => {
      setIsSaving(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // 模拟保存延迟
        setHasSaved(true);
        toast.success('测试结果已自动保存');
      } catch (error) {
        toast.error('保存失败，请稍后重试');
      } finally {
        setIsSaving(false);
      }
    };

    autoSave();
  }, [currentResult, navigate]);

  const handleNewTest = () => {
    resetTest();
    navigate('/test');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  const handleShare = async () => {
    if (!currentResult) return;
    
    const shareText = `我刚完成了人格卦象测试！\n\n我的卦象：${currentResult.hexagram.name_zh}\n核心特质：${currentResult.basicAnalysis.corePersonality.slice(0, 50)}...\n\n快来测试你的人格卦象吧！`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '我的人格卦象测试结果',
          text: shareText,
          url: window.location.origin
        });
      } catch (error) {
        // 用户取消分享
      }
    } else {
      // 复制到剪贴板
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success('结果已复制到剪贴板');
      } catch (error) {
        toast.error('复制失败');
      }
    }
  };

  const handleDownload = () => {
    if (!currentResult) return;
    
    const content = `人格卦象测试结果\n\n测试时间：${new Date(currentResult.timestamp).toLocaleString()}\n\n卦象：${currentResult.hexagram.name_zh}\n卦辞：${currentResult.hexagram.name_en}\n\n核心人格：\n${currentResult.basicAnalysis.corePersonality}\n\n优势特质：\n${currentResult.basicAnalysis.advantageTraits.join('、')}\n\n挑战领域：\n${currentResult.basicAnalysis.challengeAreas.join('、')}\n\n发展建议：\n${currentResult.detailedAnalysis.developmentSuggestions.join('\n')}\n\n职业指导：\n${currentResult.detailedAnalysis.careerGuidance}\n\n人生哲学：\n${currentResult.detailedAnalysis.lifePhilosophy}`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `人格卦象测试结果_${new Date(currentResult.timestamp).toLocaleDateString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('结果已下载');
  };

  if (!currentResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">正在加载结果...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部导航 */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleGoHome}
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('backToHome')}
          </button>
          
          <div className="flex items-center space-x-2">
            {isSaving && (
              <div className="flex items-center text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-sm">{t('saving')}...</span>
              </div>
            )}
            {hasSaved && (
              <div className="flex items-center text-green-600">
                <Star className="w-4 h-4 mr-1" />
                <span className="text-sm">{t('saved')}</span>
              </div>
            )}
          </div>
        </div>

        {/* 卦象展示 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
              <div className="flex flex-col items-center space-y-0.5">
                {/* 显示完整六爻卦象，上卦在上，下卦在下 */}
                {currentResult.hexagram.lines.slice().reverse().map((line, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded transition-all duration-300 ${
                      line === 1 
                        ? 'bg-white w-6' 
                        : 'bg-white w-6 relative'
                    }`}
                  >
                    {line === 0 && (
                      <div className="absolute inset-y-0 left-1/2 w-0.5 bg-yellow-400 transform -translate-x-0.25"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{currentResult.hexagram.name_zh}</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {currentResult.hexagram.name_en}
            </p>
            <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-slate-500">
              <span>置信度: {Math.round(currentResult.confidence)}%</span>
              <span>•</span>
              <span>卦数: {currentResult.hexagram.gua_number}</span>
            </div>
          </div>

          {/* 卦象图形展示 */}
          <div className="bg-slate-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">卦象图形</h3>
            <div className="flex flex-col items-center space-y-6">
              {/* 上卦 */}
              <div className="text-center">
                <h4 className="text-sm font-medium text-purple-600 mb-3">
                  上卦 - 外在行为 ({TRIGRAMS[currentResult.hexagram.upper_trigram as keyof typeof TRIGRAMS]?.name_zh || currentResult.hexagram.upper_trigram})
                </h4>
                <div className="space-y-1">
                  {currentResult.hexagram.lines.slice(3, 6).reverse().map((line, index) => (
                    <div
                      key={index}
                      className={`h-3 rounded mx-auto transition-all duration-300 ${
                        line === 1 
                          ? 'bg-purple-600 w-16' 
                          : 'bg-purple-600 w-16 relative'
                      }`}
                    >
                      {line === 0 && (
                        <div className="absolute inset-y-0 left-1/2 w-1 bg-slate-50 transform -translate-x-0.5"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 分隔线 */}
              <div className="w-20 h-px bg-slate-300"></div>
              
              {/* 下卦 */}
              <div className="text-center">
                <h4 className="text-sm font-medium text-blue-600 mb-3">
                  下卦 - 内在动机 ({TRIGRAMS[currentResult.hexagram.lower_trigram as keyof typeof TRIGRAMS]?.name_zh || currentResult.hexagram.lower_trigram})
                </h4>
                <div className="space-y-1">
                  {currentResult.hexagram.lines.slice(0, 3).reverse().map((line, index) => (
                    <div
                      key={index}
                      className={`h-3 rounded mx-auto transition-all duration-300 ${
                        line === 1 
                          ? 'bg-blue-600 w-16' 
                          : 'bg-blue-600 w-16 relative'
                      }`}
                    >
                      {line === 0 && (
                        <div className="absolute inset-y-0 left-1/2 w-1 bg-slate-50 transform -translate-x-0.5"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 动机行为分析概览 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <Layers className="w-5 h-5 mr-2 text-blue-600" />
              动机行为分析概览
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-blue-500" />
                <div>
                  <span className="text-sm text-slate-600">内在动机：</span>
                  <span className="font-medium text-slate-900 ml-1">{TRIGRAMS[currentResult.hexagram.lower_trigram as keyof typeof TRIGRAMS]?.name_zh || currentResult.hexagram.lower_trigram}</span>
                  <div className="text-xs text-blue-600 mt-1">概率: {(() => {
                    const probs = enhancedBayesianEngine.getCurrentProbabilities();
                    const trigram = currentResult.hexagram.lower_trigram as keyof typeof probs.inner_motivation;
                    return Math.round((probs.inner_motivation[trigram] || 0.125) * 100);
                  })()}%</div>
                  <div className="text-xs text-slate-500 mt-1">基于贝叶斯算法的内在动机匹配度</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-purple-500" />
                <div>
                  <span className="text-sm text-slate-600">外在行为：</span>
                  <span className="font-medium text-slate-900 ml-1">{TRIGRAMS[currentResult.hexagram.upper_trigram as keyof typeof TRIGRAMS]?.name_zh || currentResult.hexagram.upper_trigram}</span>
                  <div className="text-xs text-purple-600 mt-1">概率: {(() => {
                    const probs = enhancedBayesianEngine.getCurrentProbabilities();
                    const trigram = currentResult.hexagram.upper_trigram as keyof typeof probs.outer_behavior;
                    return Math.round((probs.outer_behavior[trigram] || 0.125) * 100);
                  })()}%</div>
                  <div className="text-xs text-slate-500 mt-1">基于贝叶斯算法的外在行为匹配度</div>
                </div>
              </div>
            </div>
          </div>

          {/* 周易解释 */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-6 border border-yellow-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-yellow-600" />
              周易卦辞解析
            </h3>
            <div className="prose prose-slate max-w-none space-y-4">
              {/* 易经原文解释 */}
              <div className="bg-white rounded-lg p-4 border border-yellow-100">
                <h4 className="text-lg font-semibold text-yellow-800 mb-2">易经原文</h4>
                <p className="text-slate-700 leading-relaxed font-medium mb-3">
                  {currentResult.hexagram.name_zh}：{getHexagramDescription(currentResult.hexagram.name_zh)}
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  此卦象征{getHexagramMeaning(currentResult.hexagram.upper_trigram, currentResult.hexagram.lower_trigram)}，
                  上卦{TRIGRAMS[currentResult.hexagram.upper_trigram as keyof typeof TRIGRAMS]?.name_zh}代表{getTrigramMeaning(currentResult.hexagram.upper_trigram)}，
                  下卦{TRIGRAMS[currentResult.hexagram.lower_trigram as keyof typeof TRIGRAMS]?.name_zh}代表{getTrigramMeaning(currentResult.hexagram.lower_trigram)}。
                </p>
              </div>
              
              {/* 心理学人格映射 */}
              <div className="bg-white rounded-lg p-4 border border-yellow-100">
                <h4 className="text-lg font-semibold text-purple-800 mb-2">心理学人格映射</h4>
                <p className="text-slate-700 leading-relaxed">
                  从现代心理学角度分析，{currentResult.hexagram.name_zh}卦反映了{getPersonalityMapping(currentResult.hexagram.upper_trigram, currentResult.hexagram.lower_trigram)}的人格特质。
                  这种组合表明您在{getBehaviorPattern(currentResult.hexagram.upper_trigram)}方面表现突出，
                  内在动机倾向于{getMotivationPattern(currentResult.hexagram.lower_trigram)}。
                </p>
              </div>
            </div>
          </div>

          {/* 卦象详情 */}
          <div className="mb-8">
            <div className="bg-slate-50 rounded-xl p-6 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">卦象构成解析</h3>
              <div className="space-y-4">
                {/* 卦象构成解析 */}
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4">卦象构成解析</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 上卦 */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-semibold text-blue-800">上卦（外在表现）</h5>
                        <span className="text-2xl">{TRIGRAMS[currentResult.hexagram.upper_trigram as keyof typeof TRIGRAMS]?.symbol}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">卦名：</span>{TRIGRAMS[currentResult.hexagram.upper_trigram as keyof typeof TRIGRAMS]?.name_zh}</p>
                        <p><span className="font-medium">五行：</span>{
                          TRIGRAMS[currentResult.hexagram.upper_trigram as keyof typeof TRIGRAMS]?.element === 'metal' ? '金' :
                          TRIGRAMS[currentResult.hexagram.upper_trigram as keyof typeof TRIGRAMS]?.element === 'wood' ? '木' :
                          TRIGRAMS[currentResult.hexagram.upper_trigram as keyof typeof TRIGRAMS]?.element === 'water' ? '水' :
                          TRIGRAMS[currentResult.hexagram.upper_trigram as keyof typeof TRIGRAMS]?.element === 'fire' ? '火' :
                          TRIGRAMS[currentResult.hexagram.upper_trigram as keyof typeof TRIGRAMS]?.element === 'earth' ? '土' :
                          TRIGRAMS[currentResult.hexagram.upper_trigram as keyof typeof TRIGRAMS]?.element || '未知'
                        }</p>
                        
                        {/* 易经释义 */}
                        <div className="mt-3 p-3 bg-white rounded border border-blue-100">
                          <h6 className="font-medium text-blue-700 mb-1">易经释义</h6>
                          <p className="text-slate-600 text-xs leading-relaxed">
                            {getTrigramYijingMeaning(currentResult.hexagram.upper_trigram)}
                          </p>
                        </div>
                        
                        {/* 心理特征 */}
                        <div className="mt-2 p-3 bg-white rounded border border-blue-100">
                          <h6 className="font-medium text-purple-700 mb-1">心理特征</h6>
                          <p className="text-slate-600 text-xs leading-relaxed">
                            {getTrigramPsychologyMeaning(currentResult.hexagram.upper_trigram)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* 下卦 */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-semibold text-green-800">下卦（内在动机）</h5>
                        <span className="text-2xl">{TRIGRAMS[currentResult.hexagram.lower_trigram as keyof typeof TRIGRAMS]?.symbol}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">卦名：</span>{TRIGRAMS[currentResult.hexagram.lower_trigram as keyof typeof TRIGRAMS]?.name_zh}</p>
                        <p><span className="font-medium">五行：</span>{
                          TRIGRAMS[currentResult.hexagram.lower_trigram as keyof typeof TRIGRAMS]?.element === 'metal' ? '金' :
                          TRIGRAMS[currentResult.hexagram.lower_trigram as keyof typeof TRIGRAMS]?.element === 'wood' ? '木' :
                          TRIGRAMS[currentResult.hexagram.lower_trigram as keyof typeof TRIGRAMS]?.element === 'water' ? '水' :
                          TRIGRAMS[currentResult.hexagram.lower_trigram as keyof typeof TRIGRAMS]?.element === 'fire' ? '火' :
                          TRIGRAMS[currentResult.hexagram.lower_trigram as keyof typeof TRIGRAMS]?.element === 'earth' ? '土' :
                          TRIGRAMS[currentResult.hexagram.lower_trigram as keyof typeof TRIGRAMS]?.element || '未知'
                        }</p>
                        
                        {/* 易经释义 */}
                        <div className="mt-3 p-3 bg-white rounded border border-green-100">
                          <h6 className="font-medium text-green-700 mb-1">易经释义</h6>
                          <p className="text-slate-600 text-xs leading-relaxed">
                            {getTrigramYijingMeaning(currentResult.hexagram.lower_trigram)}
                          </p>
                        </div>
                        
                        {/* 心理特征 */}
                        <div className="mt-2 p-3 bg-white rounded border border-green-100">
                          <h6 className="font-medium text-purple-700 mb-1">心理特征</h6>
                          <p className="text-slate-600 text-xs leading-relaxed">
                            {getTrigramPsychologyMeaning(currentResult.hexagram.lower_trigram)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                

              </div>
            </div>


          </div>
        </div>

        {/* 分析结果 */}
        <div className="space-y-6">
          {/* 基础分析 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">基础分析</h2>
            </div>
            
            {/* 核心人格 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">核心人格特质</h3>
              <p className="text-slate-700 leading-relaxed">{currentResult.basicAnalysis.corePersonality}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  优势特质
                </h3>
                <ul className="space-y-2">
                  {currentResult.basicAnalysis.advantageTraits.map((strength, index) => (
                    <li key={index} className="text-green-700 flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-800 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  挑战领域
                </h3>
                <ul className="space-y-2">
                  {currentResult.basicAnalysis.challengeAreas.map((challenge, index) => (
                    <li key={index} className="text-orange-700 flex items-start">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 爻位分析 */}
          {currentResult.lineAnalysis && currentResult.lineAnalysis.lines && currentResult.lineAnalysis.lines.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <Lightbulb className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">爻位分析</h2>
              </div>
              <div className="space-y-4">
                {currentResult.lineAnalysis.lines.map((line, index) => (
                  <div key={index} className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      第{line.position}爻
                    </h3>
                    <p className="text-green-700 mb-3 font-medium">{line.meaning}</p>
                    <p className="text-green-600 leading-relaxed">{line.influence}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 卦变网络关联 */}
          {currentResult.relatedHexagrams && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                  <Network className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">卦变网络关联</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {currentResult.relatedHexagrams.reverseHexagram && (
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-purple-800">
                        综卦：{currentResult.relatedHexagrams.reverseHexagram.hexagram.name_zh}
                      </h3>
                      <div className="text-xs">
                        {generateHexagramLines(
                          currentResult.relatedHexagrams.reverseHexagram.hexagram.upper_trigram,
                          currentResult.relatedHexagrams.reverseHexagram.hexagram.lower_trigram
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-3 border border-purple-100">
                        <h4 className="font-medium text-purple-700 mb-1">周易释义</h4>
                        <p className="text-purple-600 text-sm leading-relaxed">
                          {getHexagramYijingExplanation(currentResult.relatedHexagrams.reverseHexagram.hexagram.name_zh.split('')[0])}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-purple-100">
                        <h4 className="font-medium text-purple-700 mb-1">心理学解释</h4>
                        <p className="text-purple-600 text-sm leading-relaxed">
                          {getHexagramPsychologyExplanation(
                            currentResult.relatedHexagrams.reverseHexagram.hexagram.upper_trigram,
                            currentResult.relatedHexagrams.reverseHexagram.hexagram.lower_trigram
                          )}
                        </p>
                      </div>
                      <p className="text-purple-600 leading-relaxed">
                        {currentResult.relatedHexagrams.reverseHexagram.meaning}
                      </p>
                    </div>
                  </div>
                )}
                {currentResult.relatedHexagrams.oppositeHexagram && (
                  <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-orange-800">
                        错卦：{currentResult.relatedHexagrams.oppositeHexagram.hexagram.name_zh}
                      </h3>
                      <div className="text-xs">
                        {generateHexagramLines(
                          currentResult.relatedHexagrams.oppositeHexagram.hexagram.upper_trigram,
                          currentResult.relatedHexagrams.oppositeHexagram.hexagram.lower_trigram
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-3 border border-orange-100">
                        <h4 className="font-medium text-orange-700 mb-1">周易释义</h4>
                        <p className="text-orange-600 text-sm leading-relaxed">
                          {getHexagramYijingExplanation(currentResult.relatedHexagrams.oppositeHexagram.hexagram.name_zh.split('')[0])}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-orange-100">
                        <h4 className="font-medium text-orange-700 mb-1">心理学解释</h4>
                        <p className="text-orange-600 text-sm leading-relaxed">
                          {getHexagramPsychologyExplanation(
                            currentResult.relatedHexagrams.oppositeHexagram.hexagram.upper_trigram,
                            currentResult.relatedHexagrams.oppositeHexagram.hexagram.lower_trigram
                          )}
                        </p>
                      </div>
                      <p className="text-orange-600 leading-relaxed">
                        {currentResult.relatedHexagrams.oppositeHexagram.meaning}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 详细分析 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">详细分析</h2>
            </div>
            <div className="space-y-6">
              {/* 发展建议 */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                  发展建议
                </h3>
                <div className="text-green-700 leading-relaxed">
                   {currentResult.detailedAnalysis.developmentSuggestions && currentResult.detailedAnalysis.developmentSuggestions.length > 0 ? (
                     <ul className="space-y-2">
                       {currentResult.detailedAnalysis.developmentSuggestions.map((suggestion, index) => (
                         <li key={index} className="flex items-start">
                           <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                           {suggestion}
                         </li>
                       ))}
                     </ul>
                   ) : (
                     <p>暂无发展建议</p>
                   )}
                 </div>
              </div>

              {/* 职业指导 */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  职业指导
                </h3>
                <p className="text-blue-700 leading-relaxed">{currentResult.detailedAnalysis.careerGuidance}</p>
              </div>

              {/* 人生哲学 */}
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">
                  人生哲学
                </h3>
                <p className="text-purple-700 leading-relaxed">{currentResult.detailedAnalysis.lifePhilosophy}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 重要提示 */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-amber-600 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">重要提示</h3>
              <p className="text-amber-700 leading-relaxed">
                本测试结果基于易学文化和心理学理论，仅供个人成长参考。请理性看待结果，不要将其作为重大人生决策的唯一依据。每个人都是独特的，真正的成长需要结合实际情况和专业指导。
              </p>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate('/test')}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            重新测试
          </button>
          
          <button
            onClick={() => navigate('/history')}
            className="flex items-center px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium"
          >
            <Clock className="w-5 h-5 mr-2" />
            查看历史
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
          >
            <Share2 className="w-5 h-5 mr-2" />
            分享结果
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
          >
            <Download className="w-5 h-5 mr-2" />
            下载报告
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
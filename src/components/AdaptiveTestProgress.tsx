import React from 'react';
import { Brain, Target, Search, Scale, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { AdaptiveTestPhase } from '../utils/enhancedBayesianEngine';

interface AdaptiveTestProgressProps {
  currentPhase: 'inner_motivation' | 'outer_behavior';
  adaptivePhase: AdaptiveTestPhase;
  questionsAnswered: number;
  totalQuestions: number;
  phaseProgress: {
    current: number;
    total: number;
  };
  confidence: {
    inner_motivation: number;
    outer_behavior: number;
    overall: number;
  };
  elapsedTime: number;
}

const AdaptiveTestProgress: React.FC<AdaptiveTestProgressProps> = ({
  currentPhase,
  adaptivePhase,
  questionsAnswered,
  totalQuestions,
  phaseProgress,
  confidence,
  elapsedTime
}) => {
  // 阶段配置
  const phaseConfig = {
    inner_motivation: {
      icon: Brain,
      name: '内在动机',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    },
    outer_behavior: {
      icon: Target,
      name: '外在行为',
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200'
    }
  };

  const adaptivePhaseConfig = {
    exploration: {
      icon: Search,
      name: '探索阶段',
      description: '广泛收集信息',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    discrimination: {
      icon: Scale,
      name: '区分阶段',
      description: '精确区分类型',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    confirmation: {
      icon: CheckCircle,
      name: '确认阶段',
      description: '验证最终结果',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  };

  const currentPhaseConfig = phaseConfig[currentPhase];
  const currentAdaptiveConfig = adaptivePhaseConfig[adaptivePhase];
  const PhaseIcon = currentPhaseConfig.icon;
  const AdaptiveIcon = currentAdaptiveConfig.icon;

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 计算总体进度
  const overallProgress = (questionsAnswered / totalQuestions) * 100;
  const phaseProgressPercent = (phaseProgress.current / phaseProgress.total) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      {/* 头部信息 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${currentPhaseConfig.bgColor}`}>
            <PhaseIcon className={`w-5 h-5 ${currentPhaseConfig.textColor}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {currentPhaseConfig.name}测试
            </h3>
            <p className="text-sm text-slate-500">
              问题 {questionsAnswered + 1} / {totalQuestions}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* 时间显示 */}
          <div className="flex items-center space-x-2 text-slate-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-mono">{formatTime(elapsedTime)}</span>
          </div>
          
          {/* 整体置信度 */}
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-semibold text-slate-700">
              {Math.round(confidence.overall * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* 自适应阶段指示器 */}
      <div className={`mb-6 p-4 rounded-lg border ${currentAdaptiveConfig.borderColor} ${currentAdaptiveConfig.bgColor}`}>
        <div className="flex items-center space-x-3 mb-2">
          <AdaptiveIcon className={`w-5 h-5 ${currentAdaptiveConfig.color}`} />
          <div>
            <h4 className={`font-medium ${currentAdaptiveConfig.color}`}>
              {currentAdaptiveConfig.name}
            </h4>
            <p className="text-xs text-slate-600">
              {currentAdaptiveConfig.description}
            </p>
          </div>
        </div>
        
        {/* 阶段进度条 */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-slate-600 mb-1">
            <span>阶段进度</span>
            <span>{phaseProgress.current} / {phaseProgress.total}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                adaptivePhase === 'exploration' ? 'bg-green-500' :
                adaptivePhase === 'discrimination' ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(phaseProgressPercent, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 总体进度条 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-700 mb-2">
          <span className="font-medium">总体进度</span>
          <span>{Math.round(overallProgress)}% 完成</span>
        </div>
        
        <div className="relative">
          {/* 双阶段进度条背景 */}
          <div className="w-full bg-slate-200 rounded-full h-4 relative overflow-hidden">
            {/* 内在动机阶段 */}
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-l-full transition-all duration-500 ease-out absolute left-0"
              style={{ width: `${Math.min(questionsAnswered * 10, 50)}%` }}
            ></div>
            
            {/* 外在行为阶段 */}
            <div
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-r-full transition-all duration-500 ease-out absolute right-0"
              style={{ width: `${Math.max(0, (questionsAnswered - 5) * 10)}%` }}
            ></div>
            
            {/* 分界线 */}
            <div className="absolute left-1/2 top-0 w-0.5 h-4 bg-white transform -translate-x-0.5"></div>
          </div>
          
          {/* 阶段标签 */}
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span className="flex items-center space-x-1">
              <Brain className="w-3 h-3" />
              <span>内在动机 (1-5)</span>
            </span>
            <span className="flex items-center space-x-1">
              <Target className="w-3 h-3" />
              <span>外在行为 (6-10)</span>
            </span>
          </div>
        </div>
      </div>

      {/* 置信度指标 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-xs text-blue-600 font-medium mb-1">内在动机</div>
          <div className="text-lg font-bold text-blue-700">
            {Math.round(confidence.inner_motivation * 100)}%
          </div>
          <div className="w-full bg-blue-100 rounded-full h-1.5 mt-1">
            <div 
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${confidence.inner_motivation * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-xs text-purple-600 font-medium mb-1">外在行为</div>
          <div className="text-lg font-bold text-purple-700">
            {Math.round(confidence.outer_behavior * 100)}%
          </div>
          <div className="w-full bg-purple-100 rounded-full h-1.5 mt-1">
            <div 
              className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${confidence.outer_behavior * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-xs text-slate-600 font-medium mb-1">整体置信度</div>
          <div className="text-lg font-bold text-slate-800">
            {Math.round(confidence.overall * 100)}%
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${confidence.overall * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveTestProgress;
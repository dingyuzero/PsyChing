import React, { useState, useEffect } from 'react';
import { Brain, Target, Search, Scale, CheckCircle, Clock, TrendingUp, Lightbulb, AlertCircle, BarChart3, Zap } from 'lucide-react';
import { AdaptiveTestPhase, enhancedBayesianEngine } from '../utils/enhancedBayesianEngine';
import { ExtendedQuestion, TestStage } from '../types';
import ProbabilityVisualization from './ProbabilityVisualization';

interface EnhancedAdaptiveTestInterfaceProps {
  currentQuestion: ExtendedQuestion;
  currentPhase: 'inner_motivation' | 'outer_behavior';
  adaptivePhase: AdaptiveTestPhase;
  testStage: TestStage;
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
  convergenceScore: number;
  informationGain: number;
  elapsedTime: number;
  selectedAnswer: string | null;
  onAnswerSelect: (answerId: string) => void;
  onSubmitAnswer: () => void;
  isLoading: boolean;
  stageTransitionInfo?: {
    canTransition: boolean;
    nextStage: TestStage;
    reason: string;
  };
}

const EnhancedAdaptiveTestInterface: React.FC<EnhancedAdaptiveTestInterfaceProps> = ({
  currentQuestion,
  currentPhase,
  adaptivePhase,
  testStage,
  questionsAnswered,
  totalQuestions,
  phaseProgress,
  confidence,
  convergenceScore,
  informationGain,
  elapsedTime,
  selectedAnswer,
  onAnswerSelect,
  onSubmitAnswer,
  isLoading,
  stageTransitionInfo
}) => {
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);
  const [showProbabilityDistribution, setShowProbabilityDistribution] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  // 当问题变化时触发动画
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [currentQuestion.id]);

  // 阶段配置
  const phaseConfig = {
    inner_motivation: {
      icon: Brain,
      name: '内在动机探索',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      gradient: 'from-blue-500 to-blue-600'
    },
    outer_behavior: {
      icon: Target,
      name: '外在行为分析',
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      gradient: 'from-purple-500 to-purple-600'
    }
  };

  const adaptivePhaseConfig = {
    exploration: {
      icon: Search,
      name: '探索阶段',
      description: '广泛收集用户特征信息',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      gradient: 'from-green-500 to-green-600',
      tip: '此阶段重点了解您的基本特征和偏好'
    },
    discrimination: {
      icon: Scale,
      name: '区分阶段',
      description: '精确区分和定位用户类型',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      gradient: 'from-orange-500 to-orange-600',
      tip: '此阶段通过对比性问题精确定位您的类型'
    },
    confirmation: {
      icon: CheckCircle,
      name: '确认阶段',
      description: '验证和确认最终结果',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      gradient: 'from-red-500 to-red-600',
      tip: '此阶段验证前面的分析结果，确保准确性'
    }
  };

  const testStageConfig = {
    [TestStage.EXPLORATION]: {
      name: '探索期',
      description: '收集基础信息',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    [TestStage.DISCRIMINATION]: {
      name: '区分期',
      description: '精确分类',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    [TestStage.CONFIRMATION]: {
      name: '确认期',
      description: '结果验证',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50'
    },
    // 注意：COMPLETED 不在 TestStage 枚举中，使用字符串键
    ['completed']: {
      name: '已完成',
      description: '测试结束',
      color: 'text-slate-600',
      bgColor: 'bg-slate-50'
    }
  };

  const currentPhaseConfig = phaseConfig[currentPhase];
  const currentAdaptiveConfig = adaptivePhaseConfig[adaptivePhase];
  const currentStageConfig = testStageConfig[testStage];
  const PhaseIcon = currentPhaseConfig.icon;
  const AdaptiveIcon = currentAdaptiveConfig.icon;

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 计算进度
  const overallProgress = (questionsAnswered / totalQuestions) * 100;
  const phaseProgressPercent = (phaseProgress.current / phaseProgress.total) * 100;

  // 获取置信度等级
  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.9) return { level: '很高', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (confidence >= 0.7) return { level: '较高', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (confidence >= 0.5) return { level: '中等', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: '较低', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  // 获取收敛状态
  const getConvergenceStatus = (score: number) => {
    if (score >= 0.95) return { status: '已收敛', color: 'text-green-600', icon: CheckCircle };
    if (score >= 0.8) return { status: '接近收敛', color: 'text-blue-600', icon: TrendingUp };
    if (score >= 0.6) return { status: '部分收敛', color: 'text-yellow-600', icon: BarChart3 };
    return { status: '发散中', color: 'text-red-600', icon: AlertCircle };
  };

  const confidenceLevel = getConfidenceLevel(confidence.overall);
  const convergenceStatus = getConvergenceStatus(convergenceScore);
  const ConvergenceIcon = convergenceStatus.icon;

  return (
    <div className="flex flex-col">
      {/* 增强版进度头部 - 紧凑版 */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 mb-3 flex-shrink-0">
        {/* 主要信息行 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* 当前阶段 */}
            <div className={`p-3 rounded-xl ${currentPhaseConfig.bgColor} ${currentPhaseConfig.borderColor} border`}>
              <PhaseIcon className={`w-6 h-6 ${currentPhaseConfig.textColor}`} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {currentPhaseConfig.name}
              </h2>
              <p className="text-sm text-slate-600">
                问题 {questionsAnswered + 1} / {totalQuestions}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* 时间 */}
            <div className="flex items-center space-x-2 text-slate-600">
              <Clock className="w-5 h-5" />
              <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>
            </div>

            {/* 整体置信度 */}
            <div className={`px-4 py-2 rounded-lg ${confidenceLevel.bgColor}`}>
              <div className="flex items-center space-x-2">
                <TrendingUp className={`w-5 h-5 ${confidenceLevel.color}`} />
                <div>
                  <div className={`text-sm font-semibold ${confidenceLevel.color}`}>
                    {Math.round(confidence.overall * 100)}%
                  </div>
                  <div className="text-xs text-slate-600">
                    {confidenceLevel.level}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 自适应阶段和测试阶段 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {/* 自适应阶段 */}
          <div className={`p-3 rounded-lg border ${currentAdaptiveConfig.borderColor} ${currentAdaptiveConfig.bgColor}`}>
            <div className="flex items-center space-x-3 mb-2">
              <AdaptiveIcon className={`w-5 h-5 ${currentAdaptiveConfig.color}`} />
              <div>
                <h4 className={`font-semibold ${currentAdaptiveConfig.color}`}>
                  {currentAdaptiveConfig.name}
                </h4>
                <p className="text-xs text-slate-600">
                  {currentAdaptiveConfig.description}
                </p>
              </div>
            </div>

            {/* 阶段进度 */}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>阶段进度</span>
                <span>{phaseProgress.current} / {phaseProgress.total}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 bg-gradient-to-r ${currentAdaptiveConfig.gradient}`}
                  style={{ width: `${Math.min(phaseProgressPercent, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* 测试阶段状态 */}
          <div className={`p-3 rounded-lg border border-slate-200 ${currentStageConfig.bgColor}`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className={`font-semibold ${currentStageConfig.color}`}>
                  {currentStageConfig.name}
                </h4>
                <p className="text-xs text-slate-600">
                  {currentStageConfig.description}
                </p>
              </div>

              {/* 收敛状态 */}
              <div className="flex items-center space-x-2">
                <ConvergenceIcon className={`w-4 h-4 ${convergenceStatus.color}`} />
                <span className={`text-xs font-medium ${convergenceStatus.color}`}>
                  {convergenceStatus.status}
                </span>
              </div>
            </div>

            {/* 阶段转换信息 */}
            {stageTransitionInfo && (
              <div className="mt-2 p-2 bg-white rounded-lg border border-slate-200">
                <div className="flex items-center space-x-2">
                  <Zap className={`w-3 h-3 ${
                    stageTransitionInfo.canTransition ? 'text-green-500' : 'text-yellow-500'
                  }`} />
                  <span className="text-xs text-slate-600">
                    {stageTransitionInfo.reason}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 总体进度条 */}
        <div className="mb-3">
          <div className="flex justify-between text-sm text-slate-700 mb-2">
            <span className="font-medium">总体进度</span>
            <span>{Math.round(overallProgress)}% 完成</span>
          </div>

          <div className="relative">
            <div className="w-full bg-slate-200 rounded-full h-4 relative overflow-hidden">
              {/* 内在动机阶段 */}
              <div
                className={`bg-gradient-to-r ${phaseConfig.inner_motivation.gradient} h-4 rounded-l-full transition-all duration-500 ease-out absolute left-0`}
                style={{ width: `${Math.min(questionsAnswered * (50 / (totalQuestions / 2)), 50)}%` }}
              ></div>

              {/* 外在行为阶段 */}
              <div
                className={`bg-gradient-to-r ${phaseConfig.outer_behavior.gradient} h-4 rounded-r-full transition-all duration-500 ease-out absolute right-0`}
                style={{ width: `${Math.max(0, (questionsAnswered - (totalQuestions / 2)) * (50 / (totalQuestions / 2)))}%` }}
              ></div>

              {/* 分界线 */}
              <div className="absolute left-1/2 top-0 w-0.5 h-4 bg-white transform -translate-x-0.5"></div>
            </div>

            {/* 阶段标签 */}
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span className="flex items-center space-x-1">
                <Brain className="w-3 h-3" />
                <span>内在动机</span>
              </span>
              <span className="flex items-center space-x-1">
                <Target className="w-3 h-3" />
                <span>外在行为</span>
              </span>
            </div>
          </div>
        </div>

        {/* 高级指标切换 */}
        <div className="flex justify-between items-center">
          <div className="grid grid-cols-3 gap-4 flex-1">
            {/* 内在动机置信度 */}
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

            {/* 外在行为置信度 */}
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

            {/* 收敛分数 */}
            <div className="text-center">
              <div className="text-xs text-slate-600 font-medium mb-1">收敛分数</div>
              <div className="text-lg font-bold text-slate-800">
                {Math.round(convergenceScore * 100)}%
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${convergenceScore * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* 高级指标切换按钮 */}
          <button
            onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
            className="ml-4 px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {showAdvancedMetrics ? '隐藏' : '详细'}
          </button>
        </div>

        {/* 高级指标面板 */}
        {showAdvancedMetrics && (
          <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <h5 className="text-sm font-semibold text-slate-700 mb-3">高级分析指标</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xs text-slate-600 mb-1">信息增益</div>
                <div className="text-sm font-bold text-slate-800">
                  {informationGain.toFixed(3)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-600 mb-1">问题权重</div>
                <div className="text-sm font-bold text-slate-800">
                  {currentQuestion.weight?.toFixed(2) || 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-600 mb-1">子类别</div>
                <div className="text-sm font-bold text-slate-800">
                  {currentQuestion.subcategory || 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-600 mb-1">难度等级</div>
                <div className="text-sm font-bold text-slate-800">
                  {currentQuestion.difficulty || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 增强版问题卡片 - 移到上方 */}
      <div
        key={animationKey}
        className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 transform transition-all duration-500 ease-out flex-shrink-0 mb-3"
        style={{ animation: 'slideInUp 0.5s ease-out' }}
      >
        {/* 问题头部 */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 mb-2 leading-relaxed">
              {currentQuestion.text_zh}
            </h3>

            {/* 问题元信息 */}
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <span>ID: {currentQuestion.id}</span>
              {currentQuestion.subcategory && (
                <span>类别: {currentQuestion.subcategory}</span>
              )}
              {currentQuestion.difficulty && (
                <span>难度: {currentQuestion.difficulty}</span>
              )}
            </div>
          </div>

          {/* 问题类型标识 */}
          <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
            currentPhase === 'inner_motivation'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-purple-100 text-purple-700'
          }`}>
            {currentPhase === 'inner_motivation' ? '内在动机' : '外在行为'}
          </div>
        </div>

        {/* 选项列表 */}
        <div className="space-y-2 flex-1">
          {currentQuestion.options.map((option, index) => {
            const optionKey = String.fromCharCode(65 + index); // A, B, C, D
            const isSelected = selectedAnswer === option.id;

            const displayText = option.text_zh || option.content || option.text || `选项${optionKey}`;

            return (
              <button
                key={option.id}
                onClick={() => onAnswerSelect(option.id)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 transform hover:scale-[1.01] ${
                  isSelected
                    ? currentPhase === 'inner_motivation'
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                      : 'border-purple-500 bg-purple-50 text-purple-700 shadow-lg'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full border-2 mr-4 flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isSelected
                      ? currentPhase === 'inner_motivation'
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-purple-500 bg-purple-500 text-white'
                      : 'border-slate-300 text-slate-500'
                  }`}>
                    {optionKey}
                  </div>
                  <span className="text-slate-700 leading-relaxed flex-1">
                    {displayText}
                  </span>

                  {/* 选中指示器 */}
                  {isSelected && (
                    <CheckCircle className={`w-5 h-5 ml-3 ${
                      currentPhase === 'inner_motivation' ? 'text-blue-500' : 'text-purple-500'
                    }`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* 提交按钮 */}
        <div className="flex justify-center mt-6">
          <button
            onClick={onSubmitAnswer}
            disabled={!selectedAnswer || isLoading}
            className={`flex items-center px-8 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform ${
              selectedAnswer && !isLoading
                ? currentPhase === 'inner_motivation'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl hover:scale-105'
                  : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl hover:scale-105'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                处理中...
              </>
            ) : (
              <>
                {questionsAnswered >= totalQuestions - 1 ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-3" />
                    完成测试
                  </>
                ) : (
                  <>
                    下一题
                    <Zap className="w-5 h-5 ml-3" />
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </div>

      {/* 概率分布可视化区域 - 移到下方 */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 flex-1">
        {/* 概率分布开关按钮 */}
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-sm font-semibold text-slate-700">概率分布可视化</h5>
          <button
            onClick={() => setShowProbabilityDistribution(!showProbabilityDistribution)}
            className={`flex items-center px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
              showProbabilityDistribution
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <div className={`w-3 h-3 mr-2 rounded-full border transition-all duration-200 ${
              showProbabilityDistribution
                ? 'bg-blue-500 border-blue-500'
                : 'bg-white border-slate-300'
            }`}>
              {showProbabilityDistribution && (
                <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
              )}
            </div>
            {showProbabilityDistribution ? '隐藏分布图' : '显示分布图'}
          </button>
        </div>

        {/* 概率分布图表 */}
        {showProbabilityDistribution && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            <ProbabilityVisualization
              probabilities={enhancedBayesianEngine.getCurrentProbabilities().inner_motivation}
              title="内在动机概率分布"
              colorScheme="blue"
              compact={true}
            />
            <ProbabilityVisualization
              probabilities={enhancedBayesianEngine.getCurrentProbabilities().outer_behavior}
              title="外在行为概率分布"
              colorScheme="purple"
              compact={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedAdaptiveTestInterface;

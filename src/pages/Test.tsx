import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, CheckCircle, Target, Brain } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTestStore } from '../store/useTestStore';
import { enhancedBayesianEngine } from '../utils/enhancedBayesianEngine';
import { Question, TestPhase, TestStage } from '../types';
import AdaptiveTestProgress from '../components/AdaptiveTestProgress';
import EnhancedAdaptiveTestInterface from '../components/EnhancedAdaptiveTestInterface';
import ProbabilityVisualization from '../components/ProbabilityVisualization';

const Test = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { 
    currentSession, 
    currentResult, 
    startTest, 
    submitAnswer, 
    resetTest,
    getProgress,
    error,
    isLoading: storeLoading,
    testCSVAccess
  } = useTestStore();
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [csvTestResult, setCsvTestResult] = useState<any>(null);
  const [isCsvTesting, setIsCsvTesting] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [useEnhancedInterface, setUseEnhancedInterface] = useState(true);
  const [convergenceScore, setConvergenceScore] = useState(0);
  const [informationGain, setInformationGain] = useState(0);
  const [stageTransitionInfo, setStageTransitionInfo] = useState<any>(null);
  const [showProbabilityDistribution, setShowProbabilityDistribution] = useState(true);
  
  // 初始化测试
  useEffect(() => {
    initializeTest();
  }, []);
  
  // 调试信息状态
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebugPanel, setShowDebugPanel] = useState(true);
  
  // 获取调试信息
  const updateDebugInfo = () => {
    try {
      const questionBankStats = enhancedBayesianEngine.getQuestionBankStats();
      const detailedStats = enhancedBayesianEngine.getDetailedStats();
      const config = enhancedBayesianEngine.getConfig();
      const loadingStatus = enhancedBayesianEngine.getLoadingStatus();
      const currentProbabilities = enhancedBayesianEngine.getCurrentProbabilities();
      const confidenceMetrics = enhancedBayesianEngine.getConfidenceMetrics();
      
      const debugData = {
        questionBank: questionBankStats,
        detailedStats: detailedStats,
        config: config,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setDebugInfo(debugData);
      
      // 在控制台输出详细信息
      console.log('\n🔍 ===== 增强版贝叶斯引擎详细调试信息 =====');
      console.log('⏰ 更新时间:', debugData.timestamp);
      console.log('\n📊 题库统计信息:');
      console.log('  - 总题数:', questionBankStats?.total || 'N/A');
      console.log('  - 内在动机题数:', questionBankStats?.by_category?.inner_motivation || 'N/A');
        console.log('  - 外在行为题数:', questionBankStats?.by_category?.outer_behavior || 'N/A');
        console.log('  - 加载状态:', questionBankStats ? '✅ 已加载' : '❌ 未加载');
      
      console.log('\n📈 使用统计信息:');
      console.log('  - 已使用题目数:', detailedStats?.used || 0);
        console.log('  - 剩余题目数:', detailedStats?.remaining || 0);
      console.log('  - 当前测试阶段:', detailedStats?.current_stage || 'N/A');
        console.log('  - 当前自适应相位:', detailedStats?.current_phase || 'N/A');
      console.log('  - 当前阶段:', detailedStats?.current_stage || 'unknown');
      console.log('  - 当前相位:', detailedStats?.current_phase || 'unknown');
      
      console.log('\n⚙️ 测试配置:');
      console.log('  - 探索阶段题数:', config?.explorationQuestions || 'N/A');
      console.log('  - 区分阶段题数:', config?.discriminationQuestions || 'N/A');
      console.log('  - 确认阶段题数:', config?.confirmationQuestions || 'N/A');
      console.log('  - 每相位题数:', config?.questionsPerPhase || 'N/A');
      console.log('  - 收敛阈值:', config?.convergenceThreshold || 'N/A');
      console.log('  - 最大迭代次数:', config?.maxIterations || 'N/A');
      
      console.log('\n🔄 引擎加载状态:');
      console.log('  - 正在加载:', loadingStatus?.isLoading ? '是' : '否');
      console.log('  - 已加载完成:', loadingStatus?.isLoaded ? '是' : '否');
      console.log('  - 加载错误:', loadingStatus?.error || '无');
      
      console.log('\n🎯 当前概率分布:');
      if (currentProbabilities) {
        console.log('  内在动机概率:');
        Object.entries(currentProbabilities.inner_motivation || {}).forEach(([key, value]) => {
          console.log(`    ${key}: ${(value * 100).toFixed(1)}%`);
        });
        console.log('  外在行为概率:');
        Object.entries(currentProbabilities.outer_behavior || {}).forEach(([key, value]) => {
          console.log(`    ${key}: ${(value * 100).toFixed(1)}%`);
        });
      }
      
      console.log('\n📊 置信度指标:');
      if (confidenceMetrics) {
        console.log('  - 总体置信度:', (confidenceMetrics.overall * 100).toFixed(1) + '%');
        console.log('  - 内在动机置信度:', (confidenceMetrics.inner_motivation * 100).toFixed(1) + '%');
        console.log('  - 外在行为置信度:', (confidenceMetrics.outer_behavior * 100).toFixed(1) + '%');
      }
      
      console.log('\n🔧 原始数据对象:');
      console.log('  题库统计:', questionBankStats);
      console.log('  详细统计:', detailedStats);
      console.log('  配置信息:', config);
      console.log('  加载状态:', loadingStatus);
      console.log('  概率分布:', currentProbabilities);
      console.log('  置信度指标:', confidenceMetrics);
      
      console.log('\n💡 诊断建议:');
      if (!questionBankStats) {
        console.log('  ⚠️ 题库未正确加载，请检查CSV文件');
      }
      if ((detailedStats?.used || 0) > (questionBankStats?.total || 0) * 0.8) {
        console.log('  ⚠️ 已使用题目过多，可能出现重复');
      }
      if ((config?.explorationQuestions || 0) + (config?.discriminationQuestions || 0) + (config?.confirmationQuestions || 0) < 10) {
        console.log('  ⚠️ 总题目数配置较少，建议增加以减少重复');
      }
      
      console.log('🔍 ===============================================\n');
      
    } catch (error) {
      console.error('❌ 获取调试信息失败:', error);
      console.error('错误堆栈:', error.stack);
      setDebugInfo({ error: error.message });
    }
  };
  
  // 在测试初始化和问题变化时更新调试信息
  useEffect(() => {
    if (currentSession?.currentQuestion) {
      updateDebugInfo();
    }
  }, [currentSession?.currentQuestion]);
  
  // 计时器效果
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (startTime && currentSession) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [startTime, currentSession]);
  
  const initializeTest = async () => {
    setIsLoading(true);
    try {
      await startTest();
      // 设置开始时间
      setStartTime(Date.now());
      setElapsedTime(0);
      // 更新调试信息
      setTimeout(() => updateDebugInfo(), 100); // 稍微延迟以确保状态更新完成
    } catch (error) {
      console.error('Failed to start test:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 重置答案状态和更新增强版数据
  useEffect(() => {
    setSelectedAnswer(null);
    setHasAnswered(false);
    
    // 更新增强版界面数据
    if (useEnhancedInterface && currentSession?.currentQuestion) {
      updateEnhancedMetrics();
    }
  }, [currentSession?.currentQuestion, useEnhancedInterface]);
  
  // 更新增强版指标
  const updateEnhancedMetrics = () => {
    try {
      // 获取收敛分数
      const convergence = enhancedBayesianEngine.getConvergenceScore?.() || 0;
      setConvergenceScore(convergence);
      
      // 获取信息增益（模拟值，实际应从引擎获取）
      const infoGain = Math.random() * 0.5; // 临时模拟值
      setInformationGain(infoGain);
      
      // 获取阶段转换信息
      const transitionInfo = {
        canTransition: convergence > 0.8,
        nextStage: enhancedBayesianEngine.getNextStage?.() || 'discrimination',
        reason: convergence > 0.8 ? '置信度足够，可以进入下一阶段' : '需要更多数据来提高置信度'
      };
      setStageTransitionInfo(transitionInfo);
    } catch (error) {
      console.warn('Failed to update enhanced metrics:', error);
    }
  };

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
    setHasAnswered(true);
  };

  const handleSubmitAnswer = async () => {
    if (!currentSession?.currentQuestion || selectedAnswer === null) {
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await submitAnswer(selectedAnswer);
      
      if (result?.completed) {
        // 测试完成，导航到结果页面
        navigate('/result');
      } else {
        // 继续下一题
        setSelectedAnswer(null);
        setHasAnswered(false);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理CSV测试
  const handleCSVTest = async () => {
    setIsCsvTesting(true);
    setCsvTestResult(null);
    
    try {
      const result = await testCSVAccess();
      setCsvTestResult(result);
      console.log('CSV测试结果:', result);
    } catch (error) {
      console.error('CSV测试失败:', error);
      setCsvTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsCsvTesting(false);
    }
  };
  


  const handleRestart = async () => {
    resetTest();
    setStartTime(null);
    setElapsedTime(0);
    await initializeTest();
  };

  const handleGoBack = () => {
    navigate('/');
  };

  if (isLoading || storeLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">{t('preparingTest')}</p>
        </div>
      </div>
    );
  }

  // 获取当前进度
  const progress = currentSession ? getProgress() : { current: 0, total: 10, percentage: 0 };
  const currentQuestion = currentSession?.currentQuestion;

  if ((!currentQuestion && !isLoading && !storeLoading) || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('testInitFailed')}</h2>
          <p className="text-slate-600 mb-4">{t('testInitFailedDesc')}</p>
          
          {/* 详细错误信息 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-red-700 text-sm mb-2">
                <strong>错误详情:</strong> {error}
              </p>
              <details className="text-xs text-red-600">
                <summary className="cursor-pointer hover:text-red-800">查看技术详情</summary>
                <div className="mt-2 p-2 bg-red-100 rounded border">
                  <p><strong>网络状态:</strong> {navigator.onLine ? '在线' : '离线'}</p>
                  <p><strong>用户代理:</strong> {navigator.userAgent}</p>
                  <p><strong>当前URL:</strong> {window.location.href}</p>
                  <p><strong>时间戳:</strong> {new Date().toISOString()}</p>
                </div>
              </details>
            </div>
          )}
          
          {/* 诊断信息 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">诊断信息</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• 网络连接: {navigator.onLine ? '✅ 正常' : '❌ 断开'}</p>
              <p>• 浏览器支持: {typeof fetch !== 'undefined' ? '✅ 支持' : '❌ 不支持'}</p>
              <p>• 本地存储: {typeof localStorage !== 'undefined' ? '✅ 可用' : '❌ 不可用'}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('restart')}
            </button>
            <button
              onClick={handleCSVTest}
              disabled={isCsvTesting}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCsvTesting ? '测试中...' : '测试CSV文件'}
            </button>
            
            {csvTestResult && (
              <div className="mt-4 p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">
                  CSV测试结果: {csvTestResult.success ? '✅ 成功' : '❌ 失败'}
                </h4>
                {csvTestResult.success && csvTestResult.data && (
                  <div className="text-sm space-y-1">
                    <p>状态码: {csvTestResult.data.status}</p>
                    <p>文件大小: {csvTestResult.data.contentLength} 字符</p>
                    <p>总行数: {csvTestResult.data.totalLines}</p>
                    <p>非空行数: {csvTestResult.data.nonEmptyLines}</p>
                    <p>列数: {csvTestResult.data.headers}</p>
                    <p>文件预览:</p>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                      {csvTestResult.data.preview}
                    </pre>
                  </div>
                )}
                {!csvTestResult.success && (
                  <p className="text-red-600 text-sm">
                    错误: {csvTestResult.error}
                  </p>
                )}
              </div>
            )}
            <button
              onClick={handleGoBack}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors"
            >
              {t('backToHome')}
            </button>
          </div>
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
            onClick={handleGoBack}
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('backToHome')}
          </button>
          
          {/* 界面切换按钮 */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setUseEnhancedInterface(!useEnhancedInterface)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                useEnhancedInterface 
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {useEnhancedInterface ? '标准界面' : '增强界面'}
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* 自适应测试阶段指示器 */}
            <div className="flex items-center space-x-4">
              {/* 当前测试阶段 */}
              <div className="flex items-center space-x-2">
                {currentSession?.phase === 'inner_motivation' ? (
                  <>
                    <Brain className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">{t('innerMotivationPhase')}</span>
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">{t('outerBehaviorPhase')}</span>
                  </>
                )}
              </div>
              
              {/* 自适应阶段指示器 */}
              <div className="flex items-center space-x-2 px-3 py-1 bg-white rounded-full shadow-sm">
                {(() => {
                  const adaptivePhase = enhancedBayesianEngine.getCurrentAdaptivePhase();
                  const phaseConfig = {
                    exploration: { icon: '🔍', text: '探索阶段', color: 'text-green-600' },
                    discrimination: { icon: '⚖️', text: '区分阶段', color: 'text-orange-600' },
                    confirmation: { icon: '✅', text: '确认阶段', color: 'text-red-600' }
                  };
                  const config = phaseConfig[adaptivePhase] || phaseConfig.exploration;
                  return (
                    <>
                      <span className="text-sm">{config.icon}</span>
                      <span className={`text-xs font-medium ${config.color}`}>{config.text}</span>
                    </>
                  );
                })()}
              </div>
            </div>
            
            <div className="flex items-center text-slate-600">
              <Clock className="w-5 h-5 mr-2" />
              <span>答题时间: {Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:{(elapsedTime % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* 调试信息面板 */}
        {debugInfo && showDebugPanel && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-yellow-800 flex items-center">
                🔍 调试信息面板
                <span className="ml-2 text-sm font-normal text-yellow-600">({debugInfo.timestamp})</span>
              </h3>
              <button
                onClick={() => setShowDebugPanel(false)}
                className="text-yellow-600 hover:text-yellow-800 text-sm"
              >
                隐藏
              </button>
            </div>
            
            {debugInfo.error ? (
              <div className="text-red-600 text-sm">
                错误: {debugInfo.error}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {/* 题库统计 */}
                <div className="bg-white rounded p-3 border">
                  <h4 className="font-semibold text-gray-800 mb-2">📚 题库统计</h4>
                  {debugInfo.questionBank && (
                    <div className="space-y-1 text-gray-600">
                      <p>总题数: <span className="font-medium text-blue-600">{debugInfo.questionBank.total || 'N/A'}</span></p>
                      <p>内在动机: <span className="font-medium text-blue-600">{debugInfo.questionBank.inner_motivation || 'N/A'}</span></p>
                      <p>外在行为: <span className="font-medium text-purple-600">{debugInfo.questionBank.outer_behavior || 'N/A'}</span></p>
                      <p>加载状态: <span className={`font-medium ${debugInfo.questionBank.loaded ? 'text-green-600' : 'text-red-600'}`}>
                        {debugInfo.questionBank.loaded ? '✅ 已加载' : '❌ 未加载'}
                      </span></p>
                    </div>
                  )}
                </div>
                
                {/* 使用统计 */}
                <div className="bg-white rounded p-3 border">
                  <h4 className="font-semibold text-gray-800 mb-2">📊 使用统计</h4>
                  {debugInfo.detailedStats && (
                    <div className="space-y-1 text-gray-600">
                      <p>已使用题目: <span className="font-medium text-orange-600">{debugInfo.detailedStats.used || 0}</span></p>
                        <p>剩余题目: <span className="font-medium text-green-600">{debugInfo.detailedStats.remaining || 0}</span></p>
                      <p>当前阶段: <span className="font-medium text-indigo-600">{debugInfo.detailedStats.current_stage || 'N/A'}</span></p>
                <p>当前相位: <span className="font-medium text-pink-600">{debugInfo.detailedStats.current_phase || 'N/A'}</span></p>
                    </div>
                  )}
                </div>
                
                {/* 测试配置 */}
                <div className="bg-white rounded p-3 border">
                  <h4 className="font-semibold text-gray-800 mb-2">⚙️ 测试配置</h4>
                  {debugInfo.config && (
                    <div className="space-y-1 text-gray-600">
                      <p>探索阶段: <span className="font-medium text-green-600">{debugInfo.config.explorationQuestions || 'N/A'} 题</span></p>
                      <p>区分阶段: <span className="font-medium text-orange-600">{debugInfo.config.discriminationQuestions || 'N/A'} 题</span></p>
                      <p>确认阶段: <span className="font-medium text-red-600">{debugInfo.config.confirmationQuestions || 'N/A'} 题</span></p>
                      <p>收敛阈值: <span className="font-medium text-blue-600">{debugInfo.config.convergenceThreshold || 'N/A'}</span></p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={updateDebugInfo}
                className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded text-sm hover:bg-yellow-300 transition-colors"
              >
                🔄 刷新数据
              </button>
              <p className="text-xs text-yellow-600">
                💡 详细信息已输出到浏览器控制台 (F12)
              </p>
            </div>
          </div>
        )}
        
        {/* 显示调试面板按钮（当面板隐藏时） */}
        {!showDebugPanel && (
          <div className="mb-4">
            <button
              onClick={() => setShowDebugPanel(true)}
              className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm hover:bg-yellow-200 transition-colors"
            >
              🔍 显示调试信息
            </button>
          </div>
        )}

        {/* 条件渲染：增强版界面 vs 标准界面 */}
        {useEnhancedInterface ? (
          <EnhancedAdaptiveTestInterface
            currentQuestion={currentQuestion}
            currentPhase={currentSession?.phase || 'inner_motivation'}
            adaptivePhase={enhancedBayesianEngine.getCurrentAdaptivePhase()}
            testStage={enhancedBayesianEngine.getCurrentStage?.() || TestStage.EXPLORATION}
            questionsAnswered={progress.current}
            totalQuestions={progress.total}
            phaseProgress={'phaseProgress' in progress ? progress.phaseProgress : { current: 0, total: 5 }}
            confidence={enhancedBayesianEngine.getConfidenceMetrics()}
            convergenceScore={convergenceScore}
            informationGain={informationGain}
            elapsedTime={elapsedTime}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            onSubmitAnswer={handleSubmitAnswer}
            isLoading={isLoading}
            stageTransitionInfo={stageTransitionInfo}
          />
        ) : (
          <>
            {/* 标准界面：自适应测试进度组件 */}
            <div className="mb-8">
              <AdaptiveTestProgress
                currentPhase={currentSession?.phase || 'inner_motivation'}
                adaptivePhase={enhancedBayesianEngine.getCurrentAdaptivePhase()}
                questionsAnswered={progress.current}
                totalQuestions={progress.total}
                phaseProgress={'phaseProgress' in progress ? progress.phaseProgress : { current: 0, total: 5 }}
                confidence={enhancedBayesianEngine.getConfidenceMetrics()}
                elapsedTime={elapsedTime}
              />
            </div>

            {/* 标准界面：问题卡片 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 leading-relaxed">
                {currentQuestion.text_zh}
              </h2>

              {/* 四选一迫选题 */}
              {currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const optionKey = String.fromCharCode(65 + index); // A, B, C, D
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleAnswerSelect(option.id)}
                        className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                          selectedAnswer === option.id
                            ? currentSession?.phase === 'inner_motivation'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full border-2 mr-4 flex items-center justify-center font-semibold text-sm ${
                            selectedAnswer === option.id
                              ? currentSession?.phase === 'inner_motivation'
                                ? 'border-blue-500 bg-blue-500 text-white'
                                : 'border-purple-500 bg-purple-500 text-white'
                              : 'border-slate-300 text-slate-500'
                          }`}>
                            {optionKey}
                          </div>
                          <span className="text-slate-700 leading-relaxed">{option.text_zh || option.content || option.text}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 标准界面：概率分布可视化 */}
            <div className="mb-6">
              {/* 概率分布开关按钮 */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">概率分布可视化</h3>
                <button
                  onClick={() => setShowProbabilityDistribution(!showProbabilityDistribution)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    showProbabilityDistribution
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <div className={`w-4 h-4 mr-2 rounded-full border-2 transition-all duration-200 ${
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

            {/* 标准界面：提交按钮 */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmitAnswer}
                disabled={!hasAnswered || isLoading}
                className={`flex items-center px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
                  hasAnswered && !isLoading
                    ? currentSession?.phase === 'inner_motivation'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                      : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {t('processing')}...
                  </>
                ) : (
                  <>
                    {progress.current >= 9 ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        {t('completeTest')}
                      </>
                    ) : (
                      <>
                        {t('nextQuestion')}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Test;
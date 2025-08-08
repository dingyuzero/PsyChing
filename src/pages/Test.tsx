import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, CheckCircle, Target, Brain } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTestStore } from '../store/useTestStore';
import { Question, TestPhase } from '../types';

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
  
  // 初始化测试
  useEffect(() => {
    initializeTest();
  }, []);
  
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
    } catch (error) {
      console.error('Failed to start test:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 重置答案状态
  useEffect(() => {
    setSelectedAnswer(null);
    setHasAnswered(false);
  }, [currentSession?.currentQuestion]);

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
          
          <div className="flex items-center space-x-4">
            {/* 测试阶段指示器 */}
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
            
            <div className="flex items-center text-slate-600">
              <Clock className="w-5 h-5 mr-2" />
              <span>答题时间: {Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:{(elapsedTime % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              {t('question')} {Math.min(progress.current + 1, progress.total)} / {progress.total}
            </span>
            <span className="text-sm font-medium text-slate-700">
              {Math.round(Math.min(progress.percentage, 100))}% {t('completed')}
            </span>
          </div>
          
          {/* 双阶段进度条 */}
          <div className="w-full bg-slate-200 rounded-full h-3 relative">
            {/* 内在动机阶段 */}
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-l-full transition-all duration-500 ease-out absolute left-0"
              style={{ width: `${Math.min(progress.current * 10, 50)}%` }}
            ></div>
            {/* 外在行为阶段 */}
            <div
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-r-full transition-all duration-500 ease-out absolute right-0"
              style={{ width: `${Math.max(0, (progress.current - 5) * 10)}%` }}
            ></div>
            {/* 分界线 */}
            <div className="absolute left-1/2 top-0 w-0.5 h-3 bg-white transform -translate-x-0.5"></div>
          </div>
          
          {/* 阶段标签 */}
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>{t('innerMotivation')} (1-5)</span>
            <span>{t('outerBehavior')} (6-10)</span>
          </div>
        </div>

        {/* 问题卡片 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
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

        {/* 提交按钮 */}
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
      </div>
    </div>
  );
};

export default Test;
import { create } from 'zustand';
import { 
  Question, 
  TestAnswer, 
  TestSession, 
  HexagramResult, 
  TestPhase, 
  TrigramType,
  Language,
  LocalStorageData 
} from '../types';
import { bayesianEngine } from '../utils/bayesianEngine';
import { HexagramAnalysisEngine } from '../utils/hexagramAnalysis';
import { HexagramMapper } from '../data/hexagramDatabase';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';

interface TestState {
  // 测试会话状态
  currentSession: TestSession | null;
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  
  // 测试结果
  currentResult: HexagramResult | null;
  testResult: HexagramResult | null;
  testHistory: HexagramResult[];
  
  // UI状态
  isLoading: boolean;
  error: string | null;
  language: Language;
  isTestActive: boolean;
  
  // 操作方法
  startTest: () => Promise<void>;
  submitAnswer: (optionId: string, responseTime?: number) => Promise<{completed: boolean}>;
  completeTest: () => Promise<void>;
  resetTest: () => void;
  loadTestHistory: () => void;
  setLanguage: (language: Language) => void;
  clearError: () => void;
  
  // 获取测试进度
  getProgress: () => {
    current: number;
    total: number;
    percentage: number;
    phase: TestPhase;
    phaseProgress: {
      current: number;
      total: number;
    };
  } | null;
  
  // 测试CSV文件访问
  testCSVAccess: () => Promise<{
    success: boolean;
    data?: {
      status: number;
      contentLength: number;
      totalLines: number;
      nonEmptyLines: number;
      headers: number;
      preview: string;
    } | null;
    error?: string;
  }>;
}

export const useTestStore = create<TestState>((set, get) => ({
  // 初始状态
  currentSession: null,
  currentQuestion: null,
  currentQuestionIndex: 0,
  currentResult: null,
  testResult: null,
  testHistory: [],
  isLoading: false,
  error: null,
  language: 'zh',
  isTestActive: false,
  
  // 开始测试
  startTest: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // 等待题库加载完成
      console.log('Waiting for question bank to load...');
      await bayesianEngine.waitForLoad();
      
      // 检查加载状态
      const loadingStatus = bayesianEngine.getLoadingStatus();
      if (loadingStatus.error) {
        throw new Error(`题库加载失败: ${loadingStatus.error}`);
      }
      
      if (!loadingStatus.isLoaded) {
        throw new Error('题库未加载完成');
      }
      
      console.log('Question bank loaded successfully, starting test...');
      
      // 重置贝叶斯引擎
      bayesianEngine.reset();
      
      // 获取第一个问题
      const firstQuestion = bayesianEngine.getNextQuestion(get().language);
      if (!firstQuestion) {
        throw new Error('无法获取测试题目，请检查题库是否正确加载');
      }
      
      console.log('First question loaded:', firstQuestion.id);
      
      // 创建新的测试会话
      const newSession: TestSession = {
        id: `session_${Date.now()}`,
        start_time: new Date().toISOString(),
        started_at: new Date().toISOString(),
        phase: 'inner_motivation',
        current_question_index: 0,
        currentQuestion: firstQuestion,
        answers: [],
        probability_distribution: {
          inner_motivation: bayesianEngine.getCurrentProbabilities().inner_motivation,
          outer_behavior: bayesianEngine.getCurrentProbabilities().outer_behavior
        },
        probability_distributions: {
          inner_motivation: bayesianEngine.getCurrentProbabilities().inner_motivation,
          outer_behavior: bayesianEngine.getCurrentProbabilities().outer_behavior
        },
        is_completed: false
      };
      
      set({
        currentSession: newSession,
        currentQuestion: firstQuestion,
        currentResult: null,
        isLoading: false,
        isTestActive: true
      });
      
      console.log('Test started successfully');
    } catch (error) {
      console.error('Failed to start test:', error);
      set({ 
        error: error instanceof Error ? error.message : '开始测试失败',
        isLoading: false,
        isTestActive: false
      });
    }
  },
  
  // 提交答案
  submitAnswer: async (optionId: string, responseTime: number = 1000) => {
    try {
      const state = get();
      if (!state.currentSession || !state.currentQuestion) {
        throw new Error('测试未激活或没有当前问题');
      }
      
      set({ isLoading: true });
      
      // 创建答案对象
      const answer: TestAnswer = {
        question_id: state.currentQuestion!.id,
        selected_option_id: optionId,
        option_id: optionId,
        response_time: responseTime,
        timestamp: Date.now(),
        answered_at: new Date().toISOString()
      };
      
      // 更新贝叶斯引擎概率
      bayesianEngine.updateProbabilities(answer);
      
      // 更新会话状态
      const updatedSession: TestSession = {
        ...state.currentSession,
        answers: [...state.currentSession.answers, answer],
        current_question_index: state.currentSession.current_question_index + 1,
        probability_distributions: {
          inner_motivation: bayesianEngine.getCurrentProbabilities().inner_motivation,
          outer_behavior: bayesianEngine.getCurrentProbabilities().outer_behavior
        }
      };
      
      // 获取下一个问题
      const nextQuestion = bayesianEngine.getNextQuestion(state.language);
      
      if (nextQuestion) {
        // 继续测试
        updatedSession.currentQuestion = nextQuestion;
        set({
          currentSession: updatedSession,
          currentQuestion: nextQuestion,
          isLoading: false
        });
        return { completed: false };
      } else {
        // 测试完成
        updatedSession.is_completed = true;
        updatedSession.completed_at = new Date().toISOString();
        updatedSession.currentQuestion = undefined;
        
        set({
          currentSession: updatedSession,
          currentQuestion: null,
          isLoading: false
        });
        
        // 生成最终结果
        await get().completeTest();
        return { completed: true };
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '提交答案失败',
        isLoading: false 
      });
      return { completed: false };
    }
  },
  
  // 完成测试
  completeTest: async () => {
    try {
      const state = get();
      if (!state.currentSession || !state.currentSession.is_completed) {
        throw new Error('测试会话无效或未完成');
      }
      
      set({ isLoading: true });
      
      // 获取最终的贝叶斯分析结果
      const finalResult = bayesianEngine.getFinalResult();
      
      // 生成卦象分析
      const analysisResult = HexagramAnalysisEngine.generateAnalysis(
        finalResult.inner_motivation,
        finalResult.outer_behavior,
        finalResult.probabilities
      );
      
      // 获取主卦
      const mainHexagram = HexagramMapper.getHexagram(finalResult.outer_behavior, finalResult.inner_motivation);
      if (!mainHexagram) {
        throw new Error('无法找到对应的卦象');
      }
      
      // 构建完整的HexagramResult对象
      const hexagramResult: HexagramResult = {
        id: `result_${Date.now()}`,
        timestamp: Date.now(),
        answers: state.currentSession.answers,
        hexagram: {
          id: mainHexagram.id,
          name_zh: mainHexagram.name_zh,
          name_en: mainHexagram.name_en,
          upper_trigram: mainHexagram.upper_trigram,
          lower_trigram: mainHexagram.lower_trigram,
          binary_code: mainHexagram.binary_code,
          lines: mainHexagram.lines,
          gua_number: mainHexagram.gua_number
        },
        confidence: analysisResult.confidence,
        basicAnalysis: analysisResult.basicAnalysis,
        lineAnalysis: analysisResult.lineAnalysis,
        relatedHexagrams: analysisResult.relatedHexagrams,
        detailedAnalysis: analysisResult.detailedAnalysis
      };
      
      // 保存到本地存储
      const updatedHistory = [...state.testHistory, hexagramResult];
      const localData: LocalStorageData = {
        testHistory: updatedHistory,
        hexagramResults: updatedHistory,
        userPreferences: {
          language: 'zh',
          theme: 'light'
        }
      };
      
      saveToLocalStorage(localData);
      
      set({
        currentResult: hexagramResult,
        testHistory: updatedHistory,
        currentSession: null,
        currentQuestion: null,
        isLoading: false
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '完成测试失败',
        isLoading: false 
      });
    }
  },
  
  // 重置测试
  resetTest: () => {
    bayesianEngine.reset();
    set({
      currentSession: null,
      currentQuestion: null,
      currentResult: null,
      isLoading: false,
      error: null
    });
  },
  
  // 加载测试历史
  loadTestHistory: () => {
    try {
      const localData = loadFromLocalStorage();
      if (localData && localData.hexagramResults) {
        set({ testHistory: localData.hexagramResults });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '加载历史记录失败'
      });
    }
  },
  
  // 设置语言
  setLanguage: (language: Language) => {
    set({ language });
  },
  
  // 清除错误
  clearError: () => {
    set({ error: null });
  },
  
  // 获取测试进度
  getProgress: () => {
    const state = get();
    if (!state.currentSession) {
      return null;
    }
    
    return bayesianEngine.getProgress();
  },
  
  // 测试CSV文件访问
  testCSVAccess: async () => {
    try {
      console.log('🔍 Testing CSV file access...');
      const response = await fetch('/question_bank.csv');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const text = await response.text();
      const lines = text.split('\n');
      const nonEmptyLines = lines.filter(line => line.trim());
      
      console.log('✅ CSV access test successful');
      return {
        success: true,
        data: {
          status: response.status,
          contentLength: text.length,
          totalLines: lines.length,
          nonEmptyLines: nonEmptyLines.length,
          headers: nonEmptyLines[0] ? nonEmptyLines[0].split(',').length : 0,
          preview: text.substring(0, 200)
        }
      };
    } catch (error) {
      console.error('❌ CSV access test failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null
      };
    }
  }
}));

// 导出一些有用的选择器
export const useTestProgress = () => {
  const currentQuestionIndex = useTestStore(state => state.currentQuestionIndex);
  const getProgress = useTestStore(state => state.getProgress);
  return getProgress();
};

export const useTestError = () => {
  const error = useTestStore(state => state.error);
  const clearError = useTestStore(state => state.clearError);
  return { error, clearError };
};

export const useTestLoading = () => {
  return useTestStore(state => state.isLoading);
};
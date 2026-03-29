import { Question, QuestionOption, TestPhase, ProbabilityMap, TestAnswer, TrigramType } from '../types';

// 扩展的问题接口，支持新的字段
export interface ExtendedQuestion extends Question {
  subcategory?: string;
  information_value?: number;
  discrimination_target?: string;
  test_stage?: 'exploration' | 'discrimination' | 'confirmation';
  complexity?: 'simple' | 'medium' | 'complex';
}

// 测试阶段枚举
export enum TestStage {
  EXPLORATION = 'exploration',
  DISCRIMINATION = 'discrimination', 
  CONFIRMATION = 'confirmation'
}

// 自适应测试阶段类型
export type AdaptiveTestPhase = 'exploration' | 'discrimination' | 'confirmation';

// 信息增益计算结果
export interface InformationGainResult {
  questionId: string;
  informationGain: number;
  expectedEntropy: number;
  currentEntropy: number;
  stage: TestStage;
}

// 自适应测试配置
export interface AdaptiveTestConfig {
  questionsPerPhase: number;
  explorationQuestions: number;
  discriminationQuestions: number;
  confirmationQuestions: number;
  convergenceThreshold: number;
  maxIterations: number;
  minQuestionsPerPhase?: number; // 最少题目数
  earlyStopThreshold?: number; // 提前停止阈值
  // 分阶段自适应阈值
  explorationThreshold?: number; // 探索阶段阈值
    discriminationThreshold?: number; // 区分阶段阈值
    confirmationThreshold?: number; // 确认阶段阈值
}

// 增强版贝叶斯自适应测试引擎
export class EnhancedBayesianEngine {
  private questionBank: ExtendedQuestion[] = [];
  private usedQuestions: Set<string> = new Set();
  private currentPhase: TestPhase = 'inner_motivation';
  private currentStage: TestStage = TestStage.EXPLORATION;
  private phaseQuestionCount = 0;
  private stageQuestionCount = 0;
  
  // 自适应测试配置
  private config: AdaptiveTestConfig = {
    questionsPerPhase: 15,
    explorationQuestions: 7, // 探索阶段最多7道题
    discriminationQuestions: 5, // 区分阶段最多5道题
    confirmationQuestions: 3, // 确认阶段最多3道题
    convergenceThreshold: 0.75, // 提高收敛阈值
    maxIterations: 15,
    minQuestionsPerPhase: 6, // 最少题目数
    earlyStopThreshold: 0.6, // 降低总体提前停止阈值
    // 分阶段自适应阈值
    explorationThreshold: 0.3, // 探索阶段阈值
    discriminationThreshold: 0.4, // 区分阶段阈值
    confirmationThreshold: 0.5 // 确认阶段阈值
  }
  
  // 加载状态
  private isLoading = false;
  private isLoaded = false;
  private loadError: string | null = null;
  private loadPromise: Promise<void> | null = null;
  
  // 概率分布
  private innerMotivationProbs: ProbabilityMap = {
    qian: 0.125, kun: 0.125, zhen: 0.125, xun: 0.125, kan: 0.125, li: 0.125, gen: 0.125, dui: 0.125
  };
  private outerBehaviorProbs: ProbabilityMap = {
    qian: 0.125, kun: 0.125, zhen: 0.125, xun: 0.125, kan: 0.125, li: 0.125, gen: 0.125, dui: 0.125
  };
  
  // 收敛检测
  private convergenceDetected = false;
  private confidenceHistory: number[] = [];
  
  constructor(config?: Partial<AdaptiveTestConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    this.loadPromise = this.loadQuestionBank();
  }
  
  private async loadQuestionBank(): Promise<void> {
    if (this.isLoading || this.isLoaded) {
      console.log('Enhanced question bank already loading or loaded, skipping...');
      return this.loadPromise || Promise.resolve();
    }
    
    this.isLoading = true;
    this.loadError = null;
    
    try {
      console.log('🔄 Loading enhanced question bank from extended CSV...');
      
      const response = await fetch(`${import.meta.env.BASE_URL}extended_question_bank.csv`);
      if (!response.ok) {
        throw new Error(`Failed to fetch extended CSV: ${response.status} ${response.statusText}`);
      }
      
      const csvText = await response.text();
      console.log('📄 Extended CSV loaded, length:', csvText.length);
      
      this.parseExtendedCSV(csvText);
      
      if (this.questionBank.length === 0) {
        throw new Error('No valid questions found in extended CSV file');
      }
      
      this.isLoaded = true;
      console.log(`✅ Successfully loaded ${this.questionBank.length} enhanced questions`);
      console.log('📊 Enhanced question bank stats:', this.getQuestionBankStats());
    } catch (error) {
      console.error('❌ Failed to load enhanced question bank:', error);
      this.loadError = error instanceof Error ? error.message : 'Unknown error';
      this.loadFallbackQuestions();
      this.isLoaded = true;
    } finally {
      this.isLoading = false;
    }
  }
  
  private parseExtendedCSV(csvText: string) {
    console.log('🔍 Parsing extended CSV format...');
    const lines = csvText.split('\n');
    
    if (lines.length === 0) {
      console.error('❌ Extended CSV file is empty');
      return;
    }
    
    // 解析表头
    const headers = this.parseCSVLine(lines[0]);
    console.log(`📋 Extended CSV headers (${headers.length}):`, headers.slice(0, 10));
    
    let validQuestions = 0;
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = this.parseCSVLine(lines[i]);
        
        if (values.length >= headers.length - 5) { // 允许一些容错
          const question = this.createExtendedQuestionFromCSV(headers, values);
          if (question) {
            this.questionBank.push(question);
            validQuestions++;
          }
        }
      }
    }
    
    console.log(`📊 Extended CSV parsing completed: ${validQuestions} valid questions`);
  }
  
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    
    // 添加调试信息，特别关注包含inner_005的行
    const isInner005Line = line.includes('inner_005');
    if (isInner005Line) {
      console.log('🔍 Parsing inner_005 line:');
      console.log('Raw line length:', line.length);
      console.log('Raw line preview:', line.substring(0, 200) + '...');
    }
    
    while (i < line.length) {
      const char = line[i];
      
      if (char === '"') {
        // 检查是否是转义的引号
        if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i += 2; // 跳过两个引号
          continue;
        }
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
      i++;
    }
    
    // 添加最后一个字段
    result.push(current.trim());
    
    // 清理字段值，移除首尾的引号并处理转义字符
    const cleanedResult = result.map(field => {
      let cleaned = field.trim();
      // 移除首尾引号
      if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
        cleaned = cleaned.slice(1, -1);
      }
      // 处理转义的引号
      cleaned = cleaned.replace(/""/g, '"');
      return cleaned;
    });
    
    if (isInner005Line) {
      console.log('🔍 Parsed inner_005 fields count:', cleanedResult.length);
      console.log('🔍 First 15 fields:', cleanedResult.slice(0, 15));
      console.log('🔍 Option fields:');
      console.log('  option_a_zh (4):', cleanedResult[4]);
      console.log('  option_a_en (5):', cleanedResult[5]);
      console.log('  option_b_zh (6):', cleanedResult[6]);
      console.log('  option_b_en (7):', cleanedResult[7]);
      console.log('  option_c_zh (8):', cleanedResult[8]);
      console.log('  option_c_en (9):', cleanedResult[9]);
      console.log('  option_d_zh (10):', cleanedResult[10]);
      console.log('  option_d_en (11):', cleanedResult[11]);
    }
    
    return cleanedResult;
  }
  
  private createExtendedQuestionFromCSV(headers: string[], values: string[]): ExtendedQuestion | null {
    try {
      const getField = (fieldName: string): string => {
        const index = headers.indexOf(fieldName);
        return index >= 0 && index < values.length ? values[index] : '';
      };
      
      const getCoeff = (fieldName: string): number => {
        const value = getField(fieldName);
        return parseFloat(value) || 0;
      };
      
      const id = getField('id');
      const category = getField('category') as TestPhase;
      
      // 添加调试信息，特别关注inner_005
      if (id === 'inner_005') {
        console.log('🔍 Debugging inner_005 CSV parsing:');
        console.log('Headers length:', headers.length);
        console.log('Values length:', values.length);
        console.log('Raw values array:', values);
        console.log('option_a_zh index:', headers.indexOf('option_a_zh'));
        console.log('option_a_zh value:', getField('option_a_zh'));
        console.log('option_b_zh value:', getField('option_b_zh'));
        console.log('option_c_zh value:', getField('option_c_zh'));
        console.log('option_d_zh value:', getField('option_d_zh'));
      }
      
      if (!id || !category || !['inner_motivation', 'outer_behavior'].includes(category)) {
        return null;
      }
      
      // 解析八卦系数（支持新格式）
      // 解析八卦系数（支持新格式）
      
      const options: QuestionOption[] = [
        {
          id: 'a',
          text_zh: getField('option_a_zh'),
          text_en: getField('option_a_en'),
          impact_coefficients: {
            qian: getCoeff('qian_a') || getCoeff('qian_coeff_a'),
            kun: getCoeff('kun_a') || getCoeff('kun_coeff_a'),
            zhen: getCoeff('zhen_a') || getCoeff('zhen_coeff_a'),
            xun: getCoeff('xun_a') || getCoeff('xun_coeff_a'),
            kan: getCoeff('kan_a') || getCoeff('kan_coeff_a'),
            li: getCoeff('li_a') || getCoeff('li_coeff_a'),
            gen: getCoeff('gen_a') || getCoeff('gen_coeff_a'),
            dui: getCoeff('dui_a') || getCoeff('dui_coeff_a')
          }
        },
        {
          id: 'b',
          text_zh: getField('option_b_zh'),
          text_en: getField('option_b_en'),
          impact_coefficients: {
            qian: getCoeff('qian_b') || getCoeff('qian_coeff_b'),
            kun: getCoeff('kun_b') || getCoeff('kun_coeff_b'),
            zhen: getCoeff('zhen_b') || getCoeff('zhen_coeff_b'),
            xun: getCoeff('xun_b') || getCoeff('xun_coeff_b'),
            kan: getCoeff('kan_b') || getCoeff('kan_coeff_b'),
            li: getCoeff('li_b') || getCoeff('li_coeff_b'),
            gen: getCoeff('gen_b') || getCoeff('gen_coeff_b'),
            dui: getCoeff('dui_b') || getCoeff('dui_coeff_b')
          }
        },
        {
          id: 'c',
          text_zh: getField('option_c_zh'),
          text_en: getField('option_c_en'),
          impact_coefficients: {
            qian: getCoeff('qian_c') || getCoeff('qian_coeff_c'),
            kun: getCoeff('kun_c') || getCoeff('kun_coeff_c'),
            zhen: getCoeff('zhen_c') || getCoeff('zhen_coeff_c'),
            xun: getCoeff('xun_c') || getCoeff('xun_coeff_c'),
            kan: getCoeff('kan_c') || getCoeff('kan_coeff_c'),
            li: getCoeff('li_c') || getCoeff('li_coeff_c'),
            gen: getCoeff('gen_c') || getCoeff('gen_coeff_c'),
            dui: getCoeff('dui_c') || getCoeff('dui_coeff_c')
          }
        },
        {
          id: 'd',
          text_zh: getField('option_d_zh'),
          text_en: getField('option_d_en'),
          impact_coefficients: {
            qian: getCoeff('qian_d') || getCoeff('qian_coeff_d'),
            kun: getCoeff('kun_d') || getCoeff('kun_coeff_d'),
            zhen: getCoeff('zhen_d') || getCoeff('zhen_coeff_d'),
            xun: getCoeff('xun_d') || getCoeff('xun_coeff_d'),
            kan: getCoeff('kan_d') || getCoeff('kan_coeff_d'),
            li: getCoeff('li_d') || getCoeff('li_coeff_d'),
            gen: getCoeff('gen_d') || getCoeff('gen_coeff_d'),
            dui: getCoeff('dui_d') || getCoeff('dui_coeff_d')
          }
        }
      ];
      
      // 添加选项调试信息
      if (id === 'inner_005') {
        console.log('🔍 inner_005 options created:');
        options.forEach((option, index) => {
          console.log(`Option ${option.id}:`, {
            text_zh: option.text_zh,
            text_en: option.text_en
          });
        });
      }
      

      
      return {
        id,
        category,
        content: getField('text_zh'),
        type: 'single_choice',
        dimension: getField('dimension') || 'general',
        text_zh: getField('text_zh'),
        text_en: getField('text_en'),
        options,
        difficulty: parseFloat(getField('difficulty')) || 0.5,
        usage_count: 0,
        subcategory: getField('subcategory'),
        information_value: parseFloat(getField('information_value')) || 0.5,
        discrimination_target: getField('discrimination_target'),
        test_stage: getField('test_stage') as 'exploration' | 'discrimination' | 'confirmation',
        complexity: getField('complexity') as 'simple' | 'medium' | 'complex'
      };
    } catch (error) {
      console.error('Error creating extended question from CSV:', error);
      return null;
    }
  }
  
  private loadFallbackQuestions() {
    // 使用原有的备用问题库
    this.questionBank = [
      {
        id: 'inner_1',
        category: 'inner_motivation',
        content: '面对新的挑战时，你的第一反应是什么？',
        type: 'single_choice',
        dimension: 'challenge_response',
        text_zh: '面对新的挑战时，你的第一反应是什么？',
        text_en: 'When facing new challenges, what is your first reaction?',
        options: [
          {
            id: 'a',
            text_zh: '兴奋地接受挑战，追求突破',
            text_en: 'Excitedly accept the challenge and pursue breakthroughs',
            impact_coefficients: { qian: 0.9, kun: 0.1, zhen: 0.7, xun: 0.3, kan: 0.5, li: 0.6, gen: 0.2, dui: 0.4 }
          },
          {
            id: 'b',
            text_zh: '仔细评估风险，确保安全',
            text_en: 'Carefully assess risks to ensure safety',
            impact_coefficients: { qian: 0.2, kun: 0.9, zhen: 0.1, xun: 0.4, kan: 0.3, li: 0.2, gen: 0.8, dui: 0.5 }
          },
          {
            id: 'c',
            text_zh: '寻找创新的解决方案',
            text_en: 'Look for innovative solutions',
            impact_coefficients: { qian: 0.6, kun: 0.2, zhen: 0.9, xun: 0.5, kan: 0.7, li: 0.8, gen: 0.3, dui: 0.4 }
          },
          {
            id: 'd',
            text_zh: '与他人协作共同应对',
            text_en: 'Collaborate with others to tackle it together',
            impact_coefficients: { qian: 0.3, kun: 0.6, zhen: 0.4, xun: 0.8, kan: 0.4, li: 0.5, gen: 0.4, dui: 0.9 }
          }
        ],
        difficulty: 0.8,
        usage_count: 0,
        subcategory: 'achievement',
        information_value: 0.8,
        discrimination_target: 'qian,zhen',
        test_stage: 'exploration',
        complexity: 'medium'
      }
    ];
  }
  
  // 等待加载完成
  async waitForLoad(): Promise<void> {
    if (this.loadPromise) {
      await this.loadPromise;
    }
    
    if (this.loadError) {
      throw new Error(`Enhanced question bank loading failed: ${this.loadError}`);
    }
  }
  
  // 检查是否已加载
  isQuestionBankLoaded(): boolean {
    return this.isLoaded && !this.isLoading;
  }
  
  // 获取加载状态
  getLoadingStatus(): { isLoading: boolean; isLoaded: boolean; error: string | null } {
    return {
      isLoading: this.isLoading,
      isLoaded: this.isLoaded,
      error: this.loadError
    };
  }
  
  // 核心方法：获取下一个最优问题（自适应算法）
  getNextQuestion(language: 'zh' | 'en' = 'zh'): ExtendedQuestion | null {
    if (!this.isLoaded || this.loadError) {
      console.warn('Enhanced question bank not ready');
      return null;
    }
    
    // 检查是否需要切换阶段
    if (this.shouldSwitchPhase()) {
      if (this.currentPhase === 'inner_motivation') {
        this.currentPhase = 'outer_behavior';
        this.phaseQuestionCount = 0;
        this.currentStage = TestStage.EXPLORATION;
        this.stageQuestionCount = 0;
      } else {
        // 测试完成
        return null;
      }
    }
    
    // 检查是否需要切换测试阶段
    if (this.shouldSwitchStage()) {
      const switched = this.switchToNextStage();
      // 如果确认阶段完成，结束当前阶段
      if (!switched) {
        console.log(`🏁 Confirmation stage completed, switching to next phase`);
        this.phaseQuestionCount = this.config.questionsPerPhase; // 强制切换阶段
        return this.getNextQuestion(language); // 递归调用以切换阶段
      }
    }
    
    // 获取当前阶段和测试阶段的可用问题
    const availableQuestions = this.getAvailableQuestions();
    
    if (availableQuestions.length === 0) {
      console.warn(`No available questions for phase: ${this.currentPhase}, stage: ${this.currentStage}`);
      return this.getFallbackQuestion();
    }
    
    // 使用自适应算法选择最优问题
    const bestQuestion = this.selectOptimalQuestion(availableQuestions);
    this.usedQuestions.add(bestQuestion.id);
    
    return bestQuestion;
  }
  
  private shouldSwitchPhase(): boolean {
    // 检查是否达到最大题目数
    if (this.phaseQuestionCount >= this.config.questionsPerPhase) {
      return true;
    }
    
    // 检查是否可以提前停止（最少6题后）
    const minQuestions = this.config.minQuestionsPerPhase || 6;
    if (this.phaseQuestionCount >= minQuestions) {
      const currentProbs = this.getCurrentPhaseProbabilities();
      const maxProb = Math.max(...Object.values(currentProbs));
      const earlyStopThreshold = this.config.earlyStopThreshold || 0.8;
      
      // 如果最高概率超过提前停止阈值，可以提前结束当前阶段
      if (maxProb >= earlyStopThreshold) {
        console.log(`🎯 Early stop triggered for ${this.currentPhase}: max probability ${maxProb.toFixed(3)} >= ${earlyStopThreshold}`);
        return true;
      }
    }
    
    return false;
  }
  
  private shouldSwitchStage(): boolean {
    const currentProbs = this.getCurrentPhaseProbabilities();
    const maxProb = Math.max(...Object.values(currentProbs));
    
    switch (this.currentStage) {
      case TestStage.EXPLORATION:
        // 探索阶段：达到固定题目数或超过探索阈值
        const explorationThreshold = this.config.explorationThreshold || 0.5;
        if (maxProb >= explorationThreshold && this.stageQuestionCount >= 3) {
          console.log(`🎯 Exploration stage early switch: max probability ${maxProb.toFixed(3)} >= ${explorationThreshold}`);
          return true;
        }
        // 达到最大题目数限制（7道题）
        return this.stageQuestionCount >= this.config.explorationQuestions;
        
      case TestStage.DISCRIMINATION:
        // 区分阶段：达到固定题目数、收敛或超过区分阈值
        const discriminationThreshold = this.config.discriminationThreshold || 0.65;
        if (maxProb >= discriminationThreshold && this.stageQuestionCount >= 2) {
          console.log(`🎯 Discrimination stage early switch: max probability ${maxProb.toFixed(3)} >= ${discriminationThreshold}`);
          return true;
        }
        // 达到最大题目数限制（5道题）或收敛
        return this.stageQuestionCount >= this.config.discriminationQuestions || this.isConverged();
        
      case TestStage.CONFIRMATION:
        // 确认阶段：达到固定题目数或超过确认阈值
        const confirmationThreshold = this.config.confirmationThreshold || 0.75;
        if (maxProb >= confirmationThreshold && this.stageQuestionCount >= 1) {
          console.log(`🎯 Confirmation stage early switch: max probability ${maxProb.toFixed(3)} >= ${confirmationThreshold}`);
          return true;
        }
        // 达到最大题目数限制（3道题）
        return this.stageQuestionCount >= this.config.confirmationQuestions;
        
      default:
        return false;
    }
  }
  
  private switchToNextStage(): boolean {
    switch (this.currentStage) {
      case TestStage.EXPLORATION:
        this.currentStage = TestStage.DISCRIMINATION;
        this.stageQuestionCount = 0;
        console.log(`🔄 Switched to stage: ${this.currentStage}`);
        return true;
      case TestStage.DISCRIMINATION:
        this.currentStage = TestStage.CONFIRMATION;
        this.stageQuestionCount = 0;
        console.log(`🔄 Switched to stage: ${this.currentStage}`);
        return true;
      case TestStage.CONFIRMATION:
        // 确认阶段完成，返回false表示无法继续切换
        console.log(`🏁 Confirmation stage completed, no more stages available`);
        return false;
      default:
        return false;
    }
  }
  
  private getAvailableQuestions(): ExtendedQuestion[] {
    return this.questionBank.filter(q => {
      // 基本过滤条件
      if (q.category !== this.currentPhase || this.usedQuestions.has(q.id)) {
        return false;
      }
      
      // 根据测试阶段过滤
      if (q.test_stage && q.test_stage !== this.currentStage) {
        return false;
      }
      
      return true;
    });
  }
  
  private getFallbackQuestion(): ExtendedQuestion | null {
    // 如果没有匹配的问题，从当前阶段选择任意未使用的问题
    const fallbackQuestions = this.questionBank.filter(q => 
      q.category === this.currentPhase && !this.usedQuestions.has(q.id)
    );
    
    if (fallbackQuestions.length > 0) {
      const question = fallbackQuestions[0];
      this.usedQuestions.add(question.id);
      return question;
    }
    
    return null;
  }
  
  // 自适应问题选择算法
  private selectOptimalQuestion(questions: ExtendedQuestion[]): ExtendedQuestion {
    const informationGains = questions.map(q => ({
      question: q,
      ...this.calculateAdvancedInformationGain(q)
    }));
    
    // 根据当前测试阶段选择策略
    switch (this.currentStage) {
      case TestStage.EXPLORATION:
        return this.selectExplorationQuestion(informationGains);
      case TestStage.DISCRIMINATION:
        return this.selectDiscriminationQuestion(informationGains);
      case TestStage.CONFIRMATION:
        return this.selectConfirmationQuestion(informationGains);
      default:
        return informationGains[0].question;
    }
  }
  
  private selectExplorationQuestion(candidates: Array<{question: ExtendedQuestion} & InformationGainResult>): ExtendedQuestion {
    // 探索阶段：选择信息增益最大的问题
    const sorted = candidates.sort((a, b) => b.informationGain - a.informationGain);
    return sorted[0].question;
  }
  
  private selectDiscriminationQuestion(candidates: Array<{question: ExtendedQuestion} & InformationGainResult>): ExtendedQuestion {
    // 区分阶段：选择能最好区分当前最可能的几个类型的问题
    const currentProbs = this.getCurrentPhaseProbabilities();
    const topTypes = this.getTopProbableTypes(currentProbs, 3);
    
    // 计算每个问题对顶级类型的区分能力
    const discriminationScores = candidates.map(candidate => {
      const discriminationPower = this.calculateDiscriminationPower(candidate.question, topTypes);
      return {
        ...candidate,
        discriminationPower
      };
    });
    
    const sorted = discriminationScores.sort((a, b) => b.discriminationPower - a.discriminationPower);
    return sorted[0].question;
  }
  
  private selectConfirmationQuestion(candidates: Array<{question: ExtendedQuestion} & InformationGainResult>): ExtendedQuestion {
    // 确认阶段：选择能确认当前最可能类型的问题
    const currentProbs = this.getCurrentPhaseProbabilities();
    const topType = this.getTopProbableTypes(currentProbs, 1)[0];
    
    // 选择最能确认顶级类型的问题
    const confirmationScores = candidates.map(candidate => {
      const confirmationPower = this.calculateConfirmationPower(candidate.question, topType);
      return {
        ...candidate,
        confirmationPower
      };
    });
    
    const sorted = confirmationScores.sort((a, b) => b.confirmationPower - a.confirmationPower);
    return sorted[0].question;
  }
  
  // 高级信息增益计算
  private calculateAdvancedInformationGain(question: ExtendedQuestion): InformationGainResult {
    const currentProbs = this.getCurrentPhaseProbabilities();
    const currentEntropy = this.calculateEntropy(Object.values(currentProbs));
    
    // 计算期望熵（考虑选项概率分布）
    let expectedEntropy = 0;
    const optionProbabilities = this.estimateOptionProbabilities(question);
    
    for (let i = 0; i < question.options.length; i++) {
      const option = question.options[i];
      const optionProb = optionProbabilities[i];
      
      // 模拟选择该选项后的概率分布
      const simulatedProbs = { ...currentProbs };
      
      Object.keys(simulatedProbs).forEach(type => {
        const trigramType = type as TrigramType;
        simulatedProbs[trigramType] *= option.impact_coefficients[trigramType];
      });
      
      this.normalizeProbabilities(simulatedProbs);
      
      const optionEntropy = this.calculateEntropy(Object.values(simulatedProbs));
      expectedEntropy += optionProb * optionEntropy;
    }
    
    const informationGain = currentEntropy - expectedEntropy;
    
    return {
      questionId: question.id,
      informationGain,
      expectedEntropy,
      currentEntropy,
      stage: this.currentStage
    };
  }
  
  private estimateOptionProbabilities(question: ExtendedQuestion): number[] {
    // 简化：假设选项概率相等，实际可以基于历史数据优化
    const numOptions = question.options.length;
    return new Array(numOptions).fill(1 / numOptions);
  }
  
  private calculateDiscriminationPower(question: ExtendedQuestion, topTypes: TrigramType[]): number {
    let discriminationPower = 0;
    
    for (const option of question.options) {
      const coeffs = topTypes.map(type => option.impact_coefficients[type]);
      const variance = this.calculateVariance(coeffs);
      discriminationPower += variance;
    }
    
    return discriminationPower / question.options.length;
  }
  
  private calculateConfirmationPower(question: ExtendedQuestion, topType: TrigramType): number {
    let confirmationPower = 0;
    
    for (const option of question.options) {
      const coeff = option.impact_coefficients[topType];
      confirmationPower += coeff;
    }
    
    return confirmationPower / question.options.length;
  }
  
  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }
  
  private getCurrentPhaseProbabilities(): ProbabilityMap {
    return this.currentPhase === 'inner_motivation' 
      ? this.innerMotivationProbs 
      : this.outerBehaviorProbs;
  }
  
  private getTopProbableTypes(probabilities: ProbabilityMap, count: number): TrigramType[] {
    return Object.entries(probabilities)
      .sort(([,a], [,b]) => b - a)
      .slice(0, count)
      .map(([type]) => type as TrigramType);
  }
  
  private calculateEntropy(probabilities: number[]): number {
    return -probabilities.reduce((entropy, p) => {
      return p > 0 ? entropy + p * Math.log2(p) : entropy;
    }, 0);
  }
  
  // 收敛检测（增强版）
  private isConverged(): boolean {
    const currentProbs = this.getCurrentPhaseProbabilities();
    const maxProb = Math.max(...Object.values(currentProbs));
    
    this.confidenceHistory.push(maxProb);
    
    // 保持最近5次的置信度历史
    if (this.confidenceHistory.length > 5) {
      this.confidenceHistory.shift();
    }
    
    // 检查最少题目数要求
    const minQuestions = this.config.minQuestionsPerPhase || 6;
    if (this.phaseQuestionCount < minQuestions) {
      return false;
    }
    
    // 检查提前停止条件
    const earlyStopThreshold = this.config.earlyStopThreshold || 0.8;
    if (maxProb >= earlyStopThreshold) {
      console.log(`🎯 Early convergence detected for ${this.currentPhase}: ${maxProb.toFixed(3)} >= ${earlyStopThreshold}`);
      return true;
    }
    
    // 检查稳定收敛
    if (this.confidenceHistory.length >= 3) {
      const recentConfidences = this.confidenceHistory.slice(-3);
      const isStable = recentConfidences.every(conf => conf >= this.config.convergenceThreshold);
      
      if (isStable && !this.convergenceDetected) {
        this.convergenceDetected = true;
        console.log(`🎯 Stable convergence detected for ${this.currentPhase}: ${maxProb.toFixed(3)}`);
        return true;
      }
    }
    
    return false;
   }
   
   // 更新概率分布（增强版贝叶斯更新）
   updateProbabilities(answer: TestAnswer) {
     const question = this.questionBank.find(q => q.id === answer.question_id);
     if (!question) {
       console.warn(`Question not found: ${answer.question_id}`);
       return;
     }
     
     const selectedOption = question.options.find(opt => opt.id === answer.option_id);
     if (!selectedOption) {
       console.warn(`Option not found: ${answer.option_id}`);
       return;
     }
     
     // 获取目标概率分布
     const targetProbs = question.category === 'inner_motivation' 
       ? this.innerMotivationProbs 
       : this.outerBehaviorProbs;
     
     // 增强版贝叶斯更新（考虑问题权重和信息价值）
     const questionWeight = question.information_value || 1.0;
     const difficultyAdjustment = 1.0 + (question.difficulty - 0.5) * 0.2; // 难度调整
     
     Object.keys(targetProbs).forEach(type => {
       const trigramType = type as TrigramType;
       const impact = selectedOption.impact_coefficients[trigramType];
       
       // 应用权重和难度调整
       const adjustedImpact = Math.pow(impact, questionWeight * difficultyAdjustment);
       targetProbs[trigramType] *= adjustedImpact;
     });
     
     // 归一化
     this.normalizeProbabilities(targetProbs);
     
     // 更新计数器
     this.phaseQuestionCount++;
     this.stageQuestionCount++;
     
     // 更新问题使用次数
     question.usage_count++;
     
     // 记录答题历史（用于分析）
     this.recordAnswer(answer, question);
     
     console.log(`📊 Updated probabilities for ${question.category}:`, 
       Object.entries(targetProbs)
         .sort(([,a], [,b]) => b - a)
         .slice(0, 3)
         .map(([type, prob]) => `${type}: ${prob.toFixed(3)}`)
     );
   }
   
   private recordAnswer(answer: TestAnswer, question: ExtendedQuestion) {
     // 可以在这里记录答题历史，用于后续分析和优化
     // 暂时只记录到控制台
     console.log(`📝 Answer recorded: ${question.id} -> ${answer.option_id} (Stage: ${this.currentStage})`);
   }
   
   private normalizeProbabilities(probabilities: ProbabilityMap) {
     const sum = Object.values(probabilities).reduce((a, b) => a + b, 0);
     if (sum > 0) {
       Object.keys(probabilities).forEach(key => {
         const trigramType = key as TrigramType;
         probabilities[trigramType] /= sum;
       });
     } else {
       // 如果所有概率都为0，重新初始化为均匀分布
       Object.keys(probabilities).forEach(key => {
         const trigramType = key as TrigramType;
         probabilities[trigramType] = 0.125;
       });
     }
   }
   
   // 获取最终结果（增强版）
   getFinalResult(): {
     inner_motivation: TrigramType;
     outer_behavior: TrigramType;
     probabilities: {
       inner_motivation: ProbabilityMap;
       outer_behavior: ProbabilityMap;
     };
     confidence: {
       inner_motivation: number;
       outer_behavior: number;
       overall: number;
     };
     convergence: {
       inner_converged: boolean;
       outer_converged: boolean;
       stages_completed: string[];
     };
     early_stop_info: {
       inner_early_stop: boolean;
       outer_early_stop: boolean;
       inner_questions_used: number;
       outer_questions_used: number;
     };
   } {
     // 选择概率最大的卦象（确保即使在15题后仍未确定时也能选择最优结果）
     const topInnerMotivation = Object.entries(this.innerMotivationProbs)
       .reduce((a, b) => a[1] > b[1] ? a : b)[0] as TrigramType;
     
     const topOuterBehavior = Object.entries(this.outerBehaviorProbs)
       .reduce((a, b) => a[1] > b[1] ? a : b)[0] as TrigramType;
     
     // 计算置信度
     const innerConfidence = Math.max(...Object.values(this.innerMotivationProbs));
     const outerConfidence = Math.max(...Object.values(this.outerBehaviorProbs));
     const overallConfidence = (innerConfidence + outerConfidence) / 2;
     
     // 检查收敛状态（使用更灵活的阈值）
     const earlyStopThreshold = this.config.earlyStopThreshold || 0.8;
     const innerConverged = innerConfidence >= this.config.convergenceThreshold || innerConfidence >= earlyStopThreshold;
     const outerConverged = outerConfidence >= this.config.convergenceThreshold || outerConfidence >= earlyStopThreshold;
     
     // 检查提前停止信息
     const innerEarlyStop = innerConfidence >= earlyStopThreshold;
     const outerEarlyStop = outerConfidence >= earlyStopThreshold;
     
     console.log(`📊 Final Result - Inner: ${topInnerMotivation} (${innerConfidence.toFixed(3)}), Outer: ${topOuterBehavior} (${outerConfidence.toFixed(3)})`);
     
     return {
       inner_motivation: topInnerMotivation,
       outer_behavior: topOuterBehavior,
       probabilities: {
         inner_motivation: { ...this.innerMotivationProbs },
         outer_behavior: { ...this.outerBehaviorProbs }
       },
       confidence: {
         inner_motivation: innerConfidence,
         outer_behavior: outerConfidence,
         overall: overallConfidence
       },
       convergence: {
         inner_converged: innerConverged,
         outer_converged: outerConverged,
         stages_completed: this.getCompletedStages()
       },
       early_stop_info: {
         inner_early_stop: innerEarlyStop,
         outer_early_stop: outerEarlyStop,
         inner_questions_used: this.currentPhase === 'inner_motivation' ? this.phaseQuestionCount : this.config.questionsPerPhase,
         outer_questions_used: this.currentPhase === 'outer_behavior' ? this.phaseQuestionCount : 0
       }
     };
   }
   
   private getCompletedStages(): string[] {
     const stages = [];
     if (this.stageQuestionCount > 0 || this.currentStage !== TestStage.EXPLORATION) {
       stages.push('exploration');
     }
     if (this.currentStage === TestStage.CONFIRMATION || 
         (this.currentStage === TestStage.DISCRIMINATION && this.stageQuestionCount > 0)) {
       stages.push('discrimination');
     }
     if (this.currentStage === TestStage.CONFIRMATION && this.stageQuestionCount > 0) {
       stages.push('confirmation');
     }
     return stages;
   }
   
   // 获取当前进度（增强版）
   getProgress() {
     const totalQuestions = this.config.questionsPerPhase * 2;
     const currentQuestions = this.currentPhase === 'inner_motivation' 
       ? this.phaseQuestionCount
       : this.config.questionsPerPhase + this.phaseQuestionCount;
     
     return {
       current: currentQuestions,
       total: totalQuestions,
       percentage: Math.round((currentQuestions / totalQuestions) * 100),
       phase: this.currentPhase,
       stage: this.currentStage,
       phaseProgress: {
         current: this.phaseQuestionCount,
         total: this.config.questionsPerPhase
       },
       stageProgress: {
         current: this.stageQuestionCount,
         total: this.getStageQuestionLimit()
       },
       confidence: {
         current_phase: Math.max(...Object.values(this.getCurrentPhaseProbabilities())),
         convergence_threshold: this.config.convergenceThreshold
       }
     };
   }
   
   private getStageQuestionLimit(): number {
     switch (this.currentStage) {
       case TestStage.EXPLORATION:
         return this.config.explorationQuestions;
       case TestStage.DISCRIMINATION:
         return this.config.discriminationQuestions;
       case TestStage.CONFIRMATION:
         return this.config.confirmationQuestions;
       default:
         return 1;
     }
   }
   
   // 获取当前概率分布
   getCurrentProbabilities() {
     return {
       inner_motivation: { ...this.innerMotivationProbs },
       outer_behavior: { ...this.outerBehaviorProbs },
       current_phase: this.currentPhase,
       current_stage: this.currentStage
     };
   }
   
   // 获取详细统计信息
   getDetailedStats() {
     const innerQuestions = this.questionBank.filter(q => q.category === 'inner_motivation');
     const outerQuestions = this.questionBank.filter(q => q.category === 'outer_behavior');
     
     // 按子类别统计
     const innerSubcategories = this.groupBySubcategory(innerQuestions);
     const outerSubcategories = this.groupBySubcategory(outerQuestions);
     
     // 按测试阶段统计
     const stageDistribution = this.getStageDistribution();
     
     return {
       total: this.questionBank.length,
       by_category: {
         inner_motivation: innerQuestions.length,
         outer_behavior: outerQuestions.length
       },
       by_subcategory: {
         inner_motivation: innerSubcategories,
         outer_behavior: outerSubcategories
       },
       by_stage: stageDistribution,
       used: this.usedQuestions.size,
       remaining: this.questionBank.length - this.usedQuestions.size,
       current_phase: this.currentPhase,
       current_stage: this.currentStage
     };
   }
   
   private groupBySubcategory(questions: ExtendedQuestion[]): Record<string, number> {
     const groups: Record<string, number> = {};
     questions.forEach(q => {
       const subcategory = q.subcategory || 'unknown';
       groups[subcategory] = (groups[subcategory] || 0) + 1;
     });
     return groups;
   }
   
   private getStageDistribution(): Record<string, number> {
     const distribution: Record<string, number> = {
       exploration: 0,
       discrimination: 0,
       confirmation: 0,
       unknown: 0
     };
     
     this.questionBank.forEach(q => {
       const stage = q.test_stage || 'unknown';
       distribution[stage]++;
     });
     
     return distribution;
   }
   
   // 重置引擎
   reset() {
     this.usedQuestions.clear();
     this.currentPhase = 'inner_motivation';
     this.currentStage = TestStage.EXPLORATION;
     this.phaseQuestionCount = 0;
     this.stageQuestionCount = 0;
     this.innerMotivationProbs = {
      qian: 0.125, kun: 0.125, zhen: 0.125, xun: 0.125, kan: 0.125, li: 0.125, gen: 0.125, dui: 0.125
    };
    this.outerBehaviorProbs = {
      qian: 0.125, kun: 0.125, zhen: 0.125, xun: 0.125, kan: 0.125, li: 0.125, gen: 0.125, dui: 0.125
    };
     this.confidenceHistory = [];
     this.convergenceDetected = false;
     
     console.log('🔄 Enhanced Bayesian Engine reset');
   }
   
   // 获取问题库统计
   getQuestionBankStats() {
     return this.getDetailedStats();
   }
   
   // 配置更新
   updateConfig(newConfig: Partial<AdaptiveTestConfig>) {
     this.config = { ...this.config, ...newConfig };
     console.log('⚙️ Enhanced engine config updated:', this.config);
   }
   
   // 获取当前配置
  getConfig(): AdaptiveTestConfig {
    return { ...this.config };
  }
  
  // 获取当前自适应阶段
  getCurrentAdaptivePhase(): TestStage {
    return this.currentStage;
  }
  
  // 获取置信度指标
  getConfidenceMetrics() {
    const innerConfidence = Math.max(...Object.values(this.innerMotivationProbs));
    const outerConfidence = Math.max(...Object.values(this.outerBehaviorProbs));
    const overallConfidence = (innerConfidence + outerConfidence) / 2;
    
    return {
      inner_motivation: innerConfidence,
      outer_behavior: outerConfidence,
      overall: overallConfidence
    };
  }
  
  // 获取收敛分数
  getConvergenceScore(): number {
    const confidence = this.getConfidenceMetrics();
    const convergenceScore = Math.min(confidence.overall / this.config.convergenceThreshold, 1.0);
    return Math.round(convergenceScore * 100) / 100;
  }
  
  // 获取当前测试阶段
  getCurrentStage(): TestStage {
    return this.currentStage;
  }
  
  // 获取下一个测试阶段
  getNextStage(): TestStage {
    switch (this.currentStage) {
      case TestStage.EXPLORATION:
        return TestStage.DISCRIMINATION;
      case TestStage.DISCRIMINATION:
        return TestStage.CONFIRMATION;
      case TestStage.CONFIRMATION:
         return TestStage.CONFIRMATION; // 已经是最后阶段
       default:
         return TestStage.EXPLORATION;
    }
  }
}

// 导出增强版单例实例
export const enhancedBayesianEngine = new EnhancedBayesianEngine();

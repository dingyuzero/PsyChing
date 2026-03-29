import { Question, QuestionOption, TestPhase, ProbabilityMap, TestAnswer, TrigramType } from '../types';

// 八卦类型映射
export const TRIGRAM_TYPES: Record<TrigramType, string> = {
  qian: '乾',
  kun: '坤', 
  zhen: '震',
  xun: '巽',
  kan: '坎',
  li: '离',
  gen: '艮',
  dui: '兑'
};

// 内在动机类型（下卦）
export const INNER_MOTIVATION_TYPES: Record<TrigramType, string> = {
  qian: '成就动机',
  kun: '安全动机',
  zhen: '创新动机', 
  xun: '适应动机',
  kan: '成长动机',
  li: '意义动机',
  gen: '持守动机',
  dui: '联结动机'
};

// 外在行为类型（上卦）
export const OUTER_BEHAVIOR_TYPES: Record<TrigramType, string> = {
  qian: '引领型',
  kun: '承载型',
  zhen: '激活型',
  xun: '渗透型', 
  kan: '深研型',
  li: '启迪型',
  gen: '屏障型',
  dui: '共鸣型'
};

// 贝叶斯自适应测试引擎
export class BayesianAdaptiveEngine {
  private questionBank: Question[] = [];
  private usedQuestions: Set<string> = new Set();
  private currentPhase: TestPhase = 'inner_motivation';
  private phaseQuestionCount = 0;
  private readonly questionsPerPhase = 5;
  
  // 加载状态
  private isLoading = false;
  private isLoaded = false;
  private loadError: string | null = null;
  private loadPromise: Promise<void> | null = null;
  
  // 概率分布
  private innerMotivationProbs: ProbabilityMap = this.initializeProbabilities();
  private outerBehaviorProbs: ProbabilityMap = this.initializeProbabilities();
  
  constructor() {
    this.loadPromise = this.loadQuestionBank();
  }
  
  private initializeProbabilities(): ProbabilityMap {
    return {
      qian: 0.125,
      kun: 0.125,
      zhen: 0.125,
      xun: 0.125,
      kan: 0.125,
      li: 0.125,
      gen: 0.125,
      dui: 0.125
    };
  }
  
  private async loadQuestionBank(): Promise<void> {
    if (this.isLoading || this.isLoaded) {
      console.log('Question bank already loading or loaded, skipping...');
      return this.loadPromise || Promise.resolve();
    }
    
    this.isLoading = true;
    this.loadError = null;
    
    try {
      console.log('🔄 Starting to load question bank from CSV...');
      console.log('📍 Fetching from URL: /question_bank.csv');
      
      const response = await fetch(`${import.meta.env.BASE_URL}question_bank.csv`);
      console.log('📡 Fetch response status:', response.status, response.statusText);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
      }
      
      const csvText = await response.text();
      console.log('📄 CSV text length:', csvText.length);
      console.log('📄 CSV first 200 characters:', csvText.substring(0, 200));
      
      this.parseCSV(csvText);
      
      if (this.questionBank.length === 0) {
        console.error('❌ No valid questions found in CSV file');
        throw new Error('No valid questions found in CSV file');
      }
      
      this.isLoaded = true;
      console.log(`✅ Successfully loaded ${this.questionBank.length} questions`);
      console.log('📊 Question bank stats:', this.getQuestionBankStats());
    } catch (error) {
      console.error('❌ Failed to load question bank:', error);
      console.error('🔍 Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      this.loadError = error instanceof Error ? error.message : 'Unknown error';
      console.log('🔄 Loading fallback questions...');
      this.loadFallbackQuestions();
      this.isLoaded = true;
    } finally {
      this.isLoading = false;
      console.log('🏁 Question bank loading process completed');
    }
  }
  
  private parseCSV(csvText: string) {
    console.log('🔍 Starting CSV parsing...');
    const lines = csvText.split('\n');
    console.log(`📄 Total lines in CSV: ${lines.length}`);
    
    if (lines.length === 0) {
      console.error('❌ CSV file is empty');
      return;
    }
    
    const headers = lines[0].split(',').map(h => h.trim());
    console.log(`📋 CSV headers (${headers.length}):`, headers);
    
    let validQuestions = 0;
    let skippedLines = 0;
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        console.log(`🔍 Processing line ${i + 1}: ${lines[i].substring(0, 100)}...`);
        const values = this.parseCSVLine(lines[i]);
        console.log(`📊 Parsed ${values.length} values from line ${i + 1}`);
        
        if (values.length >= headers.length) {
          const question = this.createQuestionFromCSV(headers, values);
          if (question) {
            this.questionBank.push(question);
            validQuestions++;
            console.log(`✅ Successfully created question: ${question.id} (${question.category})`);
          } else {
            console.warn(`⚠️ Failed to create question from line ${i + 1}`);
          }
        } else {
          console.warn(`⚠️ Line ${i + 1} has insufficient values: ${values.length} < ${headers.length}`);
          skippedLines++;
        }
      } else {
        skippedLines++;
      }
    }
    
    console.log(`📊 CSV parsing completed:`);
    console.log(`  ✅ Valid questions: ${validQuestions}`);
    console.log(`  ⚠️ Skipped lines: ${skippedLines}`);
    console.log(`  📄 Total processed lines: ${lines.length - 1}`);
  }
  
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }
  
  private createQuestionFromCSV(headers: string[], values: string[]): Question | null {
    try {
      const getField = (fieldName: string): string => {
        const index = headers.indexOf(fieldName);
        return index >= 0 ? values[index] : '';
      };
      
      const getCoeff = (fieldName: string): number => {
        const value = getField(fieldName);
        return parseFloat(value) || 0;
      };
      
      const category = getField('category') as TestPhase;
      if (!category || !['inner_motivation', 'outer_behavior'].includes(category)) {
        return null;
      }
      
      const options: QuestionOption[] = [
        {
          id: 'a',
          text_zh: getField('option_a_zh'),
          text_en: getField('option_a_en'),
          impact_coefficients: {
            qian: getCoeff('qian_coeff_a'),
            kun: getCoeff('kun_coeff_a'),
            zhen: getCoeff('zhen_coeff_a'),
            xun: getCoeff('xun_coeff_a'),
            kan: getCoeff('kan_coeff_a'),
            li: getCoeff('li_coeff_a'),
            gen: getCoeff('gen_coeff_a'),
            dui: getCoeff('dui_coeff_a')
          }
        },
        {
          id: 'b',
          text_zh: getField('option_b_zh'),
          text_en: getField('option_b_en'),
          impact_coefficients: {
            qian: getCoeff('qian_coeff_b'),
            kun: getCoeff('kun_coeff_b'),
            zhen: getCoeff('zhen_coeff_b'),
            xun: getCoeff('xun_coeff_b'),
            kan: getCoeff('kan_coeff_b'),
            li: getCoeff('li_coeff_b'),
            gen: getCoeff('gen_coeff_b'),
            dui: getCoeff('dui_coeff_b')
          }
        },
        {
          id: 'c',
          text_zh: getField('option_c_zh'),
          text_en: getField('option_c_en'),
          impact_coefficients: {
            qian: getCoeff('qian_coeff_c'),
            kun: getCoeff('kun_coeff_c'),
            zhen: getCoeff('zhen_coeff_c'),
            xun: getCoeff('xun_coeff_c'),
            kan: getCoeff('kan_coeff_c'),
            li: getCoeff('li_coeff_c'),
            gen: getCoeff('gen_coeff_c'),
            dui: getCoeff('dui_coeff_c')
          }
        },
        {
          id: 'd',
          text_zh: getField('option_d_zh'),
          text_en: getField('option_d_en'),
          impact_coefficients: {
            qian: getCoeff('qian_coeff_d'),
            kun: getCoeff('kun_coeff_d'),
            zhen: getCoeff('zhen_coeff_d'),
            xun: getCoeff('xun_coeff_d'),
            kan: getCoeff('kan_coeff_d'),
            li: getCoeff('li_coeff_d'),
            gen: getCoeff('gen_coeff_d'),
            dui: getCoeff('dui_coeff_d')
          }
        }
      ];
      
      return {
        id: getField('id'),
        category,
        content: getField('text_zh'),
        type: 'single_choice',
        dimension: category === 'inner_motivation' ? 'motivation' : 'behavior',
        text_zh: getField('text_zh'),
        text_en: getField('text_en'),
        options,
        difficulty: parseFloat(getField('difficulty')) || 0.5,
        usage_count: 0
      };
    } catch (error) {
      console.error('Error creating question from CSV:', error);
      return null;
    }
  }
  
  private loadFallbackQuestions() {
    // 备用问题库
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
        usage_count: 0
      },
      {
        id: 'outer_1',
        category: 'outer_behavior',
        content: '在团队中，你通常扮演什么角色？',
        type: 'single_choice',
        dimension: 'team_role',
        text_zh: '在团队中，你通常扮演什么角色？',
        text_en: 'What role do you usually play in a team?',
        options: [
          {
          id: 'a',
          text_zh: '主动承担领导责任',
          text_en: 'Actively take on leadership responsibilities',
          impact_coefficients: { qian: 0.9, kun: 0.2, zhen: 0.6, xun: 0.3, kan: 0.4, li: 0.7, gen: 0.5, dui: 0.3 }
        },
        {
          id: 'b',
          text_zh: '提供支持和帮助',
          text_en: 'Provide support and assistance',
          impact_coefficients: { qian: 0.3, kun: 0.9, zhen: 0.2, xun: 0.6, kan: 0.5, li: 0.4, gen: 0.7, dui: 0.8 }
        },
        {
          id: 'c',
          text_zh: '激发团队活力',
          text_en: 'Energize the team',
          impact_coefficients: { qian: 0.5, kun: 0.3, zhen: 0.9, xun: 0.4, kan: 0.3, li: 0.8, gen: 0.2, dui: 0.6 }
        },
        {
          id: 'd',
          text_zh: '深入分析问题',
          text_en: 'Analyze problems in depth',
          impact_coefficients: { qian: 0.4, kun: 0.4, zhen: 0.3, xun: 0.5, kan: 0.9, li: 0.5, gen: 0.8, dui: 0.2 }
        }
        ],
        difficulty: 0.7,
        usage_count: 0
      }
    ];
  }
  
  // 等待加载完成
  async waitForLoad(): Promise<void> {
    if (this.loadPromise) {
      await this.loadPromise;
    }
    
    if (this.loadError) {
      throw new Error(`Question bank loading failed: ${this.loadError}`);
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
  
  // 获取下一个最优问题
  getNextQuestion(language: 'zh' | 'en' = 'zh'): Question | null {
    // 检查是否已加载
    if (!this.isLoaded) {
      console.warn('Question bank not loaded yet');
      return null;
    }
    
    if (this.loadError) {
      console.error('Question bank loading failed:', this.loadError);
      return null;
    }
    
    // 检查是否需要切换阶段
    if (this.phaseQuestionCount >= this.questionsPerPhase) {
      if (this.currentPhase === 'inner_motivation') {
        this.currentPhase = 'outer_behavior';
        this.phaseQuestionCount = 0;
      } else {
        // 测试完成
        return null;
      }
    }
    
    // 获取当前阶段的可用问题
    const availableQuestions = this.questionBank.filter(q => 
      q.category === this.currentPhase && !this.usedQuestions.has(q.id)
    );
    
    if (availableQuestions.length === 0) {
      console.warn(`No available questions for phase: ${this.currentPhase}`);
      return null;
    }
    
    // 选择信息量最大的问题
    const bestQuestion = this.selectBestQuestion(availableQuestions);
    this.usedQuestions.add(bestQuestion.id);
    
    return bestQuestion;
  }
  
  private selectBestQuestion(questions: Question[]): Question {
    let bestQuestion = questions[0];
    let maxInformationGain = 0;
    
    for (const question of questions) {
      const informationGain = this.calculateInformationGain(question);
      if (informationGain > maxInformationGain) {
        maxInformationGain = informationGain;
        bestQuestion = question;
      }
    }
    
    return bestQuestion;
  }
  
  private calculateInformationGain(question: Question): number {
    const currentProbs = this.currentPhase === 'inner_motivation' 
      ? this.innerMotivationProbs 
      : this.outerBehaviorProbs;
    
    const currentEntropy = this.calculateEntropy(Object.values(currentProbs));
    
    // 计算每个选项的期望熵
    let expectedEntropy = 0;
    
    for (const option of question.options) {
      // 模拟选择该选项后的概率分布
      const simulatedProbs = { ...currentProbs };
      
      Object.keys(simulatedProbs).forEach(type => {
        const trigramType = type as TrigramType;
        simulatedProbs[trigramType] *= option.impact_coefficients[trigramType];
      });
      
      this.normalizeProbabilities(simulatedProbs);
      
      const optionEntropy = this.calculateEntropy(Object.values(simulatedProbs));
      expectedEntropy += 0.25 * optionEntropy; // 假设每个选项被选择的概率相等
    }
    
    return currentEntropy - expectedEntropy;
  }
  
  private calculateEntropy(probabilities: number[]): number {
    return -probabilities.reduce((entropy, p) => {
      return p > 0 ? entropy + p * Math.log2(p) : entropy;
    }, 0);
  }
  
  // 更新概率分布（贝叶斯更新）
  updateProbabilities(answer: TestAnswer) {
    const question = this.questionBank.find(q => q.id === answer.question_id);
    if (!question) return;
    
    const selectedOption = question.options.find(opt => opt.id === answer.option_id);
    if (!selectedOption) return;
    
    // 更新对应阶段的概率分布
    const targetProbs = question.category === 'inner_motivation' 
      ? this.innerMotivationProbs 
      : this.outerBehaviorProbs;
    
    // 贝叶斯更新
    Object.keys(targetProbs).forEach(type => {
      const trigramType = type as TrigramType;
      targetProbs[trigramType] *= selectedOption.impact_coefficients[trigramType];
    });
    
    // 归一化
    this.normalizeProbabilities(targetProbs);
    
    // 增加阶段问题计数
    this.phaseQuestionCount++;
    
    // 更新问题使用次数
    question.usage_count++;
  }
  
  private normalizeProbabilities(probabilities: ProbabilityMap) {
    const sum = Object.values(probabilities).reduce((a, b) => a + b, 0);
    if (sum > 0) {
      Object.keys(probabilities).forEach(key => {
        const trigramType = key as TrigramType;
        probabilities[trigramType] /= sum;
      });
    }
  }
  
  // 获取最终结果
  getFinalResult(): {
    inner_motivation: TrigramType;
    outer_behavior: TrigramType;
    probabilities: {
      inner_motivation: ProbabilityMap;
      outer_behavior: ProbabilityMap;
    }
  } {
    const topInnerMotivation = Object.entries(this.innerMotivationProbs)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0] as TrigramType;
    
    const topOuterBehavior = Object.entries(this.outerBehaviorProbs)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0] as TrigramType;
    
    return {
      inner_motivation: topInnerMotivation,
      outer_behavior: topOuterBehavior,
      probabilities: {
        inner_motivation: { ...this.innerMotivationProbs },
        outer_behavior: { ...this.outerBehaviorProbs }
      }
    };
  }
  
  // 获取当前进度
  getProgress() {
    const totalQuestions = this.questionsPerPhase * 2;
    const currentQuestions = this.currentPhase === 'inner_motivation' 
      ? this.phaseQuestionCount
      : this.questionsPerPhase + this.phaseQuestionCount;
    
    return {
      current: currentQuestions,
      total: totalQuestions,
      percentage: Math.round((currentQuestions / totalQuestions) * 100),
      phase: this.currentPhase,
      phaseProgress: {
        current: this.phaseQuestionCount,
        total: this.questionsPerPhase
      }
    };
  }
  
  // 获取当前概率分布
  getCurrentProbabilities() {
    return {
      inner_motivation: { ...this.innerMotivationProbs },
      outer_behavior: { ...this.outerBehaviorProbs }
    };
  }
  
  // 重置引擎
  reset() {
    this.usedQuestions.clear();
    this.currentPhase = 'inner_motivation';
    this.phaseQuestionCount = 0;
    this.innerMotivationProbs = this.initializeProbabilities();
    this.outerBehaviorProbs = this.initializeProbabilities();
  }
  
  // 获取问题库统计
  getQuestionBankStats() {
    const innerQuestions = this.questionBank.filter(q => q.category === 'inner_motivation');
    const outerQuestions = this.questionBank.filter(q => q.category === 'outer_behavior');
    
    return {
      total: this.questionBank.length,
      inner_motivation: innerQuestions.length,
      outer_behavior: outerQuestions.length,
      used: this.usedQuestions.size
    };
  }
}

// 导出单例实例
export const bayesianEngine = new BayesianAdaptiveEngine();

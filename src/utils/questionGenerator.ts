import { Question, TestResult, QuestionType } from '../types';

// 心理维度定义
export const MOTIVATION_DIMENSIONS = {
  achievement: '成就动机',
  security: '安全动机', 
  innovation: '创新动机',
  growth: '成长动机',
  harmony: '和谐动机',
  exploration: '探索动机',
  stability: '稳定动机',
  change: '变革动机'
} as const;

export const BEHAVIOR_DIMENSIONS = {
  leadership: '领导型',
  support: '支持型',
  expression: '表达型',
  cautious: '谨慎型',
  creation: '创造型',
  analysis: '分析型',
  coordination: '协调型',
  execution: '执行型'
} as const;

type MotivationDimension = keyof typeof MOTIVATION_DIMENSIONS;
type BehaviorDimension = keyof typeof BEHAVIOR_DIMENSIONS;

// 问题库接口
interface QuestionBankItem {
  id: string;
  category: 'inner_motivation' | 'outer_behavior';
  text_zh: string;
  text_en: string;
  option_a_zh: string;
  option_a_en: string;
  option_b_zh: string;
  option_b_en: string;
  option_c_zh: string;
  option_c_en: string;
  option_d_zh: string;
  option_d_en: string;
  difficulty: number;
  // 八卦系数
  qian_coeff_a: number;
  qian_coeff_b: number;
  qian_coeff_c: number;
  qian_coeff_d: number;
  kun_coeff_a: number;
  kun_coeff_b: number;
  kun_coeff_c: number;
  kun_coeff_d: number;
  zhen_coeff_a: number;
  zhen_coeff_b: number;
  zhen_coeff_c: number;
  zhen_coeff_d: number;
  xun_coeff_a: number;
  xun_coeff_b: number;
  xun_coeff_c: number;
  xun_coeff_d: number;
  kan_coeff_a: number;
  kan_coeff_b: number;
  kan_coeff_c: number;
  kan_coeff_d: number;
  li_coeff_a: number;
  li_coeff_b: number;
  li_coeff_c: number;
  li_coeff_d: number;
  gen_coeff_a: number;
  gen_coeff_b: number;
  gen_coeff_c: number;
  gen_coeff_d: number;
  dui_coeff_a: number;
  dui_coeff_b: number;
  dui_coeff_c: number;
  dui_coeff_d: number;
}

// 贝叶斯自适应问题生成器
export class BayesianAdaptiveQuestionGenerator {
  private questionBank: QuestionBankItem[] = [];
  private usedQuestions: Set<string> = new Set();
  private currentQuestionCount = 0;
  private maxQuestions = 10;
  
  // 动机类型概率分布
  private motivationProbabilities: Record<MotivationDimension, number> = {
    achievement: 0.125,
    security: 0.125,
    innovation: 0.125,
    growth: 0.125,
    harmony: 0.125,
    exploration: 0.125,
    stability: 0.125,
    change: 0.125
  };
  
  // 行为模式概率分布
  private behaviorProbabilities: Record<BehaviorDimension, number> = {
    leadership: 0.125,
    support: 0.125,
    expression: 0.125,
    cautious: 0.125,
    creation: 0.125,
    analysis: 0.125,
    coordination: 0.125,
    execution: 0.125
  };

  constructor() {
    this.loadQuestionBank();
  }

  private async loadQuestionBank() {
    try {
      const response = await fetch('/question_bank.csv');
      const csvText = await response.text();
      this.parseCSV(csvText);
    } catch (error) {
      console.error('Failed to load question bank:', error);
      // 使用备用问题库
      this.loadFallbackQuestions();
    }
  }

  private parseCSV(csvText: string) {
    console.log('Parsing CSV file...');
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    console.log(`CSV headers: ${headers.length}`);
    console.log('Headers:', headers);
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        // 处理CSV中的引号内容
        const values = this.parseCSVLine(lines[i]);
        
        console.log(`Line ${i}: ${values.length} values vs ${headers.length} headers`);
        
        if (values.length >= headers.length) {
          const item: any = {};
          headers.forEach((header, index) => {
            const value = values[index] || '';
            if (header.includes('coeff') || header === 'difficulty') {
              item[header] = parseFloat(value) || 0;
            } else {
              // 移除引号
              item[header] = value.replace(/^"|"$/g, '');
            }
          });
          this.questionBank.push(item as QuestionBankItem);
        } else {
          console.error(`Line ${i} has incorrect number of values: ${values.length} vs ${headers.length} expected`);
        }
      }
    }
    
    console.log(`Successfully loaded ${this.questionBank.length} questions`);
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
        current += char;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  private loadFallbackQuestions() {
    // 备用问题库（简化版）
    this.questionBank = [
      {
        id: 'inner_001',
        category: 'inner_motivation',
        text_zh: '面对新的挑战时，你的第一反应是什么？',
        text_en: 'When facing new challenges, what is your first reaction?',
        option_a_zh: '兴奋地接受挑战',
        option_a_en: 'Excitedly accept the challenge',
        option_b_zh: '仔细评估风险',
        option_b_en: 'Carefully assess the risks',
        option_c_zh: '寻求他人建议',
        option_c_en: 'Seek advice from others',
        option_d_zh: '制定详细计划',
        option_d_en: 'Make a detailed plan',
        difficulty: 0.85,
        qian_coeff_a: 0.9, qian_coeff_b: 0.1, qian_coeff_c: 0.2, qian_coeff_d: 0.3,
        kun_coeff_a: 0.1, kun_coeff_b: 0.8, kun_coeff_c: 0.3, kun_coeff_d: 0.2,
        zhen_coeff_a: 0.8, zhen_coeff_b: 0.2, zhen_coeff_c: 0.1, zhen_coeff_d: 0.3,
        xun_coeff_a: 0.3, xun_coeff_b: 0.7, xun_coeff_c: 0.2, xun_coeff_d: 0.1,
        kan_coeff_a: 0.2, kan_coeff_b: 0.6, kan_coeff_c: 0.8, kan_coeff_d: 0.1,
        li_coeff_a: 0.1, li_coeff_b: 0.2, li_coeff_c: 0.1, li_coeff_d: 0.8,
        gen_coeff_a: 0.6, gen_coeff_b: 0.2, gen_coeff_c: 0.2, gen_coeff_d: 0.1,
        dui_coeff_a: 0.8, dui_coeff_b: 0.6, dui_coeff_c: 0.2, dui_coeff_d: 0.2
      },
      {
        id: 'outer_001',
        category: 'outer_behavior',
        text_zh: '在团队中，你通常扮演什么角色？',
        text_en: 'What role do you usually play in a team?',
        option_a_zh: '主动承担领导责任',
        option_a_en: 'Actively take on leadership responsibilities',
        option_b_zh: '提供支持和帮助',
        option_b_en: 'Provide support and assistance',
        option_c_zh: '激发团队活力',
        option_c_en: 'Energize the team',
        option_d_zh: '深入分析问题',
        option_d_en: 'Analyze problems in depth',
        difficulty: 0.8,
        qian_coeff_a: 0.9, qian_coeff_b: 0.2, qian_coeff_c: 0.6, qian_coeff_d: 0.3,
        kun_coeff_a: 0.2, kun_coeff_b: 0.9, kun_coeff_c: 0.2, kun_coeff_d: 0.6,
        zhen_coeff_a: 0.6, zhen_coeff_b: 0.3, zhen_coeff_c: 0.9, zhen_coeff_d: 0.4,
        xun_coeff_a: 0.3, xun_coeff_b: 0.6, xun_coeff_c: 0.4, xun_coeff_d: 0.3,
        kan_coeff_a: 0.4, kan_coeff_b: 0.5, kan_coeff_c: 0.8, kan_coeff_d: 0.2,
        li_coeff_a: 0.7, li_coeff_b: 0.4, li_coeff_c: 0.2, li_coeff_d: 0.6,
        gen_coeff_a: 0.5, gen_coeff_b: 0.7, gen_coeff_c: 0.6, gen_coeff_d: 0.4,
        dui_coeff_a: 0.3, dui_coeff_b: 0.8, dui_coeff_c: 0.5, dui_coeff_d: 0.7
      }
      // 更多备用问题...
    ];
  }

  // 获取下一个最优问题
  getNextQuestion(language: 'zh' | 'en' = 'zh'): Question | null {
    console.log(`Getting next question. Current count: ${this.currentQuestionCount}, Max: ${this.maxQuestions}`);
    
    // 检查是否已达到最大题目数
    if (this.currentQuestionCount >= this.maxQuestions) {
      console.log('Reached maximum questions, returning null');
      return null;
    }

    // 选择信息量最大的问题
    const bestQuestion = this.selectBestQuestion();
    if (!bestQuestion) {
      console.log('No available questions, returning null');
      return null;
    }

    // 标记问题为已使用
    this.usedQuestions.add(bestQuestion.id);

    return {
      id: bestQuestion.id,
      category: bestQuestion.category,
      content: language === 'zh' ? bestQuestion.text_zh : bestQuestion.text_en,
      text_zh: bestQuestion.text_zh,
      text_en: bestQuestion.text_en,
      type: 'single_choice' as QuestionType,
      difficulty: bestQuestion.difficulty || 0.5,
      usage_count: 0,
      options: [
        {
          id: 'a',
          text_zh: bestQuestion.option_a_zh,
          text_en: bestQuestion.option_a_en,
          impact_coefficients: {
            qian: bestQuestion.qian_coeff_a || 0,
            kun: bestQuestion.kun_coeff_a || 0,
            zhen: bestQuestion.zhen_coeff_a || 0,
            xun: bestQuestion.xun_coeff_a || 0,
            kan: bestQuestion.kan_coeff_a || 0,
            li: bestQuestion.li_coeff_a || 0,
            gen: bestQuestion.gen_coeff_a || 0,
            dui: bestQuestion.dui_coeff_a || 0
          }
        },
        {
          id: 'b',
          text_zh: bestQuestion.option_b_zh,
          text_en: bestQuestion.option_b_en,
          impact_coefficients: {
            qian: bestQuestion.qian_coeff_b || 0,
            kun: bestQuestion.kun_coeff_b || 0,
            zhen: bestQuestion.zhen_coeff_b || 0,
            xun: bestQuestion.xun_coeff_b || 0,
            kan: bestQuestion.kan_coeff_b || 0,
            li: bestQuestion.li_coeff_b || 0,
            gen: bestQuestion.gen_coeff_b || 0,
            dui: bestQuestion.dui_coeff_b || 0
          }
        },
        {
          id: 'c',
          text_zh: bestQuestion.option_c_zh,
          text_en: bestQuestion.option_c_en,
          impact_coefficients: {
            qian: bestQuestion.qian_coeff_c || 0,
            kun: bestQuestion.kun_coeff_c || 0,
            zhen: bestQuestion.zhen_coeff_c || 0,
            xun: bestQuestion.xun_coeff_c || 0,
            kan: bestQuestion.kan_coeff_c || 0,
            li: bestQuestion.li_coeff_c || 0,
            gen: bestQuestion.gen_coeff_c || 0,
            dui: bestQuestion.dui_coeff_c || 0
          }
        },
        {
          id: 'd',
          text_zh: bestQuestion.option_d_zh,
          text_en: bestQuestion.option_d_en,
          impact_coefficients: {
            qian: bestQuestion.qian_coeff_d || 0,
            kun: bestQuestion.kun_coeff_d || 0,
            zhen: bestQuestion.zhen_coeff_d || 0,
            xun: bestQuestion.xun_coeff_d || 0,
            kan: bestQuestion.kan_coeff_d || 0,
            li: bestQuestion.li_coeff_d || 0,
            gen: bestQuestion.gen_coeff_d || 0,
            dui: bestQuestion.dui_coeff_d || 0
          }
        }
      ],
      dimension: bestQuestion.category === 'inner_motivation' ? 'motivation' : 'behavior'
    };
  }

  // 选择信息量最大的问题
  private selectBestQuestion(): QuestionBankItem | null {
    const availableQuestions = this.questionBank.filter(q => !this.usedQuestions.has(q.id));
    if (availableQuestions.length === 0) {
      return null;
    }

    // 计算每个问题的信息增益
    let bestQuestion = availableQuestions[0];
    let maxInformationGain = 0;

    for (const question of availableQuestions) {
      const informationGain = this.calculateInformationGain(question);
      if (informationGain > maxInformationGain) {
        maxInformationGain = informationGain;
        bestQuestion = question;
      }
    }

    return bestQuestion;
  }

  // 计算信息增益
  private calculateInformationGain(question: QuestionBankItem): number {
    const currentEntropy = question.category === 'inner_motivation' 
      ? this.calculateEntropy(Object.values(this.motivationProbabilities))
      : this.calculateEntropy(Object.values(this.behaviorProbabilities));
    
    // 简化的信息增益计算，基于区分度和当前概率分布的不确定性
    return question.difficulty * currentEntropy;
  }

  // 计算熵
  private calculateEntropy(probabilities: number[]): number {
    return -probabilities.reduce((entropy, p) => {
      return p > 0 ? entropy + p * Math.log2(p) : entropy;
    }, 0);
  }

  // 更新概率分布（贝叶斯更新）
  updateProbabilities(questionId: string, selectedOption: string) {
    const question = this.questionBank.find(q => q.id === questionId);
    if (!question) return;

    // 增加已回答题目计数
    this.currentQuestionCount++;
    console.log(`Updated question count to: ${this.currentQuestionCount}`);

    if (question.category === 'inner_motivation') {
      this.updateMotivationProbabilities(question, selectedOption);
    } else {
      this.updateBehaviorProbabilities(question, selectedOption);
    }
  }

  private updateMotivationProbabilities(question: QuestionBankItem, selectedOption: string) {
    const coeffKey = `${selectedOption}` as 'a' | 'b' | 'c' | 'd';
    
    // 更新每个维度的概率
    Object.keys(this.motivationProbabilities).forEach(dimension => {
      const coeffName = `${dimension}_coeff_${coeffKey}` as keyof QuestionBankItem;
      const coeff = question[coeffName] as number;
      this.motivationProbabilities[dimension as MotivationDimension] *= coeff;
    });

    // 归一化概率
    this.normalizeProbabilities(this.motivationProbabilities);
  }

  private updateBehaviorProbabilities(question: QuestionBankItem, selectedOption: string) {
    // 行为模式使用相同的系数结构，但映射到不同的维度
    const coeffKey = `${selectedOption}` as 'a' | 'b' | 'c' | 'd';
    const behaviorMapping: Record<string, BehaviorDimension> = {
      'achievement': 'leadership',
      'security': 'support', 
      'innovation': 'creation',
      'growth': 'analysis',
      'harmony': 'coordination',
      'exploration': 'expression',
      'stability': 'cautious',
      'change': 'execution'
    };

    Object.keys(this.behaviorProbabilities).forEach(dimension => {
      // 使用对应的动机维度系数
      const motivationDimension = Object.keys(behaviorMapping).find(k => behaviorMapping[k] === dimension) || 'achievement';
      const coeffName = `${motivationDimension}_coeff_${coeffKey}` as keyof QuestionBankItem;
      const coeff = question[coeffName] as number;
      this.behaviorProbabilities[dimension as BehaviorDimension] *= coeff;
    });

    this.normalizeProbabilities(this.behaviorProbabilities);
  }

  private normalizeProbabilities(probabilities: Record<string, number>) {
    const sum = Object.values(probabilities).reduce((a, b) => a + b, 0);
    if (sum > 0) {
      Object.keys(probabilities).forEach(key => {
        probabilities[key] /= sum;
      });
    }
  }

  // 获取最终结果
  getFinalResult(): { motivation: MotivationDimension; behavior: BehaviorDimension; probabilities: any } {
    const topMotivation = Object.entries(this.motivationProbabilities)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0] as MotivationDimension;
    
    const topBehavior = Object.entries(this.behaviorProbabilities)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0] as BehaviorDimension;

    return {
      motivation: topMotivation,
      behavior: topBehavior,
      probabilities: {
        motivation: { ...this.motivationProbabilities },
        behavior: { ...this.behaviorProbabilities }
      }
    };
  }

  // 获取进度
  getProgress() {
    const percentage = this.maxQuestions > 0 ? (this.currentQuestionCount / this.maxQuestions) * 100 : 0;
    return {
      current: this.currentQuestionCount,
      total: this.maxQuestions,
      percentage: Math.min(Math.round(percentage), 100)
    };
  }

  // 重置生成器
  reset() {
    this.usedQuestions.clear();
    this.currentQuestionCount = 0;
    
    // 重置概率分布为均匀分布
    Object.keys(this.motivationProbabilities).forEach(key => {
      this.motivationProbabilities[key as MotivationDimension] = 0.125;
    });
    
    Object.keys(this.behaviorProbabilities).forEach(key => {
      this.behaviorProbabilities[key as BehaviorDimension] = 0.125;
    });
  }

  // 获取当前概率分布（用于调试）
  getCurrentProbabilities() {
    return {
      motivation: { ...this.motivationProbabilities },
      behavior: { ...this.behaviorProbabilities }
    };
  }
}

// 导出单例实例
export const questionGenerator = new BayesianAdaptiveQuestionGenerator();
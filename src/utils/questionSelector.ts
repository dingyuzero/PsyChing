import { ExtendedQuestion, AdaptiveTestPhase } from './enhancedBayesianEngine';
import { TestPhase, ProbabilityMap, TrigramType } from '../types';

// 题目选择策略基类
abstract class QuestionSelectionStrategy {
  abstract selectQuestion(questions: ExtendedQuestion[], context: SelectionContext): ExtendedQuestion;
  abstract getName(): string;
  abstract getDescription(): string;
  
  // 共享的辅助方法
  protected calculateInformationGain(question: ExtendedQuestion, context: SelectionContext): number {
    const currentEntropy = this.calculateEntropy(Object.values(context.currentProbabilities));
    
    let expectedEntropy = 0;
    for (const option of question.options) {
      const simulatedProbs = { ...context.currentProbabilities };
      
      Object.keys(simulatedProbs).forEach(type => {
        const trigramType = type as TrigramType;
        simulatedProbs[trigramType] *= option.impact_coefficients[trigramType];
      });
      
      this.normalizeProbabilities(simulatedProbs);
      const optionEntropy = this.calculateEntropy(Object.values(simulatedProbs));
      expectedEntropy += 0.25 * optionEntropy;
    }
    
    return Math.max(0, currentEntropy - expectedEntropy);
  }
  
  protected calculateEntropy(probabilities: number[]): number {
    return -probabilities.reduce((entropy, p) => {
      return p > 0 ? entropy + p * Math.log2(p) : entropy;
    }, 0);
  }
  
  protected normalizeProbabilities(probabilities: ProbabilityMap): void {
    const sum = Object.values(probabilities).reduce((a, b) => a + b, 0);
    if (sum > 0) {
      Object.keys(probabilities).forEach(key => {
        const trigramType = key as TrigramType;
        probabilities[trigramType] /= sum;
      });
    }
  }
  
  protected getTopProbabilityTypes(probabilities: ProbabilityMap, count: number): string[] {
    return Object.entries(probabilities)
      .sort(([, a], [, b]) => b - a)
      .slice(0, count)
      .map(([type]) => type);
  }
}

// 选择上下文
interface SelectionContext {
  currentPhase: TestPhase;
  adaptivePhase: AdaptiveTestPhase;
  phaseQuestionCount: number;
  totalQuestionCount: number;
  currentProbabilities: ProbabilityMap;
  confidenceLevel: number;
  usedQuestions: Set<string>;
  answerHistory: any[];
}

// 题目评分结果
interface QuestionScore {
  question: ExtendedQuestion;
  totalScore: number;
  scores: {
    informationGain: number;
    informationValue: number;
    usageFrequency: number;
    phaseRelevance: number;
    discriminationPower: number;
    adaptiveBonus: number;
  };
  reasoning: string;
}

// 探索阶段选择策略
class ExplorationStrategy extends QuestionSelectionStrategy {
  getName(): string {
    return 'Exploration Strategy';
  }
  
  getDescription(): string {
    return '探索阶段策略：优先选择信息价值高、覆盖面广的题目，快速探索各个维度';
  }
  
  selectQuestion(questions: ExtendedQuestion[], context: SelectionContext): ExtendedQuestion {
    const scores = questions.map(q => this.calculateExplorationScore(q, context));
    scores.sort((a, b) => b.totalScore - a.totalScore);
    
    console.log(`🔍 Exploration phase - Selected question: ${scores[0].question.id} (score: ${scores[0].totalScore.toFixed(3)})`);
    console.log(`📊 Reasoning: ${scores[0].reasoning}`);
    
    return scores[0].question;
  }
  
  private calculateExplorationScore(question: ExtendedQuestion, context: SelectionContext): QuestionScore {
    const scores = {
      informationGain: this.calculateInformationGain(question, context) * 0.35,
      informationValue: question.information_value * 0.30,
      usageFrequency: (1 - Math.min((question.usage_count || 0) / 50, 1)) * 0.20,
      phaseRelevance: this.calculatePhaseRelevance(question, context) * 0.10,
      discriminationPower: 0, // 探索阶段不考虑区分能力
      adaptiveBonus: this.calculateAdaptiveBonus(question, context) * 0.05
    };
    
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    const reasoning = `高信息价值(${question.information_value.toFixed(2)})，低使用频率(${question.usage_count || 0})，适合探索阶段`;
    
    return {
      question,
      totalScore,
      scores,
      reasoning
    };
  }
  

  
  private calculatePhaseRelevance(question: ExtendedQuestion, context: SelectionContext): number {
    if (question.test_stage === context.adaptivePhase) {
      return 1.0;
    }
    return question.information_value; // 探索阶段主要看信息价值
  }
  
  private calculateAdaptiveBonus(question: ExtendedQuestion, context: SelectionContext): number {
    // 探索阶段的自适应奖励：偏好未被充分探索的维度
    const probValues = Object.values(context.currentProbabilities);
    const maxProb = Math.max(...probValues);
    const minProb = Math.min(...probValues);
    
    // 如果概率分布比较均匀，给予奖励
    const uniformityBonus = 1 - (maxProb - minProb);
    return uniformityBonus * 0.5;
  }
}

// 区分阶段选择策略
class DiscriminationStrategy extends QuestionSelectionStrategy {
  getName(): string {
    return 'Discrimination Strategy';
  }
  
  getDescription(): string {
    return '区分阶段策略：重点选择能够区分相似类型的题目，提高分类精度';
  }
  
  selectQuestion(questions: ExtendedQuestion[], context: SelectionContext): ExtendedQuestion {
    const scores = questions.map(q => this.calculateDiscriminationScore(q, context));
    scores.sort((a, b) => b.totalScore - a.totalScore);
    
    console.log(`🎯 Discrimination phase - Selected question: ${scores[0].question.id} (score: ${scores[0].totalScore.toFixed(3)})`);
    console.log(`📊 Reasoning: ${scores[0].reasoning}`);
    
    return scores[0].question;
  }
  
  private calculateDiscriminationScore(question: ExtendedQuestion, context: SelectionContext): QuestionScore {
    const discriminationPower = this.calculateDiscriminationPower(question, context);
    
    const scores = {
      informationGain: this.calculateInformationGain(question, context) * 0.25,
      informationValue: question.information_value * 0.20,
      usageFrequency: (1 - Math.min((question.usage_count || 0) / 50, 1)) * 0.15,
      phaseRelevance: this.calculatePhaseRelevance(question, context) * 0.15,
      discriminationPower: discriminationPower * 0.20,
      adaptiveBonus: this.calculateAdaptiveBonus(question, context) * 0.05
    };
    
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    const topTypes = this.getTopProbabilityTypes(context.currentProbabilities, 2);
    const reasoning = `强区分能力(${discriminationPower.toFixed(2)})，能区分${topTypes.join('和')}类型`;
    
    return {
      question,
      totalScore,
      scores,
      reasoning
    };
  }
  
  private calculateDiscriminationPower(question: ExtendedQuestion, context: SelectionContext): number {
    // 找出概率最高的几个类型
    const topTypes = this.getTopProbabilityTypes(context.currentProbabilities, 3);
    
    // 检查问题是否能有效区分这些类型
    let discriminationScore = 0;
    
    // 方法1：检查区分目标
    const targets = question.discrimination_target ? question.discrimination_target.split(',') : [];
    const targetMatches = targets.filter(target => 
      topTypes.includes(target)
    ).length;
    discriminationScore += targetMatches * 0.3;
    
    // 方法2：计算选项间的系数差异
    const coeffVariances = topTypes.map(type => {
      const trigramType = type as TrigramType;
      const coeffs = question.options.map(opt => opt.impact_coefficients[trigramType]);
      return this.calculateVariance(coeffs);
    });
    
    const avgVariance = coeffVariances.reduce((sum, v) => sum + v, 0) / coeffVariances.length;
    discriminationScore += Math.min(avgVariance * 2, 0.7); // 归一化到0-0.7
    
    return Math.min(discriminationScore, 1.0);
  }
  
  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }
  

  
  private calculatePhaseRelevance(question: ExtendedQuestion, context: SelectionContext): number {
    if (question.test_stage === 'discrimination') {
      return 1.0;
    }
    
    // 检查是否与当前需要区分的类型相关
    const topTypes = this.getTopProbabilityTypes(context.currentProbabilities, 2);
    const targets2 = question.discrimination_target ? question.discrimination_target.split(',') : [];
    const isRelevant = targets2.some(target => topTypes.includes(target));
    
    return isRelevant ? 0.8 : 0.3;
  }
  
  private calculateAdaptiveBonus(question: ExtendedQuestion, context: SelectionContext): number {
    // 区分阶段的自适应奖励：偏好能够快速收敛的题目
    const probValues = Object.values(context.currentProbabilities);
    const maxProb = Math.max(...probValues);
    
    // 如果已经有明显的倾向，给予能够确认或推翻的题目更高分数
    if (maxProb > 0.4) {
      return 0.8;
    }
    
    return 0.3;
  }
}

// 确认阶段选择策略
class ConfirmationStrategy extends QuestionSelectionStrategy {
  getName(): string {
    return 'Confirmation Strategy';
  }
  
  getDescription(): string {
    return '确认阶段策略：选择高信息价值的题目来确认最终结果，提高置信度';
  }
  
  selectQuestion(questions: ExtendedQuestion[], context: SelectionContext): ExtendedQuestion {
    const scores = questions.map(q => this.calculateConfirmationScore(q, context));
    scores.sort((a, b) => b.totalScore - a.totalScore);
    
    console.log(`✅ Confirmation phase - Selected question: ${scores[0].question.id} (score: ${scores[0].totalScore.toFixed(3)})`);
    console.log(`📊 Reasoning: ${scores[0].reasoning}`);
    
    return scores[0].question;
  }
  
  private calculateConfirmationScore(question: ExtendedQuestion, context: SelectionContext): QuestionScore {
    const confirmationPower = this.calculateConfirmationPower(question, context);
    
    const scores = {
      informationGain: this.calculateInformationGain(question, context) * 0.30,
      informationValue: question.information_value * 0.35,
      usageFrequency: (1 - Math.min((question.usage_count || 0) / 50, 1)) * 0.10,
      phaseRelevance: this.calculatePhaseRelevance(question, context) * 0.15,
      discriminationPower: 0, // 确认阶段不需要区分
      adaptiveBonus: confirmationPower * 0.10
    };
    
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    const topType = this.getTopProbabilityTypes(context.currentProbabilities, 1)[0];
    const reasoning = `高确认能力(${confirmationPower.toFixed(2)})，能够确认${topType}类型的结果`;
    
    return {
      question,
      totalScore,
      scores,
      reasoning
    };
  }
  
  private calculateConfirmationPower(question: ExtendedQuestion, context: SelectionContext): number {
    // 找出概率最高的类型
    const topType = this.getTopProbabilityTypes(context.currentProbabilities, 1)[0] as TrigramType;
    
    // 计算该题目对最高概率类型的确认能力
    const topTypeCoeffs = question.options.map(opt => opt.impact_coefficients[topType]);
    const maxCoeff = Math.max(...topTypeCoeffs);
    const minCoeff = Math.min(...topTypeCoeffs);
    
    // 系数差异越大，确认能力越强
    const confirmationPower = (maxCoeff - minCoeff) * question.information_value;
    
    return Math.min(confirmationPower, 1.0);
  }
  

  
  private calculatePhaseRelevance(question: ExtendedQuestion, context: SelectionContext): number {
    if (question.test_stage === 'confirmation') {
      return 1.0;
    }
    
    // 确认阶段偏好高信息价值的题目
    return question.information_value > 0.7 ? 0.9 : 0.4;
  }
}

// 智能题目选择器
export class IntelligentQuestionSelector {
  private strategies: Map<AdaptiveTestPhase, QuestionSelectionStrategy>;
  private selectionHistory: {
    questionId: string;
    strategy: string;
    score: number;
    reasoning: string;
    timestamp: number;
  }[] = [];
  
  constructor() {
    this.strategies = new Map();
    this.strategies.set('exploration', new ExplorationStrategy());
    this.strategies.set('discrimination', new DiscriminationStrategy());
    this.strategies.set('confirmation', new ConfirmationStrategy());
  }
  
  // 选择最优题目
  selectOptimalQuestion(
    availableQuestions: ExtendedQuestion[],
    context: SelectionContext
  ): ExtendedQuestion {
    if (availableQuestions.length === 0) {
      throw new Error('No available questions to select from');
    }
    
    if (availableQuestions.length === 1) {
      return availableQuestions[0];
    }
    
    const strategy = this.strategies.get(context.adaptivePhase);
    if (!strategy) {
      throw new Error(`No strategy found for adaptive phase: ${context.adaptivePhase}`);
    }
    
    console.log(`🎯 Using ${strategy.getName()} for question selection`);
    console.log(`📋 Available questions: ${availableQuestions.length}`);
    console.log(`📊 Current confidence: ${context.confidenceLevel.toFixed(3)}`);
    
    const selectedQuestion = strategy.selectQuestion(availableQuestions, context);
    
    // 记录选择历史
    this.selectionHistory.push({
      questionId: selectedQuestion.id,
      strategy: strategy.getName(),
      score: 0, // 这里可以添加具体的分数
      reasoning: `Selected using ${strategy.getName()}`,
      timestamp: Date.now()
    });
    
    return selectedQuestion;
  }
  
  // 获取策略信息
  getStrategyInfo(phase: AdaptiveTestPhase): { name: string; description: string } {
    const strategy = this.strategies.get(phase);
    if (!strategy) {
      return { name: 'Unknown', description: 'No strategy available' };
    }
    
    return {
      name: strategy.getName(),
      description: strategy.getDescription()
    };
  }
  
  // 获取选择历史
  getSelectionHistory(): typeof this.selectionHistory {
    return [...this.selectionHistory];
  }
  
  // 获取策略统计
  getStrategyStatistics(): {
    totalSelections: number;
    strategyUsage: Record<string, number>;
    averageSelectionTime: number;
  } {
    const totalSelections = this.selectionHistory.length;
    const strategyUsage: Record<string, number> = {};
    let totalTime = 0;
    
    for (let i = 0; i < this.selectionHistory.length; i++) {
      const record = this.selectionHistory[i];
      strategyUsage[record.strategy] = (strategyUsage[record.strategy] || 0) + 1;
      
      if (i > 0) {
        totalTime += record.timestamp - this.selectionHistory[i - 1].timestamp;
      }
    }
    
    const averageSelectionTime = totalSelections > 1 ? totalTime / (totalSelections - 1) : 0;
    
    return {
      totalSelections,
      strategyUsage,
      averageSelectionTime
    };
  }
  
  // 重置选择器
  reset(): void {
    this.selectionHistory = [];
  }
  
  // 分析题目质量
  analyzeQuestionQuality(
    questions: ExtendedQuestion[],
    context: SelectionContext
  ): {
    totalQuestions: number;
    highQualityQuestions: number;
    averageInformationValue: number;
    phaseDistribution: Record<AdaptiveTestPhase, number>;
    recommendations: string[];
  } {
    const totalQuestions = questions.length;
    const highQualityQuestions = questions.filter(q => q.information_value > 0.7).length;
    const averageInformationValue = questions.reduce((sum, q) => sum + q.information_value, 0) / totalQuestions;
    
    const phaseDistribution: Record<AdaptiveTestPhase, number> = {
      exploration: 0,
      discrimination: 0,
      confirmation: 0
    };
    
    questions.forEach(q => {
      if (q.test_stage) {
        phaseDistribution[q.test_stage as AdaptiveTestPhase]++;
      }
    });
    
    const recommendations: string[] = [];
    
    if (highQualityQuestions / totalQuestions < 0.3) {
      recommendations.push('建议增加更多高信息价值的题目（>0.7）');
    }
    
    if (phaseDistribution.discrimination < totalQuestions * 0.2) {
      recommendations.push('建议增加更多区分阶段的题目');
    }
    
    if (averageInformationValue < 0.5) {
      recommendations.push('整体题目信息价值偏低，建议优化题目设计');
    }
    
    return {
      totalQuestions,
      highQualityQuestions,
      averageInformationValue,
      phaseDistribution,
      recommendations
    };
  }
}

// 导出单例实例
export const intelligentQuestionSelector = new IntelligentQuestionSelector();
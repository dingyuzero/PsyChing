import { TrigramType, ProbabilityMap } from '../types';
import { ExtendedQuestion, TestStage, InformationGainResult } from './enhancedBayesianEngine';

// 信息增益计算器配置
export interface InformationGainConfig {
  entropyMethod: 'shannon' | 'gini' | 'classification_error';
  optionWeighting: 'uniform' | 'historical' | 'adaptive';
  uncertaintyPenalty: number;
  diversityBonus: number;
}

// 详细的信息增益分析结果
export interface DetailedInformationGain extends InformationGainResult {
  entropyReduction: number;
  uncertaintyReduction: number;
  discriminationScore: number;
  diversityScore: number;
  optionAnalysis: OptionAnalysis[];
  recommendation: 'high' | 'medium' | 'low';
  reasoning: string;
}

// 选项分析结果
export interface OptionAnalysis {
  optionId: string;
  expectedProbability: number;
  entropyAfterSelection: number;
  informationContribution: number;
  discriminationPower: number;
  trigramImpacts: Record<TrigramType, number>;
}

// 批量分析结果
export interface BatchAnalysisResult {
  questions: DetailedInformationGain[];
  rankings: {
    byInformationGain: string[];
    byDiscrimination: string[];
    byDiversity: string[];
    byRecommendation: string[];
  };
  summary: {
    averageInformationGain: number;
    bestQuestion: string;
    worstQuestion: string;
    recommendedCount: number;
  };
}

// 高级信息增益计算器
export class InformationGainCalculator {
  private config: InformationGainConfig;
  private historicalData: Map<string, number[]> = new Map();
  
  constructor(config?: Partial<InformationGainConfig>) {
    this.config = {
      entropyMethod: 'shannon',
      optionWeighting: 'uniform',
      uncertaintyPenalty: 0.1,
      diversityBonus: 0.05,
      ...config
    };
  }
  
  // 计算单个问题的详细信息增益
  calculateDetailedInformationGain(
    question: ExtendedQuestion,
    currentProbabilities: ProbabilityMap,
    stage: TestStage
  ): DetailedInformationGain {
    const currentEntropy = this.calculateEntropy(Object.values(currentProbabilities));
    const optionAnalyses = this.analyzeOptions(question, currentProbabilities);
    
    // 计算期望熵
    const expectedEntropy = this.calculateExpectedEntropy(optionAnalyses);
    const informationGain = currentEntropy - expectedEntropy;
    
    // 计算额外指标
    const entropyReduction = informationGain / currentEntropy;
    const uncertaintyReduction = this.calculateUncertaintyReduction(currentProbabilities, optionAnalyses);
    const discriminationScore = this.calculateDiscriminationScore(optionAnalyses);
    const diversityScore = this.calculateDiversityScore(optionAnalyses);
    
    // 综合评分和推荐
    const { recommendation, reasoning } = this.generateRecommendation(
      informationGain,
      discriminationScore,
      diversityScore,
      stage
    );
    
    return {
      questionId: question.id,
      informationGain,
      expectedEntropy,
      currentEntropy,
      stage,
      entropyReduction,
      uncertaintyReduction,
      discriminationScore,
      diversityScore,
      optionAnalysis: optionAnalyses,
      recommendation,
      reasoning
    };
  }
  
  // 批量分析多个问题
  batchAnalyze(
    questions: ExtendedQuestion[],
    currentProbabilities: ProbabilityMap,
    stage: TestStage
  ): BatchAnalysisResult {
    const analyses = questions.map(q => 
      this.calculateDetailedInformationGain(q, currentProbabilities, stage)
    );
    
    // 生成排名
    const rankings = {
      byInformationGain: this.rankByMetric(analyses, 'informationGain'),
      byDiscrimination: this.rankByMetric(analyses, 'discriminationScore'),
      byDiversity: this.rankByMetric(analyses, 'diversityScore'),
      byRecommendation: this.rankByRecommendation(analyses)
    };
    
    // 生成摘要
    const summary = this.generateSummary(analyses);
    
    return {
      questions: analyses,
      rankings,
      summary
    };
  }
  
  private analyzeOptions(
    question: ExtendedQuestion,
    currentProbabilities: ProbabilityMap
  ): OptionAnalysis[] {
    const optionProbabilities = this.estimateOptionProbabilities(question);
    
    return question.options.map((option, index) => {
      const expectedProbability = optionProbabilities[index];
      
      // 模拟选择该选项后的概率分布
      const simulatedProbs = { ...currentProbabilities };
      Object.keys(simulatedProbs).forEach(type => {
        const trigramType = type as TrigramType;
        simulatedProbs[trigramType] *= option.impact_coefficients[trigramType];
      });
      
      this.normalizeProbabilities(simulatedProbs);
      
      const entropyAfterSelection = this.calculateEntropy(Object.values(simulatedProbs));
      const informationContribution = expectedProbability * entropyAfterSelection;
      const discriminationPower = this.calculateOptionDiscriminationPower(option.impact_coefficients);
      
      return {
        optionId: option.id,
        expectedProbability,
        entropyAfterSelection,
        informationContribution,
        discriminationPower,
        trigramImpacts: { ...option.impact_coefficients }
      };
    });
  }
  
  private calculateExpectedEntropy(optionAnalyses: OptionAnalysis[]): number {
    return optionAnalyses.reduce((sum, analysis) => 
      sum + analysis.informationContribution, 0
    );
  }
  
  private calculateUncertaintyReduction(
    currentProbabilities: ProbabilityMap,
    optionAnalyses: OptionAnalysis[]
  ): number {
    const currentUncertainty = this.calculateUncertainty(currentProbabilities);
    
    const expectedUncertainty = optionAnalyses.reduce((sum, analysis) => {
      // 这里需要重建概率分布来计算不确定性
      // 简化计算：使用熵作为不确定性的代理
      return sum + analysis.expectedProbability * analysis.entropyAfterSelection;
    }, 0);
    
    return (currentUncertainty - expectedUncertainty) / currentUncertainty;
  }
  
  private calculateDiscriminationScore(optionAnalyses: OptionAnalysis[]): number {
    // 计算选项间的区分度
    const discriminationPowers = optionAnalyses.map(a => a.discriminationPower);
    const avgDiscrimination = discriminationPowers.reduce((sum, power) => sum + power, 0) / discriminationPowers.length;
    const variance = this.calculateVariance(discriminationPowers);
    
    // 高方差表示选项间区分度大
    return avgDiscrimination + variance;
  }
  
  private calculateDiversityScore(optionAnalyses: OptionAnalysis[]): number {
    // 计算选项的多样性分数
    const entropies = optionAnalyses.map(a => a.entropyAfterSelection);
    const diversityEntropy = this.calculateEntropy(
      optionAnalyses.map(a => a.expectedProbability)
    );
    
    return diversityEntropy + this.calculateVariance(entropies);
  }
  
  private calculateOptionDiscriminationPower(coefficients: Record<TrigramType, number>): number {
    const values = Object.values(coefficients);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    return variance;
  }
  
  private generateRecommendation(
    informationGain: number,
    discriminationScore: number,
    diversityScore: number,
    stage: TestStage
  ): { recommendation: 'high' | 'medium' | 'low'; reasoning: string } {
    // 根据测试阶段调整权重
    const weights = this.getStageWeights(stage);
    
    const compositeScore = 
      informationGain * weights.informationGain +
      discriminationScore * weights.discrimination +
      diversityScore * weights.diversity;
    
    let recommendation: 'high' | 'medium' | 'low';
    let reasoning: string;
    
    if (compositeScore > 0.7) {
      recommendation = 'high';
      reasoning = `高信息增益 (${informationGain.toFixed(3)})，适合当前${stage}阶段`;
    } else if (compositeScore > 0.4) {
      recommendation = 'medium';
      reasoning = `中等信息增益 (${informationGain.toFixed(3)})，可考虑使用`;
    } else {
      recommendation = 'low';
      reasoning = `低信息增益 (${informationGain.toFixed(3)})，不推荐当前使用`;
    }
    
    return { recommendation, reasoning };
  }
  
  private getStageWeights(stage: TestStage): Record<string, number> {
    switch (stage) {
      case TestStage.EXPLORATION:
        return { informationGain: 0.6, discrimination: 0.2, diversity: 0.2 };
      case TestStage.DISCRIMINATION:
        return { informationGain: 0.3, discrimination: 0.6, diversity: 0.1 };
      case TestStage.CONFIRMATION:
        return { informationGain: 0.2, discrimination: 0.7, diversity: 0.1 };
      default:
        return { informationGain: 0.5, discrimination: 0.3, diversity: 0.2 };
    }
  }
  
  private rankByMetric(
    analyses: DetailedInformationGain[],
    metric: keyof DetailedInformationGain
  ): string[] {
    return analyses
      .sort((a, b) => (b[metric] as number) - (a[metric] as number))
      .map(a => a.questionId);
  }
  
  private rankByRecommendation(analyses: DetailedInformationGain[]): string[] {
    const scoreMap = { high: 3, medium: 2, low: 1 };
    return analyses
      .sort((a, b) => scoreMap[b.recommendation] - scoreMap[a.recommendation])
      .map(a => a.questionId);
  }
  
  private generateSummary(analyses: DetailedInformationGain[]) {
    const informationGains = analyses.map(a => a.informationGain);
    const averageInformationGain = informationGains.reduce((sum, gain) => sum + gain, 0) / informationGains.length;
    
    const bestAnalysis = analyses.reduce((best, current) => 
      current.informationGain > best.informationGain ? current : best
    );
    
    const worstAnalysis = analyses.reduce((worst, current) => 
      current.informationGain < worst.informationGain ? current : worst
    );
    
    const recommendedCount = analyses.filter(a => a.recommendation === 'high').length;
    
    return {
      averageInformationGain,
      bestQuestion: bestAnalysis.questionId,
      worstQuestion: worstAnalysis.questionId,
      recommendedCount
    };
  }
  
  // 熵计算方法
  private calculateEntropy(probabilities: number[]): number {
    switch (this.config.entropyMethod) {
      case 'shannon':
        return this.calculateShannonEntropy(probabilities);
      case 'gini':
        return this.calculateGiniImpurity(probabilities);
      case 'classification_error':
        return this.calculateClassificationError(probabilities);
      default:
        return this.calculateShannonEntropy(probabilities);
    }
  }
  
  private calculateShannonEntropy(probabilities: number[]): number {
    return -probabilities.reduce((entropy, p) => {
      return p > 0 ? entropy + p * Math.log2(p) : entropy;
    }, 0);
  }
  
  private calculateGiniImpurity(probabilities: number[]): number {
    return 1 - probabilities.reduce((sum, p) => sum + p * p, 0);
  }
  
  private calculateClassificationError(probabilities: number[]): number {
    const maxProb = Math.max(...probabilities);
    return 1 - maxProb;
  }
  
  private calculateUncertainty(probabilities: ProbabilityMap): number {
    // 使用香农熵作为不确定性度量
    return this.calculateShannonEntropy(Object.values(probabilities));
  }
  
  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  }
  
  private estimateOptionProbabilities(question: ExtendedQuestion): number[] {
    switch (this.config.optionWeighting) {
      case 'uniform':
        return new Array(question.options.length).fill(1 / question.options.length);
      case 'historical':
        return this.getHistoricalProbabilities(question.id) || 
               new Array(question.options.length).fill(1 / question.options.length);
      case 'adaptive':
        return this.calculateAdaptiveProbabilities(question);
      default:
        return new Array(question.options.length).fill(1 / question.options.length);
    }
  }
  
  private getHistoricalProbabilities(questionId: string): number[] | null {
    return this.historicalData.get(questionId) || null;
  }
  
  private calculateAdaptiveProbabilities(question: ExtendedQuestion): number[] {
    // 基于问题特征计算自适应概率
    // 这里可以根据问题的难度、复杂度等因素调整
    const baseProb = 1 / question.options.length;
    const difficulty = question.difficulty || 0.5;
    
    // 难度越高，选项概率分布越不均匀
    const adjustment = (difficulty - 0.5) * 0.2;
    
    return question.options.map((_, index) => {
      const randomAdjustment = (Math.random() - 0.5) * adjustment;
      return Math.max(0.05, Math.min(0.95, baseProb + randomAdjustment));
    });
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
  
  // 更新历史数据
  updateHistoricalData(questionId: string, optionProbabilities: number[]) {
    this.historicalData.set(questionId, optionProbabilities);
  }
  
  // 获取配置
  getConfig(): InformationGainConfig {
    return { ...this.config };
  }
  
  // 更新配置
  updateConfig(newConfig: Partial<InformationGainConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

// 导出默认实例
export const informationGainCalculator = new InformationGainCalculator();

// 导出便捷函数
export function calculateQuestionInformationGain(
  question: ExtendedQuestion,
  currentProbabilities: ProbabilityMap,
  stage: TestStage,
  config?: Partial<InformationGainConfig>
): DetailedInformationGain {
  const calculator = new InformationGainCalculator(config);
  return calculator.calculateDetailedInformationGain(question, currentProbabilities, stage);
}

export function batchAnalyzeQuestions(
  questions: ExtendedQuestion[],
  currentProbabilities: ProbabilityMap,
  stage: TestStage,
  config?: Partial<InformationGainConfig>
): BatchAnalysisResult {
  const calculator = new InformationGainCalculator(config);
  return calculator.batchAnalyze(questions, currentProbabilities, stage);
}
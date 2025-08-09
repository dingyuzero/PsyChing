import { ProbabilityMap, TrigramType, ExtendedQuestion, QuestionOption } from '../types';
import { TestStage } from './enhancedBayesianEngine';

/**
 * 概率更新配置接口
 */
export interface ProbabilityUpdateConfig {
  // 基础学习率
  baseLearningRate: number;
  // 阶段特定学习率调整
  stageAdjustments: {
    exploration: number;
    discrimination: number;
    confirmation: number;
  };
  // 置信度影响因子
  confidenceInfluence: number;
  // 信息价值权重
  informationValueWeight: number;
  // 收敛阈值
  convergenceThreshold: number;
  // 最小更新幅度
  minUpdateMagnitude: number;
}

/**
 * 更新结果接口
 */
export interface UpdateResult {
  updatedProbs: ProbabilityMap;
  updateMagnitude: number;
  informationGain: number;
  confidence: number;
  convergenceScore: number;
}

/**
 * 阶段转换条件
 */
export interface StageTransitionCondition {
  minQuestions: number;
  maxQuestions: number;
  confidenceThreshold: number;
  convergenceThreshold: number;
  informationGainThreshold: number;
}

/**
 * 阶段转换配置
 */
export interface StageTransitionConfig {
  exploration: StageTransitionCondition;
  discrimination: StageTransitionCondition;
  confirmation: StageTransitionCondition;
}

/**
 * 概率更新器类
 * 负责管理贝叶斯概率更新和阶段转换逻辑
 */
export class ProbabilityUpdater {
  private config: ProbabilityUpdateConfig;
  private transitionConfig: StageTransitionConfig;
  private updateHistory: UpdateResult[] = [];
  
  constructor(
    config?: Partial<ProbabilityUpdateConfig>,
    transitionConfig?: Partial<StageTransitionConfig>
  ) {
    this.config = {
      baseLearningRate: 0.1,
      stageAdjustments: {
        exploration: 1.2,
        discrimination: 1.0,
        confirmation: 0.8
      },
      confidenceInfluence: 0.3,
      informationValueWeight: 0.4,
      convergenceThreshold: 0.95,
      minUpdateMagnitude: 0.001,
      ...config
    };
    
    this.transitionConfig = {
      exploration: {
        minQuestions: 3,
        maxQuestions: 8,
        confidenceThreshold: 0.6,
        convergenceThreshold: 0.7,
        informationGainThreshold: 0.3
      },
      discrimination: {
        minQuestions: 5,
        maxQuestions: 12,
        confidenceThreshold: 0.8,
        convergenceThreshold: 0.85,
        informationGainThreshold: 0.2
      },
      confirmation: {
        minQuestions: 3,
        maxQuestions: 6,
        confidenceThreshold: 0.9,
        convergenceThreshold: 0.95,
        informationGainThreshold: 0.1
      },
      ...transitionConfig
    };
  }
  
  /**
   * 执行增强版贝叶斯概率更新
   */
  updateProbabilities(
    currentProbs: ProbabilityMap,
    question: ExtendedQuestion,
    selectedOption: QuestionOption,
    currentStage: TestStage,
    questionCount: number
  ): UpdateResult {
    // 计算当前阶段的学习率
    const stageKey = this.getStageKey(currentStage);
    const learningRate = this.config.baseLearningRate * 
      this.config.stageAdjustments[stageKey];
    
    // 计算信息价值权重
    const informationValue = this.calculateInformationValue(question, currentProbs);
    const valueWeight = 1 + (informationValue * this.config.informationValueWeight);
    
    // 执行贝叶斯更新
    const updatedProbs = this.performBayesianUpdate(
      currentProbs,
      selectedOption.impact_coefficients,
      learningRate * valueWeight
    );
    
    // 计算更新指标
    const updateMagnitude = this.calculateUpdateMagnitude(currentProbs, updatedProbs);
    const informationGain = this.calculateInformationGain(currentProbs, updatedProbs);
    const confidence = this.calculateConfidence(updatedProbs);
    const convergenceScore = this.calculateConvergenceScore(updatedProbs);
    
    const result: UpdateResult = {
      updatedProbs,
      updateMagnitude,
      informationGain,
      confidence,
      convergenceScore
    };
    
    // 记录更新历史
    this.updateHistory.push(result);
    
    return result;
  }
  
  /**
   * 检查是否应该转换到下一阶段
   */
  shouldTransitionStage(
    currentStage: TestStage,
    questionCount: number,
    recentUpdates: UpdateResult[]
  ): boolean {
    const stageKey = this.getStageKey(currentStage);
    const condition = this.transitionConfig[stageKey];
    
    // 检查最小问题数
    if (questionCount < condition.minQuestions) {
      return false;
    }
    
    // 检查最大问题数（强制转换）
    if (questionCount >= condition.maxQuestions) {
      return true;
    }
    
    // 检查最近更新的平均指标
    if (recentUpdates.length === 0) {
      return false;
    }
    
    const recentCount = Math.min(3, recentUpdates.length);
    const recentResults = recentUpdates.slice(-recentCount);
    
    const avgConfidence = recentResults.reduce((sum, r) => sum + r.confidence, 0) / recentCount;
    const avgConvergence = recentResults.reduce((sum, r) => sum + r.convergenceScore, 0) / recentCount;
    const avgInfoGain = recentResults.reduce((sum, r) => sum + r.informationGain, 0) / recentCount;
    
    // 检查转换条件
    return avgConfidence >= condition.confidenceThreshold &&
           avgConvergence >= condition.convergenceThreshold &&
           avgInfoGain <= condition.informationGainThreshold;
  }
  
  /**
   * 获取下一个测试阶段
   */
  getNextStage(currentStage: TestStage): TestStage {
    switch (currentStage) {
      case TestStage.EXPLORATION:
        return TestStage.DISCRIMINATION;
      case TestStage.DISCRIMINATION:
        return TestStage.CONFIRMATION;
      case TestStage.CONFIRMATION:
        return TestStage.CONFIRMATION; // 已经是最后阶段
      default:
        return TestStage.CONFIRMATION;
    }
  }
  
  /**
   * 执行贝叶斯更新
   */
  private performBayesianUpdate(
    priorProbs: ProbabilityMap,
    impacts: ProbabilityMap,
    learningRate: number
  ): ProbabilityMap {
    const updated: ProbabilityMap = { ...priorProbs };
    
    // 计算似然度
    const likelihoods: ProbabilityMap = {} as ProbabilityMap;
    let totalLikelihood = 0;
    
    for (const type of Object.keys(priorProbs) as TrigramType[]) {
      // 使用指数函数将影响系数转换为似然度
      likelihoods[type] = Math.exp(impacts[type]);
      totalLikelihood += likelihoods[type];
    }
    
    // 归一化似然度
    for (const type of Object.keys(likelihoods) as TrigramType[]) {
      likelihoods[type] /= totalLikelihood;
    }
    
    // 贝叶斯更新：posterior ∝ prior × likelihood
    let totalPosterior = 0;
    for (const type of Object.keys(updated) as TrigramType[]) {
      const posterior = priorProbs[type] * likelihoods[type];
      updated[type] = priorProbs[type] + learningRate * (posterior - priorProbs[type]);
      totalPosterior += updated[type];
    }
    
    // 归一化
    for (const type of Object.keys(updated) as TrigramType[]) {
      updated[type] /= totalPosterior;
    }
    
    return updated;
  }
  
  /**
   * 计算信息价值
   */
  private calculateInformationValue(
    question: ExtendedQuestion,
    currentProbs: ProbabilityMap
  ): number {
    let totalValue = 0;
    
    for (const option of question.options) {
      const optionValue = this.calculateOptionInformationValue(
        option.impact_coefficients,
        currentProbs
      );
      totalValue += optionValue;
    }
    
    return totalValue / question.options.length;
  }
  
  /**
   * 计算选项信息价值
   */
  private calculateOptionInformationValue(
    impacts: ProbabilityMap,
    currentProbs: ProbabilityMap
  ): number {
    let variance = 0;
    
    for (const type of Object.keys(impacts) as TrigramType[]) {
      const impact = impacts[type];
      const prob = currentProbs[type];
      variance += prob * Math.pow(impact, 2);
    }
    
    return Math.sqrt(variance);
  }
  
  /**
   * 计算更新幅度
   */
  private calculateUpdateMagnitude(
    before: ProbabilityMap,
    after: ProbabilityMap
  ): number {
    let totalChange = 0;
    
    for (const type of Object.keys(before) as TrigramType[]) {
      totalChange += Math.abs(after[type] - before[type]);
    }
    
    return totalChange;
  }
  
  /**
   * 计算信息增益
   */
  private calculateInformationGain(
    before: ProbabilityMap,
    after: ProbabilityMap
  ): number {
    const entropyBefore = this.calculateEntropy(before);
    const entropyAfter = this.calculateEntropy(after);
    return entropyBefore - entropyAfter;
  }
  
  /**
   * 计算熵
   */
  private calculateEntropy(probs: ProbabilityMap): number {
    let entropy = 0;
    
    for (const type of Object.keys(probs) as TrigramType[]) {
      const p = probs[type];
      if (p > 0) {
        entropy -= p * Math.log2(p);
      }
    }
    
    return entropy;
  }
  
  /**
   * 计算置信度
   */
  private calculateConfidence(probs: ProbabilityMap): number {
    const values = Object.values(probs);
    const maxProb = Math.max(...values);
    const secondMaxProb = values.sort((a, b) => b - a)[1];
    
    return maxProb - secondMaxProb;
  }
  
  /**
   * 计算收敛分数
   */
  private calculateConvergenceScore(probs: ProbabilityMap): number {
    const maxProb = Math.max(...Object.values(probs));
    return maxProb;
  }
  
  /**
   * 获取阶段键名
   */
  private getStageKey(stage: TestStage): keyof ProbabilityUpdateConfig['stageAdjustments'] {
    switch (stage) {
      case TestStage.EXPLORATION:
        return 'exploration';
      case TestStage.DISCRIMINATION:
        return 'discrimination';
      case TestStage.CONFIRMATION:
        return 'confirmation';
      default:
        return 'confirmation';
    }
  }
  
  /**
   * 获取更新历史
   */
  getUpdateHistory(): UpdateResult[] {
    return [...this.updateHistory];
  }
  
  /**
   * 清除更新历史
   */
  clearHistory(): void {
    this.updateHistory = [];
  }
  
  /**
   * 获取配置
   */
  getConfig(): ProbabilityUpdateConfig {
    return { ...this.config };
  }
  
  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<ProbabilityUpdateConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
  
  /**
   * 获取阶段转换配置
   */
  getTransitionConfig(): StageTransitionConfig {
    return { ...this.transitionConfig };
  }
  
  /**
   * 更新阶段转换配置
   */
  updateTransitionConfig(newConfig: Partial<StageTransitionConfig>): void {
    this.transitionConfig = { ...this.transitionConfig, ...newConfig };
  }
}

// 导出默认实例
export const probabilityUpdater = new ProbabilityUpdater();
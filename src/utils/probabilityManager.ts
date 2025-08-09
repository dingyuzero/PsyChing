import { ProbabilityMap, TrigramType } from '../types';
import { ExtendedQuestion, TestStage } from './enhancedBayesianEngine';
import { StageAnalysis } from './adaptiveTestStrategy';

// 概率更新配置
export interface ProbabilityUpdateConfig {
  learningRate: number;
  momentumFactor: number;
  regularizationStrength: number;
  adaptiveWeighting: boolean;
  evidenceDecay: number;
  confidenceBoost: number;
}

// 概率更新结果
export interface ProbabilityUpdateResult {
  previousProbabilities: ProbabilityMap;
  updatedProbabilities: ProbabilityMap;
  probabilityChanges: ProbabilityMap;
  updateMagnitude: number;
  convergenceIndicator: number;
  confidenceLevel: number;
  updateReason: string;
}

// 阶段转换结果
export interface StageTransitionResult {
  previousStage: TestStage;
  newStage: TestStage;
  transitionReason: string;
  transitionConfidence: number;
  recommendedActions: string[];
  stageMetrics: StageMetrics;
}

// 阶段指标
export interface StageMetrics {
  questionsInStage: number;
  averageInformationGain: number;
  convergenceRate: number;
  confidenceGrowth: number;
  stageEfficiency: number;
}

// 证据累积记录
export interface EvidenceRecord {
  questionId: string;
  selectedOption: string;
  timestamp: number;
  stage: TestStage;
  probabilityImpact: ProbabilityMap;
  informationGain: number;
  confidence: number;
}

// 概率历史记录
export interface ProbabilityHistory {
  timestamp: number;
  probabilities: ProbabilityMap;
  stage: TestStage;
  questionId?: string;
  event: 'initialization' | 'update' | 'stage_transition' | 'reset';
}

// 概率管理器
export class ProbabilityManager {
  private config: ProbabilityUpdateConfig;
  private evidenceHistory: EvidenceRecord[] = [];
  private probabilityHistory: ProbabilityHistory[] = [];
  private stageMetrics: Map<TestStage, StageMetrics> = new Map();
  private momentum: ProbabilityMap = {
    qian: 0, kun: 0, zhen: 0, xun: 0, kan: 0, li: 0, gen: 0, dui: 0
  };
  
  constructor(config?: Partial<ProbabilityUpdateConfig>) {
    this.config = {
      learningRate: 0.1,
      momentumFactor: 0.9,
      regularizationStrength: 0.01,
      adaptiveWeighting: true,
      evidenceDecay: 0.95,
      confidenceBoost: 1.2,
      ...config
    };
    
    this.initializeMomentum();
  }
  
  // 初始化概率分布
  initializeProbabilities(): ProbabilityMap {
    const trigramTypes = [
      'qian', 'kun', 'zhen', 'xun', 'kan', 'li', 'gen', 'dui'
    ] as TrigramType[];
    
    const initialProb = 1 / trigramTypes.length;
    const probabilities: ProbabilityMap = {
      qian: 0, kun: 0, zhen: 0, xun: 0, kan: 0, li: 0, gen: 0, dui: 0
    };
    
    trigramTypes.forEach(type => {
      probabilities[type] = initialProb;
    });
    
    this.recordProbabilityHistory(probabilities, TestStage.EXPLORATION, 'initialization');
    return probabilities;
  }
  
  // 更新概率分布
  updateProbabilities(
    currentProbabilities: ProbabilityMap,
    question: ExtendedQuestion,
    selectedOption: string,
    currentStage: TestStage
  ): ProbabilityUpdateResult {
    const previousProbabilities = { ...currentProbabilities };
    
    // 找到选中的选项
    const option = question.options.find(opt => opt.id === selectedOption);
    if (!option) {
      throw new Error(`选项 ${selectedOption} 不存在`);
    }
    
    // 计算概率更新
    const updatedProbabilities = this.calculateProbabilityUpdate(
      currentProbabilities,
      option.impact_coefficients,
      question,
      currentStage
    );
    
    // 应用动量和正则化
    const finalProbabilities = this.applyMomentumAndRegularization(
      previousProbabilities,
      updatedProbabilities
    );
    
    // 标准化概率
    this.normalizeProbabilities(finalProbabilities);
    
    // 计算更新指标
    const probabilityChanges = this.calculateProbabilityChanges(
      previousProbabilities,
      finalProbabilities
    );
    
    const updateMagnitude = this.calculateUpdateMagnitude(probabilityChanges);
    const convergenceIndicator = this.calculateConvergenceIndicator(finalProbabilities);
    const confidenceLevel = this.calculateConfidenceLevel(finalProbabilities);
    
    // 记录证据
    this.recordEvidence({
      questionId: question.id,
      selectedOption,
      timestamp: Date.now(),
      stage: currentStage,
      probabilityImpact: probabilityChanges,
      informationGain: this.calculateInformationGain(previousProbabilities, finalProbabilities),
      confidence: confidenceLevel
    });
    
    // 记录概率历史
    this.recordProbabilityHistory(finalProbabilities, currentStage, 'update', question.id);
    
    return {
      previousProbabilities,
      updatedProbabilities: finalProbabilities,
      probabilityChanges,
      updateMagnitude,
      convergenceIndicator,
      confidenceLevel,
      updateReason: this.generateUpdateReason(question, selectedOption, updateMagnitude)
    };
  }
  
  // 执行阶段转换
  executeStageTransition(
    currentStage: TestStage,
    newStage: TestStage,
    stageAnalysis: StageAnalysis,
    currentProbabilities: ProbabilityMap
  ): StageTransitionResult {
    const transitionReason = this.generateTransitionReason(currentStage, newStage, stageAnalysis);
    const transitionConfidence = this.calculateTransitionConfidence(stageAnalysis);
    const recommendedActions = this.generateTransitionActions(newStage, stageAnalysis);
    
    // 更新阶段指标
    const stageMetrics = this.updateStageMetrics(currentStage, stageAnalysis);
    
    // 记录阶段转换
    this.recordProbabilityHistory(currentProbabilities, newStage, 'stage_transition');
    
    return {
      previousStage: currentStage,
      newStage,
      transitionReason,
      transitionConfidence,
      recommendedActions,
      stageMetrics
    };
  }
  
  // 计算概率更新
  private calculateProbabilityUpdate(
    currentProbabilities: ProbabilityMap,
    impactCoefficients: Record<TrigramType, number>,
    question: ExtendedQuestion,
    stage: TestStage
  ): ProbabilityMap {
    const updatedProbabilities: ProbabilityMap = {
      qian: 0, kun: 0, zhen: 0, xun: 0, kan: 0, li: 0, gen: 0, dui: 0
    };
    
    // 计算自适应权重
    const adaptiveWeight = this.config.adaptiveWeighting ? 
      this.calculateAdaptiveWeight(question, stage) : 1.0;
    
    // 应用贝叶斯更新
    Object.keys(currentProbabilities).forEach(type => {
      const trigramType = type as TrigramType;
      const currentProb = currentProbabilities[trigramType];
      const impactCoeff = impactCoefficients[trigramType];
      
      // 贝叶斯更新公式：P(H|E) ∝ P(E|H) * P(H)
      const likelihood = impactCoeff;
      const prior = currentProb;
      const posterior = likelihood * prior * adaptiveWeight;
      
      updatedProbabilities[trigramType] = posterior;
    });
    
    return updatedProbabilities;
  }
  
  // 应用动量和正则化
  private applyMomentumAndRegularization(
    previousProbabilities: ProbabilityMap,
    updatedProbabilities: ProbabilityMap
  ): ProbabilityMap {
    const finalProbabilities: ProbabilityMap = {
      qian: 0, kun: 0, zhen: 0, xun: 0, kan: 0, li: 0, gen: 0, dui: 0
    };
    
    Object.keys(updatedProbabilities).forEach(type => {
      const trigramType = type as TrigramType;
      const previous = previousProbabilities[trigramType];
      const updated = updatedProbabilities[trigramType];
      
      // 计算梯度
      const gradient = updated - previous;
      
      // 更新动量
      this.momentum[trigramType] = this.config.momentumFactor * (this.momentum[trigramType] || 0) + 
                                   this.config.learningRate * gradient;
      
      // 应用动量更新
      let newProb = previous + this.momentum[trigramType];
      
      // 应用正则化（防止概率过度集中）
      const regularization = this.config.regularizationStrength * (1/8 - newProb);
      newProb += regularization;
      
      // 确保概率在有效范围内
      finalProbabilities[trigramType] = Math.max(0.001, Math.min(0.999, newProb));
    });
    
    return finalProbabilities;
  }
  
  // 计算自适应权重
  private calculateAdaptiveWeight(question: ExtendedQuestion, stage: TestStage): number {
    let weight = 1.0;
    
    // 根据问题难度调整权重
    if (question.difficulty) {
      weight *= (0.5 + question.difficulty);
    }
    
    // 根据信息价值调整权重
    if (question.information_value) {
      weight *= question.information_value;
    }
    
    // 根据测试阶段调整权重
    switch (stage) {
      case TestStage.EXPLORATION:
        weight *= 0.8; // 探索阶段权重较低
        break;
      case TestStage.DISCRIMINATION:
        weight *= 1.2; // 区分阶段权重较高
        break;
      case TestStage.CONFIRMATION:
        weight *= this.config.confidenceBoost; // 确认阶段权重最高
        break;
    }
    
    return weight;
  }
  
  // 计算概率变化
  private calculateProbabilityChanges(
    previous: ProbabilityMap,
    updated: ProbabilityMap
  ): ProbabilityMap {
    const changes: ProbabilityMap = {
      qian: 0, kun: 0, zhen: 0, xun: 0, kan: 0, li: 0, gen: 0, dui: 0
    };
    
    Object.keys(previous).forEach(type => {
      const trigramType = type as TrigramType;
      changes[trigramType] = updated[trigramType] - previous[trigramType];
    });
    
    return changes;
  }
  
  // 计算更新幅度
  private calculateUpdateMagnitude(changes: ProbabilityMap): number {
    return Math.sqrt(
      Object.values(changes).reduce((sum, change) => sum + change * change, 0)
    );
  }
  
  // 计算收敛指标
  private calculateConvergenceIndicator(probabilities: ProbabilityMap): number {
    const values = Object.values(probabilities);
    const maxProb = Math.max(...values);
    const entropy = -values.reduce((sum, p) => p > 0 ? sum + p * Math.log2(p) : sum, 0);
    const maxEntropy = Math.log2(values.length);
    
    // 收敛指标 = 最大概率 * (1 - 标准化熵)
    return maxProb * (1 - entropy / maxEntropy);
  }
  
  // 计算置信水平
  private calculateConfidenceLevel(probabilities: ProbabilityMap): number {
    const values = Object.values(probabilities).sort((a, b) => b - a);
    return values.length >= 2 ? values[0] - values[1] : values[0];
  }
  
  // 计算信息增益
  private calculateInformationGain(
    previous: ProbabilityMap,
    updated: ProbabilityMap
  ): number {
    const previousEntropy = this.calculateEntropy(Object.values(previous));
    const updatedEntropy = this.calculateEntropy(Object.values(updated));
    return previousEntropy - updatedEntropy;
  }
  
  // 计算熵
  private calculateEntropy(probabilities: number[]): number {
    return -probabilities.reduce((entropy, p) => {
      return p > 0 ? entropy + p * Math.log2(p) : entropy;
    }, 0);
  }
  
  // 标准化概率
  private normalizeProbabilities(probabilities: ProbabilityMap) {
    const sum = Object.values(probabilities).reduce((a, b) => a + b, 0);
    if (sum > 0) {
      Object.keys(probabilities).forEach(key => {
        const trigramType = key as TrigramType;
        probabilities[trigramType] /= sum;
      });
    }
  }
  
  // 生成更新原因
  private generateUpdateReason(
    question: ExtendedQuestion,
    selectedOption: string,
    magnitude: number
  ): string {
    const option = question.options.find(opt => opt.id === selectedOption);
    const magnitudeDesc = magnitude > 0.1 ? '显著' : magnitude > 0.05 ? '中等' : '轻微';
    
    return `回答问题"${question.text_zh || question.content}"，选择"${option?.text_zh || option.content}"，产生${magnitudeDesc}概率更新`;
  }
  
  // 生成转换原因
  private generateTransitionReason(
    currentStage: TestStage,
    newStage: TestStage,
    analysis: StageAnalysis
  ): string {
    const stageNames = {
      [TestStage.EXPLORATION]: '探索',
      [TestStage.DISCRIMINATION]: '区分',
      [TestStage.CONFIRMATION]: '确认'
    };
    
    return `${stageNames[currentStage]}阶段完成（置信度：${(analysis.confidenceLevel * 100).toFixed(1)}%），进入${stageNames[newStage]}阶段`;
  }
  
  // 计算转换置信度
  private calculateTransitionConfidence(analysis: StageAnalysis): number {
    return Math.min(1.0, 
      analysis.convergenceLevel * 0.5 + 
      analysis.confidenceLevel * 0.3 + 
      analysis.stageProgress * 0.2
    );
  }
  
  // 生成转换行动建议
  private generateTransitionActions(newStage: TestStage, analysis: StageAnalysis): string[] {
    const actions: string[] = [];
    
    switch (newStage) {
      case TestStage.DISCRIMINATION:
        actions.push('选择高区分度问题');
        actions.push('关注概率差异较大的选项');
        break;
      case TestStage.CONFIRMATION:
        actions.push('选择针对最可能类型的确认性问题');
        actions.push('验证当前判断的准确性');
        break;
    }
    
    if (analysis.confidenceLevel < 0.7) {
      actions.push('需要更多证据支持');
    }
    
    return actions;
  }
  
  // 更新阶段指标
  private updateStageMetrics(stage: TestStage, analysis: StageAnalysis): StageMetrics {
    const currentMetrics = this.stageMetrics.get(stage) || {
      questionsInStage: 0,
      averageInformationGain: 0,
      convergenceRate: 0,
      confidenceGrowth: 0,
      stageEfficiency: 0
    };
    
    const updatedMetrics: StageMetrics = {
      questionsInStage: analysis.questionsInStage,
      averageInformationGain: this.calculateAverageInformationGain(stage),
      convergenceRate: analysis.convergenceLevel,
      confidenceGrowth: analysis.confidenceLevel,
      stageEfficiency: analysis.stageProgress
    };
    
    this.stageMetrics.set(stage, updatedMetrics);
    return updatedMetrics;
  }
  
  // 计算平均信息增益
  private calculateAverageInformationGain(stage: TestStage): number {
    const stageEvidence = this.evidenceHistory.filter(e => e.stage === stage);
    if (stageEvidence.length === 0) return 0;
    
    const totalGain = stageEvidence.reduce((sum, e) => sum + e.informationGain, 0);
    return totalGain / stageEvidence.length;
  }
  
  // 记录证据
  private recordEvidence(evidence: EvidenceRecord) {
    this.evidenceHistory.push(evidence);
    
    // 应用证据衰减
    if (this.evidenceHistory.length > 100) {
      this.evidenceHistory = this.evidenceHistory.slice(-50);
    }
  }
  
  // 记录概率历史
  private recordProbabilityHistory(
    probabilities: ProbabilityMap,
    stage: TestStage,
    event: ProbabilityHistory['event'],
    questionId?: string
  ) {
    this.probabilityHistory.push({
      timestamp: Date.now(),
      probabilities: { ...probabilities },
      stage,
      questionId,
      event
    });
    
    // 限制历史记录长度
    if (this.probabilityHistory.length > 200) {
      this.probabilityHistory = this.probabilityHistory.slice(-100);
    }
  }
  
  // 初始化动量
  private initializeMomentum() {
    const trigramTypes = [
      'qian', 'kun', 'zhen', 'xun', 'kan', 'li', 'gen', 'dui'
    ] as TrigramType[];
    
    trigramTypes.forEach(type => {
      this.momentum[type] = 0;
    });
  }
}
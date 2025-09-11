import { ExtendedQuestion, TestStage } from './enhancedBayesianEngine';
import { ProbabilityMap, TrigramType } from '../types';
import { DetailedInformationGain, InformationGainCalculator } from './informationGainCalculator';

// 策略配置接口
export interface StrategyConfig {
  explorationThreshold: number;
  discriminationThreshold: number;
  confirmationThreshold: number;
  minQuestionsPerStage: number;
  maxQuestionsPerStage: number;
  convergenceThreshold: number;
  confidenceThreshold: number;
}

// 阶段转换条件
export interface StageTransitionCondition {
  minQuestions: number;
  maxQuestions: number;
  convergenceRequired: boolean;
  confidenceRequired: number;
  informationGainThreshold: number;
}

// 问题选择结果
export interface QuestionSelectionResult {
  selectedQuestion: ExtendedQuestion;
  selectionReason: string;
  alternativeQuestions: ExtendedQuestion[];
  stageRecommendation: TestStage;
  shouldTransition: boolean;
  transitionReason?: string;
}

// 阶段分析结果
export interface StageAnalysis {
  currentStage: TestStage;
  questionsInStage: number;
  stageProgress: number;
  convergenceLevel: number;
  confidenceLevel: number;
  readyForTransition: boolean;
  nextStage?: TestStage;
  recommendations: string[];
}

// 三阶段自适应测试策略管理器
export class AdaptiveTestStrategy {
  private config: StrategyConfig;
  private informationGainCalculator: InformationGainCalculator;
  private stageHistory: TestStage[] = [];
  private questionHistory: string[] = [];
  
  constructor(
    config?: Partial<StrategyConfig>,
    informationGainCalculator?: InformationGainCalculator
  ) {
    this.config = {
      explorationThreshold: 0.3,
      discriminationThreshold: 0.6,
      confirmationThreshold: 0.8,
      minQuestionsPerStage: 3,
      maxQuestionsPerStage: 10,
      convergenceThreshold: 0.7,
      confidenceThreshold: 0.85,
      ...config
    };
    
    this.informationGainCalculator = informationGainCalculator || new InformationGainCalculator();
  }
  
  // 主要的问题选择方法
  selectQuestion(
    availableQuestions: ExtendedQuestion[],
    currentProbabilities: ProbabilityMap,
    currentStage: TestStage,
    answeredQuestions: string[] = []
  ): QuestionSelectionResult {
    // 过滤已回答的问题
    const candidateQuestions = availableQuestions.filter(
      q => !answeredQuestions.includes(q.id)
    );
    
    if (candidateQuestions.length === 0) {
      throw new Error('没有可用的候选问题');
    }
    
    // 根据当前阶段选择策略
    const strategy = this.getStageStrategy(currentStage);
    const selectedQuestion = strategy(candidateQuestions, currentProbabilities);
    
    // 分析阶段转换
    const stageAnalysis = this.analyzeStage(
      currentStage,
      currentProbabilities,
      answeredQuestions.length
    );
    
    // 获取备选问题
    const alternativeQuestions = this.getAlternativeQuestions(
      candidateQuestions,
      selectedQuestion,
      currentProbabilities,
      currentStage
    );
    
    return {
      selectedQuestion,
      selectionReason: this.getSelectionReason(selectedQuestion, currentStage),
      alternativeQuestions,
      stageRecommendation: stageAnalysis.nextStage || currentStage,
      shouldTransition: stageAnalysis.readyForTransition,
      transitionReason: stageAnalysis.readyForTransition ? 
        `满足${currentStage}阶段完成条件，建议进入${stageAnalysis.nextStage}阶段` : undefined
    };
  }
  
  // 分析当前阶段状态
  analyzeStage(
    currentStage: TestStage,
    currentProbabilities: ProbabilityMap,
    questionsAnswered: number
  ): StageAnalysis {
    const convergenceLevel = this.calculateConvergenceLevel(currentProbabilities);
    const confidenceLevel = this.calculateConfidenceLevel(currentProbabilities);
    const stageProgress = this.calculateStageProgress(currentStage, questionsAnswered);
    
    const transitionCondition = this.getStageTransitionCondition(currentStage);
    const readyForTransition = this.checkTransitionReadiness(
      currentStage,
      questionsAnswered,
      convergenceLevel,
      confidenceLevel,
      transitionCondition
    );
    
    const nextStage = readyForTransition ? this.getNextStage(currentStage) : undefined;
    const recommendations = this.generateStageRecommendations(
      currentStage,
      convergenceLevel,
      confidenceLevel,
      questionsAnswered
    );
    
    return {
      currentStage,
      questionsInStage: questionsAnswered,
      stageProgress,
      convergenceLevel,
      confidenceLevel,
      readyForTransition,
      nextStage,
      recommendations
    };
  }
  
  // 探索阶段策略
  private explorationStrategy(
    questions: ExtendedQuestion[],
    currentProbabilities: ProbabilityMap
  ): ExtendedQuestion {
    // 在探索阶段，优先选择多样性高、覆盖面广的问题
    const analyses = this.informationGainCalculator.batchAnalyze(
      questions,
      currentProbabilities,
      TestStage.EXPLORATION
    );
    
    // 综合考虑信息增益和多样性
    const scoredQuestions = analyses.questions.map(analysis => {
      const diversityScore = analysis.diversityScore;
      const informationGain = analysis.informationGain;
      const explorationScore = informationGain * 0.6 + diversityScore * 0.4;
      
      return {
        question: questions.find(q => q.id === analysis.questionId)!,
        score: explorationScore,
        analysis
      };
    });
    
    // 选择得分最高的问题
    scoredQuestions.sort((a, b) => b.score - a.score);
    return scoredQuestions[0].question;
  }
  
  // 区分阶段策略
  private discriminationStrategy(
    questions: ExtendedQuestion[],
    currentProbabilities: ProbabilityMap
  ): ExtendedQuestion {
    // 在区分阶段，优先选择区分能力强的问题
    const analyses = this.informationGainCalculator.batchAnalyze(
      questions,
      currentProbabilities,
      TestStage.DISCRIMINATION
    );
    
    // 重点关注区分能力
    const scoredQuestions = analyses.questions.map(analysis => {
      const discriminationScore = analysis.discriminationScore;
      const informationGain = analysis.informationGain;
      const discriminationStrategyScore = discriminationScore * 0.7 + informationGain * 0.3;
      
      return {
        question: questions.find(q => q.id === analysis.questionId)!,
        score: discriminationStrategyScore,
        analysis
      };
    });
    
    // 选择区分能力最强的问题
    scoredQuestions.sort((a, b) => b.score - a.score);
    return scoredQuestions[0].question;
  }
  
  // 确认阶段策略
  private confirmationStrategy(
    questions: ExtendedQuestion[],
    currentProbabilities: ProbabilityMap
  ): ExtendedQuestion {
    // 在确认阶段，选择能够验证当前最可能类型的问题
    const mostLikelyType = this.getMostLikelyType(currentProbabilities);
    
    // 过滤出针对最可能类型的问题
    const targetQuestions = questions.filter(q => 
      this.isQuestionTargetingType(q, mostLikelyType)
    );
    
    const questionsToAnalyze = targetQuestions.length > 0 ? targetQuestions : questions;
    
    const analyses = this.informationGainCalculator.batchAnalyze(
      questionsToAnalyze,
      currentProbabilities,
      TestStage.CONFIRMATION
    );
    
    // 在确认阶段，优先选择能够提供确认信息的问题
    const scoredQuestions = analyses.questions.map(analysis => {
      const confirmationScore = this.calculateConfirmationScore(
        analysis,
        mostLikelyType,
        currentProbabilities
      );
      
      return {
        question: questionsToAnalyze.find(q => q.id === analysis.questionId)!,
        score: confirmationScore,
        analysis
      };
    });
    
    scoredQuestions.sort((a, b) => b.score - a.score);
    return scoredQuestions[0].question;
  }
  
  // 获取阶段策略函数
  private getStageStrategy(
    stage: TestStage
  ): (questions: ExtendedQuestion[], probabilities: ProbabilityMap) => ExtendedQuestion {
    switch (stage) {
      case TestStage.EXPLORATION:
        return this.explorationStrategy.bind(this);
      case TestStage.DISCRIMINATION:
        return this.discriminationStrategy.bind(this);
      case TestStage.CONFIRMATION:
        return this.confirmationStrategy.bind(this);
      default:
        return this.explorationStrategy.bind(this);
    }
  }
  
  // 计算收敛水平
  private calculateConvergenceLevel(probabilities: ProbabilityMap): number {
    const values = Object.values(probabilities);
    const maxProb = Math.max(...values);
    const entropy = -values.reduce((sum, p) => p > 0 ? sum + p * Math.log2(p) : sum, 0);
    const maxEntropy = Math.log2(values.length);
    
    // 收敛水平 = 最大概率 * (1 - 标准化熵)
    return maxProb * (1 - entropy / maxEntropy);
  }
  
  // 计算置信水平
  private calculateConfidenceLevel(probabilities: ProbabilityMap): number {
    const values = Object.values(probabilities).sort((a, b) => b - a);
    const topTwo = values.slice(0, 2);
    
    // 置信水平 = 最高概率 - 第二高概率
    return topTwo.length >= 2 ? topTwo[0] - topTwo[1] : topTwo[0];
  }
  
  // 计算阶段进度
  private calculateStageProgress(stage: TestStage, questionsAnswered: number): number {
    const minQuestions = this.config.minQuestionsPerStage;
    const maxQuestions = this.config.maxQuestionsPerStage;
    
    return Math.min(1, Math.max(0, 
      (questionsAnswered - minQuestions) / (maxQuestions - minQuestions)
    ));
  }
  
  // 检查阶段转换准备情况
  private checkTransitionReadiness(
    currentStage: TestStage,
    questionsAnswered: number,
    convergenceLevel: number,
    confidenceLevel: number,
    condition: StageTransitionCondition
  ): boolean {
    // 检查最小问题数
    if (questionsAnswered < condition.minQuestions) {
      return false;
    }
    
    // 检查最大问题数（强制转换）
    if (questionsAnswered >= condition.maxQuestions) {
      return true;
    }
    
    // 检查收敛要求
    if (condition.convergenceRequired && convergenceLevel < this.config.convergenceThreshold) {
      return false;
    }
    
    // 检查置信度要求
    if (confidenceLevel < condition.confidenceRequired) {
      return false;
    }
    
    return true;
  }
  
  // 获取阶段转换条件
  private getStageTransitionCondition(stage: TestStage): StageTransitionCondition {
    switch (stage) {
      case TestStage.EXPLORATION:
        return {
          minQuestions: this.config.minQuestionsPerStage,
          maxQuestions: this.config.maxQuestionsPerStage,
          convergenceRequired: false,
          confidenceRequired: 0.3,
          informationGainThreshold: 0.1
        };
      case TestStage.DISCRIMINATION:
        return {
          minQuestions: this.config.minQuestionsPerStage,
          maxQuestions: this.config.maxQuestionsPerStage,
          convergenceRequired: true,
          confidenceRequired: 0.6,
          informationGainThreshold: 0.05
        };
      case TestStage.CONFIRMATION:
        return {
          minQuestions: 2,
          maxQuestions: 5,
          convergenceRequired: true,
          confidenceRequired: this.config.confidenceThreshold,
          informationGainThreshold: 0.02
        };
      default:
        return {
          minQuestions: this.config.minQuestionsPerStage,
          maxQuestions: this.config.maxQuestionsPerStage,
          convergenceRequired: false,
          confidenceRequired: 0.5,
          informationGainThreshold: 0.1
        };
    }
  }
  
  // 获取下一个阶段
  private getNextStage(currentStage: TestStage): TestStage {
    switch (currentStage) {
      case TestStage.EXPLORATION:
        return TestStage.DISCRIMINATION;
      case TestStage.DISCRIMINATION:
        return TestStage.CONFIRMATION;
      case TestStage.CONFIRMATION:
        return TestStage.CONFIRMATION; // 确认阶段是最后阶段
      default:
        return TestStage.EXPLORATION;
    }
  }
  
  // 生成阶段建议
  private generateStageRecommendations(
    stage: TestStage,
    convergenceLevel: number,
    confidenceLevel: number,
    questionsAnswered: number
  ): string[] {
    const recommendations: string[] = [];
    
    switch (stage) {
      case TestStage.EXPLORATION:
        if (convergenceLevel < 0.3) {
          recommendations.push('继续探索，增加问题多样性');
        }
        if (questionsAnswered >= this.config.minQuestionsPerStage) {
          recommendations.push('可考虑进入区分阶段');
        }
        break;
        
      case TestStage.DISCRIMINATION:
        if (confidenceLevel < 0.6) {
          recommendations.push('需要更多区分性问题');
        }
        if (convergenceLevel > 0.7) {
          recommendations.push('准备进入确认阶段');
        }
        break;
        
      case TestStage.CONFIRMATION:
        if (confidenceLevel > this.config.confidenceThreshold) {
          recommendations.push('测试可以结束');
        } else {
          recommendations.push('需要更多确认性问题');
        }
        break;
    }
    
    return recommendations;
  }
  
  // 获取备选问题
  private getAlternativeQuestions(
    candidateQuestions: ExtendedQuestion[],
    selectedQuestion: ExtendedQuestion,
    currentProbabilities: ProbabilityMap,
    stage: TestStage,
    count: number = 3
  ): ExtendedQuestion[] {
    const alternatives = candidateQuestions
      .filter(q => q.id !== selectedQuestion.id)
      .slice(0, count);
    
    return alternatives;
  }
  
  // 获取选择原因
  private getSelectionReason(question: ExtendedQuestion, stage: TestStage): string {
    switch (stage) {
      case TestStage.EXPLORATION:
        return `探索阶段：选择多样性问题 "${question.text_zh || question.content}" 以广泛了解用户特征`;
      case TestStage.DISCRIMINATION:
        return `区分阶段：选择区分性问题 "${question.text_zh || question.content}" 以精确区分用户类型`;
      case TestStage.CONFIRMATION:
        return `确认阶段：选择确认性问题 "${question.text_zh || question.content}" 以验证用户类型`;
      default:
        return `选择问题 "${question.text_zh || question.content}"`;
    }
  }
  
  // 获取最可能的类型
  private getMostLikelyType(probabilities: ProbabilityMap): TrigramType {
    return Object.entries(probabilities).reduce((max, [type, prob]) => 
      prob > probabilities[max] ? type as TrigramType : max
    , Object.keys(probabilities)[0] as TrigramType);
  }
  
  // 检查问题是否针对特定类型
  private isQuestionTargetingType(question: ExtendedQuestion, targetType: TrigramType): boolean {
    // 检查问题的选项是否对目标类型有显著影响
    const targetCoefficients = question.options.map(option => 
      option.impact_coefficients[targetType]
    );
    
    const maxCoeff = Math.max(...targetCoefficients);
    const minCoeff = Math.min(...targetCoefficients);
    
    // 如果系数差异较大，说明这个问题对该类型有区分作用
    return (maxCoeff - minCoeff) > 0.3;
  }
  
  // 计算确认分数
  private calculateConfirmationScore(
    analysis: DetailedInformationGain,
    targetType: TrigramType,
    currentProbabilities: ProbabilityMap
  ): number {
    const targetProbability = currentProbabilities[targetType];
    const informationGain = analysis.informationGain;
    const discriminationScore = analysis.discriminationScore;
    
    // 确认分数 = 信息增益 * 目标概率 + 区分分数
    return informationGain * targetProbability + discriminationScore * 0.5;
  }
  
  // 记录阶段历史
  recordStageTransition(stage: TestStage) {
    this.stageHistory.push(stage);
  }
  
  // 记录问题历史
  recordQuestionSelection(questionId: string) {
    this.questionHistory.push(questionId);
  }
  
  // 获取策略统计
  getStrategyStats() {
    return {
      stageHistory: [...this.stageHistory],
      questionHistory: [...this.questionHistory],
      config: { ...this.config }
    };
  }
  
  // 重置策略状态
  reset() {
    this.stageHistory = [];
    this.questionHistory = [];
  }
  
  // 更新配置
  updateConfig(newConfig: Partial<StrategyConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

// 导出默认实例
export const adaptiveTestStrategy = new AdaptiveTestStrategy();

// 导出便捷函数
export function selectAdaptiveQuestion(
  availableQuestions: ExtendedQuestion[],
  currentProbabilities: ProbabilityMap,
  currentStage: TestStage,
  answeredQuestions: string[] = [],
  config?: Partial<StrategyConfig>
): QuestionSelectionResult {
  const strategy = new AdaptiveTestStrategy(config);
  return strategy.selectQuestion(availableQuestions, currentProbabilities, currentStage, answeredQuestions);
}

export function analyzeTestStage(
  currentStage: TestStage,
  currentProbabilities: ProbabilityMap,
  questionsAnswered: number,
  config?: Partial<StrategyConfig>
): StageAnalysis {
  const strategy = new AdaptiveTestStrategy(config);
  return strategy.analyzeStage(currentStage, currentProbabilities, questionsAnswered);
}
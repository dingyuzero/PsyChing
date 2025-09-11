/**
 * 阶段转换管理器
 * 负责管理自适应测试的阶段转换逻辑和置信度监控
 */

// 自适应测试阶段类型
type AdaptiveTestPhase = 'exploration' | 'discrimination' | 'confirmation';

// 阶段转换配置
interface PhaseTransitionConfig {
  // 最小问题数要求
  minQuestions: number;
  // 置信度阈值
  confidenceThreshold: number;
  // 熵阈值（信息量阈值）
  entropyThreshold: number;
  // 概率收敛阈值
  convergenceThreshold: number;
}

// 阶段转换条件
export interface PhaseTransitionCondition {
  phase: AdaptiveTestPhase;
  questionsAnswered: number;
  confidence: number;
  entropy: number;
  convergence: number;
  shouldTransition: boolean;
  reason: string;
}

// 置信度监控结果
interface ConfidenceMonitorResult {
  currentConfidence: number;
  targetConfidence: number;
  isStable: boolean;
  trend: 'increasing' | 'decreasing' | 'stable';
  recommendation: 'continue' | 'transition' | 'complete';
}

class PhaseTransitionManager {
  private phaseConfigs: Record<AdaptiveTestPhase, PhaseTransitionConfig> = {
    'exploration': {
      minQuestions: 2,
      confidenceThreshold: 0.3,
      entropyThreshold: 2.0,
      convergenceThreshold: 0.1
    },
    'discrimination': {
      minQuestions: 3,
      confidenceThreshold: 0.6,
      entropyThreshold: 1.5,
      convergenceThreshold: 0.05
    },
    'confirmation': {
      minQuestions: 2,
      confidenceThreshold: 0.8,
      entropyThreshold: 1.0,
      convergenceThreshold: 0.02
    }
  };

  private confidenceHistory: number[] = [];
  private entropyHistory: number[] = [];
  private readonly maxHistoryLength = 10;

  /**
   * 评估是否应该转换到下一个阶段
   */
  evaluatePhaseTransition(
    currentPhase: AdaptiveTestPhase,
    questionsAnswered: number,
    probabilities: Record<string, number>,
    confidence: number
  ): PhaseTransitionCondition {
    const config = this.phaseConfigs[currentPhase];
    const entropy = this.calculateEntropy(probabilities);
    const convergence = this.calculateConvergence();

    // 更新历史记录
    this.updateHistory(confidence, entropy);

    let shouldTransition = false;
    let reason = '';

    // 检查最小问题数
    if (questionsAnswered < config.minQuestions) {
      reason = `需要至少回答 ${config.minQuestions} 个问题`;
    }
    // 检查置信度阈值
    else if (confidence < config.confidenceThreshold) {
      reason = `置信度 ${(confidence * 100).toFixed(1)}% 低于阈值 ${(config.confidenceThreshold * 100).toFixed(1)}%`;
    }
    // 检查熵阈值（信息量）
    else if (entropy > config.entropyThreshold) {
      reason = `信息熵 ${entropy.toFixed(2)} 高于阈值 ${config.entropyThreshold.toFixed(2)}`;
    }
    // 检查收敛性
    else if (convergence > config.convergenceThreshold) {
      reason = `概率分布未收敛，变化率 ${(convergence * 100).toFixed(1)}%`;
    }
    // 满足转换条件
    else {
      shouldTransition = true;
      reason = `满足阶段转换条件：置信度 ${(confidence * 100).toFixed(1)}%，熵 ${entropy.toFixed(2)}，收敛率 ${(convergence * 100).toFixed(1)}%`;
    }

    return {
      phase: currentPhase,
      questionsAnswered,
      confidence,
      entropy,
      convergence,
      shouldTransition,
      reason
    };
  }

  /**
   * 获取下一个阶段
   */
  getNextPhase(currentPhase: AdaptiveTestPhase): AdaptiveTestPhase | null {
    switch (currentPhase) {
      case 'exploration':
        return 'discrimination';
      case 'discrimination':
        return 'confirmation';
      case 'confirmation':
        return null; // 测试完成
      default:
        return null;
    }
  }

  /**
   * 监控置信度变化
   */
  monitorConfidence(
    currentPhase: AdaptiveTestPhase,
    confidence: number
  ): ConfidenceMonitorResult {
    const config = this.phaseConfigs[currentPhase];
    const targetConfidence = config.confidenceThreshold;
    
    // 计算置信度趋势
    const trend = this.calculateConfidenceTrend();
    
    // 判断是否稳定
    const isStable = this.isConfidenceStable();
    
    // 生成建议
    let recommendation: 'continue' | 'transition' | 'complete';
    
    if (confidence >= targetConfidence && isStable) {
      if (currentPhase === 'confirmation') {
        recommendation = 'complete';
      } else {
        recommendation = 'transition';
      }
    } else {
      recommendation = 'continue';
    }

    return {
      currentConfidence: confidence,
      targetConfidence,
      isStable,
      trend,
      recommendation
    };
  }

  /**
   * 计算信息熵
   */
  private calculateEntropy(probabilities: Record<string, number>): number {
    let entropy = 0;
    const values = Object.values(probabilities);
    
    for (const prob of values) {
      if (prob > 0) {
        entropy -= prob * Math.log2(prob);
      }
    }
    
    return entropy;
  }

  /**
   * 计算概率分布收敛性
   */
  private calculateConvergence(): number {
    if (this.confidenceHistory.length < 3) {
      return 1.0; // 数据不足，认为未收敛
    }

    const recent = this.confidenceHistory.slice(-3);
    const variance = this.calculateVariance(recent);
    
    return Math.sqrt(variance);
  }

  /**
   * 计算置信度趋势
   */
  private calculateConfidenceTrend(): 'increasing' | 'decreasing' | 'stable' {
    if (this.confidenceHistory.length < 3) {
      return 'stable';
    }

    const recent = this.confidenceHistory.slice(-3);
    const slope = this.calculateSlope(recent);
    
    if (slope > 0.02) {
      return 'increasing';
    } else if (slope < -0.02) {
      return 'decreasing';
    } else {
      return 'stable';
    }
  }

  /**
   * 判断置信度是否稳定
   */
  private isConfidenceStable(): boolean {
    if (this.confidenceHistory.length < 3) {
      return false;
    }

    const recent = this.confidenceHistory.slice(-3);
    const variance = this.calculateVariance(recent);
    
    return variance < 0.01; // 方差小于0.01认为稳定
  }

  /**
   * 更新历史记录
   */
  private updateHistory(confidence: number, entropy: number): void {
    this.confidenceHistory.push(confidence);
    this.entropyHistory.push(entropy);
    
    // 限制历史记录长度
    if (this.confidenceHistory.length > this.maxHistoryLength) {
      this.confidenceHistory.shift();
    }
    if (this.entropyHistory.length > this.maxHistoryLength) {
      this.entropyHistory.shift();
    }
  }

  /**
   * 计算方差
   */
  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * 计算斜率（线性回归）
   */
  private calculateSlope(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;
    
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    return slope;
  }

  /**
   * 重置管理器状态
   */
  reset(): void {
    this.confidenceHistory = [];
    this.entropyHistory = [];
  }

  /**
   * 获取阶段配置
   */
  getPhaseConfig(phase: AdaptiveTestPhase): PhaseTransitionConfig {
    return { ...this.phaseConfigs[phase] };
  }

  /**
   * 更新阶段配置
   */
  updatePhaseConfig(phase: AdaptiveTestPhase, config: Partial<PhaseTransitionConfig>): void {
    this.phaseConfigs[phase] = {
      ...this.phaseConfigs[phase],
      ...config
    };
  }

  /**
   * 获取历史统计信息
   */
  getHistoryStats(): {
    confidenceHistory: number[];
    entropyHistory: number[];
    averageConfidence: number;
    averageEntropy: number;
    confidenceTrend: 'increasing' | 'decreasing' | 'stable';
  } {
    const avgConfidence = this.confidenceHistory.length > 0 
      ? this.confidenceHistory.reduce((sum, val) => sum + val, 0) / this.confidenceHistory.length 
      : 0;
    
    const avgEntropy = this.entropyHistory.length > 0 
      ? this.entropyHistory.reduce((sum, val) => sum + val, 0) / this.entropyHistory.length 
      : 0;

    return {
      confidenceHistory: [...this.confidenceHistory],
      entropyHistory: [...this.entropyHistory],
      averageConfidence: avgConfidence,
      averageEntropy: avgEntropy,
      confidenceTrend: this.calculateConfidenceTrend()
    };
  }
}

// 导出单例实例
export const phaseTransitionManager = new PhaseTransitionManager();
export { PhaseTransitionManager };
export type { ConfidenceMonitorResult, PhaseTransitionConfig };
import { TestAnswer, HexagramResult } from '../types';
import { HEXAGRAMS, HexagramMapper } from '../data/hexagramDatabase';
import { bayesianEngine } from './bayesianEngine';
import { HexagramAnalysisEngine } from './hexagramAnalysis';

// 计算测试结果（支持贝叶斯结果）
export const calculateResult = (answers: TestAnswer[], bayesianData?: any): HexagramResult => {
  let hexagram: string;
  let scores: Record<string, number>;
  
  if (bayesianData) {
    // 使用贝叶斯分析结果
    const { motivation, behavior } = bayesianData;
    
    // 将动机和行为映射到卦象
    hexagram = mapToHexagram(motivation, behavior);
    
    // 构建得分对象
    scores = {
      motivation: bayesianData.probabilities.motivation,
      behavior: bayesianData.probabilities.behavior
    };
  } else {
    // 传统计算方法
    scores = calculateDimensionScores(answers);
    hexagram = determineHexagram(scores);
  }
  
  // 获取卦象详细信息
  const hexagramNumber = parseInt(hexagram);
  const hexagramData = HexagramMapper.getHexagramByNumber(hexagramNumber);

  if (!hexagramData) {
    throw new Error(`Hexagram ${hexagram} not found in database`);
  }

  // 生成完整的分析结果
  const finalResult = bayesianEngine.getFinalResult();
  const analysisResult = HexagramAnalysisEngine.generateAnalysis(
    finalResult.inner_motivation,
    finalResult.outer_behavior,
    {
      inner_motivation: finalResult.probabilities.inner_motivation,
      outer_behavior: finalResult.probabilities.outer_behavior
    }
  );
  
  return {
    id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    hexagram: {
      id: hexagramData.id,
      name_zh: hexagramData.name_zh,
      name_en: hexagramData.name_en,
      upper_trigram: hexagramData.upper_trigram,
      lower_trigram: hexagramData.lower_trigram,
      binary_code: hexagramData.binary_code,
      lines: hexagramData.lines,
      gua_number: hexagramData.gua_number
    },
    confidence: analysisResult.confidence,
    basicAnalysis: analysisResult.basicAnalysis,
    lineAnalysis: analysisResult.lineAnalysis,
    relatedHexagrams: analysisResult.relatedHexagrams,
    detailedAnalysis: analysisResult.detailedAnalysis,
    answers,
    timestamp: Date.now()
  };
};

// 将动机和行为类型映射到64卦
const mapToHexagram = (motivation: string, behavior: string): string => {
  // 动机类型到下卦的映射
  const motivationToLowerTrigram: Record<string, string> = {
    achievement: '乾', // 天
    security: '坤',   // 地
    innovation: '震', // 雷
    growth: '巽',     // 风
    harmony: '坎',    // 水
    exploration: '离', // 火
    stability: '艮',  // 山
    change: '兑'      // 泽
  };
  
  // 行为模式到上卦的映射
  const behaviorToUpperTrigram: Record<string, string> = {
    leadership: '乾', // 天
    support: '坤',    // 地
    expression: '震', // 雷
    cautious: '巽',   // 风
    creation: '坎',   // 水
    analysis: '离',   // 火
    coordination: '艮', // 山
    execution: '兑'   // 泽
  };
  
  const lowerTrigram = motivationToLowerTrigram[motivation] || '乾';
  const upperTrigram = behaviorToUpperTrigram[behavior] || '乾';
  
  // 根据上下卦组合确定64卦中的一个
  const trigramToHexagram: Record<string, Record<string, string>> = {
    '乾': {
      '乾': '1', '坤': '12', '震': '34', '巽': '9',
      '坎': '5', '离': '13', '艮': '26', '兑': '10'
    },
    '坤': {
      '乾': '11', '坤': '2', '震': '16', '巽': '20',
      '坎': '8', '离': '35', '艮': '23', '兑': '45'
    },
    '震': {
      '乾': '25', '坤': '24', '震': '51', '巽': '42',
      '坎': '3', '离': '21', '艮': '27', '兑': '17'
    },
    '巽': {
      '乾': '44', '坤': '19', '震': '32', '巽': '57',
      '坎': '48', '离': '37', '艮': '18', '兑': '28'
    },
    '坎': {
      '乾': '6', '坤': '7', '震': '40', '巽': '59',
      '坎': '29', '离': '64', '艮': '4', '兑': '47'
    },
    '离': {
      '乾': '14', '坤': '36', '震': '55', '巽': '50',
      '坎': '63', '离': '30', '艮': '56', '兑': '38'
    },
    '艮': {
      '乾': '33', '坤': '15', '震': '62', '巽': '53',
      '坎': '39', '离': '22', '艮': '52', '兑': '31'
    },
    '兑': {
      '乾': '43', '坤': '46', '震': '49', '巽': '61',
      '坎': '60', '离': '54', '艮': '41', '兑': '58'
    }
  };
  
  return trigramToHexagram[lowerTrigram]?.[upperTrigram] || '1';
};

// 传统维度得分计算
const calculateDimensionScores = (answers: TestAnswer[]): Record<string, number> => {
  const scores: Record<string, number> = {};
  
  // 简化的得分计算逻辑
  answers.forEach((answer, index) => {
    const dimension = `dimension_${index % 8}`;
    if (!scores[dimension]) {
      scores[dimension] = 0;
    }
    
    // 根据选项ID计算得分
    const optionValue = answer.option_id.charCodeAt(0) - 97; // a=0, b=1, c=2, d=3
    scores[dimension] += optionValue / 3; // 归一化到0-1
  });
  
  return scores;
};

// 传统卦象确定方法
const determineHexagram = (scores: Record<string, number>): string => {
  // 简化的卦象确定逻辑
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const avgScore = totalScore / Object.keys(scores).length;
  
  // 根据平均得分映射到64卦中的一个
  const hexagramIndex = Math.floor(avgScore * 64) + 1;
  return hexagramIndex.toString();
};
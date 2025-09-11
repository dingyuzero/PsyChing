import { Hexagram, HexagramResult, BasicAnalysis, LineAnalysis, DetailedAnalysis, RelatedAnalysis, TrigramType } from '../types';
import { TRIGRAMS, HEXAGRAMS, HexagramMapper } from '../data/hexagramDatabase';
import { INNER_MOTIVATION_TYPES, OUTER_BEHAVIOR_TYPES } from './bayesianEngine';

// 卦象分析引擎
export class HexagramAnalysisEngine {
  
  // 生成完整的卦象分析结果
  static generateAnalysis(
    innerMotivation: TrigramType,
    outerBehavior: TrigramType,
    probabilities: {
      inner_motivation: Record<TrigramType, number>;
      outer_behavior: Record<TrigramType, number>;
    }
  ): {
    confidence: number;
    basicAnalysis: any;
    lineAnalysis: any;
    relatedHexagrams: any;
    detailedAnalysis: any;
  } {
    
    // 获取主卦
    const mainHexagram = HexagramMapper.getHexagram(outerBehavior, innerMotivation);
    if (!mainHexagram) {
      throw new Error('无法找到对应的卦象');
    }
    
    // 生成基础分析
    const basicAnalysis = this.generateBasicAnalysis(mainHexagram, innerMotivation, outerBehavior);
    
    // 生成爻位分析
    const lineAnalysis = this.generateLineAnalysis(mainHexagram, probabilities);
    
    // 生成详细分析
    const detailedAnalysis = this.generateDetailedAnalysis(mainHexagram, innerMotivation, outerBehavior, probabilities);
    
    // 生成关联分析
    const relatedAnalysis = this.generateRelatedAnalysis(mainHexagram);
    
    return {
      confidence: this.calculateConfidenceScore(probabilities),
      basicAnalysis: {
        corePersonality: basicAnalysis.core_personality,
        advantageTraits: basicAnalysis.motivation_analysis?.description ? [basicAnalysis.motivation_analysis.description] : [],
        challengeAreas: basicAnalysis.behavior_analysis?.description ? [basicAnalysis.behavior_analysis.description] : []
      },
      lineAnalysis: {
        lines: lineAnalysis.lines || [],
        coreLineIndex: lineAnalysis.core_line?.position || 0,
        coreLineSignificance: lineAnalysis.core_line?.significance || '',
        coreLineInterpretation: lineAnalysis.core_line?.interpretation || '',
        lineInteraction: lineAnalysis.line_interaction || ''
      },
      relatedHexagrams: {
        changeHexagrams: relatedAnalysis.change_hexagrams?.map(h => ({
          hexagram: h.hexagram,
          meaning: h.meaning
        })) || [],
        oppositeHexagram: relatedAnalysis.opposite_hexagram || null,
        reverseHexagram: relatedAnalysis.reverse_hexagram || null
      },
      detailedAnalysis: {
        developmentSuggestions: detailedAnalysis.development_suggestions || [],
        attentionPoints: detailedAnalysis.challenges || [],
        relationshipPatterns: detailedAnalysis.relationship_patterns || '',
        careerGuidance: detailedAnalysis.career_guidance || '',
        lifePhilosophy: detailedAnalysis.life_philosophy || '',
        recentFortune: detailedAnalysis.recent_fortune || ''
      }
    };
  }
  
  // 生成基础分析
  private static generateBasicAnalysis(
    hexagram: Hexagram,
    innerMotivation: TrigramType,
    outerBehavior: TrigramType
  ): BasicAnalysis {
    
    const innerTrigram = TRIGRAMS[innerMotivation];
    const outerTrigram = TRIGRAMS[outerBehavior];
    
    return {
      hexagram_name: {
        zh: hexagram.name_zh,
        en: hexagram.name_en
      },
      core_personality: this.generateCorePersonality(innerMotivation, outerBehavior),
      motivation_analysis: {
        type: INNER_MOTIVATION_TYPES[innerMotivation],
        description: this.getMotivationDescription(innerMotivation),
        trigram_info: {
          name: innerTrigram.name_zh,
          symbol: innerTrigram.symbol,
          element: innerTrigram.element,
          attributes: innerTrigram.attributes
        }
      },
      behavior_analysis: {
        type: OUTER_BEHAVIOR_TYPES[outerBehavior],
        description: this.getBehaviorDescription(outerBehavior),
        trigram_info: {
          name: outerTrigram.name_zh,
          symbol: outerTrigram.symbol,
          element: outerTrigram.element,
          attributes: outerTrigram.attributes
        }
      },
      overall_summary: this.generateOverallSummary(hexagram, innerMotivation, outerBehavior)
    };
  }
  
  // 生成爻位分析
  private static generateLineAnalysis(
    hexagram: Hexagram,
    probabilities: {
      inner_motivation: Record<TrigramType, number>;
      outer_behavior: Record<TrigramType, number>;
    }
  ): LineAnalysis {
    
    const lines = hexagram.lines.map((line, index) => {
      const position = index + 1;
      const isYang = line === 1;
      
      return {
        position,
        type: isYang ? 'yang' : 'yin',
        symbol: isYang ? '—' : '- -',
        meaning: this.getLineMeaning(position, isYang),
        influence: this.getLineInfluence(position, isYang, probabilities)
      };
    });
    
    // 找出核心爻（影响最大的爻）
    const coreLineIndex = this.findCoreLineIndex(hexagram, probabilities);
    
    return {
      lines,
      core_line: {
        position: coreLineIndex + 1,
        significance: this.getCoreLineSignificance(coreLineIndex, hexagram),
        interpretation: this.getCoreLineInterpretation(coreLineIndex, hexagram)
      },
      line_interaction: this.analyzeLineInteraction(hexagram)
    };
  }
  
  // 生成详细分析
  private static generateDetailedAnalysis(
    hexagram: Hexagram,
    innerMotivation: TrigramType,
    outerBehavior: TrigramType,
    probabilities: {
      inner_motivation: Record<TrigramType, number>;
      outer_behavior: Record<TrigramType, number>;
    }
  ): DetailedAnalysis {
    
    return {
      strengths: this.identifyStrengths(hexagram, innerMotivation, outerBehavior),
      challenges: this.identifyChallenges(hexagram, innerMotivation, outerBehavior),
      development_suggestions: this.generateDevelopmentSuggestions(hexagram, innerMotivation, outerBehavior),
      relationship_patterns: this.analyzeRelationshipPatterns(hexagram, innerMotivation, outerBehavior),
      career_guidance: this.generateCareerGuidance(hexagram, innerMotivation, outerBehavior),
      life_philosophy: this.generateLifePhilosophy(hexagram, innerMotivation, outerBehavior),
      recent_fortune: this.generateRecentFortune(hexagram, probabilities)
    };
  }
  
  // 生成关联分析
  private static generateRelatedAnalysis(hexagram: Hexagram): RelatedAnalysis {
    const relatedHexagrams = HexagramMapper.getRelatedHexagrams(hexagram);
    
    return {
      change_hexagrams: relatedHexagrams.change_hexagrams.slice(0, 3).map(h => ({
        hexagram: h,
        relationship: '变卦',
        meaning: this.getChangeHexagramMeaning(h, hexagram)
      })),
      opposite_hexagram: relatedHexagrams.opposite_hexagram ? {
        hexagram: relatedHexagrams.opposite_hexagram,
        relationship: '错卦',
        meaning: this.getOppositeHexagramMeaning(relatedHexagrams.opposite_hexagram)
      } : null,
      reverse_hexagram: relatedHexagrams.reverse_hexagram ? {
        hexagram: relatedHexagrams.reverse_hexagram,
        relationship: '综卦',
        meaning: this.getReverseHexagramMeaning(relatedHexagrams.reverse_hexagram)
      } : null,
      similar_hexagrams: this.findSimilarHexagrams(hexagram)
    };
  }
  
  // 辅助方法实现
  private static generateCorePersonality(inner: TrigramType, outer: TrigramType): string {
    const combinations: Record<string, string> = {
      'qian-qian': '天生的领导者，具有强烈的成就欲望和卓越的领导能力',
      'qian-kun': '外柔内刚，善于在稳定中寻求突破',
      'kun-qian': '内敛务实，但具备强大的执行力',
      'kun-kun': '温和包容，善于营造和谐稳定的环境',
      'zhen-zhen': '充满活力的创新者，敢于打破常规',
      'xun-dui': '善于沟通协调，具有很强的适应能力'
    };
    
    const key = `${inner}-${outer}`;
    return combinations[key] || `融合了${INNER_MOTIVATION_TYPES[inner]}和${OUTER_BEHAVIOR_TYPES[outer]}的独特人格`;
  }
  
  private static getMotivationDescription(motivation: TrigramType): string {
    const descriptions: Record<TrigramType, string> = {
      qian: '追求卓越和成就，渴望在所从事的领域中达到顶峰',
      kun: '寻求安全感和稳定性，重视和谐的人际关系',
      zhen: '热衷于创新和变革，喜欢探索新的可能性',
      xun: '善于适应环境变化，重视灵活性和包容性',
      kan: '专注于个人成长和深度学习，追求智慧和洞察力',
      li: '寻求生活的意义和价值，重视精神层面的满足',
      gen: '珍视稳定和持久，喜欢在熟悉的环境中深耕',
      dui: '重视人际连接和情感交流，享受与他人的互动'
    };
    
    return descriptions[motivation];
  }
  
  private static getBehaviorDescription(behavior: TrigramType): string {
    const descriptions: Record<TrigramType, string> = {
      qian: '表现出强烈的领导欲望，善于指导和激励他人',
      kun: '展现出包容和支持的特质，善于营造团队和谐',
      zhen: '行动力强，能够激发团队活力和创新精神',
      xun: '善于渗透和影响，能够巧妙地推动变化',
      kan: '深入分析问题，提供深刻的见解和解决方案',
      li: '善于启发和教导他人，传播正能量和智慧',
      gen: '提供稳定的支撑，善于保护和维护团队利益',
      dui: '创造愉悦的氛围，促进团队成员之间的和谐关系'
    };
    
    return descriptions[behavior];
  }
  
  private static generateOverallSummary(hexagram: Hexagram, inner: TrigramType, outer: TrigramType): string {
    return `你的人格卦象是${hexagram.name_zh}，体现了${INNER_MOTIVATION_TYPES[inner]}的内在驱动和${OUTER_BEHAVIOR_TYPES[outer]}的外在表现。这种组合使你在追求个人目标的同时，能够有效地与他人协作，是一个平衡内外、刚柔并济的人格类型。`;
  }
  
  private static getLineMeaning(position: number, isYang: boolean): string {
    const positions = ['初', '二', '三', '四', '五', '上'];
    const positionName = positions[position - 1];
    const lineType = isYang ? '阳爻' : '阴爻';
    
    const meanings: Record<number, Record<string, string>> = {
      1: { yang: '积极主动，勇于开始', yin: '谨慎稳重，善于准备' },
      2: { yang: '执行力强，善于实施', yin: '协调配合，善于支持' },
      3: { yang: '承上启下，善于沟通', yin: '灵活应变，善于调节' },
      4: { yang: '接近目标，善于把握', yin: '审慎决策，善于权衡' },
      5: { yang: '居中得正，善于领导', yin: '包容大度，善于统筹' },
      6: { yang: '功成身退，善于超脱', yin: '圆满完成，善于收尾' }
    };
    
    const type = isYang ? 'yang' : 'yin';
    return `${positionName}爻${lineType}：${meanings[position][type]}`;
  }
  
  private static getLineInfluence(position: number, isYang: boolean, probabilities: any): string {
    const influence = position <= 3 ? '内在影响' : '外在影响';
    const strength = isYang ? '强' : '柔';
    return `${influence}，表现为${strength}势特征`;
  }
  
  private static findCoreLineIndex(hexagram: Hexagram, probabilities: any): number {
    // 简化实现：返回第5爻（君位）或第2爻（臣位）
    return hexagram.lines[4] === 1 ? 4 : 1;
  }
  
  private static getCoreLineSignificance(index: number, hexagram: Hexagram): string {
    const positions = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
    return `${positions[index]}是此卦的核心，代表你人格中最重要的特质`;
  }
  
  private static getCoreLineInterpretation(index: number, hexagram: Hexagram): string {
    const isYang = hexagram.lines[index] === 1;
    const interpretations = [
      isYang ? '你具有强烈的开创精神' : '你善于在基础工作中发挥作用',
      isYang ? '你在执行层面表现出色' : '你善于协调和配合',
      isYang ? '你能够承担重要的沟通职责' : '你善于在变化中保持平衡',
      isYang ? '你接近成功，善于把握机会' : '你在决策时非常谨慎',
      isYang ? '你具有天然的领导才能' : '你善于统筹和包容',
      isYang ? '你知道何时功成身退' : '你善于完美收官'
    ];
    
    return interpretations[index];
  }
  
  private static analyzeLineInteraction(hexagram: Hexagram): string {
    const yangCount = hexagram.lines.filter(line => line === 1).length;
    const yinCount = 6 - yangCount;
    
    if (yangCount > yinCount) {
      return '阳爻较多，表现为主动进取的特质';
    } else if (yinCount > yangCount) {
      return '阴爻较多，表现为包容稳重的特质';
    } else {
      return '阴阳平衡，表现为刚柔并济的特质';
    }
  }
  
  private static identifyStrengths(hexagram: Hexagram, inner: TrigramType, outer: TrigramType): string[] {
    const innerTrigram = TRIGRAMS[inner];
    const outerTrigram = TRIGRAMS[outer];
    
    return [
      `内在${innerTrigram.attributes.join('、')}`,
      `外在${outerTrigram.attributes.join('、')}`,
      '能够平衡内外需求',
      '具有独特的人格魅力'
    ];
  }
  
  private static identifyChallenges(hexagram: Hexagram, inner: TrigramType, outer: TrigramType): string[] {
    return [
      '需要注意内外一致性',
      '避免过度追求完美',
      '学会在坚持与妥协间找到平衡',
      '注意情绪管理和压力释放'
    ];
  }
  
  private static generateDevelopmentSuggestions(hexagram: Hexagram, inner: TrigramType, outer: TrigramType): string[] {
    return [
      '培养自我觉察能力，了解内在动机',
      '练习有效沟通，提升人际关系质量',
      '设定清晰目标，制定可行计划',
      '保持学习心态，持续自我提升',
      '建立支持网络，寻求他人帮助'
    ];
  }
  
  private static analyzeRelationshipPatterns(hexagram: Hexagram, inner: TrigramType, outer: TrigramType): string {
    const innerTrigram = TRIGRAMS[inner];
    const outerTrigram = TRIGRAMS[outer];
    
    return `在人际关系中，你倾向于以${outerTrigram.attributes[0]}的方式与他人互动，内心追求${innerTrigram.attributes[0]}的连接。建议在关系中保持真实，同时尊重他人的不同需求。`;
  }
  
  private static generateCareerGuidance(hexagram: Hexagram, inner: TrigramType, outer: TrigramType): string {
    const motivationType = INNER_MOTIVATION_TYPES[inner];
    const behaviorType = OUTER_BEHAVIOR_TYPES[outer];
    
    return `基于你的${motivationType}和${behaviorType}特质，建议选择能够发挥这些优势的职业领域。重视工作中的成长机会和人际协作，寻找能够平衡个人发展和团队贡献的角色。`;
  }
  
  private static generateLifePhilosophy(hexagram: Hexagram, inner: TrigramType, outer: TrigramType): string {
    return `你的人生哲学体现在${hexagram.name_zh}的智慧中：既要有内在的坚持和追求，也要有外在的灵活和适应。在变化中保持本心，在坚持中拥抱变化。`;
  }
  
  private static generateRecentFortune(hexagram: Hexagram, probabilities: any): string {
    const fortuneTexts = [
      '近期运势平稳，适合稳步推进计划',
      '即将迎来新的机遇，保持开放心态',
      '需要注意人际关系的维护',
      '适合学习新技能，提升自我能力',
      '财运稳定，投资需谨慎',
      '健康状况良好，注意劳逸结合'
    ];
    
    // 基于卦象特征选择运势描述
    const index = hexagram.gua_number % fortuneTexts.length;
    return fortuneTexts[index];
  }
  
  private static getChangeHexagramMeaning(changeHex: Hexagram, originalHex: Hexagram): string {
    return `${changeHex.name_zh}代表你在特定情况下可能展现的另一面特质`;
  }
  
  private static getOppositeHexagramMeaning(oppositeHex: Hexagram): string {
    return `${oppositeHex.name_zh}代表与你互补的人格类型，可以从中学习平衡`;
  }
  
  private static getReverseHexagramMeaning(reverseHex: Hexagram): string {
    return `${reverseHex.name_zh}代表你在不同环境下的表现方式`;
  }
  
  private static findSimilarHexagrams(hexagram: Hexagram): Array<{hexagram: Hexagram, similarity: number, meaning: string}> {
    return HEXAGRAMS
      .filter(h => h.id !== hexagram.id)
      .map(h => ({
        hexagram: h,
        similarity: HexagramMapper.calculateSimilarity(hexagram, h),
        meaning: `${h.name_zh}与你有相似的特质`
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);
  }
  
  private static calculateConfidenceScore(probabilities: {
    inner_motivation: Record<TrigramType, number>;
    outer_behavior: Record<TrigramType, number>;
  }): number {
    // 获取最高概率值（已经在0-1范围内）
    const innerMax = Math.max(...Object.values(probabilities.inner_motivation));
    const outerMax = Math.max(...Object.values(probabilities.outer_behavior));
    
    // 确保概率值在0-1范围内
    const normalizedInnerMax = Math.min(Math.max(innerMax, 0), 1);
    const normalizedOuterMax = Math.min(Math.max(outerMax, 0), 1);
    
    // 计算置信度（0-100%）
    const confidence = (normalizedInnerMax + normalizedOuterMax) / 2 * 100;
    
    return Math.round(Math.min(confidence, 100));
  }
}

// 导出分析引擎实例
export const hexagramAnalysis = new HexagramAnalysisEngine();
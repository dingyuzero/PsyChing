import { TRIGRAMS } from '../data/hexagramDatabase';
import { Language, HexagramResult, TrigramType } from '../types';

const motivationTypeLabels: Record<TrigramType, { zh: string; en: string }> = {
  qian: { zh: '成就动机', en: 'achievement motivation' },
  kun: { zh: '安全动机', en: 'security motivation' },
  zhen: { zh: '创新动机', en: 'innovation motivation' },
  xun: { zh: '适应动机', en: 'adaptation motivation' },
  kan: { zh: '成长动机', en: 'growth motivation' },
  li: { zh: '意义动机', en: 'meaning motivation' },
  gen: { zh: '持守动机', en: 'stability motivation' },
  dui: { zh: '联结动机', en: 'connection motivation' }
};

const behaviorTypeLabels: Record<TrigramType, { zh: string; en: string }> = {
  qian: { zh: '引领型', en: 'leading style' },
  kun: { zh: '承载型', en: 'supportive style' },
  zhen: { zh: '激活型', en: 'activating style' },
  xun: { zh: '渗透型', en: 'influencing style' },
  kan: { zh: '深研型', en: 'analytical style' },
  li: { zh: '启迪型', en: 'inspiring style' },
  gen: { zh: '守成型', en: 'steady style' },
  dui: { zh: '共鸣型', en: 'harmonizing style' }
};

const motivationDescriptions: Record<TrigramType, { zh: string; en: string }> = {
  qian: {
    zh: '追求卓越和成就，渴望在所从事的领域中达到峰值。',
    en: 'Strives for excellence and achievement, with a strong desire to reach the top of a chosen field.'
  },
  kun: {
    zh: '更重视安全感、稳定性与和谐的人际承托。',
    en: 'Values safety, stability, and harmonious interpersonal support.'
  },
  zhen: {
    zh: '热衷创新与变化，喜欢主动打开新局面。',
    en: 'Is energized by innovation and change, and likes to initiate new momentum.'
  },
  xun: {
    zh: '善于适应环境变化，重视灵活性与持续调整。',
    en: 'Adapts well to changing environments and values flexibility and continuous adjustment.'
  },
  kan: {
    zh: '专注个人成长与深度学习，追求智慧和洞察。',
    en: 'Focuses on growth and deep learning, pursuing wisdom and insight.'
  },
  li: {
    zh: '追求意义感与表达价值，希望点亮自己也影响他人。',
    en: 'Seeks meaning and expressive value, hoping to illuminate both self and others.'
  },
  gen: {
    zh: '珍视稳定、边界与长期坚持，喜欢在熟悉秩序中深耕。',
    en: 'Values steadiness, boundaries, and long-term persistence, preferring deep work within a stable order.'
  },
  dui: {
    zh: '重视关系连接与情感交流，从互动中获得滋养。',
    en: 'Values connection and emotional exchange, drawing nourishment from interaction.'
  }
};

const behaviorDescriptions: Record<TrigramType, { zh: string; en: string }> = {
  qian: {
    zh: '表现出较强的引领欲望，善于定方向并激励他人。',
    en: 'Shows a strong tendency to lead, set direction, and energize others.'
  },
  kun: {
    zh: '展现出包容、支持与稳住局面的特质。',
    en: 'Shows receptiveness, support, and the ability to stabilize a situation.'
  },
  zhen: {
    zh: '行动力强，能够快速点燃节奏并推动变化。',
    en: 'Acts with strong momentum and can quickly trigger movement and change.'
  },
  xun: {
    zh: '更擅长用柔和、渗透式的方式影响环境。',
    en: 'Tends to influence the environment through gentle, penetrating action.'
  },
  kan: {
    zh: '擅长深入分析问题，提供谨慎而有洞察的判断。',
    en: 'Excels at deep analysis and offers careful, perceptive judgment.'
  },
  li: {
    zh: '善于表达、启发与照亮他人，具备感染力。',
    en: 'Expresses clearly, inspires others, and carries natural radiance.'
  },
  gen: {
    zh: '提供稳定支撑，做事克制而有边界感。',
    en: 'Provides steady support, acting with restraint and clear boundaries.'
  },
  dui: {
    zh: '创造轻松愉快的互动氛围，促进关系和谐。',
    en: 'Creates warm and enjoyable interaction, helping relationships feel harmonious.'
  }
};

const corePersonalityMap: Record<string, { zh: string; en: string }> = {
  'qian-qian': {
    zh: '天生的引领者，具有强烈的成就欲望和卓越的领导能力。',
    en: 'A natural leader with strong ambition and a pronounced capacity to guide others.'
  },
  'qian-kun': {
    zh: '外柔内刚，善于在稳定中寻找突破。',
    en: 'Soft in outward style but firm within, able to pursue breakthroughs from a stable base.'
  },
  'kun-qian': {
    zh: '内敛务实，但具备很强的执行力。',
    en: 'Reserved and grounded, yet highly capable in execution.'
  },
  'kun-kun': {
    zh: '温和包容，善于营造和谐稳定的环境。',
    en: 'Gentle and inclusive, with a talent for creating harmonious stability.'
  },
  'zhen-zhen': {
    zh: '充满活力的开拓者，敢于打破常规。',
    en: 'An energetic pioneer who is willing to break convention.'
  },
  'xun-dui': {
    zh: '善于沟通协调，具备很强的适应能力。',
    en: 'Communicative and diplomatic, with strong adaptive ability.'
  }
};

const linePositionLabels = {
  zh: ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'],
  en: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5', 'Line 6']
};

const lineMeaningMap: Record<number, { yang: { zh: string; en: string }; yin: { zh: string; en: string } }> = {
  1: {
    yang: { zh: '积极主动，勇于开始。', en: 'Active and willing to begin boldly.' },
    yin: { zh: '谨慎稳重，善于准备。', en: 'Cautious and steady, with good preparation.' }
  },
  2: {
    yang: { zh: '执行力强，善于落实。', en: 'Strong in execution and follow-through.' },
    yin: { zh: '协调配合，善于支持。', en: 'Cooperative and supportive.' }
  },
  3: {
    yang: { zh: '承上启下，善于沟通推进。', en: 'Bridges different sides and moves communication forward.' },
    yin: { zh: '灵活应变，善于调节。', en: 'Flexible and good at adjustment.' }
  },
  4: {
    yang: { zh: '接近目标，善于把握机会。', en: 'Close to the goal and able to seize opportunities.' },
    yin: { zh: '审慎决策，善于权衡。', en: 'Makes careful decisions and weighs trade-offs well.' }
  },
  5: {
    yang: { zh: '居中得正，善于领导。', en: 'Centered and fit for leadership.' },
    yin: { zh: '包容大度，善于统筹。', en: 'Inclusive and good at coordination.' }
  },
  6: {
    yang: { zh: '懂得适时收束与超脱。', en: 'Knows when to step back and complete a cycle.' },
    yin: { zh: '重视圆满收尾与整合。', en: 'Values closure, completion, and integration.' }
  }
};

const developmentSuggestions = {
  zh: [
    '培养自我觉察能力，更清楚自己真正的驱动力。',
    '练习更有效的表达与沟通，提升关系质量。',
    '设定清晰目标，并把行动拆成可持续的小步骤。',
    '保持学习和更新，让人格优势继续成长。',
    '建立支持网络，在关键阶段主动借力。'
  ],
  en: [
    'Build stronger self-awareness so your real motivations become clearer.',
    'Practice more effective communication to improve relationship quality.',
    'Set clear goals and break them into sustainable steps.',
    'Keep learning and updating so your strengths can keep growing.',
    'Build a support network and borrow strength when needed.'
  ]
};

const attentionPoints = {
  zh: [
    '注意保持内在动机与外在行为的一致性。',
    '避免因为过度追求理想而忽略现实节奏。',
    '学会在坚持与调整之间找到平衡。',
    '关注情绪管理与压力释放。'
  ],
  en: [
    'Keep your inner motivation aligned with your outward behavior.',
    'Avoid letting ideal standards disconnect you from practical rhythm.',
    'Learn to balance persistence with adjustment.',
    'Pay attention to emotional regulation and pressure release.'
  ]
};

const recentFortunes = {
  zh: [
    '近期整体节奏偏稳，适合把计划一步一步落地。',
    '你正接近新的机会，保持开放会更容易看到转机。',
    '人际协作会成为近期的重要变量，值得多投入一些耐心。',
    '这是适合补充能力、升级方法的阶段。',
    '财务与资源配置宜稳中求进。',
    '保持身心节律，会比单纯加速更有效。'
  ],
  en: [
    'Your recent rhythm is relatively steady, which is good for turning plans into action step by step.',
    'You are approaching new opportunities, and openness will help you notice them.',
    'Collaboration will be an important variable in the near term, so patience in relationships will pay off.',
    'This is a good stage for building capability and upgrading your methods.',
    'A steady, measured approach works best for resources and finances.',
    'Maintaining physical and mental rhythm will help more than simply pushing harder.'
  ]
};

const getTrigramTypeLabel = (trigram: TrigramType, kind: 'motivation' | 'behavior', language: Language) => {
  return kind === 'motivation'
    ? motivationTypeLabels[trigram][language]
    : behaviorTypeLabels[trigram][language];
};

export const getTrigramDisplayName = (trigram: string, language: Language) => {
  const data = TRIGRAMS[trigram as TrigramType];
  if (!data) {
    return trigram;
  }

  return language === 'zh' ? data.name_zh : data.name_en;
};

export const getHexagramDisplayName = (
  hexagram: { name_zh: string; name_en: string },
  language: Language
) => {
  return language === 'zh' ? hexagram.name_zh : hexagram.name_en;
};

const getCorePersonality = (inner: TrigramType, outer: TrigramType, language: Language) => {
  const key = `${inner}-${outer}`;
  const mapped = corePersonalityMap[key];
  if (mapped) {
    return mapped[language];
  }

  if (language === 'zh') {
    return `融合${getTrigramTypeLabel(inner, 'motivation', language)}与${getTrigramTypeLabel(outer, 'behavior', language)}的人格组合，既有内在驱动力，也有清晰的外在表达方式。`;
  }

  return `A personality pattern that blends ${getTrigramTypeLabel(inner, 'motivation', language)} with ${getTrigramTypeLabel(outer, 'behavior', language)}, combining inner drive with a distinct outward style.`;
};

const getRelationshipPatterns = (inner: TrigramType, outer: TrigramType, language: Language) => {
  const innerLabel = getTrigramDisplayName(inner, language);
  const outerLabel = getTrigramDisplayName(outer, language);

  if (language === 'zh') {
    return `在人际关系中，你通常以${outerLabel}式的方式表达自己，同时在内心保留${innerLabel}式的需要与判断。`;
  }

  return `In relationships, you tend to express yourself through a ${outerLabel}-like style while preserving ${innerLabel}-like needs and judgments inside.`;
};

const getCareerGuidance = (result: HexagramResult, inner: TrigramType, outer: TrigramType, language: Language) => {
  const hexagramName = getHexagramDisplayName(result.hexagram, language);
  const motivation = getTrigramTypeLabel(inner, 'motivation', language);
  const behavior = getTrigramTypeLabel(outer, 'behavior', language);

  if (language === 'zh') {
    return `基于${hexagramName}所体现的${motivation}与${behavior}特征，你更适合那些既需要持续成长、又能发挥个人风格与协作价值的角色。`;
  }

  return `Based on the ${hexagramName} pattern, your ${motivation} and ${behavior} make you especially suited to roles that require growth, personal style, and collaborative value.`;
};

const getLifePhilosophy = (result: HexagramResult, language: Language) => {
  const hexagramName = getHexagramDisplayName(result.hexagram, language);

  if (language === 'zh') {
    return `${hexagramName}提醒你，在变化中守住核心，在坚持中保留弹性，让力量与顺势同时存在。`;
  }

  return `${hexagramName} suggests holding onto your core while staying flexible, allowing strength and adaptability to coexist.`;
};

const getLineMeaning = (position: number, isYang: boolean, language: Language) => {
  const type = isYang ? 'yang' : 'yin';
  const label = linePositionLabels[language][position - 1];
  const meaning = lineMeaningMap[position][type][language];

  if (language === 'zh') {
    return `${label}${isYang ? '阳爻' : '阴爻'}，${meaning}`;
  }

  return `${label} ${isYang ? 'yang line' : 'yin line'}: ${meaning}`;
};

const getLineInfluence = (position: number, isYang: boolean, language: Language) => {
  if (language === 'zh') {
    return `${position <= 3 ? '偏向内在影响' : '偏向外在影响'}，整体呈现${isYang ? '更主动' : '更柔和'}的作用方式。`;
  }

  return `${position <= 3 ? 'More inwardly influential' : 'More outwardly influential'}, showing a ${isYang ? 'more active' : 'more receptive'} pattern.`;
};

const getHexagramChangeMeaning = (
  type: 'reverse' | 'opposite',
  hexagram: { name_zh: string; name_en: string },
  language: Language
) => {
  const name = getHexagramDisplayName(hexagram, language);

  if (type === 'reverse') {
    return language === 'zh'
      ? `${name}揭示了你在另一种人生情境下可能浮现出的潜在面向。`
      : `${name} reveals a potential side of you that may emerge in a different life context.`;
  }

  return language === 'zh'
    ? `${name}提示了与你互补、值得整合进来的人格资源。`
    : `${name} points to complementary traits and resources that are worth integrating.`;
};

export const localizeHexagramResult = (result: HexagramResult, language: Language) => {
  const inner = result.hexagram.lower_trigram as TrigramType;
  const outer = result.hexagram.upper_trigram as TrigramType;
  const hexagramName = getHexagramDisplayName(result.hexagram, language);

  return {
    hexagramName,
    upperTrigramName: getTrigramDisplayName(outer, language),
    lowerTrigramName: getTrigramDisplayName(inner, language),
    basicAnalysis: {
      corePersonality: getCorePersonality(inner, outer, language),
      advantageTraits: [motivationDescriptions[inner][language]],
      challengeAreas: [behaviorDescriptions[outer][language]]
    },
    detailedAnalysis: {
      developmentSuggestions: developmentSuggestions[language],
      attentionPoints: attentionPoints[language],
      relationshipPatterns: getRelationshipPatterns(inner, outer, language),
      careerGuidance: getCareerGuidance(result, inner, outer, language),
      lifePhilosophy: getLifePhilosophy(result, language),
      recentFortune: recentFortunes[language][result.hexagram.gua_number % recentFortunes[language].length]
    },
    lineAnalysis: {
      lines: result.hexagram.lines.map((line, index) => ({
        position: index + 1,
        meaning: getLineMeaning(index + 1, line === 1, language),
        influence: getLineInfluence(index + 1, line === 1, language)
      })),
      coreLineSignificance:
        language === 'zh'
          ? `${linePositionLabels.zh[(result.lineAnalysis.coreLineIndex || 1) - 1] || '核心爻'}代表了你人格结构里最需要被看见的力量。`
          : `${linePositionLabels.en[(result.lineAnalysis.coreLineIndex || 1) - 1] || 'Core line'} represents the force in your personality structure that most deserves attention.`,
      lineInteraction:
        language === 'zh'
          ? '六爻之间体现了你在内外世界中协调力量、节奏与边界的方式。'
          : 'The interaction among the six lines reflects how you coordinate energy, rhythm, and boundaries between your inner and outer worlds.'
    },
    relatedHexagrams: {
      reverseMeaning: result.relatedHexagrams.reverseHexagram
        ? getHexagramChangeMeaning('reverse', result.relatedHexagrams.reverseHexagram.hexagram, language)
        : '',
      oppositeMeaning: result.relatedHexagrams.oppositeHexagram
        ? getHexagramChangeMeaning('opposite', result.relatedHexagrams.oppositeHexagram.hexagram, language)
        : ''
    },
    summary:
      language === 'zh'
        ? `${hexagramName}体现了${getTrigramTypeLabel(inner, 'motivation', language)}与${getTrigramTypeLabel(outer, 'behavior', language)}的组合。下卦${getTrigramDisplayName(inner, language)}对应你的内在驱动力，上卦${getTrigramDisplayName(outer, language)}对应你的外在表达方式。`
        : `${hexagramName} reflects a combination of ${getTrigramTypeLabel(inner, 'motivation', language)} and ${getTrigramTypeLabel(outer, 'behavior', language)}. The lower trigram ${getTrigramDisplayName(inner, language)} points to inner drive, while the upper trigram ${getTrigramDisplayName(outer, language)} shows outward expression.`
  };
};

import { Answer, Hexagram, PersonalityAnalysis, HexagramAnalysis, HexagramResult } from '../types';

// 64卦基础数据
const HEXAGRAMS: Record<string, Omit<Hexagram, 'lines'>> = {
  '111111': { name_en: 'Qian', name_zh: '乾', chineseName: '乾', symbol: '☰☰', description: '天天乾', upperTrigram: '乾', lowerTrigram: '乾', number: 1 },
  '000000': { name_en: 'Kun', name_zh: '坤', chineseName: '坤', symbol: '☷☷', description: '地地坤', upperTrigram: '坤', lowerTrigram: '坤', number: 2 },
  '100010': { name_en: 'Zhun', name_zh: '屯', chineseName: '屯', symbol: '☳☵', description: '云雷屯，君子以经纶', upperTrigram: '坎', lowerTrigram: '震', number: 3 },
  '010001': { name_en: 'Meng', name_zh: '蒙', chineseName: '蒙', symbol: '☶☵', description: '山下出泉，蒙', upperTrigram: '艮', lowerTrigram: '坎', number: 4 },
  '111010': { name_en: 'Xu', name_zh: '需', chineseName: '需', symbol: '☰☵', description: '云上于天，需', upperTrigram: '乾', lowerTrigram: '坎', number: 5 },
  '010111': { name_en: 'Song', name_zh: '讼', chineseName: '讼', symbol: '☵☰', description: '天与水违行，讼', upperTrigram: '坎', lowerTrigram: '乾', number: 6 },
  '010000': { name_en: 'Shi', name_zh: '师', chineseName: '师', symbol: '☷☵', description: '地中有水，师', upperTrigram: '坤', lowerTrigram: '坎', number: 7 },
  '000010': { name_en: 'Bi', name_zh: '比', chineseName: '比', symbol: '☵☷', description: '水在地上，比', upperTrigram: '坎', lowerTrigram: '坤', number: 8 },
  '111011': { name_en: 'Xiaoxu', name_zh: '小畜', chineseName: '小畜', symbol: '☰☴', description: '风行天上，小畜', upperTrigram: '乾', lowerTrigram: '巽', number: 9 },
  '110111': { name_en: 'Lu', name_zh: '履', chineseName: '履', symbol: '☰☱', description: '天下有泽，履', upperTrigram: '乾', lowerTrigram: '兑', number: 10 },
  '111000': { name_en: 'Tai', name_zh: '泰', chineseName: '泰', symbol: '☷☰', description: '天地交，泰', upperTrigram: '坤', lowerTrigram: '乾', number: 11 },
  '000111': { name_en: 'Pi', name_zh: '否', chineseName: '否', symbol: '☰☷', description: '天地不交，否', upperTrigram: '乾', lowerTrigram: '坤', number: 12 },
  '101111': { name_en: 'Tongren', name_zh: '同人', chineseName: '同人', symbol: '☰☲', description: '天与火，同人', upperTrigram: '乾', lowerTrigram: '离', number: 13 },
  '111101': { name_en: 'Dayou', name_zh: '大有', chineseName: '大有', symbol: '☲☰', description: '火在天上，大有', upperTrigram: '离', lowerTrigram: '乾', number: 14 },
  '001000': { name_en: 'Qian', name_zh: '谦', chineseName: '谦', symbol: '☷☶', description: '地中有山，谦', upperTrigram: '坤', lowerTrigram: '艮', number: 15 },
  '000100': { name_en: 'Yu', name_zh: '豫', chineseName: '豫', symbol: '☳☷', description: '雷出地奋，豫', upperTrigram: '震', lowerTrigram: '坤', number: 16 },
  '100110': { name_en: 'Sui', name_zh: '随', chineseName: '随', symbol: '☱☳', description: '泽雷随', upperTrigram: '兑', lowerTrigram: '震', number: 17 },
  '011001': { name_en: 'Gu', name_zh: '蛊', chineseName: '蛊', symbol: '☶☴', description: '山风蛊', upperTrigram: '艮', lowerTrigram: '巽', number: 18 },
  '110000': { name_en: 'Lin', name_zh: '临', chineseName: '临', symbol: '☷☱', description: '地上有泽，临', upperTrigram: '坤', lowerTrigram: '兑', number: 19 },
  '000011': { name_en: 'Guan', name_zh: '观', chineseName: '观', symbol: '☴☷', description: '风行地上，观', upperTrigram: '巽', lowerTrigram: '坤', number: 20 },
  '100101': { name_en: 'Shihe', name_zh: '噬嗑', chineseName: '噬嗑', symbol: '☲☳', description: '火雷噬嗑', upperTrigram: '离', lowerTrigram: '震', number: 21 },
  '101001': { name_en: 'Bi', name_zh: '贲', chineseName: '贲', symbol: '☶☲', description: '山下有火，贲', upperTrigram: '艮', lowerTrigram: '离', number: 22 },
  '000001': { name_en: 'Bo', name_zh: '剥', chineseName: '剥', symbol: '☶☷', description: '山附于地，剥', upperTrigram: '艮', lowerTrigram: '坤', number: 23 },
  '100000': { name_en: 'Fu', name_zh: '复', chineseName: '复', symbol: '☷☳', description: '地雷复', upperTrigram: '坤', lowerTrigram: '震', number: 24 },
  '100111': { name_en: 'Wuwang', name_zh: '无妄', chineseName: '无妄', symbol: '☰☳', description: '天雷无妄', upperTrigram: '乾', lowerTrigram: '震', number: 25 },
  '111001': { name_en: 'Daxu', name_zh: '大畜', chineseName: '大畜', symbol: '☶☰', description: '山天大畜', upperTrigram: '艮', lowerTrigram: '乾', number: 26 },
  '100001': { name_en: 'Yi', name_zh: '颐', chineseName: '颐', symbol: '☶☳', description: '山雷颐', upperTrigram: '艮', lowerTrigram: '震', number: 27 },
  '011110': { name_en: 'Daguo', name_zh: '大过', chineseName: '大过', symbol: '☱☴', description: '泽风大过', upperTrigram: '兑', lowerTrigram: '巽', number: 28 },
  '010010': { name_en: 'Kan', name_zh: '坎', chineseName: '坎', symbol: '☵', description: '习坎', upperTrigram: '坎', lowerTrigram: '坎', number: 29 },
  '101101': { name_en: 'Li', name_zh: '离', chineseName: '离', symbol: '☲', description: '离为火', upperTrigram: '离', lowerTrigram: '离', number: 30 },
  '001110': { name_en: 'Xian', name_zh: '咸', chineseName: '咸', symbol: '☱☶', description: '泽山咸', upperTrigram: '兑', lowerTrigram: '艮', number: 31 },
  '011100': { name_en: 'Heng', name_zh: '恒', chineseName: '恒', symbol: '☳☴', description: '雷风恒', upperTrigram: '震', lowerTrigram: '巽', number: 32 },
  '001111': { name_en: 'Dun', name_zh: '遁', chineseName: '遁', symbol: '☰☶', description: '天下有山，遁', upperTrigram: '乾', lowerTrigram: '艮', number: 33 },
  '111100': { name_en: 'Dazhuang', name_zh: '大壮', chineseName: '大壮', symbol: '☳☰', description: '雷在天上，大壮', upperTrigram: '震', lowerTrigram: '乾', number: 34 },
  '000101': { name_en: 'Jin', name_zh: '晋', chineseName: '晋', symbol: '☲☷', description: '火在地上，晋', upperTrigram: '离', lowerTrigram: '坤', number: 35 },
  '101000': { name_en: 'Mingyi', name_zh: '明夷', chineseName: '明夷', symbol: '☷☲', description: '地下有火，明夷', upperTrigram: '坤', lowerTrigram: '离', number: 36 },
  '101011': { name_en: 'Jiaren', name_zh: '家人', chineseName: '家人', symbol: '☴☲', description: '风自火出，家人', upperTrigram: '巽', lowerTrigram: '离', number: 37 },
  '110101': { name_en: 'Kui', name_zh: '睽', chineseName: '睽', symbol: '☲☴', description: '火上有泽，睽', upperTrigram: '离', lowerTrigram: '巽', number: 38 },
  '001010': { name_en: 'Jian', name_zh: '蹇', chineseName: '蹇', symbol: '☵☶', description: '水在山上，蹇', upperTrigram: '坎', lowerTrigram: '艮', number: 39 },
  '010100': { name_en: 'Jie', name_zh: '解', chineseName: '解', symbol: '☳☵', description: '雷水解', upperTrigram: '震', lowerTrigram: '坎', number: 40 },
  '110001': { name_en: 'Sun', name_zh: '损', chineseName: '损', symbol: '☶☱', description: '山下有泽，损', upperTrigram: '艮', lowerTrigram: '兑', number: 41 },
  '100011': { name_en: 'Yi', name_zh: '益', chineseName: '益', symbol: '☴☳', description: '风雷益', upperTrigram: '巽', lowerTrigram: '震', number: 42 },
  '111110': { name_en: 'Guai', name_zh: '夬', chineseName: '夬', symbol: '☱☰', description: '泽上于天，夬', upperTrigram: '兑', lowerTrigram: '乾', number: 43 },
  '011111': { name_en: 'Gou', name_zh: '姤', chineseName: '姤', symbol: '☰☴', description: '天下有风，姤', upperTrigram: '乾', lowerTrigram: '巽', number: 44 },
  '000110': { name_en: 'Cui', name_zh: '萃', chineseName: '萃', symbol: '☱☷', description: '泽上于地，萃', upperTrigram: '兑', lowerTrigram: '坤', number: 45 },
  '011000': { name_en: 'Sheng', name_zh: '升', chineseName: '升', symbol: '☷☴', description: '地中生木，升', upperTrigram: '坤', lowerTrigram: '巽', number: 46 },
  '010110': { name_en: 'Kun', name_zh: '困', chineseName: '困', symbol: '☱☵', description: '泽无水，困', upperTrigram: '兑', lowerTrigram: '坎', number: 47 },
  '011010': { name_en: 'Jing', name_zh: '井', chineseName: '井', symbol: '☵☴', description: '水上有木，井', upperTrigram: '坎', lowerTrigram: '巽', number: 48 },
  '101110': { name_en: 'Ge', name_zh: '革', chineseName: '革', symbol: '☱☲', description: '泽中有火，革', upperTrigram: '兑', lowerTrigram: '离', number: 49 },
  '011101': { name_en: 'Ding', name_zh: '鼎', chineseName: '鼎', symbol: '☲☴', description: '火上有木，鼎', upperTrigram: '离', lowerTrigram: '巽', number: 50 },
  '100100': { name_en: 'Zhen', name_zh: '震', chineseName: '震', symbol: '☳', description: '震为雷', upperTrigram: '震', lowerTrigram: '震', number: 51 },
  '001001': { name_en: 'Gen', name_zh: '艮', chineseName: '艮', symbol: '☶', description: '艮为山', upperTrigram: '艮', lowerTrigram: '艮', number: 52 },
  '001011': { name_en: 'Jian', name_zh: '渐', chineseName: '渐', symbol: '☴☶', description: '风山渐', upperTrigram: '巽', lowerTrigram: '艮', number: 53 },
  '110100': { name_en: 'Guimei', name_zh: '归妹', chineseName: '归妹', symbol: '☳☱', description: '雷泽归妹', upperTrigram: '震', lowerTrigram: '兑', number: 54 },
  '101100': { name_en: 'Feng', name_zh: '丰', chineseName: '丰', symbol: '☳☲', description: '雷火丰', upperTrigram: '震', lowerTrigram: '离', number: 55 },
  '001101': { name_en: 'Lu', name_zh: '旅', chineseName: '旅', symbol: '☲☶', description: '火山旅', upperTrigram: '离', lowerTrigram: '艮', number: 56 },
  '011011': { name_en: 'Xun', name_zh: '巽', chineseName: '巽', symbol: '☴', description: '巽为风', upperTrigram: '巽', lowerTrigram: '巽', number: 57 },
  '110110': { name_en: 'Dui', name_zh: '兑', chineseName: '兑', symbol: '☱', description: '兑为泽', upperTrigram: '兑', lowerTrigram: '兑', number: 58 },
  '010011': { name_en: 'Huan', name_zh: '涣', chineseName: '涣', symbol: '☴☵', description: '风水涣', upperTrigram: '巽', lowerTrigram: '坎', number: 59 },
  '110010': { name_en: 'Jie', name_zh: '节', chineseName: '节', symbol: '☵☱', description: '水泽节', upperTrigram: '坎', lowerTrigram: '兑', number: 60 },
  '110011': { name_en: 'Zhongfu', name_zh: '中孚', chineseName: '中孚', symbol: '☴☱', description: '风泽中孚', upperTrigram: '巽', lowerTrigram: '兑', number: 61 },
  '001100': { name_en: 'Xiaoguo', name_zh: '小过', chineseName: '小过', symbol: '☳☶', description: '雷山小过', upperTrigram: '震', lowerTrigram: '艮', number: 62 },
  '101010': { name_en: 'Jiji', name_zh: '既济', chineseName: '既济', symbol: '☵☲', description: '水火既济', upperTrigram: '坎', lowerTrigram: '离', number: 63 },
  '010101': { name_en: 'Weiji', name_zh: '未济', chineseName: '未济', symbol: '☲☵', description: '火水未济', upperTrigram: '离', lowerTrigram: '坎', number: 64 }
};

// 八卦基础属性及心理维度映射
const TRIGRAMS = {
  '111': { 
    name: '乾', 
    element: 'metal', 
    nature: 'creative', 
    energy: 'yang',
    motivationType: '成就动机', // 下卦时的动机类型
    behaviorPattern: '领导型' // 上卦时的行为模式
  },
  '000': { 
    name: '坤', 
    element: 'earth', 
    nature: 'receptive', 
    energy: 'yin',
    motivationType: '安全动机',
    behaviorPattern: '支持型'
  },
  '100': { 
    name: '震', 
    element: 'wood', 
    nature: 'arousing', 
    energy: 'yang',
    motivationType: '创新动机',
    behaviorPattern: '行动型'
  },
  '010': { 
    name: '坎', 
    element: 'water', 
    nature: 'dangerous', 
    energy: 'yin',
    motivationType: '成长动机',
    behaviorPattern: '适应型'
  },
  '001': { 
    name: '艮', 
    element: 'earth', 
    nature: 'keeping-still', 
    energy: 'yang',
    motivationType: '稳定动机',
    behaviorPattern: '谨慎型'
  },
  '011': { 
    name: '巽', 
    element: 'wood', 
    nature: 'gentle', 
    energy: 'yin',
    motivationType: '和谐动机',
    behaviorPattern: '协调型'
  },
  '110': { 
    name: '离', 
    element: 'fire', 
    nature: 'clinging', 
    energy: 'yin',
    motivationType: '表达动机',
    behaviorPattern: '表达型'
  },
  '101': { 
    name: '兑', 
    element: 'metal', 
    nature: 'joyous', 
    energy: 'yang',
    motivationType: '交流动机',
    behaviorPattern: '社交型'
  }
};

// 新的心理维度映射系统：上下卦分别对应外在表现和内在基础
const PSYCHOLOGICAL_DIMENSIONS = {
  // 内在基础（下卦）- 动机类型
  innerFoundation: {
    '111': '成就动机', // 乾：追求成功和卓越
    '000': '安全动机', // 坤：寻求稳定和保障
    '100': '创新动机', // 震：追求变化和突破
    '010': '成长动机', // 坎：渴望学习和发展
    '001': '稳定动机', // 艮：追求秩序和控制
    '011': '和谐动机', // 巽：寻求平衡和协调
    '110': '表达动机', // 离：渴望展示和认可
    '101': '交流动机'  // 兑：追求沟通和连接
  },
  // 外在表现（上卦）- 行为模式
  outerExpression: {
    '111': '领导型', // 乾：主导和指挥
    '000': '支持型', // 坤：配合和辅助
    '100': '行动型', // 震：积极和主动
    '010': '适应型', // 坎：灵活和应变
    '001': '谨慎型', // 艮：稳重和保守
    '011': '协调型', // 巽：温和和协作
    '110': '表达型', // 离：开放和展示
    '101': '社交型'  // 兑：友善和交际
  }
};

// 根据答案计算卦象（新的三层映射策略）
export const calculateHexagram = (answers: Answer[]): Hexagram => {
  // 第一层：上下卦粗筛（2维）
  const { lowerTrigram, upperTrigram } = calculateTrigramsFromAnswers(answers);
  
  // 生成完整的六爻
  const lines: boolean[] = [
    ...lowerTrigram.split('').map(bit => bit === '1'),
    ...upperTrigram.split('').map(bit => bit === '1')
  ];
  
  // 生成卦象二进制字符串（从上到下）
  const hexagramBinary = upperTrigram + lowerTrigram;
  
  // 查找对应的卦象
  const hexagramData = HEXAGRAMS[hexagramBinary] || HEXAGRAMS['111111'];
  
  return {
    ...hexagramData,
    lines: lines.map(l => l ? 1 : 0)
  };
};

// 从答案中计算上下卦
const calculateTrigramsFromAnswers = (answers: Answer[]): { lowerTrigram: string; upperTrigram: string } => {
  // 分离内在基础和外在表现的问题
  const innerAnswers = answers.filter(answer => isInnerFoundationQuestion(answer.question_id));
  const outerAnswers = answers.filter(answer => isOuterExpressionQuestion(answer.question_id));
  
  // 计算内在基础得分（下卦）
  const innerScores = calculateDimensionScores(innerAnswers, 'inner');
  const lowerTrigram = determineTrigramFromScores(innerScores);
  
  // 计算外在表现得分（上卦）
  const outerScores = calculateDimensionScores(outerAnswers, 'outer');
  const upperTrigram = determineTrigramFromScores(outerScores);
  
  return { lowerTrigram, upperTrigram };
};

// 判断是否为内在基础问题
const isInnerFoundationQuestion = (questionId: string): boolean => {
  // 根据问题ID的特征判断，这里简化处理
  const hash = questionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return hash % 2 === 0; // 偶数为内在基础问题
};

// 判断是否为外在表现问题
const isOuterExpressionQuestion = (questionId: string): boolean => {
  return !isInnerFoundationQuestion(questionId);
};

// 计算维度得分
const calculateDimensionScores = (answers: Answer[], type: 'inner' | 'outer'): Record<string, number> => {
  const scores: Record<string, number> = {};
  
  answers.forEach(answer => {
    const dimension = getDimensionFromAnswer(answer, type);
    const score = normalizeAnswerValue(answer.option_id);
    
    if (!scores[dimension]) {
      scores[dimension] = 0;
    }
    scores[dimension] += score;
  });
  
  return scores;
};

// 根据得分确定三爻卦
const determineTrigramFromScores = (scores: Record<string, number>): string => {
  // 将得分转换为三个维度
  const dimensions = Object.keys(scores);
  const trigram = ['0', '0', '0'];
  
  // 根据得分高低确定每一爻
  dimensions.forEach((dimension, index) => {
    if (index < 3 && scores[dimension] > 0.5) {
      trigram[index] = '1';
    }
  });
  
  // 如果没有足够的维度，使用默认逻辑
  if (dimensions.length === 0) {
    return '111'; // 默认乾卦
  }
  
  // 根据主导维度确定卦象
  const dominantDimension = dimensions.reduce((a, b) => scores[a] > scores[b] ? a : b);
  const trigramMap: Record<string, string> = {
    '成就动机': '111', '安全动机': '000', '创新动机': '100', '成长动机': '010',
    '稳定动机': '001', '和谐动机': '011', '表达动机': '110', '交流动机': '101',
    '领导型': '111', '支持型': '000', '行动型': '100', '适应型': '010',
    '谨慎型': '001', '协调型': '011', '表达型': '110', '社交型': '101'
  };
  
  return trigramMap[dominantDimension] || '111';
};

// 爻辞数据
const LINE_TEXTS: Record<string, string[]> = {
  '乾': [
    '初九：潜龙勿用。',
    '九二：见龙在田，利见大人。',
    '九三：君子终日乾乾，夕惕若厉，无咎。',
    '九四：或跃在渊，无咎。',
    '九五：飞龙在天，利见大人。',
    '上九：亢龙有悔。'
  ],
  '坤': [
    '初六：履霜，坚冰至。',
    '六二：直方大，不习无不利。',
    '六三：含章可贞，或从王事，无成有终。',
    '六四：括囊，无咎无誉。',
    '六五：黄裳，元吉。',
    '上六：龙战于野，其血玄黄。'
  ],
  '离': [
    '初九：履错然，敬之无咎。',
    '六二：黄离，元吉。',
    '九三：日昃之离，不鼓缶而歌，则大耋之嗟，凶。',
    '九四：突如其来如，焚如，死如，弃如。',
    '六五：出涕沱若，戚嗟若，吉。',
    '上九：王用出征，有嘉折首，获匪其丑，无咎。'
  ]
};

// 卦变关系
const HEXAGRAM_RELATIONS: Record<string, { 
  complementary?: string; // 综卦
  opposite?: string; // 错卦
  mutual?: string; // 互卦
}> = {
  '乾': { complementary: '坤', opposite: '坤' },
  '坤': { complementary: '乾', opposite: '乾' },
  '离': { complementary: '坎', opposite: '坎' },
  '坎': { complementary: '离', opposite: '离' }
};

// 第二层：关键爻位细化
export const analyzeKeyLines = (hexagram: Hexagram, answers: Answer[]): { lineIndex: number; text: string; interpretation: string }[] => {
  const keyLines: { lineIndex: number; text: string; interpretation: string }[] = [];
  
  // 分析每一爻的强度
  const lineStrengths = hexagram.lines.map((line, index) => {
    const relatedAnswers = answers.filter((_, answerIndex) => answerIndex % 6 === index);
    const strength = relatedAnswers.reduce((sum, answer) => sum + normalizeAnswerValue(answer.option_id), 0) / relatedAnswers.length;
    return { index, strength, isYang: line === 1 };
  });
  
  // 找出最突出的1-2个爻位
  const sortedLines = lineStrengths.sort((a, b) => Math.abs(b.strength - 0.5) - Math.abs(a.strength - 0.5));
  const topLines = sortedLines.slice(0, 2);
  
  topLines.forEach(line => {
    const lineTexts = LINE_TEXTS[hexagram.name_zh] || [];
    const text = lineTexts[line.index] || `第${line.index + 1}爻`;
    const interpretation = interpretLine(line, hexagram.name_zh);
    
    keyLines.push({
      lineIndex: line.index,
      text,
      interpretation
    });
  });
  
  return keyLines;
};

// 解释爻位含义
const interpretLine = (line: { index: number; strength: number; isYang: boolean }, hexagramName: string): string => {
  const position = ['初', '二', '三', '四', '五', '上'][line.index];
  const nature = line.isYang ? '阳' : '阴';
  
  if (hexagramName === '离' && line.index === 3) {
    return '警示激情过度可能导致burnout，需要学会控制情绪和能量的释放。';
  }
  
  if (line.strength > 0.7) {
    return `${position}爻${nature}性特质突出，在此位置表现出强烈的能量和影响力。`;
  } else if (line.strength < 0.3) {
    return `${position}爻${nature}性特质较弱，需要在此方面加强发展。`;
  } else {
    return `${position}爻${nature}性特质平衡，在此位置保持适中的状态。`;
  }
};

// 第三层：卦变网络关联
export const analyzeHexagramRelations = (hexagram: Hexagram): { type: string; name: string; advice: string }[] => {
  const relations: { type: string; name: string; advice: string }[] = [];
  const hexagramRelations = HEXAGRAM_RELATIONS[hexagram.name_zh];
  
  if (hexagramRelations?.complementary) {
    relations.push({
      type: '综卦',
      name: hexagramRelations.complementary,
      advice: getComplementaryAdvice(hexagram.name_zh, hexagramRelations.complementary)
    });
  }
  
  if (hexagramRelations?.opposite) {
    relations.push({
      type: '错卦',
      name: hexagramRelations.opposite,
      advice: getOppositeAdvice(hexagram.name_zh, hexagramRelations.opposite)
    });
  }
  
  return relations;
};

// 获取综卦建议
const getComplementaryAdvice = (mainHexagram: string, complementary: string): string => {
  const adviceMap: Record<string, string> = {
    '离-坎': '学习平衡未完成状态中的耐心，火与水的调和能带来内心的平静。',
    '乾-坤': '在刚健中融入柔顺，在领导中学会包容和倾听。',
    '坤-乾': '在柔顺中培养主动性，在配合中发展自己的领导能力。'
  };
  
  return adviceMap[`${mainHexagram}-${complementary}`] || `从${complementary}卦的角度审视当前状况，寻求不同的视角和平衡。`;
};

// 获取错卦建议
const getOppositeAdvice = (mainHexagram: string, opposite: string): string => {
  const adviceMap: Record<string, string> = {
    '离-坎': '注意情感表达的盲点，避免过度外露而忽视内在的深度思考。',
    '乾-坤': '警惕过度刚强的盲点，需要培养包容和接纳的能力。',
    '坤-乾': '注意过度被动的盲点，需要培养主动性和决断力。'
  };
  
  return adviceMap[`${mainHexagram}-${opposite}`] || `${opposite}卦提示了你可能忽视的方面，需要特别关注和平衡。`;
};

// 从答案中提取心理维度
const getDimensionFromAnswer = (answer: Answer, type: 'inner' | 'outer'): string => {
  // 根据问题ID和类型确定对应的心理维度
  const hash = answer.question_id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  if (type === 'inner') {
    // 内在基础 - 动机类型
    const motivationTypes = ['成就动机', '安全动机', '创新动机', '成长动机', '稳定动机', '和谐动机', '表达动机', '交流动机'];
    return motivationTypes[hash % motivationTypes.length];
  } else {
    // 外在表现 - 行为模式
    const behaviorPatterns = ['领导型', '支持型', '行动型', '适应型', '谨慎型', '协调型', '表达型', '社交型'];
    return behaviorPatterns[hash % behaviorPatterns.length];
  }
};

// 标准化答案值到0-1范围
const normalizeAnswerValue = (value: string | string[] | number): number => {
  if (typeof value === 'number') {
    return Math.max(0, Math.min(1, value / 10)); // 假设量表是1-10
  }
  
  if (typeof value === 'string') {
    // 简单的字符串到数值映射
    const stringValue = value.toLowerCase();
    if (stringValue.includes('强烈同意') || stringValue.includes('非常')) return 1;
    if (stringValue.includes('同意') || stringValue.includes('是')) return 0.8;
    if (stringValue.includes('中性') || stringValue.includes('一般')) return 0.5;
    if (stringValue.includes('不同意') || stringValue.includes('否')) return 0.2;
    return 0;
  }
  
  if (Array.isArray(value)) {
    return value.length / 5; // 假设最多5个选项
  }
  
  return 0.5; // 默认值
};

// 生成完整的卦象分析（三层映射策略）
export const generateHexagramAnalysis = (answers: Answer[]): HexagramAnalysis => {
  // 首先根据答案计算卦象
  const hexagram = calculateHexagram(answers);
  // 第一层：上下卦粗筛
  const lowerTrigramBinary = hexagram.lines.slice(0, 3).map(l => l ? '1' : '0').join('');
  const upperTrigramBinary = hexagram.lines.slice(3, 6).map(l => l ? '1' : '0').join('');
  
  const lowerTrigram = TRIGRAMS[lowerTrigramBinary as keyof typeof TRIGRAMS];
  const upperTrigram = TRIGRAMS[upperTrigramBinary as keyof typeof TRIGRAMS];
  
  const innerFoundation = lowerTrigram?.motivationType || '未知动机';
  const outerExpression = upperTrigram?.behaviorPattern || '未知模式';
  
  // 第二层：关键爻位细化
  const keyLinesRaw = analyzeKeyLines(hexagram, answers);
  const keyLines = keyLinesRaw.map(line => ({
    position: ['初', '二', '三', '四', '五', '上'][line.lineIndex],
    name: `${['初', '二', '三', '四', '五', '上'][line.lineIndex]}${hexagram.lines[line.lineIndex] ? '九' : '六'}`,
    text: line.text,
    interpretation: line.interpretation
  }));
  
  // 第三层：卦变网络关联
  const relationsList = analyzeHexagramRelations(hexagram);
  
  // 转换关系数据格式
  const relations: { complementary?: { name: string; advice: string }; opposite?: { name: string; advice: string } } = {};
  relationsList.forEach(rel => {
    if (rel.type === '综卦') {
      relations.complementary = { name: rel.name, advice: rel.advice };
    } else if (rel.type === '错卦') {
      relations.opposite = { name: rel.name, advice: rel.advice };
    }
  });
  
  // 生成人格分析
  const personalityAnalysisObj = generatePersonalityAnalysis(hexagram, answers);
  const personalityAnalysis = personalityAnalysisObj.corePersonality;
  
  return {
    hexagram,
    innerFoundation,
    outerExpression,
    keyLines,
    relations,
    personalityAnalysis
  };
};

// 根据卦象生成人格分析
export const generatePersonalityAnalysis = (hexagram: Hexagram, answers: Answer[]): NonNullable<HexagramResult['analysis']> => {
  const analysisData: Record<string, NonNullable<HexagramResult['analysis']>> = {
    '乾': {
      corePersonality: '具有强烈的领导欲望和创新精神，天生的领导者',
      advantageTraits: ['天生的领导者', '执行力强', '勇于承担责任'],
      challengeAreas: ['可能过于强势', '需要学会倾听他人'],
      developmentSuggestions: ['发挥领导才能', '注意团队合作', '保持谦逊态度'],
      attentionPoints: ['避免独断专行', '注意身体健康'],
      relationshipPatterns: '在人际关系中倾向于主导，需要学会更多倾听和包容',
      careerGuidance: '适合创业或担任领导职务，发挥天赋的领导才能',
      lifePhilosophy: '自强不息，勇于承担责任，但要保持谦逊',
      recentFortune: '事业运势强劲，感情需要更多包容，注意工作压力，财运亨通但投资需谨慎'
    },
    '坤': {
      corePersonality: '温和包容，具有很强的适应能力和协调能力',
      advantageTraits: ['团队协作能力强', '执行力稳定', '值得信赖'],
      challengeAreas: ['可能缺乏主动性', '需要增强自信'],
      developmentSuggestions: ['发挥协调能力', '增强自我表达', '培养领导意识'],
      attentionPoints: ['避免过度依赖他人', '注意自我价值实现'],
      relationshipPatterns: '在人际关系中善于协调和包容，但需要增强自我表达',
      careerGuidance: '适合支持性工作，在团队中发挥重要的协调作用',
      lifePhilosophy: '厚德载物，包容他人，但要保持自己的原则',
      recentFortune: '适合支持性工作，感情稳定家庭和睦，身体良好注意情绪调节，财运平稳适合稳健投资'
    },
    '屯': {
      corePersonality: '面对困难不退缩，具有开拓精神和坚韧意志',
      advantageTraits: ['面对困难不退缩', '创新思维活跃', '学习能力强'],
      challengeAreas: ['容易急躁', '缺乏持久力', '计划性不足'],
      developmentSuggestions: ['制定详细计划', '培养耐心和毅力', '寻求他人支持'],
      attentionPoints: ['避免急于求成', '注意身心平衡'],
      relationshipPatterns: '在人际关系中表现出开拓精神，但需要更多耐心和计划性',
      careerGuidance: '适合开创性工作，但需要制定详细计划并坚持执行',
      lifePhilosophy: '勇于面对困难，在挫折中成长，但要循序渐进',
      recentFortune: '初期困难较多需要坚持，感情需要时间培养，健康注意劳逸结合，财运逐步改善'
    },
    '蒙': {
      corePersonality: '求知欲强，谦虚好学，思维敏捷，富有潜力',
      advantageTraits: ['学习能力出众', '思维开放', '接受新事物快'],
      challengeAreas: ['经验不足', '判断力有限', '容易迷茫'],
      developmentSuggestions: ['多向有经验的人学习', '积累实践经验', '明确发展方向'],
      attentionPoints: ['避免盲目决策', '注意选择导师'],
      relationshipPatterns: '在人际关系中表现出谦虚好学的态度，善于向他人请教',
      careerGuidance: '适合学习型工作，在导师指导下快速成长',
      lifePhilosophy: '保持谦虚好学的心态，在学习中不断完善自己',
      recentFortune: '学习运势佳适合进修深造，人际关系良好贵人相助，健康状况稳定，财运需要积累'
    },
    '需': {
      corePersonality: '耐心等待，善于准备，稳重谨慎，有远见',
      advantageTraits: ['时机把握准确', '准备充分', '不急于求成'],
      challengeAreas: ['过于谨慎', '行动缓慢', '错失机会'],
      developmentSuggestions: ['适当增加行动力', '把握关键时机', '培养决断能力'],
      attentionPoints: ['避免过度等待', '注意机会成本'],
      relationshipPatterns: '在人际关系中表现稳重，但需要适当主动',
      careerGuidance: '适合需要耐心和准备的工作，但要把握关键时机',
      lifePhilosophy: '耐心等待时机，做好充分准备，但不可过度等待',
      recentFortune: '需要耐心等待时机，感情发展缓慢但稳定，健康良好注意营养，财运需要时间积累'
    },
    '讼': {
      corePersonality: '原则性强，据理力争，正义感强，不轻易妥协',
      advantageTraits: ['坚持原则', '逻辑思维清晰', '有正义感'],
      challengeAreas: ['容易产生冲突', '固执己见', '人际关系紧张'],
      developmentSuggestions: ['学会妥协和沟通', '培养同理心', '寻求双赢方案'],
      attentionPoints: ['避免过度争执', '注意法律风险'],
      relationshipPatterns: '在人际关系中坚持原则，但需要学会更多沟通和理解',
      careerGuidance: '适合需要原则性和正义感的工作，但要注意人际协调',
      lifePhilosophy: '坚持正义和原则，但要学会妥协和沟通',
      recentFortune: '容易遇到争议和冲突，感情需要更多理解，健康注意情绪管理，财运有波动谨慎投资'
    }
  };
  
  // 为其他卦象提供通用分析
  const defaultAnalysis: NonNullable<HexagramResult['analysis']> = {
    corePersonality: '性格独特，有自己的特点，正在发展中，潜力待挖掘',
    advantageTraits: ['具有独特优势', '有发展潜力', '适应能力强'],
    challengeAreas: ['需要更多自我认知', '发展方向待明确', '需要持续成长'],
    developmentSuggestions: ['深入了解自己', '制定发展计划', '寻求专业指导'],
    attentionPoints: ['保持平衡发展', '注意身心健康'],
    relationshipPatterns: '在人际关系中表现出独特的个性，需要更多自我认知',
    careerGuidance: '适合发挥个人特长的工作，需要明确发展方向',
    lifePhilosophy: '保持开放心态，在成长中发现自己的独特价值',
    recentFortune: '前景看好需要努力发展，人际关系良好注意沟通，整体健康注意生活规律，财运一般需要理财规划'
  };
  
  return analysisData[hexagram.name_zh] || defaultAnalysis;
};

// 获取卦象的详细解释
export const getHexagramInterpretation = (hexagram: Hexagram): string => {
  const upperTrigram = TRIGRAMS[hexagram.lines.slice(3).map(l => l ? '1' : '0').join('') as keyof typeof TRIGRAMS];
  const lowerTrigram = TRIGRAMS[hexagram.lines.slice(0, 3).map(l => l ? '1' : '0').join('') as keyof typeof TRIGRAMS];
  
  return `${hexagram.name_zh}卦由上${upperTrigram?.name}下${lowerTrigram?.name}组成。此卦象征着${getHexagramMeaning(hexagram.name_zh)}。`;
};

// 获取卦象详细解释
export function getHexagramExplanation(hexagram: Hexagram): string {
  const explanations: Record<string, string> = {
    '乾': '乾卦，纯阳之卦，象征天道刚健。《易经》云："天行健，君子以自强不息。"此卦代表创造、领导、进取的力量。得此卦者，具有强烈的进取心和领导能力，但需注意刚柔并济，避免过于强势。在人生道路上，应当发挥天赋的领导才能，同时保持谦逊和包容的心态。',
    '坤': '坤卦，纯阴之卦，象征地道柔顺。《易经》云："地势坤，君子以厚德载物。"此卦代表包容、承载、配合的力量。得此卦者，具有很强的适应能力和协调能力，善于支持他人，但需注意培养自主性。在人生道路上，应当发挥包容和协调的优势，同时增强自信，勇于表达自己的观点。',
    '屯': '屯卦，象征初生之难。《易经》云："云雷屯，君子以经纶。"此卦代表困难中的成长和突破。得此卦者，正处于人生的起步阶段或转折期，虽然面临困难，但蕴含着巨大的发展潜力。需要耐心积累，循序渐进，不可急于求成。困难是成长的催化剂，坚持不懈必能开创新局面。',
    '蒙': '蒙卦，象征启蒙教育。《易经》云："山下出泉，蒙。"此卦代表学习、成长、启发的过程。得此卦者，正处于学习和成长的重要阶段，虽然经验不足，但求知欲强，具有很大的发展潜力。应当保持谦虚的学习态度，多向有经验的人请教，通过不断学习来完善自己。',
    '需': '需卦，象征等待时机。《易经》云："云上于天，需。"此卦代表耐心等待、积蓄力量的智慧。得此卦者，应当学会在适当的时候等待，不可急躁冒进。真正的智者懂得时机的重要性，在等待中做好充分的准备，当机会来临时能够把握住。耐心是成功的重要品质。',
    '讼': '讼卦，象征争执诉讼。《易经》云："天与水违行，讼。"此卦代表冲突、争议、原则的坚持。得此卦者，可能面临人际冲突或原则性的争执。虽然坚持原则是对的，但也要学会妥协和沟通，寻求双赢的解决方案。过度的争执会消耗精力，影响人际关系。',
    '师': '师卦，象征军队纪律。《易经》云："地中有水，师。"此卦代表组织、纪律、团队合作的力量。得此卦者，具有很强的组织能力和团队意识，能够在集体中发挥重要作用。但需要注意平衡个人与集体的关系，既要服从大局，也要保持个人特色。',
    '比': '比卦，象征亲密合作。《易经》云："水在地上，比。"此卦代表团结、合作、相互支持的关系。得此卦者，善于与他人建立良好的关系，具有很强的亲和力。在人际交往中，应当真诚待人，互相帮助，但也要注意保持适当的界限，避免过度依赖。'
  };
  
  // 为其他卦象提供通用解释
  const defaultExplanation = `${hexagram.name_zh}卦。此卦蕴含着深刻的人生智慧和指导意义。在周易的哲学体系中，每一卦都代表着特定的人生境遇和应对之道。得此卦者，应当深入理解卦象的内在含义，结合自身实际情况，从中汲取智慧和指导。建议多学习易经经典，以获得更深层次的人生启发。`;

  return explanations[hexagram.name_zh] || defaultExplanation;
}

// 获取卦象含义
const getHexagramMeaning = (chineseName: string): string => {
  const meanings: Record<string, string> = {
    '乾': '刚健、创造、领导',
    '坤': '柔顺、包容、承载',
    '屯': '初始、困难、积累',
    '蒙': '启蒙、学习、成长',
    '需': '等待、需求、时机',
    '讼': '争论、冲突、解决'
  };
  
  return meanings[chineseName] || '变化、发展、平衡';
};
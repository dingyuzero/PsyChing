// 游戏角色映射系统 - 八卦与职业/武器的对应关系

export interface CharacterRole {
  id: string;
  name_zh: string;
  name_en: string;
  description_zh: string;
  description_en: string;
  icon: string; // 图标名称，使用lucide-react图标
  color: string; // 主题色
}

export interface CharacterWeapon {
  id: string;
  name_zh: string;
  name_en: string;
  description_zh: string;
  description_en: string;
  icon: string; // 图标名称
  color: string; // 主题色
}

export interface GameCharacter {
  role: CharacterRole;
  weapon: CharacterWeapon;
  combinedName_zh: string;
  combinedName_en: string;
  combinedDescription_zh: string;
  combinedDescription_en: string;
}

// 八卦对应的职业（下卦 - 内在动机）
export const TRIGRAM_ROLES: Record<string, CharacterRole> = {
  '乾': {
    id: 'qian',
    name_zh: '国王',
    name_en: 'King',
    description_zh: '天生的领导者，具有强大的统治力和决策能力',
    description_en: 'Natural leader with strong ruling power and decision-making ability',
    icon: 'Crown',
    color: 'text-yellow-600'
  },
  '坤': {
    id: 'kun',
    name_zh: '农夫',
    name_en: 'Farmer',
    description_zh: '勤劳朴实，脚踏实地，具有强大的包容力和耐心',
    description_en: 'Hardworking and down-to-earth, with great tolerance and patience',
    icon: 'Wheat',
    color: 'text-green-600'
  },
  '震': {
    id: 'zhen',
    name_zh: '战士',
    name_en: 'Warrior',
    description_zh: '勇敢无畏，行动力强，敢于面对挑战和困难',
    description_en: 'Brave and fearless, with strong action power, dare to face challenges',
    icon: 'Shield',
    color: 'text-red-600'
  },
  '巽': {
    id: 'xun',
    name_zh: '商人',
    name_en: 'Merchant',
    description_zh: '灵活变通，善于交际，具有敏锐的商业嗅觉',
    description_en: 'Flexible and adaptable, good at socializing, with keen business sense',
    icon: 'Coins',
    color: 'text-amber-600'
  },
  '坎': {
    id: 'kan',
    name_zh: '法师',
    name_en: 'Mage',
    description_zh: '智慧深邃，善于思考，掌握神秘的知识和力量',
    description_en: 'Profound wisdom, good at thinking, mastering mysterious knowledge and power',
    icon: 'Sparkles',
    color: 'text-blue-600'
  },
  '离': {
    id: 'li',
    name_zh: '射手',
    name_en: 'Archer',
    description_zh: '目标明确，专注力强，具有出色的洞察力和判断力',
    description_en: 'Clear goals, strong focus, excellent insight and judgment',
    icon: 'Target',
    color: 'text-orange-600'
  },
  '艮': {
    id: 'gen',
    name_zh: '守卫',
    name_en: 'Guardian',
    description_zh: '稳重可靠，责任心强，是值得信赖的保护者',
    description_en: 'Steady and reliable, strong sense of responsibility, trustworthy protector',
    icon: 'ShieldCheck',
    color: 'text-stone-600'
  },
  '兑': {
    id: 'dui',
    name_zh: '吟游诗人',
    name_en: 'Bard',
    description_zh: '善于表达，富有创造力，能够感染和激励他人',
    description_en: 'Good at expression, creative, able to inspire and motivate others',
    icon: 'Music',
    color: 'text-purple-600'
  }
};

// 八卦对应的武器（上卦 - 外在行为）
export const TRIGRAM_WEAPONS: Record<string, CharacterWeapon> = {
  '乾': {
    id: 'qian',
    name_zh: '神剑',
    name_en: 'Divine Sword',
    description_zh: '象征权威和正义，具有无上的威严和力量',
    description_en: 'Symbol of authority and justice, with supreme majesty and power',
    icon: 'Sword',
    color: 'text-yellow-500'
  },
  '坤': {
    id: 'kun',
    name_zh: '护盾',
    name_en: 'Shield',
    description_zh: '代表守护和包容，提供坚实的防护和支持',
    description_en: 'Represents protection and tolerance, providing solid defense and support',
    icon: 'Shield',
    color: 'text-green-500'
  },
  '震': {
    id: 'zhen',
    name_zh: '战锤',
    name_en: 'War Hammer',
    description_zh: '象征雷霆之力，具有强大的冲击力和震慑力',
    description_en: 'Symbol of thunder power, with strong impact and deterrent force',
    icon: 'Hammer',
    color: 'text-red-500'
  },
  '巽': {
    id: 'xun',
    name_zh: '神弓',
    name_en: 'Divine Bow',
    description_zh: '代表灵活和精准，能够适应各种环境和挑战',
    description_en: 'Represents flexibility and precision, adaptable to various environments',
    icon: 'Target',
    color: 'text-amber-500'
  },
  '坎': {
    id: 'kan',
    name_zh: '法杖',
    name_en: 'Magic Staff',
    description_zh: '蕴含深邃的智慧，能够操控神秘的魔法力量',
    description_en: 'Contains profound wisdom, able to control mysterious magical power',
    icon: 'Wand2',
    color: 'text-blue-500'
  },
  '离': {
    id: 'li',
    name_zh: '火枪',
    name_en: 'Fire Gun',
    description_zh: '象征光明和热情，具有强大的穿透力和爆发力',
    description_en: 'Symbol of light and passion, with strong penetration and explosive power',
    icon: 'Zap',
    color: 'text-orange-500'
  },
  '艮': {
    id: 'gen',
    name_zh: '巨斧',
    name_en: 'Great Axe',
    description_zh: '代表坚定和力量，能够破除一切障碍和困难',
    description_en: 'Represents firmness and strength, able to break through all obstacles',
    icon: 'Axe',
    color: 'text-stone-500'
  },
  '兑': {
    id: 'dui',
    name_zh: '双刃',
    name_en: 'Twin Blades',
    description_zh: '象征和谐与平衡，具有优雅的战斗艺术',
    description_en: 'Symbol of harmony and balance, with elegant combat art',
    icon: 'Swords',
    color: 'text-purple-500'
  }
};

// 英文拼音到中文字符的映射表
const TRIGRAM_PINYIN_TO_CHINESE: Record<string, string> = {
  'qian': '乾',
  'kun': '坤',
  'zhen': '震',
  'xun': '巽',
  'kan': '坎',
  'li': '离',
  'gen': '艮',
  'dui': '兑'
};

// 转换函数：将英文拼音转换为中文字符
function convertTrigramToChinese(trigram: string): string {
  // 如果已经是中文字符，直接返回
  if (Object.values(TRIGRAM_PINYIN_TO_CHINESE).includes(trigram)) {
    return trigram;
  }
  // 如果是英文拼音，转换为中文字符
  return TRIGRAM_PINYIN_TO_CHINESE[trigram] || trigram;
}

// 根据上下卦生成游戏角色
export function generateGameCharacter(upperTrigram: string, lowerTrigram: string): GameCharacter {
  // 转换英文拼音为中文字符
  const upperTrigramChinese = convertTrigramToChinese(upperTrigram);
  const lowerTrigramChinese = convertTrigramToChinese(lowerTrigram);
  
  const role = TRIGRAM_ROLES[lowerTrigramChinese];
  const weapon = TRIGRAM_WEAPONS[upperTrigramChinese];
  
  if (!role || !weapon) {
    throw new Error(`Invalid trigram combination: ${upperTrigram} + ${lowerTrigram} (converted to: ${upperTrigramChinese} + ${lowerTrigramChinese})`);
  }
  
  return {
    role,
    weapon,
    combinedName_zh: `${weapon.name_zh}${role.name_zh}`,
    combinedName_en: `${role.name_en} of ${weapon.name_en}`,
    combinedDescription_zh: `持有${weapon.name_zh}的${role.name_zh}，${role.description_zh}，${weapon.description_zh}`,
    combinedDescription_en: `A ${role.name_en} wielding ${weapon.name_en}, ${role.description_en}, ${weapon.description_en}`
  };
}

// 获取所有可能的角色组合（64种）
export function getAllCharacterCombinations(): GameCharacter[] {
  const combinations: GameCharacter[] = [];
  const trigrams = Object.keys(TRIGRAM_ROLES);
  
  for (const upperTrigram of trigrams) {
    for (const lowerTrigram of trigrams) {
      combinations.push(generateGameCharacter(upperTrigram, lowerTrigram));
    }
  }
  
  return combinations;
}
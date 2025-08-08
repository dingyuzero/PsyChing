import { Trigram, Hexagram, TrigramType } from '../types';

// 八卦（三爻卦）数据库
export const TRIGRAMS: Record<TrigramType, Trigram> = {
  qian: {
    name_zh: '乾',
    name_en: 'Qian',
    symbol: '☰',
    element: 'metal',
    attributes: ['creative', 'strong', 'active'],
    motivation_type: 'achievement',
    behavior_type: 'leadership'
  },
  kun: {
    name_zh: '坤',
    name_en: 'Kun',
    symbol: '☷',
    element: 'earth',
    attributes: ['receptive', 'nurturing', 'supportive'],
    motivation_type: 'security',
    behavior_type: 'supportive'
  },
  zhen: {
    name_zh: '震',
    name_en: 'Zhen',
    symbol: '☳',
    element: 'wood',
    attributes: ['arousing', 'dynamic', 'initiating'],
    motivation_type: 'innovation',
    behavior_type: 'activating'
  },
  xun: {
    name_zh: '巽',
    name_en: 'Xun',
    symbol: '☴',
    element: 'wood',
    attributes: ['gentle', 'penetrating', 'adaptive'],
    motivation_type: 'adaptation',
    behavior_type: 'penetrating'
  },
  kan: {
    name_zh: '坎',
    name_en: 'Kan',
    symbol: '☵',
    element: 'water',
    attributes: ['abysmal', 'dangerous', 'flowing'],
    motivation_type: 'growth',
    behavior_type: 'analytical'
  },
  li: {
    name_zh: '离',
    name_en: 'Li',
    symbol: '☲',
    element: 'fire',
    attributes: ['clinging', 'bright', 'illuminating'],
    motivation_type: 'meaning',
    behavior_type: 'inspiring'
  },
  gen: {
    name_zh: '艮',
    name_en: 'Gen',
    symbol: '☶',
    element: 'earth',
    attributes: ['keeping_still', 'mountain', 'stable'],
    motivation_type: 'stability',
    behavior_type: 'protective'
  },
  dui: {
    name_zh: '兑',
    name_en: 'Dui',
    symbol: '☱',
    element: 'metal',
    attributes: ['joyous', 'lake', 'communicative'],
    motivation_type: 'connection',
    behavior_type: 'harmonizing'
  }
};

// 64卦数据库
export const HEXAGRAMS: Hexagram[] = [
  // 乾宫八卦
  {
    id: 1,
    name_zh: '乾为天',
    name_en: 'The Creative',
    upper_trigram: 'qian',
    lower_trigram: 'qian',
    binary_code: '111111',
    lines: [1, 1, 1, 1, 1, 1],
    gua_number: 1
  },
  {
    id: 2,
    name_zh: '天风姤',
    name_en: 'Coming to Meet',
    upper_trigram: 'qian',
    lower_trigram: 'xun',
    binary_code: '111011',
    lines: [1, 1, 1, 0, 1, 1],
    gua_number: 44
  },
  {
    id: 3,
    name_zh: '天山遁',
    name_en: 'Retreat',
    upper_trigram: 'qian',
    lower_trigram: 'gen',
    binary_code: '111001',
    lines: [1, 1, 1, 0, 0, 1],
    gua_number: 33
  },
  {
    id: 4,
    name_zh: '天地否',
    name_en: 'Standstill',
    upper_trigram: 'qian',
    lower_trigram: 'kun',
    binary_code: '111000',
    lines: [1, 1, 1, 0, 0, 0],
    gua_number: 12
  },
  {
    id: 5,
    name_zh: '风地观',
    name_en: 'Contemplation',
    upper_trigram: 'xun',
    lower_trigram: 'kun',
    binary_code: '011000',
    lines: [0, 1, 1, 0, 0, 0],
    gua_number: 20
  },
  {
    id: 6,
    name_zh: '山地剥',
    name_en: 'Splitting Apart',
    upper_trigram: 'gen',
    lower_trigram: 'kun',
    binary_code: '001000',
    lines: [0, 0, 1, 0, 0, 0],
    gua_number: 23
  },
  {
    id: 7,
    name_zh: '火地晋',
    name_en: 'Progress',
    upper_trigram: 'li',
    lower_trigram: 'kun',
    binary_code: '101000',
    lines: [1, 0, 1, 0, 0, 0],
    gua_number: 35
  },
  {
    id: 8,
    name_zh: '火天大有',
    name_en: 'Possession in Great Measure',
    upper_trigram: 'li',
    lower_trigram: 'qian',
    binary_code: '101111',
    lines: [1, 0, 1, 1, 1, 1],
    gua_number: 14
  },
  
  // 坤宫八卦
  {
    id: 9,
    name_zh: '坤为地',
    name_en: 'The Receptive',
    upper_trigram: 'kun',
    lower_trigram: 'kun',
    binary_code: '000000',
    lines: [0, 0, 0, 0, 0, 0],
    gua_number: 2
  },
  {
    id: 10,
    name_zh: '地雷复',
    name_en: 'Return',
    upper_trigram: 'kun',
    lower_trigram: 'zhen',
    binary_code: '000100',
    lines: [0, 0, 0, 1, 0, 0],
    gua_number: 24
  },
  {
    id: 11,
    name_zh: '地泽临',
    name_en: 'Approach',
    upper_trigram: 'kun',
    lower_trigram: 'dui',
    binary_code: '000110',
    lines: [0, 0, 0, 1, 1, 0],
    gua_number: 19
  },
  {
    id: 12,
    name_zh: '地天泰',
    name_en: 'Peace',
    upper_trigram: 'kun',
    lower_trigram: 'qian',
    binary_code: '000111',
    lines: [0, 0, 0, 1, 1, 1],
    gua_number: 11
  },
  {
    id: 13,
    name_zh: '雷天大壮',
    name_en: 'The Power of the Great',
    upper_trigram: 'zhen',
    lower_trigram: 'qian',
    binary_code: '100111',
    lines: [1, 0, 0, 1, 1, 1],
    gua_number: 34
  },
  {
    id: 14,
    name_zh: '泽天夬',
    name_en: 'Breakthrough',
    upper_trigram: 'dui',
    lower_trigram: 'qian',
    binary_code: '110111',
    lines: [1, 1, 0, 1, 1, 1],
    gua_number: 43
  },
  {
    id: 15,
    name_zh: '水天需',
    name_en: 'Waiting',
    upper_trigram: 'kan',
    lower_trigram: 'qian',
    binary_code: '010111',
    lines: [0, 1, 0, 1, 1, 1],
    gua_number: 5
  },
  {
    id: 16,
    name_zh: '水地比',
    name_en: 'Holding Together',
    upper_trigram: 'kan',
    lower_trigram: 'kun',
    binary_code: '010000',
    lines: [0, 1, 0, 0, 0, 0],
    gua_number: 8
  },
  
  // 震宫八卦
  {
    id: 17,
    name_zh: '震为雷',
    name_en: 'The Arousing',
    upper_trigram: 'zhen',
    lower_trigram: 'zhen',
    binary_code: '100100',
    lines: [1, 0, 0, 1, 0, 0],
    gua_number: 51
  },
  {
    id: 18,
    name_zh: '雷地豫',
    name_en: 'Enthusiasm',
    upper_trigram: 'zhen',
    lower_trigram: 'kun',
    binary_code: '100000',
    lines: [1, 0, 0, 0, 0, 0],
    gua_number: 16
  },
  {
    id: 19,
    name_zh: '雷水解',
    name_en: 'Deliverance',
    upper_trigram: 'zhen',
    lower_trigram: 'kan',
    binary_code: '100010',
    lines: [1, 0, 0, 0, 1, 0],
    gua_number: 40
  },
  {
    id: 20,
    name_zh: '雷风恒',
    name_en: 'Duration',
    upper_trigram: 'zhen',
    lower_trigram: 'xun',
    binary_code: '100011',
    lines: [1, 0, 0, 0, 1, 1],
    gua_number: 32
  },
  {
    id: 21,
    name_zh: '地风升',
    name_en: 'Pushing Upward',
    upper_trigram: 'kun',
    lower_trigram: 'xun',
    binary_code: '000011',
    lines: [0, 0, 0, 0, 1, 1],
    gua_number: 46
  },
  {
    id: 22,
    name_zh: '水风井',
    name_en: 'The Well',
    upper_trigram: 'kan',
    lower_trigram: 'xun',
    binary_code: '010011',
    lines: [0, 1, 0, 0, 1, 1],
    gua_number: 48
  },
  {
    id: 23,
    name_zh: '泽风大过',
    name_en: 'Preponderance of the Great',
    upper_trigram: 'dui',
    lower_trigram: 'xun',
    binary_code: '110011',
    lines: [1, 1, 0, 0, 1, 1],
    gua_number: 28
  },
  {
    id: 24,
    name_zh: '泽雷随',
    name_en: 'Following',
    upper_trigram: 'dui',
    lower_trigram: 'zhen',
    binary_code: '110100',
    lines: [1, 1, 0, 1, 0, 0],
    gua_number: 17
  },
  
  // 巽宫八卦
  {
    id: 25,
    name_zh: '巽为风',
    name_en: 'The Gentle',
    upper_trigram: 'xun',
    lower_trigram: 'xun',
    binary_code: '011011',
    lines: [0, 1, 1, 0, 1, 1],
    gua_number: 57
  },
  {
    id: 26,
    name_zh: '风天小畜',
    name_en: 'The Taming Power of the Small',
    upper_trigram: 'xun',
    lower_trigram: 'qian',
    binary_code: '011111',
    lines: [0, 1, 1, 1, 1, 1],
    gua_number: 9
  },
  {
    id: 27,
    name_zh: '风火家人',
    name_en: 'The Family',
    upper_trigram: 'xun',
    lower_trigram: 'li',
    binary_code: '011101',
    lines: [0, 1, 1, 1, 0, 1],
    gua_number: 37
  },
  {
    id: 28,
    name_zh: '风雷益',
    name_en: 'Increase',
    upper_trigram: 'xun',
    lower_trigram: 'zhen',
    binary_code: '011100',
    lines: [0, 1, 1, 1, 0, 0],
    gua_number: 42
  },
  {
    id: 29,
    name_zh: '天雷无妄',
    name_en: 'Innocence',
    upper_trigram: 'qian',
    lower_trigram: 'zhen',
    binary_code: '111100',
    lines: [1, 1, 1, 1, 0, 0],
    gua_number: 25
  },
  {
    id: 30,
    name_zh: '火雷噬嗑',
    name_en: 'Biting Through',
    upper_trigram: 'li',
    lower_trigram: 'zhen',
    binary_code: '101100',
    lines: [1, 0, 1, 1, 0, 0],
    gua_number: 21
  },
  {
    id: 31,
    name_zh: '山雷颐',
    name_en: 'The Corners of the Mouth',
    upper_trigram: 'gen',
    lower_trigram: 'zhen',
    binary_code: '001100',
    lines: [0, 0, 1, 1, 0, 0],
    gua_number: 27
  },
  {
    id: 32,
    name_zh: '山风蛊',
    name_en: 'Work on What Has Been Spoiled',
    upper_trigram: 'gen',
    lower_trigram: 'xun',
    binary_code: '001011',
    lines: [0, 0, 1, 0, 1, 1],
    gua_number: 18
  },
  
  // 坎宫八卦
  {
    id: 33,
    name_zh: '坎为水',
    name_en: 'The Abysmal',
    upper_trigram: 'kan',
    lower_trigram: 'kan',
    binary_code: '010010',
    lines: [0, 1, 0, 0, 1, 0],
    gua_number: 29
  },
  {
    id: 34,
    name_zh: '水泽节',
    name_en: 'Limitation',
    upper_trigram: 'kan',
    lower_trigram: 'dui',
    binary_code: '010110',
    lines: [0, 1, 0, 1, 1, 0],
    gua_number: 60
  },
  {
    id: 35,
    name_zh: '水雷屯',
    name_en: 'Difficulty at the Beginning',
    upper_trigram: 'kan',
    lower_trigram: 'zhen',
    binary_code: '010100',
    lines: [0, 1, 0, 1, 0, 0],
    gua_number: 3
  },
  {
    id: 36,
    name_zh: '水火既济',
    name_en: 'After Completion',
    upper_trigram: 'kan',
    lower_trigram: 'li',
    binary_code: '010101',
    lines: [0, 1, 0, 1, 0, 1],
    gua_number: 63
  },
  {
    id: 37,
    name_zh: '泽火革',
    name_en: 'Revolution',
    upper_trigram: 'dui',
    lower_trigram: 'li',
    binary_code: '110101',
    lines: [1, 1, 0, 1, 0, 1],
    gua_number: 49
  },
  {
    id: 38,
    name_zh: '雷火丰',
    name_en: 'Abundance',
    upper_trigram: 'zhen',
    lower_trigram: 'li',
    binary_code: '100101',
    lines: [1, 0, 0, 1, 0, 1],
    gua_number: 55
  },
  {
    id: 39,
    name_zh: '地火明夷',
    name_en: 'Darkening of the Light',
    upper_trigram: 'kun',
    lower_trigram: 'li',
    binary_code: '000101',
    lines: [0, 0, 0, 1, 0, 1],
    gua_number: 36
  },
  {
    id: 40,
    name_zh: '地水师',
    name_en: 'The Army',
    upper_trigram: 'kun',
    lower_trigram: 'kan',
    binary_code: '000010',
    lines: [0, 0, 0, 0, 1, 0],
    gua_number: 7
  },
  
  // 离宫八卦
  {
    id: 41,
    name_zh: '离为火',
    name_en: 'The Clinging',
    upper_trigram: 'li',
    lower_trigram: 'li',
    binary_code: '101101',
    lines: [1, 0, 1, 1, 0, 1],
    gua_number: 30
  },
  {
    id: 42,
    name_zh: '火山旅',
    name_en: 'The Wanderer',
    upper_trigram: 'li',
    lower_trigram: 'gen',
    binary_code: '101001',
    lines: [1, 0, 1, 0, 0, 1],
    gua_number: 56
  },
  {
    id: 43,
    name_zh: '火风鼎',
    name_en: 'The Caldron',
    upper_trigram: 'li',
    lower_trigram: 'xun',
    binary_code: '101011',
    lines: [1, 0, 1, 0, 1, 1],
    gua_number: 50
  },
  {
    id: 44,
    name_zh: '火水未济',
    name_en: 'Before Completion',
    upper_trigram: 'li',
    lower_trigram: 'kan',
    binary_code: '101010',
    lines: [1, 0, 1, 0, 1, 0],
    gua_number: 64
  },
  {
    id: 45,
    name_zh: '山水蒙',
    name_en: 'Youthful Folly',
    upper_trigram: 'gen',
    lower_trigram: 'kan',
    binary_code: '001010',
    lines: [0, 0, 1, 0, 1, 0],
    gua_number: 4
  },
  {
    id: 46,
    name_zh: '风水涣',
    name_en: 'Dispersion',
    upper_trigram: 'xun',
    lower_trigram: 'kan',
    binary_code: '011010',
    lines: [0, 1, 1, 0, 1, 0],
    gua_number: 59
  },
  {
    id: 47,
    name_zh: '天水讼',
    name_en: 'Conflict',
    upper_trigram: 'qian',
    lower_trigram: 'kan',
    binary_code: '111010',
    lines: [1, 1, 1, 0, 1, 0],
    gua_number: 6
  },
  {
    id: 48,
    name_zh: '天火同人',
    name_en: 'Fellowship with Men',
    upper_trigram: 'qian',
    lower_trigram: 'li',
    binary_code: '111101',
    lines: [1, 1, 1, 1, 0, 1],
    gua_number: 13
  },
  
  // 艮宫八卦
  {
    id: 49,
    name_zh: '艮为山',
    name_en: 'Keeping Still',
    upper_trigram: 'gen',
    lower_trigram: 'gen',
    binary_code: '001001',
    lines: [0, 0, 1, 0, 0, 1],
    gua_number: 52
  },
  {
    id: 50,
    name_zh: '山火贲',
    name_en: 'Grace',
    upper_trigram: 'gen',
    lower_trigram: 'li',
    binary_code: '001101',
    lines: [0, 0, 1, 1, 0, 1],
    gua_number: 22
  },
  {
    id: 51,
    name_zh: '山天大畜',
    name_en: 'The Taming Power of the Great',
    upper_trigram: 'gen',
    lower_trigram: 'qian',
    binary_code: '001111',
    lines: [0, 0, 1, 1, 1, 1],
    gua_number: 26
  },
  {
    id: 52,
    name_zh: '山泽损',
    name_en: 'Decrease',
    upper_trigram: 'gen',
    lower_trigram: 'dui',
    binary_code: '001110',
    lines: [0, 0, 1, 1, 1, 0],
    gua_number: 41
  },
  {
    id: 53,
    name_zh: '火泽睽',
    name_en: 'Opposition',
    upper_trigram: 'li',
    lower_trigram: 'dui',
    binary_code: '101110',
    lines: [1, 0, 1, 1, 1, 0],
    gua_number: 38
  },
  {
    id: 54,
    name_zh: '天泽履',
    name_en: 'Treading',
    upper_trigram: 'qian',
    lower_trigram: 'dui',
    binary_code: '111110',
    lines: [1, 1, 1, 1, 1, 0],
    gua_number: 10
  },
  {
    id: 55,
    name_zh: '风泽中孚',
    name_en: 'Inner Truth',
    upper_trigram: 'xun',
    lower_trigram: 'dui',
    binary_code: '011110',
    lines: [0, 1, 1, 1, 1, 0],
    gua_number: 61
  },
  {
    id: 56,
    name_zh: '风山渐',
    name_en: 'Development',
    upper_trigram: 'xun',
    lower_trigram: 'gen',
    binary_code: '011001',
    lines: [0, 1, 1, 0, 0, 1],
    gua_number: 53
  },
  
  // 兑宫八卦
  {
    id: 57,
    name_zh: '兑为泽',
    name_en: 'The Joyous',
    upper_trigram: 'dui',
    lower_trigram: 'dui',
    binary_code: '110110',
    lines: [1, 1, 0, 1, 1, 0],
    gua_number: 58
  },
  {
    id: 58,
    name_zh: '泽水困',
    name_en: 'Oppression',
    upper_trigram: 'dui',
    lower_trigram: 'kan',
    binary_code: '110010',
    lines: [1, 1, 0, 0, 1, 0],
    gua_number: 47
  },
  {
    id: 59,
    name_zh: '泽地萃',
    name_en: 'Gathering Together',
    upper_trigram: 'dui',
    lower_trigram: 'kun',
    binary_code: '110000',
    lines: [1, 1, 0, 0, 0, 0],
    gua_number: 45
  },
  {
    id: 60,
    name_zh: '泽山咸',
    name_en: 'Influence',
    upper_trigram: 'dui',
    lower_trigram: 'gen',
    binary_code: '110001',
    lines: [1, 1, 0, 0, 0, 1],
    gua_number: 31
  },
  {
    id: 61,
    name_zh: '水山蹇',
    name_en: 'Obstruction',
    upper_trigram: 'kan',
    lower_trigram: 'gen',
    binary_code: '010001',
    lines: [0, 1, 0, 0, 0, 1],
    gua_number: 39
  },
  {
    id: 62,
    name_zh: '地山谦',
    name_en: 'Modesty',
    upper_trigram: 'kun',
    lower_trigram: 'gen',
    binary_code: '000001',
    lines: [0, 0, 0, 0, 0, 1],
    gua_number: 15
  },
  {
    id: 63,
    name_zh: '雷山小过',
    name_en: 'Preponderance of the Small',
    upper_trigram: 'zhen',
    lower_trigram: 'gen',
    binary_code: '100001',
    lines: [1, 0, 0, 0, 0, 1],
    gua_number: 62
  },
  {
    id: 64,
    name_zh: '雷泽归妹',
    name_en: 'The Marrying Maiden',
    upper_trigram: 'zhen',
    lower_trigram: 'dui',
    binary_code: '100110',
    lines: [1, 0, 0, 1, 1, 0],
    gua_number: 54
  }
];

// 卦象映射工具函数
export class HexagramMapper {
  // 根据上下卦获取卦象
  static getHexagram(upperTrigram: TrigramType, lowerTrigram: TrigramType): Hexagram | null {
    return HEXAGRAMS.find(h => 
      h.upper_trigram === upperTrigram && h.lower_trigram === lowerTrigram
    ) || null;
  }
  
  // 根据卦数获取卦象
  static getHexagramByNumber(guaNumber: number): Hexagram | null {
    return HEXAGRAMS.find(h => h.gua_number === guaNumber) || null;
  }
  
  // 根据二进制编码获取卦象
  static getHexagramByBinary(binaryCode: string): Hexagram | null {
    return HEXAGRAMS.find(h => h.binary_code === binaryCode) || null;
  }
  
  // 获取所有卦象
  static getAllHexagrams(): Hexagram[] {
    return [...HEXAGRAMS];
  }
  
  // 获取特定宫的卦象
  static getHexagramsByPalace(palaceTrigram: TrigramType): Hexagram[] {
    return HEXAGRAMS.filter(h => 
      h.upper_trigram === palaceTrigram || h.lower_trigram === palaceTrigram
    );
  }
  
  // 获取卦象的详细信息
  static getHexagramDetails(hexagram: Hexagram) {
    const upperTrigram = TRIGRAMS[hexagram.upper_trigram];
    const lowerTrigram = TRIGRAMS[hexagram.lower_trigram];
    
    return {
      hexagram,
      upperTrigram,
      lowerTrigram,
      composition: {
        upper: {
          name: upperTrigram.name_zh,
          symbol: upperTrigram.symbol,
          element: upperTrigram.element,
          attributes: upperTrigram.attributes
        },
        lower: {
          name: lowerTrigram.name_zh,
          symbol: lowerTrigram.symbol,
          element: lowerTrigram.element,
          attributes: lowerTrigram.attributes
        }
      }
    };
  }
  
  // 计算卦象的相似度
  static calculateSimilarity(hexagram1: Hexagram, hexagram2: Hexagram): number {
    let similarity = 0;
    
    // 比较爻的相似度
    for (let i = 0; i < 6; i++) {
      if (hexagram1.lines[i] === hexagram2.lines[i]) {
        similarity += 1;
      }
    }
    
    return similarity / 6;
  }
  
  // 获取相关卦象（变卦、错卦、综卦）
  static getRelatedHexagrams(hexagram: Hexagram) {
    const related = {
      change_hexagrams: [] as Hexagram[], // 变卦（一爻变）
      opposite_hexagram: null as Hexagram | null, // 错卦（阴阳互换）
      reverse_hexagram: null as Hexagram | null // 综卦（上下颠倒）
    };
    
    // 计算错卦（阴阳互换）
    const oppositeLines = hexagram.lines.map(line => line === 1 ? 0 : 1);
    const oppositeBinary = oppositeLines.join('');
    related.opposite_hexagram = this.getHexagramByBinary(oppositeBinary);
    
    // 计算综卦（上下颠倒）
    const reverseLines = [...hexagram.lines].reverse();
    const reverseBinary = reverseLines.join('');
    related.reverse_hexagram = this.getHexagramByBinary(reverseBinary);
    
    // 计算变卦（每一爻变化）
    for (let i = 0; i < 6; i++) {
      const changedLines = [...hexagram.lines];
      changedLines[i] = changedLines[i] === 1 ? 0 : 1;
      const changedBinary = changedLines.join('');
      const changedHexagram = this.getHexagramByBinary(changedBinary);
      if (changedHexagram) {
        related.change_hexagrams.push(changedHexagram);
      }
    }
    
    return related;
  }
}

// 导出默认实例
export const hexagramMapper = new HexagramMapper();
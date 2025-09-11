// 测试阶段类型
export type TestPhase = 'inner_motivation' | 'outer_behavior';

// 八卦类型
export type TrigramType = 'qian' | 'kun' | 'zhen' | 'xun' | 'kan' | 'li' | 'gen' | 'dui';

// 题目选项类型
export interface QuestionOption {
  id: string;
  content?: string; // 选项内容
  text?: string;
  text_zh?: string;
  text_en?: string;
  value?: number; // 权重值
  trigram_influence?: {
    trigram: TrigramType;
    weight: number;
  }[];
  // 对8种类型的影响系数 (-1 到 1)
  impact_coefficients: {
    qian: number;    // 乾卦系数
    kun: number;     // 坤卦系数
    zhen: number;    // 震卦系数
    xun: number;     // 巽卦系数
    kan: number;     // 坎卦系数
    li: number;      // 离卦系数
    gen: number;     // 艮卦系数
    dui: number;     // 兑卦系数
  };
}

// 题目类型
export type QuestionType = 'single_choice';

// 测试阶段枚举
export enum TestStage {
  EXPLORATION = 'exploration',
  DISCRIMINATION = 'discrimination', 
  CONFIRMATION = 'confirmation',
  COMPLETED = 'completed'
}

// 扩展题目接口
export interface ExtendedQuestion extends Question {
  description_zh?: string;
  subcategory?: string;
  weight?: number;
  informationGain?: number;
}

export interface Question {
  id: string;
  category: TestPhase; // 内在动机 | 外在行为
  content: string; // 题目内容
  text_zh: string;
  text_en: string;
  type: QuestionType; // 题目类型
  options: QuestionOption[];
  dimension: string; // 维度
  difficulty: number; // 区分度 0-1
  usage_count: number; // 使用次数统计
}

// 用户答案类型
export interface TestAnswer {
  question_id: string;
  selected_option_id: string;
  option_id: string; // 兼容性
  response_time: number; // 毫秒
  timestamp: number;
  answered_at: string;
}

// 概率分布类型
export interface ProbabilityMap {
  qian: number;
  kun: number;
  zhen: number;
  xun: number;
  kan: number;
  li: number;
  gen: number;
  dui: number;
}

// 测试会话类型
export interface TestSession {
  id: string;
  start_time: string;
  started_at: string;
  current_question_index: number;
  currentQuestion?: Question;
  answers: TestAnswer[];
  phase: TestPhase;
  probability_distribution: {
    inner_motivation: Record<TrigramType, number>;
    outer_behavior: Record<TrigramType, number>;
  };
  probability_distributions: {
    inner_motivation: Record<TrigramType, number>;
    outer_behavior: Record<TrigramType, number>;
  };
  is_completed: boolean;
  completed_at?: string;
}

// 三爻卦（八卦）类型
export interface Trigram {
  name_zh: string;
  name_en: string;
  symbol: string; // Unicode卦象符号
  element: string; // 五行属性
  attributes: string[]; // 卦象属性
  motivation_type?: string; // 动机类型（下卦用）
  behavior_type?: string; // 行为类型（上卦用）
}

// 六爻卦（64卦）类型
export interface Hexagram {
  id?: number;
  name_zh: string;
  name_en: string;
  chineseName?: string;
  symbol?: string;
  description?: string;
  upper_trigram?: TrigramType; // 上卦
  lower_trigram?: TrigramType; // 下卦
  upperTrigram?: string;
  lowerTrigram?: string;
  binary_code?: string;  // 64卦编码
  lines: number[]; // 1为阳爻，0为阴爻
  gua_number?: number; // 卦数 1-64
  number?: number;
}

// 基础分析类型
export interface BasicAnalysis {
  hexagram_name: {
    zh: string;
    en: string;
  };
  core_personality: string;
  motivation_analysis: {
    type: string;
    description: string;
    trigram_info: {
      name: string;
      symbol: string;
      element: string;
      attributes: string[];
    };
  };
  behavior_analysis: {
    type: string;
    description: string;
    trigram_info: {
      name: string;
      symbol: string;
      element: string;
      attributes: string[];
    };
  };
  overall_summary: string;
}

// 爻位分析类型
export interface LineAnalysis {
  lines: Array<{
    position: number;
    type: string;
    symbol: string;
    meaning: string;
    influence: string;
  }>;
  core_line: {
    position: number;
    significance: string;
    interpretation: string;
  };
  line_interaction: string;
}

// 详细分析类型
export interface DetailedAnalysis {
  strengths: string[];
  challenges: string[];
  development_suggestions: string[];
  relationship_patterns: string;
  career_guidance: string;
  life_philosophy: string;
  recent_fortune: string;
}

// 关联分析类型
export interface RelatedAnalysis {
  change_hexagrams: Array<{
    hexagram: any;
    relationship: string;
    meaning: string;
  }>;
  opposite_hexagram: {
    hexagram: any;
    relationship: string;
    meaning: string;
  } | null;
  reverse_hexagram: {
    hexagram: any;
    relationship: string;
    meaning: string;
  } | null;
  similar_hexagrams: any[];
}

// 卦象结果类型
export interface HexagramResult {
  id: string;
  timestamp: number;
  answers: TestAnswer[];
  
  // 主卦信息
  hexagram: {
    id: number;
    name_zh: string;
    name_en: string;
    upper_trigram: string;
    lower_trigram: string;
    binary_code: string;
    lines: number[];
    gua_number: number;
  };
  
  // 置信度
  confidence: number;
  
  // 基础分析
  basicAnalysis: {
    corePersonality: string;
    advantageTraits: string[];
    challengeAreas: string[];
  };
  
  // 爻位分析
  lineAnalysis: {
    lines: Array<{
      position: number;
      meaning: string;
      influence: string;
    }>;
    coreLineIndex: number;
    coreLineSignificance: string;
    coreLineInterpretation: string;
    lineInteraction: string;
  };
  
  // 关联卦象
  relatedHexagrams: {
    changeHexagrams: Array<{
      hexagram: any;
      meaning: string;
    }>;
    oppositeHexagram: {
      hexagram: any;
      meaning: string;
    } | null;
    reverseHexagram: {
      hexagram: any;
      meaning: string;
    } | null;
  };
  
  // 详细分析
  detailedAnalysis: {
    developmentSuggestions: string[];
    attentionPoints: string[];
    relationshipPatterns: string;
    careerGuidance: string;
    lifePhilosophy: string;
    recentFortune: string;
  };
  
  // 分析结果
  analysis?: {
    corePersonality: string;
    advantageTraits: string[];
    challengeAreas: string[];
    developmentSuggestions: string[];
    attentionPoints: string[];
    relationshipPatterns: string;
    careerGuidance: string;
    lifePhilosophy: string;
    recentFortune: string;
  };
}

// 卦象分析类型
 export interface HexagramAnalysis {
   hexagram: Hexagram;
   innerFoundation: string;
   outerExpression: string;
   keyLines: Array<{
     position: string;
     name: string;
     text: string;
     interpretation: string;
   }>;
   relations: {
     complementary?: {
       name: string;
       advice: string;
     };
     opposite?: {
       name: string;
       advice: string;
     };
   };
   personalityAnalysis: string;
 }

// 测试结果类型（兼容旧版本）
export interface TestResult {
  id: string;
  timestamp: number;
  answers: TestAnswer[];
  hexagram: Hexagram;
  analysis: HexagramResult['analysis'];
}

// 本地存储数据类型
export interface LocalStorageData {
  testHistory: HexagramResult[];
  hexagramResults: HexagramResult[];
  userPreferences: {
    theme: 'light' | 'dark';
    language: 'zh' | 'en';
    userSelectedLanguage?: boolean;
  };
}

// 语言类型
export type Language = 'zh' | 'en';

// 主题类型
export type Theme = 'light' | 'dark';

// 导出旧接口别名以保持兼容性
export type Answer = TestAnswer;
export type PersonalityAnalysis = HexagramResult['analysis'];
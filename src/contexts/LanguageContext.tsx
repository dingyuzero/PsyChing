import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserPreferences, updateUserPreferences } from '../utils/localStorage';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 翻译字典
const translations = {
  zh: {
    // 导航
    home: '首页',
    test: '开始测试',
    history: '历史记录',
    about: '关于',
    language: '语言',
    switchToEnglish: '切换到英文',
    switchToChinese: '切换到中文',
    memberFeature: '会员功能',
    memberFeatureDesc: '升级会员解锁更多功能',
    copyright: '版权所有',
    
    // 首页
    title: '人格卦象测试',
    subtitle: '基于周易八卦的心理测试',
    description: '通过回答一系列问题，我们将为您生成专属的卦象，并提供详细的人格分析和建议。',
    startTest: '开始测试',
    viewHistory: '查看历史',
    features: '功能特色',
    feature1Title: '古老智慧',
    feature1Desc: '基于易经六十四卦的深度分析',
    feature2Title: '个性化报告',
    feature2Desc: '详细的人格特质和发展建议',
    feature3Title: '历史记录',
    feature3Desc: '保存测试结果，追踪成长轨迹',
    howItWorks: '如何使用',
    step1: '回答问题',
    step1Desc: '根据直觉选择最符合你的答案',
    step2: '生成卦象',
    step2Desc: '系统根据你的答案计算对应卦象',
    step3: '查看报告',
    step3Desc: '获得详细的人格分析和建议',
    heroTitle: '探索内在自我，解锁人格密码',
    heroSubtitle: '基于易学智慧与现代心理学的创新人格测试，自适应调整题目数量，快速确认人格卦象',
    learnMore: '了解更多',
    twoStages: '2阶段',
    testProcess: '测试流程',
    hexagramTypes: '卦象类型',
    tenQuestions: '自适应测试，平均3分钟即可完成',
    preciseTest: '精准测试',
    coreFeatures: '核心特色',
    coreFeaturesDesc: '融合传统智慧与现代科技，为你提供独特的人格洞察体验',
    aiIntelligentAssessment: 'AI智能测评',
    aiAssessmentDesc: '采用先进的自适应算法，根据你的回答动态调整题目数量，智能生成个性化问题，快速深度了解你的内心世界。',
    hexagramMapping: '卦象映射技术',
    hexagramMappingDesc: '独创的心理测量与周易卦象结合算法，将现代心理学与传统文化智慧完美融合，为你提供独特的人格洞察。',
    personalizedAnalysis: '个性化分析',
    personalizedAnalysisDesc: '基于你的测试结果，提供详细的人格特点分析、潜在挑战识别、发展建议和运势预测，助力个人成长。',
    ctaTitle: '准备好探索真实的自己了吗？',
    ctaSubtitle: '通过自适应测试，即可获得专属的人格卦象分析报告',
    
    // 测试页面
    preparingTest: '正在准备测试...',
    testInitFailed: '测试初始化失败',
    testInitFailedDesc: '抱歉，无法开始测试。请重试或返回首页。',
    pleaseSelectAnswer: '请选择一个答案',
    question: '问题',
    of: '/',
    nextQuestion: '下一题',
    previousQuestion: '上一题',
    submitTest: '提交测试',
    testProgress: '测试进度',
    completeTest: '完成测试',
    backToHome: '返回首页',
    restart: '重新开始',
    estimatedTime: '预计剩余时间',
    minutes: '分钟',
    completed: '完成',
    processing: '处理中',
    
    // 结果页面
    testResult: '测试结果',
    hexagram: '卦象',
    hexagramExplanation: '周易卦象解释',
    personality: '性格特点',
    personalityTraits: '性格特点',
    strengths: '优势',
    challenges: '挑战',
    suggestions: '建议',
    problems: '主要问题',
    solutions: '解决方案',
    precautions: '注意事项',
    warnings: '警示',
    fortune: '运势分析',
    startNewTest: '开始新测试',
    saveResult: '保存结果',
    shareResult: '分享结果',
    downloadResult: '下载结果',
    upperTrigram: '上卦',
    lowerTrigram: '下卦',
    hexagramNumber: '卦数',
    testTime: '测试时间',
    hexagramComposition: '卦象构成',
    testInfo: '测试信息',
    questionCount: '问题数量',
    testDuration: '测试用时',
    retakeTest: '重新测试',
    downloadReport: '下载报告',
    saving: '保存中',
    saved: '已保存',
    questionsUnit: '题',
    
    // 历史记录页面
    testHistory: '测试历史',
    loading: '正在加载历史记录...',
    refresh: '刷新',
    export: '导出',
    import: '导入',
    searchPlaceholder: '搜索卦象名称或人格特点...',
    sortByDate: '按时间排序',
    sortByHexagram: '按卦象排序',
    selectAll: '全选',
    deselectAll: '取消全选',
    deleteSelected: '删除选中',
    noTestRecords: '暂无测试记录',
    noTestRecordsDesc: '完成第一次测试后，结果将自动保存在这里',
    noMatchingRecords: '未找到匹配的记录',
    noMatchingRecordsDesc: '尝试调整搜索条件或清空搜索框',
    viewDetails: '查看详情',
    delete: '删除',
    clearAll: '清空所有记录',
    deleteConfirm: '确定要删除这个测试结果吗？',
    clearAllConfirm: '确定要清空所有历史记录吗？此操作不可恢复。',
    
    // 消息提示
    testResultSaved: '测试结果已保存',
    testResultDeleted: '测试结果已删除',
    deleteFailed: '删除失败',
    historyCleared: '历史记录已清空',
    clearFailed: '清空失败',
    dataExported: '数据已导出',
    exportFailed: '导出失败',
    dataImported: '数据导入成功',
    importFailed: '导入失败，请检查文件格式',
    loadHistoryFailed: '加载历史记录失败',
    personalityTestData: '人格卦象测试数据',
    exportSuccess: '数据导出成功',
    importSuccess: '数据导入成功',
    deleteSelectedConfirm: '确定要删除选中的 {count} 个测试结果吗？',
    deletedCount: '已删除 {count} 个测试结果',
    confidence: '置信度',
    corePersonality: '核心人格',
    
    // 通用文本
    confirm: '确认',
    cancel: '取消',
    close: '关闭',
    save: '保存',
    edit: '编辑',
    view: '查看',
    
    // 测试界面
    advancedMetrics: '高级分析指标',
    informationGain: '信息增益',
    questionWeight: '问题权重',
    subcategory: '子类别',
    difficultyLevel: '难度等级',
    category: '类别',
    difficulty: '难度',
    innerMotivation: '内在动机',
    outerBehavior: '外在行为',
    probabilityVisualization: '概率分布可视化',
    hideProbabilityChart: '隐藏分布图',
    showProbabilityChart: '显示分布图',
    innerMotivationProbability: '内在动机概率分布',
    outerBehaviorProbability: '外在行为概率分布',
    
    // 概率分布相关
    probability: {
      highest: '最高',
      highestProbability: '最高概率',
      entropy: '熵值',
      uniformity: '分布均匀度'
    },
    
    // Trigram names
    trigrams: {
      qian: '乾',
      kun: '坤',
      zhen: '震',
      xun: '巽',
      kan: '坎',
      li: '离',
      gen: '艮',
      dui: '兑'
    },
    
    // 测试阶段
    explorationPhase: '探索阶段',
    discriminationPhase: '区分阶段',
    confirmationPhase: '确认阶段',
    explorationDescription: '广泛收集信息',
    discriminationDescription: '精确区分类型',
    confirmationDescription: '验证最终结果',
    phaseProgress: '阶段进度',
    overallProgress: '总体进度',
    overallConfidence: '整体置信度',
    
    // 增强测试界面
    innerMotivationExploration: '内在动机探索',
    outerBehaviorAnalysis: '外在行为分析',
    explorationTip: '此阶段重点了解您的基本特征和偏好',
    discriminationTip: '此阶段通过对比性问题精确定位您的类型',
    confirmationTip: '此阶段验证前面的分析结果，确保准确性',
    explorationPeriod: '探索期',
    discriminationPeriod: '区分期',
    confirmationPeriod: '确认期',
    collectBasicInfo: '收集基础信息',
    preciseClassification: '精确分类',
    resultVerification: '结果验证',
    testEnded: '测试结束',
    veryHigh: '很高',
    high: '较高',
    medium: '中等',
    low: '较低',
    converged: '已收敛',
    nearConvergence: '接近收敛',
    partialConvergence: '部分收敛',
    diverging: '发散中',
    convergenceScore: '收敛分数',
    hide: '隐藏',
    details: '详细',
    option: '选项',
    
    // Result page translations
    resultPage: {
      hexagramSummary: '卦象摘要',
      hexagramGraphic: '卦象图形',
      motivationBehaviorAnalysis: '动机行为分析概览',
      yijingAnalysis: '周易卦辞解析',
      yijingOriginalText: '易经原文',
      psychologyMapping: '心理学人格映射',
      psychologyExplanation: '心理学解释',
      hexagramComposition: '卦象构成解析',
      upperTrigram: '上卦',
      lowerTrigram: '下卦',
      outerBehavior: '外在行为',
      innerMotivation: '内在动机',
      outerExpression: '外在表现',
      trigramName: '卦名',
      fiveElements: '五行',
      yijingInterpretation: '易经释义',
      psychologicalTraits: '心理特征',
      basicAnalysis: '基础分析',
      corePersonalityTraits: '核心人格特质',
      advantageTraits: '优势特质',
      challengeAreas: '挑战领域',
      probability: '概率',
      basedOnBayesian: '基于贝叶斯算法的',
      innerMotivationMatch: '内在动机匹配度',
      outerBehaviorMatch: '外在行为匹配度',
      confidenceLevel: '置信度',
      hexagramNumber: '卦数',
      lineAnalysis: '爻位分析',
      linePosition: '第{position}爻',
      hexagramNetworkRelation: '卦变网络关联',
      whatIsZongCuoGua: '什么是综卦和错卦？',
      whatIsZongGuaCuoGua: '什么是综卦和错卦？',
      zongGua: '综卦',
      cuoGua: '错卦',
      psychologicalInterpretation: '心理学解释',
      detailedAnalysis: '详细分析',
      developmentSuggestions: '发展建议',
      noDevelopmentSuggestions: '暂无发展建议',
      careerGuidance: '职业指导',
      lifePhilosophy: '人生哲学',
      importantNotice: '重要提示',
      importantNoticeContent: '此测试结果仅供参考，不能替代专业心理咨询。如需深入了解自己的心理状态，建议咨询专业心理健康专家。',
      retakeTest: '重新测试',
      viewHistory: '查看历史',
      shareResult: '分享结果',
      downloadReport: '下载报告',
      zongCuoExplanationTitle: '综卦与错卦解释',
      yijingZongCuo: '周易中的综卦与错卦',
      zongGuaReverse: '综卦（反卦）',
      philosophicalMeaning: '哲学意义',
      cuoGuaOpposite: '错卦（对卦）',
      reverseHexagram: '综卦',
      oppositeHexagram: '错卦',
      importantNoticeText: '此测试结果仅供参考，不能替代专业心理咨询。如需深入了解自己的心理状态，建议咨询专业心理健康专家。',
      reverseHexagramConcept: '综卦概念',
      reverseHexagramDescription: '综卦是将原卦上下颠倒而成的卦象，代表事物的另一面或相反的状态。',
      reverseHexagramPhilosophy: '综卦体现了阴阳转换、物极必反的哲学思想，提醒我们要从多角度看待问题。',
      oppositeHexagramConcept: '错卦概念',
      oppositeHexagramDescription: '错卦是将原卦的阴阳爻全部互换而成的卦象，代表互补和对立统一。',
      oppositeHexagramPhilosophy: '错卦体现了对立统一的哲学思想，强调事物的互补性和完整性。',
      reverseHexagramPersonalityMeaning: '综卦的人格意义',
      oppositeHexagramPersonalityMeaning: '错卦的人格意义',
      interpretationInPersonalityTest: '在人格测试中的解读意义',
      zongGuaPersonalityMeaning: '综卦的人格意义',
      potentialPersonalityFace: '潜在人格面',
      potentialPersonalityDesc: '综卦揭示了您内在的另一面，这是在特定情况下可能显现的人格特质。',
      developmentDirection: '发展方向',
      developmentDirectionDesc: '通过理解综卦，您可以发现自己未开发的潜能和成长方向。',
      balanceNeeds: '平衡需求',
      balanceNeedsDesc: '综卦提醒您在追求个人发展时需要保持的平衡点。',
      adaptability: '适应能力',
      adaptabilityDesc: '了解综卦有助于提高您在不同环境中的适应能力。',
      cuoGuaPersonalityMeaning: '错卦的人格意义',
      complementaryTraits: '互补特质',
      complementaryTraitsDesc: '错卦代表与您当前人格形成互补的特质，是完整人格的另一半。',
      growthSpace: '成长空间',
      growthSpaceDesc: '通过学习错卦的特质，您可以发现新的成长空间和发展可能。',
      completePersonality: '完整人格',
      completePersonalityDesc: '错卦帮助您理解人格的完整性，避免过度偏向某一方面。',
      balancedDevelopment: '平衡发展',
      balancedDevelopmentDesc: '整合错卦的智慧，有助于实现更加平衡和谐的人格发展。',
      practicalApplicationGuidance: '实际应用指导',
      selfAwareness: '自我认知',
      selfAwarenessDesc: '定期反思综卦和错卦的特质，加深对自己的理解。',
      interpersonalRelationships: '人际关系',
      interpersonalRelationshipsDesc: '在人际交往中，尝试展现综卦和错卦的积极特质。',
      personalDevelopment: '个人发展',
      personalDevelopmentDesc: '参考综卦和错卦的特质，制定更全面的个人成长计划。',
      understood: '我明白了',
      elements: {
         metal: '金',
         wood: '木',
         water: '水',
         fire: '火',
         earth: '土',
         unknown: '未知'
       }
    },
     
     // 问题和选项翻译
    testQuestions: {
      q1: {
        text: '在社交聚会中，你通常会：',
        options: ['主动与陌生人交谈', '与熟悉的朋友聊天', '安静地观察周围', '尽早离开聚会']
      },
      q2: {
        text: '当需要做重要决定时，你更倾向于：',
        options: ['快速决定并立即行动', '与他人讨论后决定', '仔细思考各种可能', '寻求专家建议']
      },
      q3: {
        text: '你的能量主要来源于：',
        options: ['与他人互动交流', '独处思考时光', '完成具体任务', '探索新的体验']
      },
      q4: {
        text: '当朋友遇到困难时，你会：',
        options: ['立即提供帮助', '倾听并给予建议', '尊重他们的选择', '建议寻求专业帮助']
      },
      q5: {
        text: '在团队合作中，你更愿意：',
        options: ['协调不同意见', '专注自己的任务', '支持团队决定', '提出创新想法']
      },
      q6: {
        text: '对于工作任务，你通常：',
        options: ['提前完成并检查', '按时完成要求', '在截止日期前完成', '需要他人提醒']
      },
      q7: {
        text: '你的工作空间通常是：',
        options: ['井然有序，物品分类摆放', '基本整洁，偶有杂乱', '创意混乱，但知道东西在哪', '比较杂乱，经常找不到东西']
      },
      q8: {
        text: '面对压力时，你通常：',
        options: ['保持冷静，寻找解决方案', '感到紧张，但能应对', '容易焦虑，需要支持', '感到overwhelmed，难以处理']
      },
      q9: {
        text: '当计划被突然改变时，你会：',
        options: ['快速适应新安排', '需要时间调整心态', '感到不安和困扰', '强烈抗拒改变']
      },
      q10: {
        text: '对于新的想法或观点，你：',
        options: ['积极探索和尝试', '谨慎考虑后接受', '保持怀疑态度', '倾向于坚持传统']
      },
      q11: {
        text: '在学习新技能时，你更喜欢：',
        options: ['探索创新的方法', '遵循既定的步骤', '结合理论与实践', '通过实际操作学习']
      },
      q12: {
        text: '做决定时，你更相信：',
        options: ['第一直觉感受', '逻辑分析结果', '过往经验判断', '他人的建议']
      },
      q13: {
        text: '你对未来的感知通常是：',
        scaleLabels: ['完全依赖计划', '平衡计划与直觉', '主要凭借直觉']
      }
    }
  },
  en: {
    // Navigation
    home: 'Home',
    test: 'Start Test',
    history: 'History',
    about: 'About',
    language: 'Language',
    switchToEnglish: 'Switch to English',
    switchToChinese: 'Switch to Chinese',
    memberFeature: 'Member Feature',
    memberFeatureDesc: 'Upgrade to unlock more features',
    copyright: 'All rights reserved',
    
    // Home page
    title: 'Personality Hexagram Test',
    subtitle: 'Psychological test based on I Ching Eight Trigrams',
    description: 'By answering a series of questions, we will generate your exclusive hexagram and provide detailed personality analysis and suggestions.',
    startTest: 'Start Test',
    viewHistory: 'View History',
    features: 'Features',
    feature1Title: 'Ancient Wisdom',
    feature1Desc: 'Deep analysis based on 64 hexagrams of I Ching',
    feature2Title: 'Personalized Report',
    feature2Desc: 'Detailed personality traits and development suggestions',
    feature3Title: 'History Records',
    feature3Desc: 'Save test results and track your growth',
    howItWorks: 'How It Works',
    step1: 'Answer Questions',
    step1Desc: 'Choose answers that best match your intuition',
    step2: 'Generate Hexagram',
    step2Desc: 'System calculates corresponding hexagram based on your answers',
    step3: 'View Report',
    step3Desc: 'Get detailed personality analysis and suggestions',
    heroTitle: 'Explore Your Inner Self, Unlock Your Personality Code',
    heroSubtitle: 'Innovative personality test based on I Ching wisdom and modern psychology, adaptively adjusting question count to quickly confirm your personality hexagram',
    learnMore: 'Learn More',
    twoStages: '2 Stages',
    testProcess: 'Test Process',
    hexagramTypes: 'Hexagram Types',
    tenQuestions: 'Adaptive Test, Average 3 Minutes to Complete',
    preciseTest: 'Precise Test',
    coreFeatures: 'Core Features',
    coreFeaturesDesc: 'Combining traditional wisdom with modern technology to provide unique personality insights',
    aiIntelligentAssessment: 'AI Intelligent Assessment',
    aiAssessmentDesc: 'Using advanced adaptive algorithms to dynamically adjust question count based on your responses, intelligently generating personalized questions to quickly understand your inner world.',
    hexagramMapping: 'Hexagram Mapping Technology',
    hexagramMappingDesc: 'Innovative algorithm combining psychological measurement with I Ching hexagrams, perfectly integrating modern psychology with traditional cultural wisdom.',
    personalizedAnalysis: 'Personalized Analysis',
    personalizedAnalysisDesc: 'Based on your test results, providing detailed personality trait analysis, potential challenge identification, development suggestions and fortune predictions.',
    ctaTitle: 'Ready to Explore Your True Self?',
    ctaSubtitle: 'Get your exclusive personality hexagram analysis report through adaptive testing',
    
    // Test page
    preparingTest: 'Preparing test...',
    testInitFailed: 'Test initialization failed',
    testInitFailedDesc: 'Sorry, unable to start the test. Please try again or return to home.',
    pleaseSelectAnswer: 'Please select an answer',
    question: 'Question',
    of: '/',
    nextQuestion: 'Next Question',
    previousQuestion: 'Previous Question',
    submitTest: 'Submit Test',
    testProgress: 'Test Progress',
    completeTest: 'Complete Test',
    backToHome: 'Back to Home',
    restart: 'Restart',
    estimatedTime: 'Estimated remaining time',
    minutes: 'minutes',
    completed: 'completed',
    processing: 'Processing',
    
    // Result page
    testResult: 'Test Result',
    hexagram: 'Hexagram',
    hexagramExplanation: 'I Ching Hexagram Explanation',
    personality: 'Personality',
    personalityTraits: 'Personality Traits',
    strengths: 'Strengths',
    challenges: 'Challenges',
    suggestions: 'Suggestions',
    problems: 'Main Issues',
    solutions: 'Solutions',
    precautions: 'Precautions',
    warnings: 'Warnings',
    fortune: 'Fortune Analysis',
    startNewTest: 'Start New Test',
    saveResult: 'Save Result',
    shareResult: 'Share Result',
    downloadResult: 'Download Result',
    upperTrigram: 'Upper Trigram',
    lowerTrigram: 'Lower Trigram',
    hexagramNumber: 'Hexagram No.',
    testTime: 'Test Time',
    hexagramComposition: 'Hexagram Composition',
    testInfo: 'Test Information',
    questionCount: 'Question Count',
    testDuration: 'Test Duration',
    retakeTest: 'Retake Test',
    downloadReport: 'Download Report',
    saving: 'Saving',
    saved: 'Saved',
    questionsUnit: 'questions',
    
    // History page
    testHistory: 'Test History',
    loading: 'Loading history...',
    refresh: 'Refresh',
    export: 'Export',
    import: 'Import',
    searchPlaceholder: 'Search hexagram names or personality traits...',
    sortByDate: 'Sort by Date',
    sortByHexagram: 'Sort by Hexagram',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    deleteSelected: 'Delete Selected',
    noTestRecords: 'No Test Records',
    noTestRecordsDesc: 'Results will be automatically saved here after your first test',
    noMatchingRecords: 'No Matching Records Found',
    noMatchingRecordsDesc: 'Try adjusting search criteria or clearing the search box',
    viewDetails: 'View Details',
    delete: 'Delete',
    clearAll: 'Clear All Records',
    deleteConfirm: 'Are you sure you want to delete this test result?',
    clearAllConfirm: 'Are you sure you want to clear all history records? This action cannot be undone.',
    
    // Messages
    testResultSaved: 'Test result saved',
    testResultDeleted: 'Test result deleted',
    deleteFailed: 'Delete failed',
    historyCleared: 'History cleared',
    clearFailed: 'Clear failed',
    dataExported: 'Data exported',
    exportFailed: 'Export failed',
    dataImported: 'Data imported successfully',
    importFailed: 'Import failed, please check file format',
    loadHistoryFailed: 'Failed to load history',
    personalityTestData: 'Personality Test Data',
    exportSuccess: 'Data exported successfully',
    importSuccess: 'Data imported successfully',
    deleteSelectedConfirm: 'Are you sure you want to delete the selected {count} test results?',
    deletedCount: 'Deleted {count} test results',
    confidence: 'Confidence',
    corePersonality: 'Core Personality',
    
    // Common
    confirm: 'Confirm',
    cancel: 'Cancel',
    close: 'Close',
    save: 'Save',
    edit: 'Edit',
    view: 'View',
    
    // Test interface
    advancedMetrics: 'Advanced Metrics',
    informationGain: 'Information Gain',
    questionWeight: 'Question Weight',
    subcategory: 'Subcategory',
    difficultyLevel: 'Difficulty Level',
    category: 'Category',
    difficulty: 'Difficulty',
    innerMotivation: 'Inner Motivation',
    outerBehavior: 'Outer Behavior',
    probabilityVisualization: 'Probability Visualization',
    
    // Probability distribution related
    probability: {
      highest: 'Highest',
      highestProbability: 'Highest Probability',
      entropy: 'Entropy',
      uniformity: 'Uniformity'
    },
    
    // Trigram names
    trigrams: {
      qian: 'Qian',
      kun: 'Kun',
      zhen: 'Zhen',
      xun: 'Xun',
      kan: 'Kan',
      li: 'Li',
      gen: 'Gen',
      dui: 'Dui'
    },
    
    // Test phases
    explorationPhase: 'Exploration Phase',
    discriminationPhase: 'Discrimination Phase',
    confirmationPhase: 'Confirmation Phase',
    explorationDescription: 'Broadly collect information',
    discriminationDescription: 'Precisely distinguish types',
    confirmationDescription: 'Verify final results',
    phaseProgress: 'Phase Progress',
    overallProgress: 'Overall Progress',
    overallConfidence: 'Overall Confidence',
    
    // Enhanced test interface
    innerMotivationExploration: 'Inner Motivation Exploration',
    outerBehaviorAnalysis: 'Outer Behavior Analysis',
    explorationTip: 'This phase focuses on understanding your basic characteristics and preferences',
    discriminationTip: 'This phase precisely locates your type through comparative questions',
    confirmationTip: 'This phase verifies previous analysis results to ensure accuracy',
    explorationPeriod: 'Exploration Period',
    discriminationPeriod: 'Discrimination Period',
    confirmationPeriod: 'Confirmation Period',
    collectBasicInfo: 'Collect Basic Information',
    preciseClassification: 'Precise Classification',
    resultVerification: 'Result Verification',
    testEnded: 'Test Ended',
    veryHigh: 'Very High',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    converged: 'Converged',
    nearConvergence: 'Near Convergence',
    partialConvergence: 'Partial Convergence',
    diverging: 'Diverging',
    convergenceScore: 'Convergence Score',
    hide: 'Hide',
    details: 'Details',
    option: 'Option',
    
    // Result page translations
    resultPage: {
      hexagramSummary: 'Hexagram Summary',
      hexagramGraphic: 'Hexagram Graphic',
      motivationBehaviorAnalysis: 'Motivation Behavior Analysis Overview',
      yijingAnalysis: 'I Ching Hexagram Analysis',
      yijingOriginalText: 'I Ching Original Text',
      psychologyMapping: 'Psychology Personality Mapping',
      psychologyExplanation: 'Psychology Explanation',
      hexagramComposition: 'Hexagram Composition Analysis',
      upperTrigram: 'Upper Trigram',
      lowerTrigram: 'Lower Trigram',
      outerBehavior: 'Outer Behavior',
      innerMotivation: 'Inner Motivation',
      outerExpression: 'Outer Expression',
      innerMotivationFull: 'Inner Motivation',
      trigramName: 'Trigram Name',
      fiveElements: 'Five Elements',
      yijingInterpretation: 'I Ching Interpretation',
      psychologicalCharacteristics: 'Psychological Characteristics',
      basicAnalysis: 'Basic Analysis',
      corePersonalityTraits: 'Core Personality Traits',
      advantageTraits: 'Advantage Traits',
      challengeAreas: 'Challenge Areas',
      probability: 'Probability',
      basedOnBayesian: 'Based on Bayesian Algorithm',
      innerMotivationMatch: 'Inner Motivation Match',
      outerBehaviorMatch: 'Outer Behavior Match',
      confidenceLevel: 'Confidence Level',
      hexagramNumber: 'Hexagram Number',
      lineAnalysis: 'Line Analysis',
      linePosition: 'Line {position}',
      hexagramNetworkRelation: 'Hexagram Network Relations',
      whatIsZongCuoGua: 'What are Zong and Cuo Hexagrams?',
      whatIsZongGuaCuoGua: 'What are Zong and Cuo Hexagrams?',
      zongGua: 'Zong Hexagram',
      cuoGua: 'Cuo Hexagram',
      psychologicalInterpretation: 'Psychological Interpretation',
      detailedAnalysis: 'Detailed Analysis',
      developmentSuggestions: 'Development Suggestions',
      noDevelopmentSuggestions: 'No development suggestions available',
      careerGuidance: 'Career Guidance',
      lifePhilosophy: 'Life Philosophy',
      importantNotice: 'Important Notice',
      importantNoticeContent: 'This test result is for reference only and cannot replace professional psychological counseling. For in-depth understanding of your psychological state, please consult professional mental health experts.',
      retakeTest: 'Retake Test',
      viewHistory: 'View History',
      shareResult: 'Share Result',
      downloadReport: 'Download Report',
      zongCuoExplanationTitle: 'Zong and Cuo Hexagram Explanation',
      yijingZongCuo: 'Zong and Cuo Hexagrams in I Ching',
      zongGuaReverse: 'Zong Hexagram (Reverse Hexagram)',
      philosophicalMeaning: 'Philosophical Meaning',
      cuoGuaOpposite: 'Cuo Hexagram (Opposite Hexagram)',
      reverseHexagram: 'Reverse Hexagram',
      oppositeHexagram: 'Opposite Hexagram',
      importantNoticeText: 'This test result is for reference only and cannot replace professional psychological counseling. For in-depth understanding of your psychological state, please consult professional mental health experts.',
      reverseHexagramConcept: 'Reverse Hexagram Concept',
      reverseHexagramDescription: 'The reverse hexagram is formed by flipping the original hexagram upside down, representing the other side or opposite state of things.',
      reverseHexagramPhilosophy: 'The reverse hexagram embodies the philosophical thought of yin-yang transformation and extremes leading to reversal, reminding us to view problems from multiple perspectives.',
      oppositeHexagramConcept: 'Opposite Hexagram Concept',
      oppositeHexagramDescription: 'The opposite hexagram is formed by inverting all yin and yang lines of the original hexagram, representing complementarity and unity of opposites.',
      oppositeHexagramPhilosophy: 'The opposite hexagram embodies the philosophical thought of unity of opposites, emphasizing the complementarity and completeness of things.',
      reverseHexagramPersonalityMeaning: 'Personality Meaning of Reverse Hexagram',
      oppositeHexagramPersonalityMeaning: 'Personality Meaning of Opposite Hexagram',
      interpretationInPersonalityTest: 'Interpretation in Personality Testing',
      zongGuaPersonalityMeaning: 'Personality Meaning of Zong Hexagram',
      potentialPersonalityFace: 'Potential Personality Aspect',
      potentialPersonalityDesc: 'The Zong hexagram reveals another side of your inner self, personality traits that may manifest in specific situations.',
      developmentDirection: 'Development Direction',
      developmentDirectionDesc: 'By understanding the Zong hexagram, you can discover your undeveloped potential and growth directions.',
      balanceNeeds: 'Balance Needs',
      balanceNeedsDesc: 'The Zong hexagram reminds you of the balance points needed in pursuing personal development.',
      adaptability: 'Adaptability',
      adaptabilityDesc: 'Understanding the Zong hexagram helps improve your adaptability in different environments.',
      cuoGuaPersonalityMeaning: 'Personality Meaning of Cuo Hexagram',
      complementaryTraits: 'Complementary Traits',
      complementaryTraitsDesc: 'The Cuo hexagram represents traits that complement your current personality, the other half of a complete personality.',
      growthSpace: 'Growth Space',
      growthSpaceDesc: 'By learning the traits of the Cuo hexagram, you can discover new growth spaces and development possibilities.',
      completePersonality: 'Complete Personality',
      completePersonalityDesc: 'The Cuo hexagram helps you understand personality completeness, avoiding excessive bias toward one aspect.',
      balancedDevelopment: 'Balanced Development',
      balancedDevelopmentDesc: 'Integrating the wisdom of the Cuo hexagram helps achieve more balanced and harmonious personality development.',
      practicalApplicationGuidance: 'Practical Application Guidance',
      selfAwareness: 'Self-Awareness',
      selfAwarenessDesc: 'Regularly reflect on the traits of Zong and Cuo hexagrams to deepen your self-understanding.',
      interpersonalRelationships: 'Interpersonal Relationships',
      interpersonalRelationshipsDesc: 'In interpersonal interactions, try to display the positive traits of Zong and Cuo hexagrams.',
      personalDevelopment: 'Personal Development',
      personalDevelopmentDesc: 'Reference the traits of Zong and Cuo hexagrams to create a more comprehensive personal growth plan.',
      understood: 'I Understand',
      elements: {
        metal: 'Metal',
        wood: 'Wood',
        water: 'Water',
        fire: 'Fire',
        earth: 'Earth',
        unknown: 'Unknown'
      }
    },

    
     // Questions and options translation
    testQuestions: {
      q1: {
        text: 'At social gatherings, you usually:',
        options: ['Actively talk to strangers', 'Chat with familiar friends', 'Quietly observe surroundings', 'Leave the party early']
      },
      q2: {
        text: 'When making important decisions, you tend to:',
        options: ['Decide quickly and act immediately', 'Discuss with others before deciding', 'Think carefully about all possibilities', 'Seek expert advice']
      },
      q3: {
        text: 'Your energy mainly comes from:',
        options: ['Interacting with others', 'Quiet time alone', 'Completing specific tasks', 'Exploring new experiences']
      },
      q4: {
        text: 'When friends encounter difficulties, you will:',
        options: ['Immediately provide help', 'Listen and give advice', 'Respect their choices', 'Suggest seeking professional help']
      },
      q5: {
        text: 'In team collaboration, you prefer to:',
        options: ['Coordinate different opinions', 'Focus on your own tasks', 'Support team decisions', 'Propose innovative ideas']
      },
      q6: {
        text: 'For work tasks, you usually:',
        options: ['Complete early and check', 'Complete on time as required', 'Complete before deadline', 'Need reminders from others']
      },
      q7: {
        text: 'Your workspace is usually:',
        options: ['Well-organized, items categorized', 'Basically tidy, occasionally messy', 'Creatively chaotic, but know where things are', 'Quite messy, often can\'t find things']
      },
      q8: {
        text: 'When facing pressure, you usually:',
        options: ['Stay calm, look for solutions', 'Feel nervous but can cope', 'Easily anxious, need support', 'Feel overwhelmed, hard to handle']
      },
      q9: {
        text: 'When plans are suddenly changed, you will:',
        options: ['Quickly adapt to new arrangements', 'Need time to adjust mindset', 'Feel uneasy and troubled', 'Strongly resist change']
      },
      q10: {
        text: 'For new ideas or viewpoints, you:',
        options: ['Actively explore and try', 'Carefully consider before accepting', 'Maintain skeptical attitude', 'Tend to stick to tradition']
      },
      q11: {
        text: 'When learning new skills, you prefer to:',
        options: ['Explore innovative methods', 'Follow established steps', 'Combine theory with practice', 'Learn through hands-on practice']
      },
      q12: {
        text: 'When making decisions, you trust more:',
        options: ['First intuitive feeling', 'Logical analysis results', 'Past experience judgment', 'Others\' advice']
      },
      q13: {
        text: 'Your perception of the future is usually:',
        scaleLabels: ['Completely rely on planning', 'Balance planning and intuition', 'Mainly rely on intuition']
      }
    }
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // 默认使用英文，只有用户明确选择中文时才切换
    const preferences = getUserPreferences();
    // 如果localStorage中没有语言设置，或者设置为中文但用户没有主动选择，则使用英文
    if (preferences.language === 'zh' && preferences.userSelectedLanguage) {
      setLanguageState('zh');
    } else {
      // 确保默认为英文，并清除可能存在的中文设置
      setLanguageState('en');
      updateUserPreferences({ language: 'en', userSelectedLanguage: false });
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    updateUserPreferences({ language: lang, userSelectedLanguage: true });
  };

  const t = (key: string): any => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // 返回原始键名如果找不到翻译
      }
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
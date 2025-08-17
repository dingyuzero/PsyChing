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

    // 通用
    confirm: '确认',
    cancel: '取消',
    close: '关闭',
    save: '保存',
    edit: '编辑',
    view: '查看',

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
    },

    // Home page language context
    homePage: {
      title: "探索内在自我，解锁人格密码",
      description: "基于易学智慧与现代心理学的创新人格测试，通过10道精准问题，为你揭示独特的人格卦象",
    },
    more: "了解更多",
    stats: {
      process: {
        stat: "2阶段",
        text: "测试流程"
      },
      type: {
        stat: "64",
        text: "卦象类型"
      },
      questions: {
        stat: "10题",
        text: "精准测试"
      }
    },
    featureList: {
      title: "核心特色",
      description: "融合传统智慧与现代科技，为你提供独特的人格洞察体验"
    },
    feature1: {
      title: "AI智能测评",
      description: "采用先进的自适应算法，根据你的回答动态生成个性化问题，每次测试仅需10个问题即可深度了解你的内心世界。"
    },
    feature2: {
      title: "卦象映射技术",
      description: "独创的心理测量与周易卦象结合算法，将现代心理学与传统文化智慧完美融合，为你提供独特的人格洞察。"
    },
    feature3: {
      title: "个性化分析",
      description: "基于你的测试结果，提供详细的人格特点分析、潜在挑战识别、发展建议和运势预测，助力个人成长。"
    },
    homeFooter: {
      title: "准备好探索真实的自己了吗？",
      description: "只需10道问题，即可获得专属的人格卦象分析报告"
    },

    // About page language context
    aboutProject: '关于项目',
    aboutPage: {
      title: '人格卦象映射系统',
      description: '这是一个创新的心理测评平台，将现代心理学理论与中国传统周易智慧相结合。 通过AI驱动的自适应问题生成技术，为用户提供个性化的人格分析和生活指导。 我们相信，古老的智慧与现代科技的结合，能够为现代人的自我认知和成长提供独特的价值。'
    },
    aboutFeatures: {
      text: '核心特性',
      f1: {
        title: 'AI智能测评',
        text: '采用先进的自适应算法，根据用户答案动态生成个性化问题，确保测试的准确性和针对性。'
      },
      f2: {
        title: '个性化分析',
        text: '基于测试结果提供详细的人格分析、问题识别、解决方案和近期运势指导。'
      },
      f3: {
        title: '周易卦象映射',
        text: '将现代心理学理论与传统周易智慧相结合，通过科学算法将人格特质映射到对应的卦象。'
      },
      f4: {
        title: '隐私保护',
        text: '所有数据仅存储在本地浏览器中，确保用户隐私安全，无需注册即可使用。'
      },
    },
    tech: {
      title: '技术栈',
      t1: '现代化前端框架',
      t2: '类型安全的JavaScript',
      t3: '实用优先的CSS框架',
      t4: '轻量级状态管理',
      t5: '快速构建工具',
      t6: '周易计算核心库'
    },
    opensource: '开源项目',
    mitLicense: {
      title: 'MIT 开源协议',
      description: '本项目采用 MIT 开源协议，允许任何人自由使用、修改和分发代码。 我们鼓励社区贡献和协作开发，共同完善这个项目。',
      check: '查看源码',
      star: '给个 Star'
    },
    thirdparties: {
      title: '第三方库引用',
      bazi: '用于周易卦象计算的核心库。',
      baziText: '请确保遵守其开源协议要求，在使用时保留原作者信息和协议声明。',
      otherLead: '其他依赖:',
      others: ' React、TypeScript、Tailwind CSS 等现代前端技术栈。',
      othersText: '所有依赖库均为开源项目，感谢开源社区的贡献。'
    },
    thanks: {
      title: '致谢',
      c1: {
        name: '开发团队',
        role: '项目开发与维护',
        description: '负责整体架构设计、功能开发和用户体验优化'
      },
      c2: {
        name: 'Bazi Library',
        role: '周易计算支持',
        description: '提供专业的周易卦象计算算法和数据支持'
      },
      c3: {
        name: '开源社区',
        role: '技术支持',
        description: '感谢所有开源项目和社区贡献者的无私奉献'
      }
    },
    contactUs: {
      title: '联系我们',
      description: '如果您有任何问题、建议或想要参与项目开发，欢迎通过以下方式联系我们：',
      start: '开始体验'
    },
    copyrightLicense: '© 2025 PsyChing. 本项目采用 MIT 开源协议',

    // History page language context
    downloadFile: '人格卦象测试数据',
    selectDelete1: '确定要删除选中的',
    selectDelete2: '个测试结果吗？',
    deleteSuccess1: '已删除',
    deleteSuccess2: '个测试结果',
    alertResult1: '卦象：',
    alertResult2: '核心人格：',
    noHistory: '暂无测试记录',
    historyGetStarted: '开始您的第一次人格卦象测试，探索内在的自己',
    historyQuestions: '10 题',
    guaNumber: '卦数: ',
    historyConfidence: '置信度: '
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

    // Common
    confirm: 'Confirm',
    cancel: 'Cancel',
    close: 'Close',
    save: 'Save',
    edit: 'Edit',
    view: 'View',

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
    },

    // Home page language context
    homePage: {
      title: "Explore Your Inner Self, Unlock the Personality Code",
      description:
        "An innovative personality test based on the wisdom of I Ching and modern psychology. Through 10 precise questions, it reveals your unique personality hexagram.",
    },
    more: "Learn More",
    stats: {
      process: {
        stat: "2 Stages",
        text: "Test Process",
      },
      type: {
        stat: "64",
        text: "Hexagram Types",
      },
      questions: {
        stat: "10 Questions",
        text: "Precise Test",
      },
    },
    featureList: {
      title: "Core Features",
      description:
        "Combining traditional wisdom with modern technology to provide you with a unique personality insight experience.",
    },
    feature1: {
      title: "AI Smart Assessment",
      description:
        "Using advanced adaptive algorithms, personalized questions are dynamically generated based on your responses. Each test requires only 10 questions to deeply understand your inner world.",
    },
    feature2: {
      title: "Hexagram Mapping Technology",
      description:
        "An original algorithm that integrates psychological measurement with I Ching hexagrams, perfectly merging modern psychology with traditional cultural wisdom to provide unique personality insights.",
    },
    feature3: {
      title: "Personalized Analysis",
      description:
        "Based on your test results, it provides detailed analysis of personality traits, identification of potential challenges, development suggestions, and fortune predictions to support personal growth.",
    },
    homeFooter: {
      title: "Ready to Explore the Real You?",
      description:
        "With just 10 questions, you can receive your exclusive personality hexagram analysis report.",
    },

    // About page language context
    aboutProject: "About the Project",
    aboutPage: {
      title: "Personality Hexagram Mapping System",
      description:
        "This is an innovative psychological assessment platform that combines modern psychological theories with the wisdom of the Chinese I Ching. Through AI-driven adaptive question generation, it provides users with personalized personality analysis and life guidance. We believe that the integration of ancient wisdom and modern technology can offer unique value to self-awareness and personal growth in the modern world.",
    },
    aboutFeatures: {
      text: "Core Features",
      f1: {
        title: "AI Smart Assessment",
        text: "Uses advanced adaptive algorithms to dynamically generate personalized questions based on user responses, ensuring accuracy and relevance of the test.",
      },
      f2: {
        title: "Personalized Analysis",
        text: "Provides detailed personality analysis, problem identification, solutions, and short-term fortune guidance based on test results.",
      },
      f3: {
        title: "I Ching Hexagram Mapping",
        text: "Integrates modern psychological theories with traditional I Ching wisdom, scientifically mapping personality traits to corresponding hexagrams.",
      },
      f4: {
        title: "Privacy Protection",
        text: "All data is stored only in the local browser, ensuring user privacy and security. No registration is required to use.",
      },
    },
    tech: {
      title: "Technology Stack",
      t1: "Modern Front-End Framework",
      t2: "Type-Safe JavaScript",
      t3: "Utility-First CSS Framework",
      t4: "Lightweight State Management",
      t5: "Fast Build Tools",
      t6: "I Ching Calculation Core Library",
    },
    opensource: "Open Source Project",
    mitLicense: {
      title: "MIT License",
      description:
        "This project is licensed under the MIT License, allowing anyone to freely use, modify, and distribute the code. We encourage community contributions and collaborative development to continuously improve this project.",
      check: "View Source Code",
      star: "Give a Star",
    },
    thirdparties: {
      title: "Third-Party Libraries",
      bazi: "Core library for I Ching hexagram calculations.",
      baziText:
        "Please ensure compliance with its open-source license by retaining author information and license statements when using it.",
      otherLead: "Other dependencies:",
      others: "React, TypeScript, Tailwind CSS, and other modern front-end technologies.",
      othersText:
        "All dependencies are open-source projects. We appreciate the contributions of the open-source community.",
    },
    thanks: {
      title: "Acknowledgements",
      c1: {
        name: "Development Team",
        role: "Project Development & Maintenance",
        description:
          "Responsible for overall architecture design, feature development, and user experience optimization.",
      },
      c2: {
        name: "Bazi Library",
        role: "I Ching Calculation Support",
        description:
          "Provides professional I Ching hexagram calculation algorithms and data support.",
      },
      c3: {
        name: "Open Source Community",
        role: "Technical Support",
        description:
          "Grateful for the selfless contributions of all open-source projects and community contributors.",
      },
    },
    contactUs: {
      title: "Contact Us",
      description:
        "If you have any questions, suggestions, or would like to participate in project development, feel free to reach out to us through the following:",
      start: "Get Started",
    },
    copyrightLicense: '© 2025 PsyChing. This project is licensed under MIT',

    // History page language context
    downloadFile: "Personality Hexagram Test Data",
    selectDelete1: "Are you sure you want to delete the selected",
    selectDelete2: "test result(s)?",
    deleteSuccess1: "Deleted",
    deleteSuccess2: "test result(s)",
    alertResult1: "Hexagram: ",
    alertResult2: "Core Personality: ",
    noHistory: "No test records available",
    historyGetStarted: "Start your first Personality Hexagram Test and explore your inner self",
    historyQuestions: "10 Questions",
    guaNumber: "Hexagram Number: ",
    historyConfidence: "Confidence: ",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('zh');

  useEffect(() => {
    // 从本地存储加载语言偏好
    const preferences = getUserPreferences();
    if (preferences.language) {
      setLanguageState(preferences.language as Language);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    updateUserPreferences({ language: lang });
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let value = translations[language];

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

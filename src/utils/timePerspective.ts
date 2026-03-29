import { TRIGRAMS } from '../data/hexagramDatabase';
import { HexagramResult, Language, ResultScenario, TrigramType } from '../types';

export interface ScenarioMeta {
  key: ResultScenario;
  label: string;
  shortLabel: string;
  title: string;
  description: string;
  instruction: string;
  accentClass: string;
  buttonClass: string;
}

export interface ScenarioComparisonInsight {
  title: string;
  summary: string;
  betweenLabel: string;
  highlights: string[];
  retainedStrengths: string[];
  actionFocus: string[];
  habitSuggestions: string[];
}

type ScenarioCopy = {
  label: string;
  shortLabel: string;
  title: string;
  description: string;
  instruction: string;
  betweenLabel: string;
  summary: (scenarioResult: HexagramResult, currentResult: HexagramResult) => string;
};

const zhScenarioCopy: Record<ResultScenario, ScenarioCopy> = {
  current: {
    label: '当前人格',
    shortLabel: '当前',
    title: '当前人格测试',
    description: '请根据你此刻真实稳定的想法与行为方式作答。',
    instruction: '',
    betweenLabel: '当前人格',
    summary: () => ''
  },
  past: {
    label: '人生回溯',
    shortLabel: '回溯',
    title: '回到五年前的自己',
    description: '请尽量代入五年前的你，按照当时的处境、习惯、价值取向和做事风格来回答。',
    instruction: '完成后我们会把五年前的人格卦象与当前人格卦象进行对照，帮助你回看这些年的变化轨迹。',
    betweenLabel: '五年前的自己 vs 当前的自己',
    summary: (scenarioResult, currentResult) =>
      `从五年前的${scenarioResult.hexagram.name_zh}走到现在的${currentResult.hexagram.name_zh}，说明你的内在驱动力和外在表达方式都经历了清晰的演变。`
  },
  future: {
    label: '未来指引',
    shortLabel: '未来',
    title: '想象五年后的理想自己',
    description: '请代入五年后你最想成为的自己，按照那个版本的判断方式、气质状态和生活习惯来回答。',
    instruction: '完成后我们会比较当前人格与未来人格的差异，提炼你现在值得坚持和培养的方向。',
    betweenLabel: '当前的自己 vs 五年后的理想自己',
    summary: (scenarioResult, currentResult) =>
      `你理想中的五年后自己，从${currentResult.hexagram.name_zh}走向${scenarioResult.hexagram.name_zh}。这更像是一条成长方向，而不是变成完全不同的人。`
  }
};

const enScenarioCopy: Record<ResultScenario, ScenarioCopy> = {
  current: {
    label: 'Current',
    shortLabel: 'Current',
    title: 'Current Personality Test',
    description: 'Answer based on who you are right now.',
    instruction: '',
    betweenLabel: 'Current Self',
    summary: () => ''
  },
  past: {
    label: 'Life Review',
    shortLabel: 'Past',
    title: 'Return to Yourself Five Years Ago',
    description: 'Answer as the version of you from five years ago, using that mindset and life context.',
    instruction: 'We will compare that result with your current result to summarize how you have changed.',
    betweenLabel: 'Self Five Years Ago vs Current Self',
    summary: (scenarioResult, currentResult) =>
      `From ${scenarioResult.hexagram.name_en} five years ago to ${currentResult.hexagram.name_en} today, your priorities and expression style have clearly evolved.`
  },
  future: {
    label: 'Future Guide',
    shortLabel: 'Future',
    title: 'Imagine Your Ideal Self Five Years Ahead',
    description: 'Answer as your ideal self five years from now, based on how you hope to think and act.',
    instruction: 'We will compare your current and future results to suggest what to keep and what to build now.',
    betweenLabel: 'Current Self vs Ideal Self Five Years Ahead',
    summary: (scenarioResult, currentResult) =>
      `Your ideal self five years ahead moves from ${currentResult.hexagram.name_en} toward ${scenarioResult.hexagram.name_en}, revealing a direction for growth rather than a completely different identity.`
  }
};

const zhMotivationDescriptions: Record<TrigramType, string> = {
  qian: '更看重突破、主动担当与自我驱动',
  kun: '更看重稳定、安全感与长期承托',
  zhen: '更愿意主动发起改变，推动事情前进',
  xun: '更强调灵活调整、顺势推进与细腻适应',
  kan: '更偏向深度思考、审慎判断与积累成长',
  li: '更追求表达、意义感与照亮他人的价值',
  gen: '更重视边界、秩序与让自己安定下来',
  dui: '更重视连接、关系感与轻松开放的互动'
};

const enMotivationDescriptions: Record<TrigramType, string> = {
  qian: 'values breakthroughs, initiative, and self-drive more strongly',
  kun: 'values stability, safety, and reliable support more strongly',
  zhen: 'leans more toward initiating change and moving things forward',
  xun: 'emphasizes flexibility, adaptation, and gradual influence more strongly',
  kan: 'leans more toward deep thinking, caution, and long-term growth',
  li: 'places more value on expression, meaning, and inspiring others',
  gen: 'values boundaries, order, and inner steadiness more strongly',
  dui: 'values connection, relationships, and open interaction more strongly'
};

const zhBehaviorDescriptions: Record<TrigramType, string> = {
  qian: '更容易以带领者和推动者的姿态出现',
  kun: '更容易以承接、支持与包容的方式出现',
  zhen: '更容易表现出行动力和推进感',
  xun: '更容易通过柔和、渗透式的方式影响环境',
  kan: '更容易显得理性、谨慎且有洞察',
  li: '更容易通过表达、启发与感染力影响他人',
  gen: '更容易表现出克制、定力和边界感',
  dui: '更容易表现出亲和、沟通和共鸣能力'
};

const enBehaviorDescriptions: Record<TrigramType, string> = {
  qian: 'shows up more like a leader and driver',
  kun: 'shows up more through support, receptiveness, and steadiness',
  zhen: 'shows stronger action and momentum',
  xun: 'influences others more through gentle penetration and flexibility',
  kan: 'appears more analytical, cautious, and perceptive',
  li: 'influences others more through expression and inspiration',
  gen: 'shows more restraint, steadiness, and boundaries',
  dui: 'shows more warmth, communication, and resonance'
};

const getScenarioCopy = (scenario: ResultScenario, language: Language) => {
  return language === 'zh' ? zhScenarioCopy[scenario] : enScenarioCopy[scenario];
};

const getTrigramLabel = (trigram: TrigramType, language: Language) => {
  const data = TRIGRAMS[trigram];
  return language === 'zh' ? data.name_zh : data.name_en;
};

const describeShift = (
  start: TrigramType,
  end: TrigramType,
  kind: 'motivation' | 'behavior',
  language: Language
) => {
  const startLabel = getTrigramLabel(start, language);
  const endLabel = getTrigramLabel(end, language);
  const isZh = language === 'zh';
  const description =
    kind === 'motivation'
      ? isZh
        ? zhMotivationDescriptions[end]
        : enMotivationDescriptions[end]
      : isZh
        ? zhBehaviorDescriptions[end]
        : enBehaviorDescriptions[end];

  if (start === end) {
    return isZh
      ? `${kind === 'motivation' ? '内在动机' : '外在表现'}保持在${startLabel}，说明这一层人格底色整体延续了下来。`
      : `${kind === 'motivation' ? 'Inner motivation' : 'Outer expression'} stays with ${startLabel}, showing strong continuity.`;
  }

  return isZh
    ? `${kind === 'motivation' ? '内在动机' : '外在表现'}从${startLabel}转向${endLabel}，意味着你${description}。`
    : `${kind === 'motivation' ? 'Inner motivation' : 'Outer expression'} shifts from ${startLabel} to ${endLabel}, meaning this version of you ${description}.`;
};

const getSharedStrengths = (start: HexagramResult, end: HexagramResult, language: Language) => {
  const isZh = language === 'zh';
  const items: string[] = [];

  if (start.hexagram.lower_trigram === end.hexagram.lower_trigram) {
    const label = getTrigramLabel(start.hexagram.lower_trigram as TrigramType, language);
    items.push(
      isZh
        ? `你在核心动机上始终保留着${label}这一底色。`
        : `Your core motivation consistently retains the ${label} pattern.`
    );
  }

  if (start.hexagram.upper_trigram === end.hexagram.upper_trigram) {
    const label = getTrigramLabel(start.hexagram.upper_trigram as TrigramType, language);
    items.push(
      isZh
        ? `你对外表达自己的方式，仍然带有${label}的稳定特征。`
        : `Your outward style still carries the stable ${label} signature.`
    );
  }

  const sharedTrait = start.basicAnalysis.advantageTraits.find((trait) =>
    end.basicAnalysis.advantageTraits.includes(trait)
  );

  if (sharedTrait) {
    items.push(
      isZh
        ? `有一项优势在两个阶段都很突出: ${sharedTrait}`
        : `One strength continues across both versions: ${sharedTrait}`
    );
  }

  return items;
};

export const getResultScenario = (result?: HexagramResult | null): ResultScenario => {
  return result?.scenario || 'current';
};

export const getScenarioMeta = (scenario: ResultScenario, language: Language): ScenarioMeta => {
  const copy = getScenarioCopy(scenario, language);

  if (scenario === 'past') {
    return {
      key: scenario,
      label: copy.label,
      shortLabel: copy.shortLabel,
      title: copy.title,
      description: copy.description,
      instruction: copy.instruction,
      accentClass: 'from-amber-500 to-orange-500',
      buttonClass: 'from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
    };
  }

  if (scenario === 'future') {
    return {
      key: scenario,
      label: copy.label,
      shortLabel: copy.shortLabel,
      title: copy.title,
      description: copy.description,
      instruction: copy.instruction,
      accentClass: 'from-emerald-500 to-teal-500',
      buttonClass: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
    };
  }

  return {
    key: 'current',
    label: copy.label,
    shortLabel: copy.shortLabel,
    title: copy.title,
    description: copy.description,
    instruction: copy.instruction,
    accentClass: 'from-blue-500 to-purple-500',
    buttonClass: 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
  };
};

export const buildScenarioComparison = (
  scenarioResult: HexagramResult,
  currentResult: HexagramResult,
  language: Language
): ScenarioComparisonInsight | null => {
  const scenario = getResultScenario(scenarioResult);
  if (scenario === 'current') {
    return null;
  }

  const isZh = language === 'zh';
  const copy = getScenarioCopy(scenario, language);
  const start = scenario === 'past' ? scenarioResult : currentResult;
  const end = scenario === 'past' ? currentResult : scenarioResult;
  const sharedStrengths = getSharedStrengths(start, end, language);

  const highlights = [
    describeShift(
      start.hexagram.lower_trigram as TrigramType,
      end.hexagram.lower_trigram as TrigramType,
      'motivation',
      language
    ),
    describeShift(
      start.hexagram.upper_trigram as TrigramType,
      end.hexagram.upper_trigram as TrigramType,
      'behavior',
      language
    ),
    isZh
      ? `整体卦象从${start.hexagram.name_zh}变化为${end.hexagram.name_zh}，说明你的人格组合重点已经发生重新排序。`
      : `The overall hexagram moves from ${start.hexagram.name_en} to ${end.hexagram.name_en}, showing that the combination of your traits is being reorganized.`
  ];

  const actionFocus =
    scenario === 'future'
      ? end.detailedAnalysis.developmentSuggestions.slice(0, 3).map((item) =>
          isZh ? `如果想靠近未来的自己，现在可以重点练习: ${item}` : `To move toward your future self, practice this now: ${item}`
        )
      : currentResult.detailedAnalysis.developmentSuggestions.slice(0, 3).map((item) =>
          isZh ? `站在现在回看，这条方向仍然值得继续: ${item}` : `Looking back from now, this is still worth continuing: ${item}`
        );

  const habitSuggestions =
    scenario === 'future'
      ? [
          ...currentResult.basicAnalysis.advantageTraits.slice(0, 2).map((item) =>
            isZh ? `继续保持你已经拥有的好习惯与优势: ${item}` : `Keep reinforcing the strength you already have: ${item}`
          ),
          ...scenarioResult.detailedAnalysis.developmentSuggestions.slice(0, 2).map((item) =>
            isZh ? `逐步培养的新习惯方向: ${item}` : `A new habit direction to build gradually: ${item}`
          )
        ]
      : [
          ...sharedStrengths.slice(0, 2),
          ...currentResult.basicAnalysis.advantageTraits.slice(0, 2).map((item) =>
            isZh ? `这些年形成的优势，值得继续保持: ${item}` : `A strength you have formed over time and should keep: ${item}`
          )
        ];

  return {
    title: copy.label,
    summary: copy.summary(scenarioResult, currentResult),
    betweenLabel: copy.betweenLabel,
    highlights,
    retainedStrengths:
      sharedStrengths.length > 0
        ? sharedStrengths
        : [
            isZh
              ? '这两个阶段并不是彼此否定，而是在不同人生任务下呈现出的不同侧面。'
              : 'These two states are not contradictions, but different responses to different stages of life.'
          ],
    actionFocus,
    habitSuggestions
  };
};

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Download,
  Heart,
  History,
  RefreshCw,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/LanguageContext';
import { useTestStore } from '../store/useTestStore';
import { enhancedBayesianEngine } from '../utils/enhancedBayesianEngine';
import { getLatestCurrentResult, getResultById } from '../utils/localStorage';
import { getHexagramDisplayName, getTrigramDisplayName, localizeHexagramResult } from '../utils/resultLocalization';
import TimeComparisonCard from '../components/TimeComparisonCard';
import { buildScenarioComparison, getResultScenario, getScenarioMeta } from '../utils/timePerspective';

const generateHexagramLines = (lines: number[]) => {
  return (
    <div className="flex flex-col items-center space-y-1">
      {lines.slice().reverse().map((line, index) => (
        <div key={index} className="flex items-center justify-center">
          {line === 1 ? (
            <div className="w-16 h-1.5 rounded-full bg-slate-900" />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-7 h-1.5 rounded-full bg-slate-900" />
              <div className="w-7 h-1.5 rounded-full bg-slate-900" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const Result = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const { currentResult: liveCurrentResult, resetTest } = useTestStore();

  const resultId = searchParams.get('id');
  const storedResult = resultId ? getResultById(resultId) : null;
  const currentResult = storedResult || liveCurrentResult;
  const localizedResult = currentResult ? localizeHexagramResult(currentResult, language) : null;
  const scenario = getResultScenario(currentResult);
  const scenarioMeta = getScenarioMeta(scenario, language);
  const comparisonBase =
    currentResult && scenario !== 'current'
      ? (currentResult.comparisonBaseResultId
          ? getResultById(currentResult.comparisonBaseResultId)
          : getLatestCurrentResult()) || null
      : null;
  const timeComparison =
    currentResult && comparisonBase ? buildScenarioComparison(currentResult, comparisonBase, language) : null;
  const alternateHexagramName = currentResult
    ? language === 'zh'
      ? currentResult.hexagram.name_en
      : currentResult.hexagram.name_zh
    : '';
  const probabilitySource = !storedResult ? enhancedBayesianEngine.getCurrentProbabilities() : null;

  useEffect(() => {
    if (!currentResult) {
      navigate('/', { replace: true });
    }
  }, [currentResult, navigate]);

  if (!currentResult || !localizedResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <p className="text-slate-600">{language === 'zh' ? '正在加载结果...' : 'Loading result...'}</p>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/result?id=${currentResult.id}`;

  const handleShare = async () => {
    const shareText =
      language === 'zh'
        ? `我的人格卦象：${localizedResult.hexagramName}\n\n${localizedResult.basicAnalysis.corePersonality}`
        : `My PsyChing result: ${localizedResult.hexagramName}\n\n${localizedResult.basicAnalysis.corePersonality}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: language === 'zh' ? '我的 PsyChing 结果' : 'My PsyChing Result',
          text: shareText,
          url: shareUrl
        });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      toast.success(language === 'zh' ? '结果已复制到剪贴板' : 'Result copied to clipboard.');
    } catch {
      toast.error(language === 'zh' ? '复制失败' : 'Copy failed.');
    }
  };

  const handleDownload = () => {
    const content =
      language === 'zh'
        ? [
            'PsyChing 结果',
            '',
            `时间：${new Date(currentResult.timestamp).toLocaleString()}`,
            `卦象：${localizedResult.hexagramName}`,
            `英文名：${currentResult.hexagram.name_en}`,
            '',
            '核心人格：',
            localizedResult.basicAnalysis.corePersonality,
            '',
            `优势特质：${localizedResult.basicAnalysis.advantageTraits.join('、')}`,
            `挑战领域：${localizedResult.basicAnalysis.challengeAreas.join('、')}`,
            '',
            '发展建议：',
            ...localizedResult.detailedAnalysis.developmentSuggestions,
            '',
            `关系模式：${localizedResult.detailedAnalysis.relationshipPatterns}`,
            `职业指导：${localizedResult.detailedAnalysis.careerGuidance}`,
            `人生哲学：${localizedResult.detailedAnalysis.lifePhilosophy}`
          ].join('\n')
        : [
            'PsyChing Result',
            '',
            `Time: ${new Date(currentResult.timestamp).toLocaleString()}`,
            `Hexagram: ${localizedResult.hexagramName}`,
            `Chinese Name: ${currentResult.hexagram.name_zh}`,
            '',
            'Core Personality:',
            localizedResult.basicAnalysis.corePersonality,
            '',
            `Strengths: ${localizedResult.basicAnalysis.advantageTraits.join(', ')}`,
            `Challenges: ${localizedResult.basicAnalysis.challengeAreas.join(', ')}`,
            '',
            'Development Suggestions:',
            ...localizedResult.detailedAnalysis.developmentSuggestions,
            '',
            `Relationship Pattern: ${localizedResult.detailedAnalysis.relationshipPatterns}`,
            `Career Guidance: ${localizedResult.detailedAnalysis.careerGuidance}`,
            `Life Philosophy: ${localizedResult.detailedAnalysis.lifePhilosophy}`
          ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download =
      language === 'zh'
        ? `psyching-result-${new Date(currentResult.timestamp).toISOString().slice(0, 10)}.txt`
        : `psy-ching-result-${new Date(currentResult.timestamp).toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(language === 'zh' ? '结果已下载' : 'Report downloaded.');
  };

  const handleRetake = () => {
    resetTest();
    navigate('/test');
  };

  const innerProbability =
    probabilitySource?.inner_motivation[
      currentResult.hexagram.lower_trigram as keyof typeof probabilitySource.inner_motivation
    ];
  const outerProbability =
    probabilitySource?.outer_behavior[
      currentResult.hexagram.upper_trigram as keyof typeof probabilitySource.outer_behavior
    ];
  const fromResult = scenario !== 'current' && comparisonBase
    ? scenario === 'future'
      ? comparisonBase
      : currentResult
    : null;
  const toResult = scenario !== 'current' && comparisonBase
    ? scenario === 'future'
      ? currentResult
      : comparisonBase
    : null;
  const localizedFromResult = fromResult ? localizeHexagramResult(fromResult, language) : null;
  const localizedToResult = toResult ? localizeHexagramResult(toResult, language) : null;
  const fromLabel = scenario === 'future'
    ? (language === 'zh' ? '当前人格' : 'Current Self')
    : (language === 'zh' ? '五年前的你' : 'You Five Years Ago');
  const toLabel = scenario === 'future'
    ? (language === 'zh' ? '五年后的理想你' : 'Ideal Self in Five Years')
    : (language === 'zh' ? '现在的你' : 'You Today');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {language === 'zh' ? '返回首页' : 'Back Home'}
          </button>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <History className="w-4 h-4" />
            <span>
              {new Date(currentResult.timestamp).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US')}
            </span>
          </div>
        </div>

        <section className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 mb-8">
          <div className="text-center">
            {scenario !== 'current' && (
              <div className="mb-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${scenarioMeta.accentClass}`}
                >
                  {scenarioMeta.label}
                </span>
              </div>
            )}

            {localizedFromResult && localizedToResult ? (
              <div className="mb-8">
                <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] items-center max-w-3xl mx-auto">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <div className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-500 mb-4">
                      {fromLabel}
                    </div>
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
                      {generateHexagramLines(fromResult.hexagram.lines)}
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">{localizedFromResult.hexagramName}</div>
                    <div className="text-sm text-slate-500">
                      {language === 'zh' ? fromResult.hexagram.name_en : fromResult.hexagram.name_zh}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3 px-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm">
                      <ArrowRight className="w-6 h-6 text-slate-600" />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm">
                    <div className="text-xs font-semibold tracking-[0.18em] uppercase text-amber-700 mb-4">
                      {toLabel}
                    </div>
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
                      {generateHexagramLines(toResult.hexagram.lines)}
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">{localizedToResult.hexagramName}</div>
                    <div className="text-sm text-slate-500">
                      {language === 'zh' ? toResult.hexagram.name_en : toResult.hexagram.name_zh}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-5 shadow-lg">
                {generateHexagramLines(currentResult.hexagram.lines)}
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{localizedResult.hexagramName}</h1>
            <p className="text-lg text-slate-600 mb-4">{alternateHexagramName}</p>
            <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
              <span>
                {language === 'zh' ? '置信度' : 'Confidence'}: {Math.round(currentResult.confidence)}%
              </span>
              <span>•</span>
              <span>
                {language === 'zh' ? '卦序' : 'Hexagram No.'}: {currentResult.hexagram.gua_number}
              </span>
            </div>

            <div className="mt-8 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 p-6 text-left">
              <div className="flex items-center gap-2 text-amber-900 font-semibold mb-3">
                <Sparkles className="w-5 h-5" />
                <span>{language === 'zh' ? '结果摘要' : 'Summary'}</span>
              </div>
              <p className="text-slate-700 leading-relaxed">{localizedResult.summary}</p>
            </div>
          </div>
        </section>

        {timeComparison && (
          <TimeComparisonCard meta={scenarioMeta} comparison={timeComparison} language={language} />
        )}

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] mb-8">
          <section className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">
                {language === 'zh' ? '人格结构' : 'Structure'}
              </h2>
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl bg-blue-50 border border-blue-200 p-5">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div>
                    <div className="text-sm text-blue-700 font-medium">
                      {language === 'zh' ? '下卦 · 内在动机' : 'Lower Trigram · Inner Motivation'}
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {getTrigramDisplayName(currentResult.hexagram.lower_trigram, language)}
                    </div>
                  </div>
                  <Heart className="w-6 h-6 text-blue-500" />
                </div>
                {typeof innerProbability === 'number' && (
                  <p className="text-sm text-blue-700">
                    {language === 'zh' ? '当前匹配概率' : 'Current match'}: {Math.round(innerProbability * 100)}%
                  </p>
                )}
              </div>

              <div className="rounded-2xl bg-purple-50 border border-purple-200 p-5">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div>
                    <div className="text-sm text-purple-700 font-medium">
                      {language === 'zh' ? '上卦 · 外在行为' : 'Upper Trigram · Outer Behavior'}
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {getTrigramDisplayName(currentResult.hexagram.upper_trigram, language)}
                    </div>
                  </div>
                  <Users className="w-6 h-6 text-purple-500" />
                </div>
                {typeof outerProbability === 'number' && (
                  <p className="text-sm text-purple-700">
                    {language === 'zh' ? '当前匹配概率' : 'Current match'}: {Math.round(outerProbability * 100)}%
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-slate-900">
                {language === 'zh' ? '核心人格' : 'Core Personality'}
              </h2>
            </div>

            <p className="text-slate-700 leading-relaxed mb-6">
              {localizedResult.basicAnalysis.corePersonality}
            </p>

            <div className="grid gap-5">
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5">
                <h3 className="font-semibold text-emerald-900 mb-3">
                  {language === 'zh' ? '优势特质' : 'Strengths'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {localizedResult.basicAnalysis.advantageTraits.map((trait) => (
                    <span
                      key={trait}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-emerald-200 text-sm text-emerald-900"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-orange-50 border border-orange-200 p-5">
                <h3 className="font-semibold text-orange-900 mb-3">
                  {language === 'zh' ? '挑战领域' : 'Challenges'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {localizedResult.basicAnalysis.challengeAreas.map((trait) => (
                    <span
                      key={trait}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-orange-200 text-sm text-orange-900"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 mb-8">
          <section className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">
                {language === 'zh' ? '发展建议' : 'Development Guidance'}
              </h2>
            </div>

            <ul className="space-y-3 text-slate-700">
              {localizedResult.detailedAnalysis.developmentSuggestions.map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-indigo-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-blue-50 border border-blue-200 p-5">
                <h3 className="font-semibold text-blue-900 mb-2">
                  {language === 'zh' ? '关系模式' : 'Relationship Pattern'}
                </h3>
                <p className="text-blue-900 leading-relaxed">
                  {localizedResult.detailedAnalysis.relationshipPatterns}
                </p>
              </div>
              <div className="rounded-2xl bg-purple-50 border border-purple-200 p-5">
                <h3 className="font-semibold text-purple-900 mb-2">
                  {language === 'zh' ? '近期提醒' : 'Near-Term Note'}
                </h3>
                <p className="text-purple-900 leading-relaxed">
                  {localizedResult.detailedAnalysis.recentFortune}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-slate-900">
                {language === 'zh' ? '卦象延展' : 'Related Hexagrams'}
              </h2>
            </div>

            <div className="space-y-4">
              {currentResult.relatedHexagrams.reverseHexagram && (
                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5">
                  <h3 className="font-semibold text-amber-900 mb-2">
                    {language === 'zh' ? '综卦' : 'Reverse Hexagram'}: {' '}
                    {getHexagramDisplayName(currentResult.relatedHexagrams.reverseHexagram.hexagram, language)}
                  </h3>
                  <p className="text-amber-900 leading-relaxed">{localizedResult.relatedHexagrams.reverseMeaning}</p>
                </div>
              )}

              {currentResult.relatedHexagrams.oppositeHexagram && (
                <div className="rounded-2xl bg-orange-50 border border-orange-200 p-5">
                  <h3 className="font-semibold text-orange-900 mb-2">
                    {language === 'zh' ? '错卦' : 'Opposite Hexagram'}: {' '}
                    {getHexagramDisplayName(currentResult.relatedHexagrams.oppositeHexagram.hexagram, language)}
                  </h3>
                  <p className="text-orange-900 leading-relaxed">{localizedResult.relatedHexagrams.oppositeMeaning}</p>
                </div>
              )}

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                <h3 className="font-semibold text-slate-900 mb-2">
                  {language === 'zh' ? '职业指导' : 'Career Guidance'}
                </h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  {localizedResult.detailedAnalysis.careerGuidance}
                </p>
                <h3 className="font-semibold text-slate-900 mb-2">
                  {language === 'zh' ? '人生哲学' : 'Life Philosophy'}
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {localizedResult.detailedAnalysis.lifePhilosophy}
                </p>
              </div>
            </div>
          </section>
        </div>

        {localizedResult.lineAnalysis.lines.length > 0 && (
          <section className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {language === 'zh' ? '爻位分析' : 'Line Analysis'}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {localizedResult.lineAnalysis.lines.map((line) => (
                <div key={line.position} className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {language === 'zh' ? `第 ${line.position} 爻` : `Line ${line.position}`}
                  </h3>
                  <p className="text-slate-700 leading-relaxed mb-2">{line.meaning}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{line.influence}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="bg-amber-50 border border-amber-200 rounded-3xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-amber-900 mb-2">
                {language === 'zh' ? '重要说明' : 'Important Notice'}
              </h2>
              <p className="text-amber-900 leading-relaxed">
                {language === 'zh'
                  ? '本结果用于自我观察与体验，不替代专业心理评估或咨询。'
                  : 'This result is for self-observation and reflection only and does not replace professional assessment or counseling.'}
              </p>
              <p className="text-amber-900 leading-relaxed mt-3">
                {language === 'zh'
                  ? 'Psyching V2.0.1 含“人生回溯”与“未来指引”两个特色功能。当前版本为测试版本，信效度与题目参数会在后续实证阶段继续验证与微调。'
                  : 'Psyching V2.0.1 includes the Life Review and Future Guide features. This is currently a testing version, and reliability, validity, and item parameters will be further validated and fine-tuned in a later empirical phase.'}
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleShare}
            className="inline-flex items-center px-5 py-3 rounded-2xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {language === 'zh' ? '分享结果' : 'Share Result'}
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-5 py-3 rounded-2xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            {language === 'zh' ? '下载报告' : 'Download Report'}
          </button>
          <button
            onClick={() => navigate('/history')}
            className="inline-flex items-center px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            <History className="w-4 h-4 mr-2" />
            {language === 'zh' ? '查看历史' : 'View History'}
          </button>
          <button
            onClick={handleRetake}
            className="inline-flex items-center px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {language === 'zh' ? '重新测试' : 'Retake Test'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;

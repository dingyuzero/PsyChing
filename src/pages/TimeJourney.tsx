import { ArrowLeft, ArrowRight, Brain, Compass, History, Sparkles } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ResultScenario } from '../types';
import { getLatestCurrentResult } from '../utils/localStorage';
import { getScenarioMeta } from '../utils/timePerspective';
import { localizeHexagramResult } from '../utils/resultLocalization';

const normalizeScenario = (value?: string): ResultScenario => {
  return value === 'past' || value === 'future' ? value : 'current';
};

const TimeJourney = () => {
  const navigate = useNavigate();
  const { scenario: rawScenario } = useParams();
  const { language } = useLanguage();

  const scenario = normalizeScenario(rawScenario);
  const meta = getScenarioMeta(scenario, language);
  const currentResult = useMemo(() => getLatestCurrentResult(), []);
  const localizedCurrentResult = currentResult ? localizeHexagramResult(currentResult, language) : null;

  useEffect(() => {
    if (scenario === 'current') {
      navigate('/', { replace: true });
    }
  }, [scenario, navigate]);

  if (scenario === 'current') {
    return null;
  }

  const canStart = Boolean(currentResult);
  const currentLabel = language === 'zh' ? '当前人格卦象' : 'Current Hexagram';
  const missingTitle = language === 'zh' ? '请先完成一次当前人格测试' : 'Complete a current test first';
  const missingDescription =
    language === 'zh'
      ? '人生回溯和未来指引都需要先有一个当前阶段的人格卦象，系统才能生成时空对比。'
      : 'Life Review and Future Guide both require a current result so we can generate a comparison.';
  const startLabel = language === 'zh' ? '开始这个版本的测试' : 'Start This Guided Test';
  const currentButtonLabel = language === 'zh' ? '先做当前人格测试' : 'Take Current Test First';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === 'zh' ? '返回首页' : 'Back Home'}
        </button>

        <section className={`rounded-3xl bg-gradient-to-br ${meta.accentClass} text-white p-8 sm:p-10 shadow-xl mb-8`}>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 text-sm font-medium">
              {scenario === 'past' ? <History className="w-4 h-4 mr-2" /> : <Compass className="w-4 h-4 mr-2" />}
              {meta.label}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              {language === 'zh' ? '五年视角' : 'Five-Year Perspective'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{meta.title}</h1>
          <p className="text-lg text-white/90 leading-relaxed max-w-3xl mb-4">{meta.description}</p>
          <p className="text-white/80 leading-relaxed max-w-3xl">{meta.instruction}</p>
        </section>

        {!canStart ? (
          <section className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">{missingTitle}</h2>
              <p className="text-slate-600 leading-relaxed mb-6">{missingDescription}</p>
              <button
                onClick={() => navigate('/test')}
                className="inline-flex items-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                <Brain className="w-5 h-5 mr-2" />
                {currentButtonLabel}
              </button>
            </div>
          </section>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {language === 'zh' ? '作答提示' : 'How to Answer'}
              </h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  {scenario === 'past'
                    ? language === 'zh'
                      ? '请把自己放回五年前，不是回忆事实对错，而是尽量回到当时的感受、判断方式和行动习惯。'
                      : 'Place yourself back five years ago and answer from that version of your mindset, not from hindsight.'
                    : language === 'zh'
                      ? '请把自己放到五年后理想中的状态，回答你希望自己稳定具备的想法、气质和行为方式。'
                      : 'Place yourself in the ideal version of you five years ahead and answer from that desired mindset.'}
                </p>
                <p>
                  {language === 'zh'
                    ? '题目可以与当前人格测试相同，但你的作答视角不同，因此系统会生成一个新的时空人格卦象。'
                    : 'The questions can stay the same, but your answering perspective changes, so the system will generate a different temporal result.'}
                </p>
              </div>
            </section>

            <section className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{currentLabel}</h2>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 mb-6">
                <div className="text-sm text-slate-500 mb-2">
                  {new Date(currentResult.timestamp).toLocaleString()}
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-2">{localizedCurrentResult?.hexagramName}</div>
                <p className="text-slate-600 leading-relaxed mb-4">{localizedCurrentResult?.basicAnalysis.corePersonality}</p>
                <div className="flex flex-wrap gap-2">
                  {localizedCurrentResult?.basicAnalysis.advantageTraits.slice(0, 3).map((trait) => (
                    <span
                      key={trait}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-slate-200 text-sm text-slate-700"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate(`/test?scenario=${scenario}&base=${currentResult.id}`)}
                className={`inline-flex items-center justify-center w-full px-6 py-4 rounded-2xl bg-gradient-to-r ${meta.buttonClass} text-white font-semibold shadow-lg transition-all hover:-translate-y-0.5`}
              >
                {startLabel}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeJourney;

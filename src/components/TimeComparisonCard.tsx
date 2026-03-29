import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { ScenarioComparisonInsight, ScenarioMeta } from '../utils/timePerspective';

interface TimeComparisonCardProps {
  meta: ScenarioMeta;
  comparison: ScenarioComparisonInsight;
  language: 'zh' | 'en';
}

const TimeComparisonCard = ({ meta, comparison, language }: TimeComparisonCardProps) => {
  const isZh = language === 'zh';
  const heading = comparison.title === meta.label ? meta.title : comparison.title;

  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-slate-100">
      <div className="flex flex-col gap-6">
        <div className={`rounded-2xl bg-gradient-to-r ${meta.accentClass} p-6 text-white`}>
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-wide uppercase">{meta.label}</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">{heading}</h2>
          <p className="text-white/90 leading-relaxed">{comparison.summary}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 font-semibold mb-3">
              <ArrowRight className="w-4 h-4" />
              <span>{comparison.betweenLabel}</span>
            </div>
            <ul className="space-y-3 text-slate-700">
              {comparison.highlights.map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-slate-900" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-6 border border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-900 font-semibold mb-3">
              <Compass className="w-4 h-4" />
              <span>{meta.key === 'future' ? (isZh ? '当前努力重点' : 'Action Focus') : (isZh ? '一路保留下来的部分' : 'What Stayed With You')}</span>
            </div>
            <ul className="space-y-3 text-emerald-900">
              {(meta.key === 'future' ? comparison.actionFocus : comparison.retainedStrengths).map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-emerald-700" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl bg-amber-50 p-6 border border-amber-200">
          <h3 className="text-lg font-semibold text-amber-900 mb-3">
            {meta.key === 'future' ? (isZh ? '现在就可以培养的习惯' : 'Habits to Build Now') : (isZh ? '值得记住的变化' : 'Changes Worth Remembering')}
          </h3>
          <ul className="space-y-3 text-amber-900">
            {comparison.habitSuggestions.map((item, index) => (
              <li key={`${item}-${index}`} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-amber-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TimeComparisonCard;

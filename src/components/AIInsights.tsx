import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  RefreshCw,
  Info,
  Activity,
  Pill,
  UtensilsCrossed,
  Flame,
  Bot,
} from 'lucide-react';
import { DisclaimerBanner } from './DisclaimerBanner';

export const AIInsights: React.FC = () => {
  const {
    t,
    insights,
    isGeneratingInsights,
    refreshInsights,
    setIsAssistantModalOpen,
    language,
  } = useApp();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'glucose_stability':
        return <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case 'nutrition_impact':
        return <UtensilsCrossed className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'medication_adherence':
        return <Pill className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'physical_activity':
        return <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'glucose_stability':
        return t.aiInsights.categories.glucose_stability;
      case 'nutrition_impact':
        return t.aiInsights.categories.nutrition_impact;
      case 'medication_adherence':
        return t.aiInsights.categories.medication_adherence;
      case 'physical_activity':
        return t.aiInsights.categories.physical_activity;
      default:
        return category;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Refresh Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
            <Sparkles className="w-5 h-5" />
            <h2 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
              {t.aiInsights.title}
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            {t.aiInsights.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAssistantModalOpen(true)}
            className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{language === 'ar' ? 'محادثة المساعد' : 'AI Chat'}</span>
          </button>

          <button
            onClick={refreshInsights}
            disabled={isGeneratingInsights}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isGeneratingInsights ? 'animate-spin' : ''}`} />
            <span>{isGeneratingInsights ? (language === 'ar' ? 'جاري التحليل...' : 'Analyzing...') : t.aiInsights.refreshButton}</span>
          </button>
        </div>
      </div>

      {/* Prominent Medical Disclaimer Banner */}
      <DisclaimerBanner full={true} />

      {/* AI Insight Cards Grid */}
      {insights.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
            {language === 'ar' ? 'لا توجد تحليلات مولدة حالياً' : 'No AI insights generated yet'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">
            {language === 'ar'
              ? 'سجل قراءات سكر الدم والوجبات والنشاط ثم اضغط على زر توليد التحليلات ليقوم الذكاء الاصطناعي بربط البيانات.'
              : 'Log your glucose readings, meals, and physical activity, then click analyze to generate descriptive summaries.'}
          </p>
          <button
            onClick={refreshInsights}
            disabled={isGeneratingInsights}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isGeneratingInsights ? 'animate-spin' : ''}`} />
            <span>{isGeneratingInsights ? (language === 'ar' ? 'جاري التحليل...' : 'Analyzing...') : (language === 'ar' ? 'توليد التحليلات الذكية' : 'Generate Smart Insights')}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((ins) => (
          <div
            key={ins.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs text-start flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center shrink-0">
                    {getCategoryIcon(ins.category)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                      {getCategoryTitle(ins.category)}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {ins.title}
                    </h3>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                    ins.type === 'positive'
                      ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
                      : ins.type === 'warning'
                      ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800'
                      : 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800'
                  }`}
                >
                  {ins.type === 'positive'
                    ? language === 'ar' ? 'ملاحظة إيجابية' : 'Positive Trend'
                    : ins.type === 'warning'
                    ? language === 'ar' ? 'تنبيه صحي' : 'Advisory Note'
                    : language === 'ar' ? 'معلومة تثقيفية' : 'Health Insight'}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {ins.description}
              </p>
            </div>

            <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-500" />
                SugarCare AI Engine
              </span>
              <span>{ins.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Educational Notice Banner */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
        <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-start">
          <p className="font-bold text-slate-800 dark:text-slate-200">
            {language === 'ar' ? 'كيف يعمل محرك التحليلات الذكي؟' : 'How does the SugarCare AI Engine analyze data?'}
          </p>
          <p className="leading-relaxed">
            {language === 'ar'
              ? 'يقوم محرك الذكاء الاصطناعي بربط قراءات سكر الدم مع مواعيد الجرعات، كميات الكربوهيدرات، ومعدل الحركة اليومي لكشف الأنماط المتكررة ومساعدتك على فهم جسمك بشكل أدق.'
              : 'SugarCare correlates glucose readings against medication timings, meal carbohydrates, and step counts to identify recurrent patterns and support informed conversations with your physician.'}
          </p>
        </div>
      </div>
    </div>
  );
};

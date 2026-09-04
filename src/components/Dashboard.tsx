import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  Sparkles,
  Pill,
  TrendingDown,
  TrendingUp,
  Clock,
  Flame,
  Scale,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Zap,
  Calendar,
  ChevronRight,
  Info,
} from 'lucide-react';
import { DisclaimerBanner } from './DisclaimerBanner';

export const Dashboard: React.FC = () => {
  const {
    t,
    profile,
    stats,
    readings,
    medications,
    insights,
    setActiveTab,
    setIsAssistantModalOpen,
    setIsAddReadingModalOpen,
    toggleMedicationTaken,
    language,
    isRtl,
  } = useApp();

  const [trendView, setTrendView] = useState<'daily' | 'weekly'>('weekly');

  const targetMin = profile.targetMin || 70;
  const targetMax = profile.targetMax || 140;

  // Helper to determine glucose reading status
  const getGlucoseStatus = (value: number) => {
    if (value < targetMin) {
      return {
        label: t.app.low,
        color: 'text-amber-600 dark:text-amber-400',
        badgeClass: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400',
        dot: 'bg-amber-500',
      };
    }
    if (value <= targetMax) {
      return {
        label: language === 'ar' ? 'المعدل المستهدف' : 'Target range',
        color: 'text-emerald-600 dark:text-emerald-400',
        badgeClass: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400',
        dot: 'bg-emerald-500',
      };
    }
    if (value <= 180) {
      return {
        label: t.app.elevated,
        color: 'text-orange-600 dark:text-orange-400',
        badgeClass: 'text-orange-700 bg-orange-50 dark:bg-orange-950/60 dark:text-orange-400',
        dot: 'bg-orange-500',
      };
    }
    return {
      label: t.app.high,
      color: 'text-rose-600 dark:text-rose-400',
      badgeClass: 'text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400',
      dot: 'bg-rose-500',
    };
  };

  // Generate dynamic 7 days data from real user readings
  const getPast7DaysData = () => {
    const days: { label: string; dateStr: string; avg: number | null; count: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const dayName = d.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
        weekday: 'short',
      });

      const dayReadings = readings.filter((r) => r.date === dateStr);
      const avg =
        dayReadings.length > 0
          ? Math.round(dayReadings.reduce((acc, curr) => acc + curr.value, 0) / dayReadings.length)
          : null;

      days.push({
        label: dayName,
        dateStr,
        avg,
        count: dayReadings.length,
      });
    }

    return days;
  };

  const past7Days = getPast7DaysData();
  const maxDayAvg = Math.max(...past7Days.map((d) => d.avg || 0), 200);

  const getMeasurementTypeLabel = (type?: string) => {
    switch (type) {
      case 'fasting':
        return t.bloodSugar.types.fasting;
      case 'before_meal':
        return t.bloodSugar.types.before_meal;
      case 'after_meal':
        return t.bloodSugar.types.after_meal;
      case 'before_bed':
        return t.bloodSugar.types.before_bed;
      case 'random':
        return t.bloodSugar.types.random;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 pb-12 text-start">
      {/* Top Banner / User Welcome & Primary Action */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.dashboard.welcomeUser.replace('{name}', profile.name || (language === 'ar' ? 'مرحباً' : 'User'))}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {t.profile.diabetesTypes[profile.diabetesType] || profile.diabetesType}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.dashboard.dailySubtitle}
          </p>
        </div>

        {/* Prominent Primary Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddReadingModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t.bloodSugar.addReading}</span>
          </button>
        </div>
      </div>

      {/* 4-Card Primary KPI Grid with Real User Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* 1. Last Reading Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                {language === 'ar' ? 'آخر قراءة سكر' : 'Latest Blood Sugar'}
              </span>
              <Activity className="w-4 h-4 text-blue-600" />
            </div>

            {stats.latestReading ? (
              <div className="mt-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {stats.latestReading.value}
                  </h3>
                  <span className="text-slate-400 text-xs font-bold uppercase">{t.app.mgDl}</span>
                </div>
                <div className="flex items-center justify-between mt-3 text-xs">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-bold text-[11px] ${getGlucoseStatus(stats.latestReading.value).badgeClass}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${getGlucoseStatus(stats.latestReading.value).dot}`} />
                    <span>{getGlucoseStatus(stats.latestReading.value).label}</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {getMeasurementTypeLabel(stats.latestReading.type)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-slate-300 dark:text-slate-700 tracking-tight">
                    —
                  </h3>
                  <span className="text-slate-400 text-xs font-bold uppercase">{t.app.mgDl}</span>
                </div>
                <button
                  onClick={() => setIsAddReadingModalOpen(true)}
                  className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'إضافة قراءة الآن' : 'Log reading now'}</span>
                </button>
              </div>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            {stats.latestReading
              ? `${stats.latestReading.date} • ${stats.latestReading.time}`
              : (language === 'ar' ? 'لم تُسجل أي قراءة بعد' : 'No readings recorded yet')}
          </p>
        </div>

        {/* 2. Avg. 7 Days */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                {language === 'ar' ? 'متوسط 7 أيام' : '7-Day Average'}
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {stats.averageGlucose7d > 0 ? stats.averageGlucose7d : '—'}
                </h3>
                <span className="text-slate-400 text-xs font-bold uppercase">{t.app.mgDl}</span>
              </div>
              <div className="flex items-center justify-between mt-3 text-xs">
                <span className="text-slate-500 text-[11px] font-medium">
                  {stats.averageGlucose7d > 0
                    ? (stats.averageGlucose7d <= targetMax
                      ? (language === 'ar' ? 'ضمن النطاق المستهدف' : 'Within target')
                      : (language === 'ar' ? 'أعلى من المستهدف' : 'Above target'))
                    : (language === 'ar' ? 'الهدف: < 140' : 'Target: < 140')}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {readings.length} {language === 'ar' ? 'قراءات' : 'logs'}
                </span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            {language === 'ar'
              ? `النطاق المستهدف: ${targetMin} - ${targetMax} ملغ/ديسيلتر`
              : `Target range: ${targetMin} - ${targetMax} mg/dL`}
          </p>
        </div>

        {/* 3. Next Dose */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                {language === 'ar' ? 'الجرعة القادمة' : 'Next Dose'}
              </span>
              <Pill className="w-4 h-4 text-purple-600" />
            </div>

            {stats.nextMedication ? (
              <div className="mt-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                  {stats.nextMedication.name}
                </h3>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-xs">
                    {stats.nextMedication.time} ({stats.nextMedication.dose})
                  </span>
                  <button
                    onClick={() => toggleMedicationTaken(stats.nextMedication!.id)}
                    className="text-[11px] text-slate-600 dark:text-slate-300 hover:text-blue-600 font-semibold underline cursor-pointer"
                  >
                    {stats.nextMedication.takenToday ? t.medications.takenStatus : t.medications.markTaken}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <h3 className="text-sm font-semibold text-slate-400">
                  {medications.length === 0
                    ? (language === 'ar' ? 'لا توجد أدوية مضافة' : 'No medications added')
                    : (language === 'ar' ? 'تم تناول جميع أدوية اليوم' : 'All doses completed')}
                </h3>
                <button
                  onClick={() => setActiveTab('medications')}
                  className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'إدارة الأدوية' : 'Manage meds'}</span>
                </button>
              </div>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            {medications.length > 0
              ? `${medications.filter((m) => m.takenToday).length} / ${medications.length} ${language === 'ar' ? 'جرعات اليوم' : 'taken today'}`
              : (language === 'ar' ? 'أضف جدول أدويتك اليومي' : 'Add your medication schedule')}
          </p>
        </div>

        {/* 4. Weight */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                {language === 'ar' ? 'الوزن الحالي' : 'Current Weight'}
              </span>
              <Scale className="w-4 h-4 text-teal-600" />
            </div>

            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {stats.currentWeight > 0 ? stats.currentWeight : '—'}
                </h3>
                <span className="text-slate-400 text-xs font-bold uppercase">{t.dashboard.kgUnit}</span>
              </div>
              <div className="flex items-center justify-between mt-3 text-xs">
                {stats.weightChange !== 0 ? (
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${stats.weightChange < 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {stats.weightChange < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                    <span>{stats.weightChange > 0 ? `+${stats.weightChange}` : stats.weightChange} kg</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium">
                    {language === 'ar' ? 'مستقر' : 'Stable'}
                  </span>
                )}
                <button
                  onClick={() => setActiveTab('weight')}
                  className="text-[11px] text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer"
                >
                  {language === 'ar' ? 'تحديث' : 'Update'}
                </button>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            {profile.height > 0
              ? `${language === 'ar' ? 'الطول:' : 'Height:'} ${profile.height} cm`
              : (language === 'ar' ? 'سجل وزنك لمتابعة الأيض' : 'Track weight progress')}
          </p>
        </div>
      </div>

      {/* Main Section: Weekly Glucose Trend + AI Health Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Weekly Glucose Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  {language === 'ar' ? 'مؤشر السكر الأسبوعي' : 'Weekly Glucose Trend'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'ar'
                    ? 'متوسط قراءات سكر الدم اليومية المسجلة خلال آخر 7 أيام'
                    : 'Daily blood sugar averages recorded over the last 7 days'}
                </p>
              </div>

              <button
                onClick={() => setIsAddReadingModalOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.app.add}</span>
              </button>
            </div>

            {/* If Readings exist, render the real bar chart; otherwise show clean empty state */}
            {readings.length > 0 ? (
              <div>
                <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-6">
                  {past7Days.map((day, idx) => {
                    const hasValue = day.avg !== null;
                    const heightPercent = hasValue
                      ? Math.min(100, Math.max(15, Math.round((day.avg! / maxDayAvg) * 100)))
                      : 4;
                    const inTarget = hasValue && day.avg! >= targetMin && day.avg! <= targetMax;

                    return (
                      <div
                        key={idx}
                        className="w-full flex flex-col items-center justify-end h-full group relative"
                      >
                        {/* Tooltip on Hover */}
                        {hasValue && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2.5 rounded-lg whitespace-nowrap z-10 pointer-events-none shadow-md font-bold">
                            {day.avg} mg/dL ({day.count} {language === 'ar' ? 'قراءات' : 'logs'})
                          </div>
                        )}

                        {/* Bar */}
                        <div
                          className={`w-full max-w-[38px] rounded-t-lg transition-all duration-300 ${
                            hasValue
                              ? inTarget
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : day.avg! > 180
                                ? 'bg-rose-500 hover:bg-rose-600'
                                : 'bg-orange-500 hover:bg-orange-600'
                              : 'bg-slate-100 dark:bg-slate-800 border-dashed border-t border-slate-300'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* X-Axis Days */}
                <div className="flex justify-between mt-4 px-2 text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  {past7Days.map((day, i) => (
                    <span key={i} className="text-center w-full truncate">
                      {day.label}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              /* Empty State for Chart */
              <div className="py-10 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                  <Activity className="w-6 h-6" />
                </div>
                <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {language === 'ar'
                    ? 'لا توجد بيانات كافية لعرض الرسم البياني'
                    : 'No glucose readings recorded yet'}
                </h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">
                  {language === 'ar'
                    ? 'سجل قراءات سكر الدم اليومية (صائم، قبل/بعد الوجبات) لمتابعة التغيرات ونسبة الاستقرار.'
                    : 'Log your daily fasting and post-meal glucose readings to visualize glycemic fluctuations.'}
                </p>
                <button
                  onClick={() => setIsAddReadingModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.bloodSugar.addReading}</span>
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>{language === 'ar' ? `ضمن الهدف (${targetMin}-${targetMax})` : `In Target (${targetMin}-${targetMax})`}</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span>{language === 'ar' ? 'مرتفع قليلاً (>140)' : 'Elevated (>140)'}</span>
              </span>
            </div>

            <button
              onClick={() => setActiveTab('blood_sugar')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'ar' ? 'سجل القراءات الكامل' : 'View Full Log'}</span>
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* Right Col: AI Health Insights Card */}
        <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {language === 'ar' ? 'تحليلات الذكاء الاصطناعي' : 'AI Health Insights'}
                  </h4>
                  <span className="text-[10px] text-blue-300/80 font-medium">SugarCare Smart Engine</span>
                </div>
              </div>
            </div>

            {/* Dynamic AI insights derived from real user logs */}
            <div className="space-y-3 flex-1">
              {readings.length > 0 ? (
                <>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                    <p className="text-xs leading-relaxed text-slate-200">
                      {language === 'ar'
                        ? `سجلت ${readings.length} قراءة سكر. متوسطك العام هو ${stats.averageGlucose7d || stats.latestReading?.value} ملغ/ديسيلتر مع نسبة ${stats.inRangePercentage}% داخل النطاق المستهدف.`
                        : `You have logged ${readings.length} readings. Your average is ${stats.averageGlucose7d || stats.latestReading?.value} mg/dL with ${stats.inRangePercentage}% in target.`}
                    </p>
                  </div>

                  {insights.slice(0, 2).map((ins) => (
                    <div key={ins.id} className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                      <p className="text-xs font-bold text-blue-300 mb-1">{ins.title}</p>
                      <p className="text-xs leading-relaxed text-slate-200">{ins.description}</p>
                    </div>
                  ))}
                </>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <Info className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {language === 'ar'
                      ? 'سجل قراءات سكر الدم والوجبات اليومية ليقوم الذكاء الاصطناعي بتحليل الاتجاهات ومساعدتك على فهم استجابة جسمك.'
                      : 'Log your daily glucose and meals so the AI engine can identify personal patterns and provide descriptive summaries.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-white/10">
            <button
              onClick={() => setIsAssistantModalOpen(true)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer mb-2 shadow-xs"
            >
              <Bot className="w-4 h-4" />
              <span>{language === 'ar' ? 'سؤال المساعد الذكي' : 'Ask AI Assistant'}</span>
            </button>
            <p className="text-[10px] text-slate-400 italic text-center">
              {language === 'ar'
                ? 'تنبيه: تحليلات SugarCare للتثقيف والمتابعة ولا تُغني عن الاستشارة الطبية.'
                : 'Disclaimer: SugarCare AI provides tracking and education, not medical diagnosis.'}
            </p>
          </div>
        </div>
      </div>

      {/* Medical Safety Disclaimer Alert */}
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-red-800 dark:text-red-300 uppercase tracking-wider">
            {language === 'ar' ? 'تنبيه طبي هام' : 'Important Medical Safety Notice'}
          </p>
          <p className="text-[11px] text-red-700 dark:text-red-300/90 leading-relaxed">
            {language === 'ar'
              ? 'SugarCare AI هو أداة للمتابعة والتثقيف الصحي الشخصي فقط، ولا يقدم تشخيصاً طبياً أو توصيات بتعديل جرعات الأدوية أو الإنسولين. القرارات العلاجية يجب أن تتم دائماً بالتعاون مع طبيبك المعالج.'
              : 'SugarCare AI is an educational tracking companion only and does not provide medical diagnosis, insulin dosage adjustment, or prescription alterations. Always consult your healthcare provider.'}
          </p>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          {t.dashboard.quickActions}
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setIsAddReadingModalOpen(true)}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition text-start flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{t.dashboard.logGlucose}</p>
              <span className="text-[10px] text-slate-400">{language === 'ar' ? 'تسجيل فوري' : 'Quick entry'}</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('medications')}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition text-start flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{t.dashboard.logMedication}</p>
              <span className="text-[10px] text-slate-400">{language === 'ar' ? 'الجدول والجرعات' : 'Doses & times'}</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('meals')}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition text-start flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{t.dashboard.logMeal}</p>
              <span className="text-[10px] text-slate-400">{language === 'ar' ? 'الكربوهيدرات والوجبات' : 'Carbs & meals'}</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition text-start flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{t.dashboard.logActivity}</p>
              <span className="text-[10px] text-slate-400">{language === 'ar' ? 'المشي والتمارين' : 'Walking & exercise'}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

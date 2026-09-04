import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Printer,
  Download,
  Activity,
  Pill,
  UtensilsCrossed,
  Flame,
  Sparkles,
} from 'lucide-react';
import { DisclaimerBanner } from './DisclaimerBanner';

export const Reports: React.FC = () => {
  const {
    t,
    profile,
    stats,
    readings,
    medications,
    meals,
    activities,
    language,
  } = useApp();

  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [doctorNotes, setDoctorNotes] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReport = () => {
    window.print();
  };

  const targetMin = profile.targetMin || 70;
  const targetMax = profile.targetMax || 140;

  const inRangeCount = readings.filter((r) => r.value >= targetMin && r.value <= targetMax).length;
  const highCount = readings.filter((r) => r.value > targetMax).length;
  const lowCount = readings.filter((r) => r.value < targetMin).length;
  const totalCount = readings.length || 1;

  const tirPercentage = readings.length > 0 ? Math.round((inRangeCount / totalCount) * 100) : 0;
  const highPercentage = readings.length > 0 ? Math.round((highCount / totalCount) * 100) : 0;
  const lowPercentage = readings.length > 0 ? Math.round((lowCount / totalCount) * 100) : 0;

  const dynamicAiSummary = readings.length === 0
    ? (language === 'ar'
        ? 'لا توجد قراءات كافية بعد لتوليد ملخص سريري. قم بتسجيل قراءات السكر والوجبات والنشاط لتوليد التحليل التلقائي.'
        : 'No readings recorded yet. Log your glucose readings, meals, and activities to generate a personalized clinical summary.')
    : (language === 'ar'
        ? `خلال الفترة المسجلة، بلغ متوسط قياس سكر الدم ${stats.averageGlucose7d} ملغ/ديسيلتر مع نسبة وقت في النطاق المستهدف (${targetMin}-${targetMax} ملغ/ديسيلتر) بلغت ${tirPercentage}%. سُجلت أعلى قراءة عند ${stats.highestGlucose} ملغ/ديسيلتر وأدنى قراءة عند ${stats.lowestGlucose} ملغ/ديسيلتر عبر إجمالي ${readings.length} فحص، بالتزامن مع ${meals.length} وجبة مسجلة و${activities.reduce((a, c) => a + c.duration, 0)} دقيقة نشاط رياضي.`
        : `During the logged period, the user recorded a mean glucose of ${stats.averageGlucose7d} mg/dL with ${tirPercentage}% Time-in-Range (${targetMin}-${targetMax} mg/dL). Peak reading was ${stats.highestGlucose} mg/dL and nadir was ${stats.lowestGlucose} mg/dL across ${readings.length} total readings, accompanied by ${meals.length} logged meals and ${activities.reduce((a, c) => a + c.duration, 0)} active minutes.`);

  const getPeriodLabel = () => {
    switch (period) {
      case 'daily':
        return t.reports.dailyReport;
      case 'weekly':
        return t.reports.weeklyReport;
      case 'monthly':
        return t.reports.monthlyReport;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Controls (Hidden in Print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-1">
            <FileText className="w-5 h-5" />
            <h2 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
              {t.reports.title}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.reports.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Period Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setPeriod('daily')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                period === 'daily'
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.reports.dailyReport}
            </button>
            <button
              onClick={() => setPeriod('weekly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                period === 'weekly'
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.reports.weeklyReport}
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                period === 'monthly'
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.reports.monthlyReport}
            </button>
          </div>

          {/* Download & Print Buttons */}
          <button
            onClick={handleDownloadReport}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t.reports.downloadPdf}</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            title={t.app.print}
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      <DisclaimerBanner full={false} />

      {/* The Printable Clinical Health Summary Document */}
      <div
        id="printable-report"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 text-start print:border-none print:shadow-none print:p-0 print:m-0"
      >
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-teal-600 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                SugarCare <span className="text-teal-600">AI</span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {t.reports.title}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'ar' ? 'تقرير سريري شامل للمتابعة الطبية' : 'Comprehensive Clinical Diabetes Tracking Summary'}
            </p>
          </div>

          <div className="text-xs text-slate-500 space-y-0.5 sm:text-end">
            <p>
              <strong className="text-slate-800 dark:text-slate-200">{language === 'ar' ? 'تاريخ التقرير:' : 'Generated Date:'}</strong>{' '}
              {new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p>
              <strong className="text-slate-800 dark:text-slate-200">{language === 'ar' ? 'نطاق التقرير:' : 'Scope:'}</strong>{' '}
              {getPeriodLabel()}
            </p>
          </div>
        </div>

        {/* Patient Profile Information Card */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block">{t.profile.name}</span>
            <span className="font-bold text-slate-900 dark:text-white">{profile.name || (language === 'ar' ? 'المريض' : 'Patient')}</span>
          </div>
          <div>
            <span className="text-slate-400 block">{t.profile.diabetesType}</span>
            <span className="font-bold text-teal-600 dark:text-teal-400">
              {t.profile.diabetesTypes[profile.diabetesType] || profile.diabetesType}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">{t.profile.age} & {t.profile.height}</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {profile.age} {language === 'ar' ? 'سنة' : 'yrs'} • {profile.height || '-'} cm
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">{t.profile.doctorName}</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {profile.doctorName || (language === 'ar' ? 'غير مسجل' : 'Not specified')}
            </span>
          </div>
        </div>

        {/* 1. Blood Glucose Clinical Statistics */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <span>{t.reports.summaryTitle}</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block">{t.dashboard.avg7Days}</span>
              <span className="text-lg font-black text-teal-700 dark:text-teal-400">{stats.averageGlucose7d} mg/dL</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block">{t.dashboard.highestReading}</span>
              <span className="text-lg font-black text-rose-600 dark:text-rose-400">{stats.highestGlucose} mg/dL</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block">{t.dashboard.lowestReading}</span>
              <span className="text-lg font-black text-teal-600 dark:text-teal-400">{stats.lowestGlucose} mg/dL</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block">{t.reports.readingsCount}</span>
              <span className="text-lg font-black text-slate-800 dark:text-slate-200">{readings.length}</span>
            </div>
          </div>

          {/* Time In Range Distribution Bar */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>{t.reports.tir} ({targetMin}-{targetMax} mg/dL)</span>
              <span className="text-emerald-600 dark:text-emerald-400">{tirPercentage}% {t.app.inRange}</span>
            </div>

            {/* Stacked bar */}
            <div className="w-full h-3.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${lowPercentage}%` }}
                className="bg-amber-400 h-full"
                title={`Low (<${targetMin}): ${lowPercentage}%`}
              />
              <div
                style={{ width: `${tirPercentage}%` }}
                className="bg-emerald-500 h-full"
                title={`In Range (${targetMin}-${targetMax}): ${tirPercentage}%`}
              />
              <div
                style={{ width: `${highPercentage}%` }}
                className="bg-rose-500 h-full"
                title={`High (>${targetMax}): ${highPercentage}%`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {t.app.low}: {lowPercentage}%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {t.app.inRange}: {tirPercentage}%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                {t.app.high}: {highPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* 2. Medications & Lifestyle Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Medications Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-2">
              <Pill className="w-4 h-4 text-blue-600" />
              <span>{t.reports.medAdherence}</span>
            </h4>
            <div className="space-y-1.5">
              {medications.length === 0 ? (
                <p className="text-slate-400 text-xs">{language === 'ar' ? 'لا توجد أدوية مسجلة' : 'No medications recorded'}</p>
              ) : (
                medications.map((m) => (
                  <div key={m.id} className="flex items-center justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{m.name} ({m.dose})</span>
                    <span className="text-[10px] text-blue-600 font-bold">{t.medications.frequencies[m.frequency] || m.frequency}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Nutrition Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-2">
              <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
              <span>{t.meals.title}</span>
            </h4>
            <div className="space-y-1">
              <p className="text-slate-600 dark:text-slate-400">
                {language === 'ar' ? 'متوسط الكربوهيدرات اليومي:' : 'Daily Carbs Average:'}{' '}
                <strong className="text-emerald-700 dark:text-emerald-300">
                  {meals.length > 0 ? Math.round(meals.reduce((a, c) => a + c.carbs, 0) / meals.length) : 0} g
                </strong>
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                {language === 'ar' ? 'إجمالي الوجبات المسجلة:' : 'Logged Meals Count:'}{' '}
                <strong>{meals.length}</strong>
              </p>
            </div>
          </div>

          {/* Activity & Weight Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-2">
              <Flame className="w-4 h-4 text-orange-600" />
              <span>{t.reports.totalActivity}</span>
            </h4>
            <div className="space-y-1">
              <p className="text-slate-600 dark:text-slate-400">
                {language === 'ar' ? 'إجمالي دقائق النشاط:' : 'Total Active Minutes:'}{' '}
                <strong className="text-orange-600">
                  {activities.reduce((a, c) => a + c.duration, 0)} mins
                </strong>
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                {t.weight.currentWeight}:{' '}
                <strong>{stats.currentWeight || '-'} kg</strong>
              </p>
            </div>
          </div>
        </div>

        {/* 3. AI Generated Narrative Summary */}
        <div className="p-4 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200 font-bold">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>{t.reports.aiSummaryText}</span>
          </div>
          <p className="text-teal-800 dark:text-teal-300 leading-relaxed">
            {dynamicAiSummary}
          </p>
        </div>

        {/* 4. Doctor Notes Section */}
        <div className="space-y-2">
          <h4 className="font-bold text-xs text-slate-900 dark:text-white">
            {t.reports.doctorNotesSection}
          </h4>
          <textarea
            rows={3}
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
            placeholder={t.reports.doctorNotesPlaceholder}
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white leading-relaxed focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
          />
        </div>

        {/* Document Footer with Signature Lines */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-200">SugarCare AI Clinical Platform</p>
            <p className="text-[10px] text-slate-400">{t.app.disclaimerFull}</p>
          </div>

          <div className="border-t border-slate-400 pt-1 w-48 text-center text-xs font-semibold">
            {language === 'ar' ? 'توقيع وختم الطبيب المعالج' : 'Physician Signature & Stamp'}
          </div>
        </div>
      </div>
    </div>
  );
};

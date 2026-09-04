import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  HeartPulse,
  Sparkles,
  Pill,
  Calendar,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Languages,
  Moon,
  Sun,
  Flame,
  TrendingUp,
} from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const { t, language, setLanguage, theme, toggleTheme, setActiveTab, isRtl } = useApp();

  const handleGetStarted = () => {
    setActiveTab('dashboard');
  };

  const handleSetupProfile = () => {
    setActiveTab('profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-teal-50/20 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-teal-600/20 ring-2 ring-teal-500/20">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              SugarCare <span className="text-teal-600 dark:text-teal-400 font-extrabold">AI</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Companion
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
            title="Toggle Language / تغيير اللغة"
          >
            <Languages className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
            title={theme === 'light' ? t.app.darkMode : t.app.lightMode}
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-slate-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Quick Start Button */}
          <button
            onClick={handleGetStarted}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition cursor-pointer"
          >
            <span>{t.app.getStarted}</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-medium mb-6 shadow-xs animate-fade-in">
          <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-pulse" />
          <span>{language === 'ar' ? 'منصة إدارة وتتبع السكري الذكية' : 'Smart Diabetes Tracking & Health Analytics'}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-4xl leading-tight sm:leading-tight mb-4">
          {t.app.tagline}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-8">
          {t.app.subtitle}
        </p>

        {/* Primary Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-12">
          <button
            onClick={handleGetStarted}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-base font-bold rounded-xl shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>{t.app.getStarted}</span>
            <ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={handleSetupProfile}
            className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{language === 'ar' ? 'إعداد الملف الشخصي' : 'Setup Personal Profile'}</span>
          </button>
        </div>

        {/* Visual Live HealthTech Showcase Card */}
        <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl mb-12 text-start">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                  {language === 'ar' ? 'لوحة التحكم والتحليلات الصحية الشخصية' : 'Personal Glycemic & Health Dashboard'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'ar' ? 'متابعة مستمرة مع الذكاء الاصطناعي والتنبيهات المباشرة' : 'Continuous monitoring with AI-driven insights'}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {language === 'ar' ? 'نظام تتبع مباشر' : 'Active Tracking System'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.dashboard.latestGlucose}</p>
              <p className="text-xl font-extrabold text-teal-700 dark:text-teal-400 mt-1">70-140 <span className="text-xs font-normal text-slate-500">mg/dL</span></p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">{language === 'ar' ? 'نطاق الهدف المستهدف' : 'Target Corridor'}</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.dashboard.avg7Days}</p>
              <p className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mt-1">TIR % <span className="text-xs font-normal text-slate-500">Real-time</span></p>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">{t.dashboard.timeInRange}</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.dashboard.nextMedication}</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 truncate">{language === 'ar' ? 'التذكير بالجرعات' : 'Dose Reminders'}</p>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">{language === 'ar' ? 'تنبيهات مخصصة' : 'Custom alerts'}</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.dashboard.todayActivity}</p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">Active <span className="text-xs font-normal text-slate-500">Mins</span></p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">{language === 'ar' ? 'تتبع الخطوات والنشاط' : 'Steps & walking log'}</span>
            </div>
          </div>

          {/* AI Insight Box on Preview */}
          <div className="bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 rounded-xl p-3.5 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-teal-900 dark:text-teal-200">
                {language === 'ar' ? 'تحليلات الذكاء الاصطناعي الذكية:' : 'SugarCare AI Smart Analytics:'}
              </p>
              <p className="text-xs text-teal-800 dark:text-teal-300 mt-0.5 leading-relaxed">
                {language === 'ar'
                  ? 'يقوم محرك الذكاء الاصطناعي بتحليل قراءاتك، وجباتك، والتزامك بالأدوية لتقديم ملخصات وصفية وتنبيهات فورية تساعدك على فهم أنماط سكر دمك.'
                  : 'The AI engine analyzes your personal glucose logs, meals, and medication adherence to provide descriptive insights and help you identify glycemic patterns.'}
              </p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl w-full text-start mb-10">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">
              {language === 'ar' ? 'تتبع شامل للقراءات' : 'Smart Blood Sugar Log'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'ar'
                ? 'تسجيل دقيق لقراءات الصيام، قبل وبعد الوجبات مع رسوم بيانية توضح التغيرات والنطاق المستهدف.'
                : 'Log fasting, pre/post-meal readings with interactive trend charts and automatic target range classification.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3">
              <Pill className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">
              {language === 'ar' ? 'تذكير ذكي بالأدوية' : 'Medication Adherence'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'ar'
                ? 'جداول مواعيد الجرعات، التنبيهات، وحساب معدل الالتزام الدوائي وسجل الأيام المتتالية.'
                : 'Dose schedules, interactive taken/missed trackers, adherence streaks, and upcoming medication alerts.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">
              {language === 'ar' ? 'تقارير واستشارات الطبيب' : 'Clinical Reports & Visits'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'ar'
                ? 'توليد تقارير سريرية يومية وأسبوعية وشهرية بضغطة زر لمشاركتها مع طبيبك في مواعيد المتابعة.'
                : 'Export clean PDF/printable clinical summaries for your endocrinologist and track upcoming doctor visits.'}
            </p>
          </div>
        </div>

        {/* Safety Disclaimer Box */}
        <div className="w-full max-w-4xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 rounded-xl p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3 text-start">
          <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-0.5">{language === 'ar' ? 'تنبيه طبي ومسؤولية قانونية مهمة' : 'Important Medical Safety Notice'}</p>
            <p className="leading-relaxed opacity-95">{t.app.disclaimerFull}</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-4 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 SugarCare AI – Smart Diabetes Companion. Designed for Graduation & HealthTech Portfolio.</p>
      </footer>
    </div>
  );
};

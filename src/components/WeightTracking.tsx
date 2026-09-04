import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Scale,
  Plus,
  Trash2,
  Calendar,
  TrendingDown,
  Activity,
  X,
} from 'lucide-react';
import { DisclaimerBanner } from './DisclaimerBanner';

export const WeightTracking: React.FC = () => {
  const {
    t,
    weightRecords,
    addWeightRecord,
    deleteWeightRecord,
    profile,
    stats,
    language,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weight, setWeight] = useState<number>(stats.currentWeight || profile.weight || 75);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Calculate BMI
  const heightM = profile.height > 0 ? profile.height / 100 : 0;
  const currentWeightVal = stats.currentWeight || (weightRecords[0]?.weight ?? profile.weight ?? 0);
  const bmi = heightM > 0 && currentWeightVal > 0 ? Number((currentWeightVal / (heightM * heightM)).toFixed(1)) : 0;

  const getBmiCategory = (val: number) => {
    if (val <= 0) {
      return {
        label: language === 'ar' ? 'غير محدد' : 'Not calculated',
        color: 'text-slate-600 bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800',
      };
    }
    if (val < 18.5) {
      return {
        label: language === 'ar' ? 'نقص في الوزن' : 'Underweight',
        color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800',
      };
    }
    if (val < 25) {
      return {
        label: language === 'ar' ? 'وزن طبيعي وصحي' : 'Normal weight',
        color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
      };
    }
    if (val < 30) {
      return {
        label: language === 'ar' ? 'زيادة وزن' : 'Overweight',
        color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
      };
    }
    return {
      label: language === 'ar' ? 'سمنة' : 'Obesity',
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
    };
  };

  const bmiInfo = getBmiCategory(bmi);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || weight <= 0) return;

    addWeightRecord({
      weight: Number(weight),
      date,
      notes: notes.trim(),
    });

    setIsModalOpen(false);
  };

  // Sort weight records ascending for chart
  const sortedRecords = [...weightRecords].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const minW = sortedRecords.length > 0 ? Math.min(...sortedRecords.map((r) => r.weight)) - 2 : 60;
  const maxW = sortedRecords.length > 0 ? Math.max(...sortedRecords.map((r) => r.weight)) + 2 : 100;

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-1">
            <Scale className="w-5 h-5" />
            <h2 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
              {t.weight.title}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.weight.subtitle}
          </p>
        </div>

        <button
          onClick={() => {
            setWeight(stats.currentWeight || profile.weight || 75);
            setDate(new Date().toISOString().split('T')[0]);
            setNotes('');
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.weight.addWeight}</span>
        </button>
      </div>

      <DisclaimerBanner full={false} />

      {/* Metrics Row: Current, Previous, Change, BMI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Weight */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs text-start">
          <span className="text-xs text-slate-500 font-medium">{t.weight.currentWeight}</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {currentWeightVal > 0 ? currentWeightVal : '—'}
            </span>
            <span className="text-xs text-slate-500 font-semibold">{t.dashboard.kgUnit}</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {weightRecords[0]?.date || (language === 'ar' ? 'اليوم' : 'Today')}
          </span>
        </div>

        {/* Previous Weight */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs text-start">
          <span className="text-xs text-slate-500 font-medium">{t.weight.previousWeight}</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-extrabold text-slate-700 dark:text-slate-300 tracking-tight">
              {weightRecords[1]?.weight ? weightRecords[1].weight : (currentWeightVal > 0 ? currentWeightVal : '—')}
            </span>
            <span className="text-xs text-slate-500 font-semibold">{t.dashboard.kgUnit}</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {weightRecords[1]?.date || '-'}
          </span>
        </div>

        {/* Weight Change */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs text-start">
          <span className="text-xs text-slate-500 font-medium">{t.weight.weightChange}</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span
              className={`text-3xl font-extrabold tracking-tight flex items-center ${
                stats.weightChange < 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : stats.weightChange > 0
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {stats.weightChange > 0 ? `+${stats.weightChange}` : stats.weightChange}
            </span>
            <span className="text-xs text-slate-500 font-semibold">{t.dashboard.kgUnit}</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block mt-1 flex items-center gap-1">
            {stats.weightChange < 0 ? <TrendingDown className="w-3 h-3" /> : null}
            {language === 'ar' ? 'متابعة مستمرة للوزن' : 'Weight monitoring'}
          </span>
        </div>

        {/* BMI Calculator Widget */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs text-start">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">{t.weight.bmi}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${bmiInfo.color}`}>
              {bmiInfo.label}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-extrabold text-teal-700 dark:text-teal-400 tracking-tight">
              {bmi > 0 ? bmi : '—'}
            </span>
            <span className="text-xs text-slate-500 font-semibold">kg/m²</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {profile.height > 0
              ? (language === 'ar' ? `الطول: ${profile.height} سم` : `Height: ${profile.height} cm`)
              : (language === 'ar' ? 'أدخل الطول لحساب مؤشر الكتلة' : 'Enter height to compute BMI')}
          </span>
        </div>
      </div>

      {/* Weight Trend Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs text-start">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-600" />
          <span>{t.weight.weeklyMonthlyChart}</span>
        </h3>

        <div className="mt-6">
          {sortedRecords.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center">
              <Scale className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
              <p>{t.weight.noRecords}</p>
            </div>
          ) : (
            <div className="relative h-56 w-full">
              {/* Y Axis */}
              <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[10px] text-slate-400 font-medium select-none">
                <span>{maxW}</span>
                <span>{Math.round((maxW + minW) / 2)}</span>
                <span>{minW}</span>
              </div>

              {/* Grid lines */}
              <div className="absolute left-9 right-2 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-slate-100 dark:border-slate-800 w-full" />
                <div className="border-b border-slate-100 dark:border-slate-800 w-full" />
                <div className="border-b border-slate-200 dark:border-slate-700 w-full" />
              </div>

              {/* SVG line */}
              <svg className="absolute left-9 right-2 top-0 bottom-6 w-[calc(100%-44px)] h-[calc(100%-24px)] overflow-visible">
                {sortedRecords.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={sortedRecords
                      .map((r, i) => {
                        const x = (i / (sortedRecords.length - 1)) * 100;
                        const y = ((maxW - r.weight) / Math.max(1, maxW - minW)) * 100;
                        return `${x}%,${y}%`;
                      })
                      .join(' ')}
                  />
                )}

                {sortedRecords.map((r, i) => {
                  const x = (i / Math.max(1, sortedRecords.length - 1)) * 100;
                  const y = ((maxW - r.weight) / Math.max(1, maxW - minW)) * 100;
                  return (
                    <g key={r.id} className="group cursor-pointer">
                      <circle
                        cx={`${x}%`}
                        cy={`${y}%`}
                        r={5}
                        className="fill-teal-600 stroke-white dark:stroke-slate-900 stroke-2 group-hover:scale-150 transition-transform"
                      />
                      <title>
                        {r.weight} kg - {r.date}
                      </title>
                    </g>
                  );
                })}
              </svg>

              {/* X Axis */}
              <div className="absolute left-9 right-2 bottom-0 h-5 flex justify-between text-[10px] text-slate-400 font-medium">
                {sortedRecords.map((r) => (
                  <span key={r.id}>{r.date.split('-').slice(1).join('/')}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weight History Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs text-start">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          {t.weight.history} ({weightRecords.length})
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
          {weightRecords.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              {t.weight.noRecords}
            </div>
          ) : (
            weightRecords.map((rec) => (
              <div
                key={rec.id}
                className="py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/40 px-2 rounded-xl transition text-start"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-extrabold text-sm">
                    {rec.weight}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {rec.weight} kg
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {rec.date}
                      </span>
                    </div>
                    {rec.notes && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {rec.notes}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm(t.app.confirmDelete)) {
                      deleteWeightRecord(rec.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                  title={t.app.delete}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in text-start">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-teal-600" />
                <span>{t.weight.addWeight}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.weight.currentWeight} (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  required
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.app.date}
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.app.notes}
                </label>
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'ملاحظة (مثال: الصباح الباكر بعد الاستيقاظ)' : 'e.g. Early morning before breakfast'}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                >
                  {t.app.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer"
                >
                  {t.app.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

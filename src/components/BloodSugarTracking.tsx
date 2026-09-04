import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  X,
  TrendingUp,
  Info,
} from 'lucide-react';
import { GlucoseReading, MeasurementType } from '../types';
import { DisclaimerBanner } from './DisclaimerBanner';

export const BloodSugarTracking: React.FC = () => {
  const {
    t,
    readings,
    addReading,
    updateReading,
    deleteReading,
    profile,
    language,
    isRtl,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [value, setValue] = useState<number>(120);
  const [type, setType] = useState<MeasurementType>('fasting');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  );
  const [notes, setNotes] = useState<string>('');

  // Filter states
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'7d' | '14d' | '30d' | 'all'>('14d');

  const openAddModal = () => {
    setEditingId(null);
    setValue(120);
    setType('fasting');
    setDate(new Date().toISOString().split('T')[0]);
    setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (reading: GlucoseReading) => {
    setEditingId(reading.id);
    setValue(reading.value);
    setType(reading.type);
    setDate(reading.date);
    setTime(reading.time);
    setNotes(reading.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value || value <= 0) return;

    if (editingId) {
      updateReading(editingId, {
        value: Number(value),
        type,
        date,
        time,
        notes,
      });
    } else {
      addReading({
        value: Number(value),
        unit: 'mg/dL',
        type,
        date,
        time,
        notes,
      });
    }

    setIsModalOpen(false);
  };

  // Filter readings
  const filteredReadings = readings.filter((r) => {
    if (typeFilter !== 'all' && r.type !== typeFilter) return false;

    if (timeFilter !== 'all') {
      const days = timeFilter === '7d' ? 7 : timeFilter === '14d' ? 14 : 30;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      if (new Date(r.date) < cutoff) return false;
    }

    return true;
  });

  // Sort chronological for chart
  const chartReadings = [...filteredReadings].sort(
    (a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()
  );

  const getGlucoseStatus = (val: number) => {
    const min = profile.targetMin || 70;
    const max = profile.targetMax || 140;

    if (val < min) {
      return {
        label: t.app.low,
        color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
      };
    }
    if (val <= max) {
      return {
        label: t.app.inRange,
        color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
      };
    }
    if (val <= 180) {
      return {
        label: t.app.elevated,
        color: 'text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/60 border-orange-200 dark:border-orange-800',
      };
    }
    return {
      label: t.app.high,
      color: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
    };
  };

  const chartMax = 220;
  const chartMin = 60;

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-1">
            <Activity className="w-5 h-5" />
            <h2 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
              {t.bloodSugar.title}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.bloodSugar.subtitle}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.bloodSugar.addReading}</span>
        </button>
      </div>

      <DisclaimerBanner full={false} />

      {/* Interactive Trend Chart Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>{language === 'ar' ? 'مخطط تغير سكر الدم بمرور الوقت' : 'Glucose Variations Over Time'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.bloodSugar.targetLegend}
            </p>
          </div>

          {/* Time range filters */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['7d', '14d', '30d', 'all'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeFilter(period)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  timeFilter === period
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {period === '7d'
                  ? t.bloodSugar.filter7d
                  : period === '14d'
                  ? t.bloodSugar.filter14d
                  : period === '30d'
                  ? t.bloodSugar.filter30d
                  : t.bloodSugar.filterAllTime}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Chart with Target Band */}
        <div className="mt-6">
          {chartReadings.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400">
              {t.bloodSugar.noReadings}
            </div>
          ) : (
            <div className="relative h-64 w-full">
              {/* Target Zone */}
              <div
                className="absolute left-10 right-2 bg-emerald-500/10 dark:bg-emerald-500/15 border-y border-dashed border-emerald-500/30 rounded-xs pointer-events-none flex items-center justify-end px-2"
                style={{
                  top: `${((chartMax - (profile.targetMax || 140)) / (chartMax - chartMin)) * 100}%`,
                  height: `${(((profile.targetMax || 140) - (profile.targetMin || 70)) / (chartMax - chartMin)) * 100}%`,
                }}
              >
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-white/80 dark:bg-slate-900/80 px-1 rounded">
                  {t.app.targetRange} ({profile.targetMin || 70}-{profile.targetMax || 140} mg/dL)
                </span>
              </div>

              {/* Y Axis */}
              <div className="absolute left-0 top-0 bottom-6 w-9 flex flex-col justify-between text-[10px] text-slate-400 font-medium select-none">
                <span>220</span>
                <span>180</span>
                <span>140</span>
                <span>100</span>
                <span>60</span>
              </div>

              {/* Grid Lines */}
              <div className="absolute left-10 right-2 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-slate-100 dark:border-slate-800 w-full" />
                <div className="border-b border-slate-100 dark:border-slate-800 w-full" />
                <div className="border-b border-slate-100 dark:border-slate-800 w-full" />
                <div className="border-b border-slate-100 dark:border-slate-800 w-full" />
                <div className="border-b border-slate-200 dark:border-slate-700 w-full" />
              </div>

              {/* Polyline */}
              <svg className="absolute left-10 right-2 top-0 bottom-6 w-[calc(100%-48px)] h-[calc(100%-24px)] overflow-visible">
                {chartReadings.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={chartReadings
                      .map((r, i) => {
                        const x = (i / (chartReadings.length - 1)) * 100;
                        const clamped = Math.max(chartMin, Math.min(chartMax, r.value));
                        const y = ((chartMax - clamped) / (chartMax - chartMin)) * 100;
                        return `${x}%,${y}%`;
                      })
                      .join(' ')}
                  />
                )}

                {chartReadings.map((r, i) => {
                  const x = (i / Math.max(1, chartReadings.length - 1)) * 100;
                  const clamped = Math.max(chartMin, Math.min(chartMax, r.value));
                  const y = ((chartMax - clamped) / (chartMax - chartMin)) * 100;
                  const isHigh = r.value > 160;
                  const isLow = r.value < 70;

                  return (
                    <g key={r.id} className="group cursor-pointer">
                      <circle
                        cx={`${x}%`}
                        cy={`${y}%`}
                        r={5}
                        className={`${
                          isHigh
                            ? 'fill-rose-500 stroke-white dark:stroke-slate-900'
                            : isLow
                            ? 'fill-amber-500 stroke-white dark:stroke-slate-900'
                            : 'fill-teal-600 stroke-white dark:stroke-slate-900'
                        } stroke-2 transition-all group-hover:scale-150`}
                      />
                      <title>
                        {r.value} mg/dL ({t.bloodSugar.types[r.type]}) - {r.date} {r.time}
                      </title>
                    </g>
                  );
                })}
              </svg>

              {/* X Axis dates */}
              <div className="absolute left-10 right-2 bottom-0 h-5 flex justify-between text-[10px] text-slate-400 font-medium overflow-hidden">
                {chartReadings
                  .filter((_, i) => i % Math.max(1, Math.floor(chartReadings.length / 5)) === 0)
                  .map((r) => (
                    <span key={r.id} className="truncate max-w-[60px]">
                      {r.date.split('-').slice(1).join('/')}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Log Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            {t.bloodSugar.historyTitle} ({filteredReadings.length})
          </h3>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-300 font-medium"
            >
              <option value="all">{t.bloodSugar.filterAll}</option>
              <option value="fasting">{t.bloodSugar.types.fasting}</option>
              <option value="before_meal">{t.bloodSugar.types.before_meal}</option>
              <option value="after_meal">{t.bloodSugar.types.after_meal}</option>
              <option value="before_bed">{t.bloodSugar.types.before_bed}</option>
              <option value="random">{t.bloodSugar.types.random}</option>
            </select>
          </div>
        </div>

        {/* Readings List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
          {filteredReadings.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              {t.bloodSugar.noReadings}
            </div>
          ) : (
            filteredReadings.map((reading) => {
              const status = getGlucoseStatus(reading.value);
              return (
                <div
                  key={reading.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 px-2 rounded-xl transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex flex-col items-center justify-center shrink-0">
                      <span className="text-base font-black text-teal-800 dark:text-teal-300 leading-none">
                        {reading.value}
                      </span>
                      <span className="text-[9px] text-teal-600 font-medium">mg/dL</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {t.bloodSugar.types[reading.type]}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.color}`}>
                          {status.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {reading.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {reading.time}
                        </span>
                      </div>

                      {reading.notes && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {reading.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => openEditModal(reading)}
                      className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/50 rounded-lg transition"
                      title={t.app.edit}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(t.app.confirmDelete)) {
                          deleteReading(reading.id);
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
                      title={t.app.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in text-start">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" />
                <span>{editingId ? t.bloodSugar.editReading : t.bloodSugar.addReading}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Glucose Reading Value */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.bloodSugar.readingValue} *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="30"
                    max="600"
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                  <span className="absolute inset-y-0 end-3 flex items-center text-xs text-slate-400 font-semibold pointer-events-none">
                    mg/dL
                  </span>
                </div>
              </div>

              {/* Measurement Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.bloodSugar.measurementType} *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as MeasurementType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                >
                  <option value="fasting">{t.bloodSugar.types.fasting}</option>
                  <option value="before_meal">{t.bloodSugar.types.before_meal}</option>
                  <option value="after_meal">{t.bloodSugar.types.after_meal}</option>
                  <option value="before_bed">{t.bloodSugar.types.before_bed}</option>
                  <option value="random">{t.bloodSugar.types.random}</option>
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
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
                    {t.app.time}
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.app.notes}
                </label>
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'ملاحظة (مثلاً: بعد وجبة الغداء، مشيت 20 دقيقة)' : 'Notes (e.g. post-lunch, walked 20 mins)'}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  {t.app.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
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

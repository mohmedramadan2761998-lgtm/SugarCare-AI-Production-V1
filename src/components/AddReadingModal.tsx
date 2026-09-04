import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  X,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
} from 'lucide-react';
import { MeasurementType, GlucoseReading } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingReading?: GlucoseReading | null;
}

export const AddReadingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  editingReading,
}) => {
  const { t, addReading, updateReading, profile, language } = useApp();

  const [value, setValue] = useState<number>(110);
  const [type, setType] = useState<MeasurementType>('fasting');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  );
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (editingReading) {
      setValue(editingReading.value);
      setType(editingReading.type);
      setDate(editingReading.date);
      setTime(editingReading.time);
      setNotes(editingReading.notes || '');
    } else if (isOpen) {
      setValue(110);
      setType('fasting');
      setDate(new Date().toISOString().split('T')[0]);
      setTime(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
      setNotes('');
    }
  }, [editingReading, isOpen]);

  if (!isOpen) return null;

  const targetMin = profile.targetMin || 70;
  const targetMax = profile.targetMax || 140;

  const getStatus = (val: number) => {
    if (val < targetMin) {
      return {
        label: t.app.low,
        color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
        dot: 'bg-amber-500',
      };
    }
    if (val <= targetMax) {
      return {
        label: t.app.inRange,
        color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
        dot: 'bg-emerald-500',
      };
    }
    if (val <= 180) {
      return {
        label: t.app.elevated,
        color: 'text-orange-700 bg-orange-50 dark:bg-orange-950/60 border-orange-200 dark:border-orange-800',
        dot: 'bg-orange-500',
      };
    }
    return {
      label: t.app.high,
      color: 'text-rose-700 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
      dot: 'bg-rose-500',
    };
  };

  const status = getStatus(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value || value <= 0) return;

    if (editingReading) {
      updateReading(editingReading.id, {
        value: Number(value),
        type,
        date,
        time,
        notes: notes.trim() || undefined,
      });
    } else {
      addReading({
        value: Number(value),
        unit: 'mg/dL',
        type,
        date,
        time,
        notes: notes.trim() || undefined,
      });
    }

    onClose();
  };

  const quickPresets = [85, 105, 125, 145, 175, 200];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-start">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingReading ? t.bloodSugar.editReading : t.bloodSugar.addReading}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'ar'
                  ? 'سجل قراءة السكر مع تحديد نوع القياس والوقت'
                  : 'Record glucose value, timing, and measurement context'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Main Reading Input */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.bloodSugar.readingValue}
              </label>
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${status.color}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                <span>{status.label}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="30"
                max="600"
                required
                value={value || ''}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full text-3xl font-black text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-center tracking-tight"
                placeholder="120"
                autoFocus
              />
              <span className="text-xs font-extrabold text-slate-400 uppercase">
                {t.app.mgDl}
              </span>
            </div>

            {/* Quick Value Presets */}
            <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1">
              <span className="text-[11px] text-slate-400 font-medium shrink-0">
                {language === 'ar' ? 'قيم سريعة:' : 'Presets:'}
              </span>
              {quickPresets.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setValue(preset)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition cursor-pointer shrink-0 ${
                    value === preset
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Measurement Type Selector (5 Types) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              {t.bloodSugar.measurementType}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(
                [
                  { id: 'fasting', label: t.bloodSugar.types.fasting },
                  { id: 'before_meal', label: t.bloodSugar.types.before_meal },
                  { id: 'after_meal', label: t.bloodSugar.types.after_meal },
                  { id: 'random', label: t.bloodSugar.types.random },
                  { id: 'before_bed', label: t.bloodSugar.types.before_bed },
                ] as const
              ).map((item) => {
                const isSelected = type === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setType(item.id)}
                    className={`px-3 py-2.5 text-xs rounded-xl font-medium border text-center transition cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-500 font-bold shadow-xs'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {t.app.date}
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs font-medium bg-white dark:bg-slate-800 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {t.app.time}
              </label>
              <div className="relative">
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full text-xs font-medium bg-white dark:bg-slate-800 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Notes Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              {t.app.notes}{' '}
              <span className="text-[10px] text-slate-400 font-normal">
                ({language === 'ar' ? 'اختياري - نوع الوجبة، النشاط، إلخ' : 'optional notes'})
              </span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                language === 'ar'
                  ? 'مثال: بعد تناول الغداء بساعتين، مشي خفيف 20 دقيقة'
                  : 'e.g. 2 hours post-lunch, light walk'
              }
              className="w-full text-xs bg-white dark:bg-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              {t.app.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editingReading ? t.app.save : t.bloodSugar.addReading}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

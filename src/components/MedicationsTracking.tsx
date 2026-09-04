import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Pill,
  Plus,
  Trash2,
  Edit2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Calendar,
  Flame,
  CheckCheck,
  BellRing,
  Info,
} from 'lucide-react';
import { Medication, MedicationFrequency } from '../types';
import { DisclaimerBanner } from './DisclaimerBanner';

export const MedicationsTracking: React.FC = () => {
  const {
    t,
    medications,
    addMedication,
    updateMedication,
    deleteMedication,
    toggleMedicationTaken,
    language,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [time, setTime] = useState('08:00');
  const [frequency, setFrequency] = useState<MedicationFrequency>('twice_daily');
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setDose('500 mg');
    setTime('08:00');
    setFrequency('twice_daily');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (med: Medication) => {
    setEditingId(med.id);
    setName(med.name);
    setDose(med.dose);
    setTime(med.time);
    setFrequency(med.frequency);
    setNotes(med.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      updateMedication(editingId, {
        name: name.trim(),
        dose: dose.trim(),
        time,
        frequency,
        notes: notes.trim(),
      });
    } else {
      addMedication({
        name: name.trim(),
        dose: dose.trim(),
        time,
        frequency,
        notes: notes.trim(),
        takenToday: false,
        adherenceStreak: 0,
      });
    }

    setIsModalOpen(false);
  };

  const takenCount = medications.filter((m) => m.takenToday).length;
  const adherenceRate = medications.length > 0 ? Math.round((takenCount / medications.length) * 100) : 100;

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
            <Pill className="w-5 h-5" />
            <h2 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
              {t.medications.title}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.medications.subtitle}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.medications.addMedication}</span>
        </button>
      </div>

      <DisclaimerBanner full={false} />

      {/* Adherence Summary Widget */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">{language === 'ar' ? 'إجمالي الأدوية' : 'Total Active Meds'}</span>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">{medications.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">{language === 'ar' ? 'أدوية تم تناولها اليوم' : 'Taken Today'}</span>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {takenCount} / {medications.length}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">{language === 'ar' ? 'معدل الالتزام اليومي' : 'Adherence Rate'}</span>
            <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400">{adherenceRate}%</p>
          </div>
        </div>
      </div>

      {/* Medication Cards List or Empty State */}
      {medications.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
            <Pill className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
            {language === 'ar' ? 'لا توجد أدوية مضافة حالياً' : 'No medications logged yet'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">
            {language === 'ar'
              ? 'أضف الأدوية والجرعات ومواعيد تناولها لمتابعة الالتزام اليومي وتلقي التذكيرات.'
              : 'Add your prescribed medications, dosages, and schedules to track daily adherence and reminders.'}
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.medications.addMedication}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medications.map((med) => (
          <div
            key={med.id}
            className={`border rounded-2xl p-5 shadow-xs transition text-start relative overflow-hidden flex flex-col justify-between ${
              med.takenToday
                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/80'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      med.takenToday
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {med.name}
                    </h3>
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mt-0.5">
                      {med.dose}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(med)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg transition"
                    title={t.app.edit}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(t.app.confirmDelete)) {
                        deleteMedication(med.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                    title={t.app.delete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Timing & Frequency Info */}
              <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">{t.medications.time}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    {med.time}
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">{t.medications.frequency}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block truncate">
                    {t.medications.frequencies[med.frequency] || med.frequency}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {med.notes && (
                <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-100 dark:border-slate-800 mb-3">
                  {med.notes}
                </p>
              )}
            </div>

            {/* Taken Status Toggle & Streak */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
                <Flame className="w-4 h-4" />
                <span>{t.medications.adherenceStreak.replace('{days}', String(med.adherenceStreak))}</span>
              </div>

              <button
                onClick={() => toggleMedicationTaken(med.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  med.takenToday
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {med.takenToday ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.medications.takenStatus}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-slate-400" />
                    <span>{t.medications.markTaken}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in text-start">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-blue-600" />
                <span>{editingId ? t.medications.editMedication : t.medications.addMedication}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Medication Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.medications.name} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.medications.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              {/* Dose & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.medications.dose} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.medications.dosePlaceholder}
                    value={dose}
                    onChange={(e) => setDose(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.medications.time} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 08:00 & 20:00"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.medications.frequency}
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as MedicationFrequency)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                >
                  <option value="once_daily">{t.medications.frequencies.once_daily}</option>
                  <option value="twice_daily">{t.medications.frequencies.twice_daily}</option>
                  <option value="thrice_daily">{t.medications.frequencies.thrice_daily}</option>
                  <option value="with_meals">{t.medications.frequencies.with_meals}</option>
                  <option value="before_bed">{t.medications.frequencies.before_bed}</option>
                  <option value="as_needed">{t.medications.frequencies.as_needed}</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.app.notes}
                </label>
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'مثال: يؤخذ مع وجبة الإفطار والعشاء' : 'e.g. Take with breakfast and dinner'}
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
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
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

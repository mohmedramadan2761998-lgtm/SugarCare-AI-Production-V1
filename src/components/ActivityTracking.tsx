import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Calendar,
  Footprints,
  X,
  Zap,
  Trophy,
} from 'lucide-react';
import { PhysicalActivity, ActivityType } from '../types';
import { DisclaimerBanner } from './DisclaimerBanner';

export const ActivityTracking: React.FC = () => {
  const {
    t,
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    stats,
    language,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [type, setType] = useState<ActivityType>('walking');
  const [duration, setDuration] = useState<number>(30);
  const [steps, setSteps] = useState<number>(3500);
  const [caloriesBurned, setCaloriesBurned] = useState<number>(140);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  );
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingId(null);
    setType('walking');
    setDuration(30);
    setSteps(3500);
    setCaloriesBurned(140);
    setDate(new Date().toISOString().split('T')[0]);
    setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (act: PhysicalActivity) => {
    setEditingId(act.id);
    setType(act.type);
    setDuration(act.duration);
    setSteps(act.steps || 0);
    setCaloriesBurned(act.calories || 0);
    setDate(act.date);
    setTime(act.time);
    setNotes(act.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (duration <= 0) return;

    if (editingId) {
      updateActivity(editingId, {
        type,
        duration: Number(duration),
        steps: steps ? Number(steps) : undefined,
        calories: caloriesBurned ? Number(caloriesBurned) : undefined,
        date,
        time,
        notes: notes.trim(),
      });
    } else {
      addActivity({
        type,
        duration: Number(duration),
        steps: steps ? Number(steps) : undefined,
        calories: caloriesBurned ? Number(caloriesBurned) : undefined,
        date,
        time,
        notes: notes.trim(),
      });
    }

    setIsModalOpen(false);
  };

  const totalWeeklyMinutes = activities.reduce((acc, curr) => acc + curr.duration, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
            <Flame className="w-5 h-5" />
            <h2 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
              {t.activity.title}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.activity.subtitle}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.activity.addActivity}</span>
        </button>
      </div>

      <DisclaimerBanner full={false} />

      {/* Activity Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs text-start">
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">{t.activity.todayActivity}</span>
            <p className="text-xl font-extrabold text-orange-600 dark:text-orange-400">
              {stats.todayActivityMinutes} <span className="text-xs font-normal text-slate-500">mins</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs text-start">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Footprints className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">{t.dashboard.steps}</span>
            <p className="text-xl font-extrabold text-teal-700 dark:text-teal-400">
              {stats.todaySteps.toLocaleString()} <span className="text-xs font-normal text-slate-500">steps</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs text-start">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">{t.activity.weeklyGoal}</span>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {totalWeeklyMinutes} <span className="text-xs font-normal text-slate-500">mins</span>
            </p>
          </div>
        </div>
      </div>

      {/* Activity Logs List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs text-start">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          {language === 'ar' ? 'سجل الأنشطة والتمارين' : 'Exercise & Workout Log'} ({activities.length})
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
          {activities.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-400">{t.activity.noActivities}</p>
          ) : (
            activities.map((act) => (
              <div
                key={act.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 px-2 rounded-xl transition text-start"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {t.activity.types[act.type] || act.type}
                      </h4>
                      <span className="text-[11px] font-bold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
                        {act.duration} {language === 'ar' ? 'دقيقة' : 'mins'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {act.steps ? (
                        <span className="flex items-center gap-1 font-medium">
                          <Footprints className="w-3 h-3 text-teal-600" />
                          {act.steps.toLocaleString()} {t.activity.steps}
                        </span>
                      ) : null}
                      {act.calories ? (
                        <span className="flex items-center gap-1 font-medium">
                          <Zap className="w-3 h-3 text-orange-500" />
                          {act.calories} {t.activity.calories}
                        </span>
                      ) : null}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {act.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {act.time}
                      </span>
                    </div>

                    {act.notes && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {act.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => openEditModal(act)}
                    className="p-1.5 text-slate-400 hover:text-orange-600 rounded-lg transition cursor-pointer"
                    title={t.app.edit}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(t.app.confirmDelete)) {
                        deleteActivity(act.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                    title={t.app.delete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in text-start">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-600" />
                <span>{editingId ? t.activity.editActivity : t.activity.addActivity}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.activity.type} *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ActivityType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                >
                  <option value="walking">{t.activity.types.walking}</option>
                  <option value="running">{t.activity.types.running}</option>
                  <option value="cycling">{t.activity.types.cycling}</option>
                  <option value="swimming">{t.activity.types.swimming}</option>
                  <option value="yoga">{t.activity.types.yoga}</option>
                  <option value="exercise">{t.activity.types.exercise}</option>
                  <option value="other">{t.activity.types.other}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.activity.duration} (mins) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="600"
                    required
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.activity.steps}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={steps}
                    onChange={(e) => setSteps(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.activity.calories} (kcal)
                </label>
                <input
                  type="number"
                  min="0"
                  value={caloriesBurned}
                  onChange={(e) => setCaloriesBurned(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

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

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.app.notes}
                </label>
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'ملاحظة (مثال: مشي مريح في الهواء الطلق)' : 'e.g. Outdoor brisk walking in park'}
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
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-xs cursor-pointer"
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

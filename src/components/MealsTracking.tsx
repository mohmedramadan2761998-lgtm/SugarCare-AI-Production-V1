import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UtensilsCrossed,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Calendar,
  PieChart,
  Flame,
  X,
  Coffee,
  Sun,
  Moon,
  Cookie,
} from 'lucide-react';
import { Meal, MealType } from '../types';
import { DisclaimerBanner } from './DisclaimerBanner';

export const MealsTracking: React.FC = () => {
  const {
    t,
    meals,
    addMeal,
    updateMeal,
    deleteMeal,
    stats,
    language,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<MealType>('lunch');
  const [carbs, setCarbs] = useState<number>(45);
  const [calories, setCalories] = useState<number>(450);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  );
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setType('lunch');
    setCarbs(45);
    setCalories(450);
    setDate(new Date().toISOString().split('T')[0]);
    setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (meal: Meal) => {
    setEditingId(meal.id);
    setName(meal.name);
    setType(meal.type);
    setCarbs(meal.carbs);
    setCalories(meal.calories || 0);
    setDate(meal.date);
    setTime(meal.time);
    setNotes(meal.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      updateMeal(editingId, {
        name: name.trim(),
        type,
        carbs: Number(carbs),
        calories: Number(calories) || undefined,
        date,
        time,
        notes: notes.trim(),
      });
    } else {
      addMeal({
        name: name.trim(),
        type,
        carbs: Number(carbs),
        calories: Number(calories) || undefined,
        date,
        time,
        notes: notes.trim(),
      });
    }

    setIsModalOpen(false);
  };

  const getMealIcon = (mType: MealType) => {
    switch (mType) {
      case 'breakfast':
        return <Coffee className="w-4 h-4 text-amber-500" />;
      case 'lunch':
        return <Sun className="w-4 h-4 text-orange-500" />;
      case 'dinner':
        return <Moon className="w-4 h-4 text-indigo-500" />;
      case 'snack':
        return <Cookie className="w-4 h-4 text-emerald-500" />;
    }
  };

  const todayCarbs = meals
    .filter((m) => m.date === new Date().toISOString().split('T')[0])
    .reduce((acc, curr) => acc + curr.carbs, 0);

  const totalCalories = meals.reduce((acc, curr) => acc + (curr.calories || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
            <UtensilsCrossed className="w-5 h-5" />
            <h2 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
              {t.meals.title}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.meals.subtitle}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.meals.addMeal}</span>
        </button>
      </div>

      <DisclaimerBanner full={false} />

      {/* Daily Carb & Nutrition summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs text-start">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">
              {language === 'ar' ? 'كربوهيدرات اليوم' : 'Carbs Today'}
            </span>
            <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400">
              {todayCarbs} <span className="text-xs font-normal text-slate-500">g</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs text-start">
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">{language === 'ar' ? 'إجمالي السعرات' : 'Total Calories'}</span>
            <p className="text-xl font-extrabold text-orange-600 dark:text-orange-400">
              {totalCalories} <span className="text-xs font-normal text-slate-500">kcal</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs text-start">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">{t.meals.allMeals}</span>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">
              {meals.length} <span className="text-xs font-normal text-slate-500">{language === 'ar' ? 'وجبة' : 'meals'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meals.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-xs text-slate-400">
            {t.meals.noMeals}
          </div>
        ) : (
          meals.map((meal) => (
            <div
              key={meal.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between text-start"
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                      {getMealIcon(meal.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {meal.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {t.meals.types[meal.type] || meal.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(meal)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg transition cursor-pointer"
                      title={t.app.edit}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(t.app.confirmDelete)) {
                          deleteMeal(meal.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                      title={t.app.delete}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 my-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                      {t.meals.carbs}
                    </span>
                    <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                      {meal.carbs} g
                    </span>
                  </div>

                  {meal.calories ? (
                    <div className="p-2.5 rounded-xl bg-orange-50/50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/60">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                        {t.meals.calories}
                      </span>
                      <span className="text-base font-extrabold text-orange-600 dark:text-orange-400">
                        {meal.calories} kcal
                      </span>
                    </div>
                  ) : null}
                </div>

                {meal.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                    {meal.notes}
                  </p>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {meal.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {meal.time}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in text-start">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
                <span>{editingId ? t.meals.editMeal : t.meals.addMeal}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Meal Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.meals.mealName} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.meals.mealNamePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Meal Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.meals.mealType} *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as MealType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                >
                  <option value="breakfast">{t.meals.types.breakfast}</option>
                  <option value="lunch">{t.meals.types.lunch}</option>
                  <option value="dinner">{t.meals.types.dinner}</option>
                  <option value="snack">{t.meals.types.snack}</option>
                </select>
              </div>

              {/* Carbs & Calories */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.meals.carbs} (g) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    required
                    value={carbs}
                    onChange={(e) => setCarbs(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.meals.calories} (kcal)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="3000"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
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
                  placeholder={language === 'ar' ? 'ملاحظة (مثال: وجبة قليلة الدسم مع سلطة خضراء)' : 'e.g. Low fat with mixed green salad'}
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
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
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

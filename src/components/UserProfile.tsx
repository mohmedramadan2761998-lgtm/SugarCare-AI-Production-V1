import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  X,
  Target,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { UserProfile as UserProfileType, DiabetesType, MeasurementType } from '../types';
import { DisclaimerBanner } from './DisclaimerBanner';
import { DEFAULT_TARGET_RANGES } from '../utils/glucoseUtils';

export const UserProfile: React.FC = () => {
  const {
    t,
    profile,
    updateProfile,
    clearAllUserData,
    language,
  } = useApp();

  const [formData, setFormData] = useState<UserProfileType>(() => ({
    ...profile,
    targetRanges: {
      ...DEFAULT_TARGET_RANGES,
      ...(profile.targetRanges || {}),
    },
  }));
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleChange = (field: keyof UserProfileType, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTargetRangeChange = (
    type: MeasurementType,
    boundary: 'min' | 'max',
    val: string
  ) => {
    const numVal = val === '' ? undefined : Number(val);
    setFormData((prev) => ({
      ...prev,
      targetRanges: {
        ...prev.targetRanges,
        [type]: {
          ...prev.targetRanges?.[type],
          [boundary]: numVal,
        },
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleConfirmReset = () => {
    setIsConfirmModalOpen(false);
    clearAllUserData();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-1">
            <User className="w-5 h-5" />
            <h2 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
              {t.profile.title}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.profile.subtitle}
          </p>
        </div>

        <button
          type="button"
          id="clear-all-data-trigger"
          onClick={() => setIsConfirmModalOpen(true)}
          className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-800 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>{t.profile.resetData}</span>
        </button>
      </div>

      <DisclaimerBanner full={false} />

      {/* Profile Form Card */}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6 text-start">
        {/* Profile Card Top Highlight */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-2xl font-black shadow-md shadow-blue-600/20">
            {formData.name ? formData.name.charAt(0) : 'U'}
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              {formData.name || (language === 'ar' ? 'المستخدم' : 'User')}
            </h3>
            <p className="text-xs text-slate-500">
              {t.profile.diabetesTypes[formData.diabetesType] || formData.diabetesType} • {formData.age} {language === 'ar' ? 'سنة' : 'yrs'}
            </p>
          </div>
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.profile.name} *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.profile.age} *
            </label>
            <input
              type="number"
              min="1"
              max="120"
              required
              value={formData.age}
              onChange={(e) => handleChange('age', Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          {/* Diabetes Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.profile.diabetesType} *
            </label>
            <select
              value={formData.diabetesType}
              onChange={(e) => handleChange('diabetesType', e.target.value as DiabetesType)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
            >
              <option value="type_2">{t.profile.diabetesTypes.type_2}</option>
              <option value="type_1">{t.profile.diabetesTypes.type_1}</option>
              <option value="gestational">{t.profile.diabetesTypes.gestational}</option>
              <option value="lada">{t.profile.diabetesTypes.lada}</option>
              <option value="other">{t.profile.diabetesTypes.other}</option>
            </select>
          </div>

          {/* Height (cm) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.profile.height}
            </label>
            <input
              type="number"
              min="50"
              max="250"
              value={formData.height}
              onChange={(e) => handleChange('height', Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          {/* Doctor Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.profile.doctorName}
            </label>
            <input
              type="text"
              value={formData.doctorName}
              onChange={(e) => handleChange('doctorName', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          {/* Emergency Contact Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.profile.emergencyContactName}
            </label>
            <input
              type="text"
              value={formData.emergencyContactName}
              onChange={(e) => handleChange('emergencyContactName', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>
        </div>

        {/* Customizable Glucose Target Ranges Section */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
            <Target className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                {language === 'ar' ? 'النطاقات المستهدفة لسكر الدم' : 'Glucose Target Ranges'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'ar'
                  ? 'حدد الحد الأدنى والأقصى المستهدف (ملغ/ديسيلتر) لكل نوع قياس لمقارنة قراءاتك بدقة'
                  : 'Customize your min and max glucose target (mg/dL) for each measurement type'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {(
              [
                {
                  type: 'fasting' as MeasurementType,
                  titleAr: 'صائم (صباحاً)',
                  titleEn: 'Fasting (Morning)',
                  descAr: 'القياس عند الاستيقاظ قبل الإفطار',
                  descEn: 'Morning upon waking before food',
                  icon: Clock,
                },
                {
                  type: 'before_meal' as MeasurementType,
                  titleAr: 'قبل الوجبة',
                  titleEn: 'Before Meal',
                  descAr: 'القياس قبل تناول أي وجبة رئيسية',
                  descEn: 'Pre-prandial prior to meals',
                  icon: Target,
                },
                {
                  type: 'after_meal' as MeasurementType,
                  titleAr: 'بعد الوجبة (ساعتين)',
                  titleEn: '2 Hours After Meal',
                  descAr: 'القياس بعد ساعتين من بدء الوجبة',
                  descEn: 'Post-prandial 2 hours after meal',
                  icon: Target,
                },
                {
                  type: 'random' as MeasurementType,
                  titleAr: 'عشوائي',
                  titleEn: 'Random',
                  descAr: 'القياس في أي وقت عشوائي خلال اليوم',
                  descEn: 'Checked at any unspecified time',
                  icon: HelpCircle,
                },
                {
                  type: 'before_bed' as MeasurementType,
                  titleAr: 'قبل النوم',
                  titleEn: 'Before Bed',
                  descAr: 'القياس الليلي قبل النوم مباشرة',
                  descEn: 'Bedtime reading before sleep',
                  icon: Clock,
                },
              ] as const
            ).map((cat) => {
              const currentRange = formData.targetRanges?.[cat.type];
              const minVal = currentRange?.min !== undefined ? currentRange.min : '';
              const maxVal = currentRange?.max !== undefined ? currentRange.max : '';

              return (
                <div
                  key={cat.type}
                  className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <cat.icon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span>{language === 'ar' ? cat.titleAr : cat.titleEn}</span>
                      </h5>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {language === 'ar' ? cat.descAr : cat.descEn}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shrink-0">
                      {minVal !== '' && maxVal !== ''
                        ? `${minVal} - ${maxVal}`
                        : language === 'ar'
                        ? 'غير مكتمل'
                        : 'Custom'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        {language === 'ar' ? 'الحد الأدنى (Min)' : 'Minimum (Min)'}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="40"
                          max="300"
                          placeholder="مثال: 70"
                          value={minVal}
                          onChange={(e) =>
                            handleTargetRangeChange(cat.type, 'min', e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                        />
                        <span className="absolute end-2 top-2 text-[10px] text-slate-400 pointer-events-none">
                          {language === 'ar' ? 'ملغ' : 'mg'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        {language === 'ar' ? 'الحد الأقصى (Max)' : 'Maximum (Max)'}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="60"
                          max="400"
                          placeholder="مثال: 130"
                          value={maxVal}
                          onChange={(e) =>
                            handleTargetRangeChange(cat.type, 'max', e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                        />
                        <span className="absolute end-2 top-2 text-[10px] text-slate-400 pointer-events-none">
                          {language === 'ar' ? 'ملغ' : 'mg'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button and Saved Toast */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            {showSavedToast && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'ar' ? 'تم حفظ التعديلات بنجاح!' : 'Profile saved successfully!'}</span>
              </span>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t.app.save}</span>
          </button>
        </div>
      </form>

      {/* Confirmation Modal for Resetting All Data */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 sm:p-7 text-start animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {language === 'ar' ? 'مسح جميع البيانات والبدء من جديد' : 'Clear All Data & Start Over'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {language === 'ar'
                ? 'هل أنت متأكد من رغبتك في مسح كافة بياناتك؟ سيتم حذف جميع سجلات سكر الدم، الأدوية، الوجبات، الأنشطة، قياسات الوزن، المواعيد، الإشعارات، والملف الشخصي نهائياً من هذا الجهاز، وسيتم نقلك إلى شاشة إعداد الملف الشخصي من جديد.'
                : 'Are you sure you want to clear all your data? This will permanently erase all glucose readings, medications, meals, physical activity logs, weight records, appointments, notifications, and personal profile data from this device. You will be redirected to the initial profile setup.'}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                id="cancel-reset-btn"
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                id="confirm-reset-btn"
                onClick={handleConfirmReset}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>{language === 'ar' ? 'نعم، مسح جميع البيانات' : 'نعم، مسح جميع البيانات'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

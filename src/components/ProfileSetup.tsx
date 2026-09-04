import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Activity,
  Heart,
  Scale,
  Stethoscope,
  Phone,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Languages,
  Moon,
  Sun,
} from 'lucide-react';
import { DiabetesType, UserProfile } from '../types';
import { DisclaimerBanner } from './DisclaimerBanner';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
export const ProfileSetup: React.FC = () => {
  const {
    t,
    profile,
    updateProfile,
    setActiveTab,
    addWeightRecord,
    language,
    setLanguage,
    theme,
    toggleTheme,
  } = useApp();

  const [name, setName] = useState(profile.name || '');
  const [age, setAge] = useState<number | ''>(profile.age > 0 ? profile.age : '');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(profile.gender || 'male');
  const [diabetesType, setDiabetesType] = useState<DiabetesType>(
    profile.diabetesType || 'type_2'
  );
  const [height, setHeight] = useState<number | ''>(profile.height > 0 ? profile.height : '');
  const [weight, setWeight] = useState<number | ''>(profile.weight > 0 ? profile.weight : '');
  const [targetMin, setTargetMin] = useState<number>(profile.targetMin || 70);
  const [targetMax, setTargetMax] = useState<number>(profile.targetMax || 140);
  const [doctorName, setDoctorName] = useState(profile.doctorName || '');
  const [doctorClinic, setDoctorClinic] = useState(profile.doctorClinic || '');
  const [emergencyName, setEmergencyName] = useState(profile.emergencyContactName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(profile.emergencyContactPhone || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !age || !diabetesType) {
      setError(
        language === 'ar'
          ? 'يرجى إدخال الاسم الكامل والعمر ونوع السكري للمتابعة.'
          : 'Please enter your name, age, and diabetes type to continue.'
      );
      return;
    }

    const updatedProfile: UserProfile = {
      name: name.trim(),
      age: Number(age),
      gender,
      diabetesType,
      height: height ? Number(height) : 170,
      weight: weight ? Number(weight) : 75,
      targetMin: Number(targetMin) || 70,
      targetMax: Number(targetMax) || 140,
      doctorName: doctorName.trim(),
      doctorClinic: doctorClinic.trim(),
      emergencyContactName: emergencyName.trim(),
      emergencyContactPhone: emergencyPhone.trim(),
      emergencyContactRelationship: '',
      isSetupComplete: true,
    };

    updateProfile(updatedProfile);

    // If initial weight was entered, add the first weight log
    if (weight && Number(weight) > 0) {
      addWeightRecord({
        weight: Number(weight),
        date: new Date().toISOString().split('T')[0],
        notes: language === 'ar' ? 'الوزن الأولي عند إعداد الملف' : 'Initial setup weight',
      });
    }

    // Direct transition to Dashboard
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Bar with Brand & Language / Theme */}
      <div className="w-full max-w-3xl mx-auto flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-xs">
            <div className="w-3.5 h-3.5 bg-white rounded-full"></div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
              SugarCare <span className="text-blue-600">AI</span>
            </h1>
            <span className="text-[11px] text-slate-400 font-medium">
              {language === 'ar' ? 'رفيق السكري الذكي' : 'Smart Diabetes Companion'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
  onClick={async () => {
    await signOut(auth);
  }}
  className="px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900 bg-white dark:bg-slate-900 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
>
  {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
</button>
<button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Profile Setup Form Container */}
      <div className="w-full max-w-3xl mx-auto my-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xs text-start">
        {/* Step Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.setup?.welcomeBadge || 'Welcome to SugarCare AI'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.setup?.title || 'Personal Health Profile Setup'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {t.setup?.subtitle ||
              'Enter your core health details to customize your tracking plan and smart AI insights'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Personal Info */}
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <User className="w-4 h-4 text-blue-600" />
              <span>{t.profile.personalInfo}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.setup?.name || 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={t.setup?.namePlaceholder || 'Enter your name...'}
                  className="w-full text-sm bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.setup?.age || 'Age (years) *'}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value ? Number(e.target.value) : '');
                    if (error) setError(null);
                  }}
                  placeholder={t.setup?.agePlaceholder || 'e.g. 45'}
                  className="w-full text-sm bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.profile.gender}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full text-sm bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium cursor-pointer"
                >
                  <option value="male">{t.profile.male}</option>
                  <option value="female">{t.profile.female}</option>
                  <option value="other">{t.profile.other}</option>
                </select>
              </div>

              {/* Diabetes Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.setup?.diabetesType || 'Diabetes Type *'}
                </label>
                <select
                  value={diabetesType}
                  onChange={(e) => setDiabetesType(e.target.value as DiabetesType)}
                  className="w-full text-sm bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium cursor-pointer"
                >
                  <option value="type_1">{t.profile.diabetesTypes.type_1}</option>
                  <option value="type_2">{t.profile.diabetesTypes.type_2}</option>
                  <option value="gestational">{t.profile.diabetesTypes.gestational}</option>
                  <option value="lada">{t.profile.diabetesTypes.lada}</option>
                  <option value="other">{t.profile.diabetesTypes.other}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Body Metrics & Targets */}
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>{t.profile.clinicalTargets}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Height */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.setup?.height || 'Height (cm)'}
                </label>
                <input
                  type="number"
                  min="50"
                  max="250"
                  value={height}
                  onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : '')}
                  placeholder={t.setup?.heightPlaceholder || '175'}
                  className="w-full text-sm bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.setup?.weight || 'Current Weight (kg)'}
                </label>
                <input
                  type="number"
                  min="20"
                  max="300"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
                  placeholder={t.setup?.weightPlaceholder || '80'}
                  className="w-full text-sm bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>

              {/* Target Min (Fasting) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.setup?.targetMin || 'Target Min (mg/dL)'}
                </label>
                <input
                  type="number"
                  min="50"
                  max="120"
                  value={targetMin}
                  onChange={(e) => setTargetMin(Number(e.target.value))}
                  className="w-full text-sm bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>

              {/* Target Max (Post-Meal) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.setup?.targetMax || 'Target Max (mg/dL)'}
                </label>
                <input
                  type="number"
                  min="120"
                  max="250"
                  value={targetMax}
                  onChange={(e) => setTargetMax(Number(e.target.value))}
                  className="w-full text-sm bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Optional Doctor & Emergency Info */}
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Stethoscope className="w-4 h-4 text-blue-600" />
              <span>{t.setup?.doctorInfo || 'Physician & Emergency Info (Optional)'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.setup?.doctorName || 'Doctor Name'}
                </label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder={t.setup?.doctorNamePlaceholder || 'e.g. Dr. Ahmed'}
                  className="w-full text-sm bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.setup?.doctorClinic || 'Clinic / Hospital'}
                </label>
                <input
                  type="text"
                  value={doctorClinic}
                  onChange={(e) => setDoctorClinic(e.target.value)}
                  placeholder={t.setup?.doctorClinicPlaceholder || 'e.g. Diabetes Specialized Care'}
                  className="w-full text-sm bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.setup?.emergencyContactName || 'Emergency Contact Name'}
                </label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="e.g. Sarah (Spouse)"
                  className="w-full text-sm bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.setup?.emergencyContactPhone || 'Emergency Phone'}
                </label>
                <input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="+966 5X XXX XXXX"
                  className="w-full text-sm bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {language === 'ar'
                  ? 'بياناتك محفوظة محلياً وتستخدم لمتابعتك الشخصية بأمان'
                  : 'Your data is securely stored locally for your personal tracking'}
              </span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.setup?.submitButton || 'Complete Setup & Open Dashboard'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Footer Disclaimer */}
      <div className="w-full max-w-3xl mx-auto">
        <DisclaimerBanner full={true} />
      </div>
    </div>
  );
};

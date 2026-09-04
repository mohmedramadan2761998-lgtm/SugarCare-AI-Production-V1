import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Plus,
  Trash2,
  Clock,
  MapPin,
  CheckCircle2,
  X,
  Stethoscope,
  ChevronRight,
  Bot,
} from 'lucide-react';
import { DisclaimerBanner } from './DisclaimerBanner';

export const Appointments: React.FC = () => {
  const {
    t,
    appointments,
    addAppointment,
    deleteAppointment,
    setActiveTab,
    setIsAssistantModalOpen,
    language,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [clinic, setClinic] = useState(language === 'ar' ? 'عيادة السكري التخصصية' : 'Diabetes Specialized Care Clinic');
  const [appointmentDate, setAppointmentDate] = useState<string>(
    new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]
  );
  const [appointmentTime, setAppointmentTime] = useState<string>('10:30');
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setDoctorName('');
    setClinic(language === 'ar' ? 'عيادة السكري التخصصية' : 'Diabetes Specialized Care Clinic');
    setAppointmentDate(new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]);
    setAppointmentTime('10:30');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim()) return;

    addAppointment({
      doctorName: doctorName.trim(),
      clinic: clinic.trim(),
      appointmentDate,
      appointmentTime,
      notes: notes.trim(),
      status: 'upcoming',
      questionsForDoctor: [],
    });

    setIsModalOpen(false);
  };

  const calculateDaysLeft = (targetDate: string) => {
    const diffTime = new Date(targetDate).getTime() - new Date().setHours(0, 0, 0, 0);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return language === 'ar' ? 'موعد سابق' : 'Past appointment';
    if (diffDays === 0) return language === 'ar' ? 'اليوم' : 'Today';
    if (diffDays === 1) return language === 'ar' ? 'غداً' : 'Tomorrow';
    return t.appointments.countdown.replace('{days}', String(diffDays));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-1">
            <Calendar className="w-5 h-5" />
            <h2 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
              {t.appointments.title}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.appointments.subtitle}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.appointments.addAppointment}</span>
        </button>
      </div>

      <DisclaimerBanner full={false} />

      {/* Preparation Checklist Card */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-slate-900 dark:to-slate-900 border border-teal-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs text-start">
        <div className="flex items-center justify-between pb-3 border-b border-teal-100 dark:border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {t.appointments.checklistTitle}
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('reports')}
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{language === 'ar' ? 'تجهيز التقرير الطبي' : 'Prepare Report'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-start gap-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-teal-100 dark:border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">{t.appointments.checklistItem1}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-teal-100 dark:border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">{t.appointments.checklistItem2}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-teal-100 dark:border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">{t.appointments.checklistItem3}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Cards List or Empty State */}
      {appointments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
            {language === 'ar' ? 'لا توجد مواعيد طبية قادمة' : 'No upcoming appointments scheduled'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">
            {language === 'ar'
              ? 'سجل مواعيد زيارة الطبيب أو فحوصات السكري الدورية لتنظيم المتابعة والتحضير للزيارة.'
              : 'Add your doctor visits, lab tests, or follow-up consultations to stay organized.'}
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.appointments.addAppointment}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((app) => (
          <div
            key={app.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs text-start flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {app.doctorName}
                    </h3>
                    <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                      {app.clinic}
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 text-xs font-bold border border-teal-200 dark:border-teal-800">
                  {calculateDaysLeft(app.appointmentDate)}
                </span>
              </div>

              <div className="space-y-2 my-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span className="font-semibold">{app.appointmentDate}</span>
                  <span className="text-slate-400">•</span>
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">{app.appointmentTime}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{app.clinic}</span>
                </div>

                {app.notes && (
                  <p className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 mt-2">
                    {app.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsAssistantModalOpen(true);
                }}
                className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تجهيز أسئلة للموعد مع AI' : 'Prepare questions with AI'}</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm(t.app.confirmDelete)) {
                    deleteAppointment(app.id);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                title={t.app.delete}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in text-start">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <span>{t.appointments.addAppointment}</span>
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
                  {t.appointments.doctorName} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.appointments.doctorNamePlaceholder}
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.appointments.clinic}
                </label>
                <input
                  type="text"
                  placeholder={t.appointments.clinicPlaceholder}
                  value={clinic}
                  onChange={(e) => setClinic(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.appointments.date} *
                  </label>
                  <input
                    type="date"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.appointments.time} *
                  </label>
                  <input
                    type="time"
                    required
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
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
                  placeholder={language === 'ar' ? 'ملاحظات وأسئلة لمناقشتها' : 'Notes & topics to discuss'}
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

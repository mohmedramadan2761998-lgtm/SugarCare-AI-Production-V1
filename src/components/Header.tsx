import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Sparkles,
  Languages,
  Moon,
  Sun,
  Menu,
  X,
  CheckCheck,
  Calendar,
  Pill,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { TabType } from '../types';

interface Props {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Header: React.FC<Props> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const {
    t,
    language,
    setLanguage,
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    profile,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotificationsCount,
    setIsAssistantModalOpen,
    isRtl,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const getSectionTitle = (tab: TabType): string => {
    switch (tab) {
      case 'dashboard':
        return t.nav.dashboard;
      case 'blood_sugar':
        return t.nav.bloodSugar;
      case 'medications':
        return t.nav.medications;
      case 'meals':
        return t.nav.meals;
      case 'activity':
        return t.nav.activity;
      case 'weight':
        return t.nav.weight;
      case 'ai_insights':
        return t.nav.aiInsights;
      case 'reports':
        return t.nav.reports;
      case 'appointments':
        return t.nav.appointments;
      case 'notifications':
        return t.nav.notifications;
      case 'profile':
        return t.nav.profile;
      default:
        return t.nav.dashboard;
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <Pill className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'glucose_check':
        return <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'insight':
        return <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between transition-colors">
      {/* Left: Mobile Menu + Greeting / Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-3">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
            {activeTab === 'dashboard'
              ? (language === 'ar'
                  ? `مرحباً بعودتك، ${profile.name || 'محمد'}`
                  : `Welcome back, ${profile.name || 'Mohamed'}`)
              : getSectionTitle(activeTab)}
          </h2>

          <span className="hidden sm:inline-flex items-center text-xs px-2.5 py-1 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 rounded-full font-medium">
            {language === 'ar' ? 'مؤشر مستقر' : 'Stable Trend'}
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* SugarCare Assistant Button */}
        <button
          onClick={() => setIsAssistantModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>{language === 'ar' ? 'المساعد' : 'Assistant'}</span>
        </button>

        {/* Language Switch */}
        <button
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
          title="Toggle Language"
        >
          <Languages className="w-4 h-4" />
          <span className="font-bold">{language === 'ar' ? 'EN' : 'عربي'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
          title={theme === 'light' ? t.app.darkMode : t.app.lightMode}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Notifications Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
            title={t.nav.notifications}
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute 1.5 top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* Notification Popup Dropdown */}
          {isNotifOpen && (
            <div
              className={`absolute top-full mt-2 ${
                isRtl ? 'left-0 sm:left-auto sm:right-auto' : 'right-0'
              } w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden text-start animate-fade-in`}
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                    {t.nav.notifications} ({unreadNotificationsCount})
                  </span>
                </div>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>{t.notifications.markAllRead}</span>
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    {t.notifications.noNotifications}
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.actionTab) {
                          setActiveTab(notif.actionTab);
                          setIsNotifOpen(false);
                        }
                      }}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer flex items-start gap-3 ${
                        !notif.isRead ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                        {getNotifIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-slate-400">{notif.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                      </div>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-2" />
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-800/40">
                <button
                  onClick={() => {
                    setActiveTab('notifications');
                    setIsNotifOpen(false);
                  }}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {language === 'ar' ? 'عرض جميع الإشعارات' : 'View All Notifications'}
                </button>
              </div>
            </div>
          )}
        </div>
<button
  onClick={async () => {
    await signOut(auth);
  }}
  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
>
  {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
</button>
        {/* User Profile Avatar */}
        <button
          onClick={() => setActiveTab('profile')}
          className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-bold hover:ring-2 hover:ring-blue-600 transition cursor-pointer"
          title={profile.name || 'Mohamed'}
        >
          {profile.name ? profile.name.charAt(0) : 'M'}
        </button>
      </div>
    </header>
  );
};


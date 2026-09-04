import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Activity,
  Pill,
  UtensilsCrossed,
  Flame,
  Scale,
  Sparkles,
  FileText,
  Calendar,
  Bell,
  User,
  LogOut,
  Bot,
} from 'lucide-react';
import { TabType } from '../types';

interface Props {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<Props> = ({ isMobileOpen, onCloseMobile }) => {
  const {
    t,
    activeTab,
    setActiveTab,
    unreadNotificationsCount,
    setIsAssistantModalOpen,
    language,
    profile,
  } = useApp();

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: t.nav.dashboard, icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'blood_sugar', label: t.nav.bloodSugar, icon: <Activity className="w-5 h-5" /> },
    { id: 'medications', label: t.nav.medications, icon: <Pill className="w-5 h-5" /> },
    { id: 'meals', label: t.nav.meals, icon: <UtensilsCrossed className="w-5 h-5" /> },
    { id: 'activity', label: t.nav.activity, icon: <Flame className="w-5 h-5" /> },
    { id: 'weight', label: t.nav.weight, icon: <Scale className="w-5 h-5" /> },
    { id: 'ai_insights', label: t.nav.aiInsights, icon: <Sparkles className="w-5 h-5" /> },
    { id: 'reports', label: t.nav.reports, icon: <FileText className="w-5 h-5" /> },
    { id: 'appointments', label: t.nav.appointments, icon: <Calendar className="w-5 h-5" /> },
    {
      id: 'notifications',
      label: t.nav.notifications,
      icon: <Bell className="w-5 h-5" />,
      badge: unreadNotificationsCount,
    },
    { id: 'profile', label: t.nav.profile, icon: <User className="w-5 h-5" /> },
  ];

  const handleNavClick = (tabId: TabType) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 rtl:translate-x-full rtl:lg:translate-x-0'
        }`}
      >
        {/* Top App Identity */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
            <div
              onClick={() => handleNavClick('welcome')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-xs">
                <div className="w-3.5 h-3.5 bg-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                  SugarCare AI
                </h1>
                <p className="text-[11px] text-slate-400 font-medium mt-1">
                  {language === 'ar' ? 'رفيق السكري الذكي' : 'Smart Health Companion'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Items List */}
          <nav className="flex-1 px-4 py-3 space-y-1 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 py-2">
              {language === 'ar' ? 'القائمة الرئيسية' : 'Menu'}
            </div>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && item.badge > 0 ? (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom AI Assistant Card & User Profile */}
        <div className="p-4 space-y-3 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-blue-600 rounded-xl p-4 text-white text-sm shadow-sm text-start">
            <div className="flex items-center gap-2 mb-1">
              <Bot className="w-4 h-4 text-blue-200" />
              <p className="font-semibold text-xs text-white">
                {language === 'ar' ? 'مساعد SugarCare' : 'SugarCare Assistant'}
              </p>
            </div>
            <p className="text-blue-100/90 text-xs mb-3">
              {language === 'ar' ? 'اسأل عن تحليلاتك وسجلك اليومي.' : 'Ask me about your trends.'}
            </p>
            <button
              onClick={() => {
                setIsAssistantModalOpen(true);
                onCloseMobile();
              }}
              className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg transition-colors text-xs font-medium text-white flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{language === 'ar' ? 'بدء المحادثة' : 'Open Chat'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div
              onClick={() => handleNavClick('profile')}
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition"
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-bold shrink-0">
                {profile.name ? profile.name.charAt(0) : 'M'}
              </div>
              <div className="text-start">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                  {profile.name || 'Mohamed'}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleNavClick('welcome')}
              className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg transition"
              title={t.app.backToWelcome}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};


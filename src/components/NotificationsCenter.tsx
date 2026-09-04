import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCheck,
  Trash2,
  Pill,
  Activity,
  Calendar,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { DisclaimerBanner } from './DisclaimerBanner';

export const NotificationsCenter: React.FC = () => {
  const {
    t,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    unreadNotificationsCount,
    setActiveTab,
    isRtl,
    language,
  } = useApp();

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <Pill className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'glucose_check':
        return <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case 'appointment':
        return <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'insight':
        return <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-1">
            <Bell className="w-5 h-5" />
            <h2 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
              {t.notifications.title}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.notifications.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadNotificationsCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="px-3.5 py-2 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              <span>{t.notifications.markAllRead}</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t.notifications.clearAll}</span>
            </button>
          )}
        </div>
      </div>

      <DisclaimerBanner full={false} />

      {/* Notifications List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs text-start">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          {language === 'ar' ? 'سجل الإشعارات والتنبيهات اليومية' : 'Daily Notifications & Alert Logs'} ({notifications.length})
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              {t.notifications.noNotifications}
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`py-4 px-3 rounded-xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  !notif.isRead ? 'bg-teal-50/40 dark:bg-teal-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    {getNotifIcon(notif.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{notif.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {notif.actionTab && (
                    <button
                      onClick={() => {
                        markNotificationRead(notif.id);
                        setActiveTab(notif.actionTab!);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>{language === 'ar' ? 'انتقال للقسم' : 'Open Section'}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                    </button>
                  )}

                  {!notif.isRead && (
                    <button
                      onClick={() => markNotificationRead(notif.id)}
                      className="p-1.5 text-slate-400 hover:text-teal-600 rounded-lg transition"
                      title={t.notifications.markRead}
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

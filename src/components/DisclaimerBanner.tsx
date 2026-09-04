import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  full?: boolean;
}

export const DisclaimerBanner: React.FC<Props> = ({ full = false }) => {
  const { t, language } = useApp();

  if (full) {
    return (
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-xl p-3.5 flex items-start gap-3 text-start shadow-xs">
        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-red-800 dark:text-red-300 uppercase tracking-wider">
            {language === 'ar' ? 'تنبيه طبي وأمان' : 'Safety Warning'}
          </p>
          <p className="text-[11px] text-red-700 dark:text-red-300/90 leading-relaxed">
            {t.app.disclaimerFull}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50/70 dark:bg-red-950/20 border border-red-100/80 dark:border-red-900/40 rounded-xl px-4 py-2.5 text-xs text-red-800 dark:text-red-300 flex items-center justify-between gap-2 shadow-xs">
      <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
        <ShieldCheck className="w-4 h-4 text-red-500 shrink-0" />
        <span className="truncate text-[11px] leading-tight font-medium">{t.app.disclaimerFull}</span>
      </div>
    </div>
  );
};


import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Activity,
  Pill,
  UtensilsCrossed,
  Sparkles,
  Bot,
} from 'lucide-react';
import { TabType } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsAssistantModalOpen, t } = useApp();

  const mobileTabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: t.nav.dashboard, icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'blood_sugar', label: t.nav.bloodSugar, icon: <Activity className="w-5 h-5" /> },
    { id: 'medications', label: t.nav.medications, icon: <Pill className="w-5 h-5" /> },
    { id: 'meals', label: t.nav.meals, icon: <UtensilsCrossed className="w-5 h-5" /> },
    { id: 'ai_insights', label: t.nav.aiInsights, icon: <Sparkles className="w-5 h-5" /> },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {mobileTabs.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center p-1 rounded-lg text-[10px] font-medium transition flex-1 cursor-pointer ${
              isActive
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-blue-50 dark:bg-blue-950/60' : ''}`}>
              {item.icon}
            </div>
            <span className="truncate max-w-[60px]">{item.label}</span>
          </button>
        );
      })}

      {/* Quick AI Floating trigger in BottomNav */}
      <button
        onClick={() => setIsAssistantModalOpen(true)}
        className="flex flex-col items-center justify-center p-1 text-blue-600 dark:text-blue-400 font-medium text-[10px] cursor-pointer"
      >
        <div className="p-1.5 rounded-full bg-blue-600 text-white shadow-xs">
          <Bot className="w-4 h-4" />
        </div>
        <span>AI</span>
      </button>
    </div>
  );
};

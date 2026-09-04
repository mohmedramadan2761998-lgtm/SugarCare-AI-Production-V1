import React, { useState } from 'react';
import { useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import AuthPage from './components/AuthPage';
import { AppProvider, useApp } from './context/AppContext';
import { WelcomePage } from './components/WelcomePage';
import { ProfileSetup } from './components/ProfileSetup';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { BloodSugarTracking } from './components/BloodSugarTracking';
import { MedicationsTracking } from './components/MedicationsTracking';
import { MealsTracking } from './components/MealsTracking';
import { ActivityTracking } from './components/ActivityTracking';
import { WeightTracking } from './components/WeightTracking';
import { AIInsights } from './components/AIInsights';
import { Reports } from './components/Reports';
import { Appointments } from './components/Appointments';
import { NotificationsCenter } from './components/NotificationsCenter';
import { UserProfile } from './components/UserProfile';
import { AIAssistantModal } from './components/AIAssistantModal';
import { AddReadingModal } from './components/AddReadingModal';

const MainLayout: React.FC = () => {
  const { activeTab, profile, isAddReadingModalOpen, setIsAddReadingModalOpen } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If on welcome page
  if (activeTab === 'welcome') {
    return <WelcomePage />;
  }

  // If on profile setup or profile is not yet completed and user navigated away from welcome
  if (activeTab === 'setup' || (!profile.name && !profile.isSetupComplete)) {
    return <ProfileSetup />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'blood_sugar':
        return <BloodSugarTracking />;
      case 'medications':
        return <MedicationsTracking />;
      case 'meals':
        return <MealsTracking />;
      case 'activity':
        return <ActivityTracking />;
      case 'weight':
        return <WeightTracking />;
      case 'ai_insights':
        return <AIInsights />;
      case 'reports':
        return <Reports />;
      case 'appointments':
        return <Appointments />;
      case 'notifications':
        return <NotificationsCenter />;
      case 'profile':
        return <UserProfile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {renderActiveTab()}
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>

      {/* Global Add Glucose Reading Modal */}
      <AddReadingModal
        isOpen={isAddReadingModalOpen}
        onClose={() => setIsAddReadingModalOpen(false)}
      />

      {/* SugarCare AI Assistant Chat Modal */}
      <AIAssistantModal />
    </div>
  );
};
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">جاري التحميل...</p>
      </div>
    );
  }
if (!user) {
  return <AuthPage />;
}

if (!user.emailVerified) {
  return <AuthPage />;
}

  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

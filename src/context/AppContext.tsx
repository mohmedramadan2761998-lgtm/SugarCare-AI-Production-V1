import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TabType,
  Language,
  Theme,
  GlucoseUnit,
  GlucoseReading,
  Medication,
  Meal,
  PhysicalActivity,
  WeightRecord,
  DoctorAppointment,
  NotificationItem,
  UserProfile,
  AIInsight,
  ChatMessage,
  DashboardStats,
} from '../types';
import {
  initialUserProfile,
  initialGlucoseReadings,
  initialMedications,
  initialMeals,
  initialActivities,
  initialWeightRecords,
  initialAppointments,
  initialNotifications,
  initialAIInsights,
} from '../data/demoData';
import { translations } from '../i18n/translations';
import { evaluateGlucoseReading } from '../utils/glucoseUtils';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  glucoseUnit: GlucoseUnit;
  setGlucoseUnit: (unit: GlucoseUnit) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  t: typeof translations.ar;
  isRtl: boolean;

  // Global Add Reading Modal trigger
  isAddReadingModalOpen: boolean;
  setIsAddReadingModalOpen: (open: boolean) => void;

  // Data collections
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  readings: GlucoseReading[];
  addReading: (reading: Omit<GlucoseReading, 'id'>) => void;
  updateReading: (id: string, reading: Partial<GlucoseReading>) => void;
  deleteReading: (id: string) => void;

  medications: Medication[];
  addMedication: (med: Omit<Medication, 'id'>) => void;
  updateMedication: (id: string, med: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  toggleMedicationTaken: (id: string) => void;

  meals: Meal[];
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  updateMeal: (id: string, meal: Partial<Meal>) => void;
  deleteMeal: (id: string) => void;

  activities: PhysicalActivity[];
  addActivity: (act: Omit<PhysicalActivity, 'id'>) => void;
  updateActivity: (id: string, act: Partial<PhysicalActivity>) => void;
  deleteActivity: (id: string) => void;

  weightRecords: WeightRecord[];
  addWeightRecord: (rec: Omit<WeightRecord, 'id'>) => void;
  deleteWeightRecord: (id: string) => void;

  appointments: DoctorAppointment[];
  addAppointment: (apt: Omit<DoctorAppointment, 'id'>) => void;
  updateAppointment: (id: string, apt: Partial<DoctorAppointment>) => void;
  deleteAppointment: (id: string) => void;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  unreadNotificationsCount: number;

  insights: AIInsight[];
  refreshInsights: () => Promise<void>;
  isGeneratingInsights: boolean;

  // Chat Assistant State
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => Promise<void>;
  isChatLoading: boolean;
  clearChatHistory: () => void;
  isAssistantModalOpen: boolean;
  setIsAssistantModalOpen: (open: boolean) => void;

  // Calculated Stats
  stats: DashboardStats;
  clearAllUserData: () => void;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence state
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('sugarcare_lang') as Language) || 'ar';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('sugarcare_theme') as Theme) || 'light';
  });

  const [glucoseUnit, setGlucoseUnit] = useState<GlucoseUnit>('mg/dL');

  // Core Data States
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sugarcare_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.name === 'string') {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved profile', e);
      }
    }
    return initialUserProfile;
  });

  // Active Tab: If profile not setup, default to 'welcome' or 'setup'
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const savedProfile = localStorage.getItem('sugarcare_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed?.name?.trim() && parsed?.isSetupComplete) {
          return 'dashboard';
        }
      } catch (e) {
        // ignore
      }
    }
    return 'welcome';
  });

  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState<boolean>(false);
  const [isAddReadingModalOpen, setIsAddReadingModalOpen] = useState<boolean>(false);

  const [readings, setReadings] = useState<GlucoseReading[]>(() => {
    const saved = localStorage.getItem('sugarcare_readings');
    return saved ? JSON.parse(saved) : initialGlucoseReadings;
  });

  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('sugarcare_medications');
    return saved ? JSON.parse(saved) : initialMedications;
  });

  const [meals, setMeals] = useState<Meal[]>(() => {
    const saved = localStorage.getItem('sugarcare_meals');
    return saved ? JSON.parse(saved) : initialMeals;
  });

  const [activities, setActivities] = useState<PhysicalActivity[]>(() => {
    const saved = localStorage.getItem('sugarcare_activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(() => {
    const saved = localStorage.getItem('sugarcare_weights');
    return saved ? JSON.parse(saved) : initialWeightRecords;
  });

  const [appointments, setAppointments] = useState<DoctorAppointment[]>(() => {
    const saved = localStorage.getItem('sugarcare_appointments');
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('sugarcare_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [insights, setInsights] = useState<AIInsight[]>(() => {
    const saved = localStorage.getItem('sugarcare_insights');
    return saved ? JSON.parse(saved) : initialAIInsights;
  });

  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-1',
      role: 'assistant',
      text:
        language === 'ar'
          ? 'مرحباً بك! أنا مساعدك الذكي SugarCare AI. كيف يمكنني مساعدتك اليوم في متابعة سكرك وفهم مؤشراتك الصحية؟'
          : 'Welcome! I am your SugarCare AI Assistant. How can I help you today with your glucose tracking and health insights?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Sync UI preferences and user data to localStorage
  useEffect(() => {
    localStorage.setItem('sugarcare_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    localStorage.setItem('sugarcare_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('sugarcare_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('sugarcare_readings', JSON.stringify(readings));
  }, [readings]);

  useEffect(() => {
    localStorage.setItem('sugarcare_medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem('sugarcare_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('sugarcare_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('sugarcare_weights', JSON.stringify(weightRecords));
  }, [weightRecords]);

  useEffect(() => {
    localStorage.setItem('sugarcare_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('sugarcare_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sugarcare_insights', JSON.stringify(insights));
  }, [insights]);

  const [isFirestoreReady, setIsFirestoreReady] = useState(false);
useEffect(() => {
  let cancelled = false;

  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setIsFirestoreReady(false);

    if (!currentUser || !currentUser.emailVerified) {
      if (!cancelled) {
        setProfile({ ...initialUserProfile });
        setReadings([]);
        setMedications([]);
        setMeals([]);
        setActivities([]);
        setWeightRecords([]);
        setAppointments([]);
        setNotifications([]);
        setInsights([]);
        setActiveTab('welcome');
      }
      return;
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnapshot = await getDoc(userRef);

      if (cancelled) return;

      if (userSnapshot.exists()) {
        const data = userSnapshot.data();

        setProfile(data.profile || { ...initialUserProfile });
        setReadings(Array.isArray(data.readings) ? data.readings : []);
        setMedications(Array.isArray(data.medications) ? data.medications : []);
        setMeals(Array.isArray(data.meals) ? data.meals : []);
        setActivities(Array.isArray(data.activities) ? data.activities : []);
        setWeightRecords(Array.isArray(data.weightRecords) ? data.weightRecords : []);
        setAppointments(Array.isArray(data.appointments) ? data.appointments : []);
        setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
        setInsights(Array.isArray(data.insights) ? data.insights : []);

        if (data.profile?.name?.trim() && data.profile?.isSetupComplete) {
          setActiveTab('dashboard');
        } else {
          setActiveTab('welcome');
        }

        console.log('SugarCare data loaded from Firestore.');
      } else {
        const migrationOwnerKey = 'sugarcare_migration_owner_uid';
        const migrationOwnerUid = localStorage.getItem(migrationOwnerKey);

        if (!migrationOwnerUid) {
          await setDoc(userRef, {
            profile,
            readings,
            medications,
            meals,
            activities,
            weightRecords,
            appointments,
            notifications,
            insights,
            migratedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          localStorage.setItem(migrationOwnerKey, currentUser.uid);

          console.log('Local SugarCare data safely migrated to Firestore.');
        } else {
          const emptyProfile = { ...initialUserProfile };

          await setDoc(userRef, {
            profile: emptyProfile,
            readings: [],
            medications: [],
            meals: [],
            activities: [],
            weightRecords: [],
            appointments: [],
            notifications: [],
            insights: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          setProfile(emptyProfile);
          setReadings([]);
          setMedications([]);
          setMeals([]);
          setActivities([]);
          setWeightRecords([]);
          setAppointments([]);
          setNotifications([]);
          setInsights([]);
          setActiveTab('welcome');

          console.log('New SugarCare Firestore profile created.');
        }
      }

      if (!cancelled) {
        setIsFirestoreReady(true);
      }
    } catch (error) {
      console.error('Failed to initialize SugarCare Firestore data:', error);
    }
  });

  return () => {
    cancelled = true;
    unsubscribe();
  };
}, []);
  useEffect(() => {
    if (!isFirestoreReady) {
      return;
    }

    const currentUser = auth.currentUser;

    if (!currentUser || !currentUser.emailVerified) {
      return;
    }

    const syncUserDataToFirestore = async () => {
      try {
        const userRef = doc(db, 'users', currentUser.uid);

        await setDoc(
          userRef,
          {
            profile,
            readings,
            medications,
            meals,
            activities,
            weightRecords,
            appointments,
            notifications,
            insights,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Failed to sync SugarCare data to Firestore:', error);
      }
    };

    syncUserDataToFirestore();
  }, [
    isFirestoreReady,
    profile,
    readings,
    medications,
    meals,
    activities,
    weightRecords,
    appointments,
    notifications,
    insights,
  ]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isRtl = language === 'ar';
  const t = translations[language];

  // Helper calculations for Dashboard stats from REAL user data
  const calculateStats = (): DashboardStats => {
    // Sort readings by date and time descending
    const sorted = [...readings].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });

    const latest = sorted[0] || null;

    // Today's readings
    const todayStr = new Date().toISOString().split('T')[0];
    const todayReadings = readings.filter((r) => r.date === todayStr);

    // 7-day readings
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const readings7d = readings.filter((r) => new Date(r.date) >= sevenDaysAgo);

    const values7d = readings7d.map((r) => r.value);
    const avg7d =
      values7d.length > 0 ? Math.round(values7d.reduce((a, b) => a + b, 0) / values7d.length) : 0;

    const allValues = readings.map((r) => r.value);
    const highest = allValues.length > 0 ? Math.max(...allValues) : 0;
    const lowest = allValues.length > 0 ? Math.min(...allValues) : 0;

    // Time In Range (TIR) - evaluated against each reading's specific measurement type target range
    const configuredReadings = readings.filter(
      (r) => evaluateGlucoseReading(r.value, r.type, profile.targetRanges).isConfigured
    );
    const inRangeCount = readings.filter(
      (r) => evaluateGlucoseReading(r.value, r.type, profile.targetRanges).status === 'in_range'
    ).length;
    const denominator = configuredReadings.length > 0 ? configuredReadings.length : readings.length;
    const tir = denominator > 0 ? Math.round((inRangeCount / denominator) * 100) : 0;

    // Medication adherence
    const takenCount = medications.filter((m) => m.takenToday).length;
    const medAdherence =
      medications.length > 0 ? Math.round((takenCount / medications.length) * 100) : 0;

    // Next scheduled medication
    const untakenMeds = medications.filter((m) => !m.takenToday);
    const nextMed = untakenMeds[0] || medications[0] || null;

    // Today's activity
    const todayActs = activities.filter((a) => a.date === todayStr);
    const todayMins = todayActs.reduce((acc, curr) => acc + curr.duration, 0);
    const todaySteps = todayActs.reduce((acc, curr) => acc + (curr.steps || 0), 0);

    // Current weight & delta
    const sortedWeights = [...weightRecords].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const currentWeight = sortedWeights[0]?.weight || profile.weight || 0;
    const prevWeight = sortedWeights[1]?.weight || currentWeight;
    const weightDelta = Number((currentWeight - prevWeight).toFixed(1));

    return {
      latestReading: latest,
      averageGlucose7d: avg7d,
      highestGlucose: highest,
      lowestGlucose: lowest,
      todayReadingsCount: todayReadings.length,
      nextMedication: nextMed,
      todayActivityMinutes: todayMins,
      todaySteps: todaySteps,
      currentWeight,
      weightChange: weightDelta,
      inRangePercentage: tir,
      medicationAdherence: medAdherence,
    };
  };

  const stats = calculateStats();

  // CRUD Operations
  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...newProfile }));
  };

  const addReading = (reading: Omit<GlucoseReading, 'id'>) => {
    const newReading: GlucoseReading = {
      ...reading,
      id: `g-${Date.now()}`,
    };
    setReadings((prev) => [newReading, ...prev]);

    // Add alert notification if reading is high
    if (reading.value > 180) {
      const alertNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: 'glucose_check',
        title: language === 'ar' ? 'تنبيه قراءة مرتفعة' : 'Elevated Glucose Alert',
        message:
          language === 'ar'
            ? `سجلت قراءة مرتفعة (${reading.value} ملغ/ديسيلتر). اشرب الماء ومارس بعض المشي الخفيف واستشر طبيبك عند تكرار الارتفاع.`
            : `Elevated reading recorded (${reading.value} mg/dL). Stay hydrated and consult your physician if elevations persist.`,
        date: reading.date,
        time: reading.time,
        isRead: false,
        actionTab: 'blood_sugar',
      };
      setNotifications((prev) => [alertNotif, ...prev]);
    }
  };

  const updateReading = (id: string, updated: Partial<GlucoseReading>) => {
    setReadings((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
  };

  const deleteReading = (id: string) => {
    setReadings((prev) => prev.filter((r) => r.id !== id));
  };

  const addMedication = (med: Omit<Medication, 'id'>) => {
    const newMed: Medication = {
      ...med,
      id: `med-${Date.now()}`,
      takenToday: false,
      adherenceStreak: 0,
    };
    setMedications((prev) => [...prev, newMed]);
  };

  const updateMedication = (id: string, updated: Partial<Medication>) => {
    setMedications((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)));
  };

  const deleteMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleMedicationTaken = (id: string) => {
    setMedications((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextTaken = !m.takenToday;
          return {
            ...m,
            takenToday: nextTaken,
            adherenceStreak: nextTaken ? m.adherenceStreak + 1 : Math.max(0, m.adherenceStreak - 1),
          };
        }
        return m;
      })
    );
  };

  const addMeal = (meal: Omit<Meal, 'id'>) => {
    const newMeal: Meal = {
      ...meal,
      id: `meal-${Date.now()}`,
    };
    setMeals((prev) => [newMeal, ...prev]);
  };

  const updateMeal = (id: string, updated: Partial<Meal>) => {
    setMeals((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)));
  };

  const deleteMeal = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const addActivity = (act: Omit<PhysicalActivity, 'id'>) => {
    const newAct: PhysicalActivity = {
      ...act,
      id: `act-${Date.now()}`,
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const updateActivity = (id: string, updated: Partial<PhysicalActivity>) => {
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  const addWeightRecord = (rec: Omit<WeightRecord, 'id'>) => {
    const newRec: WeightRecord = {
      ...rec,
      id: `w-${Date.now()}`,
    };
    setWeightRecords((prev) => [newRec, ...prev]);
    setProfile((prev) => ({ ...prev, weight: rec.weight }));
  };

  const deleteWeightRecord = (id: string) => {
    setWeightRecords((prev) => prev.filter((w) => w.id !== id));
  };

  const addAppointment = (apt: Omit<DoctorAppointment, 'id'>) => {
    const newApt: DoctorAppointment = {
      ...apt,
      id: `apt-${Date.now()}`,
    };
    setAppointments((prev) => [newApt, ...prev]);
  };

  const updateAppointment = (id: string, updated: Partial<DoctorAppointment>) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const refreshInsights = async () => {
    setIsGeneratingInsights(true);
    try {
      const payload = {
        language,
        userContext: {
          profile,
          recentReadings: readings.slice(0, 15),
          stats,
          medications,
          meals: meals.slice(0, 8),
          activities: activities.slice(0, 8),
          weightRecords: weightRecords.slice(0, 5),
        },
      };

      const res = await fetch('/api/generate-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.insights && Array.isArray(data.insights)) {
          setInsights(data.insights);
        }
      }
    } catch (err) {
      console.error('Error refreshing insights:', err);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const sendChatMessage = async (text: string) => {
    if (!text.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const payload = {
        message: text,
        history: chatMessages.slice(-6),
        language,
        userContext: {
          profile,
          recentReadings: readings.slice(0, 15),
          stats,
          medications,
          meals: meals.slice(0, 6),
          activities: activities.slice(0, 6),
          weightRecords: weightRecords.slice(0, 4),
        },
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        text:
          data.reply ||
          (language === 'ar'
            ? 'شكراً لتسجيل بياناتك. حافظ على قياساتك المنتظمة واستشر طبيبك لأي تعديل علاجي.'
            : 'Thank you for logging your data. Keep monitoring regularly and consult your physician for medical decisions.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        text:
          language === 'ar'
            ? 'عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.'
            : 'Sorry, an error occurred while processing your request. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const clearChatHistory = () => {
    setChatMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        text:
          language === 'ar'
            ? 'تم بدء محادثة جديدة. كيف يمكنني مساعدتك اليوم؟'
            : 'Chat reset. How can I assist you with your health companion today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const clearAllUserData = () => {
    try {
      localStorage.removeItem('sugarcare_profile');
      localStorage.removeItem('sugarcare_readings');
      localStorage.removeItem('sugarcare_medications');
      localStorage.removeItem('sugarcare_meals');
      localStorage.removeItem('sugarcare_activities');
      localStorage.removeItem('sugarcare_weights');
      localStorage.removeItem('sugarcare_appointments');
      localStorage.removeItem('sugarcare_notifications');
      localStorage.removeItem('sugarcare_insights');
      
      // Wipe any other sugarcare related storage items
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('sugarcare_') && key !== 'sugarcare_lang' && key !== 'sugarcare_theme') {
          localStorage.removeItem(key);
        }
      });
      sessionStorage.clear();
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }

    setProfile({ ...initialUserProfile });
    setReadings([]);
    setMedications([]);
    setMeals([]);
    setActivities([]);
    setWeightRecords([]);
    setAppointments([]);
    setNotifications([]);
    setInsights([]);
    setChatMessages([
      {
        id: 'init-1',
        role: 'assistant',
        text:
          language === 'ar'
            ? 'مرحباً بك! أنا مساعدك الذكي SugarCare AI. كيف يمكنني مساعدتك اليوم في متابعة سكرك وفهم مؤشراتك الصحية؟'
            : 'Welcome! I am your SugarCare AI Assistant. How can I help you today with your glucose tracking and health insights?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setActiveTab('setup');
  };

  const resetToDemoData = () => {
    clearAllUserData();
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        toggleTheme,
        glucoseUnit,
        setGlucoseUnit,
        activeTab,
        setActiveTab,
        t,
        isRtl,
        isAddReadingModalOpen,
        setIsAddReadingModalOpen,
        profile,
        updateProfile,
        readings,
        addReading,
        updateReading,
        deleteReading,
        medications,
        addMedication,
        updateMedication,
        deleteMedication,
        toggleMedicationTaken,
        meals,
        addMeal,
        updateMeal,
        deleteMeal,
        activities,
        addActivity,
        updateActivity,
        deleteActivity,
        weightRecords,
        addWeightRecord,
        deleteWeightRecord,
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        unreadNotificationsCount,
        insights,
        refreshInsights,
        isGeneratingInsights,
        chatMessages,
        sendChatMessage,
        isChatLoading,
        clearChatHistory,
        isAssistantModalOpen,
        setIsAssistantModalOpen,
        stats,
        clearAllUserData,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

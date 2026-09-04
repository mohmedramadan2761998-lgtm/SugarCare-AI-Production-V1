export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';
export type GlucoseUnit = 'mg/dL' | 'mmol/L';

export type TabType =
  | 'welcome'
  | 'setup'
  | 'dashboard'
  | 'blood_sugar'
  | 'medications'
  | 'meals'
  | 'activity'
  | 'weight'
  | 'ai_insights'
  | 'reports'
  | 'appointments'
  | 'notifications'
  | 'profile';

export type MeasurementType =
  | 'fasting'
  | 'before_meal'
  | 'after_meal'
  | 'before_bed'
  | 'random';

export interface GlucoseReading {
  id: string;
  value: number; // stored in mg/dL
  unit: GlucoseUnit;
  type: MeasurementType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes?: string;
  mealId?: string;
}

export type MedicationFrequency =
  | 'once_daily'
  | 'twice_daily'
  | 'thrice_daily'
  | 'with_meals'
  | 'before_bed'
  | 'as_needed';

export interface Medication {
  id: string;
  name: string;
  dose: string; // e.g., '500 mg'
  time: string; // HH:mm or schedule description
  frequency: MedicationFrequency;
  notes?: string;
  takenToday: boolean;
  adherenceStreak: number; // in days
  historyLogs?: { date: string; taken: boolean; time: string }[];
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal {
  id: string;
  type: MealType;
  name: string;
  date: string;
  time: string;
  carbs: number; // grams
  calories?: number;
  notes?: string;
}

export type ActivityType =
  | 'walking'
  | 'running'
  | 'cycling'
  | 'exercise'
  | 'swimming'
  | 'yoga'
  | 'other';

export interface PhysicalActivity {
  id: string;
  type: ActivityType;
  duration: number; // minutes
  steps?: number;
  caloriesBurned?: number;
  calories?: number;
  date: string;
  time: string;
  notes?: string;
}

export interface WeightRecord {
  id: string;
  weight: number; // kg
  date: string;
  notes?: string;
}

export interface DoctorAppointment {
  id: string;
  doctorName: string;
  clinic: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:mm
  notes?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  questionsForDoctor?: string[];
}

export type NotificationType =
  | 'medication'
  | 'glucose_check'
  | 'appointment'
  | 'daily_summary'
  | 'insight';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  date: string;
  isRead: boolean;
  actionTab?: TabType;
}

export type DiabetesType = 'type_1' | 'type_2' | 'lada' | 'gestational' | 'other';

export interface GlucoseTargetRange {
  min?: number;
  max?: number;
}

export type GlucoseTargetRanges = {
  fasting?: GlucoseTargetRange;
  before_meal?: GlucoseTargetRange;
  after_meal?: GlucoseTargetRange;
  random?: GlucoseTargetRange;
  before_bed?: GlucoseTargetRange;
};

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  diabetesType: DiabetesType;
  height: number; // cm
  weight: number; // kg
  targetMin: number; // legacy default
  targetMax: number; // legacy default
  targetRanges?: GlucoseTargetRanges; // Per-measurement-type customizable ranges
  doctorName: string;
  doctorClinic: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  isSetupComplete?: boolean;
}

export interface AIInsight {
  id: string;
  category: 'glucose_stability' | 'nutrition_impact' | 'medication_adherence' | 'physical_activity';
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'info';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}

export interface DashboardStats {
  latestReading: GlucoseReading | null;
  averageGlucose7d: number;
  highestGlucose: number;
  lowestGlucose: number;
  todayReadingsCount: number;
  nextMedication: Medication | null;
  todayActivityMinutes: number;
  todaySteps: number;
  currentWeight: number;
  weightChange: number;
  inRangePercentage: number;
  medicationAdherence: number;
}

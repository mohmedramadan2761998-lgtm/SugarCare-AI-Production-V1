import {
  GlucoseReading,
  Medication,
  Meal,
  PhysicalActivity,
  WeightRecord,
  DoctorAppointment,
  NotificationItem,
  UserProfile,
  AIInsight,
} from '../types';

export const initialUserProfile: UserProfile = {
  name: '',
  age: 0,
  gender: 'other',
  diabetesType: 'type_2',
  height: 0,
  weight: 0,
  targetMin: 70,
  targetMax: 140,
  targetRanges: {
    fasting: { min: 70, max: 130 },
    before_meal: { min: 70, max: 130 },
    after_meal: { min: 70, max: 180 },
    random: { min: 70, max: 140 },
    before_bed: { min: 100, max: 140 },
  },
  doctorName: '',
  doctorClinic: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelationship: '',
  isSetupComplete: false,
};

export const initialGlucoseReadings: GlucoseReading[] = [];
export const initialMedications: Medication[] = [];
export const initialMeals: Meal[] = [];
export const initialActivities: PhysicalActivity[] = [];
export const initialWeightRecords: WeightRecord[] = [];
export const initialAppointments: DoctorAppointment[] = [];
export const initialNotifications: NotificationItem[] = [];
export const initialAIInsights: AIInsight[] = [];

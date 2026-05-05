export enum SymptomLevel {
  NONE = 'none',
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe'
}

export type TrackingMode = 'basic' | 'standard' | 'advanced';

export interface PatientProfile {
  id: string; // usually 'me'
  name?: string;
  dob?: string;
  weightBaseline?: number;
  weightAlertThreshold24h: number; // default 2
  weightAlertThreshold7d: number; // default 5
  sbpThresholdLow?: number; // e.g. 90
  hrThresholdHigh?: number; // e.g. 110
  trackingMode: TrackingMode;
  createdAt: string;
  updatedAt: string;
}

export interface DayLog {
  id?: number; // Dexie auto-increment
  date: string; // ISO yyyy-mm-dd
  createdAt: string;
  updatedAt: string;
  source: 'patient' | 'caregiver' | 'clinician';
  
  // Basic Mode
  weight?: number;
  breathing: 'better' | 'same' | 'worse';
  swelling: SymptomLevel;
  tookMeds: boolean;
  concernToday: boolean;
  notes?: string;

  // Standard Mode
  sbp?: number;
  dbp?: number;
  heartRate?: number;
  dyspneaScore?: number; // 0-4
  orthopneaPillows?: number;
  pnd?: boolean;
  fatigueScore?: number; // 0-4
  dizziness?: boolean;
  chestPain?: boolean;
  sodiumEstimate?: 'low' | 'moderate' | 'high' | 'unknown';
  fluidEstimateMl?: number;

  // Advanced Mode (FACETS)
  facets?: {
    activity: {
      baseline: 'normal' | 'less_than_usual' | 'mostly_chair' | 'bedbound';
      walkingTolerance?: string;
    };
    congestion: {
      cough: boolean;
    };
    treatment: {
      missedDiuretic: boolean;
      extraDiureticTaken: boolean;
    };
    safety: {
      syncope: boolean;
      severeSobAtRest: boolean;
      confusion: boolean;
    };
  };
}

export type MedClass = 
  | 'ARNI' | 'ACEi' | 'ARB' | 'Beta Blocker' 
  | 'MRA' | 'SGLT2i' | 'Loop Diuretic' | 'Thiazide-like Diuretic' 
  | 'Hydralazine/Nitrate' | 'Digoxin' | 'Potassium' | 'Other';

export interface Medication {
  id: string;
  name: string;
  medClass: MedClass;
  dosage: string;
  route: string;
  frequency: string;
  purpose: string;
  warnings: string;
  isHFMed: boolean;
  startDate: string;
  stopDate?: string;
  prescriber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdherenceLog {
  id?: number;
  medicationId: string;
  date: string;
  status: 'taken' | 'missed' | 'skipped' | 'partial';
  timestamp: string;
}

export interface Article {
  id: string;
  title: string;
  category: 'Diagnosis' | 'Management' | 'Lifestyle' | 'Advanced Planning';
  summary: string;
  points: string[];
  content: string; // Markdown
  versionDate: string;
  sources?: string[];
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  organization?: string;
  phone: string;
  afterHoursPhone?: string;
  email?: string;
  portalUrl?: string;
  isEmergency?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  id: string; // 'global'
  theme: 'light' | 'dark' | 'sepia';
  highContrast: boolean;
  reducedMotion: boolean;
  plainLanguage: boolean;
  caregiverMode: boolean;
}

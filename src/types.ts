export enum SymptomLevel {
  NONE = 'none',
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe'
}

export type TrackingMode = 'basic' | 'standard' | 'advanced';

export interface PatientProfile {
  id: string; // 'me'
  name?: string;
  dob?: string;
  clinicName?: string;
  triageNumber?: string;
  weightBaseline?: number;
  weightAlertThreshold24h: number; 
  weightAlertThreshold7d: number; 
  sbpThresholdLow: number; 
  sbpThresholdHigh: number;
  hrThresholdLow: number;
  hrThresholdHigh: number;
  units: 'lb' | 'kg';
  trackingMode: TrackingMode;
  createdAt: string;
  updatedAt: string;
}

export interface DayLog {
  id?: number;
  date: string; // ISO yyyy-mm-dd (Unique for source)
  timestamp: string; // Full ISO
  createdAt: string;
  updatedAt: string;
  source: 'patient' | 'caregiver' | 'clinician';
  timezone: string;
  
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
  dyspneaScore?: number; 
  orthopneaPillows?: number;
  pnd?: boolean;
  fatigueScore?: number; 
  dizziness?: boolean;
  chestPain?: boolean;
  syncope?: boolean;
  severeSobAtRest?: boolean;
  confusion?: boolean;
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
  isActive: boolean;
  startDate: string;
  stopDate?: string;
  stopReason?: string;
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

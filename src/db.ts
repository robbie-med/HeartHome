import Dexie, { type Table } from 'dexie';
import { 
  PatientProfile, 
  DayLog, 
  Medication, 
  AdherenceLog, 
  Article, 
  Contact, 
  AppSettings 
} from './types';

export class HeartHomeDB extends Dexie {
  patientProfile!: Table<PatientProfile>;
  dailyLogs!: Table<DayLog>;
  medications!: Table<Medication>;
  adherenceLogs!: Table<AdherenceLog>;
  articles!: Table<Article>;
  contacts!: Table<Contact>;
  settings!: Table<AppSettings>;

  constructor() {
    super('HeartHomeDB');
    this.version(1).stores({
      patientProfile: 'id',
      dailyLogs: '++id, date, source',
      medications: 'id, name, medClass',
      adherenceLogs: '++id, medicationId, date',
      articles: 'id, category',
      contacts: 'id, name, isEmergency',
      settings: 'id',
      auditLog: '++id, timestamp',
      exportHistory: '++id, timestamp'
    });
  }
}

export const db = new HeartHomeDB();

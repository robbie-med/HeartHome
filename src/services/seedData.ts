import { Article, Medication, PatientProfile } from '../types';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'intro',
    title: 'What is Heart Failure?',
    category: 'Diagnosis',
    summary: 'Understanding the basics of heart rhythm and function.',
    points: ['HF means your heart isn\'t pumping as well as it should.', 'It is a manageable chronic condition.', 'Routine is key to success.'],
    content: `Heart failure does not mean your heart has stopped. It means your heart is not pumping blood as well as it should be. 

Your body relies on the heart's pumping action to deliver nutrient-rich and oxygen-rich blood to the body's cells. When the cells are not nourished properly, the body may not function properly. 

As the heart's pumping action weakens, it may lead to:
* Shortness of breath (dyspnea)
* Fatigue
* Swelling (edema) in the ankles, feet, legs, abdomen, and veins in the neck.`,
    versionDate: '2024-05-01'
  },
  {
    id: 'weights',
    title: 'Why Daily Weights Matter',
    category: 'Management',
    summary: 'The simplest way to detect fluid buildup early.',
    points: ['Weight gain is fluid gain.', 'Detecting change early prevents hospitalization.', 'Goal: 2 lb in a day or 5 lb in a week.'],
    content: `For patients with heart failure, weight gain is the first sign of fluid buildup. 

Fluid buildup (congestion) can happen before you feel short of breath or notice swelling. By tracking your weight every morning, you can catch fluid buildup early and call your care team for a simple dose adjustment of your "water pill" (diuretic).

**How to Weigh Yourself:**
1. Every morning after using the bathroom.
2. Before eating or drinking.
3. Wearing the same amount of clothing.
4. Record it immediately in HeartHome.`,
    versionDate: '2024-05-01'
  },
  {
    id: 'facets-info',
    title: 'Understanding FACETS',
    category: 'Management',
    summary: 'The clinical model for heart failure rhythm.',
    points: ['F stands for Fatigue.', 'A stands for Activity tolerance.', 'C stands for Congestion/Cough.'],
    content: `FACETS is a memory tool to help you monitor your health:
* **F**atigue: Are you more tired than usual?
* **A**ctivity: Can you walk as far as you did yesterday?
* **C**ongestion: Do you have a new dry cough?
* **E**dema: Are your ankles or feet swelling?
* **T**hreshold: Have you crossed your weight alert line?
* **S**afety: Any dizziness or chest pain?`,
    versionDate: '2024-05-01'
  }
];

export const INITIAL_MEDS: Medication[] = [
  {
    id: 'arni-1',
    name: 'Entresto (Sacubitril/Valsartan)',
    medClass: 'ARNI',
    dosage: '49/51mg',
    route: 'Oral',
    frequency: 'Twice daily',
    purpose: 'The "foundation" pill that helps your heart pump better and reduces strain.',
    warnings: 'May cause dizziness or low blood pressure. Do not take with salt substitutes containing potassium.',
    isHFMed: true,
    startDate: '2026-01-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'beta-1',
    name: 'Carvedilol (Coreg)',
    medClass: 'Beta Blocker',
    dosage: '6.25mg',
    route: 'Oral',
    frequency: 'Twice daily with food',
    purpose: 'Slows heart rate and relaxes vessels to improve heart efficiency over time.',
    warnings: 'May lower blood pressure. Do not stop suddenly.',
    isHFMed: true,
    startDate: '2026-01-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mra-1',
    name: 'Spironolactone (Aldactone)',
    medClass: 'MRA',
    dosage: '25mg',
    route: 'Oral',
    frequency: 'Once daily',
    purpose: 'Reduces scarring in the heart and helps manage fluid.',
    warnings: 'Requires regular blood tests for potassium levels.',
    isHFMed: true,
    startDate: '2026-01-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sglt2i-1',
    name: 'Dapagliflozin (Farxiga)',
    medClass: 'SGLT2i',
    dosage: '10mg',
    route: 'Oral',
    frequency: 'Once daily',
    purpose: 'A newer "pillar" that helps the heart and kidneys work better together.',
    warnings: 'Ensure good hydration. Watch for signs of urinary infections.',
    isHFMed: true,
    startDate: '2026-01-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'loop-1',
    name: 'Furosemide (Lasix)',
    medClass: 'Loop Diuretic',
    dosage: '40mg',
    route: 'Oral',
    frequency: 'Once daily (morning)',
    purpose: 'The "water pill" that removes extra fluid from your body.',
    warnings: 'Will cause increased urination. Take in the morning to avoid waking up at night.',
    isHFMed: true,
    startDate: '2026-01-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const DEFAULT_PROFILE: PatientProfile = {
  id: 'me',
  weightAlertThreshold24h: 2,
  weightAlertThreshold7d: 5,
  trackingMode: 'basic',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

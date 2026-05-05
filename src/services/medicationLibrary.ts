import { MedClass } from '../types';

export interface LibraryMedication {
  name: string;
  medClass: MedClass;
  purpose: string;
  warnings: string;
  commonDoses: string[];
}

export const HF_MED_LIBRARY: LibraryMedication[] = [
  {
    name: 'Entresto (Sacubitril/Valsartan)',
    medClass: 'ARNI',
    purpose: 'The "foundation" pill that helps your heart pump better and reduces strain.',
    warnings: 'May cause dizziness or low blood pressure. Do not take with salt substitutes containing potassium.',
    commonDoses: ['24/26mg', '49/51mg', '97/103mg']
  },
  {
    name: 'Carvedilol (Coreg)',
    medClass: 'Beta Blocker',
    purpose: 'Slows heart rate and relaxes vessels to improve heart efficiency over time.',
    warnings: 'May lower blood pressure. Do not stop suddenly.',
    commonDoses: ['3.125mg', '6.25mg', '12.5mg', '25mg']
  },
  {
    name: 'Metoprolol Succinate (Toprol XL)',
    medClass: 'Beta Blocker',
    purpose: 'Slows heart rate and reduces the workload on the heart.',
    warnings: 'Take with or immediately following a meal.',
    commonDoses: ['25mg', '50mg', '100mg', '200mg']
  },
  {
    name: 'Spironolactone (Aldactone)',
    medClass: 'MRA',
    purpose: 'Reduces scarring in the heart and helps manage fluid.',
    warnings: 'Requires regular blood tests for potassium levels.',
    commonDoses: ['12.5mg', '25mg', '50mg']
  },
  {
    name: 'Dapagliflozin (Farxiga)',
    medClass: 'SGLT2i',
    purpose: 'A "pillar" that helps the heart and kidneys work better together.',
    warnings: 'Ensure good hydration. Watch for signs of urinary infections.',
    commonDoses: ['10mg']
  },
  {
    name: 'Empagliflozin (Jardiance)',
    medClass: 'SGLT2i',
    purpose: 'Helps your heart pump better and protects your kidneys.',
    warnings: 'Watch for signs of urinary tract infections.',
    commonDoses: ['10mg']
  },
  {
    name: 'Furosemide (Lasix)',
    medClass: 'Loop Diuretic',
    purpose: 'The "water pill" that removes extra fluid from your body.',
    warnings: 'Will cause increased urination. Take in the morning.',
    commonDoses: ['20mg', '40mg', '60mg', '80mg']
  },
  {
    name: 'Bumetanide (Bumex)',
    medClass: 'Loop Diuretic',
    purpose: 'Powerful water pill to reduce swelling and fluid.',
    warnings: 'Take early to avoid waking up at night to urinate.',
    commonDoses: ['0.5mg', '1mg', '2mg']
  },
  {
    name: 'Lisinopril (Zestril)',
    medClass: 'ACEi',
    purpose: 'Relaxes blood vessels and lowers blood pressure to reduce heart strain.',
    warnings: 'Call your doctor if you develop a persistent dry cough.',
    commonDoses: ['2.5mg', '5mg', '10mg', '20mg', '40mg']
  },
  {
    name: 'Losartan (Cozaar)',
    medClass: 'ARB',
    purpose: 'Alternative to ACE inhibitors to lower blood pressure and protect the heart.',
    warnings: 'Monitor your blood pressure regularly.',
    commonDoses: ['25mg', '50mg', '100mg']
  }
];

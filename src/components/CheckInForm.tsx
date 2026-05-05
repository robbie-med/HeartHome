import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db } from '../db';
import { SymptomLevel, TrackingMode } from '../types';
import { Check, AlertCircle, ArrowRight, Weight, Wind, Waves, Pill } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const checkInSchema = z.object({
  weight: z.number().optional(),
  breathing: z.enum(['better', 'same', 'worse']),
  swelling: z.nativeEnum(SymptomLevel),
  tookMeds: z.boolean(),
  concernToday: z.boolean(),
  notes: z.string().optional(),
  // Standard
  sbp: z.number().optional(),
  heartRate: z.number().optional(),
  dyspneaScore: z.number().min(0).max(4).optional(),
  orthopneaPillows: z.number().min(0).max(5).optional(),
  fatigueScore: z.number().min(0).max(4).optional(),
  // Advanced
  missedDiuretic: z.boolean().optional(),
  extraDiureticTaken: z.boolean().optional(),
});

type CheckInValues = z.infer<typeof checkInSchema>;

interface Props {
  mode: TrackingMode;
  onComplete: () => void;
}

export default function CheckInForm({ mode, onComplete }: Props) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckInValues>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      breathing: 'same',
      swelling: SymptomLevel.NONE,
      tookMeds: true,
      concernToday: false,
      missedDiuretic: false,
      extraDiureticTaken: false
    }
  });

  const onSubmit = async (data: CheckInValues) => {
    const today = new Date().toISOString().split('T')[0];
    await db.dailyLogs.add({
      date: today,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'patient',
      ...data
    });
    // Log Activity
    await db.auditLog.add({
      action: 'Daily check-in submitted',
      timestamp: new Date().toISOString()
    });
    onComplete();
  };

  const breathing = watch('breathing');
  const swelling = watch('swelling');
  const tookMeds = watch('tookMeds');
  const missedDiuretic = watch('missedDiuretic');
  const extraDiureticTaken = watch('extraDiureticTaken');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-1">
      {/* 60 Second Target: Tiered UI */}
      <div className="space-y-12">
        
        {/* Core: Weight (All modes) */}
        <section className="space-y-4">
          <label className="flex items-center gap-3 text-brand-dark">
            <div className="w-8 h-8 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green text-[10px] font-bold">1</div>
            <span className="font-serif text-xl">Morning Weight</span>
          </label>
          <div className="relative max-w-[200px]">
            <input 
              type="number" 
              step="0.1"
              placeholder="0.0"
              autoFocus
              {...register('weight', { valueAsNumber: true })}
              className="w-full text-4xl font-serif py-4 bg-transparent border-b-2 border-brand-beige focus:border-brand-green outline-none transition-colors"
            />
            <span className="absolute right-0 bottom-4 text-text-muted font-bold uppercase tracking-widest text-[10px]">lbs</span>
          </div>
        </section>

        {/* Standard/Advanced: Vitals */}
        {(mode === 'standard' || mode === 'advanced') && (
          <section className="grid grid-cols-2 gap-8 p-8 bg-bg-base rounded-[2.5rem] border border-brand-beige">
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Blood Pressure (Sys)</label>
                <input 
                  type="number" 
                  {...register('sbp', { valueAsNumber: true })}
                  className="w-full text-2xl font-serif bg-transparent border-b border-brand-beige focus:border-brand-green outline-none"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Heart Rate</label>
                <input 
                   type="number" 
                   {...register('heartRate', { valueAsNumber: true })}
                   className="w-full text-2xl font-serif bg-transparent border-b border-brand-beige focus:border-brand-green outline-none"
                />
             </div>
          </section>
        )}

        {/* Core: Breathing */}
        <section className="space-y-6">
          <label className="flex items-center gap-3 text-brand-dark">
            <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue text-[10px] font-bold">2</div>
            <span className="font-serif text-xl">How is your breathing?</span>
          </label>
          <div className="grid grid-cols-3 gap-4">
            {(['better', 'same', 'worse'] as const).map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setValue('breathing', option)}
                className={`p-4 rounded-2xl border-2 transition-all capitalize font-bold text-xs tracking-widest ${
                  breathing === option 
                    ? 'border-brand-green bg-brand-green/5 text-brand-green' 
                    : 'border-brand-beige bg-white text-text-muted hover:border-brand-green/30'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </section>

        {/* Core: Swelling */}
        <section className="space-y-6">
          <label className="flex items-center gap-3 text-brand-dark">
            <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent text-[10px] font-bold">3</div>
            <span className="font-serif text-xl">Any new swelling?</span>
          </label>
          <div className="grid grid-cols-4 gap-3">
            {[SymptomLevel.NONE, SymptomLevel.MILD, SymptomLevel.MODERATE, SymptomLevel.SEVERE].map(level => (
              <button
                key={level}
                type="button"
                onClick={() => setValue('swelling', level)}
                className={`p-3 rounded-xl border-2 transition-all capitalize text-[10px] font-bold tracking-tighter ${
                  swelling === level 
                    ? 'border-brand-green bg-brand-green/5 text-brand-green' 
                    : 'border-brand-beige bg-white text-text-muted'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </section>

        {/* Advanced: Diuretic Adjustment Tracking */}
        {mode === 'advanced' && (
          <section className="space-y-6 p-8 bg-brand-green/5 rounded-[2.5rem] border border-brand-green/10">
             <h4 className="text-[10px] font-bold text-brand-green uppercase tracking-widest mb-4">Medication Strategy</h4>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <span className="text-sm font-bold text-brand-dark">Missed any doses?</span>
                   <button
                      type="button"
                      onClick={() => setValue('missedDiuretic', !missedDiuretic)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${missedDiuretic ? 'bg-brand-accent text-white' : 'bg-white border border-brand-beige text-text-muted'}`}
                   >
                     {missedDiuretic ? 'Yes, Missed' : 'No'}
                   </button>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-sm font-bold text-brand-dark">Taken extra diuretic?</span>
                   <button
                      type="button"
                      onClick={() => setValue('extraDiureticTaken', !extraDiureticTaken)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${extraDiureticTaken ? 'bg-brand-green text-white' : 'bg-white border border-brand-beige text-text-muted'}`}
                   >
                     {extraDiureticTaken ? 'Yes, Extra' : 'No'}
                   </button>
                </div>
             </div>
          </section>
        )}

        {/* Core: Meds Toggle */}
        <section className="flex items-center justify-between p-6 bg-bg-base rounded-3xl border border-brand-beige">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center text-white">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-brand-dark">Took your meds?</p>
              <p className="text-[10px] text-text-muted uppercase tracking-widest">Morning Routine</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setValue('tookMeds', !tookMeds)}
            className={`w-14 h-8 rounded-full transition-colors relative ${tookMeds ? 'bg-brand-green' : 'bg-brand-beige'}`}
          >
            <motion.div 
              animate={{ x: tookMeds ? 24 : 4 }}
              className="absolute top-1 left-0 w-6 h-6 bg-white rounded-full shadow-sm" 
            />
          </button>
        </section>

        <button 
          type="submit"
          className="w-full bg-brand-dark text-white py-6 rounded-[2rem] font-bold text-lg shadow-xl hover:bg-brand-green transition-all flex items-center justify-center gap-3 group"
        >
          Complete Your Rhythm
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="pt-8 text-center">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] italic">
          Logging securely on this device only
        </p>
      </div>
    </form>
  );
}

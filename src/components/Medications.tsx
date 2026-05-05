import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Pill, Info, AlertTriangle, Plus, ChevronRight, X, Clock, Calendar } from 'lucide-react';
import { Medication } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function Medications() {
  const medications = useLiveQuery(() => db.medications.toArray()) || [];
  const [selectedMed, setSelectedMed] = React.useState<Medication | null>(null);

  const hfMeds = medications.filter(m => m.isHFMed);
  const otherMeds = medications.filter(m => !m.isHFMed);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-5xl font-serif text-brand-dark tracking-tight">Medications</h2>
          <p className="text-text-muted text-lg font-medium">Your daily "Heart Cocktail" for rhythm and strength.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* HF Foundation Meds */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-bold text-brand-green uppercase tracking-[0.25em] flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
              Foundational Heart Meds
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hfMeds.map(med => (
                <button
                  key={med.id}
                  onClick={() => setSelectedMed(med)}
                  className="text-left bg-white border border-brand-beige p-6 rounded-[2rem] hover:border-brand-green hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col h-full justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{med.medClass}</p>
                      <h4 className="text-xl font-serif text-brand-dark group-hover:text-brand-green transition-colors">{med.name}</h4>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-brand-beige/50">
                       <span className="text-sm font-bold text-brand-dark">{med.dosage}</span>
                       <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{med.frequency}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Other Meds */}
          {otherMeds.length > 0 && (
            <section className="space-y-6">
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.25em] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-beige" />
                Other Medications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {otherMeds.map(med => (
                  <button
                    key={med.id}
                    onClick={() => setSelectedMed(med)}
                    className="text-left bg-white/50 border border-brand-beige p-6 rounded-[2rem] hover:border-brand-green transition-all"
                  >
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{med.medClass}</p>
                      <h4 className="text-lg font-serif text-brand-dark">{med.name}</h4>
                      <p className="text-sm text-text-muted">{med.dosage} • {med.frequency}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <div className="bg-brand-accent text-white rounded-[3rem] p-10 shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-serif leading-tight">Safety First</h3>
                <p className="text-white/80 leading-relaxed font-medium">
                  Never stop taking your foundational heart medications without explicitly talking to your cardiology team first.
                </p>
              </div>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
           </div>

           <div className="bg-bg-base border border-brand-beige rounded-[2.5rem] p-8">
             <h4 className="font-bold text-brand-dark uppercase tracking-widest text-[10px] mb-6">Patient Resources</h4>
             <div className="space-y-3">
                {['Understanding Diuretics', 'Managing Low Blood Pressure', 'Salt Substitutes Warning'].map(t => (
                  <button key={t} className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-brand-beige hover:border-brand-green transition-all group">
                    <span className="text-xs font-bold text-brand-dark">{t}</span>
                    <ChevronRight className="w-4 h-4 text-brand-beige group-hover:text-brand-green" />
                  </button>
                ))}
             </div>
           </div>
        </div>
      </div>

      {/* Medication Detail Modal */}
      <AnimatePresence>
        {selectedMed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-md"
              onClick={() => setSelectedMed(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-10 border-b border-brand-beige bg-bg-base/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-brand-green uppercase tracking-[0.2em]">{selectedMed.medClass}</span>
                  <h3 className="text-3xl font-serif text-brand-dark mt-1">{selectedMed.name}</h3>
                </div>
                <button 
                  onClick={() => setSelectedMed(null)}
                  className="w-12 h-12 rounded-full bg-white border border-brand-beige flex items-center justify-center hover:bg-brand-beige transition-colors shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-10 space-y-10">
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-5 bg-bg-base rounded-2xl border border-brand-beige">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-brand-green" />
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Timing</span>
                      </div>
                      <p className="font-bold text-brand-dark">{selectedMed.frequency}</p>
                   </div>
                   <div className="p-5 bg-bg-base rounded-2xl border border-brand-beige">
                      <div className="flex items-center gap-2 mb-2">
                        <Pill className="w-4 h-4 text-brand-green" />
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Dosage</span>
                      </div>
                      <p className="font-bold text-brand-dark">{selectedMed.dosage}</p>
                   </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-serif italic text-xl text-brand-dark">Why am I taking this?</h4>
                  <p className="text-text-main font-medium leading-relaxed">{selectedMed.purpose}</p>
                </div>

                <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
                   <div className="flex items-center gap-2 text-amber-800">
                      <Info className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Careful Monitoring</span>
                   </div>
                   <p className="text-sm text-amber-900 leading-relaxed font-medium">
                     {selectedMed.warnings}
                   </p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold text-text-muted uppercase tracking-widest pt-6 border-t border-brand-beige">
                   <span>Started {selectedMed.startDate}</span>
                   {selectedMed.prescriber && <span>Prescribed by {selectedMed.prescriber}</span>}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

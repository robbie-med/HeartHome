import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Pill, Info, AlertTriangle, Plus, ChevronRight, X, Clock, Calendar, Power, Edit3 } from 'lucide-react';
import { Medication, MedClass } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { HF_MED_LIBRARY } from '../services/medicationLibrary';

export default function Medications() {
  const medications = useLiveQuery(() => db.medications.toArray()) || [];
  const [selectedMed, setSelectedMed] = React.useState<Medication | null>(null);
  const [isAdding, setIsAdding] = React.useState(false);
  const [isEditingDose, setIsEditingDose] = React.useState(false);
  const [newMed, setNewMed] = React.useState<Partial<Medication>>({
    isHFMed: false,
    isActive: true,
    frequency: 'Once daily',
    dosage: ''
  });

  const activeHfMeds = medications.filter(m => m.isHFMed && m.isActive);
  const activeOtherMeds = medications.filter(m => !m.isHFMed && m.isActive);
  const stoppedMeds = medications.filter(m => !m.isActive);

  const handleLibrarySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const med = HF_MED_LIBRARY.find(m => m.name === e.target.value);
    if (med) {
      setNewMed({
        ...newMed,
        name: med.name,
        medClass: med.medClass,
        purpose: med.purpose,
        warnings: med.warnings,
        dosage: med.commonDoses[0],
        isHFMed: true
      });
    } else {
      setNewMed({
        ...newMed,
        name: '',
        isHFMed: false
      });
    }
  };

  const handleAddMed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name) return;
    
    await db.medications.add({
      id: Math.random().toString(36).substr(2, 9),
      name: newMed.name,
      medClass: newMed.medClass || 'Other',
      dosage: newMed.dosage || '',
      route: 'Oral',
      frequency: newMed.frequency || 'Once daily',
      isHFMed: newMed.isHFMed || false,
      isActive: true,
      purpose: newMed.purpose || '',
      warnings: newMed.warnings || '',
      startDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    await db.auditLog.add({ action: `Added medication: ${newMed.name}`, timestamp: new Date().toISOString() });
    setIsAdding(false);
    setNewMed({ isHFMed: false, isActive: true, frequency: 'Once daily', dosage: '' });
  };

  const stopMed = async (med: Medication) => {
    const reason = prompt(`Reason for stopping ${med.name}? (Optional)`);
    await db.medications.update(med.id, {
      isActive: false,
      stopDate: new Date().toISOString().split('T')[0],
      stopReason: reason || 'Not specified',
      updatedAt: new Date().toISOString()
    });
    await db.auditLog.add({ action: `Stopped medication: ${med.name}`, timestamp: new Date().toISOString() });
    setSelectedMed(null);
  };

  const restartMed = async (med: Medication) => {
    await db.medications.update(med.id, {
      isActive: true,
      stopDate: undefined,
      stopReason: undefined,
      updatedAt: new Date().toISOString()
    });
    await db.auditLog.add({ action: `Restarted medication: ${med.name}`, timestamp: new Date().toISOString() });
  };

  const updateDose = async (med: Medication, newDose: string) => {
    const oldDose = med.dosage;
    await db.medications.update(med.id, {
      dosage: newDose,
      updatedAt: new Date().toISOString()
    });
    await db.auditLog.add({ 
      action: `Dose Change: ${med.name} from ${oldDose} to ${newDose}`, 
      timestamp: new Date().toISOString() 
    });
    setSelectedMed({ ...med, dosage: newDose });
    setIsEditingDose(false);
  };

  const logDose = async (med: Medication) => {
    await db.adherenceLogs.add({
      medicationId: med.id,
      date: new Date().toISOString().split('T')[0],
      status: 'taken',
      timestamp: new Date().toISOString()
    });
    await db.auditLog.add({ action: `Logged Dose: ${med.name}`, timestamp: new Date().toISOString() });
    alert(`Logged ${med.name} as taken.`);
  };

  const deleteMed = async (id: string, name: string) => {
    if (confirm(`Remove ${name} from your list?`)) {
      await db.medications.delete(id);
      await db.auditLog.add({ action: `Removed medication: ${name}`, timestamp: new Date().toISOString() });
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-5xl font-serif text-brand-dark tracking-tight">Medications</h2>
          <p className="text-text-muted text-lg font-medium">Your daily "Heart Cocktail" for rhythm and strength.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-brand-green text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-brand-green/20 hover:scale-105 transition-transform"
        >
          <Plus className="w-5 h-5" />
          Add Medication
        </button>
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
              {activeHfMeds.map(med => (
                <div key={med.id} className="relative group">
                  <button
                    onClick={() => setSelectedMed(med)}
                    className="w-full text-left bg-white border border-brand-beige p-6 rounded-[2rem] hover:border-brand-green hover:shadow-md transition-all h-full"
                  >
                    <div className="flex flex-col h-full justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{med.medClass}</p>
                        <h4 className="text-xl font-serif text-brand-dark group-hover:text-brand-green transition-colors">{med.name}</h4>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-brand-beige/50">
                        <span className="text-sm font-bold text-brand-dark">{med.dosage}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            logDose(med);
                          }}
                          className="px-4 py-1.5 bg-brand-green text-white text-[10px] font-bold rounded-lg hover:scale-105 transition-transform"
                        >
                          Log Dose
                        </button>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Other Meds */}
          {activeOtherMeds.length > 0 && (
            <section className="space-y-6">
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.25em] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-beige" />
                Other Medications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeOtherMeds.map(med => (
                  <div key={med.id} className="relative group">
                    <button
                      onClick={() => setSelectedMed(med)}
                      className="w-full text-left bg-white/50 border border-brand-beige p-6 rounded-[2rem] hover:border-brand-green transition-all h-full"
                    >
                      <div className="flex flex-col h-full justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{med.medClass}</p>
                          <h4 className="text-lg font-serif text-brand-dark">{med.name}</h4>
                          <p className="text-sm text-text-muted">{med.dosage} • {med.frequency}</p>
                        </div>
                        <div className="flex justify-end">
                           <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                logDose(med);
                              }}
                              className="px-4 py-1.5 bg-brand-dark text-white text-[10px] font-bold rounded-lg hover:bg-brand-green transition-all"
                            >
                              Log Dose
                            </button>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Stopped Meds */}
          {stoppedMeds.length > 0 && (
            <section className="space-y-6 pt-12 border-t border-brand-beige opacity-60">
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.25em] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                Stopped History
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stoppedMeds.map(med => (
                  <div key={med.id} className="relative group">
                    <button
                      onClick={() => setSelectedMed(med)}
                      className="w-full text-left bg-gray-100 border border-dashed border-brand-beige p-6 rounded-[2rem] hover:bg-white transition-all h-full"
                    >
                      <div className="space-y-1">
                        <h4 className="text-lg font-serif text-gray-500 line-through">{med.name}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stopped {med.stopDate}</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => deleteMed(med.id, med.name)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-brand-accent hover:bg-brand-accent/5 rounded-lg transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
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

      {/* Add Medication Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-md"
              onClick={() => setIsAdding(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-10 border-b border-brand-beige bg-bg-base/30 flex items-center justify-between">
                <h3 className="text-3xl font-serif text-brand-dark">New Medication</h3>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="w-12 h-12 rounded-full bg-white border border-brand-beige flex items-center justify-center hover:bg-brand-beige"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMed} className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Select from HF Library (Recommended)</label>
                  <select 
                    onChange={handleLibrarySelect}
                    className="w-full text-lg font-serif bg-transparent border-b border-brand-beige focus:border-brand-green outline-none py-2"
                  >
                    <option value="">-- Custom Medication --</option>
                    {HF_MED_LIBRARY.map(m => (
                      <option key={m.name} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Medication Name</label>
                  <input 
                    required
                    type="text"
                    value={newMed.name || ''}
                    onChange={e => setNewMed({ ...newMed, name: e.target.value })}
                    placeholder="e.g. Furosemide"
                    className="w-full text-xl font-serif bg-transparent border-b border-brand-beige focus:border-brand-green outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Dosage</label>
                    <input 
                      type="text"
                      value={newMed.dosage || ''}
                      onChange={e => setNewMed({ ...newMed, dosage: e.target.value })}
                      placeholder="e.g. 40mg"
                      className="w-full text-lg bg-transparent border-b border-brand-beige focus:border-brand-green outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Frequency</label>
                    <select
                      value={newMed.frequency}
                      onChange={e => setNewMed({ ...newMed, frequency: e.target.value })}
                      className="w-full text-lg bg-transparent border-b border-brand-beige focus:border-brand-green outline-none"
                    >
                      <option>Once daily</option>
                      <option>Twice daily</option>
                      <option>Three times daily</option>
                      <option>As needed (PRN)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Category</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setNewMed({ ...newMed, isHFMed: true })}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold text-[10px] uppercase transition-all ${newMed.isHFMed ? 'border-brand-green bg-brand-green/5 text-brand-green' : 'border-brand-beige text-text-muted'}`}
                    >
                      HF Foundation
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewMed({ ...newMed, isHFMed: false })}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold text-[10px] uppercase transition-all ${!newMed.isHFMed ? 'border-brand-dark bg-brand-dark/5 text-brand-dark' : 'border-brand-beige text-text-muted'}`}
                    >
                      Other Med
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Purpose</label>
                  <input 
                    type="text"
                    value={newMed.purpose || ''}
                    onChange={e => setNewMed({ ...newMed, purpose: e.target.value })}
                    placeholder="e.g. Water pill for swelling"
                    className="w-full text-sm bg-transparent border-b border-brand-beige focus:border-brand-green outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-brand-dark text-white rounded-2xl font-bold hover:bg-brand-dark/90 transition-all shadow-xl"
                >
                  Save Medication
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                  <div className="flex items-center gap-3">
                    <h3 className="text-3xl font-serif text-brand-dark mt-1">{selectedMed.name}</h3>
                    {!selectedMed.isActive && <span className="bg-gray-200 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Stopped</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   {selectedMed.isActive ? (
                     <button 
                        onClick={() => stopMed(selectedMed)}
                        className="w-12 h-12 rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/20 flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all shadow-sm"
                        title="Stop Medication"
                      >
                        <Power className="w-5 h-5" />
                      </button>
                   ) : (
                      <button 
                        onClick={() => restartMed(selectedMed)}
                        className="w-12 h-12 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20 flex items-center justify-center hover:bg-brand-green hover:text-white transition-all shadow-sm"
                        title="Restart Medication"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                   )}
                  <button 
                    onClick={() => setSelectedMed(null)}
                    className="w-12 h-12 rounded-full bg-white border border-brand-beige flex items-center justify-center hover:bg-brand-beige transition-colors shadow-sm"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
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
                   <div className="p-5 bg-bg-base rounded-2xl border border-brand-beige relative group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Pill className="w-4 h-4 text-brand-green" />
                          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Dosage</span>
                        </div>
                        {selectedMed.isActive && (
                          <button 
                            onClick={() => setIsEditingDose(!isEditingDose)}
                            className="p-1 hover:bg-brand-green/10 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-3 h-3 text-brand-green" />
                          </button>
                        )}
                      </div>
                      {isEditingDose ? (
                        <div className="flex gap-2">
                          <input 
                            autoFocus
                            defaultValue={selectedMed.dosage}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') updateDose(selectedMed, (e.target as HTMLInputElement).value);
                              if (e.key === 'Escape') setIsEditingDose(false);
                            }}
                            className="w-full font-bold text-brand-dark bg-white border border-brand-green rounded px-2 py-1 outline-none"
                          />
                        </div>
                      ) : (
                        <p className="font-bold text-brand-dark">{selectedMed.dosage}</p>
                      )}
                   </div>
                </div>

                {!selectedMed.isActive && selectedMed.stopReason && (
                   <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Reason for Stopping</p>
                      <p className="text-sm font-medium text-gray-600">{selectedMed.stopReason}</p>
                   </div>
                )}

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

                {selectedMed.isActive && (
                   <button 
                     onClick={() => logDose(selectedMed)}
                     className="w-full py-5 bg-brand-green text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-brand-green/20 hover:scale-[1.02] transition-transform"
                   >
                     <Pill className="w-5 h-5" />
                     Log Dose Taken Now
                   </button>
                )}

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

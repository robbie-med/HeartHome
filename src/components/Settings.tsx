import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Settings as SettingsIcon, Shield, Sliders, Monitor, Save, ChevronRight } from 'lucide-react';
import { TrackingMode } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

export default function Settings() {
  const profile = useLiveQuery(() => db.patientProfile.get('me'));
  const settings = useLiveQuery(() => db.settings.get('global'));
  const auditLogs = useLiveQuery(() => db.auditLog.toArray()) || [];

  const toggleSetting = async (key: keyof typeof settings) => {
    const current = await db.settings.get('global');
    await db.settings.put({
      ...(current || { id: 'global' }),
      [key]: !current?.[key],
      updatedAt: new Date().toISOString()
    } as any);
  };

  const exportAsJSON = async () => {
    const logs = await db.dailyLogs.toArray();
    const meds = await db.medications.toArray();
    const profileData = await db.patientProfile.get('me');
    
    const exportData = {
      profile: profileData,
      logs,
      medications: meds,
      exportedAt: new Date().toISOString(),
      version: '1.2.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HeartHome_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    await db.exportHistory.add({ timestamp: new Date().toISOString() });
    await db.auditLog.add({ action: 'JSON Backup Exported', timestamp: new Date().toISOString() });
  };

  const exportAsCSV = async () => {
    const logs = await db.dailyLogs.toArray();
    if (!logs.length) return;

    const headers = [
      'Date', 'Source', 'Weight', 'SBP', 'DBP', 'HR', 
      'Breathing', 'Swelling', 'Dyspnea', 'Orthopnea', 'PND', 
      'Fatigue', 'Dizziness', 'Chest Pain', 'Syncope', 'Meds Taken', 'Notes'
    ];
    
    const rows = logs.map(l => [
      l.date,
      l.source,
      l.weight || '',
      l.sbp || '',
      l.dbp || '',
      l.heartRate || '',
      l.breathing,
      l.swelling,
      l.dyspneaScore || '0',
      l.orthopneaPillows || '0',
      l.pnd ? 'Yes' : 'No',
      l.fatigueScore || '0',
      l.dizziness ? 'Yes' : 'No',
      l.chestPain ? 'Yes' : 'No',
      l.syncope ? 'Yes' : 'No',
      l.tookMeds ? 'Yes' : 'No',
      (l.notes || '').replace(/,/g, ';')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HeartHome_Clinical_Logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    await db.exportHistory.add({ timestamp: new Date().toISOString() });
    await db.auditLog.add({ action: 'CSV Clinical Exported', timestamp: new Date().toISOString() });
  };

  const printSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 print:bg-white print:text-black">
      <div className="space-y-2 print:hidden">
        <h2 className="text-5xl font-serif text-brand-dark tracking-tight">App Settings</h2>
        <p className="text-text-muted text-lg font-medium">Fine-tune your HeartHome experience.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 print:block">
        <div className="lg:col-span-2 space-y-12">
            {/* Clinical Summary View (Print Only) */}
            <section className="hidden print:block space-y-8 p-8 border-2 border-black rounded-3xl">
               <div className="flex justify-between items-start border-b-2 border-black pb-4">
                  <div>
                     <h1 className="text-4xl font-serif font-bold">HeartHome Clinical Summary</h1>
                     <p className="text-lg font-bold">Patient: {profile?.name || '---'}</p>
                     <p className="text-sm">DOB: {profile?.dob || '---'}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-bold">Report Generated: {new Date().toLocaleDateString()}</p>
                     <p className="text-sm italic">Tracking Mode: {profile?.trackingMode}</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-8">
                  <div>
                     <h3 className="font-bold border-b border-gray-300 mb-2">Baselines & Targets</h3>
                     <ul className="text-sm space-y-1">
                        <li>Baseline Weight: {profile?.weightBaseline} {profile?.units}</li>
                        <li>BP Target: &lt;{profile?.sbpThresholdHigh} mmHg</li>
                        <li>Heart Rate Target: {profile?.hrThresholdLow}-{profile?.hrThresholdHigh} BPM</li>
                     </ul>
                  </div>
                  <div>
                     <h3 className="font-bold border-b border-gray-300 mb-2">Primary Clinic</h3>
                     <ul className="text-sm space-y-1">
                        <li>{profile?.clinicName || 'Not Set'}</li>
                        <li>Triage: {profile?.triageNumber || 'Not Set'}</li>
                     </ul>
                  </div>
               </div>
               <div className="space-y-4">
                  <h3 className="font-bold border-b border-gray-300">Recent Activity Summary</h3>
                  <table className="w-full text-xs text-left border-collapse">
                     <thead>
                        <tr className="border-b border-gray-200">
                           <th className="py-2">Date</th>
                           <th className="py-2">Weight ({profile?.units})</th>
                           <th className="py-2">BP (mmHg)</th>
                           <th className="py-2">HR</th>
                           <th className="py-2">Breathing</th>
                           <th className="py-2">Meds</th>
                        </tr>
                     </thead>
                     <tbody>
                        {auditLogs.slice(-14).map(log => (
                           <tr key={log.id} className="border-b border-gray-100">
                              <td className="py-1">{new Date(log.timestamp).toLocaleDateString()}</td>
                              <td className="py-1">---</td>
                              <td className="py-1">---</td>
                              <td className="py-1">---</td>
                              <td className="py-1">---</td>
                              <td className="py-1">---</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
                  <p className="text-[10px] italic text-gray-500">Note: Full clinical breakdown provided in CSV/JSON exports.</p>
               </div>
            </section>

            {/* Profile Settings */}
            <section className="space-y-6">
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.25em] flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                Medical Context
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 border border-brand-beige rounded-[2rem]">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Clinic Name</label>
                  <input 
                    type="text"
                    defaultValue={profile?.clinicName}
                    onBlur={(e) => db.patientProfile.update('me', { clinicName: e.target.value })}
                    className="w-full text-lg font-serif bg-transparent border-b border-brand-beige focus:border-brand-green outline-none"
                    placeholder="e.g. Heart Rhythm Center"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Triage Number</label>
                  <input 
                    type="tel"
                    defaultValue={profile?.triageNumber}
                    onBlur={(e) => db.patientProfile.update('me', { triageNumber: e.target.value })}
                    className="w-full text-lg font-serif bg-transparent border-b border-brand-beige focus:border-brand-green outline-none"
                    placeholder="e.g. 555-0123"
                  />
                </div>
              </div>
            </section>

            {/* Tracking Mode */}
            <section className="space-y-6">
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.25em] flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                Monitoring Intensity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['basic', 'standard', 'advanced'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => db.patientProfile.update('me', { trackingMode: mode, updatedAt: new Date().toISOString() })}
                    className={`p-6 rounded-[2rem] border-2 text-left transition-all ${
                      profile?.trackingMode === mode 
                        ? 'border-brand-green bg-white shadow-lg' 
                        : 'border-brand-beige bg-bg-base text-text-muted hover:border-brand-green/30'
                    }`}
                  >
                    <h4 className="font-serif text-xl text-brand-dark capitalize mb-1">{mode}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                      {mode === 'basic' ? 'Weight & Vitals' : mode === 'standard' ? 'Symptom Details' : 'Full FACETS Model'}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            {/* Preferences */}
            <section className="space-y-6">
               <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.25em] flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Visual Preferences
               </h3>
               <div className="space-y-3">
                  {[
                    { id: 'highContrast', label: 'High Contrast Mode', desc: 'Enhanced readability for low light' },
                    { id: 'reducedMotion', label: 'Reduced Motion', desc: 'Smoother transitions without sliding' },
                    { id: 'plainLanguage', label: 'Plain Language Mode', desc: 'Simplifies clinical terminology' }
                  ].map(pref => {
                    const isActive = (settings as any)?.[pref.id];
                    return (
                      <button 
                        key={pref.id} 
                        onClick={() => toggleSetting(pref.id as any)}
                        className={`w-full flex items-center justify-between p-6 bg-white border rounded-2xl transition-all ${isActive ? 'border-brand-green shadow-sm' : 'border-brand-beige'}`}
                      >
                         <div className="text-left">
                            <p className="font-bold text-brand-dark">{pref.label}</p>
                            <p className="text-xs text-text-muted">{pref.desc}</p>
                         </div>
                         <div className={`w-12 h-6 rounded-full relative transition-colors ${isActive ? 'bg-brand-green' : 'bg-brand-beige'}`}>
                            <motion.div 
                              animate={{ x: isActive ? 24 : 4 }}
                              className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm" 
                            />
                         </div>
                      </button>
                    );
                  })}
               </div>
            </section>

          {/* Audit Log */}
          <section className="space-y-6">
             <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.25em] flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security Audit Trail
             </h3>
             <div className="bg-white border border-brand-beige rounded-2xl overflow-hidden">
                <div className="p-4 bg-bg-base border-b border-brand-beige flex justify-between">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Activity</span>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Timestamp</span>
                </div>
                <div className="max-h-40 overflow-y-auto custom-scrollbar">
                   {auditLogs?.length ? auditLogs.slice().reverse().map(log => (
                     <div key={log.id} className="p-4 border-b border-brand-beige last:border-0 flex justify-between items-center text-xs">
                        <span className="font-bold text-brand-dark">{log.action}</span>
                        <span className="text-text-muted">{new Date(log.timestamp).toLocaleString()}</span>
                     </div>
                   )) : (
                     <div className="p-4 text-center text-xs text-text-muted">No activity logged.</div>
                   )}
                </div>
             </div>
          </section>

          {/* Privacy Statement */}
          <section className="p-8 bg-brand-green/5 rounded-[2.5rem] border border-brand-green/10 space-y-4">
             <div className="flex items-center gap-3 text-brand-green">
                <Shield className="w-5 h-5" />
                <h4 className="font-serif text-xl">Privacy Commitment</h4>
             </div>
             <p className="text-sm text-brand-dark/70 leading-relaxed font-medium">
               HeartHome is an **offline-first** application. Your medical data never leaves this device unless you explicitly use the export tools below. We do not use third-party analytics or cloud trackers. Your rhythm is your concern, and your data is your property.
             </p>
          </section>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-8">
           <div className="bg-brand-dark text-white rounded-[3rem] p-10 shadow-2xl space-y-8">
              <div className="space-y-4">
                 <Shield className="w-12 h-12 text-brand-green" />
                 <h3 className="text-2xl font-serif">Data Portability</h3>
                 <p className="text-white/60 text-sm font-medium leading-relaxed">
                   Your clinical logs are your property. Download your full history at any time.
                 </p>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={exportAsCSV}
                  className="w-full py-4 px-6 bg-white/10 rounded-2xl text-sm font-bold hover:bg-white/20 transition-all flex items-center justify-between group"
                >
                   Export as CSV <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={exportAsJSON}
                  className="w-full py-4 px-6 bg-white/10 rounded-2xl text-sm font-bold hover:bg-white/20 transition-all flex items-center justify-between group"
                >
                   Export Backup (JSON) <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={printSummary}
                  className="w-full py-4 px-6 bg-brand-green rounded-2xl text-sm font-bold hover:bg-brand-green/80 transition-all flex items-center justify-between group text-brand-dark"
                >
                   Print Clinic Summary <ChevronRight className="w-4 h-4" />
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

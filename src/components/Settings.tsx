import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Settings as SettingsIcon, Shield, Sliders, Monitor, Save, ChevronRight } from 'lucide-react';
import { TrackingMode } from '../types';

export default function Settings() {
  const profile = useLiveQuery(() => db.patientProfile.get('me'));
  const settings = useLiveQuery(() => db.settings.get('global'));
  const auditLogs = useLiveQuery(() => db.auditLog.toArray()) || [];

  const setTrackingMode = async (mode: TrackingMode) => {
    await db.patientProfile.update('me', { trackingMode: mode, updatedAt: new Date().toISOString() });
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
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HeartHome_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    await db.exportHistory.add({ timestamp: new Date().toISOString() });
  };

  const exportAsCSV = async () => {
    const logs = await db.dailyLogs.toArray();
    if (!logs.length) return;

    const headers = ['Date', 'Weight', 'Breathing', 'Swelling', 'Took Meds', 'Notes'];
    const rows = logs.map(l => [
      l.date,
      l.weight || '',
      l.breathing,
      l.swelling,
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
    a.download = `HeartHome_Logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    await db.exportHistory.add({ timestamp: new Date().toISOString() });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h2 className="text-5xl font-serif text-brand-dark tracking-tight">App Settings</h2>
        <p className="text-text-muted text-lg font-medium">Fine-tune your HeartHome experience.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
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
                  onClick={() => setTrackingMode(mode)}
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
            <p className="text-xs text-text-muted italic px-4">
              Switching modes will not delete your existing history. It simply adjusts the complexity of your daily log.
            </p>
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
                ].map(pref => (
                  <div key={pref.id} className="flex items-center justify-between p-6 bg-white border border-brand-beige rounded-2xl">
                     <div>
                        <p className="font-bold text-brand-dark">{pref.label}</p>
                        <p className="text-xs text-text-muted">{pref.desc}</p>
                     </div>
                     <div className="w-12 h-6 bg-brand-beige rounded-full relative">
                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full" />
                     </div>
                  </div>
                ))}
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
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

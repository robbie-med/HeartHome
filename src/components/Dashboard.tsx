import React, { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  AlertCircle, 
  Plus, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Waves,
  Wind,
  Weight,
  Phone,
  Settings as SettingsIcon,
  ChevronRight
} from 'lucide-react';
import { DayLog, SymptomLevel, PatientProfile } from '../types';
import { format, subDays, isSameDay, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import CheckInForm from './CheckInForm';

export default function Dashboard() {
  const [showCheckIn, setShowCheckIn] = React.useState(false);
  
  const profile = useLiveQuery(() => db.patientProfile.get('me'));
  const allLogs = useLiveQuery(() => db.dailyLogs.orderBy('date').toArray()) || [];
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const loggedToday = allLogs.find(l => l.date === today);

  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const log = allLogs.find(l => l.date === dateStr);
      return {
        date: format(d, 'MMM d'),
        weight: log?.weight || null,
        swelling: log?.swelling === SymptomLevel.SEVERE ? 3 : log?.swelling === SymptomLevel.MODERATE ? 2 : log?.swelling === SymptomLevel.MILD ? 1 : 0,
        breathing: log?.breathing === 'worse' ? 2 : log?.breathing === 'same' ? 1 : 0,
      };
    });
  }, [allLogs]);

  const alertLevel = useMemo(() => {
    if (!allLogs.length) return 'stable';
    
    // Check latest log
    const latest = [...allLogs].sort((a, b) => b.date.localeCompare(a.date))[0];
    const prev = allLogs.length > 1 ? [...allLogs].sort((a, b) => b.date.localeCompare(a.date))[1] : null;

    // Weight gain logic (2lb/day or 5lb/week)
    if (latest.weight && prev?.weight) {
      const diff = latest.weight - prev.weight;
      if (diff >= 2) return 'emergency';
    }

    if (latest.breathing === 'worse' || latest.swelling === SymptomLevel.SEVERE || latest.concernToday) {
      return 'urgent';
    }

    return 'stable';
  }, [allLogs]);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Header & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-5xl font-serif text-brand-dark tracking-tight">How are you, {profile?.name || 'today'}?</h2>
          <p className="text-text-muted text-lg font-medium">Monitoring your rhythm from the comfort of home.</p>
        </div>
        
        {!loggedToday ? (
          <button 
            onClick={() => setShowCheckIn(true)}
            className="flex items-center gap-4 bg-brand-green text-white px-8 py-5 rounded-[2rem] font-bold shadow-xl shadow-brand-green/20 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-5 h-5" />
            Complete Daily Check-in
          </button>
        ) : (
          <div className="flex items-center gap-4 bg-bg-base border border-brand-green/20 text-brand-green px-8 py-5 rounded-[2rem] font-bold">
            <CheckCircle2 className="w-5 h-5" />
            Check-in Complete
          </div>
        )}
      </div>

      {/* Alert Banner */}
      <AnimatePresence>
        {alertLevel !== 'stable' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-[2.5rem] flex items-center gap-6 shadow-lg ${
              alertLevel === 'emergency' ? 'bg-brand-accent text-white' : 'bg-amber-50 border border-amber-200 text-amber-900'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              alertLevel === 'emergency' ? 'bg-white/20' : 'bg-amber-200'
            }`}>
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg leading-tight">
                {alertLevel === 'emergency' ? 'Urgent Alert: Rapid Weight Change' : 'Clinical Caution Needed'}
              </h4>
              <p className="text-sm opacity-90 font-medium">
                {alertLevel === 'emergency' 
                  ? 'Your data shows a significant shift. Please call your care team or triage line immediately.'
                  : 'We noticed some worsening symptoms. It might be time to use your action plan and notify your clinic.'}
              </p>
            </div>
            <button className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              alertLevel === 'emergency' ? 'bg-white text-brand-accent' : 'bg-amber-200 text-amber-900'
            }`}>
               <Phone className="w-4 h-4" />
               Call Clinic
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-brand-beige rounded-[3rem] p-10 shadow-sm relative overflow-hidden group">
          <Weight className="absolute -right-8 -top-8 w-32 h-32 text-brand-beige/20 rotate-12 transition-transform group-hover:rotate-0" />
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2 relative z-10">Current Weight</p>
          <div className="flex items-baseline gap-2 relative z-10">
            <h3 className="text-5xl font-serif text-brand-dark">{loggedToday?.weight || '--'}</h3>
            <span className="text-lg font-serif text-text-muted">lbs</span>
          </div>
          <div className="mt-6 flex items-center gap-2 text-brand-green relative z-10">
             <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
             <p className="text-xs font-bold uppercase tracking-widest">Tracking Active</p>
          </div>
        </div>

        <div className="md:col-span-2 bg-white border border-brand-beige rounded-[3rem] p-10 shadow-sm min-h-[300px]">
           <div className="flex items-center justify-between mb-8">
              <h3 className="font-serif text-xl text-brand-dark">7-Day Weight Trend</h3>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-brand-green" />
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Weight Log</span>
                 </div>
              </div>
           </div>
           <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last7Days}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8BA888" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#8BA888" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EDE8" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#A8A29D' }} 
                    dy={10}
                  />
                  <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#8BA888" 
                    fillOpacity={1} 
                    fill="url(#colorWeight)" 
                    strokeWidth={4} 
                    connectNulls
                  />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Symptom Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-brand-beige rounded-[2.5rem] p-8 shadow-sm">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-brand-beige/50 rounded-xl flex items-center justify-center text-brand-green">
                   <Waves className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="font-serif text-lg text-brand-dark">Fluid Balance</h3>
                   <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Swelling Trend</p>
                </div>
             </div>
             <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={last7Days}>
                      <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#EAE3D2" />
                      <XAxis hide dataKey="date" />
                      <YAxis hide domain={[0, 3]} />
                      <Tooltip />
                      <Area type="monotone" dataKey="swelling" stroke="#8BA888" fill="#8BA888" fillOpacity={0.1} strokeWidth={3} />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white border border-brand-beige rounded-[2.5rem] p-8 shadow-sm">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-brand-beige/50 rounded-xl flex items-center justify-center text-brand-accent">
                   <Wind className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="font-serif text-lg text-brand-dark">Respiratory Rhythm</h3>
                   <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Breathing Trend</p>
                </div>
             </div>
             <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={last7Days}>
                      <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#EAE3D2" />
                      <XAxis hide dataKey="date" />
                      <YAxis hide domain={[0, 2]} />
                      <Tooltip />
                      <Area type="monotone" dataKey="breathing" stroke="#D46B4E" fill="#D46B4E" fillOpacity={0.1} strokeWidth={3} />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
      </div>

      {/* FACETS Section */}
      <div className="bg-white border border-brand-beige rounded-[3rem] p-12 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-beige/30 rounded-full border border-brand-beige">
              <span className="w-2 h-2 rounded-full bg-brand-green" />
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Clinical Framework</span>
            </div>
            <h3 className="text-5xl font-serif text-brand-dark leading-tight tracking-tight">The FACETS Model</h3>
            <p className="text-text-muted text-lg font-medium leading-relaxed">
              We focus on these six dimensions each day to ensure your care plan remains effective and your rhythm stays stable.
            </p>
            <div className="grid grid-cols-2 gap-4">
               {['Fatigue', 'Activity', 'Congestion', 'Edema', 'Treatment', 'Safety'].map((item, i) => (
                 <div key={item} className="flex items-center gap-3 p-4 bg-bg-base rounded-2xl border border-brand-beige">
                    <span className="w-8 h-8 rounded-full border border-brand-beige flex items-center justify-center font-serif text-brand-dark group-hover:bg-brand-green group-hover:text-white transition-all">{item[0]}</span>
                    <span className="font-bold text-xs uppercase tracking-widest text-text-muted">{item}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Check-in Modal */}
      <AnimatePresence>
        {showCheckIn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckIn(false)}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-10 border-b border-brand-beige flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-serif text-brand-dark">Daily Check-in</h3>
                  <p className="text-sm text-text-muted font-medium mt-1">Consistency is key to managing heart rhythm.</p>
                </div>
                <button 
                  onClick={() => setShowCheckIn(false)}
                  className="w-12 h-12 rounded-full bg-bg-base flex items-center justify-center hover:bg-brand-beige transition-colors"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
              </div>
              <div className="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <CheckInForm 
                  mode={profile?.trackingMode || 'basic'} 
                  onComplete={() => setShowCheckIn(false)} 
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

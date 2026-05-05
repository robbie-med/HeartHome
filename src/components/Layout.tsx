import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { 
  Heart, 
  LayoutDashboard, 
  CalendarCheck, 
  BookOpen, 
  Pill, 
  Compass, 
  Users,
  ChevronRight,
  Menu,
  X,
  WifiOff,
  CloudCheck,
  Settings as SettingsIcon
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'checkin', label: 'Daily Check-in', icon: CalendarCheck },
  { id: 'education', label: 'Education', icon: BookOpen },
  { id: 'meds', label: 'Medications', icon: Pill },
  { id: 'advanced', label: 'Future Planning', icon: Compass },
  { id: 'contacts', label: 'My Contacts', icon: Users },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const settings = useLiveQuery(() => db.settings.get('global'));
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const highContrast = settings?.highContrast;
  const reducedMotion = settings?.reducedMotion || prefersReducedMotion;

  return (
    <div className={cn(
      "min-h-screen flex flex-col md:flex-row font-sans selection:bg-brand-green selection:text-white transition-colors duration-300",
      highContrast ? "bg-white text-black" : "bg-bg-base text-text-main"
    )}>
      {/* Sidebar - Desktop */}
      <aside className={cn(
        "hidden md:flex flex-col w-72 border-r p-8 sticky h-screen top-0",
        highContrast ? "bg-white border-black" : "bg-white border-brand-beige"
      )}>
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white shadow-sm shadow-brand-green/20">
            <span className="font-serif italic text-xl">h</span>
          </div>
          <h1 className="font-serif font-medium text-2xl text-brand-dark tracking-tight">HeartHome</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group text-sm font-medium focus:outline-none focus:ring-2",
                  isActive 
                    ? (highContrast ? "bg-black text-white" : "bg-brand-green text-white shadow-md shadow-brand-green/10") 
                    : (highContrast ? "text-gray-600 hover:bg-gray-100" : "text-text-muted hover:bg-bg-base hover:text-text-main"),
                  highContrast && "focus:ring-black"
                )}
              >
                <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-white" : "text-text-muted group-hover:text-brand-dark")} />
                {tab.label}
                {isActive && !reducedMotion && (
                  <motion.div layoutId="activeDot" className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-8 space-y-4">
          <div className={cn(
            "p-6 rounded-[2rem] border",
            highContrast ? "border-black" : "bg-brand-green/5 border-brand-green/10"
          )}>
            <p className={cn(
              "text-[10px] font-bold uppercase tracking-widest mb-3",
              highContrast ? "text-black" : "text-brand-green"
            )}>Sync Status</p>
            <div className="flex items-center gap-3">
               {isOffline ? (
                 <WifiOff className="w-4 h-4 text-brand-accent" />
               ) : (
                 <CloudCheck className={cn("w-4 h-4", highContrast ? "text-black" : "text-brand-green")} />
               )}
               <p className="text-sm font-bold text-brand-dark truncate">
                 {isOffline ? 'Offline - Local Storage' : 'Secured & Syncing'}
               </p>
            </div>
          </div>
          
          <p className="text-[10px] font-bold text-text-muted text-center uppercase tracking-[0.25em]">v1.2.0-pwa</p>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className={cn(
        "md:hidden flex items-center justify-between p-5 border-b sticky top-0 z-50",
        highContrast ? "bg-white border-black" : "bg-white border-brand-beige"
      )}>
        <div className="flex items-center gap-2">
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white", highContrast ? "bg-black" : "bg-brand-green")}>
            <span className="font-serif italic text-lg">h</span>
          </div>
          <span className="font-serif font-medium text-lg text-brand-dark">HeartHome</span>
        </div>
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {isOffline && (
              <motion.div 
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent"
              >
                <WifiOff className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-text-muted focus:outline-none">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-x-0 top-[69px] bg-white border-b border-brand-beige z-40 p-6 shadow-2xl rounded-b-[2rem]"
          >
            <div className="grid grid-cols-2 gap-3">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl transition-all font-medium text-sm",
                      isActive ? "bg-brand-green text-white shadow-lg shadow-brand-green/20" : "bg-bg-base text-text-muted"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto p-6 md:p-12 relative">
          <motion.div
            key={activeTab}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.99, y: 10 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            transition={reducedMotion ? { duration: 0.1 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

import React from 'react';
import { Compass, ShieldCheck, Heart, ExternalLink, ChevronRight, Info, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdvancedCare() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-5xl font-serif text-brand-dark tracking-tight">Future Planning</h2>
          <p className="text-text-muted text-lg font-medium">Clear directives for your care, peace of mind for your loved ones.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Main Directives Section */}
          <section className="space-y-8">
            <div className="bg-white border border-brand-beige rounded-[3rem] p-10 shadow-sm relative overflow-hidden group">
               <div className="space-y-8 relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-brand-green rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-green/20">
                        <FileText className="w-7 h-7" />
                     </div>
                     <div>
                        <h3 className="text-3xl font-serif text-brand-dark">Advance Directives</h3>
                        <p className="text-[10px] text-brand-green font-bold uppercase tracking-[0.2em] mt-1 italic">Highly Recommended</p>
                     </div>
                  </div>
                  
                  <p className="text-text-muted text-lg leading-relaxed font-medium">
                    An advance directive is a legal document that explains how you want medical decisions to be made if you cannot speak for yourself.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <a 
                      href="https://mydirectives.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-6 bg-brand-dark text-white rounded-2xl hover:bg-brand-green transition-all group/btn shadow-lg"
                     >
                        <div className="space-y-1">
                           <p className="text-sm font-bold">MyDirectives.org</p>
                           <p className="text-[10px] opacity-60 uppercase tracking-widest">External Resource</p>
                        </div>
                        <ExternalLink className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                     </a>
                     
                     <button className="flex items-center justify-between p-6 bg-white border border-brand-beige rounded-2xl hover:border-brand-green transition-all group/btn">
                        <div className="space-y-1">
                           <p className="text-sm font-bold text-brand-dark">Conversation Guide</p>
                           <p className="text-[10px] text-text-muted uppercase tracking-widest">Patient PDF</p>
                        </div>
                        <FileText className="w-5 h-5 text-brand-green" />
                     </button>
                  </div>
               </div>
               <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand-green/5 rounded-full blur-[100px] pointer-events-none" />
            </div>

            {/* Checklist */}
            <div className="space-y-6">
               <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.25em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-beige" />
                  Your Checklist
               </h4>
               <div className="space-y-3">
                  {[
                    'Designated a Health Care Proxy (Contact)',
                    'Discussed quality of life goals with loved ones',
                    'Completed an Advance Directive document',
                    'Shared a copy with your Clinical Care Team'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 bg-white border border-brand-beige rounded-2xl">
                       <div className="w-6 h-6 border-2 border-brand-beige rounded-lg flex items-center justify-center cursor-pointer hover:border-brand-green transition-colors">
                          {i === 3 && <CheckCircle2 className="w-4 h-4 text-brand-green" />}
                       </div>
                       <span className="text-sm font-medium text-brand-dark">{item}</span>
                    </div>
                  ))}
               </div>
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
           <div className="bg-bg-base border border-brand-beige rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
              <div className="relative z-10 space-y-6 text-center">
                <div className="w-16 h-16 bg-white rounded-3xl border border-brand-beige flex items-center justify-center mx-auto shadow-sm">
                  <Compass className="w-8 h-8 text-brand-green" />
                </div>
                <h3 className="text-2xl font-serif leading-tight text-brand-dark">Why Plan Now?</h3>
                <p className="text-text-muted leading-relaxed font-serif text-lg italic italic">
                  "Future planning isn't about dying—it's about how you want to live while managing a complex rhythm. It ensures your values stay at the center of your care."
                </p>
                <div className="pt-6 border-t border-brand-beige/50">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Managed Locally</p>
                </div>
              </div>
           </div>

           <div className="p-8 bg-amber-50 border border-amber-200 rounded-[2.5rem] space-y-4">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Privacy Note</span>
              </div>
              <p className="text-xs font-medium text-amber-900 leading-relaxed">
                HeartHome avoids storing unencrypted legal documents. We recommend using MyDirectives.org for secure cloud storage of your legal directives.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

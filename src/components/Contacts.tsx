import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Phone, Mail, Globe, MapPin, Plus, User, Info, Clock, AlertCircle } from 'lucide-react';
import { Contact } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function Contacts() {
  const contacts = useLiveQuery(() => db.contacts.toArray()) || [];
  const [isAdding, setIsAdding] = React.useState(false);

  const emergencyContacts = contacts.filter(c => c.isEmergency);
  const careTeam = contacts.filter(c => !c.isEmergency);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-5xl font-serif text-brand-dark tracking-tight">Care Circle</h2>
          <p className="text-text-muted text-lg font-medium">Your rapid-response team at home and in the clinic.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Emergency Section */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.25em] flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
              Emergency & Triage
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {emergencyContacts.length > 0 ? emergencyContacts.map(contact => (
                 <ContactCard key={contact.id} contact={contact} />
               )) : (
                 <div className="col-span-2 p-8 border-2 border-dashed border-brand-beige rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4">
                    <AlertCircle className="w-10 h-10 text-brand-beige" />
                    <div>
                      <p className="font-bold text-brand-dark">No emergency contacts yet.</p>
                      <p className="text-sm text-text-muted">Add your clinic triage line or family health proxy.</p>
                    </div>
                 </div>
               )}
            </div>
          </section>

          {/* Regular Care Team */}
          <section className="space-y-6">
             <h3 className="text-[10px] font-bold text-brand-green uppercase tracking-[0.25em] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                Clinical Care Team
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {careTeam.map(contact => (
                  <ContactCard key={contact.id} contact={contact} />
                ))}
             </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
           <div className="bg-brand-dark text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-brand-green" />
                </div>
                <h3 className="text-2xl font-serif leading-tight">Always Available</h3>
                <p className="text-white/60 leading-relaxed font-medium">
                  Ensure you have the after-hours triage number for your cardiology clinic saved here for rapid access.
                </p>
                <div className="pt-6 border-t border-white/10">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-brand-green mb-2">Clinic Hours</p>
                   <div className="flex justify-between items-center text-sm font-medium">
                      <span>Mon - Fri</span>
                      <span className="text-white/80">8:00 AM - 5:00 PM</span>
                   </div>
                </div>
              </div>
              <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-brand-green/5 rounded-full blur-3xl" />
           </div>

           <div className="bg-bg-base border border-brand-beige rounded-[2.5rem] p-8">
             <h4 className="font-bold text-brand-dark uppercase tracking-widest text-[10px] mb-4">Offline Access</h4>
             <p className="text-[10px] text-text-muted italic leading-relaxed">
               All contact information is stored securely on this device and remains accessible even without cellular or internet service.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}

function ContactCard({ contact }: { contact: Contact }) {
  return (
    <div className="bg-white border border-brand-beige p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
      <div className="relative z-10 space-y-6">
        <div className="space-y-1">
           <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">{contact.role}</p>
           <h4 className="text-2xl font-serif text-brand-dark group-hover:text-brand-green transition-colors">{contact.name}</h4>
           {contact.organization && (
             <p className="text-xs font-medium text-text-muted">{contact.organization}</p>
           )}
        </div>

        <div className="space-y-3">
           <a 
            href={`tel:${contact.phone}`} 
            className="flex items-center gap-4 p-4 bg-bg-base rounded-2xl hover:bg-brand-green hover:text-white transition-all text-brand-dark"
           >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-bold">{contact.phone}</span>
           </a>
           {contact.afterHoursPhone && (
             <a 
              href={`tel:${contact.afterHoursPhone}`} 
              className="flex items-center gap-4 p-4 border border-brand-accent/20 rounded-2xl hover:bg-brand-accent hover:text-white transition-all text-brand-accent"
             >
                <Clock className="w-4 h-4" />
                <span className="text-sm font-bold">After Hours: {contact.afterHoursPhone}</span>
             </a>
           )}
        </div>

        <div className="flex gap-2">
           {contact.email && (
             <a href={`mailto:${contact.email}`} className="w-10 h-10 rounded-xl bg-bg-base flex items-center justify-center text-text-muted hover:text-brand-green transition-colors">
                <Mail className="w-4 h-4" />
             </a>
           )}
           {contact.portalUrl && (
             <a href={contact.portalUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-bg-base flex items-center justify-center text-text-muted hover:text-brand-green transition-colors">
                <Globe className="w-4 h-4" />
             </a>
           )}
        </div>

        {contact.notes && (
          <p className="text-[10px] text-text-muted italic border-t border-brand-beige pt-4">{contact.notes}</p>
        )}
      </div>
      
      <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-transform">
         <User className="w-24 h-24 text-brand-dark" />
      </div>
    </div>
  );
}

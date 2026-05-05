import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { BookOpen, Search, Bookmark, ChevronRight, Info, CheckCircle2, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Article } from '../types';
import { motion } from 'motion/react';

export default function Education() {
  const articles = useLiveQuery(() => db.articles.toArray()) || [];
  const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-5xl font-serif text-brand-dark tracking-tight">Education Library</h2>
          <p className="text-text-muted text-lg font-medium">Empower yourself with clinical knowledge for home care.</p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-brand-green transition-colors" />
          <input 
            type="text" 
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-4 bg-white border border-brand-beige rounded-2xl w-full md:w-80 outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 transition-all font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Article List */}
        <div className="lg:col-span-2 space-y-6">
          {filteredArticles.map((article) => (
            <button
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="w-full text-left bg-white border border-brand-beige p-8 rounded-[2.5rem] shadow-sm hover:border-brand-green hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-brand-beige/40 rounded-full text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      {article.category}
                    </span>
                    <span className="text-[10px] font-bold text-brand-green uppercase tracking-widest">
                       Updated {article.versionDate}
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif text-brand-dark group-hover:text-brand-green transition-colors">{article.title}</h3>
                  <p className="text-text-muted font-medium leading-relaxed">{article.summary}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-bg-base flex items-center justify-center text-text-muted group-hover:bg-brand-green group-hover:text-white transition-all shrink-0">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Info Sidebar */}
        <div className="space-y-8">
           <div className="bg-brand-dark text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Info className="w-6 h-6 text-brand-green" />
                </div>
                <h3 className="text-2xl font-serif leading-tight">Patient Question?</h3>
                <p className="text-white/60 leading-relaxed font-medium">
                  If something in these articles isn't clear, your clinic provider is your best resource. Write down your questions for your next visit.
                </p>
              </div>
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-brand-green/10 rounded-full blur-3xl" />
           </div>

           <div className="bg-bg-base border border-brand-beige rounded-[2.5rem] p-8">
             <h4 className="font-bold text-brand-dark uppercase tracking-widest text-[10px] mb-4">Reading Progress</h4>
             <div className="space-y-4">
                <div className="flex justify-between items-end mb-1">
                   <span className="text-xs font-bold text-brand-dark">Basics Pack</span>
                   <span className="text-xs font-bold text-brand-green">100%</span>
                </div>
                <div className="h-2 w-full bg-brand-beige rounded-full overflow-hidden">
                   <div className="h-full bg-brand-green w-full" />
                </div>
             </div>
           </div>
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-brand-dark/40 backdrop-blur-md"
            onClick={() => setSelectedArticle(null)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col"
          >
            <div className="p-8 md:p-12 border-b border-brand-beige flex items-center justify-between bg-bg-base/30 shrink-0">
               <div className="space-y-1">
                  <span className="text-[10px] font-bold text-brand-green uppercase tracking-[0.2em]">{selectedArticle.category}</span>
                  <h3 className="text-3xl font-serif text-brand-dark">{selectedArticle.title}</h3>
               </div>
               <button 
                onClick={() => setSelectedArticle(null)}
                className="w-12 h-12 rounded-full bg-white border border-brand-beige flex items-center justify-center hover:bg-brand-beige transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
               <div className="max-w-2xl mx-auto space-y-10">
                  <div className="bg-brand-green/5 border border-brand-green/10 rounded-[2rem] p-8 space-y-6">
                    <h4 className="font-serif italic text-xl text-brand-dark">Key Takeaways</h4>
                    <ul className="space-y-4">
                      {selectedArticle.points.map((point, i) => (
                        <li key={i} className="flex gap-4 items-start">
                          <div className="w-6 h-6 rounded-lg bg-brand-green flex items-center justify-center text-white shrink-0 mt-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                          <p className="text-brand-dark font-medium leading-snug">{point}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="prose prose-brand max-w-none">
                    <div className="markdown-body">
                      <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
                    </div>
                  </div>

                  {selectedArticle.sources && (
                    <div className="pt-10 border-t border-brand-beige">
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">Sources & Evidence</p>
                      <ul className="space-y-2">
                        {selectedArticle.sources.map((s, i) => (
                          <li key={i} className="text-xs text-text-muted italic">{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

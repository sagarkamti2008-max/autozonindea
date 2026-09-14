import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BookOpen, Cpu, ShieldAlert, Zap, Wrench, ChevronRight, Activity } from 'lucide-react';

export const AutoTechAcademyView = () => {
  const { academy, navigateTo } = useStore();
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = ['All', 'Networking', 'Software & Tuning', 'Diagnostics', 'Next-Gen Tech'];
  const filteredModules = activeCategory === 'All' ? academy : academy?.filter(m => m.category === activeCategory) || [];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 font-sans pb-20">
      
      {/* Hero Header */}
      <div className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
              <Cpu className="w-6 h-6 text-orange-500" />
            </div>
            <span className="text-orange-500 font-black tracking-widest uppercase text-sm">AutoZonIndia Technical Academy</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
            Master Advanced <br/> Automotive Diagnostics.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-medium leading-relaxed mb-10">
            Deep dive into CAN Bus communication, ECU calibration, UDS diagnostics, and Next-Gen ADAS/EV architecture. Learn the engineering behind modern vehicles.
          </p>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20">
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all ${activeCategory === cat ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map(module => (
            <div 
              key={module.id} 
              onClick={() => navigateTo('academy-detail', module.id)}
              className="bg-slate-800/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-700 hover:border-orange-500/50 transition-all cursor-pointer group flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/50 group-hover:bg-transparent transition-colors z-10"></div>
                <img src={module.image} alt={module.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 z-20 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-slate-700">
                  {module.category}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Activity className="w-4 h-4 text-orange-500" /> {module.difficulty}
                  </div>
                  <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <BookOpen className="w-4 h-4 text-blue-500" /> {module.duration}
                  </div>
                </div>
                
                <h3 className="text-xl font-black text-white mb-3 group-hover:text-orange-400 transition-colors leading-snug">
                  {module.title}
                </h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6 line-clamp-2">
                  {module.description}
                </p>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-700/50">
                  <span className="text-sm font-bold text-slate-300">Start Learning</span>
                  <div className="w-8 h-8 rounded-full bg-slate-700 group-hover:bg-orange-500 flex items-center justify-center transition-colors">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

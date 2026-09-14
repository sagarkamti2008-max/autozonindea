import React from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronRight, ArrowLeft, Settings, PenTool, CheckCircle, Clock, ShoppingCart, Calendar, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const AcademyArticleView = () => {
  const { academy, activeProductId, navigateTo, showToast } = useStore();
  const module = academy?.find(m => m.id === activeProductId);
  
  if (!module) {
    return (
      <div className="min-h-[60vh] bg-slate-900 flex flex-col items-center justify-center p-8 text-center text-white">
        <Settings className="w-16 h-16 text-slate-700 mb-4 animate-spin-slow" />
        <h2 className="text-2xl font-bold mb-2">Module Not Found</h2>
        <button onClick={() => navigateTo('academy')} className="text-orange-500 font-bold hover:underline">
          Back to Academy
        </button>
      </div>
    );
  }

  const handleBooking = () => {
    showToast(`🗓️ Service Request for ${module.title} sent to nearest AutoZon partner garage.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Header Image */}
      <div className="relative h-[40vh] md:h-[50vh] bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/60 z-10"></div>
        <img src={module.image} alt={module.title} className="w-full h-full object-cover" />
        
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <button onClick={() => navigateTo('academy')} className="flex items-center gap-2 text-slate-300 hover:text-white font-bold text-sm mb-6 transition-colors w-max">
            <ArrowLeft className="w-4 h-4" /> Back to Academy
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-orange-500 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg">
              {module.category}
            </span>
            <span className="bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-lg flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {module.duration}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight max-w-3xl mb-4 shadow-sm">
            {module.title}
          </h1>
          <p className="text-lg text-slate-300 font-medium max-w-2xl">
            {module.description}
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Main Content (Markdown) */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm">
            <div className="prose prose-slate prose-orange max-w-none">
              <ReactMarkdown>{module.content}</ReactMarkdown>
            </div>
          </div>
        </div>
        
        {/* Sidebar: Tools & Booking */}
        <div className="w-full lg:w-1/3 space-y-8">
          
          {/* Diagnostic Tools for Sale */}
          {module.tools_recommended?.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-24">
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-blue-500" /> Recommended Tools
              </h3>
              
              <div className="space-y-4">
                {module.tools_recommended.map(tool => (
                  <div key={tool.id} className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group cursor-pointer">
                    <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                      <img src={tool.image} alt={tool.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">{tool.name}</h4>
                      <div className="text-sm font-black text-slate-900 mb-2">₹{tool.price.toLocaleString('en-IN')}</div>
                      <button className="flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600">
                        <ShoppingCart className="w-3.5 h-3.5" /> Buy Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Service Booking Widget */}
          {module.service_available && (
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <h3 className="text-lg font-black text-white mb-2 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-500" /> Need Professional Help?
                </h3>
                <p className="text-slate-400 text-sm font-medium mb-6">
                  Book an AutoZon verified technician for advanced {module.title.toLowerCase()} diagnostics.
                </p>
                
                <div className="bg-slate-800/50 rounded-xl p-3 mb-6 border border-slate-700 flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Our technicians use OEM-level scan tools (VCDS, ISTA, XENTRY) for deep module scans and calibrations.
                  </p>
                </div>
                
                <button onClick={handleBooking} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30">
                  <Calendar className="w-4 h-4" /> Book Service Appointment
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

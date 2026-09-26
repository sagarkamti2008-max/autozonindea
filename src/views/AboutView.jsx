import React from 'react';
import { 
  ShieldCheck, Wrench, Car, Zap, Paintbrush, Package, 
  Sparkles, ArrowRight, Eye, Compass
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function AboutView() {
  const { navigateTo } = useStore();

  const servicesOffer = [
    { title: 'Car Parts', desc: '100% Genuine OEM & trusted aftermarket spare parts for all car makes.', icon: Package, color: 'text-orange-500 bg-orange-50' },
    { title: 'Car Accessories', desc: 'Premium 7D mats, seat covers, dash cams, LED lights, and styling accessories.', icon: Sparkles, color: 'text-amber-500 bg-amber-50' },
    { title: 'Automotive Service', desc: 'Comprehensive periodic maintenance, engine tuning, and fluid replacements.', icon: Car, color: 'text-blue-500 bg-blue-50' },
    { title: 'Electrical Work', desc: 'Advanced OBD-II diagnosis, wiring repairs, battery care, and ECU troubleshooting.', icon: Zap, color: 'text-yellow-500 bg-yellow-50' },
    { title: 'Denting & Painting', desc: 'Precision body repair, scratch removal, booth painting, and ceramic coating.', icon: Paintbrush, color: 'text-purple-500 bg-purple-50' },
    { title: 'Vehicle Maintenance Solutions', desc: 'End-to-end multi-point inspection, brake care, suspension & wheel alignment.', icon: ShieldCheck, color: 'text-emerald-500 bg-emerald-50' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 pt-10 px-4 sm:px-6 lg:px-8">
      {/* 1. Header / Hero Section */}
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 font-extrabold text-xs uppercase tracking-wider mb-4 border border-orange-200">
          <Car className="w-3.5 h-3.5" /> About Kamti Automotive
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
          Building the Future of <span className="text-orange-600">Automotive Excellence</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed mb-6 max-w-3xl mx-auto">
          <strong className="text-slate-900 font-bold">Kamti Automotive</strong> is an automotive business focused on providing quality <strong className="text-slate-900 font-bold">car parts, accessories, and automotive services</strong> for a wide range of vehicles.
        </p>
        <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
          Our goal is to make it easier for customers to find the right automotive products at competitive prices, with clear product information and reliable customer support.
        </p>
      </div>

      {/* 2. Vision Callout Box */}
      <div className="max-w-5xl mx-auto mb-16 bg-[#0B192C] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 text-amber-400 font-black text-xs uppercase tracking-widest mb-4">
            <Eye className="w-4 h-4" /> Our Core Vision
          </div>
          <h2 className="text-2xl sm:text-4xl font-black leading-tight mb-6 text-white">
            "Quality products, trusted service, and a better automotive experience."
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
            To build a trusted automotive brand where customers can conveniently find the products and services they need for their vehicles.
          </p>
        </div>
        <div className="absolute right-[-40px] bottom-[-40px] opacity-10 pointer-events-none">
          <Compass className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* 3. What We Offer Grid */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            What We Offer
          </h2>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-2">
            Complete Automotive Solutions Under One Roof
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesOffer.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-extrabold text-orange-600 gap-1">
                  <span>Explore {item.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Action Banner CTA */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-8 sm:p-10 text-center text-white shadow-lg shadow-orange-500/20">
        <h3 className="text-2xl sm:text-3xl font-black mb-3">Looking for Genuine Parts or Services?</h3>
        <p className="text-white/90 text-sm font-medium mb-6 max-w-xl mx-auto">
          Explore our complete catalog of spare parts or reach out to Kamti Automotive for expert assistance.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button 
            onClick={() => navigateTo('catalog')}
            className="bg-slate-950 hover:bg-black text-white font-extrabold py-3.5 px-8 rounded-full shadow-md transition-all text-sm flex items-center gap-2 cursor-pointer"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => navigateTo('contact')}
            className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold py-3.5 px-8 rounded-full shadow-md transition-all text-sm cursor-pointer"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}

export default AboutView;

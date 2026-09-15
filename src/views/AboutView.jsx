import React from 'react';
import { ShieldCheck, Award, Users, TrendingUp, Zap, MapPin, CheckCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function AboutView() {
  const { navigateTo } = useStore();

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-10 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
          Who We Are: <span className="text-orange-500">AutoZonIndia</span>
        </h1>
        <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
          Hum ek passionate team hain jinhone AutoZonIndia isliye shuru kiya taaki har car owner aur mechanic ko bina kisi pareshani ke 100% Genuine aur OEM quality spare parts mil sakein. 
        </p>
      </div>

      {/* Stats Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        {[
          { label: 'Genuine Parts', value: '100%', icon: Zap, color: 'text-orange-500' },
          { label: 'Happy Customers', value: '500K+', icon: Users, color: 'text-blue-500' },
          { label: 'Partner Garages', value: '2,500+', icon: Award, color: 'text-emerald-500' },
          { label: 'Cities Covered', value: 'Pan India', icon: MapPin, color: 'text-purple-500' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 text-center shadow-sm">
              <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
              <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-20 flex flex-col md:flex-row">
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="bg-orange-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6 text-orange-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Our Promise</h2>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
              <div>
                <strong className="text-slate-900 block">Genuine / OEM Quality Parts</strong>
                <span className="text-slate-600 text-sm">Sirf trusted brands aur manufacturers se direct supply. No fake parts guarantee.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
              <div>
                <strong className="text-slate-900 block">Sahi Fitment (100% Compatibility)</strong>
                <span className="text-slate-600 text-sm">Aapki car ke make & model ke hisaab se exact fitment parts, zero guesswork.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
              <div>
                <strong className="text-slate-900 block">Fast Delivery</strong>
                <span className="text-slate-600 text-sm">Express dispatch taaki aapki gaadi jaldi se theek hoke sadak par wapas aa sake.</span>
              </div>
            </li>
          </ul>

          <button 
            onClick={() => navigateTo('catalog')}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl w-max transition-colors"
          >
            Explore Catalog
          </button>
        </div>
        <div className="md:w-1/2 bg-slate-100 relative min-h-[300px]">
          <img 
            src="https://images.unsplash.com/photo-1611082607421-eb349942a20f?q=80&w=1470&auto=format&fit=crop" 
            alt="AutoZonIndia Warehouse" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default AboutView;

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronRight, ArrowLeft, Star, Settings, Battery, Gauge, MapPin, ShieldCheck, CheckCircle, Car } from 'lucide-react';

export const CarDetailView = () => {
  const { cars, activeProductId, navigateTo } = useStore();
  const car = cars?.find(c => c.id === activeProductId);
  const [activeTab, setActiveTab] = useState('specs');
  
  if (!car) {
    return (
      <div className="min-h-[60vh] bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
        <Car className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Car Not Found</h2>
        <button onClick={() => navigateTo('cars')} className="text-orange-500 font-bold hover:underline">
          Back to Cars
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-bold text-slate-500">
          <button onClick={() => navigateTo('home')} className="hover:text-slate-900 transition-colors">Home</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => navigateTo('cars')} className="hover:text-slate-900 transition-colors">Cars</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900">{car.make} {car.model}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Section: Images & Primary Info */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          
          {/* Image Gallery */}
          <div className="w-full lg:w-7/12">
            <button onClick={() => navigateTo('cars')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to listings
            </button>
            <div className="bg-white p-2 rounded-3xl border border-slate-200 shadow-sm">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 mb-2">
                <img src={car.images[0]} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {car.images.map((img, idx) => (
                  <div key={idx} className={`w-24 h-16 shrink-0 rounded-xl overflow-hidden cursor-pointer border-2 ${idx === 0 ? 'border-orange-500' : 'border-transparent hover:border-slate-300'}`}>
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Pricing & Key Details */}
          <div className="w-full lg:w-5/12">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm sticky top-24">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                    {car.make} {car.model}
                  </h1>
                  <p className="text-slate-500 font-bold mt-1">{car.variant}</p>
                </div>
                {car.status === 'used' ? (
                  <span className="bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">Used</span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">New</span>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-8">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-sm font-bold text-slate-700">{car.reviews.rating} Rating</span>
                <span className="text-slate-300">•</span>
                <span className="text-sm font-medium text-slate-500">{car.reviews.count} Reviews</span>
              </div>
              
              <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {car.status === 'used' ? 'Final Selling Price' : 'On-Road Price (Delhi)'}
                </div>
                <div className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                  ₹{Number(car.price_on_road).toLocaleString('en-IN')} <span className="text-sm text-slate-500 font-bold tracking-normal">*</span>
                </div>
                
                {car.status !== 'used' && car.price_ex_showroom && (
                  <div className="flex justify-between items-center text-sm font-medium text-slate-600 border-t border-slate-200 pt-3 mt-3">
                    <span>Ex-Showroom Price</span>
                    <span className="font-bold">₹{Number(car.price_ex_showroom).toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
              
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl transition-colors shadow-lg shadow-orange-500/30 mb-3">
                {car.status === 'used' ? 'Contact Seller' : 'Book a Test Drive'}
              </button>
              <button className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-4 rounded-xl transition-colors">
                Download Brochure
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs for Details */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-12">
          <div className="flex border-b border-slate-200 overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => setActiveTab('specs')}
              className={`px-8 py-5 text-sm font-black uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === 'specs' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50/30' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Key Specifications
            </button>
            <button 
              onClick={() => setActiveTab('features')}
              className={`px-8 py-5 text-sm font-black uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === 'features' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50/30' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Features & Safety
            </button>
          </div>
          
          <div className="p-6 sm:p-10">
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-orange-500" /> Engine & Performance
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Engine</span>
                      <span className="font-bold text-slate-900">{car.key_specs.engine}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Max Power</span>
                      <span className="font-bold text-slate-900">{car.key_specs.power}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Max Torque</span>
                      <span className="font-bold text-slate-900">{car.key_specs.torque}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Mileage (ARAI)</span>
                      <span className="font-bold text-emerald-600">{car.mileage}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Car className="w-5 h-5 text-blue-500" /> Dimensions & Capacity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Seating Capacity</span>
                      <span className="font-bold text-slate-900">{car.key_specs.seating} Person</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Boot Space</span>
                      <span className="font-bold text-slate-900">{car.key_specs.boot_space}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Ground Clearance</span>
                      <span className="font-bold text-slate-900">{car.key_specs.ground_clearance}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Body Type</span>
                      <span className="font-bold text-slate-900">{car.body_type}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'features' && (
              <div>
                 <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" /> Safety & Top Features
                  </h3>
                  <div className="bg-emerald-50 text-emerald-800 font-bold px-4 py-3 rounded-xl mb-6 inline-flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Safety Rating: {car.safety_rating}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {car.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <CheckCircle className="w-4 h-4 text-orange-500 shrink-0" />
                        <span className="font-bold text-slate-700 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Tie into Spare Parts */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white mb-2">Need spare parts for this car?</h2>
            <p className="text-slate-400 font-medium max-w-lg">
              AutoZonIndia guarantees 100% genuine OEM/OES fitment for {car.make} {car.model}. Browse our catalog of over 10,000 verified parts.
            </p>
          </div>
          <button onClick={() => navigateTo('catalog')} className="relative z-10 shrink-0 bg-orange-500 hover:bg-orange-600 text-white font-black py-4 px-8 rounded-xl transition-colors shadow-lg shadow-orange-500/30">
            Find Compatible Parts
          </button>
        </div>

      </div>
    </div>
  );
};

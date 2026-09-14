import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronRight, Filter, Search, Car, Calendar, DollarSign, Star } from 'lucide-react';

export const CarsLandingView = () => {
  const { cars, navigateTo } = useStore();
  const [activeTab, setActiveTab] = useState('new');
  
  const filteredCars = cars?.filter(c => c.status === activeTab) || [];
  
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Hero Header */}
      <div className="bg-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 top-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <span className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-4 block">The Ultimate Car Marketplace</span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            Find Your Dream Car. <br/> Upgrade Your Ride.
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10">
            Explore thousands of new, used, and upcoming cars with transparent on-road pricing, verified reviews, and expert specs.
          </p>
          
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-2 flex items-center shadow-2xl">
            <Search className="w-6 h-6 text-slate-400 ml-4 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Search by Brand, Model, or Budget..." 
              className="w-full bg-transparent text-slate-900 font-medium py-3 px-2 focus:outline-none"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-colors shrink-0">
              Search
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 flex justify-between md:justify-start gap-2 mb-10 overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActiveTab('new')}
            className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-colors ${activeTab === 'new' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            New Cars
          </button>
          <button 
            onClick={() => setActiveTab('used')}
            className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-colors ${activeTab === 'used' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            Used Cars
          </button>
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-colors ${activeTab === 'upcoming' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            Upcoming
          </button>
        </div>
        
        {/* Grid and Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-orange-500" />
                <h3 className="font-black text-slate-900">Filters</h3>
              </div>
              
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Budget</h4>
                <div className="space-y-2">
                  {['Under 10L', '10L - 15L', '15L - 25L', 'Above 25L'].map(b => (
                    <label key={b} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{b}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Body Type</h4>
                <div className="space-y-2">
                  {['SUV', 'Sedan', 'Hatchback', 'MUV'].map(b => (
                    <label key={b} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{b}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Car Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-900 capitalize">{activeTab} Cars</h2>
              <span className="text-sm font-medium text-slate-500">{filteredCars.length} results</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCars.map(car => (
                <div key={car.id} onClick={() => navigateTo('car-detail', car.id)} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-500/30 transition-all cursor-pointer group flex flex-col">
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <img src={car.images[0]} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    {car.is_latest && (
                      <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">
                        Just Launched
                      </div>
                    )}
                    {car.status === 'used' && (
                      <div className="absolute top-4 left-4 bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">
                        Certified Pre-Owned
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-orange-500 transition-colors leading-tight">
                          {car.make} {car.model}
                        </h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">{car.variant}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 mb-6">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        {car.status === 'used' ? 'Selling Price' : (car.status === 'upcoming' ? 'Expected Price' : 'On-Road Price')}
                      </div>
                      <div className="text-2xl font-black text-slate-900 tracking-tight">
                        ₹{Number(car.price_on_road).toLocaleString('en-IN')} <span className="text-sm text-slate-400 font-medium tracking-normal">*</span>
                      </div>
                    </div>
                    
                    {car.status === 'used' && car.used_details && (
                      <div className="grid grid-cols-2 gap-2 mb-6 text-xs font-medium text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-slate-400" /> {car.used_details.odometer}</div>
                        <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {car.year} Model</div>
                        <div className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-slate-400" /> {car.used_details.owners}</div>
                        <div className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-slate-400" /> {car.used_details.location}</div>
                      </div>
                    )}

                    {car.status !== 'used' && (
                       <div className="grid grid-cols-2 gap-2 mb-6 text-xs font-medium text-slate-600">
                         <div className="flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-slate-400" /> {car.fuel_type}</div>
                         <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {car.transmission}</div>
                       </div>
                    )}
                    
                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                        <Star className="w-4 h-4 fill-current" /> {car.reviews.rating > 0 ? car.reviews.rating : 'New'}
                      </div>
                      <div className="flex items-center gap-1 text-sm font-bold text-orange-500 group-hover:gap-2 transition-all">
                        View Details <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredCars.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                <Car className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No cars found</h3>
                <p className="text-slate-500">Try adjusting your filters to see more results.</p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

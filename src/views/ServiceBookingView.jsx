import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  MapPin, Wrench, Search, Star, Clock, ShieldCheck, 
  ChevronRight, Calendar, Info, Phone, ArrowRight, CheckCircle2 
} from 'lucide-react';

// Mock data for mechanics
const MECHANICS = [
  { id: 1, name: 'AutoCare Garage', rating: 4.8, reviews: 124, distance: '2.5 km', address: 'Andheri West, Mumbai', services: ['General Service', 'Brake Pad Replacement', 'Oil Change'], price: '₹499 onwards', isVerified: true, image: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Precision Motors', rating: 4.6, reviews: 89, distance: '4.1 km', address: 'Bandra East, Mumbai', services: ['Engine Diagnostics', 'Electrical', 'AC Service'], price: '₹799 onwards', isVerified: true, image: 'https://images.unsplash.com/photo-1625047509168-a7006f817ed2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Speedy Fix', rating: 4.2, reviews: 45, distance: '5.8 km', address: 'Goregaon, Mumbai', services: ['Suspension', 'Clutch', 'General Service'], price: '₹399 onwards', isVerified: false, image: 'https://images.unsplash.com/photo-1599256621730-535171e28e50?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
];

export function ServiceBookingView() {
  const { navigateTo, showToast } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [bookingStep, setBookingStep] = useState(1); // 1: list, 2: details, 3: success
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const filteredMechanics = MECHANICS.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBook = () => {
    if (!selectedDate || !selectedTime) {
      showToast('Please select date and time', 'error');
      return;
    }
    setBookingStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="bg-slate-950 text-white pt-10 pb-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="w-16 h-16 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Wrench className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Find Trusted Mechanics Near You</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
            Book professional installation for your purchased parts or regular maintenance at verified partner garages.
          </p>
          
          {bookingStep === 1 && (
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 max-w-2xl mx-auto flex items-center gap-2">
              <div className="pl-4">
                <MapPin className="w-5 h-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search by area, pincode or garage name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-white outline-none flex-1 py-3 px-2 placeholder:text-slate-500"
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition">
                Search
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
        {/* Step 1: List */}
        {bookingStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMechanics.map(mechanic => (
              <div key={mechanic.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition overflow-hidden flex flex-col group cursor-pointer" onClick={() => { setSelectedMechanic(mechanic); setBookingStep(2); }}>
                <div className="h-48 relative overflow-hidden">
                  <img src={mechanic.image} alt={mechanic.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  {mechanic.isVerified && (
                    <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-3 h-3" /> AutoZon Verified
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm">
                    <MapPin className="w-3 h-3" /> {mechanic.distance}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-black text-slate-900">{mechanic.name}</h3>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg text-sm font-bold border border-amber-100">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {mechanic.rating}
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm mb-4">{mechanic.address}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {mechanic.services.slice(0,2).map(s => (
                      <span key={s} className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md">{s}</span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Starts At</div>
                      <div className="font-black text-lg text-slate-900">{mechanic.price}</div>
                    </div>
                    <button className="bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-600 transition">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Detail & Booking */}
        {bookingStep === 2 && selectedMechanic && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 md:p-10 bg-slate-50 border-r border-slate-200">
              <button onClick={() => setBookingStep(1)} className="text-slate-500 hover:text-slate-900 font-bold text-sm flex items-center gap-1 mb-8">
                <ChevronRight className="w-4 h-4 rotate-180" /> Back to Search
              </button>
              
              <h2 className="text-3xl font-black text-slate-900 mb-2">{selectedMechanic.name}</h2>
              <div className="flex items-center gap-4 text-sm text-slate-500 font-medium mb-6">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedMechanic.address}</span>
                <span className="flex items-center gap-1 text-amber-600 font-bold"><Star className="w-4 h-4 fill-amber-500" /> {selectedMechanic.rating} ({selectedMechanic.reviews} Reviews)</span>
              </div>

              <div className="rounded-2xl overflow-hidden mb-8 h-64">
                <img src={selectedMechanic.image} alt={selectedMechanic.name} className="w-full h-full object-cover" />
              </div>

              <h4 className="font-bold text-slate-900 mb-4">Services Offered</h4>
              <ul className="space-y-3">
                {selectedMechanic.services.map(s => (
                  <li key={s} className="flex items-center gap-3 text-slate-600 font-medium bg-white p-3 rounded-xl border border-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:w-1/2 p-8 md:p-10 bg-white flex flex-col">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8 flex gap-4">
                <Info className="w-6 h-6 text-blue-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-blue-900 text-sm mb-1">Book Installation for your Orders</h4>
                  <p className="text-blue-700 text-xs">If you bought parts from AutoZonIndia, select an appointment slot. Our partner will inspect and install the parts securely.</p>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-6">Book an Appointment</h3>
              
              <div className="space-y-6 flex-1">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Select Date</label>
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Select Time</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['10:00 AM', '12:30 PM', '03:00 PM', '05:30 PM'].map(time => (
                      <button 
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 px-2 rounded-xl text-sm font-bold border transition ${selectedTime === time ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <button onClick={handleBook} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-xl shadow-xl flex justify-center items-center gap-2 transition">
                  Confirm Booking <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {bookingStep === 3 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-12 text-center max-w-2xl mx-auto mt-10">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Booking Confirmed!</h2>
            <p className="text-slate-500 text-lg mb-8">
              Your appointment at <strong className="text-slate-800">{selectedMechanic?.name}</strong> is confirmed for <strong className="text-slate-800">{selectedDate}</strong> at <strong className="text-slate-800">{selectedTime}</strong>.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 inline-block text-left">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Booking ID</div>
              <div className="text-2xl font-black text-slate-900 tracking-wider">AZ-{Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
            </div>
            <div>
              <button onClick={() => navigateTo('home')} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-xl transition">
                Return to Home
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ServiceBookingView;

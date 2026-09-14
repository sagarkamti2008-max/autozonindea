import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  AlertTriangle, Phone, MapPin, Truck, BatteryCharging, Wrench,
  Fuel, ShieldAlert, Clock, CheckCircle2, Navigation, MessageSquare, ArrowRight
} from 'lucide-react';

export const EmergencySupportView = () => {
  const { showToast, selectedVehicle } = useStore();
  const [selectedService, setSelectedService] = useState('towing');
  const [userLocation, setUserLocation] = useState('Mumbai-Pune Expressway (KM 42)');
  const [carPlateNumber, setCarPlateNumber] = useState('MH01AB1234');
  const [isDispatched, setIsDispatched] = useState(false);

  const emergencyServices = [
    {
      id: 'towing',
      name: 'Flatbed Towing Truck',
      icon: Truck,
      eta: '25-30 Mins',
      price: 1499,
      badge: 'MOST POPULAR',
      description: 'Hydraulic flatbed tow truck for safe transport to nearest Sagar Travels Auto Workshop without chassis damage.'
    },
    {
      id: 'battery',
      name: 'On-Spot Battery Jumpstart',
      icon: BatteryCharging,
      eta: '15-20 Mins',
      price: 399,
      badge: 'FAST DISPATCH',
      description: 'Mechanic arrives with high-output booster pack & fresh Exide/Amaron batteries for instant jumpstart.'
    },
    {
      id: 'tire',
      name: 'Flat Tire Replacement / Inflation',
      icon: Wrench,
      eta: '20-25 Mins',
      price: 499,
      badge: '24/7 ACTIVE',
      description: 'Step-by-step spare wheel swap or tubeless tire puncture repair kit deployment on-site.'
    },
    {
      id: 'fuel',
      name: 'Emergency Fuel Delivery (5L)',
      icon: Fuel,
      eta: '20 Mins',
      price: 799,
      badge: 'PETROL / DIESEL',
      description: 'Delivers 5 Litres of sealed BS6 Petrol or Diesel directly to your stalled vehicle location.'
    },
    {
      id: 'lockout',
      name: 'Key Lockout & Door Unlock',
      icon: ShieldAlert,
      eta: '25 Mins',
      price: 699,
      badge: 'EXPERT LOCKSMITH',
      description: 'Non-destructive door unlocking tool kit by certified auto locksmiths.'
    }
  ];

  const currentService = emergencyServices.find(s => s.id === selectedService);

  const handleSendSOS = () => {
    if (!userLocation.trim()) {
      showToast('❌ Please specify your breakdown location.');
      return;
    }

    const message = `🚨 *AUTOZON INDIA 24/7 EMERGENCY RSA BREAKDOWN SOS* 🚨\n\n` +
      `📌 *Service Needed*: ${currentService.name} (Est. ₹${currentService.price})\n` +
      `📍 *Location*: ${userLocation}\n` +
      `🚘 *Vehicle Plate No*: ${carPlateNumber.toUpperCase()}\n` +
      `🚗 *Vehicle Model*: ${selectedVehicle?.make || 'Toyota'} ${selectedVehicle?.model || 'Innova Crysta'}\n` +
      `⏱️ *Expected ETA*: ${currentService.eta}\n\n` +
      `⚡ *Please dispatch emergency RSA technician immediately to my location!*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/918591719499?text=${encodedMessage}`;

    setIsDispatched(true);
    showToast('🚨 SOS Emergency Alert Dispatched to WhatsApp (+91 8591719499)!');
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* SOS Emergency Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 border-2 border-rose-600/50 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-black uppercase tracking-wider animate-pulse">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>AutoZon 24/7 Roadside Assistance (RSA)</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Emergency Highway Breakdown & Towing
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Stuck on the highway or city road? One-click SOS dispatches Sagar Travels flatbed tow trucks, battery jumpstart units, and tire technicians to your exact GPS location within 25 minutes.
              </p>
            </div>

            {/* Direct Emergency Call Button */}
            <button
              onClick={() => window.open('tel:+918591719499')}
              className="bg-rose-600 hover:bg-rose-500 text-white font-black text-sm px-6 py-4 rounded-2xl transition flex items-center justify-center gap-3 shrink-0 shadow-xl shadow-rose-600/40 cursor-pointer"
            >
              <Phone className="w-5 h-5 fill-white animate-bounce" />
              <span>Call Helpline: +91 8591719499</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Service Selection & SOS Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Emergency Service Cards */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              Select Required Emergency Assistance:
            </h2>

            <div className="space-y-3">
              {emergencyServices.map(srv => {
                const IconComponent = srv.icon;
                const isSelected = selectedService === srv.id;
                return (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedService(srv.id)}
                    className={`p-5 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-rose-950/40 border-rose-500 text-white shadow-xl shadow-rose-500/10'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3.5 rounded-xl border ${
                        isSelected 
                          ? 'bg-rose-600 text-white border-rose-400' 
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-white text-base">{srv.name}</h3>
                          <span className="bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[10px] font-black px-2 py-0.5 rounded">
                            {srv.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{srv.description}</p>
                        <div className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-2">
                          <span className="text-amber-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> ETA: {srv.eta}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg font-black text-rose-400">₹{srv.price}</div>
                      <div className="text-[10px] text-slate-500">Fixed RSA Fee</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: GPS Location & Dispatch Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/90 border-2 border-rose-500/40 rounded-3xl p-6 space-y-6 shadow-2xl">
              
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-rose-500" />
                  Dispatch Emergency Unit
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your current location & vehicle number for immediate technician tracking.
                </p>
              </div>

              {/* Location Input */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-300 tracking-wider">
                  📍 Current Breakdown Location / Highway KM Marker
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userLocation}
                    onChange={(e) => setUserLocation(e.target.value)}
                    placeholder="e.g. Western Express Highway, Goregaon East, Mumbai"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                  <button
                    onClick={() => {
                      setUserLocation('GPS Location: 19.0760° N, 72.8777° E (Mumbai MMR)');
                      showToast('📍 GPS Location Acquired!');
                    }}
                    className="absolute right-2 top-2 bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Auto GPS
                  </button>
                </div>
              </div>

              {/* Vehicle Registration Plate Input */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-300 tracking-wider">
                  🚘 Vehicle Registration Plate Number
                </label>
                <input
                  type="text"
                  value={carPlateNumber}
                  onChange={(e) => setCarPlateNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. MH01AB1234"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold tracking-widest placeholder-slate-500 uppercase focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Selected Summary Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Selected Assistance:</span>
                  <span className="font-bold text-white">{currentService?.name}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Estimated Technician ETA:</span>
                  <span className="font-bold text-amber-400">{currentService?.eta}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 border-t border-slate-800 pt-2">
                  <span className="font-bold text-white">Total Service Charge:</span>
                  <span className="text-base font-black text-rose-400">₹{currentService?.price}</span>
                </div>
              </div>

              {/* Dispatch SOS WhatsApp Button */}
              <button
                onClick={handleSendSOS}
                className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-sm py-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-xl shadow-rose-600/40 cursor-pointer uppercase tracking-wider"
              >
                <MessageSquare className="w-5 h-5 fill-white" />
                <span>Dispatch SOS via WhatsApp (+91 8591719499)</span>
              </button>

              {isDispatched && (
                <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-2xl p-4 text-center space-y-1">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-black text-xs uppercase">
                    <CheckCircle2 className="w-4 h-4" /> RSA Technician Assigned
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Sagar Travels Towing Truck #AZ-RSA-402 is en route to your location.
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

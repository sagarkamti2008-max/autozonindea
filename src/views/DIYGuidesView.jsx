import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Wrench, PlayCircle, Clock, Award, ShieldAlert, CheckCircle2,
  ShoppingCart, ArrowRight, Video, Sparkles, BookOpen, Layers, X
} from 'lucide-react';

export const DIYGuidesView = () => {
  const { showToast, addToCart, navigateTo } = useStore();
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const diyGuides = [
    {
      id: 'diy-01',
      title: 'How to Replace Spark Plugs in Maruti Suzuki Swift / WagonR (K12 Engine)',
      category: 'Engine & Electrical',
      difficulty: 'Beginner',
      time: '20 Mins',
      recommendedPartId: 'BOSCH-SP-FR7DC',
      recommendedPartName: 'Bosch Super 4 Iridium Spark Plug Set (Set of 4)',
      partPrice: 1250,
      partMrp: 1800,
      partImage: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop&q=60',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      toolsRequired: ['16mm Spark Plug Socket', 'Ratchet Wrench', 'Feeler Gauge (0.8mm)', 'Dielectric Grease'],
      description: 'Step-by-step master tutorial on inspecting, gapping, and installing Bosch Iridium spark plugs for smooth engine idling and 15% better fuel efficiency.',
      steps: [
        'Disconnect the negative battery terminal for electrical safety.',
        'Remove the top engine plastic cover by unscrewing the 10mm bolts.',
        'Unplug the ignition coil electrical connectors and unbolt each coil.',
        'Use a 16mm spark plug socket with a ratchet extension to turn counter-clockwise and remove old spark plugs.',
        'Check electrode gap (0.8mm for Petrol Swift/WagonR). Hand-thread new Bosch Iridium plugs to avoid cross-threading.',
        'Torque new plugs to 25 Nm. Reinstall ignition coils and reconnect battery.'
      ]
    },
    {
      id: 'diy-02',
      title: 'How to Install 120W Ultra-LED Headlight Bulbs (H4 / H7 Fitting)',
      category: 'Lighting & Electronics',
      difficulty: 'Easy',
      time: '15 Mins',
      recommendedPartId: 'MINDA-LED-120W',
      recommendedPartName: 'Uno Minda 120W LED Headlight Conversion Kit (6000K Turbo White)',
      partPrice: 3499,
      partMrp: 5500,
      partImage: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500&auto=format&fit=crop&q=60',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      toolsRequired: ['Gloves', 'Flathead Screwdriver', 'Zip Ties'],
      description: 'Upgrade stock halogen bulbs to 6000K crisp white LED project illumination without cutting any original wire harness.',
      steps: [
        'Open the engine hood and access the rear dust cover of the headlight assembly.',
        'Pry open the rubber dust boot and unhook the metal retaining spring clip.',
        'Pull out the stock halogen bulb gently without touching the glass tube.',
        'Align the Uno Minda LED locking ring into the socket slot and lock the spring clip.',
        'Insert the LED bulb body, twist 45 degrees clockwise to lock into position.',
        'Plug in the CANBUS ballast connector to the OEM socket and secure wiring with zip ties.'
      ]
    },
    {
      id: 'diy-03',
      title: 'Complete DIY Synthetic Engine Oil & Oil Filter Change Guide',
      category: 'Maintenance & Fluids',
      difficulty: 'Intermediate',
      time: '40 Mins',
      recommendedPartId: 'CAS-COOL-RED3L',
      recommendedPartName: 'Castrol MAGNATEC 5W-30 Full Synthetic Oil (4 Litres) + Elofic Filter',
      partPrice: 2850,
      partMrp: 3900,
      partImage: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&auto=format&fit=crop&q=60',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      toolsRequired: ['Oil Drain Pan', '17mm Box Wrench', 'Oil Filter Wrench Strap', 'New Oil Plug Washer', 'Funnel'],
      description: 'Learn how to drain old engine sludge, change the oil filter, and refill with premium 5W-30 synthetic oil to double your engine lifespan.',
      steps: [
        'Warm up the engine for 3 minutes to thin out oil viscosity, then park on flat ground with handbrake ON.',
        'Jack up front of car and secure on heavy-duty jack stands.',
        'Place oil drain pan underneath the oil pan bolt. Unscrew 17mm drain plug and let engine oil drain completely (10 mins).',
        'Unscrew the oil filter using an oil filter wrench strap. Wipe the engine mounting surface clean.',
        'Apply fresh engine oil onto the rubber gasket of the new filter. Hand-tighten until snug + 3/4 turn.',
        'Re-install drain plug with a new copper crush washer. Pour 3.5L to 4.0L Castrol Magnatec oil using a clean funnel.',
        'Start engine, check for leaks under oil filter, pull dipstick to verify correct oil mark level.'
      ]
    },
    {
      id: 'diy-04',
      title: 'Front Brake Disc Pads Inspection & Replacement Masterclass',
      category: 'Brakes & Suspension',
      difficulty: 'Advanced',
      time: '50 Mins',
      recommendedPartId: 'AZ-BR-ROT-V2',
      recommendedPartName: 'TVS Girling High Performance Ceramic Front Brake Pads',
      partPrice: 1899,
      partMrp: 2700,
      partImage: 'https://images.unsplash.com/photo-1600792842901-b384ff8046b4?w=500&auto=format&fit=crop&q=60',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      toolsRequired: ['Lug Nut Wrench', '14mm Socket Wrench', 'C-Clamp Piston Press', 'Wire Brush', 'Brake Cleaner Spray'],
      description: 'Stop squeaking noises and improve emergency braking distance by replacing worn ceramic brake pads step-by-step.',
      steps: [
        'Loosen wheel lug nuts while car is on ground, then jack up car and remove front wheels.',
        'Unbolt the 14mm lower caliper guide pin bolt and pivot the caliper bracket upward.',
        'Slide out old brake pads and anti-rattle stainless steel shims.',
        'Spray brake cleaner on rotor and wire brush caliper bracket slider pins.',
        'Use a C-Clamp to compress caliper piston smoothly back into its housing to make space for thick new pads.',
        'Install new ceramic brake pads with anti-squeal grease on rear backing plates, bolt caliper, and pump brake pedal 5 times before driving!'
      ]
    }
  ];

  const filteredGuides = activeTab === 'all' 
    ? diyGuides 
    : diyGuides.filter(g => g.category.toLowerCase().includes(activeTab.toLowerCase()));

  const handleAddToCart = (guide) => {
    const item = {
      id: guide.recommendedPartId,
      name: guide.recommendedPartName,
      price: guide.partPrice,
      mrp: guide.partMrp,
      image: guide.partImage,
      quantity: 1,
      fitmentStatus: '100% Guaranteed Fitment'
    };
    addToCart(item);
    showToast(`🛒 Added ${guide.recommendedPartName} to Cart!`);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Header Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-2 border-blue-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-400 text-xs font-black uppercase tracking-wider">
              <Wrench className="w-4 h-4 text-blue-400" />
              <span>AutoZon Mechanic Masterclass</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Car Maintenance DIY Guides & Video Tutorials
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Save thousands on mechanic labor charges! Learn step-by-step how to replace spark plugs, headlights, engine oil, and brake pads yourself with genuine AutoZon spare parts.
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All DIY Tutorials' },
            { id: 'engine', label: 'Engine & Electrical' },
            { id: 'lighting', label: 'Lighting & LEDs' },
            { id: 'maintenance', label: 'Maintenance & Oil' },
            { id: 'brakes', label: 'Brakes & Suspension' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400'
                  : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* DIY Guides Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGuides.map(guide => (
            <div 
              key={guide.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-6 transition flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="space-y-3">
                {/* Meta info header */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-300">
                    {guide.category}
                  </span>
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Clock className="w-3.5 h-3.5" /> {guide.time}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      guide.difficulty === 'Beginner' ? 'bg-emerald-500/20 text-emerald-400' :
                      guide.difficulty === 'Easy' ? 'bg-blue-500/20 text-blue-400' :
                      guide.difficulty === 'Intermediate' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {guide.difficulty}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-black text-white leading-snug">
                  {guide.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {guide.description}
                </p>

                {/* Tools required tags */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Tools Required:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {guide.toolsRequired.map((tool, idx) => (
                      <span key={idx} className="bg-slate-950 text-slate-300 border border-slate-800 text-[10px] px-2 py-1 rounded-lg">
                        🔧 {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Genuine Part Box */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={guide.partImage} alt={guide.recommendedPartName} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-700" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wide truncate">Matching OEM Part</div>
                    <div className="text-xs font-bold text-white truncate">{guide.recommendedPartName}</div>
                    <div className="text-xs font-black text-emerald-400">₹{guide.partPrice} <span className="text-[10px] text-slate-500 line-through">₹{guide.partMrp}</span></div>
                  </div>
                </div>
                <button
                  onClick={() => handleAddToCart(guide)}
                  className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl font-bold text-xs shrink-0 transition flex items-center gap-1 cursor-pointer"
                  title="Add Part to Cart"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setSelectedGuide(guide)}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <PlayCircle className="w-4 h-4 fill-slate-950 text-amber-500" />
                  <span>Watch Tutorial & Steps</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Step-By-Step Interactive Modal */}
        {selectedGuide && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative shadow-2xl">
              <button 
                onClick={() => setSelectedGuide(null)}
                className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-400 text-xs font-black uppercase">
                  {selectedGuide.category} • {selectedGuide.time}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {selectedGuide.title}
                </h2>
              </div>

              {/* Video Player Box */}
              <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center group">
                <img src={selectedGuide.partImage} alt="Video preview" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="relative z-10 text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-2xl cursor-pointer hover:scale-110 transition">
                    <PlayCircle className="w-10 h-10 fill-slate-950" />
                  </div>
                  <div className="text-xs font-black text-white uppercase tracking-wider">Play Full HD Video Tutorial</div>
                  <div className="text-[10px] text-slate-400">Recorded by AutoZon Master Technicians</div>
                </div>
              </div>

              {/* Step By Step Instructions */}
              <div className="space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  Step-by-Step Installation Procedure:
                </h3>
                <div className="space-y-3">
                  {selectedGuide.steps.map((step, idx) => (
                    <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer Buy Button */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-slate-400">Required Spare Part:</div>
                  <div className="text-sm font-black text-white">{selectedGuide.recommendedPartName}</div>
                  <div className="text-sm font-black text-emerald-400">₹{selectedGuide.partPrice}</div>
                </div>
                <button
                  onClick={() => {
                    handleAddToCart(selectedGuide);
                    setSelectedGuide(null);
                  }}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-6 py-3 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/30"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Buy Required Genuine Part Now</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  ArrowRightLeft, X, ShoppingCart, Star, ShieldCheck, ArrowLeft,
  CheckCircle2, Sparkles, Zap, FileText, ExternalLink
} from 'lucide-react';

export const CompareView = () => {
  const { compareList, toggleCompare, addToCart, navigateTo, showToast } = useStore();

  // Initial Sample Comparison Items if list is empty
  const defaultCompareItems = [
    {
      id: 'prod-013',
      title: 'Bosch Platinum-Iridium Super Spark Plug Set (4 Pcs)',
      category: 'engine_parts',
      brand: 'BOSCH',
      price: 1450,
      originalPrice: 2100,
      discount: '31% OFF',
      rating: 4.9,
      reviewsCount: 215,
      oemPartNumber: 'BOSCH-SP-FR7DC',
      compatibility: 'Fits Swift, Baleno, Creta, City, Nexon',
      features: ['0.6mm Iridium Tip', '60,000 KM Life', 'Pre-gapped Factory Spec'],
      warranty: '1 Year Bosch Warranty',
      weight: '0.45 kg',
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'prod-015',
      title: 'Uno Minda 120W LED Projector Headlight Kit (9005/H7)',
      category: 'lighting_electrical',
      brand: 'UNO MINDA',
      price: 3199,
      originalPrice: 4999,
      discount: '36% OFF',
      rating: 4.9,
      reviewsCount: 380,
      oemPartNumber: 'MINDA-LED-120W',
      compatibility: 'Universal Fit (Swift, Creta, Thar, Fortuner)',
      features: ['14,000 Lumens Output', '6500K Cool White', 'IP68 Waterproof'],
      warranty: '2 Years Manufacturer Warranty',
      weight: '0.80 kg',
      image: '/images/led_headlight_exterior.jpg'
    },
    {
      id: 'prod-014',
      title: 'Gabriel Heavy-Duty Hydraulic Front Shock Absorber',
      category: 'suspension_steering',
      brand: 'Gabriel India',
      price: 2890,
      originalPrice: 3990,
      discount: '27% OFF',
      rating: 4.8,
      reviewsCount: 168,
      oemPartNumber: 'GAB-SA-SWF18',
      compatibility: 'Fits Swift, Dzire, Baleno, Creta',
      features: ['G-Force Dampening', 'Chromed Piston Rod', 'All-Weather Fluid'],
      warranty: '1 Year / 20,000 KM Warranty',
      weight: '3.20 kg',
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const compareItems = (compareList && compareList.length > 0) ? compareList : defaultCompareItems;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Comparison Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <div className="space-y-1">
            <button
              onClick={() => navigateTo('catalog')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00E5FF] hover:underline mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Parts Catalog
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <ArrowRightLeft className="w-7 h-7 text-[#FF5722]" />
              Side-by-Side Spare Parts Comparison Matrix
            </h1>
            <p className="text-xs text-slate-400">
              Comparing {compareItems.length} genuine spare parts on specs, warranty, OEM numbers, and pricing
            </p>
          </div>

          <button
            onClick={() => navigateTo('catalog')}
            className="bg-[#FF5722] hover:bg-[#E64A19] text-white font-black text-xs px-5 py-3 rounded-2xl shadow transition cursor-pointer"
          >
            + Add More Parts to Compare
          </button>
        </div>


        {/* Side-by-Side Comparison Table Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              
              {/* Product Header Row */}
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800">
                  <th className="p-4 sm:p-5 w-48 text-xs font-black uppercase text-slate-400 tracking-wider">
                    Spare Part Spec
                  </th>
                  {compareItems.map(item => (
                    <th key={item.id} className="p-4 sm:p-5 w-64 align-top border-l border-slate-800">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#FF5722]/20 text-[#FF7043] border border-[#FF5722]/30">
                            {item.brand}
                          </span>
                          {compareList && compareList.length > 0 && (
                            <button
                              onClick={() => toggleCompare(item)}
                              className="text-slate-500 hover:text-rose-400 p-1"
                              title="Remove"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="h-28 bg-slate-900 border border-slate-800 rounded-2xl p-2 flex items-center justify-center overflow-hidden">
                          <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain" />
                        </div>

                        <h4 className="text-xs font-bold text-white leading-snug line-clamp-2 h-8">
                          {item.title}
                        </h4>

                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-black text-white">₹{item.price.toLocaleString()}</span>
                          {item.originalPrice && (
                            <span className="text-xs text-slate-500 line-through">₹{item.originalPrice.toLocaleString()}</span>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            addToCart(item, 1);
                            showToast(`🛒 Added ${item.title} to cart!`);
                          }}
                          className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-extrabold text-xs py-2.5 rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Comparison Attributes Body */}
              <tbody className="divide-y divide-slate-800/60 text-xs">
                
                {/* Row 1: Brand */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Manufacturer Brand</td>
                  {compareItems.map(p => (
                    <td key={p.id} className="p-4 font-extrabold text-white border-l border-slate-800">
                      {p.brand}
                    </td>
                  ))}
                </tr>

                {/* Row 2: OEM Part Number */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">OEM Part Number</td>
                  {compareItems.map(p => (
                    <td key={p.id} className="p-4 font-mono font-bold text-amber-400 border-l border-slate-800">
                      {p.oemPartNumber || p.partNumber || 'AZI-GENUINE'}
                    </td>
                  ))}
                </tr>

                {/* Row 3: Fitment Compatibility */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Vehicle Compatibility</td>
                  {compareItems.map(p => (
                    <td key={p.id} className="p-4 border-l border-slate-800">
                      <span className="inline-block bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 text-[11px] font-extrabold px-2 py-1 rounded-lg">
                        {p.compatibility || 'Fits Selected Garage Car'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Row 4: Key Features */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Key Performance Highlights</td>
                  {compareItems.map(p => (
                    <td key={p.id} className="p-4 border-l border-slate-800">
                      <ul className="space-y-1 text-[11px] text-slate-300">
                        {(p.features || ['100% Genuine OEM Quality', 'Direct Fit']).map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Row 5: Warranty */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Warranty & Service Guarantee</td>
                  {compareItems.map(p => (
                    <td key={p.id} className="p-4 font-bold text-emerald-400 border-l border-slate-800">
                      🛡️ {p.warranty || '1 Year Brand Warranty'}
                    </td>
                  ))}
                </tr>

                {/* Row 6: Rating */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Customer Ratings</td>
                  {compareItems.map(p => (
                    <td key={p.id} className="p-4 font-bold text-amber-400 border-l border-slate-800">
                      ⭐ {p.rating || 4.9} / 5.0 ({p.reviewsCount || 150} Verified Reviews)
                    </td>
                  ))}
                </tr>

                {/* Row 7: Weight & Package Spec */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Item Weight & Specs</td>
                  {compareItems.map(p => (
                    <td key={p.id} className="p-4 text-slate-300 border-l border-slate-800">
                      📦 {p.weight || '1.2 kg Box'}
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

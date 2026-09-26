import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ArrowRightLeft, X, ShoppingCart, Star, ShieldCheck, ArrowLeft,
  CheckCircle2, Sparkles, Zap, FileText, ExternalLink, MessageCircle, Plus, Search, Trash2, Award
} from 'lucide-react';

export const CompareView = () => {
  const { compareList, toggleCompare, addToCart, navigateTo, showToast, products } = useStore();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

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
      inStock: true,
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
      inStock: true,
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
      inStock: true,
      oemPartNumber: 'GAB-SA-SWF18',
      compatibility: 'Fits Swift, Dzire, Baleno, Creta',
      features: ['G-Force Dampening', 'Chromed Piston Rod', 'All-Weather Fluid'],
      warranty: '1 Year / 20,000 KM Warranty',
      weight: '3.20 kg',
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const compareItems = (compareList && compareList.length > 0) ? compareList : defaultCompareItems;

  // Calculate lowest price & highest rating items for badges
  const minPrice = Math.min(...compareItems.map(item => item.price || 999999));
  const maxRating = Math.max(...compareItems.map(item => item.rating || 0));

  // Available products in store for adding to comparison
  const availableProducts = (products || []).filter(
    p => !compareItems.some(ci => ci.id === p.id)
  ).filter(
    p => !pickerSearch.trim() || 
         p.title?.toLowerCase().includes(pickerSearch.toLowerCase()) || 
         p.brand?.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  // Send comparison details via WhatsApp
  const handleWhatsAppComparisonInquiry = () => {
    let summaryText = `Hi SAGAR TRAVELS / KAMTI AUTOMOTIVE (+91 8591719499),\nI am comparing the following spare parts on your website:\n\n`;
    
    compareItems.forEach((item, index) => {
      summaryText += `${index + 1}. *${item.title}*\n   - Brand: ${item.brand || 'OEM'}\n   - Price: ₹${(item.price || 0).toLocaleString('en-IN')}\n   - OEM Part #: ${item.oemPartNumber || item.partNumber || 'N/A'}\n\n`;
    });

    summaryText += `Please assist me with bulk availability, final pricing, and fitment confirmation.`;
    window.open(`https://wa.me/918591719499?text=${encodeURIComponent(summaryText)}`, '_blank');
  };

  // WhatsApp Order single item
  const handleWhatsAppOrderItem = (item) => {
    const text = `Hi SAGAR TRAVELS,\nI would like to order this spare part after comparing:\n\n` +
      `📦 *${item.title}*\n` +
      `🏷️ Brand: ${item.brand || 'OEM'}\n` +
      `💰 Price: ₹${(item.price || 0).toLocaleString('en-IN')}\n` +
      `🔢 Part #: ${item.oemPartNumber || item.partNumber || 'N/A'}\n\n` +
      `Please confirm stock and delivery terms.`;
    window.open(`https://wa.me/918591719499?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Comparison Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="space-y-2">
            <button
              onClick={() => navigateTo('catalog')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00E5FF] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Parts Catalog
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <ArrowRightLeft className="w-7 h-7 text-[#FF5722]" />
              Spare Parts Side-by-Side Comparison Matrix
            </h1>
            <p className="text-xs text-slate-400">
              Comparing <strong className="text-white">{compareItems.length}</strong> spare parts on specs, pricing, OEM numbers, warranty, and verified customer ratings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => setIsPickerOpen(true)}
              className="flex-1 lg:flex-none bg-gradient-to-r from-[#FF5722] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs px-5 py-3 rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Parts to Compare
            </button>
            <button
              onClick={handleWhatsAppComparisonInquiry}
              className="flex-1 lg:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-5 py-3 rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Send Comparison to WhatsApp
            </button>
          </div>
        </div>

        {/* Side-by-Side Comparison Table Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              
              {/* Product Header Row */}
              <thead>
                <tr className="bg-slate-950/90 border-b border-slate-800">
                  <th className="p-4 sm:p-5 w-52 text-xs font-black uppercase text-slate-400 tracking-wider">
                    Specification / Attribute
                  </th>
                  {compareItems.map(item => {
                    const isLowestPrice = item.price === minPrice;
                    const isHighestRated = item.rating === maxRating && maxRating > 0;

                    return (
                      <th key={item.id} className="p-4 sm:p-5 w-64 align-top border-l border-slate-800">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#FF5722]/20 text-[#FF7043] border border-[#FF5722]/30">
                              {item.brand || 'OEM'}
                            </span>

                            <div className="flex items-center gap-1">
                              {isLowestPrice && (
                                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5">
                                  <Award className="w-3 h-3" /> Best Price
                                </span>
                              )}
                              {compareList && compareList.length > 0 && (
                                <button
                                  onClick={() => toggleCompare(item)}
                                  className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                                  title="Remove from comparison"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="h-32 bg-slate-950 border border-slate-800 rounded-2xl p-2 flex items-center justify-center overflow-hidden">
                            <img
                              src={item.image || '/kamti-logo.png'}
                              alt={item.title}
                              onError={(e) => { e.target.src = '/kamti-logo.png'; }}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>

                          <h4 className="text-xs font-bold text-white leading-snug line-clamp-2 h-8">
                            {item.title}
                          </h4>

                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="text-lg font-black text-white">₹{(item.price || 0).toLocaleString('en-IN')}</span>
                              {item.originalPrice && (
                                <span className="text-xs text-slate-500 line-through ml-2">₹{item.originalPrice.toLocaleString('en-IN')}</span>
                              )}
                            </div>
                            {item.discount && (
                              <span className="text-[10px] font-extrabold text-emerald-400">{item.discount}</span>
                            )}
                          </div>

                          <div className="space-y-1.5 pt-1">
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

                            <button
                              onClick={() => handleWhatsAppOrderItem(item)}
                              className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp Order</span>
                            </button>
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* Comparison Attributes Body */}
              <tbody className="divide-y divide-slate-800/60 text-xs">
                
                {/* Row 1: Brand */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Manufacturer Brand</td>
                  {compareItems.map(p => (
                    <td key={p.id} className="p-4 font-extrabold text-white border-l border-slate-800">
                      {p.brand || 'Genuine OEM'}
                    </td>
                  ))}
                </tr>

                {/* Row 2: OEM Part Number */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">OEM Part Number</td>
                  {compareItems.map(p => (
                    <td key={p.id} className="p-4 font-mono font-bold text-amber-400 border-l border-slate-800">
                      {p.oemPartNumber || p.partNumber || 'KMT-OEM-GENUINE'}
                    </td>
                  ))}
                </tr>

                {/* Row 3: Fitment Compatibility */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Vehicle Compatibility</td>
                  {compareItems.map(p => (
                    <td key={p.id} className="p-4 border-l border-slate-800">
                      <span className="inline-block bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 text-[11px] font-extrabold px-2.5 py-1 rounded-lg">
                        {p.compatibility || 'Fits Selected Garage Car'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Row 4: Stock Availability */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Stock Status</td>
                  {compareItems.map(p => (
                    <td key={p.id} className="p-4 border-l border-slate-800">
                      {p.inStock !== false ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-extrabold text-xs">
                          <CheckCircle2 className="w-4 h-4" /> Ready for Immediate Dispatch
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-rose-400 font-extrabold text-xs">
                          Out of Stock (Special Order)
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Row 5: Key Features */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Key Performance Features</td>
                  {compareItems.map(p => (
                    <td key={p.id} className="p-4 border-l border-slate-800">
                      <ul className="space-y-1.5 text-[11px] text-slate-300">
                        {(p.features || ['100% Genuine OEM Fit', 'Direct Factory Replacement']).map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Row 6: Warranty */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Warranty & Guarantee</td>
                  {compareItems.map(p => (
                    <td key={p.id} className="p-4 font-bold text-emerald-400 border-l border-slate-800">
                      🛡️ {p.warranty || '1 Year Manufacturer Warranty'}
                    </td>
                  ))}
                </tr>

                {/* Row 7: Rating */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Customer Ratings</td>
                  {compareItems.map(p => (
                    <td key={p.id} className="p-4 font-bold text-amber-400 border-l border-slate-800">
                      ⭐ {p.rating || 4.9} / 5.0 ({p.reviewsCount || 150} Verified Reviews)
                    </td>
                  ))}
                </tr>

                {/* Row 8: Weight & Package Spec */}
                <tr className="hover:bg-slate-800/30">
                  <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Item Weight & Box Specs</td>
                  {compareItems.map(p => (
                    <td key={p.id} className="p-4 text-slate-300 border-l border-slate-800 font-mono">
                      📦 {p.weight || '1.2 kg Box'}
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add Product Modal Drawer */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#FF5722]" /> Select Part to Add to Comparison
              </h3>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search by part name or brand..."
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5722]"
              />
            </div>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {availableProducts.length > 0 ? (
                availableProducts.map(prod => (
                  <div
                    key={prod.id}
                    className="p-3 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center justify-between gap-3 hover:bg-slate-900 transition"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={prod.image || '/kamti-logo.png'}
                        alt={prod.title}
                        onError={(e) => { e.target.src = '/kamti-logo.png'; }}
                        className="w-10 h-10 object-contain bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0"
                      />
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold text-white truncate">{prod.title}</h4>
                        <div className="text-[10px] text-slate-400 font-bold">{prod.brand} • ₹{(prod.price || 0).toLocaleString('en-IN')}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        toggleCompare(prod);
                        setIsPickerOpen(false);
                      }}
                      className="px-3 py-1.5 bg-[#FF5722] hover:bg-[#E64A19] text-white font-extrabold text-xs rounded-xl transition cursor-pointer shrink-0"
                    >
                      + Compare
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 text-xs font-medium">
                  No additional spare parts found matching "{pickerSearch}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

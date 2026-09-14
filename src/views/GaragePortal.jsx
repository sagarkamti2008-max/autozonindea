import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Wrench, Building, FileText, Download, Printer, Percent, ShieldCheck,
  CheckCircle2, DollarSign, ArrowRight, Tag, PhoneCall, Layers, Send, Search
} from 'lucide-react';

export const GaragePortal = () => {
  const { products, showToast, navigateTo } = useStore();

  const [activeTab, setActiveTab] = useState('wholesale'); // 'wholesale', 'invoice', 'rfq'
  
  // GST Invoice Generator Form State
  const [gstForm, setGstForm] = useState({
    businessName: 'SpeedMotors Performance Garage & Auto Spares',
    gstin: '27AAAAA0000A1Z5',
    contactPerson: 'Sagar Kamti (Proprietor)',
    phone: '+91 8591719499',
    address: 'Shop 12, GIC Compound, Western Express Highway, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400069',
    hsnCode: '8708',
    itemName: 'Bosch Genuine OE Brake Pads & Synthetic Oil Wholesale Batch',
    quantity: 15,
    unitPrice: 2800
  });

  const [generatedInvoice, setGeneratedInvoice] = useState(null);

  const handleGenerateInvoice = (e) => {
    e.preventDefault();
    const subtotalAmount = gstForm.quantity * gstForm.unitPrice;
    const isInterstate = gstForm.state.toLowerCase() !== 'maharashtra';
    const gstRate = 0.18; // 18% GST for automotive components
    const totalGst = subtotalAmount * gstRate;
    const cgst = isInterstate ? 0 : totalGst / 2;
    const sgst = isInterstate ? 0 : totalGst / 2;
    const igst = isInterstate ? totalGst : 0;
    const finalAmount = subtotalAmount + totalGst;

    const invData = {
      invoiceNumber: `AZI-GST-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-IN'),
      ...gstForm,
      subtotalAmount,
      cgst,
      sgst,
      igst,
      totalGst,
      finalAmount
    };

    setGeneratedInvoice(invData);
    showToast(`📄 GST Tax Invoice #${invData.invoiceNumber} Generated Successfully!`);
  };

  const handleSendBulkQuoteWhatsApp = (partName, qty) => {
    const ownerPhone = '918591719499';
    const message = 
`🏢 *B2B GARAGE WHOLESALE QUOTE REQUEST*
---------------------------------------
🏬 *Garage Name:* ${gstForm.businessName}
👤 *Contact Person:* ${gstForm.contactPerson} (${gstForm.phone})
📌 *GSTIN:* ${gstForm.gstin}

📦 *Bulk Item Requested:* ${partName}
🔢 *Quantity Bracket:* ${qty} Units

Please share the best trade wholesale quote & delivery schedule!
*AutoZonIndia Garage Partner Network (+91 8591719499)*`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${ownerPhone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Portal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FF5722]/20 border border-[#FF5722]/40 flex items-center justify-center text-[#FF7043] shrink-0">
              <Wrench className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[11px] font-black uppercase tracking-wider mb-1">
                ⚙️ B2B MECHANIC & GARAGE WHOLESALE HUB
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Mechanic & Workshop Partner Portal
              </h1>
              <p className="text-xs text-slate-300">
                Direct single-owner bulk discounts (Up to 25% OFF), GST Tax Invoices, and priority dispatch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1.5 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setActiveTab('wholesale')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                activeTab === 'wholesale' ? 'bg-[#FF5722] text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🏷️ Wholesale Discounts
            </button>
            <button
              onClick={() => setActiveTab('invoice')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                activeTab === 'invoice' ? 'bg-[#FF5722] text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              📄 GST Invoice Generator
            </button>
          </div>
        </div>


        {/* TAB 1: WHOLESALE BULK PRICING TIERS */}
        {activeTab === 'wholesale' && (
          <div className="space-y-8">
            {/* Wholesale Info Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
                <div className="text-xs font-black uppercase text-amber-400">Tier 1 • Small Workshop</div>
                <h3 className="text-xl font-black text-white">1 to 4 Units</h3>
                <p className="text-xs text-slate-400">Standard Retail Store Pricing with Free Shipping on orders &gt; ₹999</p>
                <div className="pt-2 text-xs font-extrabold text-emerald-400">✓ MRP Savings Applied</div>
              </div>

              <div className="bg-slate-900 border border-[#FF5722]/50 rounded-3xl p-6 space-y-2 relative shadow-xl shadow-[#FF5722]/10">
                <span className="absolute -top-3 right-4 bg-[#FF5722] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                  MOST POPULAR FOR GARAGES
                </span>
                <div className="text-xs font-black uppercase text-[#FF7043]">Tier 2 • Garage Bulk</div>
                <h3 className="text-xl font-black text-white">5 to 19 Units</h3>
                <p className="text-xs text-slate-300">Flat 15% Additional Trade Discount on all catalog spare parts</p>
                <div className="pt-2 text-xs font-extrabold text-amber-400">⚡ 15% Extra B2B Off</div>
              </div>

              <div className="bg-slate-900 border border-blue-500/50 rounded-3xl p-6 space-y-2">
                <div className="text-xs font-black uppercase text-cyan-400">Tier 3 • Fleet & Master Workshop</div>
                <h3 className="text-xl font-black text-white">20+ Units Batch</h3>
                <p className="text-xs text-slate-400">Flat 25% Wholesale Discount + Dedicated Account Manager Support</p>
                <div className="pt-2 text-xs font-extrabold text-cyan-400">🔥 25% Wholesale Discount</div>
              </div>
            </div>


            {/* Popular Wholesale Bulk Catalog */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white">High-Demand Garage Wholesale Batch Items</h3>
                  <p className="text-xs text-slate-400">Direct warehouse dispatch with 18% GST Input Tax Credit</p>
                </div>

                <button
                  onClick={() => handleSendBulkQuoteWhatsApp('Bulk Workshop Order', '20+ Units Batch')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>📲 Request Custom Bulk Quote (+91 8591719499)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Bosch Platinum-Iridium Spark Plugs (FR7DC)', single: 1450, bulk5: 1230, bulk20: 1080, oem: 'BOSCH-SP-FR7DC' },
                  { name: 'Motul 8100 X-cess 5W-40 Synthetic Oil (4L Box)', single: 3290, bulk5: 2790, bulk20: 2450, oem: 'MOTUL-5W40-4L' },
                  { name: 'Uno Minda 120W LED Projector Headlight Kits', single: 3199, bulk5: 2719, bulk20: 2399, oem: 'MINDA-LED-120W' },
                  { name: 'Gabriel Front Shock Absorbers (Swift / Creta)', single: 2890, bulk5: 2450, bulk20: 2150, oem: 'GAB-SA-SWF18' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-amber-400 font-bold">OEM: {item.oem}</span>
                      <h4 className="text-sm font-bold text-white leading-tight">{item.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                        <span>1 Unit: <b>₹{item.single}</b></span>
                        <span className="text-[#FF7043] font-bold">5+ Units: ₹{item.bulk5}</span>
                        <span className="text-emerald-400 font-black">20+ Units: ₹{item.bulk20}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSendBulkQuoteWhatsApp(item.name, '20 Units')}
                      className="bg-slate-800 hover:bg-[#FF5722] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shrink-0 cursor-pointer"
                    >
                      Get Quote
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}


        {/* TAB 2: INSTANT GST TAX INVOICE GENERATOR */}
        {activeTab === 'invoice' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Form: Invoice Input Details */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#FF5722]" />
                GST Tax Invoice Generator
              </h3>
              <p className="text-xs text-slate-400">
                Generate official GST B2B tax invoice with 18% HSN tax breakup for garage accounting.
              </p>

              <form onSubmit={handleGenerateInvoice} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Garage / Business Name</label>
                  <input
                    type="text"
                    value={gstForm.businessName}
                    onChange={(e) => setGstForm({ ...gstForm, businessName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#FF5722]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">GSTIN Number</label>
                    <input
                      type="text"
                      value={gstForm.gstin}
                      onChange={(e) => setGstForm({ ...gstForm, gstin: e.target.value.toUpperCase() })}
                      className="w-full bg-slate-950 border border-slate-800 text-amber-400 font-mono font-bold uppercase rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#FF5722]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={gstForm.phone}
                      onChange={(e) => setGstForm({ ...gstForm, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#FF5722]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Street Address</label>
                  <input
                    type="text"
                    value={gstForm.address}
                    onChange={(e) => setGstForm({ ...gstForm, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#FF5722]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">City</label>
                    <input
                      type="text"
                      value={gstForm.city}
                      onChange={(e) => setGstForm({ ...gstForm, city: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white font-bold rounded-xl px-2.5 py-2 focus:outline-none focus:border-[#FF5722]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">State</label>
                    <input
                      type="text"
                      value={gstForm.state}
                      onChange={(e) => setGstForm({ ...gstForm, state: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white font-bold rounded-xl px-2.5 py-2 focus:outline-none focus:border-[#FF5722]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Pincode</label>
                    <input
                      type="text"
                      value={gstForm.pincode}
                      onChange={(e) => setGstForm({ ...gstForm, pincode: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white font-bold rounded-xl px-2.5 py-2 focus:outline-none focus:border-[#FF5722]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">HSN Code</label>
                    <input
                      type="text"
                      value={gstForm.hsnCode}
                      onChange={(e) => setGstForm({ ...gstForm, hsnCode: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white font-bold rounded-xl px-3.5 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Batch Quantity</label>
                    <input
                      type="number"
                      value={gstForm.quantity}
                      onChange={(e) => setGstForm({ ...gstForm, quantity: parseInt(e.target.value, 10) || 1 })}
                      className="w-full bg-slate-950 border border-slate-800 text-white font-bold rounded-xl px-3.5 py-2.5"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-black text-xs py-3.5 rounded-2xl shadow-lg transition cursor-pointer mt-4"
                >
                  Generate Official Tax Invoice
                </button>
              </form>
            </div>


            {/* Right Card: Rendered Invoice Preview */}
            <div className="lg:col-span-7 space-y-4">
              {generatedInvoice ? (
                <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 font-sans border border-slate-200">
                  {/* Invoice Header */}
                  <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">
                        Auto<span className="text-[#FF5722]">Zon</span><span className="text-blue-600">India</span>
                      </h2>
                      <p className="text-[11px] text-slate-500 font-semibold">
                        Sagar Travels & Auto Parts Direct Store • GSTIN: 27AABCS1420P1Z2
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                        ORIGINAL TAX INVOICE
                      </span>
                      <div className="text-xs font-mono font-bold text-slate-700 mt-1">
                        Invoice #: {generatedInvoice.invoiceNumber}
                      </div>
                      <div className="text-[11px] text-slate-500">Date: {generatedInvoice.date}</div>
                    </div>
                  </div>

                  {/* Bill To Info */}
                  <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Billed To (Garage / Business):</span>
                      <div className="font-black text-slate-900 text-sm">{generatedInvoice.businessName}</div>
                      <div className="font-mono text-blue-700 font-extrabold">GSTIN: {generatedInvoice.gstin}</div>
                      <div className="text-slate-600 mt-1">{generatedInvoice.address}, {generatedInvoice.city}, {generatedInvoice.state} - {generatedInvoice.pincode}</div>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Contact Details:</span>
                      <div className="font-bold text-slate-800">{generatedInvoice.contactPerson}</div>
                      <div className="text-slate-600">{generatedInvoice.phone}</div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-2.5">Item Description</th>
                        <th className="p-2.5">HSN</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Rate</th>
                        <th className="p-2.5 text-right">Taxable Amt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold">
                      <tr>
                        <td className="p-2.5 font-bold text-slate-900">{generatedInvoice.itemName}</td>
                        <td className="p-2.5 font-mono">{generatedInvoice.hsnCode}</td>
                        <td className="p-2.5 text-center">{generatedInvoice.quantity}</td>
                        <td className="p-2.5 text-right">₹{generatedInvoice.unitPrice.toLocaleString()}</td>
                        <td className="p-2.5 text-right font-bold">₹{generatedInvoice.subtotalAmount.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Tax Summary Breakup */}
                  <div className="border-t border-slate-200 pt-4 flex justify-between items-start text-xs">
                    <div className="space-y-1 text-slate-500 text-[11px]">
                      <div>• GST Rate Applied: 18% Standard Automotive Spares</div>
                      {generatedInvoice.cgst > 0 ? (
                        <div>• CGST (9%): ₹{generatedInvoice.cgst.toLocaleString()} | SGST (9%): ₹{generatedInvoice.sgst.toLocaleString()}</div>
                      ) : (
                        <div>• IGST (18%): ₹{generatedInvoice.igst.toLocaleString()}</div>
                      )}
                    </div>

                    <div className="text-right space-y-1.5">
                      <div className="text-slate-600">Subtotal: ₹{generatedInvoice.subtotalAmount.toLocaleString()}</div>
                      <div className="text-slate-600">Total GST (18%): ₹{generatedInvoice.totalGst.toLocaleString()}</div>
                      <div className="text-lg font-black text-slate-900 border-t border-slate-300 pt-1">
                        Final Total: ₹{generatedInvoice.finalAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Download / Print Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" /> Print GST Invoice
                    </button>
                    <button
                      onClick={() => showToast('📥 GST Invoice PDF downloaded to device!')}
                      className="flex-1 bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" /> Download PDF
                    </button>
                  </div>

                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
                  <FileText className="w-12 h-12 text-slate-600 mx-auto" />
                  <h4 className="text-base font-bold text-white">No Invoice Generated Yet</h4>
                  <p className="text-xs max-w-sm mx-auto">Fill the garage details on the left and click "Generate Official Tax Invoice" to preview and download.</p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { enquiryQuotationService } from '../services/enquiryQuotationService';
import {
  Layers, Plus, Trash2, Send, CheckCircle2, ArrowLeft, Building, User, Phone, Mail, FileSpreadsheet,
  MessageCircle, ShieldCheck, Wrench, PackageCheck, Zap, Sparkles, Clock
} from 'lucide-react';

export const BulkEnquiryView = ({ onNavigate }) => {
  const { currentUser, showToast, navigateTo } = useStore();
  const nav = onNavigate || navigateTo;

  const [businessInfo, setBusinessInfo] = useState({
    business_name: '',
    contact_person: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    gstin: '',
    business_type: 'garage_workshop', // garage_workshop, spare_parts_dealer, fleet_owner, individual
    city: ''
  });

  const [items, setItems] = useState([
    { part_name: '', vehicle_model: '', part_number: '', quantity: 1, urgency: 'normal' }
  ]);

  const [loading, setLoading] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);

  const addItemRow = () => {
    setItems([...items, { part_name: '', vehicle_model: '', part_number: '', quantity: 1, urgency: 'normal' }]);
  };

  const removeItemRow = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // Quick Preset Add Helper
  const loadPresetPackage = (presetType) => {
    let presetItems = [];
    if (presetType === 'engine_service') {
      presetItems = [
        { part_name: 'Synthetic Engine Oil 5W-40 (4L Can)', vehicle_model: 'Universal', part_number: 'KMT-OIL-5W40', quantity: 5, urgency: 'normal' },
        { part_name: 'High-Flow Engine Oil Filter', vehicle_model: 'Swift / Baleno', part_number: 'KMT-FLT-OIL-01', quantity: 5, urgency: 'normal' },
        { part_name: 'Engine Air Filter Element', vehicle_model: 'Swift / Baleno', part_number: 'KMT-FLT-AIR-01', quantity: 5, urgency: 'normal' },
        { part_name: 'Activated Carbon Cabin AC Filter', vehicle_model: 'Swift / Baleno', part_number: 'KMT-FLT-AC-01', quantity: 5, urgency: 'normal' }
      ];
    } else if (presetType === 'brake_overhaul') {
      presetItems = [
        { part_name: 'Front Brake Pads Set (Ceramic Composite)', vehicle_model: 'Creta / Seltos', part_number: 'KMT-[#BRK-FPAD]', quantity: 4, urgency: 'normal' },
        { part_name: 'Rear Brake Shoes / Pads Set', vehicle_model: 'Creta / Seltos', part_number: 'KMT-[#BRK-[#RPAD]]', quantity: 4, urgency: 'normal' },
        { part_name: 'DOT-4 Synthetic Brake Fluid (500ml)', vehicle_model: 'Universal', part_number: 'KMT-BF-DOT4', quantity: 10, urgency: 'normal' }
      ];
    } else if (presetType === 'electrical_spark') {
      presetItems = [
        { part_name: 'Iridium Spark Plugs Pack (Set of 4)', vehicle_model: 'City / Nexon', part_number: 'KMT-SP-IRIDIUM', quantity: 6, urgency: 'normal' },
        { part_name: '120W LED Projector Headlight Bulbs (9005/H7)', vehicle_model: 'Universal', part_number: 'KMT-LED-120W', quantity: 4, urgency: 'normal' }
      ];
    }
    setItems(presetItems);
    showToast(`Loaded ${presetItems.length} items from ${presetType.replace('_', ' ')} package!`);
  };

  // Submit via Standard Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!businessInfo.contact_person || !businessInfo.phone) {
      showToast('Please provide contact person name and phone number.', 'error');
      return;
    }

    const validItems = items.filter(i => i.part_name.trim() !== '');
    if (validItems.length === 0) {
      showToast('Please add at least one part name to your bulk enquiry.', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customer_name: businessInfo.business_name ? `${businessInfo.business_name} (${businessInfo.contact_person})` : businessInfo.contact_person,
        phone: businessInfo.phone || '8591719499',
        email: businessInfo.email || 'kamtiautomotive@gmail.com',
        customer_id: currentUser?.id || null,
        subject: `Bulk Parts Quote Request (${validItems.length} items) - ${businessInfo.business_name || businessInfo.contact_person}`,
        message: `Business Type: ${businessInfo.business_type}. GSTIN: ${businessInfo.gstin || 'N/A'}. City: ${businessInfo.city || 'N/A'}.`,
        source: 'website',
        enquiry_type: 'bulk',
        items: validItems.map(item => ({
          part_name_requested: item.part_name,
          vehicle_details_requested: item.vehicle_model,
          quantity_requested: parseInt(item.quantity) || 1,
          remarks: `Part No: ${item.part_number || 'N/A'}, Urgency: ${item.urgency}`
        }))
      };

      const res = await enquiryQuotationService.createCustomerEnquiry(payload);
      if (res.success) {
        setSubmittedResult(res.data);
        showToast(`Bulk enquiry submitted! Reference: ${res.data.enquiry_number}`, 'success');
      } else {
        showToast('Submission failed: ' + (res.error || 'Unknown error'), 'error');
      }
    } catch (err) {
      console.error('Error submitting bulk enquiry:', err);
      showToast('Error submitting bulk enquiry', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Submit Direct via WhatsApp
  const handleWhatsAppSubmit = () => {
    if (!businessInfo.contact_person || !businessInfo.phone) {
      showToast('Please enter your contact name and phone number.', 'error');
      return;
    }

    const validItems = items.filter(i => i.part_name.trim() !== '');
    if (validItems.length === 0) {
      showToast('Please add at least one part name to your quote request.', 'error');
      return;
    }

    let text = `🛠️ *B2B BULK SPARE PARTS QUOTE REQUEST*\n` +
      `🏢 *Supplier:* SAGAR TRAVELS / KAMTI AUTOMOTIVE\n\n` +
      `👤 *Contact:* ${businessInfo.contact_person}\n` +
      `🏬 *Business Name:* ${businessInfo.business_name || 'N/A'}\n` +
      `📞 *Phone:* ${businessInfo.phone}\n` +
      `📑 *GSTIN:* ${businessInfo.gstin || 'N/A'}\n` +
      `🏷️ *Type:* ${businessInfo.business_type.replace('_', ' ').toUpperCase()}\n\n` +
      `📦 *REQUESTED PARTS LIST (${validItems.length} items):*\n`;

    validItems.forEach((item, index) => {
      text += `${index + 1}. *${item.part_name}*\n` +
        `   • Car/Model: ${item.vehicle_model || 'Any'}\n` +
        `   • OEM Part #: ${item.part_number || 'N/A'}\n` +
        `   • Qty: ${item.quantity}\n` +
        `   • Urgency: ${item.urgency.toUpperCase()}\n`;
    });

    text += `\nPlease send official trade quotation with GST breakdown and estimated dispatch date.`;
    window.open(`https://wa.me/918591719499?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (submittedResult) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl space-y-6">
          <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              Bulk Quotation Request Submitted!
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">
              Our B2B supply team at <strong className="text-white">SAGAR TRAVELS / KAMTI AUTOMOTIVE</strong> has received your multi-part request list.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-left space-y-3 max-w-xl mx-auto">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-medium">Enquiry Reference:</span>
              <span className="font-mono text-lg font-black text-[#FF5722]">
                {submittedResult.enquiry_number}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              An itemized wholesale trade quote with GST tax breakdown and volume discount pricing will be sent to <strong>{businessInfo.phone}</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={handleWhatsAppSubmit}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" /> Send Copy to WhatsApp (+91 8591719499)
            </button>
            <button
              onClick={() => nav('catalog')}
              className="px-6 py-3 bg-[#FF5722] hover:bg-[#E64A19] text-white font-extrabold text-xs rounded-xl transition cursor-pointer"
            >
              Return to Catalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Back Button */}
        <button
          onClick={() => nav('catalog')}
          className="inline-flex items-center text-slate-400 hover:text-white transition font-bold text-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Parts Catalog
        </button>

        {/* Main Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800 p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF5722]/15 border border-[#FF5722]/30 text-[#FF5722] rounded-full text-xs font-black uppercase tracking-wider mb-3">
                  <FileSpreadsheet className="w-4 h-4" /> SAGAR TRAVELS / KAMTI AUTOMOTIVE B2B DESK
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  B2B & Garage Bulk Parts Quotation Form
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  Tiered trade pricing, GST invoices, and priority logistics for Garages, Fleet Owners & Retailers.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-xs space-y-1 shrink-0">
                <div className="text-slate-400 font-bold uppercase text-[10px]">B2B Direct Desk</div>
                <div className="font-extrabold text-emerald-400 flex items-center gap-1.5 text-sm">
                  <MessageCircle className="w-4 h-4" /> +91 8591719499
                </div>
                <div className="text-slate-300 font-mono text-[11px]">kamtiautomotive@gmail.com</div>
              </div>
            </div>

            {/* B2B Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>GST Tax Invoices</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Bulk Trade Discount</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <PackageCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>OEM Verified Parts</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <Clock className="w-4 h-4 text-[#FF5722] shrink-0" />
                <span>24-Hour Dispatch</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">

            {/* Business Info Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-[#FF5722] uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4" /> 1. Business / Garage Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase text-[10px]">Garage / Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sagar Travels Workshop / Kamti Garage"
                    value={businessInfo.business_name}
                    onChange={e => setBusinessInfo({ ...businessInfo, business_name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5722]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase text-[10px]">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sagar Kamti"
                    value={businessInfo.contact_person}
                    onChange={e => setBusinessInfo({ ...businessInfo, contact_person: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5722]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase text-[10px]">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 8591719499"
                    value={businessInfo.phone}
                    onChange={e => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5722] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase text-[10px]">GSTIN (For Tax Credit)</label>
                  <input
                    type="text"
                    placeholder="e.g. 07AAAAA0000A1Z5"
                    value={businessInfo.gstin}
                    onChange={e => setBusinessInfo({ ...businessInfo, gstin: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5722] font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase text-[10px]">Business Type</label>
                  <select
                    value={businessInfo.business_type}
                    onChange={e => setBusinessInfo({ ...businessInfo, business_type: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#FF5722]"
                  >
                    <option value="garage_workshop">Garage / Multi-Brand Workshop</option>
                    <option value="spare_parts_dealer">Spare Parts Retailer / Dealer</option>
                    <option value="fleet_owner">Commercial Fleet Owner / Transport</option>
                    <option value="individual">Individual Bulk Purchaser</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase text-[10px]">City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Noida / New Delhi"
                    value={businessInfo.city}
                    onChange={e => setBusinessInfo({ ...businessInfo, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
              </div>
            </div>

            {/* Preset Quick Packages Helper */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Quick Load Preset Repair Kits:
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => loadPresetPackage('engine_service')}
                  className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg transition font-medium cursor-pointer"
                >
                  🛢️ Engine Service Kit (5 items)
                </button>
                <button
                  type="button"
                  onClick={() => loadPresetPackage('brake_overhaul')}
                  className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg transition font-medium cursor-pointer"
                >
                  🛑 Brake Overhaul Kit (3 items)
                </button>
                <button
                  type="button"
                  onClick={() => loadPresetPackage('electrical_spark')}
                  className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg transition font-medium cursor-pointer"
                >
                  ⚡ Ignition & Lighting Kit (2 items)
                </button>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-[#FF5722] uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4" /> 2. Multi-Part Requirement List ({items.length} items)
                </h3>
                <button
                  type="button"
                  onClick={addItemRow}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#FF5722]" /> Add Another Part
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-black uppercase text-[10px]">
                      <th className="p-3 w-10">#</th>
                      <th className="p-3">Part Name / Description *</th>
                      <th className="p-3">Car Make & Model</th>
                      <th className="p-3">OEM / Part No.</th>
                      <th className="p-3 w-20">Qty</th>
                      <th className="p-3 w-32">Urgency</th>
                      <th className="p-3 w-12 text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950">
                    {items.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-900/50">
                        <td className="p-3 font-mono font-bold text-slate-500">{index + 1}</td>
                        <td className="p-2">
                          <input
                            type="text"
                            required
                            placeholder="e.g. Clutch Set / Oil Filter"
                            value={item.part_name}
                            onChange={e => handleItemChange(index, 'part_name', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5722]"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            placeholder="e.g. Hyundai Creta 1.6"
                            value={item.vehicle_model}
                            onChange={e => handleItemChange(index, 'vehicle_model', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5722]"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            placeholder="e.g. 26300-35505"
                            value={item.part_number}
                            onChange={e => handleItemChange(index, 'part_number', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5722] font-mono"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#FF5722] font-bold text-center"
                          />
                        </td>
                        <td className="p-2">
                          <select
                            value={item.urgency}
                            onChange={e => handleItemChange(index, 'urgency', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#FF5722]"
                          >
                            <option value="normal">Normal (2-4 Days)</option>
                            <option value="immediate">Urgent (24 Hours)</option>
                            <option value="scheduled">Scheduled Routine</option>
                          </select>
                        </td>
                        <td className="p-2 text-center">
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItemRow(index)}
                              className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3.5 bg-gradient-to-r from-[#FF5722] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs sm:text-sm rounded-2xl transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
              >
                {loading ? 'Submitting Request...' : (
                  <>
                    <Send className="w-4 h-4" /> Submit Official B2B Request
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppSubmit}
                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4" /> Send Instant Quote via WhatsApp (+91 8591719499)
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default BulkEnquiryView;


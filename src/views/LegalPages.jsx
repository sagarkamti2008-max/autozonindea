import React from 'react';
import { ShieldCheck, FileText, Truck, RefreshCw } from 'lucide-react';

export const PrivacyPolicyView = () => (
  <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-10 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-orange-100 p-4 rounded-2xl"><ShieldCheck className="w-8 h-8 text-orange-600" /></div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Privacy Policy</h2>
      </div>
      <div className="prose prose-slate max-w-none prose-p:font-medium prose-p:text-slate-600 prose-headings:font-black prose-headings:text-slate-900">
        <p className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-8">Last Updated: August 2026</p>
        <p>AutoZonIndia Marketplaces Ltd is committed to protecting your privacy. We collect personal information such as name, shipping address, vehicle registration numbers, and phone numbers strictly for order fulfillment, compatibility verification, and express delivery updates.</p>
        
        <h3>Data Protection & Encryption</h3>
        <p>All transaction data is encrypted using 256-Bit SSL protocols. We never sell or lease customer vehicle ownership data to third-party advertisers. Your garage and vehicle data remains strictly confidential and is only used to ensure 100% fitment accuracy for the spare parts you order.</p>
        
        <h3>Cookies and Tracking</h3>
        <p>We use essential cookies to maintain your session and cart data. We do not use third-party invasive trackers.</p>
      </div>
    </div>
  </div>
);

export const TermsView = () => (
  <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-10 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-2xl"><FileText className="w-8 h-8 text-blue-600" /></div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Terms of Service</h2>
      </div>
      <div className="prose prose-slate max-w-none prose-p:font-medium prose-p:text-slate-600 prose-headings:font-black prose-headings:text-slate-900">
        <p>By accessing AutoZonIndia, customers and garages agree to comply with our platform policies regarding genuine OEM spare parts, vehicle fitment accuracy, and payment terms.</p>
        
        <h3>Platform Usage</h3>
        <p>You agree to use this platform only for lawful automotive eCommerce purposes. Our AI Parts Assistant is provided "as is" and its recommendations should always be double-checked against your vehicle's manual.</p>
        
        <h3>Pricing and Errors</h3>
        <p>While we strive for 100% accuracy, pricing errors may occasionally occur. AutoZonIndia reserves the right to cancel any orders placed for products with incorrect pricing or availability data.</p>
      </div>
    </div>
  </div>
);

export const ShippingPolicyView = () => (
  <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-10 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-emerald-100 p-4 rounded-2xl"><Truck className="w-8 h-8 text-emerald-600" /></div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Shipping Policy</h2>
      </div>
      <div className="prose prose-slate max-w-none prose-p:font-medium prose-p:text-slate-600 prose-headings:font-black prose-headings:text-slate-900">
        <p>We deliver spare parts across 19,000+ pincodes in India via Bluedart, Delhivery, and Express Logistics. Standard delivery timeline is 2-4 business days.</p>
        
        <h3>Free Shipping</h3>
        <p>Orders above ₹499 qualify for free standard shipping. Bulky items (like windshields or large body panels) may incur specialized freight charges.</p>
        
        <h3>Tracking</h3>
        <p>All orders come with real-time GPS tracking. You will receive SMS and WhatsApp updates as your order moves from our warehouse to your doorstep.</p>
      </div>
    </div>
  </div>
);

export const ReturnPolicyView = () => (
  <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-10 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-purple-100 p-4 rounded-2xl"><RefreshCw className="w-8 h-8 text-purple-600" /></div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Return & Refund Policy</h2>
      </div>
      <div className="prose prose-slate max-w-none prose-p:font-medium prose-p:text-slate-600 prose-headings:font-black prose-headings:text-slate-900">
        <p>If a spare part does not fit your registered vehicle, request a free reverse pickup within 7 days of delivery for a 100% full refund or instant replacement.</p>
        
        <h3>Conditions for Return</h3>
        <ul>
          <li>The part must be unused and in its original, sealed OEM packaging.</li>
          <li><b>Important:</b> Electrical components (ECUs, sensors, wiring harnesses) are strictly non-returnable once the seal is broken.</li>
          <li>Parts damaged during DIY installation are not eligible for refunds.</li>
        </ul>
        
        <h3>Refund Processing</h3>
        <p>Refunds are initiated within 24 hours of the returned item passing quality check at our warehouse. It may take 3-5 business days for the amount to reflect in your original payment method.</p>
      </div>
    </div>
  </div>
);

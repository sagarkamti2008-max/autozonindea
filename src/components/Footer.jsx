import React from 'react';
import { useStore } from '../context/StoreContext';
import { Wrench, Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, Award, LayoutDashboard, Building, Cpu } from 'lucide-react';

export const Footer = () => {
  const { navigateTo, setCurrentRole, setSelectedCategory } = useStore();

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-24 md:pb-8 border-t border-slate-800 font-sans">
      
      {/* Top Seals - AutoZon Trust Markers */}
      <div className="container mx-auto px-4 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800/60">
          <div className="flex items-start gap-4 group">
            <ShieldCheck size={36} className="text-orange-500 mt-1 shrink-0 group-hover:scale-110 transition-transform duration-300" />
            <div>
              <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-1">100% Genuine Guaranteed</h4>
              <p className="text-sm leading-relaxed text-slate-400">Direct sourcing from OEM/OES manufacturers across India.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 group">
            <Truck size={36} className="text-orange-500 mt-1 shrink-0 group-hover:scale-110 transition-transform duration-300" />
            <div>
              <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-1">Pan-India Express Shipping</h4>
              <p className="text-sm leading-relaxed text-slate-400">Multi-layer protective packaging for safe spares delivery.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 group">
            <RefreshCw size={36} className="text-orange-500 mt-1 shrink-0 group-hover:scale-110 transition-transform duration-300" />
            <div>
              <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-1">7-Day Fitment Exchange</h4>
              <p className="text-sm leading-relaxed text-slate-400">Free reverse pickup and instant replacement if it doesn't fit.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 group">
            <Award size={36} className="text-orange-500 mt-1 shrink-0 group-hover:scale-110 transition-transform duration-300" />
            <div>
              <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-1">24/7 Mechanic Support</h4>
              <p className="text-sm leading-relaxed text-slate-400">WhatsApp compatibility assistance directly from experts.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Info (Takes up 4 columns on large screens) */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-1 mb-6">
              <span className="font-black text-2xl text-white tracking-tight">AutoZon<span className="text-orange-500">India</span></span>
            </div>
            <p className="text-sm leading-relaxed mb-8 pr-4">
              AutoZonIndia is India's leading automotive marketplace for Car Spare Parts, OEM Clutch Assembly, Brake Oils, Dash Cams, and Vehicle Accessories. We bridge the gap between car owners and genuine parts.
            </p>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-orange-500 shrink-0 mt-0.5" />
                <span><b className="text-white">Helpline:</b> +91 8591719499<br/><span className="text-slate-500 text-xs">(Mon-Sat 9AM-8PM)</span></span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-orange-500 shrink-0" />
                <span><b className="text-white">Support:</b> support@autozonindia.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-orange-500 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span><b className="text-white">HQ / Store:</b> AutoZon Plaza, Connaught Place, New Delhi 110001</span>
                  <a href="https://maps.google.com/?q=Connaught+Place+New+Delhi" target="_blank" rel="noreferrer" className="text-orange-500 text-xs font-bold mt-1 hover:underline flex items-center gap-1">
                    View on Google Maps ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Marketplace</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><button onClick={() => { setSelectedCategory('service_parts'); navigateTo('catalog'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-orange-500 transition-colors"></span>Service Parts</button></li>
              <li><button onClick={() => { setSelectedCategory('brakes'); navigateTo('catalog'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-orange-500 transition-colors"></span>Brakes & Fluid</button></li>
              <li><button onClick={() => { setSelectedCategory('clutch_transmission'); navigateTo('catalog'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-orange-500 transition-colors"></span>Clutch Assemblies</button></li>
              <li><button onClick={() => { setSelectedCategory('engine'); navigateTo('catalog'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-orange-500 transition-colors"></span>Oils & Coolants</button></li>
              <li><button onClick={() => { setSelectedCategory('interiors'); navigateTo('catalog'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-orange-500 transition-colors"></span>7D Mats & Holders</button></li>
              <li><button onClick={() => { setSelectedCategory('electronics'); navigateTo('catalog'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-orange-500 transition-colors"></span>Dash Cameras</button></li>
            </ul>
          </div>

          {/* Enterprise Solutions & Portals */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Platform Portals</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><button onClick={() => { setCurrentRole('customer'); navigateTo('my-account'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2"><span className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-800/50"><LayoutDashboard size={12} className="text-orange-500" /></span> Account & Orders</button></li>
              <li><button onClick={() => { setCurrentRole('garage'); navigateTo('garage-portal'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2"><span className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-800/50"><Wrench size={12} className="text-orange-500" /></span> Mechanic Hub</button></li>
              <li><button onClick={() => { setCurrentRole('seller'); navigateTo('seller-portal'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2"><span className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-800/50"><Building size={12} className="text-orange-500" /></span> Merchant Portal</button></li>
              <li><button onClick={() => { setCurrentRole('manufacturer'); navigateTo('manufacturer-portal'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2"><span className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-800/50"><Cpu size={12} className="text-orange-500" /></span> OEM Hub</button></li>
              <li><button onClick={() => { setCurrentRole('admin'); navigateTo('admin'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2"><span className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-800/50"><ShieldCheck size={12} className="text-orange-500" /></span> Admin Console</button></li>
            </ul>
          </div>

          {/* Customer Care & Legal Policies */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Legal & Care</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><button onClick={() => navigateTo('about')} className="hover:text-white transition-colors duration-200">About Us</button></li>
              <li><button onClick={() => navigateTo('privacy-policy')} className="hover:text-white transition-colors duration-200">Privacy Policy</button></li>
              <li><button onClick={() => navigateTo('terms')} className="hover:text-white transition-colors duration-200">Terms & Conditions</button></li>
              <li><button onClick={() => navigateTo('shipping-policy')} className="hover:text-white transition-colors duration-200">Shipping Policy</button></li>
              <li><button onClick={() => navigateTo('return-policy')} className="hover:text-white transition-colors duration-200">Return & Refund</button></li>
              <li><button onClick={() => navigateTo('faq')} className="hover:text-white transition-colors duration-200">FAQs</button></li>
              <li><button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors duration-200">Contact Support</button></li>
              <li><button onClick={() => navigateTo('sitemap')} className="text-orange-400 font-bold hover:underline flex items-center gap-1.5 mt-1">🗺️ Complete Website Sitemap</button></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-slate-800/60 pt-8 mt-4">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500 font-medium">
            © {new Date().getFullYear()} AutoZonIndia (Sagar Travels & Auto Parts). All Rights Reserved.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-[11px] font-bold tracking-wide uppercase">
            <span className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full">
              <ShieldCheck size={12} /> 100% Secure
            </span>
            <span className="flex items-center gap-1.5 text-cyan-500 bg-cyan-500/10 px-3 py-1.5 rounded-full">
              <Award size={12} /> Verified OEM
            </span>
            <span className="flex items-center gap-1.5 text-slate-300 bg-slate-800 px-3 py-1.5 rounded-full">
              UPI & Wallets
            </span>
            <span className="flex items-center gap-1.5 text-slate-300 bg-slate-800 px-3 py-1.5 rounded-full">
              Cards & NetBanking
            </span>
            <span className="flex items-center gap-1.5 text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-full">
              COD Available
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

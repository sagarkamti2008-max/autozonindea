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
          
          {/* Column 1: Brand & Address */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-1 mb-6">
              <span className="font-black text-2xl text-white tracking-tight">AutoZon<span className="text-orange-500">India</span></span>
            </div>
            <p className="text-sm leading-relaxed mb-4 pr-4">
              India me Car Parts Online — Engine Parts, Oils, Bumper, Accessories. Apni car select karein aur sahi parts ghar baithe mangwayein.
            </p>
            <p className="text-xs text-slate-500 mb-6 uppercase tracking-widest font-bold">GSTIN: (Awaiting Registration)</p>
            <div className="flex items-start gap-3 text-sm">
              <MapPin size={18} className="text-orange-500 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span><b className="text-white">HQ / Store:</b> AutoZon Plaza, Connaught Place, New Delhi 110001</span>
                <a href="https://maps.google.com/?q=Connaught+Place+New+Delhi" target="_blank" rel="noreferrer" className="text-orange-500 text-xs font-bold mt-1 hover:underline flex items-center gap-1">
                  View on Google Maps ↗
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Categories quick links */}
          <div className="lg:col-span-3 lg:col-start-4">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Top Categories</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><button onClick={() => { setSelectedCategory('engine-parts'); navigateTo('catalog'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-orange-500 transition-colors"></span>Engine Parts</button></li>
              <li><button onClick={() => { setSelectedCategory('oils-fluids'); navigateTo('catalog'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-orange-500 transition-colors"></span>Oils & Fluids</button></li>
              <li><button onClick={() => { setSelectedCategory('brake-system'); navigateTo('catalog'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-orange-500 transition-colors"></span>Brakes</button></li>
              <li><button onClick={() => { setSelectedCategory('filters'); navigateTo('catalog'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-orange-500 transition-colors"></span>Filters</button></li>
              <li><button onClick={() => { setSelectedCategory('body-bumper'); navigateTo('catalog'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-orange-500 transition-colors"></span>Body & Bumper</button></li>
              <li><button onClick={() => { setSelectedCategory('electrical'); navigateTo('catalog'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-orange-500 transition-colors"></span>Electrical</button></li>
              <li><button onClick={() => { setSelectedCategory('car-accessories'); navigateTo('catalog'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-orange-500 transition-colors"></span>Accessories</button></li>
            </ul>
          </div>

          {/* Column 3: Information Links */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Information</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><button onClick={() => navigateTo('about')} className="hover:text-white transition-colors duration-200">About Us</button></li>
              <li><button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors duration-200">Contact Us</button></li>
              <li><button onClick={() => navigateTo('shipping-policy')} className="hover:text-white transition-colors duration-200">Shipping & Delivery Policy</button></li>
              <li><button onClick={() => navigateTo('return-policy')} className="hover:text-white transition-colors duration-200">Returns / Refund Policy</button></li>
              <li><button onClick={() => navigateTo('privacy-policy')} className="hover:text-white transition-colors duration-200">Privacy Policy</button></li>
              <li><button onClick={() => navigateTo('terms')} className="hover:text-white transition-colors duration-200">Terms & Conditions</button></li>
              <li><button onClick={() => navigateTo('faq')} className="hover:text-white transition-colors duration-200">FAQ</button></li>
            </ul>
          </div>

          {/* Column 4: Contact & Socials */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-5 text-sm font-medium">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-orange-500 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-white font-bold text-base">1800-AZ-INDIA</span>
                  <span className="text-xs text-slate-500">Toll-Free Helpline</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/WhatsApp_icon.png" alt="WhatsApp" className="w-[18px] h-[18px] shrink-0 mt-0.5 opacity-90" />
                <div className="flex flex-col">
                  <span className="text-white font-bold text-base">+91 85917 19499</span>
                  <span className="text-xs text-slate-500">WhatsApp Support</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-orange-500 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-white font-bold">support@autozonindia.com</span>
                </div>
              </li>
              <li className="pt-2 border-t border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">Timings</span>
                <span className="text-sm">Monday to Saturday: 9:00 AM - 8:00 PM<br/>Sunday: Closed</span>
              </li>
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

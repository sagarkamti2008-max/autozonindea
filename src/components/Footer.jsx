import React from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  const { navigateTo, setSelectedCategory } = useStore();

  return (
    <footer className="bg-slate-900 text-slate-400 pt-12 pb-24 md:pb-8 border-t border-slate-800 font-sans">
      
      {/* Main Footer Links */}
      <div className="container mx-auto px-4 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Column 1: Brand & Address */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/kamti-logo.png" 
                alt="KAMTI AUTOMOTIVE Logo" 
                className="h-12 w-auto object-contain rounded-xl bg-white p-1 shadow-md border border-slate-700" 
              />
              <span className="font-black text-2xl text-white tracking-tight uppercase">KAMTI <span className="text-[#FF5722]">AUTOMOTIVE</span></span>
            </div>
            <div className="flex items-start gap-3 text-sm mt-4">
              <MapPin size={18} className="text-[#FF5722] shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span><b className="text-white">HQ / Store:</b> KAMTI AUTOMOTIVE Hub, Main Market, New Delhi 110001</span>
                <a href="https://maps.google.com/?q=New+Delhi" target="_blank" rel="noreferrer" className="text-[#FF5722] text-xs font-bold mt-1 hover:underline flex items-center gap-1">
                  View on Google Maps ↗
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Categories quick links */}
          <div className="lg:col-span-3 lg:col-start-4">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Top Categories</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><button onClick={() => { setSelectedCategory('engine-parts'); navigateTo('catalog'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-[#FF5722] transition-colors"></span>Engine Parts</button></li>
              <li><button onClick={() => { setSelectedCategory('oils-fluids'); navigateTo('catalog'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-[#FF5722] transition-colors"></span>Oils & Fluids</button></li>
              <li><button onClick={() => { setSelectedCategory('brake-system'); navigateTo('catalog'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-[#FF5722] transition-colors"></span>Brakes</button></li>
              <li><button onClick={() => { setSelectedCategory('filters'); navigateTo('catalog'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-[#FF5722] transition-colors"></span>Filters</button></li>
              <li><button onClick={() => { setSelectedCategory('body-bumper'); navigateTo('catalog'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-[#FF5722] transition-colors"></span>Body & Bumper</button></li>
              <li><button onClick={() => { setSelectedCategory('electrical'); navigateTo('catalog'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-[#FF5722] transition-colors"></span>Electrical</button></li>
              <li><button onClick={() => { setSelectedCategory('car-accessories'); navigateTo('catalog'); }} className="hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-[#FF5722] transition-colors"></span>Accessories</button></li>
            </ul>
          </div>

          {/* Column 3: Information Links */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Information</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><button onClick={() => navigateTo('about')} className="hover:text-white transition-colors duration-200">About Us</button></li>
              <li><button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors duration-200">Contact Us</button></li>
              <li><button onClick={() => navigateTo('shipping-policy')} className="hover:text-white transition-colors duration-200">Shipping & Delivery Policy</button></li>
              <li><button onClick={() => navigateTo('return-policy')} className="hover:text-white transition-colors duration-200">Returns / Refund Policy</button></li>
              <li><button onClick={() => navigateTo('privacy-policy')} className="hover:text-white transition-colors duration-200">Privacy Policy</button></li>
              <li><button onClick={() => navigateTo('terms')} className="hover:text-white transition-colors duration-200">Terms & Conditions</button></li>
              <li><button onClick={() => navigateTo('faq')} className="hover:text-white transition-colors duration-200">FAQ</button></li>
              <li><button onClick={() => navigateTo('admin-login')} className="text-slate-500 hover:text-slate-300 text-xs transition-colors duration-200">Staff / Admin Portal 🔒</button></li>
              <li>
                <a 
                  href="https://www.thesagartravels.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-amber-400 hover:text-amber-300 transition-colors duration-200 font-bold flex items-center gap-1"
                >
                  <span>Sagar Travels (Cabs & Rentals)</span>
                  <span className="text-xs">↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Socials */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-[#FF5722] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <a href="tel:8591719499" className="text-white font-bold text-base hover:text-[#FF5722] transition-colors">+91 8591719499</a>
                  <span className="text-xs text-slate-500">Call &amp; Support Helpline</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/WhatsApp_icon.png" alt="WhatsApp" className="w-[18px] h-[18px] shrink-0 mt-0.5 opacity-90" />
                <div className="flex flex-col">
                  <a href="https://wa.me/918591719499" target="_blank" rel="noreferrer" className="text-white font-bold text-base hover:text-emerald-400 transition-colors">+91 85917 19499</a>
                  <span className="text-xs text-slate-500">WhatsApp Support</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-[#FF5722] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <a href="mailto:kamtiautomotive@gmail.com" className="text-white font-bold hover:text-[#FF5722] transition-colors">kamtiautomotive@gmail.com</a>
                  <span className="text-xs text-slate-500">Official Email</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-slate-800/60 pt-6 mt-4">
        <div className="container mx-auto px-4 lg:px-8 flex justify-center items-center">
          <p className="text-xs text-slate-400 font-bold text-center">
            © {new Date().getFullYear()} KAMTI AUTOMOTIVE. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

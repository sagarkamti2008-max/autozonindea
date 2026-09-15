import React from 'react';
import { useStore } from '../context/StoreContext';
import { HelpCircle, BookOpen, Mail, Phone, MapPin, Tag, Flame, ShieldCheck, ArrowRight, User, Calendar, Truck, Clock, Award } from 'lucide-react';

export const BlogView = () => {
  const { blogs, navigateTo } = useStore();

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">Automotive Knowledge Hub</h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">Expert advice, DIY guides, and industry news for car enthusiasts and mechanics.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <div key={blog.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col cursor-pointer">
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">
                  {blog.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-orange-500 transition-colors leading-snug">{blog.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 flex-1 line-clamp-3">{blog.content}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 text-xs font-bold text-slate-400">
                  <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {blog.author}</div>
                  <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {blog.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FAQView = () => {
  const faqs = [
    {
      q: "Mujhe kaise pata chalega ye part meri car me fit hoga?",
      a: "Aap humare 'AI Parts Assistant' ya catalog me apni car ka Make, Model, aur Year select karke 100% accurate parts dhund sakte hain. Humara system sirf wahi parts dikhayega jo aapki car ke liye compatible hain."
    },
    {
      q: "Kya COD available hai?",
      a: "Haan! COD (Cash On Delivery) ki suvidha available hai. Aap checkout ke waqt apna pincode daalkar check kar sakte hain ki aapke area me COD hai ya nahi."
    },
    {
      q: "Delivery kitne din me hogi?",
      a: "Dispatch 24-48 working hours me hota hai. Aapke pincode ke hisaab se delivery me usually 3 se 7 din lagte hain. ₹999 ke upar order par shipping bilkul free hai."
    },
    {
      q: "GST invoice milega?",
      a: "Ji haan, sabhi parts par GST invoice milta hai. B2B customers aur Garages order confirmation page se apna GST invoice download kar sakte hain."
    },
    {
      q: "Return kaise karun?",
      a: "Agar part fit nahi hota, toh aap 7 din ke andar return kar sakte hain. Bas dhyan rahe ki part unused aur original packing me ho. Hame WhatsApp ya Email karein, hum free pickup arrange karenge aur aapka refund ya replacement process kar denge."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-slate-500 font-medium">Aapke sabhi sawalon ke asaan jawab.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-lg font-black text-slate-900 mb-3 flex items-start gap-3">
                <HelpCircle className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" /> 
                {faq.q}
              </h4>
              <p className="text-slate-600 font-medium text-sm leading-relaxed ml-9">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ContactView = () => {
  const { showToast } = useStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('🎉 Thank you! Our technical support team will call you back within 1 hour.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">Contact Us</h2>
          <p className="text-slate-500 font-medium">We're here to help with your vehicle fitment, order queries, and more.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          
          {/* Contact Info Cards */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl"></div>
              <h3 className="text-xl font-black mb-6">HQ & Helpline</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-xl shrink-0"><Phone className="w-5 h-5 text-orange-400" /></div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Phone & WhatsApp</div>
                    <div className="font-black text-lg">+91 8591719499</div>
                    <div className="text-sm font-medium text-slate-400 mt-0.5">Mon-Sat 10AM-7PM</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-xl shrink-0"><Mail className="w-5 h-5 text-blue-400" /></div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Us</div>
                    <div className="font-bold text-sm">support@autozonindia.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-xl shrink-0"><MapPin className="w-5 h-5 text-emerald-400" /></div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Business Address</div>
                    <div className="font-medium text-sm text-slate-300 leading-relaxed">AutoZonIndia Head Office,<br/>Sector 15, Part 2,<br/>Gurugram, Haryana - 122001</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Visual Representation */}
            <div className="bg-slate-200 rounded-3xl h-48 w-full flex flex-col items-center justify-center text-slate-500 shadow-inner border border-slate-300 relative overflow-hidden">
              <MapPin className="w-8 h-8 text-slate-400 mb-2 z-10" />
              <span className="font-bold text-sm z-10">Google Maps View</span>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #94a3b8 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-3 bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Send us a message</h3>
            <p className="text-slate-500 font-medium mb-8">Hume message karein aur humari team jald hi aapse contact karegi.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wider">Your Name</label>
                  <input type="text" required placeholder="e.g. Vikram Sharma" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wider">Phone / WhatsApp</label>
                  <input type="tel" required placeholder="e.g. 8591719499" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium transition-all" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wider">Message / Part Request</label>
                <textarea rows="4" required placeholder="Specify part number, vehicle make, or your question..." className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium transition-all resize-none"></textarea>
              </div>

              <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-black py-4 px-8 rounded-xl transition-colors shadow-lg shadow-orange-500/30 flex items-center gap-2">
                Send Message <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export const OffersView = () => {
  const { navigateTo } = useStore();

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12 shadow-inner">
            <Flame className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">Exclusive Deals & Offers</h2>
          <p className="text-slate-500 font-medium text-lg">Save big on premium spare parts with our latest coupons.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Offer 1 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
            <div className="absolute -right-8 -top-8 bg-orange-50 w-32 h-32 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10">
              <div className="bg-orange-100 text-orange-700 font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg inline-flex mb-4">Limited Time</div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">Festive Discount - 10% OFF</h3>
              <p className="text-slate-600 font-medium mb-6">Get flat 10% discount on all Clutch Kits, Brake Oils & Accessories.</p>
              
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-4 mb-6 text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Use Code at Checkout</span>
                <code className="text-2xl font-black text-orange-600 tracking-wider">AUTOZON10</code>
              </div>
              
              <button onClick={() => navigateTo('catalog')} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-slate-900/20">
                Shop With Coupon
              </button>
            </div>
          </div>

          {/* Offer 2 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
            <div className="absolute -right-8 -bottom-8 bg-emerald-50 w-32 h-32 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10">
              <div className="bg-emerald-100 text-emerald-700 font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg inline-flex mb-4">Always Active</div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">Free Express Shipping</h3>
              <p className="text-slate-600 font-medium mb-6">Free PAN-India delivery on all orders above ₹499. Applied automatically at checkout.</p>
              
              <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6">
                <div className="bg-emerald-200/50 p-2 rounded-lg shrink-0"><ShieldCheck className="w-6 h-6 text-emerald-700" /></div>
                <div>
                  <div className="font-bold text-emerald-900">Guaranteed Delivery</div>
                  <div className="text-xs font-medium text-emerald-700 mt-0.5">Trackable insured shipments</div>
                </div>
              </div>
              
              <button onClick={() => navigateTo('catalog')} className="w-full bg-white border-2 border-slate-200 hover:border-emerald-500 hover:text-emerald-700 text-slate-700 font-bold py-3.5 rounded-xl transition-colors">
                Explore Spares
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};


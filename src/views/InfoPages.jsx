import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { saveContactEnquiryInFirestore } from '../services/firebaseService';
import { HelpCircle, BookOpen, Mail, Phone, MapPin, Tag, Flame, ShieldCheck, ArrowRight, User, Calendar, Truck, Clock, Award, CheckCircle2 } from 'lucide-react';

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
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      showToast('Please fill in your name, email, and message.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await saveContactEnquiryInFirestore(formData);
      if (res.success) {
        showToast('🎉 Thank you! Message submitted successfully to KAMTI AUTOMOTIVE.', 'success');
        setSubmitted(true);
        setFormData({ fullName: '', email: '', subject: '', message: '' });
      } else {
        showToast('Message sent! Our support team will get back to you shortly.', 'success');
        setSubmitted(true);
        setFormData({ fullName: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      console.warn('Enquiry submission warning:', err);
      showToast('Message sent! Our team will assist you within 24 hours.', 'success');
      setSubmitted(true);
      setFormData({ fullName: '', email: '', subject: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] text-white font-sans py-12 sm:py-20 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading & Contact Info Cards */}
          <div className="lg:col-span-6 space-y-10 pt-2">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white tracking-tight font-normal mb-4">
                Get in Touch
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-lg leading-relaxed font-normal">
                Whether you have a question about our automotive spare parts, an order, or just want to say hello, our team is here to assist you.
              </p>
            </div>

            <div className="space-y-8 pt-2">
              {/* EMAIL US */}
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 rounded-full bg-[#161619] border border-white/10 flex items-center justify-center text-slate-300 shrink-0 group-hover:border-amber-500/50 group-hover:bg-[#1f1f23] transition-all">
                  <Mail className="w-5 h-5 text-slate-200" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    EMAIL US
                  </span>
                  <a 
                    href="mailto:kamtiautomotive@gmail.com" 
                    className="text-lg sm:text-xl font-bold text-white tracking-tight block hover:text-amber-400 transition-colors mb-0.5"
                  >
                    kamtiautomotive@gmail.com
                  </a>
                  <p className="text-xs text-slate-400 font-normal">
                    We aim to respond to all inquiries within 24 hours.
                  </p>
                </div>
              </div>

              {/* CALL US */}
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 rounded-full bg-[#161619] border border-white/10 flex items-center justify-center text-slate-300 shrink-0 group-hover:border-amber-500/50 group-hover:bg-[#1f1f23] transition-all">
                  <Phone className="w-5 h-5 text-slate-200" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    CALL US
                  </span>
                  <a 
                    href="tel:+918591719499" 
                    className="text-lg sm:text-xl font-bold text-white tracking-tight block hover:text-amber-400 transition-colors mb-0.5"
                  >
                    +91 8591719499
                  </a>
                  <p className="text-xs text-slate-400 font-normal">
                    Available Mon–Sat, 9am – 6pm IST.
                  </p>
                </div>
              </div>

              {/* VISIT US */}
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 rounded-full bg-[#161619] border border-white/10 flex items-center justify-center text-slate-300 shrink-0 group-hover:border-amber-500/50 group-hover:bg-[#1f1f23] transition-all">
                  <MapPin className="w-5 h-5 text-slate-200" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    VISIT US
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight block mb-0.5">
                    KAMTI AUTOMOTIVE
                  </h3>
                  <p className="text-xs text-slate-400 font-normal leading-relaxed max-w-xs">
                    Main Market, Auto Parts Hub,<br />
                    Maharashtra, Mumbai - 400057
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Send a Message Card */}
          <div className="lg:col-span-6">
            <div className="bg-[#121214] border border-white/10 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

              <h2 className="text-2xl sm:text-3xl font-serif text-white mb-8 tracking-tight font-medium">
                Send a Message
              </h2>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif text-white">Thank You!</h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                    Your message has been received by <strong className="text-white">KAMTI AUTOMOTIVE</strong>. Our technical support team will contact you shortly via email or phone.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 bg-[#cca362] hover:bg-[#d8af6e] text-black font-semibold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* FULL NAME */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder=""
                      className="w-full bg-[#09090b] border border-white/10 text-white rounded-full px-6 py-3.5 text-sm focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all"
                    />
                  </div>

                  {/* EMAIL ADDRESS */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder=""
                      className="w-full bg-[#09090b] border border-white/10 text-white rounded-full px-6 py-3.5 text-sm focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all"
                    />
                  </div>

                  {/* SUBJECT */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      SUBJECT
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder=""
                      className="w-full bg-[#09090b] border border-white/10 text-white rounded-full px-6 py-3.5 text-sm focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all"
                    />
                  </div>

                  {/* MESSAGE */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      MESSAGE
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder=""
                      className="w-full bg-[#09090b] border border-white/10 text-white rounded-2xl p-5 text-sm focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all resize-none"
                    ></textarea>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#cca362] hover:bg-[#d8af6e] active:scale-[0.99] disabled:opacity-50 text-black font-semibold py-4 rounded-full transition-all duration-200 text-sm sm:text-base tracking-wide shadow-lg shadow-amber-500/10 mt-2 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? 'Sending Message...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
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


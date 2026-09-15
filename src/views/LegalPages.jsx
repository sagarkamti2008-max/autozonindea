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
        <h3>Aapka Data Aur Uski Security</h3>
        <p>AutoZonIndia par hum aapki privacy ki bohot qadar karte hain. Order process karne ke liye hum sirf zaroori data collect karte hain jaise ki aapka <strong>Name, Address, Email, aur Phone number</strong>.</p>
        
        <h3>Payment Security (Razorpay)</h3>
        <p>Payments ke liye hum India ka most trusted gateway, <strong>Razorpay</strong> use karte hain. Aapki card details, UPI ID, ya netbanking information directly Razorpay secure servers par process hoti hai. Hum aapka payment data apne servers par store nahi karte.</p>
        
        <h3>Cookies</h3>
        <p>Humari website aapke cart, login session, aur past browsed items ko yaad rakhne ke liye essential cookies ka use karti hai taaki aapka shopping experience smooth rahe.</p>

        <h3>Data Protection</h3>
        <p>Aapka sara personal data industry-standard encryption se secure rakha jata hai. Hum aapka data kisi third-party advertisers ko nahi bechte.</p>
      </div>
    </div>
  </div>
);

export const TermsView = () => (
  <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-10 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-2xl"><FileText className="w-8 h-8 text-blue-600" /></div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Terms & Conditions</h2>
      </div>
      <div className="prose prose-slate max-w-none prose-p:font-medium prose-p:text-slate-600 prose-headings:font-black prose-headings:text-slate-900">
        <h3>Site Use</h3>
        <p>AutoZonIndia ka istemal sirf genuine spare parts kharidne ke liye kiya jaa sakta hai. Website content, images, ya data ko copy ya misuse karna sakht mana hai.</p>
        
        <h3>Pricing & GST</h3>
        <p>Website par dikhne wale sabhi products ke prices mein GST (Goods and Services Tax) already included hota hai. B2B customers checkout ke baad GST invoice download kar sakte hain.</p>
        
        <h3>Product Images Indicative</h3>
        <p>Website par products ki jo images hain wo reference ke liye (indicative) hain. Actual part, brand ki nayi packaging ya update ke hisaab se slightly alag dikh sakta hai, par fitment 100% same rahega.</p>

        <h3>Liability Limited</h3>
        <p>Part lagane (installation) ke waqt kisi mechanic ki galti se part tootna ya gaadi mein kisi aur tarah ka nuksaan hone ki zimmedari AutoZonIndia ki nahi hogi. Hum sirf defective parts ki guarantee dete hain.</p>
      </div>
    </div>
  </div>
);

export const ShippingPolicyView = () => (
  <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-10 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-emerald-100 p-4 rounded-2xl"><Truck className="w-8 h-8 text-emerald-600" /></div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Shipping & Delivery</h2>
      </div>
      <div className="prose prose-slate max-w-none prose-p:font-medium prose-p:text-slate-600 prose-headings:font-black prose-headings:text-slate-900">
        <h3>Dispatch & Delivery Time</h3>
        <p>Sahi parts deliver karna humari pehli priority hai. 
          <br/><strong>Dispatch:</strong> Sabhi confirmed orders 24 se 48 working hours ke andar warehouse se dispatch kar diye jate hain.
          <br/><strong>Delivery:</strong> Dispatch hone ke baad, aapke pincode ke hisaab se order deliver hone me usually <strong>3 se 7 din</strong> lagte hain.
        </p>
        
        <h3>Shipping Charges</h3>
        <p>
          - <strong>₹999 se upar ke orders:</strong> FREE Delivery!<br/>
          - <strong>₹999 se kam ke orders:</strong> Nominal shipping charge (jaise ₹49) apply hoga jo checkout par dikhaya jayega.
        </p>
        
        <h3>COD (Cash On Delivery)</h3>
        <p>COD ki suvidha available hai! Aap checkout ke dauran apna pincode daalkar check kar sakte hain ki aapke area mein COD available hai ya nahi.</p>
      </div>
    </div>
  </div>
);

export const ReturnPolicyView = () => (
  <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-10 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-purple-100 p-4 rounded-2xl"><RefreshCw className="w-8 h-8 text-purple-600" /></div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Returns, Refund & Replacement</h2>
      </div>
      <div className="prose prose-slate max-w-none prose-p:font-medium prose-p:text-slate-600 prose-headings:font-black prose-headings:text-slate-900">
        <h3>7-Days Return Policy</h3>
        <p>Agar aapne galat part order kar diya hai, toh aap delivery ke 7 din ke andar return kar sakte hain. Part bilkul <strong>unused hona chahiye aur original brand packing</strong> ke sath return karna zaroori hai.</p>
        
        <h3>Wrong / Damaged Part?</h3>
        <p>Agar humari taraf se koi galat part bheja gaya hai ya part raste me toot gaya (damaged in transit), toh hum aapko <strong>Free Replacement</strong> denge.</p>
        
        <h3>Return Process</h3>
        <p>
          Return bahut asaan hai:<br/>
          1. <strong>Contact Us:</strong> Hame WhatsApp ya Email par order ID aur problem ki photo bhejein.<br/>
          2. <strong>Pickup:</strong> Humara courier partner 24-48 hours me free reverse pickup karega.<br/>
          3. <strong>Refund/Replace:</strong> Jaise hi part hamare warehouse phochta hai, aapka refund ya replacement process kar diya jayega.
        </p>

        <h3>Non-Returnable Items (Please Note)</h3>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="m-0 text-red-800 font-bold mb-2">Neeche diye gaye items wapas nahi honge agar unki seal khul gayi hai ya install koshish hui hai:</p>
          <ul className="text-red-700 m-0">
            <li><strong>Engine Oil & Lubricants</strong> (Agar seal tuti hui hai)</li>
            <li><strong>Electrical Items</strong> (Jaise ki ECU, Sensors, Relays, Wiring, Modules - clear installation issue ki wajah se return allowed nahi hai)</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

import React, { useState, useEffect } from 'react';
import { checkPincodeServiceability } from '../services/shippingService';
import { MapPin, Truck, CheckCircle2, XCircle, Clock, ShieldCheck } from 'lucide-react';

export function PincodeDeliveryChecker({ compact = false, variant = 'light' }) {
  const [pincode, setPincode] = useState(() => localStorage.getItem('autozon_user_pincode') || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('autozon_user_pincode');
    if (saved && saved.length === 6) {
      checkPin(saved);
    }
  }, []);

  const checkPin = async (pin) => {
    if (!pin || pin.length !== 6) return;
    setLoading(true);
    setResult(null);
    const res = await checkPincodeServiceability(pin);
    setResult(res);
    setLoading(false);
    if (res && res.isServiceable) {
      localStorage.setItem('autozon_user_pincode', pin);
    }
  };

  const handleCheck = (e) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      checkPin(pincode.trim());
    }
  };

  const isLight = variant === 'light';

  return (
    <div className={`rounded-2xl p-4 sm:p-5 transition-all ${
      isLight
        ? 'bg-white border border-slate-200/90 shadow-sm'
        : 'bg-slate-900 border border-slate-800 text-white shadow-xl'
    } ${compact ? 'w-full' : 'max-w-xl mx-auto'}`}>
      <div className="flex items-center space-x-3 mb-3">
        <div className={`p-2 rounded-xl shrink-0 ${isLight ? 'bg-[#0B5394]/10 text-[#0B5394]' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
          <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <h3 className={`font-black text-xs sm:text-sm uppercase tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Delivery Speed &amp; Serviceability
          </h3>
          <p className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Enter 6-digit Pincode for live delivery ETA
          </p>
        </div>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <MapPin className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-slate-400'}`} />
          <input
            type="text"
            maxLength="6"
            placeholder="Pincode e.g. 400055"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all outline-none ${
              isLight
                ? 'bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0B5394] focus:ring-2 focus:ring-[#0B5394]/10'
                : 'bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:border-amber-500'
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={loading || pincode.length !== 6}
          className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center shrink-0 ${
            isLight
              ? 'bg-[#0B5394] hover:bg-[#094378] text-white shadow-md shadow-[#0B5394]/20'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
          }`}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Check ETA'
          )}
        </button>
      </form>

      {/* Result Status Box */}
      {result && (
        <div className={`p-3.5 rounded-xl border text-xs transition-all ${
          result.isServiceable
            ? isLight ? 'bg-emerald-50 border-emerald-300 text-slate-900 shadow-sm' : 'bg-emerald-950/80 border-emerald-600/40 text-emerald-200'
            : isLight ? 'bg-rose-50 border-rose-300 text-slate-900 shadow-sm' : 'bg-rose-950/80 border-rose-600/40 text-rose-200'
        }`}>
          <div className="flex items-start space-x-2.5">
            {result.isServiceable ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className={`font-black text-xs sm:text-sm ${
                  result.isServiceable
                    ? isLight ? 'text-emerald-950' : 'text-emerald-300'
                    : isLight ? 'text-rose-950' : 'text-rose-300'
                }`}>
                  {result.isServiceable ? `✓ Delivery Available to Pincode ${result.pincode}` : 'Delivery Currently Unavailable'}
                </h4>
                {result.isLiveApi && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide rounded-md bg-emerald-600 text-white shadow-xs">
                    ⚡ Live API
                  </span>
                )}
              </div>
              
              <p className={`text-[11px] mt-1 font-semibold leading-relaxed ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                {result.message}
              </p>

              {result.isServiceable && (
                <div className={`flex flex-wrap items-center gap-3 mt-2.5 pt-2 border-t text-[11px] ${isLight ? 'border-emerald-200' : 'border-slate-800'}`}>
                  <div className="flex items-center space-x-1 font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className={isLight ? 'text-slate-800' : 'text-slate-200'}>Est. Speed: <strong className="text-emerald-700 dark:text-emerald-400">{result.estimatedDays || 3} Business Days</strong></span>
                  </div>
                  <div className="flex items-center space-x-1 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className={isLight ? 'text-slate-800' : 'text-slate-200'}>Cash on Delivery: <strong className="text-emerald-700 dark:text-emerald-400">{result.codAvailable ? 'Available' : 'Prepaid Only'}</strong></span>
                  </div>
                  {result.couriers && result.couriers.length > 0 && (
                    <div className="w-full mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-medium">Couriers:</span>
                      {result.couriers.slice(0, 4).map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/80 border border-slate-200 text-slate-700 shadow-2xs">
                          {c.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PincodeDeliveryChecker;

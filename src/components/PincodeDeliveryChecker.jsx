import React, { useState } from 'react';
import { checkPincodeServiceability } from '../services/shippingService';
import { MapPin, Truck, CheckCircle2, XCircle, Clock, ShieldCheck } from 'lucide-react';

export function PincodeDeliveryChecker({ compact = false }) {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!pincode.trim()) return;

    setLoading(true);
    setResult(null);

    const res = await checkPincodeServiceability(pincode.trim());
    setResult(res);
    setLoading(false);
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl ${compact ? 'max-w-md' : 'max-w-xl mx-auto'}`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <Truck className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h3 className="font-bold text-white text-base">Check Delivery & Serviceability</h3>
          <p className="text-xs text-slate-400">Enter your 6-digit Indian pincode to view estimated delivery speed</p>
        </div>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            maxLength="6"
            placeholder="Enter Pincode (e.g. 110001)"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition font-mono tracking-wider"
          />
        </div>
        <button
          type="submit"
          disabled={loading || pincode.length !== 6}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition disabled:opacity-50 flex items-center shadow-lg shadow-amber-500/20"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Check'
          )}
        </button>
      </form>

      {/* Result Status Box */}
      {result && (
        <div className={`p-4 rounded-xl border text-sm transition-all animate-fadeIn ${
          result.isServiceable
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          <div className="flex items-start space-x-3">
            {result.isServiceable ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h4 className="font-bold text-sm text-white">
                {result.isServiceable ? 'Delivery Available' : 'Delivery Currently Unavailable'}
              </h4>
              <p className="text-xs mt-1 text-slate-300 leading-relaxed">{result.message}</p>

              {result.isServiceable && (
                <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center space-x-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Speed: <strong>{result.estimatedDays || 3} Days</strong></span>
                  </div>
                  <div className="flex items-center space-x-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cash on Delivery: <strong>{result.codAvailable ? 'Supported' : 'Prepaid Only'}</strong></span>
                  </div>
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

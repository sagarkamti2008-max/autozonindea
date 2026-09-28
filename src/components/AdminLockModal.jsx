import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, Key, AlertTriangle, ArrowRight } from 'lucide-react';

export const ADMIN_MASTER_PASSCODE = 'Kamti!Admin#2026@X7pQ';

export const AdminLockModal = ({ onUnlock, onCancel }) => {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (passcode.trim() === ADMIN_MASTER_PASSCODE) {
      sessionStorage.setItem('autozon_admin_master_unlocked', 'true');
      onUnlock();
    } else {
      setIsShaking(true);
      setErrorMsg('❌ Incorrect Master Passcode! Access Denied.');
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[99999] flex items-center justify-center p-4 selection:bg-[#FF5722] selection:text-white">
      <div className={`bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 transition-all ${isShaking ? 'animate-bounce' : ''}`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center mx-auto mb-3 backdrop-blur-md shadow-inner">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>
          <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-amber-400/30 inline-block mb-2">
            🔒 Protected Admin Portal
          </span>
          <h2 className="text-xl font-black uppercase tracking-tight text-white">
            Kamti Automotive Admin Lock
          </h2>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Enter your Master Admin Passcode to access store operations.
          </p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase mb-1.5 tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#FF5722]" /> Master Admin Passcode
            </label>
            <div className="relative">
              <input
                type={showPasscode ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Enter Kamti Admin Passcode"
                autoFocus
                required
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm font-extrabold rounded-xl pl-4 pr-11 py-3.5 focus:outline-none focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20 transition"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-md transition"
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3.5 rounded-xl border border-slate-300 transition cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex-1 bg-[#FF5722] hover:bg-[#e04816] text-white font-black text-xs py-3.5 rounded-xl shadow-lg shadow-orange-500/25 transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Unlock Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center pt-1">
            <span className="text-[10px] text-slate-500 font-bold">
              Protected by Kamti Enterprise Security System 🛡️
            </span>
          </div>
        </form>

      </div>
    </div>
  );
};

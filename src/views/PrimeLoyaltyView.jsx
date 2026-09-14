import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Crown, Wallet, Gift, Sparkles, CheckCircle2, ArrowRight, Share2,
  Copy, ShieldCheck, Zap, RefreshCw, CreditCard, ChevronRight, Award
} from 'lucide-react';

export const PrimeLoyaltyView = () => {
  const { showToast, navigateTo } = useStore();

  const [isPrimeMember, setIsPrimeMember] = useState(true);
  const [walletBalance, setWalletBalance] = useState(18450.60);
  const [copiedLink, setCopiedLink] = useState(false);

  const [transactions, setTransactions] = useState([
    { id: 'TXN-901', title: '50% Monthly Shipping Cashback Added', date: '2026-09-08', amount: '+ ₹8,250.00', type: 'credit' },
    { id: 'TXN-884', title: 'Prime 5% Extra Purchase Cashback (Order #AZI-849201)', date: '2026-09-05', amount: '+ ₹485.00', type: 'credit' },
    { id: 'TXN-812', title: 'Garage Referral Bonus (SpeedCare Motors)', date: '2026-08-30', amount: '+ ₹250.00', type: 'credit' },
    { id: 'TXN-790', title: 'Redeemed on Order #AZI-771029', date: '2026-08-20', amount: '- ₹1,500.00', type: 'debit' }
  ]);

  const handleCopyReferral = () => {
    setCopiedLink(true);
    showToast('📋 Referral Link copied to clipboard! Share with mechanics & friends to earn ₹250 each');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleClaimReward = (title, bonus) => {
    setWalletBalance(prev => prev + bonus);
    const newTxn = {
      id: `TXN-${Math.floor(100 + Math.random() * 900)}`,
      title: title,
      date: new Date().toLocaleDateString('en-CA'),
      amount: `+ ₹${bonus.toLocaleString()}.00`,
      type: 'credit'
    };
    setTransactions([newTxn, ...transactions]);
    showToast(`🎉 ₹${bonus} Cashback Credit Added to your AutoZon Wallet!`);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Hero Prime Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-400 text-xs font-black uppercase tracking-wider">
                <Crown className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>AutoZon Prime VIP Membership</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                Earn 5% Extra Cashback & Free Express Shipping
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                As an AutoZon Prime VIP Member, every spare part purchase automatically earns 5% cashback directly into your AutoZon Wallet.
              </p>
            </div>

            {/* Wallet Balance Card */}
            <div className="bg-slate-950/90 border-2 border-amber-500/60 rounded-2xl p-5 text-center shrink-0 w-full sm:w-72 shadow-xl">
              <div className="flex items-center justify-center gap-2 text-xs font-black text-amber-400 uppercase tracking-wider">
                <Wallet className="w-4 h-4" /> AutoZon Wallet Balance
              </div>
              <div className="text-3xl font-black text-white my-1">
                ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-emerald-400 font-bold">
                ✓ 100% Usable on all future spare parts orders
              </div>
            </div>
          </div>
        </div>


        {/* Prime Membership Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">5% Guaranteed Cashback</h3>
            <p className="text-xs text-slate-400">
              Get 5% instant cashback credited to your wallet on all orders above ₹999.
            </p>
            <button
              onClick={() => handleClaimReward('Prime Welcome VIP Bonus', 500)}
              className="mt-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition cursor-pointer"
            >
              Claim ₹500 Welcome Bonus
            </button>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Referral Rewards (₹250 / Ref)</h3>
            <p className="text-xs text-slate-400">
              Invite mechanics or car owner friends to AutoZonIndia. Both get ₹250 wallet credit!
            </p>
            <button
              onClick={handleCopyReferral}
              className="mt-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copied!' : 'Copy Referral Link'}</span>
            </button>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">VIP Priority WhatsApp Support</h3>
            <p className="text-xs text-slate-400">
              Direct line to master mechanics and fitment experts via WhatsApp (+91 8591719499).
            </p>
            <button
              onClick={() => window.open('https://wa.me/918591719499?text=Hi%20Sagar!%20I%20am%20an%20AutoZon%20Prime%20VIP%20member.', '_blank')}
              className="mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
            >
              Connect to VIP WhatsApp
            </button>
          </div>
        </div>


        {/* Wallet Transaction History Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-amber-400" />
              AutoZon Wallet Cashback History
            </h3>
            <span className="text-xs font-mono text-slate-400">{transactions.length} Total Transactions</span>
          </div>

          <div className="divide-y divide-slate-800/80 text-xs">
            {transactions.map(txn => (
              <div key={txn.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs">{txn.title}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">{txn.id} • {txn.date}</span>
                </div>
                <div className={`font-mono font-black text-sm ${txn.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {txn.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

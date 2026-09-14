import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShieldCheck, Search, Activity, Users, DollarSign, Package,
  AlertTriangle, Settings, ChevronRight, CheckCircle2, TrendingUp,
  CreditCard, Globe, Zap, Database, Download, Command
} from 'lucide-react';

export function EnterpriseAdminConsole() {
  const { products, orders, showToast, navigateTo } = useStore();
  const [activeTab, setActiveTab] = useState('overview');

  // Command Palette Mock State
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Aggregated Data Mock
  const totalGMV = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) + 1245000;
  const activeUsers = 8452;
  const disputedOrders = 3;
  const systemHealth = 99.98;

  return (
    <div className="min-h-screen bg-[#020817] text-slate-300 font-sans flex flex-col md:flex-row selection:bg-blue-500/30">
      
      {/* Sidebar */}
      <div className="w-full md:w-72 bg-[#0a1128] border-r border-slate-800/50 flex flex-col shrink-0 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-full h-32 bg-blue-600/10 blur-3xl"></div>
        
        <div className="p-6 border-b border-slate-800/50 relative z-10">
          <div className="flex items-center gap-3 text-white mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight leading-tight">God Mode</h1>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Enterprise Console</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 flex-1 space-y-1 relative z-10 overflow-y-auto">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-2">Core</div>
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === 'overview' ? 'bg-blue-600/10 text-blue-400 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.2)]' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
          >
            <Activity className="w-4 h-4" /> Global Overview
          </button>
          
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-6">Operations</div>
          <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800/50 transition">
            <div className="flex items-center gap-3"><Users className="w-4 h-4" /> User Management</div>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800/50 transition">
            <div className="flex items-center gap-3"><DollarSign className="w-4 h-4" /> Payouts & Finance</div>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800/50 transition">
            <div className="flex items-center gap-3"><Package className="w-4 h-4" /> Catalog Quality</div>
            <div className="w-5 h-5 rounded bg-rose-500/10 text-rose-400 flex items-center justify-center text-[10px]">3</div>
          </button>
          
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-6">System</div>
          <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800/50 transition">
            <div className="flex items-center gap-3"><Globe className="w-4 h-4" /> SEO & Meta Data</div>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800/50 transition">
            <div className="flex items-center gap-3"><Settings className="w-4 h-4" /> Platform Settings</div>
          </button>
        </div>

        <div className="p-4 border-t border-slate-800/50 relative z-10">
          <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <div className="text-xs font-bold text-white">System Status</div>
              <div className="text-[10px] text-emerald-400 font-medium">All Services Operational</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto relative">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 relative z-10">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Platform Command Center</h2>
            <p className="text-sm text-slate-500 mt-1">Real-time overview of the AutoZonIndia ecosystem.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCommandOpen(true)}
              className="bg-[#0a1128] hover:bg-slate-800 border border-slate-800 text-slate-300 px-4 py-2.5 rounded-xl transition flex items-center gap-2 text-sm font-medium shadow-sm"
            >
              <Search className="w-4 h-4 text-slate-500" /> Search or jump to...
              <div className="flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded text-xs text-slate-500 ml-2">
                <Command className="w-3 h-3" /> K
              </div>
            </button>
            <button onClick={() => navigateTo('home')} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20 text-sm">
              Exit God Mode
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 relative z-10">
          <div className="bg-[#0a1128]/80 backdrop-blur-md border border-slate-800/60 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-500/20 transition duration-500"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <Database className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +24.5%</span>
            </div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 relative z-10">Platform GMV</div>
            <div className="text-3xl font-black text-white relative z-10">₹{(totalGMV / 100000).toFixed(2)}L</div>
          </div>

          <div className="bg-[#0a1128]/80 backdrop-blur-md border border-slate-800/60 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-indigo-500/20 transition duration-500"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12.1%</span>
            </div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 relative z-10">Active Users</div>
            <div className="text-3xl font-black text-white relative z-10">{activeUsers.toLocaleString()}</div>
          </div>

          <div className="bg-[#0a1128]/80 backdrop-blur-md border border-slate-800/60 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-rose-500/20 transition duration-500"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 relative z-10">Disputed Orders</div>
            <div className="text-3xl font-black text-white relative z-10">{disputedOrders}</div>
            <div className="text-xs text-rose-400 mt-2 font-medium relative z-10 flex items-center gap-1">Requires Attention <ChevronRight className="w-3 h-3" /></div>
          </div>

          <div className="bg-[#0a1128]/80 backdrop-blur-md border border-slate-800/60 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-emerald-500/20 transition duration-500"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 relative z-10">System Uptime</div>
            <div className="text-3xl font-black text-white relative z-10">{systemHealth}%</div>
          </div>
        </div>

        {/* Quick Action Hub */}
        <div className="mb-10 relative z-10">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> Quick Action Hub</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, label: 'Manage Users', color: 'blue' },
              { icon: CreditCard, label: 'Approve Payouts', color: 'emerald' },
              { icon: AlertTriangle, label: 'Review Disputes', color: 'rose' },
              { icon: Download, label: 'Export Ledger', color: 'indigo' }
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <button key={idx} className="bg-[#0a1128] hover:bg-slate-800/80 border border-slate-800/60 p-4 rounded-2xl transition flex flex-col items-center justify-center text-center gap-3 group">
                  <div className={`w-12 h-12 rounded-full bg-${action.color}-500/10 text-${action.color}-400 flex items-center justify-center group-hover:scale-110 transition duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Command Palette Overlay */}
        {commandOpen && (
          <div className="fixed inset-0 bg-[#020817]/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh]">
            <div className="bg-[#0a1128] border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4">
              <div className="p-4 border-b border-slate-800 flex items-center gap-3">
                <Search className="w-5 h-5 text-blue-500" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search commands, users, orders..." 
                  className="bg-transparent border-none text-white text-lg outline-none flex-1 placeholder:text-slate-500"
                />
                <button onClick={() => setCommandOpen(false)} className="text-slate-500 hover:text-white bg-slate-900 px-2 py-1 rounded text-xs font-bold border border-slate-800">ESC</button>
              </div>
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Suggested Actions</div>
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-blue-600/10 text-slate-300 hover:text-blue-400 transition flex items-center gap-3">
                  <Package className="w-4 h-4" /> Go to Inventory Manager
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-blue-600/10 text-slate-300 hover:text-blue-400 transition flex items-center gap-3">
                  <Users className="w-4 h-4" /> View Registered Sellers
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-blue-600/10 text-slate-300 hover:text-blue-400 transition flex items-center gap-3">
                  <Download className="w-4 h-4" /> Generate Monthly GMV Report
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default EnterpriseAdminConsole;

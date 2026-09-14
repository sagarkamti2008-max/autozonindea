import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { returnsWarrantyService } from '../services/returnsWarrantyService';
import {
  RotateCcw, Clock, CheckCircle2, XCircle, ArrowRight, Eye, Package, ArrowLeft, RefreshCw
} from 'lucide-react';

export const CustomerReturnsView = ({ onNavigate }) => {
  const { currentUser, navigateTo } = useStore();
  const nav = onNavigate || navigateTo;

  const [returnsList, setReturnsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomerReturns();
  }, [currentUser?.id]);

  const loadCustomerReturns = async () => {
    setLoading(true);
    try {
      const data = await returnsWarrantyService.getReturnRequests({
        customerId: currentUser?.id || null
      });
      setReturnsList(data || []);
    } catch (err) {
      console.error('Error loading customer returns:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => nav('my-account')}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Account
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6 text-orange-500" />
              </div>
              My Returns & Replacements
            </h1>
            <p className="text-slate-500 font-medium mt-2">
              Track return request status, reverse pickup timelines, and refund approvals.
            </p>
          </div>

          <button
            onClick={loadCustomerReturns}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-bold animate-pulse">
            Loading your return history...
          </div>
        ) : returnsList.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center max-w-2xl mx-auto mt-10">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">No Return Requests Found</h3>
            <p className="text-slate-500 font-medium mb-8">
              You haven't requested any returns or replacements yet. Eligible delivered orders can be requested directly from your Orders page.
            </p>
            <button
              onClick={() => nav('orders')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-slate-900/20"
            >
              View My Orders
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {returnsList.map(item => (
              <div key={item.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div>
                    <span className="font-mono font-black text-orange-500 text-xl tracking-tight block mb-1">
                      {item.return_number}
                    </span>
                    <div className="text-sm font-medium text-slate-500">
                      Order #: <strong className="text-slate-900">{item.orders?.order_number || 'N/A'}</strong> • Requested on {new Date(item.requested_at || item.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider border ${
                      item.return_type === 'replacement' ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {item.return_type}
                    </span>

                    <span className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider border flex items-center gap-1.5 ${
                      item.status === 'completed' || item.status === 'refund_completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      item.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                      'bg-slate-50 text-slate-700 border-slate-200'
                    }`}>
                      {(item.status === 'completed' || item.status === 'refund_completed') && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {item.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                      {(!['completed', 'refund_completed', 'rejected'].includes(item.status)) && <Clock className="w-3.5 h-3.5" />}
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Return Reason</span>
                  <p className="text-slate-900 font-medium bg-slate-50 border border-slate-100 rounded-xl p-4">
                    {item.reason}
                  </p>
                </div>

                {item.return_items && item.return_items.length > 0 && (
                  <div className="mb-6">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Returned Items</span>
                    <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
                      {item.return_items.map((ritem, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 text-sm font-bold text-slate-900">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                            <Package className="w-4 h-4 text-slate-500" />
                          </div>
                          {ritem.products?.name || 'Spare Part'} 
                          <span className="ml-auto text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md text-xs">Qty: {ritem.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    onClick={() => nav(`account/returns/${item.return_number}`)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-sm text-sm"
                  >
                    <Eye className="w-4 h-4" /> View Details & Timeline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default CustomerReturnsView;

import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle, Info, AlertTriangle } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast-card toast-${toast.type}`}>
          {toast.type === 'success' && <CheckCircle size={18} />}
          {toast.type === 'info' && <Info size={18} />}
          {toast.type === 'error' && <AlertTriangle size={18} />}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

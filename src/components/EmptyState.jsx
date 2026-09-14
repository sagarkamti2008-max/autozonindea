import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Heart, Car, Search, Package, HelpCircle } from 'lucide-react';

export const EmptyState = ({ type, title, message, ctaText, ctaAction }) => {
  const { navigateTo } = useStore();

  const getIcon = () => {
    switch (type) {
      case 'wishlist': return <Heart size={54} className="empty-icon" />;
      case 'cart': return <ShoppingBag size={54} className="empty-icon" />;
      case 'garage': return <Car size={54} className="empty-icon" />;
      case 'search': return <Search size={54} className="empty-icon" />;
      case 'orders': return <Package size={54} className="empty-icon" />;
      default: return <HelpCircle size={54} className="empty-icon" />;
    }
  };

  return (
    <div className="portal-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
      {getIcon()}
      <h3 style={{ marginTop: '1rem', fontSize: '1.25rem', fontWeight: 800 }}>{title}</h3>
      <p style={{ color: '#64748B', margin: '0.5rem 0 1.5rem 0', fontSize: '0.9rem' }}>{message}</p>
      <button
        className="btn-primary"
        onClick={ctaAction || (() => navigateTo('catalog'))}
      >
        {ctaText || 'Browse Spare Parts Catalog'}
      </button>
    </div>
  );
};

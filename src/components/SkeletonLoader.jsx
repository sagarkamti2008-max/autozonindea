import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="product-card skeleton-card" style={{ opacity: 0.7 }}>
    <div className="card-img-wrap" style={{ background: '#E2E8F0', height: '180px' }}></div>
    <div className="card-body">
      <div style={{ background: '#E2E8F0', height: '12px', width: '40%', marginBottom: '8px', borderRadius: '4px' }}></div>
      <div style={{ background: '#E2E8F0', height: '18px', width: '90%', marginBottom: '12px', borderRadius: '4px' }}></div>
      <div style={{ background: '#E2E8F0', height: '14px', width: '60%', marginBottom: '16px', borderRadius: '4px' }}></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ background: '#E2E8F0', height: '24px', width: '40%', borderRadius: '4px' }}></div>
        <div style={{ background: '#E2E8F0', height: '34px', width: '35%', borderRadius: '8px' }}></div>
      </div>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 4 }) => (
  <div className="products-grid">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

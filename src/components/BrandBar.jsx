import React from 'react';
import { useStore } from '../context/StoreContext';
import { FEATURED_BRANDS } from '../data/brands';
import { ShieldCheck } from 'lucide-react';

export const BrandBar = () => {
  const { selectedBrand, setSelectedBrand } = useStore();

  return (
    <section className="brand-section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Authorized OEM & OES Manufacturers</h2>
            <p className="section-subtitle">Original Equipment Parts & Lubricants trusted by Indian Car Makers</p>
          </div>
          <span className="oem-badge"><ShieldCheck size={16} /> Verified OEM Partners</span>
        </div>

        <div className="brands-grid">
          {FEATURED_BRANDS.map(brand => (
            <div
              key={brand.id}
              className={`brand-card ${selectedBrand.toLowerCase() === brand.name.toLowerCase() ? 'active' : ''}`}
              onClick={() => setSelectedBrand(selectedBrand.toLowerCase() === brand.name.toLowerCase() ? 'all' : brand.name)}
            >
              <span className="brand-icon">{brand.logo}</span>
              <div className="brand-meta">
                <h4 className="brand-title">{brand.name}</h4>
                <span className="brand-type">{brand.type}</span>
                <span className="brand-cat">{brand.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

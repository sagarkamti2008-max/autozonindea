import React from 'react';
import { useStore } from '../context/StoreContext';
import { VEHICLE_MAKES } from '../data/vehicles';
import { Car, Search, Shield, Truck, RefreshCw, Headphones, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export const Hero = () => {
  const { setIsVehicleModalOpen, selectedVehicle, setSearchQuery, setSelectedCategory } = useStore();

  return (
    <section className="hero-section">
      <div className="container hero-container">
        {/* Left Content / Banner */}
        <div className="hero-banner-content">
          <div className="hero-badge">
            <Zap size={14} /> INDIA'S #1 AUTOMOTIVE PARTS MARKETPLACE
          </div>
          <h1 className="hero-title">
            Genuine Car Spare Parts & Accessories, <span className="title-gradient">Delivered Fast.</span>
          </h1>
          <p className="hero-description">
            From <b>Mobile Holders, Dash Cams & 7D Mats</b> to <b>BOSCH Clutch Kits, Brake Oils & Engine Fluids</b>. 100% Genuine Fitment Guaranteed.
          </p>

          <div className="hero-actions">
            <button className="btn-primary hero-btn" onClick={() => setIsVehicleModalOpen(true)}>
              <Car size={20} />
              {selectedVehicle ? `Garage: ${selectedVehicle.makeName} ${selectedVehicle.modelName}` : 'Select Your Vehicle'}
            </button>
            <button className="btn-secondary hero-btn" onClick={() => setSelectedCategory('spare_parts')}>
              Explore Mechanical Spares <ArrowRight size={18} />
            </button>
          </div>

          <div className="trust-bullets">
            <span><CheckCircle2 size={16} color="#10B981" /> 100% Genuine OEM & OES</span>
            <span><CheckCircle2 size={16} color="#10B981" /> 7-Day Easy Replacement</span>
            <span><CheckCircle2 size={16} color="#10B981" /> Fitment Guarantee</span>
          </div>
        </div>

        {/* Right Quick Parts Search Widget */}
        <div className="hero-quick-widget">
          <div className="widget-header">
            <Car size={22} className="widget-icon" />
            <div>
              <h3>Quick Spare Parts Finder</h3>
              <p>Search by Vehicle & Category</p>
            </div>
          </div>

          <div className="widget-form">
            <div className="form-group">
              <label>Select Car Make</label>
              <select className="widget-input" onChange={() => setIsVehicleModalOpen(true)}>
                <option value="">Choose Brand (Maruti, Hyundai, Tata...)</option>
                {VEHICLE_MAKES.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>What are you looking for?</label>
              <div className="quick-tags">
                <button className="tag-btn" onClick={() => setSearchQuery('Mobile Holder')}>📱 Mobile Holders</button>
                <button className="tag-btn" onClick={() => setSearchQuery('Clutch')}>⚙️ Clutch Kit</button>
                <button className="tag-btn" onClick={() => setSearchQuery('Brake Oil')}>🛢️ Brake Oil</button>
                <button className="tag-btn" onClick={() => setSearchQuery('Engine Oil')}>🛢️ Engine Oil</button>
                <button className="tag-btn" onClick={() => setSearchQuery('Mats')}>🚗 7D Floor Mats</button>
                <button className="tag-btn" onClick={() => setSearchQuery('Dash Cam')}>📷 Dash Cams</button>
              </div>
            </div>

            <button className="btn-primary widget-search-btn" onClick={() => setIsVehicleModalOpen(true)}>
              <Search size={18} /> Find Compatible Parts Now
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights Bar */}
      <div className="features-bar">
        <div className="container features-grid">
          <div className="feature-item">
            <Shield size={28} className="feature-icon" />
            <div>
              <h4>100% Genuine Spares</h4>
              <p>Direct from Bosch, Castrol, Uno Minda</p>
            </div>
          </div>
          <div className="feature-item">
            <Truck size={28} className="feature-icon" />
            <div>
              <h4>Pan-India Express Delivery</h4>
              <p>Safe packaging & real-time live tracking</p>
            </div>
          </div>
          <div className="feature-item">
            <RefreshCw size={28} className="feature-icon" />
            <div>
              <h4>7-Day Hassle Free Return</h4>
              <p>Wrong part ordered? Easy exchange policy</p>
            </div>
          </div>
          <div className="feature-item">
            <Headphones size={28} className="feature-icon" />
            <div>
              <h4>Expert Mechanic Support</h4>
              <p>Call or WhatsApp to confirm part compatibility</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

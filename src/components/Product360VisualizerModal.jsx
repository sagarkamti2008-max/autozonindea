import React, { useState, useEffect } from 'react';
import { RotateCw, ZoomIn, Play, Pause, Layers, ShieldCheck, CheckCircle2, X, Sliders } from 'lucide-react';

export const Product360VisualizerModal = ({ isOpen, onClose, product }) => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showDimensions, setShowDimensions] = useState(true);

  const totalFrames = 12;

  const currentProduct = product || {
    title: 'Ceramic Front Brake Pads (Set of 4)',
    partNumber: 'BP-SWIFT-FR',
    oemNumber: '55810-M74L00',
    price: 999,
    imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&auto=format&fit=crop&q=80',
    specs: {
      pcd: '4 x 100mm',
      thickness: '18.2mm',
      material: 'Semi-Metallic Ceramic Compound',
      weight: '1.45 kg'
    }
  };

  // 360 Rotation Auto-Spin Timer
  useEffect(() => {
    let timer;
    if (isOpen && isPlaying && !isZoomed) {
      timer = setInterval(() => {
        setCurrentFrame(prev => (prev % totalFrames) + 1);
      }, 300);
    }
    return () => clearInterval(timer);
  }, [isOpen, isPlaying, isZoomed]);

  if (!isOpen) return null;

  const handleSliderChange = (e) => {
    setCurrentFrame(parseInt(e.target.value));
    setIsPlaying(false);
  };

  const angle = ((currentFrame - 1) / totalFrames) * 360;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999, padding: '1rem' }}>
      <div style={{ background: '#FFFFFF', width: '850px', maxHeight: '92vh', borderRadius: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }}>
        
        {/* Top Header */}
        <div style={{ background: '#0F2167', color: '#FFFFFF', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <RotateCw size={24} color="#FF6B00" />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF' }}>
                360° Interactive Spare Part Visualizer & Fitment Zoom
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>
                {currentProduct.title} • OEM Part #{currentProduct.oemNumber || currentProduct.partNumber}
              </span>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Modal Main Stage Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', background: '#F8FAFC' }}>
          
          {/* Left Column: 360 Canvas Stage */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            
            {/* Live Angle Badge */}
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: '#0F2167', color: '#FFFFFF', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <RotateCw size={13} color="#FF6B00" /> Rotation: {Math.round(angle)}° (Frame {currentFrame}/{totalFrames})
            </div>

            {/* Fitment Overlay Callout Badge */}
            {showDimensions && (
              <div style={{ position: 'absolute', bottom: '5.5rem', left: '1rem', background: 'rgba(255,107,0,0.95)', color: '#FFFFFF', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 900, boxShadow: '0 4px 12px rgba(255,107,0,0.3)' }}>
                📍 PCD: {currentProduct.specs?.pcd || '4 x 100mm'} • Thick: {currentProduct.specs?.thickness || '18.2mm'}
              </div>
            )}

            {/* 360 Image Canvas with Smooth Rotation Matrix */}
            <div style={{ width: '100%', height: '340px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: isZoomed ? 'zoom-out' : 'zoom-in' }} onClick={() => setIsZoomed(!isZoomed)}>
              <img
                src={currentProduct.imageUrl || currentProduct.image}
                alt="AutoZon 360 Part"
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  transform: isZoomed ? 'scale(1.8)' : `rotateY(${angle}deg)`,
                  transition: isZoomed ? 'transform 0.3s ease' : 'transform 0.1s linear',
                  filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.15))'
                }}
              />
            </div>

            {/* 360 Slider & Animation Controls */}
            <div style={{ width: '100%', marginTop: '1rem', background: '#F1F5F9', padding: '0.85rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{ background: isPlaying ? '#FF6B00' : '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '8px', width: '38px', height: '38px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>

              <input
                type="range"
                min={1}
                max={totalFrames}
                value={currentFrame}
                onChange={handleSliderChange}
                style={{ flex: 1, accentColor: '#FF6B00', cursor: 'pointer' }}
              />

              <button
                onClick={() => setIsZoomed(!isZoomed)}
                style={{ background: isZoomed ? '#E11D48' : '#0F2167', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.45rem 0.85rem', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <ZoomIn size={15} /> {isZoomed ? 'Reset Zoom' : '2.5x Zoom'}
              </button>
            </div>
          </div>

          {/* Right Column: Spec Inspector & Compatibility */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Technical Fitment Specs */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1rem' }}>
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', fontWeight: 900, color: '#0F2167', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={16} color="#FF6B00" /> Precision Technical Specs
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.3rem', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>PCD Bolt Circle:</span>
                  <b style={{ color: '#0F172A' }}>{currentProduct.specs?.pcd || '4 x 100mm'}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.3rem', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Rotor Thickness:</span>
                  <b style={{ color: '#0F172A' }}>{currentProduct.specs?.thickness || '18.2mm'}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.3rem', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Friction Material:</span>
                  <b style={{ color: '#0F172A' }}>{currentProduct.specs?.material || 'Ceramic Composite'}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Unit Net Weight:</span>
                  <b style={{ color: '#0F172A' }}>{currentProduct.specs?.weight || '1.45 kg'}</b>
                </div>
              </div>
            </div>

            {/* OEM Fitment Guarantee Box */}
            <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '14px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#166534', fontWeight: 900, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <ShieldCheck size={18} color="#166534" /> 100% VIN Fitment Verified
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#15803D', lineHeight: 1.4 }}>
                This spare part has been 3D laser-scanned and verified against original OEM factory blueprints. Guaranteed 100% exact bolt-on fit.
              </p>
            </div>

            {/* Toggle Callout Overlay */}
            <button
              onClick={() => setShowDimensions(!showDimensions)}
              style={{ background: showDimensions ? '#FFF7ED' : '#FFFFFF', border: '1px solid #FDBA74', color: '#C2410C', padding: '0.6rem', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              <Sliders size={15} /> {showDimensions ? 'Hide PCD Dimension Overlay' : 'Show PCD Dimension Overlay'}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

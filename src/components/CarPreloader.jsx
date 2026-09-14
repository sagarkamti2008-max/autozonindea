import React, { useState, useEffect } from 'react';

export const CarPreloader = ({ onFinish, duration = 2400 }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        setIsFadingOut(true);
        setTimeout(() => {
          setIsVisible(false);
          if (onFinish) onFinish();
        }, 400);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [duration, onFinish]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.4s ease-in-out',
        pointerEvents: isFadingOut ? 'none' : 'auto',
        userSelect: 'none',
        overflow: 'hidden'
      }}
    >
      {/* Container matching AutoDukan.com layout */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', height: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        
        {/* SVG City Skyline & Birds Background (Exact Replica of AutoDukan skyline) */}
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            width: '100%',
            height: '280px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <svg width="100%" height="280" viewBox="0 0 1200 280" preserveAspectRatio="none" fill="none">
            {/* Birds silhouette in sky */}
            <path d="M 475 80 Q 480 72 485 80 Q 490 72 495 80" stroke="#CBD5E1" strokeWidth="1.8" fill="none" />
            <path d="M 492 88 Q 497 80 502 88 Q 507 80 512 88" stroke="#CBD5E1" strokeWidth="1.8" fill="none" />
            <path d="M 518 92 Q 523 85 528 92 Q 533 85 538 92" stroke="#CBD5E1" strokeWidth="1.8" fill="none" />

            {/* Left Skyline: Abraj Al Bait Clock Tower & Kuwait Towers */}
            {/* Clock Tower */}
            <path d="M 60 280 L 60 60 L 80 40 Q 85 20 90 40 L 110 60 L 110 280 M 70 80 L 100 80 L 100 110 L 70 110 Z" stroke="#CBD5E1" strokeWidth="1.5" fill="#F1F5F9" />
            <circle cx="85" cy="95" r="8" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
            
            {/* Spire Tower 2 */}
            <path d="M 125 280 L 125 80 L 140 50 L 155 80 L 155 280 M 165 280 L 165 100 L 180 80 L 195 100 L 195 280" stroke="#E2E8F0" strokeWidth="1.5" fill="#F8FAFC" />
            
            {/* Kuwait Towers Spheres */}
            <path d="M 210 280 L 230 110 L 250 280 M 230 110 L 230 30" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="230" cy="140" r="16" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="230" cy="90" r="10" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
            
            <path d="M 280 280 L 300 80 L 320 280 M 300 80 L 300 40" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="300" cy="110" r="14" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Center Suspension Bridge Silhouette */}
            <path d="M 330 280 L 370 160 L 410 280 M 370 160 L 370 280" stroke="#E2E8F0" strokeWidth="1.5" />

            {/* Right Skyline: Burj Khalifa & Kingdom Centre Riyadh */}
            <path d="M 715 280 L 730 120 L 745 50 L 760 120 L 775 280" stroke="#CBD5E1" strokeWidth="1.5" fill="#F8FAFC" />
            
            {/* Curved Skyscraper */}
            <path d="M 795 280 L 795 100 Q 815 60 835 100 L 835 280" stroke="#E2E8F0" strokeWidth="1.5" fill="#F1F5F9" />
            <path d="M 855 280 L 855 80 Q 875 40 895 80 L 895 280" stroke="#CBD5E1" strokeWidth="1.5" fill="#F8FAFC" />

            {/* Kingdom Centre Spire */}
            <path d="M 910 280 L 910 80 Q 930 40 950 80 L 950 280 M 920 100 Q 930 80 940 100" stroke="#CBD5E1" strokeWidth="1.5" fill="#F1F5F9" />
            
            {/* Right Edge Spire */}
            <path d="M 970 280 L 970 40 L 980 10 L 990 40 L 990 280" stroke="#E2E8F0" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Moving Blue SUV Car - AutoDukan Style */}
        <div
          style={{
            position: 'absolute',
            bottom: '76px',
            left: `${progress * 0.75 + 5}%`,
            transform: 'translateX(-50%)',
            zIndex: 10,
            transition: 'left 0.02s linear'
          }}
        >
          {/* Detailed Blue SUV Vector matching AutoDukan Image */}
          <div style={{ position: 'relative', animation: 'subtleBounce 0.3s infinite alternate' }}>
            <svg width="220" height="90" viewBox="0 0 220 90" fill="none">
              {/* Main SUV Body Shadow */}
              <ellipse cx="110" cy="85" rx="90" ry="4" fill="rgba(0,0,0,0.15)" />

              {/* Roof Rack Rails */}
              <rect x="50" y="8" width="100" height="3" rx="1.5" fill="#94A3B8" />
              <rect x="65" y="11" width="4" height="4" fill="#64748B" />
              <rect x="135" y="11" width="4" height="4" fill="#64748B" />

              {/* SUV Cabin / Roof */}
              <path d="M 35 42 L 55 15 L 145 15 L 175 42 Z" fill="#1D4ED8" />

              {/* Dark Tinted Glass Windows */}
              <path d="M 42 40 L 58 18 L 95 18 L 95 40 Z" fill="#1E293B" stroke="#3b82f6" strokeWidth="0.8" />
              <path d="M 100 18 L 140 18 L 168 40 L 100 40 Z" fill="#1E293B" stroke="#3b82f6" strokeWidth="0.8" />

              {/* SUV Lower Body */}
              <path d="M 10 42 Q 10 38 20 38 L 205 38 Q 215 38 215 48 L 215 68 Q 215 72 205 72 L 15 72 Q 10 72 10 65 Z" fill="#2563EB" />

              {/* Door Panel Details & Chrome Handles */}
              <line x1="97" y1="38" x2="97" y2="72" stroke="#1D4ED8" strokeWidth="1.5" />
              <rect x="75" y="44" width="12" height="3" rx="1.5" fill="#E2E8F0" />
              <rect x="125" y="44" width="12" height="3" rx="1.5" fill="#E2E8F0" />

              {/* Red Rear Taillights */}
              <rect x="10" y="44" width="6" height="18" rx="2" fill="#DC2626" />

              {/* Front Headlight Amber/Yellow */}
              <path d="M 210 46 L 215 48 L 215 58 L 208 58 Z" fill="#FEF08A" />

              {/* Wheel Arches */}
              <path d="M 35 72 A 22 22 0 0 1 75 72" fill="#1E293B" />
              <path d="M 145 72 A 22 22 0 0 1 185 72" fill="#1E293B" />

              {/* Rear Alloy Wheel */}
              <g transform="translate(55, 72)">
                <circle cx="0" cy="0" r="18" fill="#1E293B" />
                <circle cx="0" cy="0" r="12" fill="#94A3B8" />
                <circle cx="0" cy="0" r="4" fill="#F8FAFC" />
                {/* Spokes */}
                <line x1="-10" y1="0" x2="10" y2="0" stroke="#F8FAFC" strokeWidth="2" />
                <line x1="0" y1="-10" x2="0" y2="10" stroke="#F8FAFC" strokeWidth="2" />
                <line x1="-7" y1="-7" x2="7" y2="7" stroke="#F8FAFC" strokeWidth="2" />
                <line x1="-7" y1="7" x2="7" y2="-7" stroke="#F8FAFC" strokeWidth="2" />
              </g>

              {/* Front Alloy Wheel */}
              <g transform="translate(165, 72)">
                <circle cx="0" cy="0" r="18" fill="#1E293B" />
                <circle cx="0" cy="0" r="12" fill="#94A3B8" />
                <circle cx="0" cy="0" r="4" fill="#F8FAFC" />
                {/* Spokes */}
                <line x1="-10" y1="0" x2="10" y2="0" stroke="#F8FAFC" strokeWidth="2" />
                <line x1="0" y1="-10" x2="0" y2="10" stroke="#F8FAFC" strokeWidth="2" />
                <line x1="-7" y1="-7" x2="7" y2="7" stroke="#F8FAFC" strokeWidth="2" />
                <line x1="-7" y1="7" x2="7" y2="-7" stroke="#F8FAFC" strokeWidth="2" />
              </g>
            </svg>
          </div>
        </div>

        {/* Clean Grey Road Base Line (Exact AutoDukan match) */}
        <div style={{ width: '90%', height: '3px', background: '#475569', borderRadius: '2px', position: 'relative', marginTop: '10px' }} />

      </div>

      {/* Subtle Bottom Progress Bar */}
      <div style={{ width: '240px', height: '3px', background: '#E2E8F0', borderRadius: '2px', marginTop: '20px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: '#2563EB',
            transition: 'width 0.02s linear'
          }}
        />
      </div>

      {/* Subtle Bounce Animation */}
      <style>{`
        @keyframes subtleBounce {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-1.5px); }
        }
      `}</style>

    </div>
  );
};

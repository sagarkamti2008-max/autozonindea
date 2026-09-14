import React, { useState, useEffect } from 'react';
import { Camera, Keyboard, X, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export const BarcodeScannerModal = ({ isOpen, onClose, onScanSuccess, title = 'Barcode & QR Scanner' }) => {
  const [manualInput, setManualInput] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [scanStatus, setScanStatus] = useState(null); // { type: 'success' | 'error', text: string }

  // Listen for hardware USB / Bluetooth barcode scanner inputs (keyboard wedge)
  useEffect(() => {
    if (!isOpen) return;

    let buffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e) => {
      const currentTime = Date.now();

      // Scanners send characters with < 50ms interval followed by 'Enter'
      if (currentTime - lastKeyTime > 100) {
        buffer = '';
      }
      lastKeyTime = currentTime;

      if (e.key === 'Enter') {
        if (buffer.length >= 3) {
          e.preventDefault();
          handleScannedCode(buffer);
          buffer = '';
        }
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleScannedCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return;

    setScanStatus({ type: 'success', text: `Scanned: ${cleanCode}` });
    if (onScanSuccess) {
      onScanSuccess(cleanCode);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) {
      setErrorMsg('Please enter a barcode or SKU.');
      return;
    }
    setErrorMsg(null);
    handleScannedCode(manualInput);
    setManualInput('');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
            <Camera size={22} />
            <span>{title}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status Alert */}
        {scanStatus && (
          <div className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            scanStatus.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            <CheckCircle2 size={16} />
            <span>{scanStatus.text}</span>
          </div>
        )}

        {/* Camera View Finder Simulation / Device Stream Placeholder */}
        <div className="relative bg-slate-950 border-2 border-dashed border-emerald-500/40 rounded-2xl h-56 flex flex-col items-center justify-center text-center p-6 overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-1 bg-emerald-500/80 animate-pulse shadow-lg shadow-emerald-500"></div>

          <Camera size={44} className="text-emerald-400 mb-3 animate-bounce" />
          <h4 className="text-sm font-bold text-slate-200 mb-1">Position Barcode in Camera Viewfinder</h4>
          <p className="text-xs text-slate-400 max-w-xs">
            Supports 1D/2D Barcodes, EAN13, Code128 &amp; QR Codes. USB/Bluetooth Scanner Ready.
          </p>

          <span className="mt-4 px-3 py-1 bg-slate-900 text-slate-300 text-[11px] font-mono border border-slate-800 rounded-full flex items-center gap-1.5">
            <RefreshCw size={12} className="animate-spin text-emerald-400" /> Scanner Active
          </span>
        </div>

        {/* Manual Barcode Input Fallback */}
        <form onSubmit={handleManualSubmit} className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Keyboard size={14} className="text-slate-400" /> Manual Barcode / SKU Entry
          </label>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. AZ-BOSCH-BP-001 or 890123456789"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 font-mono focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-400 transition-colors"
            >
              Verify Code
            </button>
          </div>

          {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}
        </form>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700 transition-colors"
          >
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  );
};

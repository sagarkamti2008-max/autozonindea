import React, { useState } from 'react';
import { Printer, Download, X, Layers, Tag } from 'lucide-react';
import { warehouseFulfillmentService } from '../services/warehouseFulfillmentService';

export const BarcodePrintLabelModal = ({ isOpen, onClose, product }) => {
  const [layoutMode, setLayoutMode] = useState('single'); // 'single', 'thermal', 'grid'
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const barcodeText = warehouseFulfillmentService.generateInternalBarcode(product);
  const qrUrl = warehouseFulfillmentService.generateQRCodePayload(product);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
            <Tag size={20} />
            <span>Barcode &amp; QR Label Print Studio</span>
          </div>
          <button onClick={onClose} className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Layout Options */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold mr-1">Layout Mode:</span>
            <button
              onClick={() => setLayoutMode('single')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                layoutMode === 'single' ? 'bg-emerald-500 text-slate-950 border-emerald-500' : 'bg-slate-900 text-slate-300 border-slate-800'
              }`}
            >
              Single Label
            </button>
            <button
              onClick={() => setLayoutMode('thermal')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                layoutMode === 'thermal' ? 'bg-emerald-500 text-slate-950 border-emerald-500' : 'bg-slate-900 text-slate-300 border-slate-800'
              }`}
            >
              Thermal Sticker (4x2")
            </button>
            <button
              onClick={() => setLayoutMode('grid')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                layoutMode === 'grid' ? 'bg-emerald-500 text-slate-950 border-emerald-500' : 'bg-slate-900 text-slate-300 border-slate-800'
              }`}
            >
              A4 Grid (24 Labels)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-semibold">Copies:</label>
            <input
              type="number"
              min={1}
              max={100}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value || 1, 10))}
              className="w-16 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-100 text-center font-bold"
            />
          </div>
        </div>

        {/* Printable Label Container */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 overflow-y-auto max-h-96">
          {layoutMode === 'grid' ? (
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: Math.min(quantity, 24) }).map((_, idx) => (
                <div key={idx} className="bg-white text-slate-950 p-3 rounded border border-slate-300 font-sans text-center flex flex-col justify-between h-36">
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-tight text-emerald-800">AutoZoneIndia</div>
                    <div className="text-xs font-bold truncate leading-tight mt-0.5">{product.name || product.title}</div>
                    <div className="text-[9px] text-slate-600 font-mono mt-0.5">SKU: {product.sku || product.part_number || 'AZ-PROD'}</div>
                  </div>

                  {/* Simulated 1D Barcode bars */}
                  <div className="my-1.5 flex justify-center items-center gap-0.5 h-7 overflow-hidden">
                    <div className="w-1 h-full bg-black"></div>
                    <div className="w-0.5 h-full bg-black"></div>
                    <div className="w-1.5 h-full bg-black"></div>
                    <div className="w-0.5 h-full bg-black"></div>
                    <div className="w-1 h-full bg-black"></div>
                    <div className="w-2 h-full bg-black"></div>
                    <div className="w-0.5 h-full bg-black"></div>
                    <div className="w-1 h-full bg-black"></div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] border-t border-slate-200 pt-1 font-mono font-bold">
                    <span>{barcodeText}</span>
                    <span className="text-slate-900 font-extrabold">₹{product.price}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-sm mx-auto bg-white text-slate-950 p-5 rounded-xl border border-slate-300 shadow-xl font-sans space-y-3">
              <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">AutoZoneIndia Genuine Spare</span>
                  <h3 className="text-sm font-extrabold line-clamp-1 leading-snug">{product.name || product.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-slate-900 block">₹{product.price}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-700">
                <div>SKU: <strong className="text-slate-950">{product.sku || 'AZ-PROD'}</strong></div>
                <div>PN: <strong className="text-slate-950">{product.part_number || 'OEM-REF'}</strong></div>
              </div>

              {/* Barcode Visual */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-center space-y-1">
                <div className="flex justify-center items-center gap-0.5 h-10 overflow-hidden px-4">
                  <div className="w-1 h-full bg-black"></div>
                  <div className="w-0.5 h-full bg-black"></div>
                  <div className="w-2 h-full bg-black"></div>
                  <div className="w-0.5 h-full bg-black"></div>
                  <div className="w-1 h-full bg-black"></div>
                  <div className="w-1.5 h-full bg-black"></div>
                  <div className="w-0.5 h-full bg-black"></div>
                  <div className="w-2 h-full bg-black"></div>
                  <div className="w-1 h-full bg-black"></div>
                </div>
                <div className="text-xs font-mono font-bold tracking-widest text-slate-950">{barcodeText}</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <Printer size={16} /> Print Barcode Label
          </button>
        </div>
      </div>
    </div>
  );
};

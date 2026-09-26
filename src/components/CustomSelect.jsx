import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ value, onChange, options, placeholder, disabled, label, labelKey, valueKey, dark = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLabel = (opt) => {
    if (!opt) return placeholder;
    if (labelKey) {
      if (typeof opt === 'object') return opt[labelKey];
      const found = options.find(o => o[valueKey] === opt);
      if (found) return found[labelKey];
    }
    return opt;
  };

  const getValue = (opt) => {
    if (valueKey && typeof opt === 'object') return opt[valueKey];
    return opt;
  };

  return (
    <div className={`relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`} ref={dropdownRef}>
      {label && (
        <label className={`block text-[10px] font-black uppercase tracking-wider mb-1.5 ${dark ? 'text-slate-300' : 'text-slate-900'}`}>
          {label}
        </label>
      )}
      <div
        className={`w-full border-2 ${
          dark 
            ? `bg-slate-950 ${isOpen ? 'border-[#FF5722] shadow-lg shadow-orange-500/10' : 'border-slate-800 hover:border-slate-700'} text-white` 
            : `bg-slate-50 ${isOpen ? 'border-orange-500' : 'border-slate-200 hover:border-slate-300'} text-slate-900`
        } font-black rounded-xl px-2.5 py-2.5 sm:px-4 sm:py-3 flex justify-between items-center cursor-pointer transition-all min-w-0`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={`truncate text-xs sm:text-sm min-w-0 ${value ? (dark ? 'text-white' : 'text-slate-900 font-black') : (dark ? 'text-slate-400 font-bold' : 'text-slate-500 font-bold')}`}>
          {getLabel(value) || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ml-1 ${dark ? 'text-slate-300' : 'text-slate-900'} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className={`absolute z-[100] w-full mt-2 border rounded-2xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar ${
          dark ? 'bg-slate-900 border-slate-700 text-white shadow-orange-500/10' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          {options.length === 0 ? (
            <div className="px-4 py-3 text-slate-900 text-sm font-bold">No options available</div>
          ) : (
            options.map((opt, idx) => {
              const optVal = getValue(opt);
              const isSelected = value === optVal;
              return (
                <div
                  key={idx}
                  className={`px-4 py-3 cursor-pointer text-sm font-black flex items-center justify-between transition-colors ${
                    dark 
                      ? (isSelected ? 'bg-[#FF5722]/20 text-[#FF5722]' : 'hover:bg-slate-800 hover:text-white text-slate-100')
                      : (isSelected ? 'bg-orange-50 text-orange-600 font-black' : 'hover:bg-orange-50 hover:text-orange-600 text-slate-900')
                  }`}
                  onClick={() => {
                    onChange(optVal);
                    setIsOpen(false);
                  }}
                >
                  <span>{getLabel(opt)}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#FF5722]" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

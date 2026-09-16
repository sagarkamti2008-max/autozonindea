import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ value, onChange, options, placeholder, disabled, label, labelKey, valueKey }) {
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
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <div
        className={`w-full bg-slate-50 border-2 ${isOpen ? 'border-orange-500' : 'border-slate-100'} text-slate-800 font-bold rounded-xl px-4 py-3.5 flex justify-between items-center cursor-pointer transition-colors`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-slate-800' : 'text-slate-400'}>
          {getLabel(value) || placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-slate-400 text-sm font-medium">No options available</div>
          ) : (
            options.map((opt, idx) => {
              const optVal = getValue(opt);
              const isSelected = value === optVal;
              return (
                <div
                  key={idx}
                  className={`px-4 py-3 cursor-pointer text-sm font-bold flex items-center justify-between transition-colors hover:bg-orange-50 hover:text-orange-600 ${isSelected ? 'bg-orange-50 text-orange-600' : 'text-slate-700'}`}
                  onClick={() => {
                    onChange(optVal);
                    setIsOpen(false);
                  }}
                >
                  <span>{getLabel(opt)}</span>
                  {isSelected && <Check className="w-4 h-4 text-orange-500" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

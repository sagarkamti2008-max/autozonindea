import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export default function DateRangeFilter({ selectedRange, onRangeChange, customStart, customEnd, onCustomChange }) {
  const [showCustom, setShowCustom] = useState(selectedRange === 'custom');

  const handleSelect = (e) => {
    const val = e.target.value;
    setShowCustom(val === 'custom');
    onRangeChange(val);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-sm">
      <div className="flex items-center gap-2 text-slate-300 font-medium">
        <Calendar size={16} className="text-amber-500" />
        <span>Date Filter:</span>
      </div>

      <div className="relative">
        <select
          value={selectedRange}
          onChange={handleSelect}
          className="appearance-none bg-slate-950 text-white px-4 py-2 pr-9 rounded-lg border border-slate-700 font-medium focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="this_month">This Month</option>
          <option value="last_month">Last Month</option>
          <option value="this_year">This Year</option>
          <option value="custom">Custom Range</option>
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>

      {showCustom && (
        <div className="flex items-center gap-2 animate-fadeIn">
          <input
            type="date"
            value={customStart || ''}
            onChange={(e) => onCustomChange(e.target.value, customEnd)}
            className="bg-slate-950 border border-slate-700 text-white px-3 py-1.5 rounded-lg text-xs"
          />
          <span className="text-slate-500">to</span>
          <input
            type="date"
            value={customEnd || ''}
            onChange={(e) => onCustomChange(customStart, e.target.value)}
            className="bg-slate-950 border border-slate-700 text-white px-3 py-1.5 rounded-lg text-xs"
          />
        </div>
      )}
    </div>
  );
}

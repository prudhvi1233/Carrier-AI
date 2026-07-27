import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { STATUS_MAP } from '../../mockJobTrackerData';

export default function StatusDropdown({ currentStatus, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const config = STATUS_MAP[currentStatus] || STATUS_MAP['WISHLIST'];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${config.bg} ${config.color} border ${config.border} hover:opacity-80 transition-opacity`}
      >
        {config.label}
        <ChevronDown size={12} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-secondary border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
          {Object.values(STATUS_MAP).map((status) => (
            <button
              key={status.id}
              onClick={() => {
                onChange(status.id);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <span className={`w-2 h-2 rounded-full ${status.bg} ${status.border} border`}></span>
              <span className={status.color}>{status.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

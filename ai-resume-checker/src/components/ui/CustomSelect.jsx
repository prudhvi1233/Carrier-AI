import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomSelect({ value, onChange, options, placeholder = "Select option" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Find the label to display for the current value
  const selectedOption = options.find(opt => {
    const optVal = typeof opt === 'string' ? opt : opt.value;
    return optVal === value;
  });
  
  const displayLabel = selectedOption 
    ? (typeof selectedOption === 'string' ? selectedOption : selectedOption.label) 
    : value || placeholder;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-overlay border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent-blue/50 outline-none flex items-center justify-between cursor-pointer transition-colors hover:bg-overlay-hover"
      >
        <span className={value ? "text-foreground" : "text-muted"}>
          {displayLabel}
        </span>
        <ChevronDown size={16} className={`text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-dropdown border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar py-1">
              {options.map((opt, idx) => {
                const isString = typeof opt === 'string';
                const optValue = isString ? opt : opt.value;
                const optLabel = isString ? opt : opt.label;
                
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      onChange(optValue);
                      setIsOpen(false);
                    }}
                    className={`px-4 py-2.5 cursor-pointer transition-colors text-sm ${
                      value === optValue 
                        ? 'bg-accent-blue/20 text-accent-blue font-medium' 
                        : 'text-foreground hover:bg-overlay hover:text-foreground'
                    }`}
                  >
                    {optLabel}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  return (
    <button 
      onClick={(e) => {
        e.preventDefault(); // Prevent closing dropdown if we don't want to
        setIsDark(!isDark);
      }}
      className="flex items-center justify-between w-full px-4 py-2.5 transition-colors group text-gray-300 hover:bg-white/5 hover:text-white"
    >
      <div className="flex items-center gap-3">
        {isDark ? <Moon size={18} className="group-hover:text-accent-blue transition-colors" /> : <Sun size={18} className="group-hover:text-yellow-400 transition-colors" />}
        <span className="font-medium text-sm">Theme: {isDark ? 'Dark' : 'Light'}</span>
      </div>
      
      <div className={`w-8 h-4 rounded-full flex items-center transition-colors p-0.5 ${isDark ? 'bg-accent-blue' : 'bg-gray-600'}`}>
        <div className={`w-3 h-3 rounded-full bg-white transition-transform ${isDark ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
    </button>
  );
}

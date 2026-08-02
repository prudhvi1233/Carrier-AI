import React, { useState } from 'react';
import { Moon, Sun, Monitor, Type, LayoutGrid } from 'lucide-react';

export default function AppearanceSettings({ data, onSave }) {
  const [settings, setSettings] = useState(data);

  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
    onSave('Appearance preferences saved.');
  };

  const themes = [
    { id: 'dark', label: 'Dark Mode', icon: Moon, preview: 'bg-secondary border-border' },
    { id: 'light', label: 'Light Mode', icon: Sun, preview: 'bg-white border-gray-200' },
    { id: 'system', label: 'System', icon: Monitor, preview: 'bg-gradient-to-r from-secondary to-white border-border' },
  ];

  const colors = [
    { id: 'blue', label: 'Ocean Blue', value: 'bg-blue-500' },
    { id: 'purple', label: 'Royal Purple', value: 'bg-purple-500' },
    { id: 'emerald', label: 'Emerald Green', value: 'bg-emerald-500' },
    { id: 'rose', label: 'Rose Pink', value: 'bg-rose-500' },
  ];

  const fonts = ['small', 'medium', 'large'];
  const densities = ['compact', 'comfortable'];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-foreground mb-2">Appearance</h2>
        <p className="text-muted text-sm">Customize the look and feel of your dashboard.</p>
      </div>

      {/* Theme Selection */}
      <div className="glass-card p-6 md:p-8">
        <h3 className="text-lg font-bold text-foreground mb-6">Theme Preference</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themes.map((theme) => {
            const Icon = theme.icon;
            const isActive = settings.theme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => updateSetting('theme', theme.id)}
                className={`flex flex-col items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                  isActive ? 'border-accent-blue bg-accent-blue/5' : 'border-border hover:border-white/20 hover:bg-overlay'
                }`}
              >
                <div className={`w-full h-24 rounded-xl border ${theme.preview} flex items-center justify-center relative overflow-hidden`}>
                  <Icon size={24} className={isActive ? 'text-accent-blue' : 'text-gray-500'} />
                </div>
                <span className={`font-medium ${isActive ? 'text-foreground' : 'text-muted'}`}>{theme.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent Color */}
      <div className="glass-card p-6 md:p-8">
        <h3 className="text-lg font-bold text-foreground mb-6">Accent Color</h3>
        <div className="flex flex-wrap gap-4">
          {colors.map((color) => {
            const isActive = settings.accentColor === color.id;
            return (
              <button
                key={color.id}
                onClick={() => updateSetting('accentColor', color.id)}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all ${
                  isActive ? 'border-white bg-overlay-hover' : 'border-transparent bg-overlay hover:bg-overlay-hover'
                }`}
              >
                <div className={`w-6 h-6 rounded-full ${color.value} ${isActive ? 'shadow-[0_0_15px_rgba(255,255,255,0.5)]' : ''}`} />
                <span className={isActive ? 'text-foreground font-medium' : 'text-muted'}>{color.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Font & Density */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Type size={20} className="text-muted" />
            <h3 className="text-lg font-bold text-foreground">Font Size</h3>
          </div>
          <div className="flex bg-overlay p-1 rounded-xl border border-border">
            {fonts.map((size) => (
              <button
                key={size}
                onClick={() => updateSetting('fontSize', size)}
                className={`flex-1 capitalize py-2.5 rounded-lg text-sm font-medium transition-all ${
                  settings.fontSize === size 
                    ? 'bg-overlay-hover text-foreground shadow-lg' 
                    : 'text-muted hover:text-foreground hover:bg-overlay'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <LayoutGrid size={20} className="text-muted" />
            <h3 className="text-lg font-bold text-foreground">Layout Density</h3>
          </div>
          <div className="flex bg-overlay p-1 rounded-xl border border-border">
            {densities.map((density) => (
              <button
                key={density}
                onClick={() => updateSetting('density', density)}
                className={`flex-1 capitalize py-2.5 rounded-lg text-sm font-medium transition-all ${
                  settings.density === density 
                    ? 'bg-overlay-hover text-foreground shadow-lg' 
                    : 'text-muted hover:text-foreground hover:bg-overlay'
                }`}
              >
                {density}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

import React from 'react';

export default function InputField({ label, id, type = 'text', icon: Icon, ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-sm font-medium text-muted">
        {label}
      </label>
      <div className="relative input-glow rounded-xl transition-all duration-300">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            <Icon size={18} />
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`w-full bg-overlay border border-border rounded-xl px-4 py-2.5 text-foreground placeholder-gray-500 focus:outline-none focus:bg-overlay-hover transition-colors duration-300 ${
            Icon ? 'pl-10' : ''
          }`}
          {...props}
        />
      </div>
    </div>
  );
}

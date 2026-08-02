import React from 'react';

export default function DropdownFooter() {
  return (
    <div className="p-4 bg-overlay flex items-center justify-between">
      <span className="text-xs text-gray-500 font-medium">Built with ❤️ using React + AI</span>
      <span className="text-xs text-gray-500 font-mono bg-overlay px-2 py-0.5 rounded-full border border-border">
        v1.0
      </span>
    </div>
  );
}

import React from 'react';

export default function DropdownFooter() {
  return (
    <div className="p-4 bg-white/5 flex items-center justify-between">
      <span className="text-xs text-gray-500 font-medium">Built with ❤️ using React + AI</span>
      <span className="text-xs text-gray-500 font-mono bg-black/20 px-2 py-0.5 rounded-full border border-white/5">
        v1.0
      </span>
    </div>
  );
}

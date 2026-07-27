import React from 'react';
import { Search } from 'lucide-react';

export default function JobSearch({ searchQuery, setSearchQuery }) {
  return (
    <div className="glass-card p-2 flex items-center">
      <div className="p-3 text-gray-400">
        <Search size={20} />
      </div>
      <input
        type="text"
        placeholder="Search by Job Title, Company, or Skill..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 py-2 pr-4 text-base"
      />
      <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors ml-2 hidden sm:block">
        Search
      </button>
    </div>
  );
}

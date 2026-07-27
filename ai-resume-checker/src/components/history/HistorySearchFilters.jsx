import React from 'react';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';

export default function HistorySearchFilters({ search, setSearch, sort, setSort, statusFilter, setStatusFilter }) {
  const hasActiveFilters = search || sort !== 'newest' || statusFilter !== 'all';

  const resetFilters = () => {
    setSearch('');
    setSort('newest');
    setStatusFilter('all');
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
      
      {/* Search Bar */}
      <div className="relative w-full md:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-500" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by resume name or skills..."
          className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors"
        />
      </div>

      {/* Filters and Sort */}
      <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        
        <div className="relative flex items-center min-w-max">
          <Filter size={14} className="absolute left-3 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white text-sm appearance-none focus:outline-none focus:border-accent-blue cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="relative flex items-center min-w-max">
          <SlidersHorizontal size={14} className="absolute left-3 text-gray-500" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="pl-9 pr-8 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white text-sm appearance-none focus:outline-none focus:border-accent-blue cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest_score">Highest Score</option>
            <option value="lowest_score">Lowest Score</option>
            <option value="alphabetical">Alphabetical (A-Z)</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm font-medium transition-colors min-w-max"
          >
            <X size={14} />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

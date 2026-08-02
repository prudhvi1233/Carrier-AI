import React from 'react';

export default function LoadingState() {
  return (
    <div className="flex flex-col gap-8 w-full animate-pulse">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass-card h-32 rounded-2xl bg-overlay" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Area Skeleton */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
          <div className="h-16 glass-card bg-overlay rounded-2xl" />
          <div className="h-[400px] glass-card bg-overlay rounded-2xl" />
        </div>
        
        {/* Sidebar Area Skeleton */}
        <div className="col-span-1 flex flex-col gap-6">
          <div className="h-64 glass-card bg-overlay rounded-2xl" />
          <div className="h-64 glass-card bg-overlay rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

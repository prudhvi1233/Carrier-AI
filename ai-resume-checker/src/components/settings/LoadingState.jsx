import React from 'react';

export default function LoadingState() {
  return (
    <div className="flex flex-col md:flex-row gap-8 w-full animate-pulse h-full">
      {/* Sidebar Skeleton */}
      <div className="w-full md:w-64 flex flex-col gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <div key={i} className="h-10 rounded-xl bg-white/5" />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="h-24 glass-card bg-white/5 rounded-2xl" />
        <div className="h-[400px] glass-card bg-white/5 rounded-2xl" />
      </div>
    </div>
  );
}

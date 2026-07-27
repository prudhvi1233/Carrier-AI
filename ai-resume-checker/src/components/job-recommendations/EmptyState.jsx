import React from 'react';
import { Bot } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
        <Bot size={32} className="text-gray-500" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No recommendations found</h3>
      <p className="text-gray-400 max-w-sm">
        We couldn't find any jobs matching your exact search criteria. Try adjusting your filters or expanding your search.
      </p>
    </div>
  );
}

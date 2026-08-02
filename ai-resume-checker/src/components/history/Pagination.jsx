import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) {
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <div className="text-sm text-muted">
        Displaying <span className="font-medium text-foreground">{startItem}</span> - <span className="font-medium text-foreground">{endItem}</span> of <span className="font-medium text-foreground">{totalItems}</span> resumes
      </div>

      <div className="flex items-center gap-2">
        <button 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 rounded-lg bg-overlay hover:bg-overlay-hover border border-border text-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        {getPageNumbers().map((page, idx) => (
          <button
            key={idx}
            disabled={page === '...'}
            onClick={() => page !== '...' && onPageChange(page)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? 'bg-accent-blue text-foreground shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                : page === '...'
                ? 'text-gray-500 cursor-default'
                : 'bg-overlay hover:bg-overlay-hover border border-border text-muted'
            }`}
          >
            {page}
          </button>
        ))}

        <button 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 rounded-lg bg-overlay hover:bg-overlay-hover border border-border text-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

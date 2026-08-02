import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchService } from '../services/careerServices';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length > 2) {
      setIsOpen(true);
      setLoading(true);
      try {
        const data = await searchService.search(val);
        setResults(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-md hidden md:block">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={16} className="text-muted" />
      </div>
      <input
        type="text"
        placeholder="Search applications, resumes, skills..."
        value={query}
        onChange={handleSearch}
        onFocus={() => query.length > 2 && setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="w-full pl-10 pr-4 py-2 bg-overlay border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-accent-blue focus:bg-overlay-hover transition-all"
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-secondary border border-border rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {loading ? (
              <div className="p-4 flex items-center justify-center text-muted">
                <Loader2 size={20} className="animate-spin" />
              </div>
            ) : results.length > 0 ? (
              <div className="flex flex-col">
                {results.map((res, idx) => (
                  <button key={idx} className="flex flex-col text-left px-4 py-3 hover:bg-overlay border-b border-border last:border-0 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">{res.title}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded">{res.type}</span>
                    </div>
                    <span className="text-xs text-muted mt-1">{res.detail}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted">
                No results found for "{query}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

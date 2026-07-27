import React, { useState } from 'react';
import { Search, Sparkles, Layout, CheckCircle, Download, FileEdit, Settings2, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TemplateCard from './TemplateCard';

const FEATURES = [
  { icon: CheckCircle, title: 'ATS Friendly', description: 'Optimized for parsing systems' },
  { icon: FileEdit, title: 'Fully Editable', description: 'Customize every section' },
  { icon: Layout, title: 'Professional Design', description: 'Stand out from the crowd' },
  { icon: Download, title: 'Export PDF', description: 'High-quality print ready' },
  { icon: Settings2, title: 'Multiple Templates', description: 'Switch anytime easily' },
  { icon: Sparkles, title: 'AI Optimized', description: 'Smart content suggestions' }
];

export default function TemplateGallery({ templates, selectedTemplate, onSelect, onUseTemplate, onPreview }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'ATS Friendly', 'Professional', 'Modern', 'Minimal', 'Executive', 'Creative', 'Academic', 'Compact'];

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || t.tags.includes(filter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col gap-10 w-full mt-4">
      
      {/* Search and Filters Section */}
      <div className="flex flex-col gap-6">
        
        {/* Modern Search Bar */}
        <div className="relative w-full max-w-2xl mx-auto group">
          <div className="absolute inset-0 bg-accent-blue/20 rounded-[16px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center">
            <div className="absolute left-4 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400 group-focus-within:text-accent-blue transition-colors" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-[16px] text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-blue/50 focus:bg-white/10 transition-all shadow-lg"
            />
          </div>
        </div>

        {/* Premium Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat, idx) => {
            const isActive = filter === cat;
            return (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setFilter(cat)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all overflow-hidden ${
                  isActive 
                    ? 'text-white border-transparent shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                    : 'text-gray-400 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-purple"
                    style={{ borderRadius: 9999 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </motion.button>
            );
          })}
        </div>

      </div>

      {/* Template Grid */}
      <motion.div 
        layout 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredTemplates.map((template, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              key={template.id}
            >
              <TemplateCard 
                template={template} 
                onSelect={onSelect} 
                onUseTemplate={onUseTemplate}
                onPreview={() => onPreview && onPreview(template)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredTemplates.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center bg-white/5 rounded-3xl border border-white/10"
        >
          <Search size={48} className="text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No templates found</h3>
          <p className="text-gray-400 max-w-sm">We couldn't find any templates matching your criteria. Try adjusting your search or filters.</p>
          <button 
            onClick={() => { setSearch(''); setFilter('All'); }}
            className="mt-6 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            Clear Filters
          </button>
        </motion.div>
      )}

      {/* Bottom Feature Section */}
      <div className="mt-12 pt-12 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {FEATURES.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue mb-2">
                <feature.icon size={24} />
              </div>
              <h4 className="text-white font-semibold text-sm">{feature.title}</h4>
              <p className="text-gray-400 text-xs leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}

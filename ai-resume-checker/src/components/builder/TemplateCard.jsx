import React from 'react';
import { Eye, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TemplateCard({ template, onSelect, onUseTemplate, onPreview }) {
  // A subtle map for badge colors based on tags
  const getBadgeColor = (tag) => {
    const colors = {
      'Professional': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'ATS Friendly': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      'Creative': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      'Minimal': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      'Executive': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      'Modern': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    };
    return colors[tag] || 'bg-white/5 text-gray-300 border-white/10';
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative flex flex-col bg-[#111827] rounded-[20px] border border-white/[0.08] overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-accent-blue/10 transition-all duration-300"
    >
      {/* Glow Effect behind the image on hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/0 via-transparent to-accent-purple/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />

      {/* Preview Image Container */}
      <div className="relative p-6 pb-0 flex justify-center items-start overflow-hidden">
        {/* Recommended Ribbon placeholder if needed in the future */}
        {template.recommended && (
          <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
            Recommended
          </div>
        )}
        
        <motion.div 
          className="relative w-full aspect-[1/1.414] rounded-t-xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/5 bg-white origin-bottom group-hover:border-white/20 transition-colors"
        >
          <img 
            src={template.thumbnail} 
            alt={`${template.name} preview`} 
            className="w-full h-full object-cover"
          />
          {/* Subtle overlay on the image to make it look like paper */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent pointer-events-none" />
        </motion.div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-6 relative z-10 bg-[#111827]">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white tracking-tight">{template.name}</h3>
          <button className="text-gray-500 hover:text-yellow-400 transition-colors p-1">
            <Star size={18} />
          </button>
        </div>
        
        <p className="text-sm text-gray-400 mb-4 line-clamp-2 min-h-[40px]">
          {template.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {template.tags.map((tag) => (
            <span 
              key={tag}
              className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border ${getBadgeColor(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-3">
          <button 
            onClick={() => onPreview && onPreview(template)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white text-sm font-medium hover:bg-white/5 hover:border-white/20 transition-all active:scale-95"
          >
            <Eye size={16} />
            Preview
          </button>
          
          <button 
            onClick={() => onUseTemplate ? onUseTemplate(template) : onSelect(template)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white text-sm font-semibold shadow-lg hover:shadow-accent-blue/30 transition-all active:scale-95 group/btn"
          >
            Use Template
            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

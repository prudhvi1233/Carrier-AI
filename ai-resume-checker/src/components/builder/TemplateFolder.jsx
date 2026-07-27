import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Star } from 'lucide-react';

export default function TemplateFolder({ template, isSelected, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredPaper, setHoveredPaper] = useState(null);

  // Folder colors mapping
  const colorMap = {
    blue: { back: 'bg-blue-600', front: 'bg-blue-500', glow: 'shadow-blue-500/20' },
    green: { back: 'bg-emerald-600', front: 'bg-emerald-500', glow: 'shadow-emerald-500/20' },
    purple: { back: 'bg-purple-600', front: 'bg-purple-500', glow: 'shadow-purple-500/20' },
    orange: { back: 'bg-orange-600', front: 'bg-orange-500', glow: 'shadow-orange-500/20' },
    gray: { back: 'bg-slate-700', front: 'bg-slate-600', glow: 'shadow-slate-500/20' },
  };

  const colors = colorMap[template.folderColor] || colorMap.blue;

  const handlePaperClick = (e) => {
    e.stopPropagation();
    onSelect(template);
  };

  // Mini mock lines for the paper preview
  const PaperPreviewLines = () => (
    <div className="w-full h-full p-2 flex flex-col gap-1.5 opacity-30">
      <div className="w-1/2 h-1.5 bg-black/40 rounded-full mx-auto mb-1" />
      <div className="w-3/4 h-1 bg-black/20 rounded-full mx-auto mb-2" />
      
      <div className="flex gap-2 mb-2">
        <div className="w-1/3 h-8 bg-black/10 rounded-sm" />
        <div className="flex-1 flex flex-col gap-1">
          <div className="w-full h-1 bg-black/20 rounded-full" />
          <div className="w-5/6 h-1 bg-black/10 rounded-full" />
          <div className="w-4/6 h-1 bg-black/10 rounded-full" />
        </div>
      </div>
      
      <div className="w-full h-px bg-black/10 my-1" />
      
      <div className="flex flex-col gap-1">
        <div className="w-1/3 h-1.5 bg-black/20 rounded-full mb-1" />
        <div className="w-full h-1 bg-black/10 rounded-full" />
        <div className="w-full h-1 bg-black/10 rounded-full" />
        <div className="w-4/5 h-1 bg-black/10 rounded-full" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Animated Folder Container */}
      <motion.div 
        className={`relative h-64 w-full cursor-pointer perspective-1000 ${isSelected ? 'ring-2 ring-accent-blue rounded-xl ring-offset-4 ring-offset-secondary' : ''}`}
        onHoverStart={() => setIsOpen(true)}
        onHoverEnd={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ y: -5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Selection Checkmark */}
        <AnimatePresence>
          {isSelected && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-3 -right-3 z-50 bg-accent-blue rounded-full p-1 border-2 border-secondary shadow-lg"
            >
              <CheckCircle2 size={20} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back of Folder */}
        <div className={`absolute bottom-0 w-full h-[85%] rounded-t-xl rounded-b-lg ${colors.back} shadow-2xl overflow-hidden`}>
          {/* Folder Tab */}
          <div className={`absolute -top-6 left-0 w-1/3 h-8 ${colors.back} rounded-t-xl`} style={{ clipPath: 'polygon(0 0, 80% 0, 100% 100%, 0 100%)' }} />
        </div>

        {/* Papers inside Folder */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[85%] h-[90%] flex items-end justify-center z-10 perspective-1000">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`absolute bottom-0 w-full aspect-[1/1.4] bg-white rounded-md shadow-lg overflow-hidden border border-gray-200 cursor-pointer origin-bottom`}
              animate={{
                y: isOpen ? -30 - (i * 10) : 0,
                rotateZ: isOpen ? (i - 1) * 12 : 0,
                scale: isOpen && hoveredPaper === i ? 1.05 : 1,
                zIndex: hoveredPaper === i ? 20 : i
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: i * 0.05 }}
              onClick={handlePaperClick}
              onHoverStart={() => setHoveredPaper(i)}
              onHoverEnd={() => setHoveredPaper(null)}
            >
              {/* Fake Resume Content */}
              <PaperPreviewLines />
            </motion.div>
          ))}
        </div>

        {/* Front of Folder */}
        <motion.div 
          className={`absolute bottom-0 w-full h-[85%] rounded-xl ${colors.front} shadow-[0_-10px_20px_rgba(0,0,0,0.2)] origin-bottom z-20 flex items-center justify-center`}
          animate={{
            rotateX: isOpen ? -25 : 0,
            y: isOpen ? 10 : 0
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Subtle texture/gradient on front */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
          
          <h3 className="text-white/80 font-bold text-xl tracking-wider uppercase opacity-30 select-none transform -rotate-12">
            {template.name}
          </h3>
        </motion.div>

      </motion.div>

      {/* Template Info Card */}
      <div className="glass-card p-4 flex flex-col gap-2 relative z-30 border border-white/5 bg-[#111]/80 backdrop-blur-xl hover:border-white/10 transition-colors">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-bold text-white text-base">{template.name}</h4>
          <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded text-xs font-bold text-yellow-500 shrink-0">
            <Star size={12} className="fill-yellow-500" />
            {template.atsRating}
          </div>
        </div>
        
        <p className="text-xs text-gray-400 line-clamp-2">{template.description}</p>
        
        <div className="flex flex-wrap gap-1.5 mt-2">
          {template.tags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-white/5 text-gray-300 rounded">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="mt-2 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
          <span className="text-gray-500 font-medium">Difficulty: <span className="text-white">{template.difficulty}</span></span>
        </div>
      </div>

    </div>
  );
}

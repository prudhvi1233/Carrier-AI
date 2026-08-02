import React from 'react';
import { Route as RouteIcon, Map } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RoadmapTimeline({ suggestions = [] }) {
  // Group suggestions by priority
  const highPriority = suggestions.filter(s => s.priority.toLowerCase() === 'high');
  const mediumPriority = suggestions.filter(s => s.priority.toLowerCase() === 'medium');
  const lowPriority = suggestions.filter(s => s.priority.toLowerCase() === 'low');

  const groups = [
    { title: 'Immediate Actions', priority: 'High', color: 'bg-red-500', items: highPriority },
    { title: 'Next Steps', priority: 'Medium', color: 'bg-yellow-500', items: mediumPriority },
    { title: 'Long-term Goals', priority: 'Low', color: 'bg-blue-500', items: lowPriority },
  ].filter(group => group.items.length > 0);

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-accent-purple/10 rounded-xl border border-accent-purple/20">
          <Map size={20} className="text-accent-purple" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Improvement Roadmap</h3>
      </div>
      
      <div className="flex-1 relative">
        {/* Vertical Line */}
        <div className="absolute left-3.5 top-2 bottom-6 w-0.5 bg-overlay-hover" />

        <div className="flex flex-col gap-8 relative z-10">
          {groups.map((group, groupIdx) => (
            <div key={groupIdx} className="relative flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <div className={`w-7 h-7 rounded-full ${group.color} flex items-center justify-center border-4 border-[#0a0a0a] shadow-lg relative z-10`}>
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">{group.title}</h4>
              </div>
              
              <ul className="ml-11 flex flex-col gap-2">
                {group.items.map((item, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (groupIdx * 0.2) + (idx * 0.1) }}
                    className="text-sm text-muted bg-overlay px-4 py-2.5 rounded-lg border border-border"
                  >
                    {item.description}
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

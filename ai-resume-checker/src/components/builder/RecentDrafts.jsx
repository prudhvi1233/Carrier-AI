import React from 'react';
import { FileText, Clock, MoreVertical, Edit2, Copy, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecentDrafts({ drafts, onEdit }) {
  if (!drafts || drafts.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-lg font-bold text-foreground mb-2">Recent Drafts</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drafts.map((draft, idx) => {
          const date = new Date(draft.lastModified).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric'
          });

          return (
            <motion.div 
              key={draft.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-4 flex flex-col gap-4 border border-border hover:border-border hover:bg-overlay transition-all group cursor-pointer"
              onClick={() => onEdit(draft)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center shrink-0 border border-accent-blue/20">
                    <FileText size={20} className="text-accent-blue" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-base group-hover:text-accent-blue transition-colors line-clamp-1">{draft.name}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                      <Clock size={12} />
                      Last edited {date}
                    </div>
                  </div>
                </div>
                
                {/* Actions Dropdown (mocked visually for now) */}
                <button 
                  className="p-1.5 text-gray-500 hover:text-foreground rounded-md hover:bg-overlay-hover transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* Progress bar */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted font-medium">Completion</span>
                  <span className="text-foreground font-bold">{draft.completion}%</span>
                </div>
                <div className="h-1.5 w-full bg-overlay rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accent-blue to-accent-purple rounded-full" 
                    style={{ width: `${draft.completion}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-1">
                <button className="flex-1 py-2 text-xs font-medium text-foreground bg-overlay hover:bg-overlay-hover rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-border">
                  <Edit2 size={12} /> Continue
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

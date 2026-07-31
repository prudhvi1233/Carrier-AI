import React from 'react';
import { History, Eye, RotateCcw, Trash2 } from 'lucide-react';

export default function InterviewHistory({ history, onDelete }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-2">
        <History className="text-accent-purple" size={18} />
        <h3 className="font-bold text-white">Previous Interviews</h3>
      </div>
      
      <div className="divide-y divide-white/5">
        {history.map(item => (
          <div key={item.id} className="p-4 hover:bg-white/[0.02] transition-colors group">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-gray-200 text-sm">{item.job_role}</h4>
                <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()} • {item.interview_type}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-accent-blue/10 flex items-center justify-center border border-accent-blue/20">
                <span className="text-xs font-bold text-accent-blue">{item.score || '-'}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-white/5 hover:bg-white/10 rounded text-xs font-medium text-gray-300 transition-colors">
                <Eye size={14} /> Report
              </button>
              <button className="flex items-center justify-center p-1.5 bg-white/5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
                <RotateCcw size={14} />
              </button>
              <button 
                onClick={() => onDelete(item.id)}
                className="flex items-center justify-center p-1.5 bg-white/5 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400 transition-colors"
                title="Delete History"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

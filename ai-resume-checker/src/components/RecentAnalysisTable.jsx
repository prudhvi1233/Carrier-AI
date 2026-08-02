import React from 'react';
import { motion } from 'framer-motion';
import { FileText, MoreHorizontal } from 'lucide-react';

export default function RecentAnalysisTable({ analyses }) {
  const displayData = analyses || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="glass-card overflow-hidden"
    >
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Recent Analysis</h3>
        <button className="text-sm font-medium text-accent-blue hover:text-accent-purple transition-colors">
          View All
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-overlay border-b border-border">
              <th className="py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider">Resume ID</th>
              <th className="py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider">AI Score</th>
              <th className="py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider">ATS Score</th>
              <th className="py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider">Upload Date</th>
              <th className="py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {displayData.map((item) => {
              const date = item.uploaded_at ? new Date(item.uploaded_at).toLocaleDateString() : 'N/A';
              const score = item.overall_score;
              const ats = item.ats_score;
              const status = item.status || 'Pending';

              return (
                <tr key={item.id} className="hover:bg-overlay transition-colors group">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-overlay flex items-center justify-center border border-border">
                        <FileText size={16} className="text-muted group-hover:text-accent-blue transition-colors" />
                      </div>
                      <span className="text-sm font-medium text-gray-200" title={item.filename}>
                        {item.filename?.length > 20 ? item.filename.substring(0, 20) + '...' : item.filename || `Resume #${item.id.substring(0,6)}`}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{score !== null ? `${Math.round(score)}%` : 'N/A'}</span>
                      <div className="w-16 h-1.5 bg-overlay-hover rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent-blue rounded-full"
                          style={{ width: `${score !== null ? Math.round(score) : 0}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{ats !== null ? `${Math.round(ats)}%` : 'N/A'}</span>
                      <div className="w-16 h-1.5 bg-overlay-hover rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent-purple rounded-full"
                          style={{ width: `${ats !== null ? Math.round(ats) : 0}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-muted">
                    {date}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      status === 'Parsed Successfully' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : status === 'Pending'
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {status}
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-right">
                    <button className="text-muted hover:text-foreground p-1 rounded-lg hover:bg-overlay-hover transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              )
            })}
            
            {displayData.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  No resumes analyzed yet. Upload one to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

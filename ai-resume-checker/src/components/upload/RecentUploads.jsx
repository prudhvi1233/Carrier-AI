import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronRight } from 'lucide-react';
import EmptyState from './EmptyState';

export default function RecentUploads() {
  // Using dummy data as requested for now
  const dummyData = [
    { id: 1, name: 'Frontend_Dev_Resume.pdf', score: 92, status: 'Analyzed', date: 'Oct 24, 2023' },
    { id: 2, name: 'Software_Engineer_v2.pdf', score: 78, status: 'Analyzed', date: 'Oct 20, 2023' },
  ];

  if (dummyData.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Recent Uploads</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Resume Name</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Upload Date</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Score</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {dummyData.map((item, idx) => (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                key={item.id} 
                className="hover:bg-white/5 transition-colors group cursor-pointer"
              >
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                      <FileText size={16} className="text-accent-blue" />
                    </div>
                    <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{item.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-400">
                  {item.date}
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-green-500/10 text-green-400 border-green-500/20">
                    {item.status}
                  </span>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <span className="text-sm font-bold text-white">{item.score}/100</span>
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-right">
                  <button className="text-sm font-medium text-accent-blue hover:text-accent-purple transition-colors flex items-center justify-end gap-1 w-full">
                    View <ChevronRight size={16} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

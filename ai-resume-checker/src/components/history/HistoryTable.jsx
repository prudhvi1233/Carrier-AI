import React from 'react';
import { FileText, Calendar, HardDrive } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ActionMenu from './ActionMenu';
import { motion } from 'framer-motion';

export default function HistoryTable({ resumes, onAction }) {
  return (
    <div className="hidden sm:block overflow-x-auto w-full">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="py-4 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Resume Name</th>
            <th className="py-4 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Upload Date</th>
            <th className="py-4 px-4 text-xs font-semibold text-muted uppercase tracking-wider text-center">Score</th>
            <th className="py-4 px-4 text-xs font-semibold text-muted uppercase tracking-wider text-center">ATS</th>
            <th className="py-4 px-4 text-xs font-semibold text-muted uppercase tracking-wider text-center">Status</th>
            <th className="py-4 px-4 text-xs font-semibold text-muted uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {resumes.map((resume, idx) => {
            const uploadDate = new Date(resume.uploaded_at).toLocaleDateString(undefined, { 
              month: 'short', day: 'numeric', year: 'numeric' 
            });

            return (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={resume.id} 
                className="hover:bg-overlay transition-colors group"
              >
                <td className="py-4 px-4 whitespace-nowrap min-w-[250px]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-overlay flex items-center justify-center border border-border group-hover:bg-accent-blue/10 group-hover:border-accent-blue/20 transition-colors">
                      <FileText size={18} className="text-muted group-hover:text-accent-blue transition-colors" />
                    </div>
                    <div className="flex flex-col max-w-[200px] xl:max-w-[300px]">
                      <span className="text-sm font-semibold text-foreground truncate" title={resume.name}>{resume.name}</span>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                        <HardDrive size={12} />
                        {resume.file_size}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-sm text-muted">
                    <Calendar size={14} className="text-gray-500" />
                    {uploadDate}
                  </div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-center">
                  <span className="text-base font-bold text-foreground">{resume.resume_score}</span>
                  <span className="text-xs text-gray-500 ml-0.5">/100</span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-center">
                  <span className="text-base font-bold text-foreground">{resume.ats_score}%</span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-center">
                  <StatusBadge status={resume.status} />
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end">
                    <ActionMenu 
                      resume={resume}
                      onView={() => onAction('view', resume.id)}
                      onDownload={() => onAction('download', resume.id)}
                      onReanalyze={() => onAction('reanalyze', resume.id)}
                      onDelete={() => onAction('delete', resume)}
                    />
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

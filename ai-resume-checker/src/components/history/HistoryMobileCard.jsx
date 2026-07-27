import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, HardDrive } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ActionMenu from './ActionMenu';

export default function HistoryMobileCard({ resume, onAction }) {
  const uploadDate = new Date(resume.uploaded_at).toLocaleDateString(undefined, { 
    month: 'short', day: 'numeric', year: 'numeric' 
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 flex flex-col gap-4 sm:hidden border border-white/5 hover:border-white/10 transition-colors"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-start gap-3 flex-1 overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center shrink-0 border border-white/10">
            <FileText size={20} className="text-accent-blue" />
          </div>
          <div className="flex flex-col min-w-0">
            <h4 className="font-semibold text-white truncate w-full" title={resume.name}>
              {resume.name}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
              <Calendar size={12} />
              {uploadDate}
            </div>
          </div>
        </div>
        <ActionMenu 
          resume={resume}
          onView={() => onAction('view', resume.id)}
          onDownload={() => onAction('download', resume.id)}
          onReanalyze={() => onAction('reanalyze', resume.id)}
          onDelete={() => onAction('delete', resume)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/5">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Resume Score</span>
          <span className="text-lg font-bold text-white">{resume.resume_score}<span className="text-sm text-gray-400 font-medium">/100</span></span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">ATS Score</span>
          <span className="text-lg font-bold text-white">{resume.ats_score}%</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <StatusBadge status={resume.status} />
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <HardDrive size={12} />
          {resume.file_size}
        </div>
      </div>
    </motion.div>
  );
}

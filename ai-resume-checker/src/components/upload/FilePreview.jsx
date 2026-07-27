import React from 'react';
import { motion } from 'framer-motion';
import { FileText, X, RefreshCw } from 'lucide-react';

export default function FilePreview({ file, onRemove, onReplace }) {
  // Format file size
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center shrink-0 border border-white/10">
        <FileText size={32} className="text-accent-blue" />
      </div>

      <div className="flex-1 text-center md:text-left overflow-hidden">
        <h3 className="text-lg font-semibold text-white truncate w-full" title={file.name}>
          {file.name}
        </h3>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-1 text-sm text-gray-400">
          <span>{formatSize(file.size)}</span>
          <span className="w-1 h-1 rounded-full bg-gray-500"></span>
          <span>PDF Document</span>
          <span className="w-1 h-1 rounded-full bg-gray-500"></span>
          <span>Uploaded at {uploadTime}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <button 
          onClick={onReplace}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors text-sm font-medium border border-white/10"
        >
          <RefreshCw size={16} />
          Replace
        </button>
        <button 
          onClick={onRemove}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors text-sm font-medium border border-red-500/20"
        >
          <X size={16} />
          Remove
        </button>
      </div>
    </motion.div>
  );
}

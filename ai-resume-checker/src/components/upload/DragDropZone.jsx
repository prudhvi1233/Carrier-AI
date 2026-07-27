import React, { useRef, useState } from 'react';
import { Upload, File } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DragDropZone({ onFileSelect }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative w-full rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer group
        ${isDragging ? 'border-accent-blue bg-accent-blue/10' : 'border-white/10 hover:border-accent-purple/50 hover:bg-white/5'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        accept="application/pdf"
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)]
        ${isDragging ? 'bg-accent-blue/30 scale-110' : 'bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 group-hover:scale-110'}`}>
        <Upload size={36} className="text-white" />
      </div>
      
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-1">
          Drag & Drop your resume here
        </h3>
        <p className="text-gray-400 text-sm">
          or <span className="text-accent-blue group-hover:text-accent-purple transition-colors">browse files</span> from your computer
        </p>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <span className="flex items-center gap-1 text-xs text-gray-400 font-medium bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
          <File size={14} className="text-accent-blue"/> PDF (Max 10 MB)
        </span>
      </div>
    </motion.div>
  );
}

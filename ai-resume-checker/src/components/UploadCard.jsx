import React, { useState, useRef } from 'react';
import { Upload, File } from 'lucide-react';
import { motion } from 'framer-motion';
import { resumeService } from '../services/resumeService';
import { analysisService } from '../services/analysisService';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';

export default function UploadCard({ onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { triggerRefresh } = useGlobalState();

  const uploadSteps = [
    '',
    'Uploading Resume...',
    'Parsing Resume...',
    'Extracting Skills...',
    'Detecting Experience...',
    'Saving Parsed Data...',
    'Completed Successfully'
  ];

  const handleFile = async (file) => {
    if (!file) return;
    
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isDOCX = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.toLowerCase().endsWith('.docx') || file.type === 'application/msword';
    
    if (!isPDF && !isDOCX) {
      alert('Only PDF and DOCX files are supported.');
      return;
    }
    
    setUploadStep(1); // Uploading
    
    try {
      // 1. Upload
      const uploadedResume = await resumeService.uploadResume(file);
      const resumeId = uploadedResume.id;
      
      setUploadStep(2); // Parsing
      
      // 2. Parse
      // We will simulate the UI steps for the user while we wait for backend
      const interval = setInterval(() => {
        setUploadStep(prev => {
          if (prev >= 5) return 5;
          return prev + 1;
        });
      }, 800);
      
      await resumeService.parseResume(resumeId);
      
      // 3. Analyze
      await analysisService.analyzeResume(resumeId);
      
      clearInterval(interval);
      setUploadStep(6); // Success
      
      triggerRefresh();
      if (onUploadComplete) onUploadComplete();
      
      // 4. Navigate to Analysis Page
      setTimeout(() => {
        setUploadStep(0);
        navigate(`/analysis/${resumeId}`);
      }, 1500);
      
    } catch (error) {
      setUploadStep(0);
      alert('Failed to upload and analyze resume');
      console.error(error);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="glass-card p-8 text-center relative overflow-hidden group"
    >
      <div 
        className={`absolute inset-0 border-2 border-dashed rounded-2xl transition-all duration-300 pointer-events-none
          ${isDragging ? 'border-accent-blue bg-accent-blue/5' : 'border-white/10 group-hover:border-accent-purple/50'}`}
      />
      
      <div 
        className="relative z-10 py-8 flex flex-col items-center justify-center gap-4"
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          <Upload size={28} className="text-white" />
        </div>
        
        <h3 className="text-xl font-semibold text-white">Upload Your Resume</h3>
        <p className="text-gray-400 text-sm max-w-sm">
          Drag and drop your resume file here or click to browse.
        </p>

        <div className="flex items-center gap-4 mt-2">
          <span className="flex items-center gap-1 text-xs text-gray-500 font-medium bg-white/5 px-2 py-1 rounded"><File size={12}/> PDF / DOCX</span>
        </div>

        <input 
          type="file" 
          accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />

        <button 
          disabled={uploadStep > 0}
          onClick={() => fileInputRef.current?.click()}
          className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold shadow-lg shadow-accent-blue/20 hover:shadow-accent-purple/40 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploadStep > 0 ? uploadSteps[uploadStep] : 'Browse Files'}
        </button>
      </div>
    </motion.div>
  );
}

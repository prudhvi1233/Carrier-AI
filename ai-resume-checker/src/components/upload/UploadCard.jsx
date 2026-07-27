import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload as UploadIcon, CheckCircle2 } from 'lucide-react';
import DragDropZone from './DragDropZone';
import FilePreview from './FilePreview';
import UploadProgress from './UploadProgress';
import { useNavigate } from 'react-router-dom';
import { resumeService } from '../../services/resumeService';
import { analysisService } from '../../services/analysisService';
import { useGlobalState } from '../../context/GlobalStateContext';

export default function UploadCard() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | selected | uploading | success
  const [resumeId, setResumeId] = useState(null);
  const [isBackendDone, setIsBackendDone] = useState(false);
  const navigate = useNavigate();
  const { triggerRefresh } = useGlobalState();

  const handleFileSelect = (selectedFile) => {
    const isPDF = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');
    const isDOCX = selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || selectedFile.name.toLowerCase().endsWith('.docx') || selectedFile.type === 'application/msword';
    
    if (!isPDF && !isDOCX) {
      alert('Only PDF and DOCX files are supported.');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.');
      return;
    }
    setFile(selectedFile);
    setStatus('selected');
  };

  const handleRemove = () => {
    setFile(null);
    setStatus('idle');
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setStatus('uploading');
    setIsBackendDone(false);
    
    try {
      // 1. Upload
      const uploadedResume = await resumeService.uploadResume(file);
      setResumeId(uploadedResume.id);
      
      // 2. Parse (Simulated by UploadProgress internally, but we trigger real backend call here)
      await resumeService.parseResume(uploadedResume.id);
      
      // 3. Analyze
      await analysisService.analyzeResume(uploadedResume.id);
      
      triggerRefresh();
      setIsBackendDone(true);
      
      // UploadProgress component transition will call handleAnalysisComplete
    } catch (error) {
      setStatus('idle');
      alert('Failed to upload and analyze resume');
      console.error(error);
    }
  };

  const handleAnalysisComplete = () => {
    if (!resumeId) return;
    setStatus('success');
    
    setTimeout(() => {
      navigate(`/analysis/${resumeId}`);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 md:p-10 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden"
    >
      <AnimatePresence mode="wait">
        
        {/* STATUS: IDLE */}
        {status === 'idle' && (
          <motion.div 
            key="idle"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full flex justify-center"
          >
            <DragDropZone onFileSelect={handleFileSelect} />
          </motion.div>
        )}

        {/* STATUS: SELECTED */}
        {status === 'selected' && (
          <motion.div 
            key="selected"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full flex flex-col gap-8"
          >
            <FilePreview 
              file={file} 
              onRemove={handleRemove} 
              onReplace={() => document.querySelector('input[type="file"]')?.click()} 
            />
            
            <div className="flex justify-end">
              <button
                onClick={handleAnalyze}
                className="group relative px-8 py-4 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl text-white font-semibold text-lg overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(59,130,246,0.3)] w-full md:w-auto flex items-center justify-center gap-3"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <UploadIcon size={20} className="relative z-10 group-hover:-translate-y-1 transition-transform" />
                <span className="relative z-10">Analyze Resume</span>
              </button>
            </div>
            
            {/* Hidden input for replace functionality */}
            <input 
              type="file" 
              accept="application/pdf"
              className="hidden" 
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />
          </motion.div>
        )}

        {/* STATUS: UPLOADING */}
        {status === 'uploading' && (
          <motion.div 
            key="uploading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <UploadProgress onComplete={handleAnalysisComplete} isBackendDone={isBackendDone} />
          </motion.div>
        )}

        {/* STATUS: SUCCESS */}
        {status === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex flex-col items-center justify-center py-12 gap-4"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <CheckCircle2 size={40} className="text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Analysis Complete!</h2>
            <p className="text-gray-400 text-center">Redirecting to your dashboard...</p>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Star, Zap } from 'lucide-react';

import LivePreview from './LivePreview';

const MOCK_DATA = {
  personal: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567'
  },
  summary: 'Experienced software engineer with a passion for developing innovative programs that expedite the efficiency and effectiveness of organizational success. Well-versed in technology and writing code to create systems that are reliable and user-friendly.',
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
  hasExperience: true,
  experience: [
    {
      id: '1',
      role: 'Senior Developer',
      company: 'Tech Corp',
      startDate: '2020',
      current: true,
      description: 'Led development of the core product, improving performance by 40%.'
    },
    {
      id: '2',
      role: 'Software Engineer',
      company: 'Innovate LLC',
      startDate: '2017',
      endDate: '2020',
      description: 'Developed and maintained various web applications using React and Node.js.'
    }
  ],
  projects: [
    {
      id: '1',
      title: 'E-commerce Platform',
      technologies: 'React, Node.js, MongoDB',
      description: 'Built a full-stack e-commerce platform handling over 10k daily active users.'
    }
  ],
  education: {
    degree: {
      degree: 'B.S.',
      field: 'Computer Science',
      school: 'University of Technology',
      startDate: '2013',
      endDate: '2017',
      cgpa: '3.8'
    }
  },
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Solutions Architect',
      organization: 'Amazon Web Services',
      date: '2021'
    }
  ]
};

export default function TemplatePreview({ template, onClose, onUse }) {
  if (!template) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        
        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl h-full max-h-[90vh] bg-secondary border border-border rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-foreground flex items-center justify-center backdrop-blur-md border border-border transition-colors"
          >
            <X size={20} />
          </button>

          {/* Left Panel: Preview Area */}
          <div className="flex-1 bg-black/40 flex items-center justify-center relative overflow-hidden">
            {/* Ambient glow behind preview */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-accent-blue/10 blur-[100px] rounded-full pointer-events-none" />
            
            {/* Live Preview Container */}
            <div className="relative z-10 w-full h-full flex items-center justify-center" style={{ transform: 'scale(0.8)' }}>
              <LivePreview template={template.id} formData={MOCK_DATA} />
            </div>
          </div>

          {/* Right Panel: Template Info */}
          <div className="w-full md:w-[400px] bg-secondary flex flex-col p-8 overflow-y-auto hide-scrollbar border-l border-border">
            <div className="flex flex-wrap gap-2 mb-4">
              {template.tags.map((tag, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-full bg-overlay border border-border text-xs font-semibold text-muted uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-4">{template.name}</h2>
            
            <p className="text-muted leading-relaxed mb-8">
              {template.description}
            </p>

            <div className="flex flex-col gap-4 mb-8">
              <div className="glass-card p-4 flex items-center justify-between border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <Star size={18} className="text-yellow-500 fill-yellow-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted">ATS Rating</span>
                    <span className="text-lg font-bold text-foreground">{template.atsRating} <span className="text-sm text-gray-500">/ 5.0</span></span>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-4 flex items-center justify-between border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Zap size={18} className="text-blue-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted">Difficulty</span>
                    <span className="text-lg font-bold text-foreground">{template.difficulty} Setup</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-auto">
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">Recommended For</h4>
              <p className="text-muted text-sm bg-overlay p-3 rounded-lg border border-border">
                {template.recommendedFor}
              </p>
            </div>

            <div className="pt-8 mt-8 border-t border-border flex gap-4">
              <button 
                onClick={onClose}
                className="flex-1 py-4 rounded-xl bg-overlay hover:bg-overlay-hover text-foreground font-bold border border-border transition-colors"
              >
                Back to Gallery
              </button>
              <button 
                onClick={() => onUse(template)}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-foreground font-bold shadow-lg shadow-accent-blue/20 hover:shadow-accent-blue/40 transition-all hover:-translate-y-0.5"
              >
                <CheckCircle2 size={18} />
                Use Template
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

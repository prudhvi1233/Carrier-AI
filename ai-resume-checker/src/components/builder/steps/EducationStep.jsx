import React from 'react';
import { motion } from 'framer-motion';

export default function EducationStep({ data, onUpdate }) {
  // data should be an object with degree, twelfth, and tenth
  const edData = data || {
    degree: { school: '', degree: '', field: '', cgpa: '', startDate: '', endDate: '' },
    twelfth: { school: '', board: '', percentage: '', year: '' },
    tenth: { school: '', board: '', percentage: '', year: '' }
  };

  const handleChange = (level, field, value) => {
    onUpdate({
      ...edData,
      [level]: {
        ...edData[level],
        [field]: value
      }
    });
  };

  const validateCGPA = (value) => {
    const num = parseFloat(value);
    if (value !== '' && (isNaN(num) || num < 0 || num > 10)) {
      return "CGPA must be between 0 and 10";
    }
    return null;
  };

  const validatePercentage = (value) => {
    const num = parseFloat(value);
    if (value !== '' && (isNaN(num) || num < 0 || num > 100)) {
      return "Percentage must be between 0 and 100";
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-foreground mb-2">Education</h2>
        <p className="text-muted">Please provide your educational background.</p>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* Degree */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 border-border"
        >
          <h3 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">Degree / Graduation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted">Degree Name</label>
              <input 
                type="text" value={edData.degree?.degree || ''} onChange={(e) => handleChange('degree', 'degree', e.target.value)}
                placeholder="e.g. B.Tech"
                className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted">Specialization</label>
              <input 
                type="text" value={edData.degree?.field || ''} onChange={(e) => handleChange('degree', 'field', e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-medium text-muted">University / College</label>
              <input 
                type="text" value={edData.degree?.school || ''} onChange={(e) => handleChange('degree', 'school', e.target.value)}
                placeholder="e.g. Stanford University"
                className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted">Start Year</label>
              <input 
                type="number" min="1990" max="2099" value={edData.degree?.startDate || ''} onChange={(e) => handleChange('degree', 'startDate', e.target.value)}
                placeholder="YYYY"
                className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted">End Year (or Expected)</label>
              <input 
                type="number" min="1990" max="2099" value={edData.degree?.endDate || ''} onChange={(e) => handleChange('degree', 'endDate', e.target.value)}
                placeholder="YYYY"
                className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <div className="flex justify-between">
                 <label className="text-xs font-medium text-muted">CGPA</label>
                 {validateCGPA(edData.degree?.cgpa) && <span className="text-[10px] text-red-400">{validateCGPA(edData.degree?.cgpa)}</span>}
              </div>
              <input 
                type="number" step="0.01" value={edData.degree?.cgpa || ''} onChange={(e) => handleChange('degree', 'cgpa', e.target.value)}
                placeholder="e.g. 8.5"
                className={`w-full bg-overlay border rounded-lg px-3 py-2 text-foreground focus:outline-none ${validateCGPA(edData.degree?.cgpa) ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-accent-blue'}`}
              />
            </div>
          </div>
        </motion.div>

        {/* 12th */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-6 border-border"
        >
          <h3 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">Intermediate (12th)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-medium text-muted">College / Institution</label>
              <input 
                type="text" value={edData.twelfth?.school || ''} onChange={(e) => handleChange('twelfth', 'school', e.target.value)}
                placeholder="e.g. Delhi Public School"
                className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted">Board</label>
              <input 
                type="text" value={edData.twelfth?.board || ''} onChange={(e) => handleChange('twelfth', 'board', e.target.value)}
                placeholder="e.g. CBSE"
                className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted">Passing Year</label>
              <input 
                type="number" min="1990" max="2099" value={edData.twelfth?.year || ''} onChange={(e) => handleChange('twelfth', 'year', e.target.value)}
                placeholder="YYYY"
                className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <div className="flex justify-between">
                 <label className="text-xs font-medium text-muted">Percentage</label>
                 {validatePercentage(edData.twelfth?.percentage) && <span className="text-[10px] text-red-400">{validatePercentage(edData.twelfth?.percentage)}</span>}
              </div>
              <input 
                type="number" step="0.1" value={edData.twelfth?.percentage || ''} onChange={(e) => handleChange('twelfth', 'percentage', e.target.value)}
                placeholder="e.g. 92.5"
                className={`w-full bg-overlay border rounded-lg px-3 py-2 text-foreground focus:outline-none ${validatePercentage(edData.twelfth?.percentage) ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-accent-blue'}`}
              />
            </div>
          </div>
        </motion.div>

        {/* 10th */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-6 border-border"
        >
          <h3 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">Matriculation (10th)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-medium text-muted">School Name</label>
              <input 
                type="text" value={edData.tenth?.school || ''} onChange={(e) => handleChange('tenth', 'school', e.target.value)}
                placeholder="e.g. St. Xavier's High School"
                className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted">Board</label>
              <input 
                type="text" value={edData.tenth?.board || ''} onChange={(e) => handleChange('tenth', 'board', e.target.value)}
                placeholder="e.g. ICSE"
                className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted">Passing Year</label>
              <input 
                type="number" min="1990" max="2099" value={edData.tenth?.year || ''} onChange={(e) => handleChange('tenth', 'year', e.target.value)}
                placeholder="YYYY"
                className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <div className="flex justify-between">
                 <label className="text-xs font-medium text-muted">Percentage</label>
                 {validatePercentage(edData.tenth?.percentage) && <span className="text-[10px] text-red-400">{validatePercentage(edData.tenth?.percentage)}</span>}
              </div>
              <input 
                type="number" step="0.1" value={edData.tenth?.percentage || ''} onChange={(e) => handleChange('tenth', 'percentage', e.target.value)}
                placeholder="e.g. 95.0"
                className={`w-full bg-overlay border rounded-lg px-3 py-2 text-foreground focus:outline-none ${validatePercentage(edData.tenth?.percentage) ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-accent-blue'}`}
              />
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

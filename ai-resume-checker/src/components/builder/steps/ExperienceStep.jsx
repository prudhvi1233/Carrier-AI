import React from 'react';
import { Plus, Trash2, GripVertical, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExperienceStep({ data, onUpdate, hasExperience, onToggleExperience }) {
  
  const addExperience = () => {
    onUpdate([...(data || []), { id: Date.now().toString(), company: '', role: '', location: '', startDate: '', endDate: '', current: false, description: '' }]);
  };

  const removeExperience = (id) => {
    onUpdate((data || []).filter(ex => ex.id !== id));
  };

  const handleChange = (id, field, value) => {
    onUpdate((data || []).map(ex => ex.id === id ? { ...ex, [field]: value } : ex));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">Work Experience</h2>
        <p className="text-muted">List your professional experience. Use our AI to write strong, metric-driven bullet points.</p>
      </div>

      <div className="flex gap-4 p-4 rounded-xl border border-border bg-overlay mb-4">
        <div className="flex-1">
          <h3 className="text-foreground font-medium">Do you have work experience?</h3>
          <p className="text-xs text-muted">Select No if you are a fresher or student.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onToggleExperience(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${hasExperience ? 'bg-accent-blue text-foreground' : 'bg-overlay text-muted border border-border'}`}
          >
            Yes
          </button>
          <button 
            onClick={() => onToggleExperience(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!hasExperience ? 'bg-red-500/20 border border-red-500/50 text-red-400' : 'bg-overlay text-muted border border-border'}`}
          >
            No
          </button>
        </div>
      </div>

      {hasExperience ? (
        <>
          <div className="flex flex-col gap-8">
            <AnimatePresence initial={false}>
              {(data || []).map((ex, idx) => (
            <motion.div 
              key={ex.id}
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-6 border-border relative group"
            >
              <div className="absolute left-2 top-6 opacity-0 group-hover:opacity-100 cursor-grab text-gray-500 transition-opacity">
                <GripVertical size={20} />
              </div>
              
              <button 
                onClick={() => removeExperience(ex.id)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors bg-overlay p-2 rounded-lg"
              >
                <Trash2 size={16} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 md:pl-6 pr-8">
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-muted">Job Title</label>
                  <input 
                    type="text" value={ex.role} onChange={(e) => handleChange(ex.id, 'role', e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-muted">Company</label>
                  <input 
                    type="text" value={ex.company} onChange={(e) => handleChange(ex.id, 'company', e.target.value)}
                    placeholder="e.g. Google"
                    className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs font-medium text-muted">Location</label>
                  <input 
                    type="text" value={ex.location} onChange={(e) => handleChange(ex.id, 'location', e.target.value)}
                    placeholder="e.g. Mountain View, CA (Remote)"
                    className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-muted">Start Date</label>
                  <input 
                    type="month" value={ex.startDate} onChange={(e) => handleChange(ex.id, 'startDate', e.target.value)}
                    className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue [color-scheme:dark]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center h-4">
                    <label className="text-xs font-medium text-muted">End Date</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" checked={ex.current} onChange={(e) => handleChange(ex.id, 'current', e.target.checked)}
                        className="rounded border-border bg-overlay text-accent-blue focus:ring-accent-blue"
                      />
                      <span className="text-xs text-muted">I currently work here</span>
                    </label>
                  </div>
                  <input 
                    type="month" value={ex.endDate} onChange={(e) => handleChange(ex.id, 'endDate', e.target.value)}
                    disabled={ex.current}
                    className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue [color-scheme:dark] disabled:opacity-50"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2 mt-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-muted">Description (Bullet points)</label>
                    <button className="text-xs flex items-center gap-1 text-accent-purple hover:text-foreground transition-colors bg-accent-purple/10 px-2 py-1 rounded">
                      <Sparkles size={12} /> AI Rewrite
                    </button>
                  </div>
                  <textarea 
                    value={ex.description} onChange={(e) => handleChange(ex.id, 'description', e.target.value)}
                    placeholder="• Developed new features for the main application..."
                    rows={5}
                    className="w-full bg-overlay border border-border rounded-lg px-3 py-3 text-foreground focus:outline-none focus:border-accent-blue resize-none"
                  />
                </div>

              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {(!data || data.length === 0) && (
        <div className="p-8 border-2 border-dashed border-border rounded-2xl flex flex-col items-center text-center">
          <p className="text-muted mb-4">No experience entries added yet.</p>
        </div>
      )}

      <button 
        onClick={addExperience}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-dashed border-accent-blue/50 text-accent-blue hover:bg-accent-blue/10 transition-colors font-medium"
      >
        <Plus size={18} /> Add Experience
      </button>
      </>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="p-8 bg-overlay border border-border rounded-xl text-center"
        >
          <p className="text-muted text-sm">Experience section will be excluded from your resume.</p>
        </motion.div>
      )}
    </div>
  );
}

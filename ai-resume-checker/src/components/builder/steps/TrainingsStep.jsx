import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrainingsStep({ data, onUpdate }) {
  const addTraining = () => {
    onUpdate([...(data || []), { 
      id: Date.now().toString(), 
      name: '', 
      organization: '', 
      date: '', 
      certificateId: '', 
      description: '' 
    }]);
  };

  const removeTraining = (id) => {
    onUpdate(data.filter(t => t.id !== id));
  };

  const handleChange = (id, field, value) => {
    onUpdate(data.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-foreground mb-2">Trainings & Certifications</h2>
        <p className="text-muted">List any relevant certifications, courses, or training programs.</p>
      </div>

      <div className="flex flex-col gap-8">
        <AnimatePresence initial={false}>
          {(Array.isArray(data) ? data : []).map((t, idx) => (
            <motion.div 
              key={t.id}
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
                onClick={() => removeTraining(t.id)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors bg-overlay p-2 rounded-lg"
              >
                <Trash2 size={16} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 md:pl-6 pr-8">
                
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs font-medium text-muted">Training / Certification Name</label>
                  <input 
                    type="text" value={t.name} onChange={(e) => handleChange(t.id, 'name', e.target.value)}
                    placeholder="e.g. AWS Certified Solutions Architect"
                    className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-muted">Organization / Issuer</label>
                  <input 
                    type="text" value={t.organization} onChange={(e) => handleChange(t.id, 'organization', e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-muted">Completion Date</label>
                  <input 
                    type="month" value={t.date} onChange={(e) => handleChange(t.id, 'date', e.target.value)}
                    className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue [color-scheme:dark]"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs font-medium text-muted">Certificate ID / URL (Optional)</label>
                  <input 
                    type="text" value={t.certificateId} onChange={(e) => handleChange(t.id, 'certificateId', e.target.value)}
                    placeholder="e.g. 1234-5678-ABCD or https://..."
                    className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2 mt-2">
                  <label className="text-xs font-medium text-muted">Description</label>
                  <textarea 
                    value={t.description} onChange={(e) => handleChange(t.id, 'description', e.target.value)}
                    placeholder="• Completed 40 hours of coursework focusing on..."
                    rows={3}
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
          <p className="text-muted mb-4">No trainings or certifications added yet.</p>
        </div>
      )}

      <button 
        onClick={addTraining}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-dashed border-accent-blue/50 text-accent-blue hover:bg-accent-blue/10 transition-colors font-medium"
      >
        <Plus size={18} /> Add Certification
      </button>
    </div>
  );
}

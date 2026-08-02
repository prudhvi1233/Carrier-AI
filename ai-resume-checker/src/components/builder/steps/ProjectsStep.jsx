import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectsStep({ data, onUpdate }) {
  const addProject = () => {
    onUpdate([...(data || []), { 
      id: Date.now().toString(), 
      title: '', 
      technologies: '', 
      description: '', 
      githubUrl: '', 
      demoUrl: '' 
    }]);
  };

  const removeProject = (id) => {
    onUpdate(data.filter(p => p.id !== id));
  };

  const handleChange = (id, field, value) => {
    onUpdate(data.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-foreground mb-2">Projects</h2>
        <p className="text-muted">Add relevant projects that demonstrate your skills.</p>
      </div>

      <div className="flex flex-col gap-8">
        <AnimatePresence initial={false}>
          {(Array.isArray(data) ? data : []).map((p, idx) => (
            <motion.div 
              key={p.id}
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
                onClick={() => removeProject(p.id)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors bg-overlay p-2 rounded-lg"
              >
                <Trash2 size={16} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 md:pl-6 pr-8">
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-muted">Project Title</label>
                  <input 
                    type="text" value={p.title} onChange={(e) => handleChange(p.id, 'title', e.target.value)}
                    placeholder="e.g. E-Commerce Dashboard"
                    className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-muted">Technologies Used</label>
                  <input 
                    type="text" value={p.technologies} onChange={(e) => handleChange(p.id, 'technologies', e.target.value)}
                    placeholder="e.g. React, Node.js, MongoDB"
                    className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-muted">GitHub Link (Optional)</label>
                  <input 
                    type="url" value={p.githubUrl} onChange={(e) => handleChange(p.id, 'githubUrl', e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-muted">Live Demo Link (Optional)</label>
                  <input 
                    type="url" value={p.demoUrl} onChange={(e) => handleChange(p.id, 'demoUrl', e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent-blue"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2 mt-2">
                  <label className="text-xs font-medium text-muted">Project Description</label>
                  <textarea 
                    value={p.description} onChange={(e) => handleChange(p.id, 'description', e.target.value)}
                    placeholder="• Built a full-stack application that..."
                    rows={4}
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
          <p className="text-muted mb-4">No projects added yet.</p>
        </div>
      )}

      <button 
        onClick={addProject}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-dashed border-accent-blue/50 text-accent-blue hover:bg-accent-blue/10 transition-colors font-medium"
      >
        <Plus size={18} /> Add Project
      </button>
    </div>
  );
}

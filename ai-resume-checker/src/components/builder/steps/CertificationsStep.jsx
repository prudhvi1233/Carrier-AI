import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CertificationsStep({ data, onUpdate }) {
  
  const addCert = () => {
    onUpdate([...data, { id: Date.now().toString(), name: '', issuer: '', date: '', url: '' }]);
  };

  const removeCert = (id) => {
    onUpdate(data.filter(c => c.id !== id));
  };

  const handleChange = (id, field, value) => {
    onUpdate(data.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-white mb-2">Certifications</h2>
        <p className="text-gray-400">Add relevant certificates, licenses, or courses you have completed.</p>
      </div>

      <div className="flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {data.map((c, idx) => (
            <motion.div 
              key={c.id}
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-4 border-white/10 relative group flex items-start gap-4"
            >
              <div className="pt-2 opacity-0 group-hover:opacity-100 cursor-grab text-gray-500 transition-opacity">
                <GripVertical size={20} />
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-gray-400">Certification Name</label>
                  <input 
                    type="text" value={c.name} onChange={(e) => handleChange(c.id, 'name', e.target.value)}
                    placeholder="e.g. AWS Certified Solutions Architect"
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-blue"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-gray-400">Issuing Organization</label>
                  <input 
                    type="text" value={c.issuer} onChange={(e) => handleChange(c.id, 'issuer', e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-blue"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-gray-400">Date Issued</label>
                  <input 
                    type="month" value={c.date} onChange={(e) => handleChange(c.id, 'date', e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-blue [color-scheme:dark]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-gray-400">Credential URL</label>
                  <input 
                    type="url" value={c.url} onChange={(e) => handleChange(c.id, 'url', e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-blue"
                  />
                </div>
              </div>

              <button 
                onClick={() => removeCert(c.id)}
                className="pt-2 text-gray-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button 
        onClick={addCert}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-dashed border-accent-blue/50 text-accent-blue hover:bg-accent-blue/10 transition-colors font-medium"
      >
        <Plus size={18} /> Add Certification
      </button>
    </div>
  );
}

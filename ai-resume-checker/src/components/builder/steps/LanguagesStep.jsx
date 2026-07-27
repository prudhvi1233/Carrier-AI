import React from 'react';
import { Plus, Trash2, Globe2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LanguagesStep({ data, onUpdate }) {
  
  const addLanguage = () => {
    onUpdate([...data, { id: Date.now().toString(), language: '', proficiency: 'Native / Bilingual' }]);
  };

  const removeLanguage = (id) => {
    onUpdate(data.filter(l => l.id !== id));
  };

  const handleChange = (id, field, value) => {
    onUpdate(data.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-white mb-2">Languages</h2>
        <p className="text-gray-400">List languages you speak and your proficiency level.</p>
      </div>

      <div className="flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {data.map((l, idx) => (
            <motion.div 
              key={l.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-4 glass-card p-4 border-white/10"
            >
              <div className="p-3 text-blue-400 bg-blue-500/10 rounded-lg">
                <Globe2 size={20} />
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-gray-400">Language</label>
                  <input 
                    type="text" value={l.language} onChange={(e) => handleChange(l.id, 'language', e.target.value)}
                    placeholder="e.g. English"
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-blue"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-gray-400">Proficiency</label>
                  <select 
                    value={l.proficiency} onChange={(e) => handleChange(l.id, 'proficiency', e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-accent-blue appearance-none cursor-pointer"
                  >
                    <option value="Native / Bilingual">Native / Bilingual</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Proficient">Proficient</option>
                    <option value="Conversational">Conversational</option>
                    <option value="Basic">Basic</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={() => removeLanguage(l.id)}
                className="p-3 text-gray-500 hover:text-red-400 transition-colors bg-white/5 rounded-lg"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button 
        onClick={addLanguage}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-dashed border-white/20 text-white hover:bg-white/5 transition-colors font-medium"
      >
        <Plus size={18} /> Add Language
      </button>
    </div>
  );
}

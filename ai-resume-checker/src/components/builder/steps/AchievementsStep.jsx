import React from 'react';
import { Plus, Trash2, Trophy, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AchievementsStep({ data, onUpdate }) {
  
  const addAchievement = () => {
    onUpdate([...data, { id: Date.now().toString(), text: '' }]);
  };

  const removeAchievement = (id) => {
    onUpdate(data.filter(a => a.id !== id));
  };

  const handleChange = (id, value) => {
    onUpdate(data.map(a => a.id === id ? { ...a, text: value } : a));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-white mb-2">Achievements & Awards</h2>
        <p className="text-gray-400">Showcase your notable accomplishments, awards, or publications.</p>
      </div>

      <div className="glass-card p-6 border-accent-blue/30 bg-accent-blue/5 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div>
          <h3 className="text-white font-bold mb-1">Make them impactful</h3>
          <p className="text-sm text-gray-400">AI can help you rewrite your achievements to emphasize metrics and results.</p>
        </div>
        <button 
          className="shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-blue/20 text-accent-blue font-bold border border-accent-blue/30 hover:bg-accent-blue/30 transition-all hover:-translate-y-0.5"
        >
          <Sparkles size={18} />
          Enhance Achievements
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {data.map((a, idx) => (
            <motion.div 
              key={a.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-start gap-3 bg-black/20 p-2 rounded-xl border border-white/10"
            >
              <div className="p-3 text-yellow-500">
                <Trophy size={18} />
              </div>
              <textarea 
                value={a.text} 
                onChange={(e) => handleChange(a.id, e.target.value)}
                placeholder="e.g. Awarded Employee of the Year for increasing sales by 25%."
                rows={2}
                className="flex-1 bg-transparent border-none focus:outline-none text-white py-2 resize-none"
              />
              <button 
                onClick={() => removeAchievement(a.id)}
                className="p-3 text-gray-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button 
        onClick={addAchievement}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-dashed border-white/20 text-white hover:bg-white/5 transition-colors font-medium"
      >
        <Plus size={18} /> Add Achievement
      </button>
    </div>
  );
}

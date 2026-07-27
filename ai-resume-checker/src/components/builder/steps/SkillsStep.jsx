import React, { useState } from 'react';
import { X, Sparkles, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SkillsStep({ data, onUpdate }) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!data.includes(inputValue.trim())) {
        onUpdate([...data, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeSkill = (skillToRemove) => {
    onUpdate(data.filter(skill => skill !== skillToRemove));
  };

  const handleAISuggest = () => {
    // Mock suggesting skills based on job title
    const suggestions = ['React.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'GraphQL'];
    const newSkills = [...data];
    suggestions.forEach(s => {
      if (!newSkills.includes(s)) newSkills.push(s);
    });
    onUpdate(newSkills);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-white mb-2">Skills</h2>
        <p className="text-gray-400">Add skills relevant to the job you are applying for. Press enter to add a skill.</p>
      </div>

      <div className="glass-card p-6 border-accent-purple/30 bg-accent-purple/5 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div>
          <h3 className="text-white font-bold mb-1">Need help finding the right keywords?</h3>
          <p className="text-sm text-gray-400">Our AI can scan your experience and suggest the most ATS-friendly skills for your profile.</p>
        </div>
        <button 
          onClick={handleAISuggest}
          className="shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-bold shadow-lg shadow-accent-purple/20 hover:shadow-accent-purple/40 transition-all hover:-translate-y-0.5"
        >
          <Sparkles size={18} />
          Suggest Skills
        </button>
      </div>

      <div className="flex flex-col gap-4 bg-black/20 p-6 rounded-2xl border border-white/10 min-h-[300px]">
        
        <div className="relative">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a skill and press Enter (e.g. JavaScript, Project Management)"
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-4 text-white focus:outline-none focus:border-accent-blue"
          />
          <button 
            onClick={() => handleKeyDown({ key: 'Enter', preventDefault: () => {} })}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <AnimatePresence>
            {data.map((skill, idx) => (
              <motion.div
                key={skill + idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue font-medium"
              >
                {skill}
                <button 
                  onClick={() => removeSkill(skill)}
                  className="p-0.5 hover:bg-accent-blue/20 rounded-full transition-colors"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {data.length === 0 && (
            <p className="text-gray-500 text-sm italic w-full text-center mt-8">No skills added yet.</p>
          )}
        </div>

      </div>
    </div>
  );
}

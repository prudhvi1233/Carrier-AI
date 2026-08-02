import React, { useState } from 'react';
import { X, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddGoalModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [targetValue, setTargetValue] = useState(10);
  const [category, setCategory] = useState('applications');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      target_value: parseInt(targetValue, 10),
      category
    });
    // Reset and close
    setTitle('');
    setTargetValue(10);
    setCategory('applications');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-secondary border border-border rounded-2xl p-6 shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Target className="text-accent-blue" size={24} /> Add New Goal
            </h2>
            <button 
              onClick={onClose}
              className="text-muted hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted">Goal Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Apply to Software Engineering Roles"
                className="w-full bg-overlay border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-accent-blue transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted">Target Value</label>
              <input
                type="number"
                required
                min="1"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-full bg-overlay border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-accent-blue transition-colors"
              />
              <span className="text-xs text-gray-500">How many times do you want to do this?</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-accent-blue transition-colors appearance-none"
              >
                <option value="applications">Job Applications</option>
                <option value="learning">Learning & Courses</option>
                <option value="interviews">Interviews</option>
                <option value="networking">Networking</option>
                <option value="score">Improve Score</option>
              </select>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-overlay transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Save Goal
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

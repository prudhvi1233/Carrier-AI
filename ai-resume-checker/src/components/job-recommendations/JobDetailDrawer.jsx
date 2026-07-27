import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, DollarSign, Briefcase, Zap, AlertTriangle, Lightbulb } from 'lucide-react';
import SkillTags from './SkillTags';

export default function JobDetailDrawer({ isOpen, job, onClose }) {
  if (!isOpen || !job) return null;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-secondary border-l border-white/10 z-[70] shadow-2xl overflow-y-auto custom-scrollbar"
      >
        <div className="p-6">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-4 mb-6 pr-12">
            <img src={job.companyLogo} alt={job.company} className="w-16 h-16 rounded-2xl shadow-lg bg-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">{job.role}</h2>
              <p className="text-gray-400 font-medium">{job.company}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-3">
              <div className="p-2 bg-accent-blue/10 rounded-lg text-accent-blue"><MapPin size={16} /></div>
              <div><p className="text-xs text-gray-500 uppercase tracking-wider">Location</p><p className="text-sm text-white font-medium">{job.location}</p></div>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><DollarSign size={16} /></div>
              <div><p className="text-xs text-gray-500 uppercase tracking-wider">Salary</p><p className="text-sm text-white font-medium">{job.salary}</p></div>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-3">
              <div className="p-2 bg-accent-purple/10 rounded-lg text-accent-purple"><Briefcase size={16} /></div>
              <div><p className="text-xs text-gray-500 uppercase tracking-wider">Experience</p><p className="text-sm text-white font-medium">{job.experience}</p></div>
            </div>
            <div className="bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 p-3 rounded-xl border border-accent-blue/30 flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg text-white"><Zap size={16} className="text-yellow-400 glow-yellow" /></div>
              <div><p className="text-xs text-white/70 uppercase tracking-wider">AI Match</p><p className="text-lg text-white font-bold leading-none">{job.matchScore}%</p></div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-bold text-white mb-3">AI Explanation</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{job.matchExplanation}</p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-3">Recommended Roadmap</h3>
              <ul className="space-y-2">
                {job.roadmap && job.roadmap.map((step, i) => (
                  <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                    <span className="text-accent-blue mt-1">•</span> {step}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-3">Skill Alignment</h3>
              <SkillTags matched={job.skillsMatched} missing={job.skillsMissing} />
            </section>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Lightbulb size={100} /></div>
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <SparklesIcon /> Career Growth
              </h3>
              
              <h4 className="text-sm font-bold text-white mb-2">Skills to Develop:</h4>
              <ul className="space-y-2">
                {job.skillsMissing && job.skillsMissing.map((sug, i) => (
                  <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-yellow-400" /> {sug}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Bottom spacer for sticky actions */}
          <div className="h-24" />
        </div>

        {/* Sticky Action Bar */}
        <div className="fixed bottom-0 right-0 w-full md:w-[600px] p-4 bg-secondary/80 backdrop-blur-xl border-t border-white/10 flex gap-3">
          <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-colors">
            Save Job
          </button>
          <button className="flex-1 bg-accent-blue hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-accent-blue/20 transition-colors">
            Apply Now
          </button>
        </div>
      </motion.div>
    </>
  );
}

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-blue"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
  )
}

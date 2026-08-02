import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, Minus } from 'lucide-react';

export default function CompareJobs({ jobs, onClose }) {
  if (jobs.length !== 2) return null;
  const [job1, job2] = jobs;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-secondary rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-4 border-b border-border flex items-center justify-between bg-overlay shrink-0">
          <h2 className="text-lg font-bold text-foreground">Compare Jobs</h2>
          <button onClick={onClose} className="p-2 bg-overlay hover:bg-overlay-hover rounded-xl transition-colors text-muted hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="w-1/3 p-4"></th>
                <th className="w-1/3 p-4 border-l border-border align-top">
                  <div className="flex items-center gap-3">
                    <img src={job1.companyLogo} alt={job1.company} className="w-10 h-10 rounded-lg bg-white" />
                    <div>
                      <h3 className="font-bold text-foreground">{job1.role}</h3>
                      <p className="text-xs text-muted">{job1.company}</p>
                    </div>
                  </div>
                </th>
                <th className="w-1/3 p-4 border-l border-border align-top">
                  <div className="flex items-center gap-3">
                    <img src={job2.companyLogo} alt={job2.company} className="w-10 h-10 rounded-lg bg-white" />
                    <div>
                      <h3 className="font-bold text-foreground">{job2.role}</h3>
                      <p className="text-xs text-muted">{job2.company}</p>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <Row label="AI Match Score" val1={`${job1.matchScore}%`} val2={`${job2.matchScore}%`} />
              <Row label="ATS Compatibility" val1={`${job1.atsCompatibility}%`} val2={`${job2.atsCompatibility}%`} />
              <Row label="Salary" val1={job1.salary} val2={job2.salary} />
              <Row label="Location" val1={job1.location} val2={job2.location} />
              <Row label="Work Mode" val1={job1.workMode} val2={job2.workMode} />
              <Row label="Experience" val1={job1.experience} val2={job2.experience} />
              <Row label="Interview Difficulty" val1={job1.interviewDifficulty} val2={job2.interviewDifficulty} />
              <tr>
                <td className="p-4 border-t border-border text-sm font-medium text-muted align-top">Skills Matched</td>
                <td className="p-4 border-t border-l border-border align-top">
                  <div className="flex flex-wrap gap-1">
                    {job1.skillsMatched.map(s => <span key={s} className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] rounded">{s}</span>)}
                  </div>
                </td>
                <td className="p-4 border-t border-l border-border align-top">
                  <div className="flex flex-wrap gap-1">
                    {job2.skillsMatched.map(s => <span key={s} className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] rounded">{s}</span>)}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="p-4 border-t border-b border-border text-sm font-medium text-muted align-top">Skills Missing</td>
                <td className="p-4 border-t border-b border-l border-border align-top">
                  <div className="flex flex-wrap gap-1">
                    {job1.skillsMissing.length ? job1.skillsMissing.map(s => <span key={s} className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] rounded">{s}</span>) : <span className="text-gray-500 text-xs">None</span>}
                  </div>
                </td>
                <td className="p-4 border-t border-b border-l border-border align-top">
                  <div className="flex flex-wrap gap-1">
                    {job2.skillsMissing.length ? job2.skillsMissing.map(s => <span key={s} className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] rounded">{s}</span>) : <span className="text-gray-500 text-xs">None</span>}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

function Row({ label, val1, val2 }) {
  const isBetter = (a, b) => {
    // Basic heuristic to color text slightly if clearly better
    if (label.includes('Score')) {
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (numA > numB) return 1;
      if (numB > numA) return 2;
    }
    return 0;
  };
  
  const better = isBetter(val1, val2);

  return (
    <tr>
      <td className="p-4 border-t border-border text-sm font-medium text-muted">{label}</td>
      <td className={`p-4 border-t border-l border-border text-sm font-bold ${better === 1 ? 'text-accent-blue' : 'text-foreground'}`}>{val1}</td>
      <td className={`p-4 border-t border-l border-border text-sm font-bold ${better === 2 ? 'text-accent-blue' : 'text-foreground'}`}>{val2}</td>
    </tr>
  );
}

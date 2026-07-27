import React from 'react';
import { CheckCircle2, AlertTriangle, FileText, Download } from 'lucide-react';

export default function ReviewStep({ data, template }) {
  
  // Basic validation checks
  const warnings = [];
  if (!data.personal.firstName || !data.personal.lastName || !data.personal.email) {
    warnings.push("Personal Information is incomplete. Name and Email are required.");
  }
  if (!data.summary || data.summary.length < 50) {
    warnings.push("Your summary is very short. Consider using AI to enhance it.");
  }
  if (data.experience.length === 0) {
    warnings.push("You haven't added any work experience.");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-white mb-2">Final Review</h2>
        <p className="text-gray-400">Review your information before generating the final PDF.</p>
      </div>

      {warnings.length > 0 ? (
        <div className="glass-card p-6 border-yellow-500/30 bg-yellow-500/5 mb-4">
          <h3 className="text-yellow-500 font-bold mb-3 flex items-center gap-2">
            <AlertTriangle size={18} /> Needs Attention
          </h3>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            {warnings.map((w, i) => (
              <li key={i} className="text-gray-300 text-sm">{w}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="glass-card p-6 border-green-500/30 bg-green-500/5 mb-4">
          <h3 className="text-green-500 font-bold flex items-center gap-2">
            <CheckCircle2 size={18} /> All Looks Good!
          </h3>
          <p className="text-gray-400 text-sm mt-1">Your resume is fully populated and ready for export.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-card p-6 border-white/10 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white">Selected Template</h4>
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/10 text-white">
              {template?.name}
            </span>
          </div>
          <div className="w-full aspect-[1/1.4] bg-white/5 rounded flex items-center justify-center border border-white/10">
            <FileText size={48} className="text-gray-500 opacity-50" />
          </div>
        </div>

        <div className="glass-card p-6 border-white/10 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-white mb-4">Content Summary</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Education Entries</span> <span className="text-white font-bold">{data.education.length}</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Experience Entries</span> <span className="text-white font-bold">{data.experience.length}</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Projects Added</span> <span className="text-white font-bold">{data.projects.length}</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Skills Listed</span> <span className="text-white font-bold">{data.skills.length}</span>
              </li>
              <li className="flex justify-between pb-2">
                <span>Certifications</span> <span className="text-white font-bold">{data.certifications.length}</span>
              </li>
            </ul>
          </div>

          <button className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-bold mt-6 shadow-lg shadow-accent-blue/20 hover:-translate-y-0.5 transition-all">
            <Download size={18} /> Export PDF Now
          </button>
        </div>

      </div>
    </div>
  );
}

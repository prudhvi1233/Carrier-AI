import React from 'react';
import { Check, X } from 'lucide-react';

export default function SkillTags({ matched, missing }) {
  return (
    <div className="flex flex-wrap gap-2">
      {matched.map(skill => (
        <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
          <Check size={12} />
          {skill}
        </span>
      ))}
      {missing.map(skill => (
        <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 opacity-80">
          <X size={12} />
          {skill}
        </span>
      ))}
    </div>
  );
}

import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SkillsComparison({ matched, missing }) {
  return (
    <div className="bg-secondary/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-6">Skills Comparison</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="text-green-400" size={20} />
            <h4 className="font-medium text-white">Matched Skills ({matched.length})</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {matched.map((skill, index) => (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                key={skill}
                className="px-3 py-1 bg-green-400/10 border border-green-400/20 text-green-300 rounded-full text-sm font-medium shadow-[0_0_10px_rgba(74,222,128,0.1)]"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="text-red-400" size={20} />
            <h4 className="font-medium text-white">Missing Skills ({missing.length})</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {missing.map((skill, index) => (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                key={skill}
                className="px-3 py-1 bg-red-400/10 border border-red-400/20 text-red-300 rounded-full text-sm font-medium shadow-[0_0_10px_rgba(248,113,113,0.1)]"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

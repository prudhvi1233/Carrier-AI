import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Clock, Briefcase, Zap, Building2 } from 'lucide-react';
import MatchExplanation from './MatchExplanation';
import SkillTags from './SkillTags';
import ActionToolbar from './ActionToolbar';

export default function RecommendationCard({ job, onViewDetails, isComparing, onCompareToggle }) {
  
  // Create circular progress for Match Score
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (job.matchScore / 100) * circumference;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-6 border-l-4 transition-all hover:scale-[1.01] ${isComparing ? 'border-l-accent-blue bg-white/10' : 'border-l-transparent hover:border-l-accent-purple'}`}
    >
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Left: Logo & Core Info */}
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-4">
            <img src={job.companyLogo} alt={job.company} className="w-14 h-14 rounded-xl shadow-lg bg-white" />
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">{job.role}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Building2 size={14} className="text-gray-400" />
                <span className="text-sm text-gray-300 font-medium">{job.company}</span>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{job.postedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin size={16} className="text-accent-blue" /> {job.location} ({job.workMode})
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <DollarSign size={16} className="text-green-400" /> {job.salary}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Briefcase size={16} className="text-accent-purple" /> {job.experience}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock size={16} className="text-yellow-400" /> {job.type}
            </div>
          </div>

          <SkillTags matched={job.skillsMatched} missing={job.skillsMissing} />
        </div>

        {/* Right: Scores & Actions */}
        <div className="flex flex-col items-start md:items-end justify-between md:w-64 shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 gap-4">
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">AI Match</span>
              <div className="flex items-center gap-1">
                <Zap size={14} className="text-yellow-400" />
                <span className="text-xs text-gray-300">ATS: {job.atsCompatibility}%</span>
              </div>
            </div>
            
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r={radius} className="stroke-white/10" strokeWidth="4" fill="none" />
                <motion.circle 
                  cx="30" cy="30" r={radius} 
                  className={`${job.matchScore >= 90 ? 'stroke-accent-blue' : job.matchScore >= 80 ? 'stroke-accent-purple' : 'stroke-green-400'} glow-blue`} 
                  strokeWidth="4" 
                  fill="none" 
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{ strokeDasharray: circumference }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-lg font-bold text-white leading-none">{job.matchScore}</span>
              </div>
            </div>
          </div>

          <ActionToolbar 
            job={job} 
            onViewDetails={onViewDetails} 
            isComparing={isComparing} 
            onCompareToggle={onCompareToggle} 
          />
        </div>
      </div>

      <MatchExplanation text={job.matchExplanation} />
    </motion.div>
  );
}

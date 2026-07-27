import React from 'react';
import { motion } from 'framer-motion';
import MatchScoreCard from './MatchScoreCard';
import SkillsComparison from './SkillsComparison';
import KeywordAnalysis from './KeywordAnalysis';
import ExperienceComparison from './ExperienceComparison';
import ATSBreakdown from './ATSBreakdown';
import AISuggestions from './AISuggestions';
import HiringProbability from './HiringProbability';
import ChartsSection from './ChartsSection';
import ActionButtons from './ActionButtons';

export default function MatchResults({ data, onAnalyzeAnother }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item}>
        <MatchScoreCard 
          score={data.overall_match_score}
          label={data.performance_label}
          title={data.job_title}
          company={data.company_name}
        />
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div variants={item} className="flex flex-col gap-6">
          <SkillsComparison matched={data.skills_comparison.matched} missing={data.skills_comparison.missing} />
          <ExperienceComparison experience={data.experience_match} />
          <ATSBreakdown ats={data.ats_optimization} />
        </motion.div>

        <motion.div variants={item} className="flex flex-col gap-6">
          <HiringProbability probabilities={data.probabilities} />
          <KeywordAnalysis keywords={data.keyword_analysis} />
          <AISuggestions suggestions={data.ai_suggestions} />
        </motion.div>
      </div>

      <motion.div variants={item}>
        <ChartsSection charts={data.charts} />
      </motion.div>

      <motion.div variants={item}>
        <ActionButtons onAnalyzeAnother={onAnalyzeAnother} />
      </motion.div>
    </motion.div>
  );
}

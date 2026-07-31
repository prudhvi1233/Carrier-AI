import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Zap, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { jobRecommendationService } from '../services/jobService';
import RecommendationCard from '../components/job-recommendations/RecommendationCard';
import FilterPanel from '../components/job-recommendations/FilterPanel';
import EmptyState from '../components/job-recommendations/EmptyState';
import JobDetailDrawer from '../components/job-recommendations/JobDetailDrawer';

export default function JobRecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [experienceFilters, setExperienceFilters] = useState([]);
  const [jobTypeFilters, setJobTypeFilters] = useState([]);
  const [companySizeFilters, setCompanySizeFilters] = useState([]);
  const [minSalary, setMinSalary] = useState(3);
  const [sortBy, setSortBy] = useState('Highest Match');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await jobRecommendationService.getRecommendations();
      if (data && data.length > 0) {
        setRecommendations(data);
      } else {
        // Automatically generate if none exist
        await handleGenerate();
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      const data = await jobRecommendationService.generateRecommendations();
      setRecommendations(data);
      toast.success('Successfully generated personalized jobs!');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || 'Failed to generate recommendations.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsGenerating(true);
      await jobRecommendationService.deleteRecommendations();
      await handleGenerate();
    } catch (err) {
      console.error(err);
      toast.error('Failed to refresh recommendations.');
      setIsGenerating(false);
    }
  };

  const openDetails = (job) => {
    setSelectedJob(job);
    setIsDrawerOpen(true);
  };

  // Processing data for UI
  const filteredData = useMemo(() => {
    return recommendations
      .filter(job => {
        if (searchQuery && !job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) && !job.companies.join(' ').toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        
        if (experienceFilters.length > 0) {
          if (!experienceFilters.some(ef => job.experience_level?.toLowerCase().includes(ef.toLowerCase()))) {
            return false;
          }
        }
        
        if (jobTypeFilters.length > 0) {
           const jobString = JSON.stringify(job).toLowerCase();
           if (!jobTypeFilters.some(jtf => jobString.includes(jtf.toLowerCase()))) {
             return false;
           }
        }
        
        if (companySizeFilters.length > 0) {
           const jobString = JSON.stringify(job).toLowerCase();
           if (!companySizeFilters.some(csf => jobString.includes(csf.toLowerCase()))) {
             return false;
           }
        }
        
        if (minSalary > 3) {
          const matches = job.salary_range?.match(/\d+/g);
          if (matches && matches.length > 0) {
            const numbers = matches.map(Number);
            const maxVal = Math.max(...numbers);
            if (maxVal < minSalary) {
              return false;
            }
          }
        }
        
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'Highest Match') return b.match_percentage - a.match_percentage;
        return 0;
      });
  }, [recommendations, searchQuery, experienceFilters, jobTypeFilters, companySizeFilters, minSalary, sortBy]);

  // Format job for RecommendationCard which expects specific keys
  const formatJobForCard = (job) => ({
    id: job.id,
    role: job.job_title,
    company: job.companies && job.companies.length > 0 ? job.companies[0] : 'Various',
    companyLogo: `https://ui-avatars.com/api/?name=${encodeURIComponent(job.companies && job.companies.length > 0 ? job.companies[0] : 'Co')}&background=random`,
    postedDate: 'Just now',
    location: 'Remote/Hybrid', // Gemini doesn't always specify, default to this or parsed
    workMode: 'Flexible',
    salary: job.salary_range,
    experience: job.experience_level,
    type: 'Full-time',
    skillsMatched: job.required_skills || [],
    skillsMissing: job.missing_skills || [],
    atsCompatibility: job.match_percentage, // Using match % as a proxy for UI
    matchScore: job.match_percentage,
    matchExplanation: job.why_match,
    roadmap: job.roadmap,
    rawJob: job
  });

  if (isLoading || isGenerating) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-16 h-16 rounded-full border-4 border-white/10 border-t-accent-blue mb-8 shadow-[0_0_30px_rgba(56,189,248,0.2)]"
        />
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
          {isGenerating ? 'Generating recommendations...' : 'Finding the best jobs...'}
        </h2>
        <div className="flex flex-col items-center gap-2 mt-4 text-gray-400 text-sm">
          <p className="flex items-center gap-2"><Zap size={14} className="text-accent-blue" /> Matching your skills...</p>
          <p className="flex items-center gap-2"><Briefcase size={14} className="text-accent-purple" /> Checking ATS compatibility...</p>
        </div>
      </div>
    );
  }

  if (error && recommendations.length === 0) {
    return (
      <div className="p-8 w-full max-w-2xl mx-auto mt-10 glass-card text-center">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <button onClick={fetchRecommendations} className="btn-primary">Try Again</button>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return <EmptyState onGenerate={handleGenerate} />;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-6 md:p-8 shrink-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 bg-black/20 backdrop-blur-xl z-10 relative">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple">Job Matches</span>
          </h1>
          <p className="text-gray-400">Personalized opportunities based on your skills and AI analysis.</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 text-sm font-medium flex items-center gap-2"
        >
          <Zap size={16} className="text-accent-purple" />
          Refresh Recommendations
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-8">
          
          <div className="w-full xl:w-72 shrink-0">
            <FilterPanel 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              experienceFilters={experienceFilters}
              setExperienceFilters={setExperienceFilters}
              jobTypeFilters={jobTypeFilters}
              setJobTypeFilters={setJobTypeFilters}
              companySizeFilters={companySizeFilters}
              setCompanySizeFilters={setCompanySizeFilters}
              minSalary={minSalary}
              setMinSalary={setMinSalary}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>

          <div className="flex-1 flex flex-col gap-6">
            {filteredData.length === 0 ? (
              <div className="glass-card p-12 text-center flex flex-col items-center justify-center h-64">
                <Briefcase size={48} className="text-gray-500 mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-white mb-2">No matches found</h3>
                <p className="text-gray-400 text-sm max-w-md mx-auto">
                  Try adjusting your filters or generating new recommendations based on an updated resume.
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredData.map((job) => (
                  <RecommendationCard 
                    key={job.id} 
                    job={formatJobForCard(job)} 
                    onViewDetails={() => openDetails(formatJobForCard(job))}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      <JobDetailDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        job={selectedJob} 
      />
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Target, CheckCircle2, XCircle, ChevronRight, FileText, Briefcase, Zap } from 'lucide-react';
import { jobMatchService } from '../services/careerServices';

export default function JobMatchPage() {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobDescription.trim()) {
      setError("Please provide both Job Title and Description.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await jobMatchService.analyzeMatch({
        job_title: jobTitle,
        job_description: jobDescription
      });
      setResult(analysis);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to analyze job match. Ensure you have an active resume uploaded.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-400/20";
    if (score >= 60) return "bg-yellow-400/20";
    return "bg-red-400/20";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl glass-card p-8">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-accent-blue/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-accent-purple/10 blur-3xl rounded-full" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium mb-4">
            <Target size={16} />
            <span>AI Job Match Analyzer</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Compare Your Resume vs Job Description
          </h1>
          <p className="text-gray-400 max-w-2xl text-lg">
            Paste a target job description below. Our AI will instantly compare it against your active resume and tell you exactly what you're missing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="glass-card p-6">
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Job Description</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-500" size={18} />
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  rows={10}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue transition-colors resize-none"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !jobTitle || !jobDescription}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Analyzing Match...
                </>
              ) : (
                <>
                  <Zap size={20} />
                  Analyze Job Match
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results View */}
        <div className="glass-card p-6 min-h-[500px] flex flex-col relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-gray-500 space-y-4"
              >
                <Target size={48} className="opacity-20" />
                <p>Enter a job description to see your match results</p>
              </motion.div>
            )}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center space-y-4"
              >
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                  <div className="absolute inset-0 border-4 border-accent-blue rounded-full border-t-transparent animate-spin" />
                </div>
                <p className="text-gray-400 animate-pulse">Running AI Analysis...</p>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Score Header */}
                <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <h3 className="text-lg font-medium text-gray-300">Overall Match Score</h3>
                    <p className="text-sm text-gray-500 mt-1">Based on skills and experience</p>
                  </div>
                  <div className={`text-4xl font-bold flex items-center gap-1 ${getScoreColor(result.match_score)}`}>
                    {result.match_score}
                    <span className="text-lg font-normal text-gray-500">/ 100</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-white font-medium">
                      <CheckCircle2 className="text-green-400" size={18} />
                      Matching Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.matching_skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-400/10 text-green-400 border border-green-400/20 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                      {result.matching_skills.length === 0 && (
                        <span className="text-sm text-gray-500">None identified</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-white font-medium">
                      <XCircle className="text-red-400" size={18} />
                      Missing Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.missing_skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-red-400/10 text-red-400 border border-red-400/20 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                      {result.missing_skills.length === 0 && (
                        <span className="text-sm text-gray-500">None identified</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium border-b border-white/10 pb-2">AI Recommendations</h4>
                  <ul className="space-y-3">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-300 bg-white/5 p-3 rounded-lg border border-white/5">
                        <ChevronRight className="text-accent-blue mt-0.5 shrink-0" size={16} />
                        <span className="leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

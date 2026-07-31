import React, { useState } from 'react';
import { Eye, Bookmark, GitCompare, ExternalLink, CheckCircle } from 'lucide-react';
import { jobTrackerService } from '../../services/jobService';
import toast from 'react-hot-toast';

export default function ActionToolbar({ job, onViewDetails, isComparing, onCompareToggle }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToApplications = async () => {
    if (isSaved) return;
    try {
      setIsAdding(true);
      await jobTrackerService.addSavedJob({
        company: job.company,
        role: job.role,
        status: 'Not Applied',
        notes: `AI Match Score: ${job.matchScore}%\n\nWhy this matches: ${job.matchExplanation}`
      });
      setIsSaved(true);
      toast.success(`${job.role} added to Job Tracker!`);
    } catch (error) {
      toast.error('Failed to add to applications.');
    } finally {
      setIsAdding(false);
    }
  };
  return (
    <div className="flex items-center gap-2 w-full mt-2">
      <button 
        onClick={onViewDetails}
        className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 border border-white/5"
      >
        <Eye size={14} /> Details
      </button>
      
      <button 
        onClick={onCompareToggle}
        className={`p-2 rounded-lg transition-colors border ${isComparing ? 'bg-accent-blue/20 text-accent-blue border-accent-blue/30' : 'bg-white/5 text-gray-400 hover:text-white border-white/5 hover:bg-white/10'}`}
        title={isComparing ? 'Remove from comparison' : 'Compare Job'}
      >
        <GitCompare size={14} />
      </button>

      <button 
        onClick={handleAddToApplications} 
        disabled={isSaved || isAdding}
        className={`p-2 rounded-lg transition-colors border ${isSaved ? 'bg-accent-blue/20 text-accent-blue border-accent-blue/30' : 'bg-white/5 text-gray-400 hover:text-white border-white/5 hover:bg-white/10'}`} 
        title={isSaved ? "Saved" : "Save Job"}
      >
        <Bookmark size={14} className={isSaved ? "fill-current" : ""} />
      </button>
      
      <button 
        onClick={handleAddToApplications}
        disabled={isSaved || isAdding}
        className={`p-2 shadow-lg rounded-lg transition-colors flex items-center gap-2 px-3 text-xs font-bold ${
          isSaved 
            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
            : 'bg-accent-blue hover:bg-blue-500 text-white shadow-accent-blue/20'
        }`}
        title="Add to Applications"
      >
        {isSaved ? <CheckCircle size={14} /> : <ExternalLink size={14} />}
        <span className="hidden sm:inline">{isSaved ? 'Added' : 'Add to Tracker'}</span>
      </button>
    </div>
  );
}

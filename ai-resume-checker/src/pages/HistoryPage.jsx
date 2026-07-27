import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { resumeService } from '../services/resumeService';
import { analysisService } from '../services/analysisService';
import { useGlobalState } from '../context/GlobalStateContext';

import HistorySearchFilters from '../components/history/HistorySearchFilters';
import HistoryTable from '../components/history/HistoryTable';
import HistoryMobileCard from '../components/history/HistoryMobileCard';
import Pagination from '../components/history/Pagination';
import EmptyState from '../components/history/EmptyState';
import LoadingState from '../components/history/LoadingState';
import ErrorState from '../components/history/ErrorState';
import DeleteModal from '../components/history/DeleteModal';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { refreshTrigger, triggerRefresh } = useGlobalState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resumes, setResumes] = useState([]);

  // States
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const [resumesData, analysisData] = await Promise.all([
          resumeService.getResumeHistory(),
          analysisService.getAnalysisHistory()
        ]);
        
        // Map backend API model to frontend expected format
        const mappedResumes = resumesData.map(r => {
          const analysis = analysisData.find(a => a.resume_id === r.id);
          return {
            id: r.id,
            name: r.original_name || `Resume ${r.id}`,
            uploaded_at: r.created_at,
            status: analysis ? 'analyzed' : 'parsed',
            resume_score: analysis ? analysis.overall_score : null,
            ats_score: analysis ? analysis.ats_score : null,
            skills: analysis ? [...analysis.technical_skills, ...analysis.soft_skills] : []
          };
        });
        
        setResumes(mappedResumes);
      } catch (err) {
        setError(err.message || 'Failed to fetch resume history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [refreshTrigger]);

  // Filter and Sort Logic
  const processedResumes = useMemo(() => {
    if (!resumes) return [];
    
    let result = [...resumes];

    // Filter by Search (name)
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (sort) {
        case 'newest': return new Date(b.uploaded_at) - new Date(a.uploaded_at);
        case 'oldest': return new Date(a.uploaded_at) - new Date(b.uploaded_at);
        case 'alphabetical': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

    return result;
  }, [resumes, search, sort, statusFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(processedResumes.length / itemsPerPage);
  const currentItems = processedResumes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sort, statusFilter]);

  // Action Handlers
  const handleAction = async (action, payload) => {
    if (action === 'view') {
      navigate(`/analysis/${payload}`);
    } else if (action === 'download') {
      alert(`Downloading report for ${payload}...`);
    } else if (action === 'reanalyze') {
      try {
        await resumeService.parseResume(payload);
        triggerRefresh();
        alert('Reanalyzed successfully!');
      } catch (error) {
        alert('Failed to reanalyze.');
      }
    } else if (action === 'delete') {
      const target = resumes.find(r => r.id === payload);
      setResumeToDelete(target);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (resumeToDelete) {
      try {
        await resumeService.deleteResume(resumeToDelete.id);
        triggerRefresh();
      } catch (error) {
        alert('Failed to delete resume');
      }
    }
    setIsDeleteModalOpen(false);
    setResumeToDelete(null);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto flex flex-col gap-8 pb-12"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          Resume History
        </h1>
        <p className="text-gray-400 text-lg">
          View, search, and manage all your previously analyzed resumes in one place.
        </p>
      </div>

      {/* Main Grid Area */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* Left Column (Table & Filters) */}
        <div className="col-span-1 flex flex-col gap-6">
          <HistorySearchFilters 
            search={search} setSearch={setSearch}
            sort={sort} setSort={setSort}
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          />

          <div className="glass-card flex flex-col min-h-[400px]">
            {processedResumes.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <HistoryTable resumes={currentItems} onAction={handleAction} />
                
                {/* Mobile Cards */}
                <div className="sm:hidden flex flex-col gap-4 p-4">
                  {currentItems.map(resume => (
                    <HistoryMobileCard key={resume.id} resume={resume} onAction={handleAction} />
                  ))}
                </div>

                {/* Pagination Footer */}
                {totalPages > 1 && (
                  <div className="mt-auto p-4 md:p-6 border-t border-white/10">
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={processedResumes.length}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        resumeName={resumeToDelete?.name}
      />
    </motion.div>
  );
}

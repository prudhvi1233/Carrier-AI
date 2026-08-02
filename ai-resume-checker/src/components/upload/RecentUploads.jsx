import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EmptyState from './EmptyState';
import { resumeService } from '../../services/resumeService';
import { analysisService } from '../../services/analysisService';

export default function RecentUploads() {
  const navigate = useNavigate();
  const [recentUploads, setRecentUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        setLoading(true);
        const [resumesData, analysisData] = await Promise.all([
          resumeService.getResumeHistory(),
          analysisService.getAnalysisHistory()
        ]);
        
        const mappedResumes = resumesData.map(r => {
          const analysis = analysisData.find(a => a.resume_id === r.id);
          return {
            id: r.id,
            name: r.original_name || `Resume ${r.id}`,
            date: new Date(r.uploaded_at).toLocaleDateString(),
            status: analysis ? 'Analyzed' : 'Parsed',
            score: analysis ? analysis.overall_score : '-',
          };
        });
        
        // Sort by newest and grab top 5
        mappedResumes.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecentUploads(mappedResumes.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch recent uploads', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  if (loading) {
    return (
      <div className="glass-card flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-accent-blue" size={32} />
      </div>
    );
  }

  if (recentUploads.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Recent Uploads</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-overlay border-b border-border">
              <th className="py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider">Resume Name</th>
              <th className="py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider">Upload Date</th>
              <th className="py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider">Score</th>
              <th className="py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {recentUploads.map((item, idx) => (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                key={item.id} 
                onClick={() => navigate(`/analysis/${item.id}`)}
                className="hover:bg-overlay transition-colors group cursor-pointer"
              >
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-overlay flex items-center justify-center border border-border">
                      <FileText size={16} className="text-accent-blue" />
                    </div>
                    <span className="text-sm font-medium text-gray-200 group-hover:text-foreground transition-colors">{item.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-muted">
                  {item.date}
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${item.status === 'Analyzed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <span className="text-sm font-bold text-foreground">{item.score !== '-' ? `${item.score}/100` : 'Pending'}</span>
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-right">
                  <button className="text-sm font-medium text-accent-blue hover:text-accent-purple transition-colors flex items-center justify-end gap-1 w-full">
                    View <ChevronRight size={16} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

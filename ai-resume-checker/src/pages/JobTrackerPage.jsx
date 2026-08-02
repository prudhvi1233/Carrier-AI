import React, { useState, useEffect } from 'react';
import KanbanBoard from '../components/job-tracker/KanbanBoard';
import AnalyticsCharts from '../components/job-tracker/AnalyticsCharts';
import TrackerStats from '../components/job-tracker/TrackerStats';
import ExportToolbar from '../components/job-tracker/ExportToolbar';
import { jobTrackerService } from '../services/jobService';
import { toast } from 'react-hot-toast';

export default function JobTrackerPage() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const data = await jobTrackerService.getSavedJobs();
      setApplications(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load applications.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplication = async (updatedApp) => {
    try {
      const data = await jobTrackerService.updateSavedJob(updatedApp.id, {
        status: updatedApp.status,
        notes: updatedApp.notes
      });
      setApplications(prev => prev.map(app => app.id === data.id ? data : app));
    } catch (err) {
      console.error(err);
      toast.error('Failed to update job status.');
      // rollback UI state on error by refetching
      fetchJobs();
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full">
        <div className="w-8 h-8 rounded-full border-4 border-border border-t-accent-blue animate-spin mb-4" />
        <p className="text-muted">Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-6 md:p-8 shrink-0 border-b border-border bg-overlay backdrop-blur-xl z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">
              Application <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple">Tracker</span>
            </h1>
            <p className="text-muted">Manage your job search pipeline and track your progress.</p>
          </div>
          
          <ExportToolbar data={applications} />
        </div>

        <div className="mt-8">
          <TrackerStats applications={applications} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
        <div className="max-w-[1600px] mx-auto space-y-8">
          <div className="glass-card p-6 bg-gradient-to-br from-accent-blue/5 to-transparent">
            <h3 className="text-xl font-bold text-foreground mb-6">Pipeline Overview</h3>
            <AnalyticsCharts data={applications} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-6">Active Pipeline</h3>
            <KanbanBoard data={applications} updateData={setApplications} onStatusChange={updateApplication} />
          </div>
        </div>
      </div>
    </div>
  );
}

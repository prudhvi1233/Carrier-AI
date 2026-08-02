import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { analyticsService } from '../services/careerServices';
import { Loader2, Plus, Download, Search } from 'lucide-react';
import AnalyticsCharts from '../components/dashboard/AnalyticsCharts';
import GoalsWidget from '../components/dashboard/GoalsWidget';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import WeeklyInsights from '../components/dashboard/WeeklyInsights';
import CareerProgressWidget from '../components/dashboard/CareerProgressWidget';
import StatCard from '../components/StatCard';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await analyticsService.getAnalytics();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-accent-blue gap-3">
        <Loader2 size={32} className="animate-spin" />
        <span className="text-lg font-medium">Loading your career dashboard...</span>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const history = dashboardData?.history || [];

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-1"
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome Back, {user?.name || 'User'} <span className="animate-wave inline-block origin-bottom-right">👋</span>
          </h1>
          <p className="text-muted text-sm">
            Here's what's happening with your career today.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Link to="/resume-builder/create" className="flex items-center gap-2 px-4 py-2 bg-overlay border border-border rounded-xl text-sm font-medium text-foreground hover:bg-overlay-hover transition-colors">
            <Plus size={16} /> New Resume
          </Link>
          <Link to="/job-tracker" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl text-sm font-medium text-foreground shadow-lg shadow-accent-blue/20 hover:shadow-accent-blue/40 transition-all">
            <Search size={16} /> Find Jobs
          </Link>
          <ThemeToggle />
        </motion.div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl flex flex-col gap-1">
          <span className="text-muted text-xs font-medium uppercase tracking-wider">Avg Resume Score</span>
          <span className="text-2xl font-bold text-foreground">{stats.average_resume_score || 0}%</span>
        </div>
        <div className="glass-card p-4 rounded-2xl flex flex-col gap-1">
          <span className="text-muted text-xs font-medium uppercase tracking-wider">Avg ATS Score</span>
          <span className="text-2xl font-bold text-foreground">{stats.average_ats_score || 0}%</span>
        </div>
        <div className="glass-card p-4 rounded-2xl flex flex-col gap-1">
          <span className="text-muted text-xs font-medium uppercase tracking-wider">Applications Sent</span>
          <span className="text-2xl font-bold text-foreground">{stats.total_applications || 0}</span>
        </div>
        <div className="glass-card p-4 rounded-2xl flex flex-col gap-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 -mt-2 -mr-2">
            <div className="w-12 h-12 bg-green-500/20 blur-xl rounded-full" />
          </div>
          <span className="text-muted text-xs font-medium uppercase tracking-wider relative z-10">Success Rate</span>
          <span className="text-2xl font-bold text-green-400 relative z-10">{stats.application_success_rate || 0}%</span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <AnalyticsCharts data={history} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-96">
            <GoalsWidget />
            <ActivityTimeline />
          </div>
        </div>

        {/* Right Column (1/3 width) */}
        <div className="flex flex-col gap-6">
          <div className="flex-none">
            <CareerProgressWidget 
              score={stats.average_resume_score || 0} 
              level={(stats.average_resume_score || 0) >= 80 ? "Advanced" : (stats.average_resume_score || 0) >= 50 ? "Intermediate" : "Beginner"} 
            />
          </div>
          
          <div className="flex-1 min-h-[300px]">
            <WeeklyInsights />
          </div>
        </div>

      </div>
    </div>
  );
}

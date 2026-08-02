import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Trophy, TrendingUp, Save } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';

export default function QuickStats() {
  const [data, setData] = useState({
    total_uploaded_resumes: 0,
    highest_score: 0,
    ats_score: 0,
    saved_drafts: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await dashboardService.getDashboard();
        setData({
          total_uploaded_resumes: result.total_uploaded_resumes || 0,
          highest_score: result.highest_score || 0,
          ats_score: result.latest_analysis?.ats_score || 0,
          saved_drafts: result.saved_drafts || 0
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: "Total Analyses", value: data.total_uploaded_resumes, icon: FileText, color: "text-accent-blue" },
    { label: "Highest Score", value: data.highest_score, icon: Trophy, color: "text-yellow-400" },
    { label: "Current ATS", value: data.ats_score, icon: TrendingUp, color: "text-green-400" },
    { label: "Saved Drafts", value: data.saved_drafts, icon: Save, color: "text-accent-purple" },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 p-3">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-overlay border border-border rounded-xl p-3 flex flex-col hover:bg-overlay-hover transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <Icon size={14} className={stat.color} />
              <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
            </div>
            <span className="text-[10px] text-muted font-medium tracking-wide uppercase">{stat.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

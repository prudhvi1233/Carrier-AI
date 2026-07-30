import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, BrainCircuit, Download, Edit3, Briefcase, User, Activity, Loader2 } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { useGlobalState } from '../context/GlobalStateContext';

const getRelativeTime = (dateString) => {
  // Append 'Z' to treat backend naive timestamps as UTC
  const safeDateString = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
  const date = new Date(safeDateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
};

const getIconForActivity = (type) => {
  switch (type) {
    case 'resume': return { icon: Upload, color: 'text-accent-blue', bg: 'bg-accent-blue/10' };
    case 'analysis': return { icon: BrainCircuit, color: 'text-accent-purple', bg: 'bg-accent-purple/10' };
    case 'job': return { icon: Briefcase, color: 'text-green-400', bg: 'bg-green-400/10' };
    case 'general': return { icon: User, color: 'text-orange-400', bg: 'bg-orange-400/10' };
    default: return { icon: Activity, color: 'text-gray-400', bg: 'bg-gray-400/10' };
  }
};

export default function ActivityTimeline() {
  const { refreshTrigger } = useGlobalState();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await dashboardService.getTimeline();
        setActivities(data.slice(0, 5)); // Just take top 5 for the timeline
      } catch (err) {
        console.error('Failed to fetch timeline:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [refreshTrigger]);

  if (loading) {
     return (
       <div className="glass-card p-6 h-full flex items-center justify-center">
         <Loader2 className="animate-spin text-accent-blue" size={24} />
       </div>
     );
  }

  if (activities.length === 0) {
     return (
       <div className="glass-card p-6 h-full flex items-center justify-center">
         <p className="text-gray-400 text-sm">No recent activity.</p>
       </div>
     );
  }

  return (
    <div className="glass-card p-6 h-full">
      <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
      
      <div className="relative border-l border-white/10 ml-4 space-y-8">
        {activities.map((activity, idx) => {
          const { icon: Icon, color, bg } = getIconForActivity(activity.activity_type);
          return (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="relative pl-6"
            >
              <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full ${bg} flex items-center justify-center border border-white/10 shadow-lg backdrop-blur-md`}>
                <Icon size={14} className={color} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{getRelativeTime(activity.timestamp)}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

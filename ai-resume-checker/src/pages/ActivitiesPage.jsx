import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText, CheckCircle, Briefcase, Zap } from 'lucide-react';
import { activityService } from '../services/careerServices';
import { useGlobalState } from '../context/GlobalStateContext';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshTrigger } = useGlobalState();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await activityService.getTimeline();
        if (data && data.length > 0) {
          setActivities(data);
        } else {
          setActivities([]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [refreshTrigger]);

  const getIcon = (type) => {
    switch(type) {
      case 'resume': return <FileText size={16} className="text-accent-blue" />;
      case 'interview': return <Zap size={16} className="text-yellow-500" />;
      case 'job': return <Briefcase size={16} className="text-accent-purple" />;
      default: return <CheckCircle size={16} className="text-green-500" />;
    }
  };

  const formatDate = (dateString) => {
    const validDateString = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
    const d = new Date(validDateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto flex flex-col gap-8 pb-12"
    >
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
          <Clock className="text-accent-blue" size={32} />
          All Activity Timelines
        </h1>
        <p className="text-muted text-lg">
          View your complete history of platform interactions and milestones.
        </p>
      </div>

      <div className="glass-card p-6 md:p-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-20">
            <Clock size={48} className="mx-auto text-muted mb-4 opacity-50" />
            <p className="text-muted text-lg">No activities found.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-[19px] top-4 bottom-4 w-px bg-border" />
            <div className="flex flex-col gap-8">
              {activities.map(activity => (
                <motion.div 
                  key={activity.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-6 relative z-10 group"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary border border-border shadow-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 group-hover:border-accent-blue/50 transition-all">
                    {getIcon(activity.type)}
                  </div>
                  <div className="flex flex-col flex-1 bg-overlay p-4 rounded-xl border border-border group-hover:border-accent-blue/20 transition-colors">
                    <p className="text-foreground font-medium">{activity.description}</p>
                    <span className="text-xs text-muted mt-2">{formatDate(activity.timestamp)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

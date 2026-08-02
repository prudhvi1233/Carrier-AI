import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, FileText, CheckCircle, Briefcase, Zap } from 'lucide-react';
import { activityService } from '../../services/careerServices';

export default function ActivityTimeline() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await activityService.getTimeline();
      if (data && data.length > 0) {
        setActivities(data);
      } else {
        setActivities([]);
      }
      } catch (e) {
        console.error(e);
      }
    };
    fetchActivities();
  }, []);

  const getIcon = (type) => {
    switch(type) {
      case 'resume': return <FileText size={14} className="text-accent-blue" />;
      case 'interview': return <Zap size={14} className="text-yellow-500" />;
      case 'job': return <Briefcase size={14} className="text-accent-purple" />;
      default: return <CheckCircle size={14} className="text-green-500" />;
    }
  };

  const formatDate = (dateString) => {
    // Append 'Z' to treat backend naive timestamps as UTC if not already present
    const validDateString = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
    const d = new Date(validDateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col bg-gradient-to-br from-slate-500/5 to-transparent">
      <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
        <Clock className="text-muted" size={20} /> Activity Timeline
      </h3>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative">
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-overlay-hover" />
        
        <div className="flex flex-col gap-6">
          {activities.slice(0, 5).map(activity => (
            <div key={activity.id} className="flex gap-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-secondary border-2 border-border flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(activity.type)}
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-gray-200">{activity.description}</p>
                <span className="text-[10px] text-gray-500 mt-1">{formatDate(activity.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {activities.length > 5 && (
        <div className="mt-4 pt-4 border-t border-border flex justify-center">
          <Link 
            to="/activities"
            className="text-sm font-medium text-accent-blue hover:text-blue-400 transition-colors"
          >
            View All Timelines
          </Link>
        </div>
      )}
    </div>
  );
}

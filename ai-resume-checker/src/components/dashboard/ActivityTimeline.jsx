import React, { useState, useEffect } from 'react';
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
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <Clock className="text-gray-400" size={20} /> Activity Timeline
      </h3>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative">
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/10" />
        
        <div className="flex flex-col gap-6">
          {activities.map(activity => (
            <div key={activity.id} className="flex gap-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-secondary border-2 border-white/10 flex items-center justify-center shrink-0 mt-0.5">
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
    </div>
  );
}

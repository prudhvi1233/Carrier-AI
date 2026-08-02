import React from 'react';
import { Briefcase, Users, CheckCircle, Target, TrendingUp } from 'lucide-react';

export default function TrackerStats({ applications }) {
  const total = applications.length;
  const interviews = applications.filter(a => ['INTERVIEW', 'ASSESSMENT'].includes(a.status)).length;
  const offers = applications.filter(a => a.status === 'OFFER').length;
  const rejected = applications.filter(a => a.status === 'REJECTED').length;
  
  const successRate = total > 0 ? Math.round((offers / total) * 100) : 0;
  const responseRate = total > 0 ? Math.round(((total - applications.filter(a => a.status === 'APPLIED' || a.status === 'WISHLIST').length) / total) * 100) : 0;

  const stats = [
    { label: 'Total Applications', value: total, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Active Interviews', value: interviews, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Offers Received', value: offers, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Response Rate', value: `${responseRate}%`, icon: Target, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: 'Success Rate', value: `${successRate}%`, icon: TrendingUp, color: 'text-accent-blue', bg: 'bg-accent-blue/10' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="glass-card p-4 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted">{stat.label}</span>
            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

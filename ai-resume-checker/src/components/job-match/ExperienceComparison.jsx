import React from 'react';
import { Briefcase, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExperienceComparison({ experience }) {
  const metrics = [
    { label: "Years of Experience", data: experience.years_of_experience, suffix: "Yrs" },
    { label: "Projects Matching", data: experience.projects, suffix: "Prj" },
    { label: "Required Technologies", data: experience.technologies, suffix: "Tech" },
    { label: "Leadership Roles", data: experience.leadership, suffix: "Roles" }
  ];

  return (
    <div className="bg-secondary/40 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <TrendingUp className="text-accent-blue" size={24} />
        Experience Match
      </h3>
      
      <div className="space-y-6">
        {metrics.map((metric, i) => (
          <div key={metric.label}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted font-medium">{metric.label}</span>
              <span className="text-muted">
                {metric.data.actual} / {metric.data.required} {metric.suffix}
              </span>
            </div>
            <div className="h-2 w-full bg-overlay rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(metric.data.progress, 100)}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className={`h-full rounded-full ${
                  metric.data.progress >= 100 ? 'bg-green-400 glow-green' : 
                  metric.data.progress >= 70 ? 'bg-yellow-400 glow-yellow' : 'bg-red-400 glow-red'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

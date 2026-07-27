import React, { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

export default function FilterPanel() {
  const [salary, setSalary] = useState(100);

  const filterSections = [
    {
      title: 'Experience',
      options: ['Fresher', 'Internship', '1-3 Years', '3-5 Years', 'Senior']
    },
    {
      title: 'Job Type',
      options: ['Full-time', 'Contract', 'Hybrid', 'Remote', 'On-site']
    },
    {
      title: 'Company Size',
      options: ['Startup', 'Mid-size', 'Enterprise']
    }
  ];

  return (
    <div className="glass-card p-5 h-full">
      <div className="flex items-center gap-2 mb-6">
        <Filter size={20} className="text-accent-blue" />
        <h2 className="text-lg font-bold text-white">AI Filters</h2>
      </div>

      <div className="space-y-6">
        {filterSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">{section.title}</h3>
            <div className="flex flex-col gap-2">
              {section.options.map((option) => (
                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded border border-white/20 bg-black/20 group-hover:border-accent-blue transition-colors flex items-center justify-center">
                    {/* Add checkmark conditionally later */}
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Salary Range</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">$50k</span>
            <span className="text-sm font-bold text-accent-blue">${salary}k+</span>
          </div>
          <input 
            type="range" 
            min="50" 
            max="250" 
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-blue"
          />
        </div>
      </div>
    </div>
  );
}

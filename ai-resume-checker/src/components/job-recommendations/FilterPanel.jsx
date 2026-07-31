import React from 'react';
import { Filter, ChevronDown, Check } from 'lucide-react';

export default function FilterPanel({
  searchQuery, setSearchQuery,
  experienceFilters = [], setExperienceFilters,
  jobTypeFilters = [], setJobTypeFilters,
  companySizeFilters = [], setCompanySizeFilters,
  minSalary = 3, setMinSalary
}) {

  const filterSections = [
    {
      title: 'Experience',
      options: ['Fresher', 'Internship', '1-3 Years', '3-5 Years', 'Senior'],
      selected: experienceFilters,
      setter: setExperienceFilters
    },
    {
      title: 'Job Type',
      options: ['Full-time', 'Contract', 'Hybrid', 'Remote', 'On-site'],
      selected: jobTypeFilters,
      setter: setJobTypeFilters
    },
    {
      title: 'Company Size',
      options: ['Startup', 'Mid-size', 'Enterprise'],
      selected: companySizeFilters,
      setter: setCompanySizeFilters
    }
  ];

  const handleToggle = (option, selected, setter) => {
    if (selected.includes(option)) {
      setter(selected.filter(item => item !== option));
    } else {
      setter([...selected, option]);
    }
  };

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
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${section.selected.includes(option) ? 'bg-accent-blue border-accent-blue' : 'border-white/20 bg-black/20 group-hover:border-accent-blue'}`}>
                    {section.selected.includes(option) && <Check size={12} className="text-white" />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={section.selected.includes(option)}
                    onChange={() => handleToggle(option, section.selected, section.setter)}
                  />
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Min Salary (INR)</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">₹3L</span>
            <span className="text-sm font-bold text-accent-blue">₹{minSalary}L+</span>
          </div>
          <input 
            type="range" 
            min="3" 
            max="50" 
            value={minSalary}
            onChange={(e) => setMinSalary(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-blue"
          />
        </div>
      </div>
    </div>
  );
}

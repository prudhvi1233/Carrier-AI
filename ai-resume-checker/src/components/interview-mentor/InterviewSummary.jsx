import React from 'react';
import { Download, Share2, RotateCcw, CheckCircle, AlertTriangle, BookOpen, Target } from 'lucide-react';
import SkillRadar from './SkillRadar';
import PerformanceChart from './PerformanceChart';

export default function InterviewSummary({ report, onRetake }) {
  
  return (
    <div className="glass-card p-6 md:p-8 space-y-8 h-full overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Interview Performance Report</h2>
          <p className="text-gray-400">Detailed AI analysis of your mock interview session.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-colors">
            <Share2 size={16} /> Share
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
            <Download size={16} /> PDF Report
          </button>
        </div>
      </div>

      {/* Main Score & Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="md:col-span-1 bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 border border-accent-blue/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Overall Score</h3>
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="60" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
              <circle cx="64" cy="64" r="60" stroke="#3b82f6" strokeWidth="8" fill="none" strokeDasharray="377" strokeDashoffset={377 - (377 * report.overallScore) / 100} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
            </svg>
            <span className="text-4xl font-black text-white">{report.overallScore}</span>
          </div>
          <p className="text-accent-blue font-medium">Excellent Performance</p>
        </div>

        <div className="md:col-span-1 bg-black/40 border border-white/10 rounded-2xl p-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">Skill Breakdown</h3>
          <SkillRadar data={report.skillRadar} />
        </div>

        <div className="md:col-span-1 bg-black/40 border border-white/10 rounded-2xl p-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">Question Trend</h3>
          <PerformanceChart data={report.performanceTrend} />
        </div>

      </div>

      {/* Detailed Analysis Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="space-y-4">
          <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-green-400 flex items-center gap-2 mb-4">
              <CheckCircle size={20} /> Key Strengths
            </h3>
            <ul className="space-y-3">
              {report.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0"></span>
                  {str}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-orange-400 flex items-center gap-2 mb-4">
              <AlertTriangle size={20} /> Areas to Improve
            </h3>
            <ul className="space-y-3">
              {report.weaknesses.map((wk, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0"></span>
                  {wk}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 h-full">
            <h3 className="text-lg font-bold text-accent-blue flex items-center gap-2 mb-4">
              <BookOpen size={20} /> Recommended Action Plan
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Topics to Study</h4>
                <div className="flex flex-wrap gap-2">
                  {report.recommendedLearning.map((topic, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-300 text-xs border border-blue-500/20">{topic}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Interview Tips</h4>
                <ul className="space-y-2">
                  {report.interviewTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                      <Target size={14} className="text-accent-blue mt-0.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="flex justify-center pt-4 border-t border-white/10">
        <button 
          onClick={onRetake}
          className="flex items-center gap-2 px-8 py-3 bg-accent-blue hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-accent-blue/20"
        >
          <RotateCcw size={18} /> Start New Interview
        </button>
      </div>

    </div>
  );
}

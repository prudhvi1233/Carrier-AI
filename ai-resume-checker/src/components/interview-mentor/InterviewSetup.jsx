import React, { useState } from 'react';
import { Play, Settings2, Code, Users, Briefcase, Target, Monitor, Languages, Clock } from 'lucide-react';
import EmptyState from './EmptyState';

export default function InterviewSetup({ onStart }) {
  const [config, setConfig] = useState({
    role: 'Frontend Developer',
    difficulty: 'Intermediate',
    type: 'Behavioral',
    duration: '10 Minutes',
    language: 'English',
    mode: 'Voice Simulator',
    persona: 'Professional Female HR'
  });

  const roles = [
    'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'AI Engineer', 
    'Machine Learning Engineer', 'Data Analyst', 'Software Engineer', 'DevOps Engineer', 
    'Cyber Security', 'UI/UX Designer', 'Mobile Developer', 'Cloud Engineer'
  ];

  const types = ['Technical', 'HR', 'Behavioral', 'System Design', 'Coding', 'Mixed'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const durations = ['5 Questions', '10 Questions', '15 Questions', 'Unlimited'];
  const languages = ['English'];
  const modes = ['Voice Simulator', 'Typing'];
  const personas = ['Professional Female HR', 'Professional Male HR', 'Technical Software Engineer (Male)', 'Technical Software Engineer (Female)'];

  const handleStart = () => {
    onStart(config);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <EmptyState onStartClick={() => {}} />
      
      <div className="glass-card p-6 md:p-8 relative overflow-hidden flex-1">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-accent-blue/20 rounded-xl">
            <Settings2 className="text-accent-blue" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Interview Configuration</h2>
            <p className="text-gray-400 text-sm">Tailor the AI mentor to your specific needs.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Briefcase size={16} /> Target Role
            </label>
            <select 
              value={config.role} 
              onChange={e => setConfig({...config, role: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-blue/50 outline-none appearance-none"
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
              <option value="custom">Custom Role...</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Target size={16} /> Difficulty
            </label>
            <select 
              value={config.difficulty} 
              onChange={e => setConfig({...config, difficulty: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-blue/50 outline-none appearance-none"
            >
              {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Code size={16} /> Interview Type
            </label>
            <select 
              value={config.type} 
              onChange={e => setConfig({...config, type: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-blue/50 outline-none appearance-none"
            >
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Clock size={16} /> Duration
            </label>
            <select 
              value={config.duration} 
              onChange={e => setConfig({...config, duration: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-blue/50 outline-none appearance-none"
            >
              {durations.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Users size={16} /> Interviewer Persona
            </label>
            <select 
              value={config.persona} 
              onChange={e => setConfig({...config, persona: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-blue/50 outline-none appearance-none"
            >
              {personas.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Monitor size={16} /> Communication Mode
            </label>
            <div className="flex gap-2 bg-black/40 p-1 rounded-xl border border-white/10">
              {modes.map(mode => (
                <button
                  key={mode}
                  onClick={() => setConfig({...config, mode})}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${config.mode === mode ? 'bg-accent-blue/20 text-accent-blue shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex justify-end">
          <button 
            onClick={handleStart}
            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-accent-blue to-accent-purple hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-accent-blue/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play size={20} className="fill-white" />
            Start AI Interview
          </button>
        </div>
      </div>
    </div>
  );
}

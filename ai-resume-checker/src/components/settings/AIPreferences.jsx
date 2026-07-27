import React, { useState } from 'react';
import { Bot, Zap, Globe, FileText } from 'lucide-react';

export default function AIPreferences({ data, onSave }) {
  const [settings, setSettings] = useState(data);

  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
    onSave('AI Preferences updated.');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white mb-2">AI Preferences</h2>
        <p className="text-gray-400 text-sm">Customize how the AI analyzes and scores your resumes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Model Selection */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Bot size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Preferred AI Model</h3>
              <p className="text-xs text-gray-400">Select the engine powering your analysis.</p>
            </div>
          </div>
          <div className="flex gap-2 p-1 bg-black/20 rounded-xl border border-white/10">
            <button
              onClick={() => updateSetting('model', 'gemini')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                settings.model === 'gemini' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Gemini
            </button>
            <button
              onClick={() => updateSetting('model', 'openai')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                settings.model === 'openai' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              OpenAI
            </button>
          </div>
        </div>

        {/* Analysis Depth */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Zap size={20} className="text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Analysis Depth</h3>
              <p className="text-xs text-gray-400">Balance between speed and detail.</p>
            </div>
          </div>
          <select
            value={settings.depth}
            onChange={(e) => updateSetting('depth', e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent-blue"
          >
            <option value="quick">Quick (1-2 mins)</option>
            <option value="standard">Standard (3-5 mins)</option>
            <option value="detailed">Detailed (Deep scan, 5+ mins)</option>
          </select>
        </div>

        {/* Language */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Globe size={20} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Target Language</h3>
              <p className="text-xs text-gray-400">Language for the generated feedback.</p>
            </div>
          </div>
          <select
            value={settings.language}
            onChange={(e) => updateSetting('language', e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent-blue"
          >
            <option value="english">English (US)</option>
            <option value="english_uk">English (UK)</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
            <option value="german">German</option>
          </select>
        </div>

        {/* Report Format */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <FileText size={20} className="text-rose-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Report Format</h3>
              <p className="text-xs text-gray-400">How you prefer to view results.</p>
            </div>
          </div>
          <div className="flex gap-2 p-1 bg-black/20 rounded-xl border border-white/10">
            <button
              onClick={() => updateSetting('format', 'visual')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                settings.format === 'visual' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Visual Dashboard
            </button>
            <button
              onClick={() => updateSetting('format', 'text')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                settings.format === 'text' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Text Document
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

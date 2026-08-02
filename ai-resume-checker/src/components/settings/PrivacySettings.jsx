import React, { useState } from 'react';
import { Eye, Shield, Clock } from 'lucide-react';

export default function PrivacySettings({ data, onSave }) {
  const [settings, setSettings] = useState(data);

  const toggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
    onSave('Privacy settings updated.');
  };

  const updateSelect = (key, value) => {
    setSettings({ ...settings, [key]: value });
    onSave('Privacy settings updated.');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-foreground mb-2">Privacy & Data</h2>
        <p className="text-muted text-sm">Control who sees your profile and how your data is used.</p>
      </div>

      <div className="glass-card p-6 md:p-8">
        <div className="flex flex-col gap-6">
          
          <div className="flex items-center justify-between gap-4 py-4 border-b border-border">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <Eye size={20} className="text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-foreground font-medium mb-1">Make Profile Private</span>
                <span className="text-sm text-muted">If enabled, your profile will not be visible to recruiters or public searches.</span>
              </div>
            </div>
            <label className="relative cursor-pointer shrink-0">
              <input type="checkbox" className="sr-only peer" checked={settings.isPrivate} onChange={() => toggle('isPrivate')} />
              <div className="w-11 h-6 bg-overlay-hover peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-blue"></div>
            </label>
          </div>

          <div className="flex items-center justify-between gap-4 py-4 border-b border-border">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                <Shield size={20} className="text-purple-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-foreground font-medium mb-1">Allow Anonymous Analytics</span>
                <span className="text-sm text-muted">Help us improve our AI models by allowing us to use your anonymized resume data.</span>
              </div>
            </div>
            <label className="relative cursor-pointer shrink-0">
              <input type="checkbox" className="sr-only peer" checked={settings.allowAnalytics} onChange={() => toggle('allowAnalytics')} />
              <div className="w-11 h-6 bg-overlay-hover peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-purple"></div>
            </label>
          </div>

          <div className="flex items-center justify-between gap-4 py-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                <Clock size={20} className="text-yellow-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-foreground font-medium mb-1">Auto-delete Resumes</span>
                <span className="text-sm text-muted">Automatically delete your uploaded resumes and their analyses after a certain period.</span>
              </div>
            </div>
            <select
              value={settings.autoDelete}
              onChange={(e) => updateSelect('autoDelete', e.target.value)}
              className="bg-overlay border border-border rounded-xl px-4 py-2 text-foreground text-sm focus:outline-none focus:border-accent-blue cursor-pointer min-w-[120px]"
            >
              <option value="30days">After 30 days</option>
              <option value="90days">After 90 days</option>
              <option value="never">Never</option>
            </select>
          </div>

        </div>
      </div>

      <div className="glass-card p-6 border-blue-500/20 bg-blue-500/5">
        <h4 className="text-blue-400 font-bold mb-2">Your Privacy is our Priority</h4>
        <p className="text-muted text-sm leading-relaxed">
          We take your privacy seriously. We never sell your personal data to third parties. If you choose to allow anonymous analytics, we ensure all personally identifiable information (PII) is stripped from your documents before processing. For more details, read our full <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>.
        </p>
      </div>

    </div>
  );
}

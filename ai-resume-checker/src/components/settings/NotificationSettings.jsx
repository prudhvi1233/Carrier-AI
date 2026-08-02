import React, { useState } from 'react';
import { Bell, Mail, Smartphone, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function NotificationSettings({ data, onSave }) {
  const [settings, setSettings] = useState(data);

  const toggle = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    onSave('Notification preferences updated.');
  };

  const sections = [
    {
      title: "Email Notifications",
      description: "Manage what emails you receive from us.",
      icon: <Mail className="text-blue-400" size={24} />,
      bg: "bg-blue-500/10",
      items: [
        { key: 'analysisComplete', label: 'Resume Analysis Completed', desc: 'Get notified when your AI analysis is ready.' },
        { key: 'weeklyTips', label: 'Weekly AI Tips', desc: 'Receive weekly tips on improving your resume for ATS.' },
        { key: 'productUpdates', label: 'Product Updates', desc: 'News about major feature releases and platform updates.' },
        { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Promotions, surveys, and special offers.' }
      ]
    },
    {
      title: "Security Alerts",
      description: "Critical alerts regarding your account security.",
      icon: <ShieldCheck className="text-red-400" size={24} />,
      bg: "bg-red-500/10",
      items: [
        { key: 'securityAlerts', label: 'Unrecognized Logins', desc: 'Alerts when your account is accessed from a new device.' }
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-foreground mb-2">Notification Preferences</h2>
        <p className="text-muted text-sm">Choose how and when we communicate with you.</p>
      </div>

      {sections.map((section, idx) => (
        <div key={idx} className="glass-card p-6 md:p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${section.bg}`}>
              {section.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{section.title}</h3>
              <p className="text-muted text-sm mt-1">{section.description}</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {section.items.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-4 py-4 border-b border-border last:border-0 last:pb-0">
                <div className="flex flex-col">
                  <span className="text-foreground font-medium mb-1">{item.label}</span>
                  <span className="text-sm text-muted">{item.desc}</span>
                </div>
                <label className="relative cursor-pointer shrink-0">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings[item.key]}
                    onChange={() => toggle(item.key)}
                  />
                  <div className="w-11 h-6 bg-overlay-hover peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-purple"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

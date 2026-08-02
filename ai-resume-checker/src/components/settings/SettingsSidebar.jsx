import React from 'react';
import { User, Shield, Bell, Palette, Eye, Bot, Link, Database, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const TABS = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'privacy', label: 'Privacy', icon: Eye },
  { id: 'ai', label: 'AI Preferences', icon: Bot },
  { id: 'connections', label: 'Connected Accounts', icon: Link },
  { id: 'data', label: 'Data Management', icon: Database },
  { id: 'activity', label: 'Activity Log', icon: Activity },
];

export default function SettingsSidebar({ activeTab, setActiveTab }) {
  return (
    <div className="flex flex-col gap-2 w-full md:w-64 shrink-0 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative whitespace-nowrap md:whitespace-normal group ${
              isActive ? 'text-foreground' : 'text-muted hover:text-foreground hover:bg-overlay'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-overlay-hover rounded-xl border border-border"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <Icon size={18} className={`relative z-10 ${isActive ? 'text-accent-blue' : 'group-hover:text-muted'}`} />
            <span className="relative z-10 font-medium text-sm">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

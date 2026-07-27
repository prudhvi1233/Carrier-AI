import React, { useState, useEffect } from 'react';
import { Settings, Moon, Globe, Bell, Lock, Download, Trash2, CheckCircle, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { settingsService } from '../services/careerServices';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('preferences');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        setSettings(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsService.updateSettings(settings);
      toast.success("Settings updated successfully");
    } catch (e) {
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Privacy', icon: Lock },
    { id: 'data', label: 'Data & Export', icon: Download }
  ];

  if (loading) return <div className="p-8 text-center text-gray-400">Loading settings...</div>;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-6 md:p-8 shrink-0 border-b border-white/5 bg-black/20 backdrop-blur-xl z-10">
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">
          Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple">Settings</span>
        </h1>
        <p className="text-gray-400">Manage your preferences, notifications, and account security.</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-accent-blue/20 to-transparent text-accent-blue border border-accent-blue/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 glass-card p-6 md:p-8 min-h-[500px]">
            {activeTab === 'preferences' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Appearance</h3>
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-black/40 rounded-lg text-accent-purple"><Moon size={20} /></div>
                      <div>
                        <h4 className="font-semibold text-white">Dark Mode</h4>
                        <p className="text-sm text-gray-400">The platform currently uses Dark Mode exclusively.</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-accent-blue rounded-full relative cursor-not-allowed opacity-80">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Language</h3>
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-black/40 rounded-lg text-accent-blue"><Globe size={20} /></div>
                      <div>
                        <h4 className="font-semibold text-white">Interface Language</h4>
                        <p className="text-sm text-gray-400">Select your preferred language.</p>
                      </div>
                    </div>
                    <select className="bg-black/40 border border-white/10 text-white rounded-lg px-4 py-2 outline-none">
                      <option value="en">English (US)</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    {['Email Alerts', 'Interview Reminders', 'Marketing Emails'].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div>
                            <h4 className="font-semibold text-white">{item}</h4>
                          </div>
                        </div>
                        <div className={`w-12 h-6 rounded-full relative cursor-pointer ${i === 2 ? 'bg-white/10' : 'bg-accent-blue'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${i === 2 ? 'left-1' : 'right-1'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <input type="password" placeholder="Current Password" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue" />
                    <input type="password" placeholder="New Password" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue" />
                    <input type="password" placeholder="Confirm New Password" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue" />
                    <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium">Update Password</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'data' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Export Data</h3>
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl mb-8">
                    <div>
                      <h4 className="font-semibold text-white">Download all my data</h4>
                      <p className="text-sm text-gray-400">Get a copy of your resumes, applications, and analytics in JSON format.</p>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-accent-blue to-accent-purple text-white rounded-xl font-medium flex items-center gap-2">
                      <Download size={16} /> Export Data
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-red-500 mb-4">Danger Zone</h3>
                  <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-white">Delete Account</h4>
                      <p className="text-sm text-gray-400">Permanently delete your account and all data. This cannot be undone.</p>
                    </div>
                    <button className="px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-medium flex items-center gap-2 transition-colors">
                      <Trash2 size={16} /> Delete Account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-accent-blue to-accent-purple hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-accent-blue/20 disabled:opacity-50"
              >
                {saving ? <CheckCircle size={18} className="animate-pulse" /> : <Save size={18} />}
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

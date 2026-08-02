import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Save, Smartphone, LogOut } from 'lucide-react';

export default function SecuritySettings({ onSave }) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const calculateStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length > 8) score += 25;
    if (pass.match(/[A-Z]/)) score += 25;
    if (pass.match(/[0-9]/)) score += 25;
    if (pass.match(/[^A-Za-z0-9]/)) score += 25;
    return score;
  };

  const strength = calculateStrength(passwords.new);
  const strengthColor = strength === 100 ? 'bg-green-500' : strength > 50 ? 'bg-yellow-500' : 'bg-red-500';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      onSave('Passwords do not match.', 'error');
      return;
    }
    if (strength < 75) {
      onSave('Please choose a stronger password.', 'error');
      return;
    }
    onSave('Password updated successfully!');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Change Password Card */}
      <div className="glass-card p-6 md:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Change Password</h2>
          <p className="text-muted text-sm">Ensure your account is using a long, random password to stay secure.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl">
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted">Current Password</label>
            <div className="relative">
              <input 
                type={showCurrent ? "text" : "password"}
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                className="w-full bg-overlay border border-border rounded-xl pl-4 pr-12 py-3 text-foreground focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted">New Password</label>
            <div className="relative">
              <input 
                type={showNew ? "text" : "password"}
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                className="w-full bg-overlay border border-border rounded-xl pl-4 pr-12 py-3 text-foreground focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Strength Meter */}
            {passwords.new && (
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex gap-1 h-1.5 w-full">
                  <div className={`flex-1 rounded-full ${strength >= 25 ? strengthColor : 'bg-overlay-hover'}`} />
                  <div className={`flex-1 rounded-full ${strength >= 50 ? strengthColor : 'bg-overlay-hover'}`} />
                  <div className={`flex-1 rounded-full ${strength >= 75 ? strengthColor : 'bg-overlay-hover'}`} />
                  <div className={`flex-1 rounded-full ${strength >= 100 ? strengthColor : 'bg-overlay-hover'}`} />
                </div>
                <span className="text-xs text-muted text-right">
                  {strength === 100 ? 'Strong' : strength >= 50 ? 'Medium' : 'Weak'}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted">Confirm New Password</label>
            <input 
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              className="w-full bg-overlay border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors"
              required
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-overlay-hover hover:bg-white/15 text-foreground font-medium border border-border transition-colors"
            >
              <Save size={18} />
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Two-Factor & Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
              <Smartphone size={24} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Two-Factor Authentication</h3>
            <p className="text-muted text-sm mb-6">Add an extra layer of security to your account by requiring a code from your mobile device.</p>
          </div>
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="font-medium text-foreground group-hover:text-gray-200 transition-colors">Enable 2FA</span>
            <div className="relative">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-overlay-hover peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-blue"></div>
            </div>
          </label>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between border-red-500/20">
          <div>
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
              <Shield size={24} className="text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Active Sessions</h3>
            <p className="text-muted text-sm mb-6">If you notice suspicious activity, you can securely log out of all other devices.</p>
          </div>
          <button 
            onClick={() => onSave('Logged out of all other devices.', 'success')}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium border border-red-500/20 transition-colors w-full"
          >
            <LogOut size={18} />
            Logout All Devices
          </button>
        </div>

      </div>

    </div>
  );
}

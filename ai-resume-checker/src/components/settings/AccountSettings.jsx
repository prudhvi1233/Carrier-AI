import React, { useState } from 'react';
import { Camera, Save, RotateCcw } from 'lucide-react';

export default function AccountSettings({ data, onSave }) {
  const [formData, setFormData] = useState(data);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave('Account updated successfully!');
  };

  return (
    <div className="glass-card p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Account Details</h2>
        <p className="text-muted text-sm">Update your personal information and public profile.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        
        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 border-2 border-border flex items-center justify-center overflow-hidden">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl text-foreground font-bold">{formData.fullName.charAt(0)}</span>
              )}
            </div>
            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={24} className="text-foreground" />
            </div>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">Profile Picture</h3>
            <p className="text-sm text-muted mb-3">JPG, GIF or PNG. Max size of 800K</p>
            <button type="button" className="px-4 py-2 bg-overlay hover:bg-overlay-hover text-foreground rounded-lg text-sm border border-border transition-colors">
              Upload New
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted">Full Name</label>
            <input 
              type="text" name="fullName" value={formData.fullName} onChange={handleChange}
              className="bg-overlay border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted">Email Address</label>
            <input 
              type="email" name="email" value={formData.email} onChange={handleChange}
              className="bg-overlay border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted">Phone Number</label>
            <input 
              type="tel" name="phone" value={formData.phone} onChange={handleChange}
              className="bg-overlay border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted">Location</label>
            <input 
              type="text" name="location" value={formData.location} onChange={handleChange}
              className="bg-overlay border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted">Job Title</label>
            <input 
              type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange}
              className="bg-overlay border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted">Company</label>
            <input 
              type="text" name="company" value={formData.company} onChange={handleChange}
              className="bg-overlay border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted">Bio</label>
          <textarea 
            name="bio" value={formData.bio} onChange={handleChange} rows={4}
            className="bg-overlay border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors resize-none"
          />
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <button 
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-foreground font-medium shadow-lg shadow-accent-blue/20 hover:shadow-accent-blue/40 transition-all hover:-translate-y-0.5"
          >
            <Save size={18} />
            Save Changes
          </button>
          <button 
            type="button"
            onClick={() => setFormData(data)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-overlay hover:bg-overlay-hover text-foreground font-medium border border-border transition-colors"
          >
            <RotateCcw size={18} />
            Reset
          </button>
        </div>

      </form>
    </div>
  );
}

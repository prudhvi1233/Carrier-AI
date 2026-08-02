import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Building2, Briefcase, MapPin, DollarSign, Calendar, Save } from 'lucide-react';

export default function ApplicationModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    salary: '',
    appliedDate: '',
    status: 'APPLIED',
    companyLogo: `https://api.dicebear.com/7.x/initials/svg?seed=${Math.random().toString(36).substring(7)}&backgroundColor=3b82f6`
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-secondary rounded-2xl border border-border shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-border flex items-center justify-between bg-overlay">
          <h2 className="text-xl font-bold text-foreground">Add New Application</h2>
          <button onClick={onClose} className="p-2 bg-overlay hover:bg-overlay-hover rounded-xl transition-colors text-muted hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Company Name</label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input required type="text" name="company" value={formData.company} onChange={handleChange} className="w-full bg-overlay border border-border rounded-xl pl-9 pr-3 py-2 text-foreground focus:border-accent-blue/50 outline-none" placeholder="e.g. Google" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Role</label>
              <div className="relative">
                <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input required type="text" name="role" value={formData.role} onChange={handleChange} className="w-full bg-overlay border border-border rounded-xl pl-9 pr-3 py-2 text-foreground focus:border-accent-blue/50 outline-none" placeholder="e.g. Frontend Eng" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Location</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-overlay border border-border rounded-xl pl-9 pr-3 py-2 text-foreground focus:border-accent-blue/50 outline-none" placeholder="Remote, NY..." />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Expected Salary</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" name="salary" value={formData.salary} onChange={handleChange} className="w-full bg-overlay border border-border rounded-xl pl-9 pr-3 py-2 text-foreground focus:border-accent-blue/50 outline-none" placeholder="$120k" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Date Applied</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="date" name="appliedDate" value={formData.appliedDate} onChange={handleChange} className="w-full bg-overlay border border-border rounded-xl pl-9 pr-3 py-2 text-foreground focus:border-accent-blue/50 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-overlay border border-border rounded-xl px-3 py-2.5 text-foreground focus:border-accent-blue/50 outline-none appearance-none">
                <option value="WISHLIST">Wishlist</option>
                <option value="APPLIED">Applied</option>
                <option value="ASSESSMENT">Assessment</option>
                <option value="INTERVIEW">Interview</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 text-muted hover:text-foreground transition-colors">Cancel</button>
            <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-accent-blue hover:bg-blue-500 text-foreground font-bold rounded-xl transition-all shadow-lg shadow-accent-blue/20">
              <Save size={16} /> Save Application
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

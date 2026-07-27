import React from 'react';
import { Download, Trash2, AlertOctagon } from 'lucide-react';

export default function DataManagement({ onSave, onDeleteAccount }) {
  const handleExport = () => {
    onSave('Your data archive is being generated. We will email you when it is ready.');
  };

  const handleDeleteHistory = () => {
    if (window.confirm('Are you sure you want to delete all your resume analysis history? This cannot be undone.')) {
      onSave('Resume history deleted successfully.', 'success');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white mb-2">Data Management</h2>
        <p className="text-gray-400 text-sm">Download your data or permanently delete information from our servers.</p>
      </div>

      <div className="glass-card p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Export Data Archive</h3>
          <p className="text-gray-400 text-sm">Download a ZIP file containing all your uploaded resumes, analyses in JSON format, and profile data.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-blue/10 hover:bg-accent-blue/20 text-accent-blue font-medium border border-accent-blue/20 transition-colors shrink-0 w-full sm:w-auto justify-center"
        >
          <Download size={18} />
          Request Export
        </button>
      </div>

      <div className="glass-card p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Clear Resume History</h3>
          <p className="text-gray-400 text-sm">Permanently delete all previously analyzed resumes and their reports. Your account remains active.</p>
        </div>
        <button 
          onClick={handleDeleteHistory}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors shrink-0 w-full sm:w-auto justify-center"
        >
          <Trash2 size={18} />
          Clear History
        </button>
      </div>

      <div className="glass-card p-6 md:p-8 border-red-500/20 bg-red-500/5 mt-4">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
            <AlertOctagon size={24} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-400 mb-1">Danger Zone: Delete Account</h3>
            <p className="text-gray-400 text-sm">
              Once you delete your account, there is no going back. Please be certain. All data will be permanently wiped from our servers immediately.
            </p>
          </div>
        </div>
        <button 
          onClick={onDeleteAccount}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium shadow-lg hover:shadow-red-500/25 transition-all w-full sm:w-auto"
        >
          <Trash2 size={18} />
          Permanently Delete Account
        </button>
      </div>
    </div>
  );
}

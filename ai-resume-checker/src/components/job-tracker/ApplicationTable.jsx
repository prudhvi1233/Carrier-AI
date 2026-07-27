import React from 'react';
import { MoreHorizontal, FileText, Calendar as CalendarIcon, ExternalLink, Trash2 } from 'lucide-react';
import StatusDropdown from './StatusDropdown';

export default function ApplicationTable({ data, updateData }) {
  
  const handleStatusChange = (id, newStatus) => {
    updateData(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
  };

  const handleDelete = (id) => {
    updateData(prev => prev.filter(app => app.id !== id));
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Company</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role & Location</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Applied</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Next Step</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">No applications found matching your criteria.</td>
              </tr>
            ) : (
              data.map((app) => (
                <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={app.companyLogo} alt={app.company} className="w-8 h-8 rounded-lg bg-white" />
                      <span className="font-bold text-white">{app.company}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-gray-200">{app.role}</p>
                    <p className="text-xs text-gray-500">{app.location}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-400">{app.appliedDate || '-'}</td>
                  <td className="p-4">
                    <StatusDropdown currentStatus={app.status} onChange={(newStatus) => handleStatusChange(app.id, newStatus)} />
                  </td>
                  <td className="p-4">
                    {app.interviewDate ? (
                      <div className="flex items-center gap-2 text-xs text-accent-blue bg-accent-blue/10 px-2 py-1 rounded-md border border-accent-blue/20 w-fit">
                        <CalendarIcon size={12} />
                        {new Date(app.interviewDate).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-600">-</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors" title="View Notes">
                        <FileText size={14} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors" title="Job Link">
                        <ExternalLink size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(app.id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

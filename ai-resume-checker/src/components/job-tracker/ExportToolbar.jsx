import React from 'react';
import { Download, FileText, Table } from 'lucide-react';

export default function ExportToolbar({ data }) {
  
  const handleExport = (format) => {
    // Mock export functionality
    console.log(`Exporting ${data.length} items to ${format}`);
    alert(`Exporting ${data.length} applications to ${format.toUpperCase()}...`);
  };

  return (
    <div className="flex items-center bg-overlay border border-border rounded-xl p-1">
      <button 
        onClick={() => handleExport('csv')}
        className="p-2 text-muted hover:text-foreground hover:bg-overlay-hover rounded-lg transition-colors flex items-center gap-1"
        title="Export CSV"
      >
        <Table size={16} />
        <span className="text-xs font-medium hidden sm:inline">CSV</span>
      </button>
      <button 
        onClick={() => handleExport('pdf')}
        className="p-2 text-muted hover:text-foreground hover:bg-overlay-hover rounded-lg transition-colors flex items-center gap-1"
        title="Export PDF"
      >
        <FileText size={16} />
        <span className="text-xs font-medium hidden sm:inline">PDF</span>
      </button>
    </div>
  );
}

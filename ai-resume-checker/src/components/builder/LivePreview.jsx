import React from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import ModernTech from './ResumeTemplates/ModernTech/ModernTech';
import ExecutiveStandard from './ResumeTemplates/ExecutiveStandard/ExecutiveStandard';
import CreativePortfolio from './ResumeTemplates/CreativePortfolio/CreativePortfolio';
import MinimalistClean from './ResumeTemplates/MinimalistClean/MinimalistClean';

export default function LivePreview({ template, formData }) {
  const getTemplateComponent = () => {
    switch(template) {
      case 'modern':
        return <ModernTech formData={formData} />;
      case 'professional':
        return <ExecutiveStandard formData={formData} />;
      case 'creative':
        return <CreativePortfolio formData={formData} />;
      case 'minimal':
        return <MinimalistClean formData={formData} />;
      default:
        return <ModernTech formData={formData} />;
    }
  };

  return (
    <div className="h-full bg-black/40 flex flex-col relative overflow-hidden">
      
      {/* Zoom Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <div className="glass-card flex p-1">
          <button className="p-2 text-gray-400 hover:text-white rounded hover:bg-white/10 transition-colors">
            <ZoomOut size={16} />
          </button>
          <div className="w-px bg-white/10 mx-1" />
          <button className="p-2 text-gray-400 hover:text-white rounded hover:bg-white/10 transition-colors">
            <ZoomIn size={16} />
          </button>
        </div>
        <button className="glass-card p-3 text-gray-400 hover:text-white rounded transition-colors">
          <Maximize2 size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8 flex items-start justify-center hide-scrollbar">
        {/* Paper Container */}
        <div className="w-full max-w-[800px] aspect-[1/1.414] bg-white shadow-2xl origin-top transition-transform duration-300" id="pdf-export-container">
          
          {/* Render Unique Template Component */}
          {getTemplateComponent()}

        </div>
      </div>
    </div>
  );
}

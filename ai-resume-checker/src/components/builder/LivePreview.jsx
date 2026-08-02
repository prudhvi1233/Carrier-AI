import React from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import ModernTech from './ResumeTemplates/ModernTech/ModernTech';
import ExecutiveStandard from './ResumeTemplates/ExecutiveStandard/ExecutiveStandard';
import CreativePortfolio from './ResumeTemplates/CreativePortfolio/CreativePortfolio';
import MinimalistClean from './ResumeTemplates/MinimalistClean/MinimalistClean';

export default function LivePreview({ template, formData }) {
  const [scale, setScale] = React.useState(1);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setScale(1);

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
          <button onClick={handleZoomOut} className="p-2 text-muted hover:text-foreground rounded hover:bg-overlay-hover transition-colors">
            <ZoomOut size={16} />
          </button>
          <div className="w-px bg-overlay-hover mx-1 flex items-center justify-center text-xs text-muted w-8">
            {Math.round(scale * 100)}%
          </div>
          <button onClick={handleZoomIn} className="p-2 text-muted hover:text-foreground rounded hover:bg-overlay-hover transition-colors">
            <ZoomIn size={16} />
          </button>
        </div>
        <button onClick={handleResetZoom} className="glass-card p-3 text-muted hover:text-foreground rounded transition-colors" title="Reset Zoom">
          <Maximize2 size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8 flex items-start justify-center hide-scrollbar">
        {/* Transform Wrapper */}
        <div 
            className="w-full max-w-[800px] aspect-[1/1.414] origin-top transition-transform duration-300 flex justify-center"
            style={{ transform: `scale(${scale})` }}
        >
          {/* Paper Container - Unscaled for perfect html2pdf capture */}
          <div className="w-full h-full bg-white shadow-2xl" id="pdf-export-container">
            {/* Render Unique Template Component */}
            {getTemplateComponent()}
          </div>
        </div>
      </div>
    </div>
  );
}

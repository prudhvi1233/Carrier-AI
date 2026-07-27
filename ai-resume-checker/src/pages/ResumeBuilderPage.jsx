import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import TemplateGallery from '../components/builder/TemplateGallery';
import RecentDrafts from '../components/builder/RecentDrafts';
import TemplatePreview from '../components/builder/TemplatePreview';
import { builderService } from '../services/builderService';

const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern Tech',
    description: 'Clean, two-column layout perfect for software engineers and tech professionals.',
    folderColor: 'blue',
    tags: ['Professional', 'ATS Friendly', 'Minimal'],
    thumbnail: '/images/templates/modern_tech.jpg',
    atsRating: '4.9',
    difficulty: 'Easy',
    recommendedFor: 'Software Engineers, Full Stack Developers, Data Scientists'
  },
  {
    id: 'professional',
    name: 'Executive Standard',
    description: 'Traditional layout optimized for management and executive roles.',
    folderColor: 'slate',
    tags: ['Professional', 'ATS Friendly', 'Executive'],
    thumbnail: '/images/templates/executive.jpg',
    atsRating: '5.0',
    difficulty: 'Easy',
    recommendedFor: 'Managers, Directors, HR Professionals, Business Analysts'
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Stand out with bold colors and unique typography. Best for design roles.',
    folderColor: 'purple',
    tags: ['Creative', 'Modern'],
    thumbnail: '/images/templates/creative.jpg',
    atsRating: '4.6',
    difficulty: 'Medium',
    recommendedFor: 'UI/UX Designers, Graphic Designers, Content Creators'
  },
  {
    id: 'minimal',
    name: 'Minimalist Clean',
    description: 'Focus purely on content with this elegant, distraction-free template.',
    folderColor: 'green',
    tags: ['Minimal', 'Professional', 'ATS Friendly'],
    thumbnail: '/images/templates/minimal.jpg',
    atsRating: '4.8',
    difficulty: 'Easy',
    recommendedFor: 'Freshers, College Students, Internships'
  }
];

export default function ResumeBuilderPage() {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await builderService.getHistory();
      // Map backend schema to frontend expectations
      const mapped = data.map(d => ({
        ...d,
        lastModified: d.updated_at || d.created_at,
        completion: 75 // Dummy completion for now
      }));
      setDrafts(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/resume-builder/create', { state: { template: selectedTemplate.id } });
  };

  const handleUseTemplate = (template) => {
    setSelectedTemplate(template);
    navigate('/resume-builder/create', { state: { template: template.id } });
  };

  const handleEditDraft = (draft) => {
    navigate('/resume-builder/create', { state: { draftId: draft.id, template: draft.template, draftData: draft } });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col gap-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center border border-accent-blue/30">
              <FileText className="text-accent-blue" size={20} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Resume Builder</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl">
            Create professional, ATS-friendly resumes in minutes. Powered by your profile data and AI.
          </p>
        </div>
        
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-bold rounded-xl shadow-lg shadow-accent-blue/25 hover:shadow-accent-blue/40 transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles size={18} />
          Create New Resume
        </button>
      </div>

      <RecentDrafts drafts={drafts} onEdit={handleEditDraft} />

      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Template Gallery</h2>
          <p className="text-gray-400 mt-2 text-lg">Choose from our professionally designed templates to create your perfect resume.</p>
        </div>

        <TemplateGallery 
          templates={TEMPLATES} 
          selectedTemplate={selectedTemplate} 
          onSelect={setSelectedTemplate} 
          onUseTemplate={handleUseTemplate}
          onPreview={setPreviewTemplate}
        />
      </div>

      {previewTemplate && (
        <TemplatePreview
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUse={handleUseTemplate}
        />
      )}
    </div>
  );
}

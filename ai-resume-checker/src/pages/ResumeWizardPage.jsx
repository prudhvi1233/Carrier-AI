import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ResumeWizard from '../components/builder/ResumeWizard';
import { builderService } from '../services/builderService';
import { toast } from 'react-hot-toast';

export default function ResumeWizardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);
  
  // Passed from TemplateGallery or RecentDrafts
  const initialTemplate = location.state?.template || 'modern';
  const draftId = location.state?.draftId || null;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      if (draftId && location.state?.draftData) {
        setResumeData(location.state.draftData);
      } else {
        // Initialize new resume from backend data
        const initialData = await builderService.initResume();
        setResumeData({
          name: 'Untitled Resume',
          template: initialTemplate,
          theme: 'blue',
          content: initialData
        });
      }
    } catch (err) {
      toast.error('Failed to load resume data');
      navigate('/resume-builder');
    } finally {
      setLoading(false);
    }
  };

  const handleExit = () => {
    navigate('/resume-builder');
  };

  if (loading || !resumeData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-blue"></div>
      </div>
    );
  }

  return (
    <ResumeWizard 
      initialData={resumeData}
      onExit={handleExit}
    />
  );
}

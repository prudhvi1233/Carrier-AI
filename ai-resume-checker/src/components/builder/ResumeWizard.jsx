import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import ProgressStepper from './ProgressStepper';
import BuilderToolbar from './BuilderToolbar';
import LivePreview from './LivePreview';
import ExperienceStep from './steps/ExperienceStep';
import EducationStep from './steps/EducationStep';
import SkillsStep from './steps/SkillsStep';
import ProjectsStep from './steps/ProjectsStep';
import TrainingsStep from './steps/TrainingsStep';
import { builderService } from '../../services/builderService';
import { aiEditorService } from '../../services/aiEditorService';
import { toast } from 'react-hot-toast';
import html2pdf from 'html2pdf.js';

export default function ResumeWizard({ initialData, onExit }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const steps = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'summary', label: 'Summary' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'trainings', label: 'Certifications' },
    { id: 'export', label: 'Preview & Export' },
  ];

  // Parse initial data to match form expectations
  const [formData, setFormData] = useState(() => {
    const c = initialData?.content || {};
    
    const safeParseArray = (val, defaultVal) => {
      if (!val) return defaultVal;
      if (Array.isArray(val)) return val.length ? val : defaultVal;
      if (typeof val === 'string') {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed) && parsed.length) return parsed;
        } catch(e) {}
      }
      return defaultVal;
    };

    return {
      personal: {
        firstName: c.personal_info?.name?.split(' ')[0] || '',
        lastName: c.personal_info?.name?.split(' ').slice(1).join(' ') || '',
        email: c.personal_info?.email || '',
        phone: c.personal_info?.phone || ''
      },
      summary: c.summary || '',
      projects: safeParseArray(c.projects, [{ id: 'proj-1', title: '', technologies: '', description: '', githubUrl: '', demoUrl: '' }]),
      hasExperience: c.hasExperience !== false,
      experience: safeParseArray(c.experience, []),
      education: c.education && !Array.isArray(c.education) ? c.education : { degree: {}, twelfth: {}, tenth: {} },
      skills: safeParseArray(c.skills, []),
      certifications: safeParseArray(c.certifications, [{ id: 'cert-1', name: '', organization: '', date: '', certificateId: '', description: '' }])
    };
  });

  const [metadata, setMetadata] = useState({
    id: initialData?.id || null,
    name: initialData?.name || 'Untitled Resume',
    template: initialData?.template || 'modern',
    theme: initialData?.theme || 'blue'
  });

  // Auto-save debounce effect (Optional: we can just let users manually save)

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const payload = {
        id: metadata.id,
        name: metadata.name,
        template: metadata.template,
        theme: metadata.theme,
        content: {
          personal_info: {
            name: `${formData.personal.firstName} ${formData.personal.lastName}`.trim(),
            email: formData.personal.email,
            phone: formData.personal.phone
          },
          summary: formData.summary,
          projects: formData.projects,
          hasExperience: formData.hasExperience,
          experience: formData.experience,
          education: formData.education,
          skills: formData.skills,
          certifications: formData.certifications
        }
      };
      const response = await builderService.saveDraft(payload);
      if (response && response.id) {
        setMetadata(prev => ({...prev, id: response.id}));
        toast.success("Draft saved successfully!");
      }
    } catch (err) {
      toast.error("Failed to save draft.");
    } finally {
      setIsSaving(false);
    }
  };

  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleDownloadPdf = () => {
    toast.success("Preparing PDF...");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleAnalyze = async () => {
    try {
      toast.loading("Saving and analyzing...", { id: "analyze" });
      
      const payload = {
        id: metadata.id,
        name: metadata.name,
        template: metadata.template,
        theme: metadata.theme,
        content: {
          personal_info: {
            name: `${formData.personal.firstName} ${formData.personal.lastName}`.trim(),
            email: formData.personal.email,
            phone: formData.personal.phone
          },
          summary: formData.summary,
          projects: formData.projects,
          hasExperience: formData.hasExperience,
          experience: formData.experience,
          education: formData.education,
          skills: formData.skills,
          certifications: formData.certifications
        }
      };
      
      const saveRes = await builderService.saveDraft(payload);
      let resumeId = metadata.id;
      if (saveRes && saveRes.id) {
        resumeId = saveRes.id;
        setMetadata(prev => ({...prev, id: resumeId}));
      }

      // Convert formData to raw text for AI analysis since the builder draft ID is not in the uploaded resumes table
      const resumeText = [
        `${formData.personal.firstName} ${formData.personal.lastName}`,
        formData.personal.email,
        formData.personal.phone,
        formData.summary,
        ...formData.experience.map(e => `${e.role || ''} at ${e.company || ''} ${e.duration || ''} - ${e.description || ''}`),
        formData.education?.degree?.name ? `${formData.education.degree.name} at ${formData.education.degree.institution}` : '',
        formData.skills.map(s => s.name).join(', '),
        ...formData.projects.map(p => `${p.title || ''} ${p.technologies || ''} ${p.description || ''}`),
        ...formData.certifications.map(c => `${c.name || ''} by ${c.organization || ''}`)
      ].filter(Boolean).join('\n\n');

      const analysisData = await aiEditorService.analyzeResume(resumeText);
      
      setAnalysisResult({
        score: analysisData.ats_score || analysisData.overall_score || 0,
        strengths: analysisData.strengths || ["Basic structure detected"],
        improvements: analysisData.improvements || analysisData.weaknesses || ["Add more quantifiable metrics"]
      });
      
      toast.success("Analysis complete!", { id: "analyze" });
      setShowAnalysisModal(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Analysis failed.", { id: "analyze" });
    }
  };

  const handleDownloadDocx = async () => {
    try {
      toast.loading("Generating DOCX...", { id: "docx" });
      const payload = {
        content: formData,
        template: metadata.template,
        theme: metadata.theme
      };
      const blob = await builderService.exportDocx(payload);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.docx');
      document.body.appendChild(link);
      link.click();
      toast.success("DOCX Downloaded!", { id: "docx" });
    } catch (err) {
      toast.error("Failed to export DOCX", { id: "docx" });
    }
  };

  const improveSummary = async () => {
    if (!formData.summary) return toast.error("Write a summary first.");
    try {
      setIsAiLoading(true);
      const improved = await builderService.improveTextWithAI(formData.summary, "Make this summary sound professional, impactful, and ATS-friendly.");
      setFormData({...formData, summary: improved});
      toast.success("Summary improved by AI!");
    } catch (err) {
      toast.error("AI improvement failed.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-secondary h-[calc(100vh-80px)] overflow-hidden w-full relative z-10">
      
      <BuilderToolbar 
        onSave={handleSave} 
        onDownload={handleDownloadPdf} 
        onAnalyze={handleAnalyze} 
      />
      
      <ProgressStepper steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Side: Form Area */}
        <div className="w-full lg:w-[45%] flex flex-col bg-secondary overflow-y-auto border-r border-border relative">
          
          <div className="p-6 md:p-8 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
              >
                {/* Step Content */}

                {/* Example Form Fields for 'Personal' step */}
                {currentStep === 0 && (
                  <div className="flex flex-col gap-4">
                    <div className="mb-2">
                      <h2 className="text-2xl font-bold text-foreground mb-2">{steps[currentStep].label}</h2>
                      <p className="text-muted text-sm">Fill in the details below. Our AI can help you write better content.</p>
                    </div>
                    <input 
                      type="text" placeholder="First Name" 
                      value={formData.personal.firstName}
                      onChange={(e) => setFormData({...formData, personal: {...formData.personal, firstName: e.target.value}})}
                      className="w-full bg-overlay border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent-blue"
                    />
                    <input 
                      type="text" placeholder="Last Name"
                      value={formData.personal.lastName}
                      onChange={(e) => setFormData({...formData, personal: {...formData.personal, lastName: e.target.value}})}
                      className="w-full bg-overlay border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent-blue"
                    />
                     <input 
                      type="email" placeholder="Email"
                      value={formData.personal.email}
                      onChange={(e) => setFormData({...formData, personal: {...formData.personal, email: e.target.value}})}
                      className="w-full bg-overlay border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent-blue"
                    />
                     <input 
                      type="text" placeholder="Phone"
                      value={formData.personal.phone}
                      onChange={(e) => setFormData({...formData, personal: {...formData.personal, phone: e.target.value}})}
                      className="w-full bg-overlay border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent-blue"
                    />
                  </div>
                )}

                {/* Example Form Fields for 'Summary' step with AI Button */}
                {currentStep === 1 && (
                  <div className="flex flex-col gap-4">
                    <div className="mb-2">
                      <h2 className="text-2xl font-bold text-foreground mb-2">{steps[currentStep].label}</h2>
                      <p className="text-muted text-sm">Write a compelling professional summary.</p>
                    </div>
                    <button 
                      onClick={improveSummary}
                      disabled={isAiLoading}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-accent-purple/10 text-accent-purple border border-accent-purple/20 hover:bg-accent-purple/20 transition-colors font-medium disabled:opacity-50"
                    >
                      {isAiLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                      Generate Summary with AI
                    </button>
                    <textarea 
                      placeholder="Write your professional summary..." rows={12}
                      value={formData.summary}
                      onChange={(e) => setFormData({...formData, summary: e.target.value})}
                      className="w-full bg-overlay border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent-blue resize-none"
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <ProjectsStep 
                    data={formData.projects} 
                    onUpdate={(data) => setFormData({...formData, projects: data})} 
                  />
                )}

                {currentStep === 3 && (
                  <ExperienceStep 
                    data={formData.experience} 
                    onUpdate={(data) => setFormData({...formData, experience: data})} 
                    hasExperience={formData.hasExperience}
                    onToggleExperience={(val) => setFormData({...formData, hasExperience: val})}
                  />
                )}
                
                {currentStep === 4 && (
                  <EducationStep 
                    data={formData.education} 
                    onUpdate={(data) => setFormData({...formData, education: data})} 
                  />
                )}

                {currentStep === 5 && (
                  <SkillsStep 
                    data={formData.skills} 
                    onUpdate={(data) => setFormData({...formData, skills: data})} 
                  />
                )}

                {currentStep === 6 && (
                  <TrainingsStep 
                    data={formData.certifications} 
                    onUpdate={(data) => setFormData({...formData, certifications: data})} 
                  />
                )}

                {currentStep === 7 && (
                  <div className="flex flex-col gap-6 h-full">
                    <div className="mb-2">
                      <h2 className="text-2xl font-bold text-foreground mb-2">{steps[currentStep].label}</h2>
                      <p className="text-muted text-sm">Review your generated resume and download it when you're ready.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <button 
                        onClick={handleDownloadPdf}
                        className="flex-1 flex justify-center items-center gap-2 py-4 bg-gradient-to-r from-accent-blue to-accent-purple text-foreground rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg"
                      >
                        Download PDF
                      </button>
                      <button 
                        onClick={handleDownloadDocx}
                        className="flex-1 flex justify-center items-center gap-2 py-4 bg-overlay border border-border text-foreground rounded-xl font-bold hover:bg-overlay-hover active:scale-95 transition-all"
                      >
                        Download DOCX
                      </button>
                    </div>

                    <div className="w-full h-[500px] lg:hidden rounded-xl overflow-hidden border border-border relative">
                       <LivePreview template={metadata.template} formData={formData} />
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Form Navigation Footer */}
          <div className="p-4 md:p-6 border-t border-border bg-secondary flex justify-between items-center sticky bottom-0 mt-auto z-10">
            <button 
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-2.5 rounded-lg text-foreground font-medium hover:bg-overlay transition-colors disabled:opacity-30 flex items-center gap-2"
            >
              <ChevronLeft size={18} /> Back
            </button>
            <button 
              onClick={currentStep === steps.length - 1 ? onExit : nextStep}
              className="px-6 py-2.5 rounded-lg bg-white text-black font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next Step'} <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Right Side: Live Preview Area */}
        <div className="hidden lg:block w-[55%] relative z-0 bg-gray-100">
          <LivePreview template={metadata.template} formData={formData} />
        </div>

      </div>

      {/* Analysis Modal */}
      {showAnalysisModal && analysisResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-secondary border border-border shadow-2xl rounded-2xl p-6 md:p-8 w-full max-w-lg relative"
          >
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Bot className="text-accent-blue" /> Resume Analysis
            </h3>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between p-4 bg-overlay rounded-xl border border-border">
                <span className="text-muted font-medium">ATS Match Score</span>
                <span className={`text-2xl font-black ${analysisResult.score > 80 ? 'text-green-500' : 'text-yellow-500'}`}>
                  {analysisResult.score}%
                </span>
              </div>
              
              <div>
                <h4 className="font-bold text-foreground mb-3">Strengths</h4>
                <ul className="space-y-2">
                  {analysisResult.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-muted flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-3">Areas to Improve</h4>
                <ul className="space-y-2">
                  {analysisResult.improvements.map((s, i) => (
                    <li key={i} className="text-sm text-muted flex items-start gap-2">
                      <span className="text-yellow-500 mt-0.5">!</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button 
                onClick={() => setShowAnalysisModal(false)}
                className="flex-1 py-3 bg-overlay hover:bg-overlay-hover border border-border text-foreground font-bold rounded-xl transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setShowAnalysisModal(false);
                  handleDownloadPdf();
                }}
                className="flex-1 py-3 bg-accent-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-colors"
              >
                Download PDF
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}

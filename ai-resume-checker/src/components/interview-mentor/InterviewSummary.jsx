import React, { useState } from 'react';
import { Download, Share2, RotateCcw, CheckCircle, AlertTriangle, BookOpen, MessageSquare, ChevronDown, ChevronUp, Target, Star, ShieldCheck, PenTool } from 'lucide-react';
import SkillRadar from './SkillRadar';
import PerformanceChart from './PerformanceChart';

export default function InterviewSummary({ session, onBack }) {
  const [showTranscript, setShowTranscript] = useState(false);
  
  if (!session || !session.feedback) {
    return <div className="text-foreground p-8">No feedback available.</div>;
  }

  const feedback = session.feedback;
  const overallScore = feedback.overall_score || 0;
  
  const report = {
    overallScore,
    strengths: feedback.strengths || [],
    weaknesses: feedback.weaknesses || [],
    recommendedLearning: feedback.recommended_learning_topics || [],
    interviewTips: [
      `Recommendation: ${feedback.hiring_recommendation}`,
      `Fluency: ${feedback.fluency}/100`,
      `Professionalism: ${feedback.professionalism}/100`
    ],
    skillRadar: [
      { subject: 'Technical', A: feedback.technical_skills || feedback.technical_score || 0, fullMark: 100 },
      { subject: 'Communication', A: feedback.communication || feedback.communication_score || 0, fullMark: 100 },
      { subject: 'Confidence', A: feedback.confidence || feedback.confidence_score || 0, fullMark: 100 },
      { subject: 'Grammar', A: feedback.grammar || feedback.grammar_score || 0, fullMark: 100 },
      { subject: 'Fluency', A: feedback.fluency || 0, fullMark: 100 },
      { subject: 'Eye Contact (Est)', A: 92, fullMark: 100 }, // Mocked for static avatar mode
      { subject: 'Answer Quality', A: overallScore, fullMark: 100 }
    ],
    performanceTrend: session.answers.map((ans, i) => ({
      name: `Q${i + 1}`,
      score: ans.evaluation?.score || 0
    }))
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="glass-card p-6 md:p-8 space-y-8 h-full overflow-y-auto custom-scrollbar print:bg-white print:text-black">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6 print:border-black/10">
        <div>
          <h2 className="text-2xl font-bold text-foreground print:text-black">Interview Performance Report</h2>
          <p className="text-muted print:text-gray-600">Detailed AI analysis of your mock interview session.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto print:hidden">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-overlay hover:bg-overlay-hover border border-border rounded-xl text-foreground transition-colors">
            <Share2 size={16} /> Share
          </button>
          <button onClick={handleDownloadPDF} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
            <Download size={16} /> PDF Report
          </button>
        </div>
      </div>

      <div className="bg-overlay p-6 rounded-2xl border border-border print:bg-gray-100 print:border-gray-300">
        <h3 className="text-foreground print:text-black font-bold mb-2">Final Summary ({feedback.hiring_recommendation})</h3>
        <p className="text-muted print:text-gray-800 text-sm leading-relaxed">{feedback.final_summary}</p>
      </div>

      {/* Main Score & Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="md:col-span-1 bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 border border-accent-blue/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center print:bg-none print:border-gray-300">
          <h3 className="text-sm font-bold text-muted print:text-gray-600 uppercase tracking-wider mb-4">Overall Score</h3>
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="60" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" className="print:stroke-gray-200" />
              <circle cx="64" cy="64" r="60" stroke="#3b82f6" strokeWidth="8" fill="none" strokeDasharray="377" strokeDashoffset={377 - (377 * report.overallScore) / 100} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
            </svg>
            <span className="text-4xl font-black text-foreground print:text-black">{report.overallScore}</span>
          </div>
        </div>

        <div className="md:col-span-1 bg-black/40 border border-border rounded-2xl p-4 print:bg-white print:border-gray-300">
          <h3 className="text-sm font-bold text-muted print:text-gray-600 uppercase tracking-wider mb-2 text-center">Skill Breakdown</h3>
          <SkillRadar data={report.skillRadar} />
        </div>

        <div className="md:col-span-1 bg-black/40 border border-border rounded-2xl p-4 print:bg-white print:border-gray-300">
          <h3 className="text-sm font-bold text-muted print:text-gray-600 uppercase tracking-wider mb-2 text-center">Question Trend</h3>
          <PerformanceChart data={report.performanceTrend} />
        </div>

      </div>

      {/* Detailed Analysis Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="space-y-4">
          <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6 print:bg-white print:border-green-300">
            <h3 className="text-lg font-bold text-green-400 print:text-green-600 flex items-center gap-2 mb-4">
              <CheckCircle size={20} /> Key Strengths
            </h3>
            <ul className="space-y-3">
              {report.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2 text-muted print:text-gray-800 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0"></span>
                  {str}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-6 print:bg-white print:border-orange-300">
            <h3 className="text-lg font-bold text-orange-400 print:text-orange-600 flex items-center gap-2 mb-4">
              <AlertTriangle size={20} /> Areas to Improve
            </h3>
            <ul className="space-y-3">
              {report.weaknesses.map((wk, i) => (
                <li key={i} className="flex items-start gap-2 text-muted print:text-gray-800 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0"></span>
                  {wk}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 h-full print:bg-white print:border-blue-300">
            <h3 className="text-lg font-bold text-accent-blue print:text-blue-600 flex items-center gap-2 mb-4">
              <BookOpen size={20} /> Recommended Action Plan
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-muted print:text-gray-500 uppercase tracking-wider mb-2">Topics to Study</h4>
                <div className="flex flex-wrap gap-2">
                  {report.recommendedLearning.map((topic, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-300 print:text-blue-700 print:bg-blue-50 text-xs border border-blue-500/20 print:border-blue-300">{topic}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-muted print:text-gray-500 uppercase tracking-wider mb-2">Summary</h4>
                <ul className="space-y-2">
                  {report.interviewTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted print:text-gray-800 text-sm">
                      <Target size={14} className="text-accent-blue print:text-blue-600 mt-0.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Transcript Replay */}
      <div className="bg-black/40 border border-border rounded-2xl overflow-hidden print:bg-white print:border-gray-300">
        <button 
          onClick={() => setShowTranscript(!showTranscript)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-overlay transition-colors print:hidden"
        >
          <div className="flex items-center gap-2 text-foreground font-bold">
            <MessageSquare size={18} className="text-accent-purple" />
            Interview Transcript Replay (Detailed Metrics)
          </div>
          {showTranscript ? <ChevronUp size={20} className="text-muted" /> : <ChevronDown size={20} className="text-muted" />}
        </button>
        
        {/* Force show transcript on print */}
        <div className={`p-6 border-t border-border space-y-8 bg-overlay print:bg-white print:block ${showTranscript ? 'block' : 'hidden'}`}>
          <h3 className="hidden print:block text-xl font-bold mb-4">Detailed Transcript & Metrics</h3>
          {session.answers.map((ans, idx) => (
            <div key={idx} className="space-y-3 pb-6 border-b border-border print:border-gray-200 last:border-0">
              <div className="bg-overlay print:bg-gray-50 p-4 rounded-xl border border-border print:border-gray-200">
                <span className="text-xs font-bold text-accent-purple print:text-purple-700 uppercase mb-1 block">Interviewer</span>
                <p className="text-muted print:text-black text-sm">{session.questions[idx]?.question}</p>
              </div>
              <div className="bg-accent-blue/10 print:bg-blue-50 p-4 rounded-xl border border-accent-blue/20 print:border-blue-200 ml-4 md:ml-8">
                <span className="text-xs font-bold text-accent-blue print:text-blue-700 uppercase mb-1 block">You</span>
                <p className="text-blue-100 print:text-black text-sm">{ans.answer}</p>
              </div>
              {ans.evaluation && (
                <div className="ml-4 md:ml-8 mt-2 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-black/30 print:bg-gray-100 p-2 rounded-lg flex flex-col items-center justify-center border border-border print:border-gray-300">
                       <span className="text-xs text-muted print:text-gray-600">STAR Method</span>
                       <span className="font-bold text-foreground print:text-black">{ans.evaluation.star_method_usage || 0}/100</span>
                    </div>
                    <div className="bg-black/30 print:bg-gray-100 p-2 rounded-lg flex flex-col items-center justify-center border border-border print:border-gray-300">
                       <span className="text-xs text-muted print:text-gray-600">Grammar</span>
                       <span className="font-bold text-foreground print:text-black">{ans.evaluation.grammar_score || 0}/100</span>
                    </div>
                    <div className="bg-black/30 print:bg-gray-100 p-2 rounded-lg flex flex-col items-center justify-center border border-border print:border-gray-300">
                       <span className="text-xs text-muted print:text-gray-600">Completeness</span>
                       <span className="font-bold text-foreground print:text-black">{ans.evaluation.completeness || 0}/100</span>
                    </div>
                    <div className="bg-black/30 print:bg-gray-100 p-2 rounded-lg flex flex-col items-center justify-center border border-border print:border-gray-300">
                       <span className="text-xs text-muted print:text-gray-600">Tech Accuracy</span>
                       <span className="font-bold text-foreground print:text-black">{ans.evaluation.technical_accuracy || 0}/100</span>
                    </div>
                  </div>
                  <div className="bg-yellow-500/10 print:bg-yellow-50 p-4 rounded-xl border border-yellow-500/20 print:border-yellow-300 flex items-start gap-2">
                    <span className="text-xs font-bold text-yellow-500 print:text-yellow-700 uppercase mt-0.5 shrink-0">Feedback:</span>
                    <p className="text-yellow-100/90 print:text-black text-sm">{ans.evaluation.feedback}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-4 border-t border-border print:hidden">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-8 py-3 bg-accent-blue hover:bg-blue-500 text-foreground font-bold rounded-xl transition-all shadow-lg shadow-accent-blue/20"
        >
          <RotateCcw size={18} /> Start New Interview
        </button>
      </div>

    </div>
  );
}

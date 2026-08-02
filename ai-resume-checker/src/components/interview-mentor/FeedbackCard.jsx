import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

export default function FeedbackCard({ feedback, onNext, isLast }) {
  
  const metrics = [
    { label: 'Overall Score', value: feedback.score || 0, color: 'text-green-400', bg: 'bg-green-400/20' },
    { label: 'Technical Accuracy', value: feedback.technical_score || 0, color: 'text-orange-400', bg: 'bg-orange-400/20' },
    { label: 'Communication', value: feedback.communication_score || 0, color: 'text-purple-400', bg: 'bg-purple-400/20' },
    { label: 'Confidence', value: feedback.confidence_score || 0, color: 'text-blue-400', bg: 'bg-blue-400/20' },
  ];

  return (
    <div className="bg-black/40 border border-accent-blue/30 rounded-2xl p-6 relative overflow-hidden">
      
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
        <CheckCircle2 size={120} />
      </div>

      <div className="relative z-10 space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="text-accent-blue" size={20} /> AI Evaluation
            </h4>
            <p className="text-sm text-muted">Score: {feedback.score}/100</p>
          </div>
          <button 
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            {isLast ? 'Finish Interview' : 'Next Question'} <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map(m => (
            <div key={m.label} className="bg-overlay border border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2">
              <div className={`relative w-12 h-12 rounded-full ${m.bg} flex items-center justify-center`}>
                <span className={`text-sm font-bold ${m.color}`}>{m.value}%</span>
              </div>
              <span className="text-xs font-medium text-muted">{m.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-accent-blue/10 border border-accent-blue/20 rounded-xl p-4 space-y-4">
          <div>
            <h5 className="font-bold text-foreground mb-2">Strengths & Weaknesses</h5>
            <div className="flex flex-wrap gap-2 mb-2">
              {feedback.strengths?.map((s, i) => <span key={i} className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg border border-green-500/30">✓ {s}</span>)}
              {feedback.weaknesses?.map((w, i) => <span key={i} className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-lg border border-red-500/30">✗ {w}</span>)}
            </div>
          </div>
          <div>
            <h5 className="font-bold text-foreground mb-2">Improvement Suggestions</h5>
            <ul className="list-disc pl-5 text-muted text-sm space-y-1">
              {feedback.improvement_suggestions?.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-accent-blue mb-2">Ideal Answer</h5>
            <p className="text-muted text-sm leading-relaxed italic border-l-2 border-accent-blue pl-3">{feedback.ideal_answer}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

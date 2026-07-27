import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { analyticsService } from '../../services/careerServices';

export default function WeeklyInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const data = await analyticsService.getInsights();
        setInsights(data.insights);
      } catch (e) {
        console.error(e);
        setInsights([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  return (
    <div className="glass-card p-6 h-full flex flex-col relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-accent-purple/20 blur-3xl rounded-full transition-transform group-hover:scale-150 duration-700" />
      
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
        <Sparkles className="text-accent-purple" size={20} /> AI Weekly Insights
      </h3>

      <div className="flex-1 flex flex-col gap-4 relative z-10 justify-center">
        {loading ? (
          <div className="flex items-center justify-center text-accent-purple gap-2">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Analyzing your week...</span>
          </div>
        ) : (
          insights.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-purple mt-2 shrink-0" />
              <p className="text-sm text-gray-300 leading-relaxed">{insight}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

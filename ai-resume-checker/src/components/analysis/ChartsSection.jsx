import React from 'react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChartsSection({ sectionScores }) {
  // Convert sectionScores object into array for charts
  const sectionData = Object.entries(sectionScores).map(([subject, A]) => ({
    subject,
    A,
    fullMark: 100,
  }));

  // Dummy skill distribution data
  const pieData = [
    { name: 'Frontend', value: 45 },
    { name: 'Backend', value: 25 },
    { name: 'DevOps', value: 15 },
    { name: 'Soft Skills', value: 15 },
  ];
  
  const COLORS = ['#3b82f6', '#a855f7', '#ec4899', '#14b8a6'];

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-overlay rounded-xl border border-border">
          <PieChartIcon size={20} className="text-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Analysis Charts</h3>
      </div>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Radar Chart for Section Scores */}
        <div className="flex flex-col items-center">
          <h4 className="text-sm font-medium text-muted mb-4 uppercase tracking-wider">Section Performance</h4>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={sectionData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart for Skill Distribution */}
        <div className="flex flex-col items-center">
          <h4 className="text-sm font-medium text-muted mb-4 uppercase tracking-wider">Skill Distribution</h4>
          <div className="w-full h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {pieData.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-muted">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

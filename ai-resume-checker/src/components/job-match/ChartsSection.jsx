import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { BarChart3 } from 'lucide-react';

export default function ChartsSection({ charts }) {
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

  return (
    <div className="bg-secondary/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <BarChart3 className="text-accent-purple" size={24} />
        Match Breakdown
      </h3>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="h-64">
          <h4 className="text-sm text-center text-gray-400 mb-4">Category Score</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={charts.matchBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="score"
              >
                {charts.matchBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1f36', borderColor: '#ffffff20', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="h-64">
          <h4 className="text-sm text-center text-gray-400 mb-4">Keyword Categories (Found vs Missing)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.keywordDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1f36', borderColor: '#ffffff20', borderRadius: '8px' }}
              />
              <Bar dataKey="found" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
              <Bar dataKey="missing" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, Plus } from 'lucide-react';
import { goalService } from '../../services/careerServices';
import AddGoalModal from './AddGoalModal';

export default function GoalsWidget() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchGoals = async () => {
    try {
      const data = await goalService.getGoalsAndTasks();
      if (data && data.goals) {
        setGoals(data.goals);
      } else {
        setGoals([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = async (goalData) => {
    try {
      await goalService.createGoal(goalData);
      fetchGoals(); // refresh the list
      setIsModalOpen(false);
    } catch (e) {
      console.error('Failed to create goal', e);
    }
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col bg-gradient-to-br from-orange-500/5 to-transparent">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Target className="text-accent-blue" size={20} /> Career Goals
        </h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="text-sm text-muted hover:text-foreground flex items-center gap-1 transition-colors"
        >
          <Plus size={16} /> Add Goal
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="text-muted text-sm text-center py-4">Loading goals...</div>
        ) : (
          <div className="flex flex-col gap-5">
            {goals.length === 0 ? (
              <div className="text-muted text-sm text-center py-4">No goals set yet.</div>
            ) : (
              goals.map(goal => {
                const progress = Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
                return (
                  <div key={goal.id} className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-200">{goal.title}</span>
                      <span className="text-muted">{goal.current_value} / {goal.target_value}</span>
                    </div>
                    <div className="h-2 w-full bg-overlay rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${goal.is_completed ? 'bg-green-500' : 'bg-gradient-to-r from-accent-blue to-accent-purple'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
      
      <AddGoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddGoal} 
      />
    </div>
  );
}

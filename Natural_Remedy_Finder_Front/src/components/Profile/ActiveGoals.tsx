import  { useState } from 'react';
import { Leaf, Target, PlusCircle } from 'lucide-react';
import Button from '../ui/Button';
export interface Goal {
    id: string;
    title: string;
    description: string;
    progress: number; 
    createdAt: string;
  }
interface ActiveGoalsProps {
  goals: Goal[];
  onGoalsUpdate: (goals: Goal[]) => void;
}

const ActiveGoals: React.FC<ActiveGoalsProps> = ({ goals: initialGoals, onGoalsUpdate }) => {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    progress: 0
  });

  const handleAddGoal = () => {
    if (!newGoal.title) return;
    
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      progress: newGoal.progress,
      createdAt: new Date().toISOString()
    };
    
    onGoalsUpdate([...initialGoals, goal]);
    setNewGoal({ title: '', description: '', progress: 0 });
    setShowAddGoal(false);
  };

  const updateProgress = (goalId: string, newProgress: number) => {
    const updatedGoals = initialGoals.map(goal => 
      goal.id === goalId ? { ...goal, progress: newProgress } : goal
    );
    onGoalsUpdate(updatedGoals);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-green-100">
      <div className="px-6 py-4 border-b border-green-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="text-green-600" size={20} />
          <h2 className="text-lg font-semibold text-green-900">Active Goals</h2>
        </div>
        <Button 
          variant="primary" 
          size="sm"
          onClick={() => setShowAddGoal(!showAddGoal)}
          className="flex items-center gap-1"
        >
          <PlusCircle size={16} />
          <span>Add Goal</span>
        </Button>
      </div>
      
      <div className="p-4">
        {showAddGoal && (
          <div className="mb-4 p-4 bg-green-50 rounded-lg animate-fadeIn">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Goal Title"
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 rounded-md border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <textarea
                placeholder="Goal Description"
                value={newGoal.description}
                onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 rounded-md border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={2}
              />
              <div className="flex gap-2">
                <Button variant="text" onClick={() => setShowAddGoal(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleAddGoal}>Add Goal</Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {initialGoals.map((goal) => (
            <div 
              key={goal.id}
              className="bg-green-50/50 rounded-lg p-4 hover:bg-green-50 transition-colors duration-200 group relative overflow-hidden"
            >
              <div className="absolute -right-6 -bottom-6 text-green-100 transform rotate-45 transition-transform duration-300 group-hover:rotate-90">
                <Leaf size={64} />
              </div>
              
              <div className="relative z-10">
                <h3 className="font-medium text-green-900">{goal.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-green-700">{goal.progress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress}
                    onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>
                
                <div className="mt-3 pt-2 border-t border-green-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {new Date(goal.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveGoals;
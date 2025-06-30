import React from 'react';
import { Target, Clock, Award, TrendingUp } from 'lucide-react';
import { ageGroupChallenges } from '../../data/innovations';
import { AgeGroup } from '../../types';

interface ChallengeTrackerProps {
  selectedAge: AgeGroup;
}

const ChallengeTracker: React.FC<ChallengeTrackerProps> = ({ selectedAge }) => {
  const challenges = ageGroupChallenges[selectedAge] || [];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-400 to-emerald-400';
    if (progress >= 60) return 'from-yellow-400 to-amber-400';
    if (progress >= 40) return 'from-orange-400 to-red-400';
    return 'from-indigo-400 to-purple-400';
  };

  return (
    <div className="bg-indigo-950/50 backdrop-blur-sm rounded-2xl p-6 border border-indigo-800/50">
      <div className="flex items-center mb-6">
        <Target className="w-6 h-6 text-amber-400 mr-3" />
        <h2 className="text-2xl font-serif text-white">Age-Specific Challenges</h2>
      </div>

      <div className="space-y-4">
        {challenges.map((challenge, index) => {
          // Simulate progress for demo
          const progress = Math.floor(Math.random() * 100);
          const isCompleted = progress === 100;
          
          return (
            <div
              key={challenge.id}
              className={`bg-indigo-900/30 border rounded-xl p-5 transition-all duration-300 ${
                isCompleted 
                  ? 'border-green-500/50 bg-green-900/20' 
                  : 'border-indigo-800/30 hover:border-indigo-700/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className={`text-lg font-semibold ${isCompleted ? 'text-green-300' : 'text-white'}`}>
                  {challenge.title}
                </h3>
                <div className="flex items-center text-xs text-indigo-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {challenge.duration}
                </div>
              </div>
              
              <p className="text-sm text-indigo-200 mb-4">
                {challenge.description}
              </p>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-indigo-400 mb-2">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 bg-indigo-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${getProgressColor(progress)} transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Skills */}
              <div className="mb-4">
                <div className="text-xs text-indigo-400 mb-2">Skills Developed:</div>
                <div className="flex flex-wrap gap-2">
                  {challenge.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-indigo-800/50 text-indigo-200 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Rewards */}
              <div className="mb-4">
                <div className="text-xs text-indigo-400 mb-2">Rewards:</div>
                <div className="flex flex-wrap gap-2">
                  {challenge.rewards.map((reward, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-amber-800/30 text-amber-300 rounded-full flex items-center"
                    >
                      <Award className="w-3 h-3 mr-1" />
                      {reward}
                    </span>
                  ))}
                </div>
              </div>
              
              <button 
                className={`w-full py-2 rounded-lg font-medium transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-600 text-white cursor-default'
                    : 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-amber-500 hover:to-amber-400'
                }`}
                disabled={isCompleted}
              >
                {isCompleted ? 'Completed! 🎉' : 'Continue Challenge'}
              </button>
            </div>
          );
        })}
      </div>

      {challenges.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-lg font-medium text-indigo-300 mb-2">No challenges available</h3>
          <p className="text-sm text-indigo-400">
            Challenges for this age group are being developed.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChallengeTracker;
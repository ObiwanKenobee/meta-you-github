import React, { useState, useMemo } from 'react';
import { Zap, Clock, Trophy, Users, Filter } from 'lucide-react';
import { innovations } from '../../data/innovations';
import { AgeGroup, Innovation } from '../../types';

interface InnovationHubProps {
  selectedAge: AgeGroup;
  selectedMentor: string;
}

const InnovationHub: React.FC<InnovationHubProps> = ({ selectedAge, selectedMentor }) => {
  const [filter, setFilter] = useState<'all' | 'technical' | 'creative' | 'philosophical' | 'entrepreneurial'>('all');
  
  const filteredInnovations = useMemo(() => {
    return innovations.filter(innovation => {
      const ageMatch = innovation.ageGroups.includes(selectedAge);
      const mentorMatch = selectedMentor === 'all' || innovation.mentor.toLowerCase().includes(selectedMentor);
      const categoryMatch = filter === 'all' || innovation.category === filter;
      
      return ageMatch && mentorMatch && categoryMatch;
    });
  }, [selectedAge, selectedMentor, filter]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-300';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300';
      case 'advanced': return 'bg-orange-500/20 text-orange-300';
      case 'master': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return '⚡';
      case 'creative': return '🎨';
      case 'philosophical': return '🧠';
      case 'entrepreneurial': return '🚀';
      default: return '💡';
    }
  };

  return (
    <div className="bg-indigo-950/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-indigo-800/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <div className="flex items-center">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 mr-2 sm:mr-3" />
          <h2 className="text-xl sm:text-2xl font-serif text-white">Innovation Hub</h2>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <Filter className="w-4 h-4 text-indigo-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-indigo-900/50 border border-indigo-700 rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm text-white"
          >
            <option value="all">All Categories</option>
            <option value="technical">Technical</option>
            <option value="creative">Creative</option>
            <option value="philosophical">Philosophical</option>
            <option value="entrepreneurial">Entrepreneurial</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredInnovations.map((innovation) => (
          <div
            key={innovation.id}
            className="bg-indigo-900/30 border border-indigo-800/30 rounded-xl p-4 sm:p-5 hover:border-indigo-700/50 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="text-xl sm:text-2xl">{getCategoryIcon(innovation.category)}</div>
              <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(innovation.difficulty)}`}>
                {innovation.difficulty}
              </span>
            </div>
            
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-amber-300 transition-colors">
              {innovation.title}
            </h3>
            
            <p className="text-sm text-indigo-200 mb-3 sm:mb-4 line-clamp-3">
              {innovation.description}
            </p>
            
            <div className="flex items-center justify-between text-xs text-indigo-400 mb-3 sm:mb-4">
              <span className="flex items-center">
                <Users className="w-3 h-3 mr-1" />
                {innovation.ageGroups.length} age groups
              </span>
              <span className="font-medium text-amber-400 text-xs">
                {innovation.mentor}
              </span>
            </div>
            
            <div className="pt-3 sm:pt-4 border-t border-indigo-800/30">
              <button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-2 rounded-lg font-medium hover:from-amber-500 hover:to-amber-400 transition-all duration-300 text-sm">
                Start Innovation
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredInnovations.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="text-3xl sm:text-4xl mb-4">🔍</div>
          <h3 className="text-base sm:text-lg font-medium text-indigo-300 mb-2">No innovations found</h3>
          <p className="text-sm text-indigo-400">
            Try adjusting your filters or selecting a different age group.
          </p>
        </div>
      )}
    </div>
  );
};

export default InnovationHub;
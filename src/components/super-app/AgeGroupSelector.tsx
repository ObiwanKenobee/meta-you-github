import React from 'react';
import { Users, Sparkles, Rocket, Crown, Mountain, Star } from 'lucide-react';
import { AgeGroup } from '../../types';

interface AgeGroupSelectorProps {
  selectedAge: AgeGroup;
  onAgeChange: (age: AgeGroup) => void;
}

const ageGroups = [
  { 
    key: 'children' as AgeGroup, 
    label: 'Young Explorers', 
    age: '5-12', 
    icon: Sparkles,
    color: 'from-pink-400 to-purple-400',
    description: 'Curiosity & Wonder'
  },
  { 
    key: 'teens' as AgeGroup, 
    label: 'Digital Natives', 
    age: '13-17', 
    icon: Rocket,
    color: 'from-blue-400 to-cyan-400',
    description: 'Innovation & Discovery'
  },
  { 
    key: 'young-adults' as AgeGroup, 
    label: 'Builders', 
    age: '18-25', 
    icon: Users,
    color: 'from-green-400 to-emerald-400',
    description: 'Creation & Growth'
  },
  { 
    key: 'adults' as AgeGroup, 
    label: 'Leaders', 
    age: '26-40', 
    icon: Crown,
    color: 'from-amber-400 to-orange-400',
    description: 'Mastery & Impact'
  },
  { 
    key: 'middle-age' as AgeGroup, 
    label: 'Wisdom Keepers', 
    age: '41-60', 
    icon: Mountain,
    color: 'from-indigo-400 to-purple-400',
    description: 'Integration & Legacy'
  },
  { 
    key: 'seniors' as AgeGroup, 
    label: 'Sage Mentors', 
    age: '60+', 
    icon: Star,
    color: 'from-violet-400 to-pink-400',
    description: 'Wisdom & Guidance'
  }
];

const AgeGroupSelector: React.FC<AgeGroupSelectorProps> = ({ selectedAge, onAgeChange }) => {
  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-serif mb-4 sm:mb-6 text-center bg-gradient-to-r from-white to-amber-300 bg-clip-text text-transparent">
        Choose Your Journey
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {ageGroups.map(({ key, label, age, icon: Icon, color, description }) => (
          <button
            key={key}
            onClick={() => onAgeChange(key)}
            className={`relative group p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 ${
              selectedAge === key
                ? 'border-amber-400 bg-gradient-to-br from-indigo-800/50 to-indigo-900/50 scale-105'
                : 'border-indigo-700/50 bg-indigo-900/30 hover:border-indigo-600 hover:bg-indigo-800/40'
            }`}
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-gradient-to-br ${color} flex items-center justify-center`}>
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            
            <h3 className="text-xs sm:text-sm font-medium text-white mb-1">{label}</h3>
            <p className="text-xs text-indigo-300 mb-1 sm:mb-2">{age}</p>
            <p className="text-xs text-indigo-400 hidden sm:block">{description}</p>
            
            {selectedAge === key && (
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 pointer-events-none"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AgeGroupSelector;
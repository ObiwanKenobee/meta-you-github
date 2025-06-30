import React from 'react';
import { Brain, Lightbulb, Cpu, Palette, Brush } from 'lucide-react';

interface MentorSelectorProps {
  selectedMentor: string;
  onMentorChange: (mentor: string) => void;
}

const mentors = [
  {
    id: 'rohn',
    name: 'Jim Rohn',
    title: 'The Philosopher',
    icon: Brain,
    color: 'from-emerald-500 to-teal-500',
    specialty: 'Personal Development & Life Design',
    quote: 'You are the average of the five people you spend the most time with.',
    principles: ['Personal Philosophy', 'Goal Setting', 'Self-Discipline', 'Success Habits']
  },
  {
    id: 'jobs',
    name: 'Steve Jobs',
    title: 'The Visionary',
    icon: Lightbulb,
    color: 'from-blue-500 to-indigo-500',
    specialty: 'Innovation & Design Thinking',
    quote: 'Innovation distinguishes between a leader and a follower.',
    principles: ['Simplicity', 'User Experience', 'Perfectionism', 'Vision']
  },
  {
    id: 'wozniak',
    name: 'Steve Wozniak',
    title: 'The Engineer',
    icon: Cpu,
    color: 'from-cyan-500 to-blue-500',
    specialty: 'Technical Innovation & Problem Solving',
    quote: 'Never trust a computer you can\'t throw out a window.',
    principles: ['Elegant Solutions', 'Accessibility', 'Technical Excellence', 'Fun in Engineering']
  },
  {
    id: 'davinci',
    name: 'Leonardo da Vinci',
    title: 'The Renaissance Master',
    icon: Palette,
    color: 'from-amber-500 to-orange-500',
    specialty: 'Interdisciplinary Innovation',
    quote: 'Learning never exhausts the mind.',
    principles: ['Curiosity', 'Observation', 'Art-Science Integration', 'Continuous Learning']
  },
  {
    id: 'delacroix',
    name: 'Eugène Delacroix',
    title: 'The Romantic',
    icon: Brush,
    color: 'from-rose-500 to-pink-500',
    specialty: 'Emotional Expression & Artistic Innovation',
    quote: 'The source of genius is imagination alone.',
    principles: ['Emotional Intelligence', 'Artistic Expression', 'Passionate Precision', 'Color Theory']
  }
];

const MentorSelector: React.FC<MentorSelectorProps> = ({ selectedMentor, onMentorChange }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-serif mb-6 text-center bg-gradient-to-r from-white to-amber-300 bg-clip-text text-transparent">
        Choose Your Mentor
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {mentors.map(({ id, name, title, icon: Icon, color, specialty, quote, principles }) => (
          <button
            key={id}
            onClick={() => onMentorChange(id)}
            className={`relative group p-6 rounded-2xl border transition-all duration-300 text-left ${
              selectedMentor === id
                ? 'border-amber-400 bg-gradient-to-br from-indigo-800/50 to-indigo-900/50 scale-105'
                : 'border-indigo-700/50 bg-indigo-900/30 hover:border-indigo-600 hover:bg-indigo-800/40'
            }`}
          >
            <div className={`w-16 h-16 mb-4 rounded-full bg-gradient-to-br ${color} flex items-center justify-center`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-1">{name}</h3>
            <p className="text-sm text-indigo-300 mb-3">{title}</p>
            <p className="text-xs text-indigo-400 mb-4">{specialty}</p>
            
            <blockquote className="text-xs italic text-indigo-200 mb-4 border-l-2 border-indigo-600 pl-3">
              "{quote}"
            </blockquote>
            
            <div className="space-y-1">
              {principles.map((principle, idx) => (
                <div key={idx} className="flex items-center text-xs text-indigo-300">
                  <div className="w-1 h-1 bg-amber-400 rounded-full mr-2"></div>
                  {principle}
                </div>
              ))}
            </div>
            
            {selectedMentor === id && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 pointer-events-none"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MentorSelector;
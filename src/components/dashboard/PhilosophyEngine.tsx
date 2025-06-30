import React, { useState, useCallback, useMemo } from 'react';
import { BookHeart, PlusCircle } from 'lucide-react';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';
import { useDebouncedState } from '../../hooks/useOptimizedState';

interface Value {
  id: string;
  text: string;
  category: 'personal' | 'relational' | 'professional' | 'spiritual';
}

const PhilosophyEngine: React.FC = () => {
  usePerformanceMonitor('PhilosophyEngine');
  
  const [values, setValues] = useState<Value[]>([
    { id: '1', text: 'Prioritize continuous growth in all domains of life', category: 'personal' },
    { id: '2', text: 'Practice radical honesty with self and others', category: 'relational' },
    { id: '3', text: 'Create more value than you capture', category: 'professional' },
    { id: '4', text: 'Recognize the sacred in the ordinary', category: 'spiritual' },
  ]);
  
  const [newValue, debouncedNewValue, setNewValue] = useDebouncedState('', 300);
  const [selectedCategory, setSelectedCategory] = useState<Value['category']>('personal');
  
  // Memoize category colors to prevent recalculation
  const categoryColors = useMemo(() => ({
    personal: 'bg-indigo-500/20 text-indigo-300',
    relational: 'bg-pink-500/20 text-pink-300',
    professional: 'bg-blue-500/20 text-blue-300',
    spiritual: 'bg-amber-500/20 text-amber-300',
  }), []);
  
  const getCategoryColor = useCallback((category: Value['category']) => {
    return categoryColors[category] || 'bg-gray-500/20 text-gray-300';
  }, [categoryColors]);
  
  const handleAddValue = useCallback(() => {
    if (debouncedNewValue.trim()) {
      setValues(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: debouncedNewValue,
          category: selectedCategory,
        },
      ]);
      setNewValue('');
    }
  }, [debouncedNewValue, selectedCategory, setNewValue]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddValue();
    }
  }, [handleAddValue]);
  
  // Memoize categories array
  const categories = useMemo(() => 
    ['personal', 'relational', 'professional', 'spiritual'] as const, 
    []
  );
  
  return (
    <div className="bg-indigo-950/50 backdrop-blur-sm rounded-2xl p-5 h-96 border border-indigo-800/50 overflow-hidden flex flex-col">
      <div className="flex items-center mb-4">
        <BookHeart size={18} className="text-indigo-400 mr-2" />
        <h3 className="text-lg font-medium text-white">Philosophy Engine</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {values.map(value => (
          <div 
            key={value.id}
            className="p-3 rounded-lg bg-indigo-900/30 border border-indigo-800/30 hover:border-indigo-700/50 transition-colors group"
          >
            <div className="flex items-start mb-2">
              <span 
                className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(value.category)}`}
              >
                {value.category}
              </span>
            </div>
            <p className="text-indigo-100 text-sm">{value.text}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-indigo-800/30">
        <div className="flex gap-2 mb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-xs px-2 py-1 rounded-full transition-colors ${
                selectedCategory === category 
                  ? getCategoryColor(category)
                  : 'bg-indigo-900/30 text-indigo-300 hover:bg-indigo-800/30'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new core value..."
            className="flex-1 bg-indigo-900/30 border border-indigo-800/50 rounded-lg px-3 py-2 text-sm text-white placeholder-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={handleAddValue}
            disabled={!debouncedNewValue.trim()}
            className="p-2 text-indigo-300 hover:text-amber-300 disabled:text-indigo-700 disabled:cursor-not-allowed transition-colors"
          >
            <PlusCircle size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PhilosophyEngine);
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, Calendar, User, Tag, TrendingUp } from 'lucide-react';

interface SearchFilter {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'range' | 'multiselect';
  options?: { value: string; label: string }[];
  value: any;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: Date;
  relevance: number;
  type: 'innovation' | 'user' | 'achievement' | 'collaboration';
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: Record<string, any>) => Promise<SearchResult[]>;
  placeholder?: string;
  categories?: string[];
  showFilters?: boolean;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  placeholder = "Search everything...",
  categories = ['All', 'Innovations', 'Users', 'Achievements', 'Collaborations'],
  showFilters = true
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [filters, setFilters] = useState<SearchFilter[]>([
    {
      id: 'category',
      label: 'Category',
      type: 'select',
      options: categories.map(cat => ({ value: cat.toLowerCase(), label: cat })),
      value: 'all'
    },
    {
      id: 'dateRange',
      label: 'Date Range',
      type: 'select',
      options: [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'year', label: 'This Year' }
      ],
      value: 'all'
    },
    {
      id: 'tags',
      label: 'Tags',
      type: 'multiselect',
      options: [
        { value: 'ai', label: 'AI' },
        { value: 'creativity', label: 'Creativity' },
        { value: 'leadership', label: 'Leadership' },
        { value: 'technical', label: 'Technical' },
        { value: 'wisdom', label: 'Wisdom' }
      ],
      value: []
    },
    {
      id: 'relevance',
      label: 'Minimum Relevance',
      type: 'range',
      value: 0
    }
  ]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        performSearch();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, filters]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const filterValues = filters.reduce((acc, filter) => {
        acc[filter.id] = filter.value;
        return acc;
      }, {} as Record<string, any>);

      const searchResults = await onSearch(query, filterValues);
      setResults(searchResults);

      // Save to recent searches
      if (query.trim() && !recentSearches.includes(query)) {
        const newRecentSearches = [query, ...recentSearches.slice(0, 4)];
        setRecentSearches(newRecentSearches);
        localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilter = (filterId: string, value: any) => {
    setFilters(prev => prev.map(filter => 
      filter.id === filterId ? { ...filter, value } : filter
    ));
  };

  const clearFilters = () => {
    setFilters(prev => prev.map(filter => ({
      ...filter,
      value: filter.type === 'multiselect' ? [] : filter.type === 'range' ? 0 : 'all'
    })));
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'innovation': return '💡';
      case 'user': return '👤';
      case 'achievement': return '🏆';
      case 'collaboration': return '🤝';
      default: return '📄';
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-amber-400/30 text-amber-300 rounded px-1">
          {part}
        </mark>
      ) : part
    );
  };

  const activeFiltersCount = useMemo(() => {
    return filters.filter(filter => {
      if (filter.type === 'multiselect') return filter.value.length > 0;
      if (filter.type === 'range') return filter.value > 0;
      return filter.value !== 'all';
    }).length;
  }, [filters]);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-indigo-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-12 py-3 bg-indigo-900/30 border border-indigo-700/50 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
        />
        {showFilters && (
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors ${
              activeFiltersCount > 0 ? 'text-amber-400' : 'text-indigo-400 hover:text-white'
            }`}
          >
            <Filter className="h-5 w-5" />
            {activeFiltersCount > 0 && (
              <span className="ml-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilterPanel && showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-indigo-950/95 backdrop-blur-sm border border-indigo-800/50 rounded-lg p-4 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Filters</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-300 hover:text-white transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilterPanel(false)}
                className="text-indigo-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filters.map((filter) => (
              <div key={filter.id}>
                <label className="block text-sm font-medium text-indigo-300 mb-2">
                  {filter.label}
                </label>
                
                {filter.type === 'select' && (
                  <select
                    value={filter.value}
                    onChange={(e) => updateFilter(filter.id, e.target.value)}
                    className="w-full px-3 py-2 bg-indigo-900/50 border border-indigo-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}

                {filter.type === 'multiselect' && (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {filter.options?.map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filter.value.includes(option.value)}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...filter.value, option.value]
                              : filter.value.filter((v: string) => v !== option.value);
                            updateFilter(filter.id, newValue);
                          }}
                          className="mr-2 rounded border-indigo-600 bg-indigo-900/50 text-amber-400 focus:ring-amber-400"
                        />
                        <span className="text-sm text-indigo-200">{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}

                {filter.type === 'range' && (
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filter.value}
                      onChange={(e) => updateFilter(filter.id, parseInt(e.target.value))}
                      className="w-full h-2 bg-indigo-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-indigo-400 mt-1">
                      <span>0%</span>
                      <span className="text-amber-400">{filter.value}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {!query && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-indigo-950/95 backdrop-blur-sm border border-indigo-800/50 rounded-lg p-4 z-40">
          <h4 className="text-sm font-medium text-indigo-300 mb-2">Recent Searches</h4>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => setQuery(search)}
                className="px-3 py-1 bg-indigo-800/50 text-indigo-200 rounded-full text-sm hover:bg-indigo-700/50 transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {(query || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-indigo-950/95 backdrop-blur-sm border border-indigo-800/50 rounded-lg max-h-96 overflow-y-auto z-30">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-400"></div>
              <span className="ml-2 text-indigo-300">Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="p-3 hover:bg-indigo-800/30 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">{getResultIcon(result.type)}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">
                        {highlightText(result.title, query)}
                      </h4>
                      <p className="text-sm text-indigo-300 mt-1 line-clamp-2">
                        {highlightText(result.description, query)}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs px-2 py-1 bg-indigo-800/50 text-indigo-200 rounded-full">
                          {result.category}
                        </span>
                        <div className="flex items-center text-xs text-indigo-400">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {Math.round(result.relevance * 100)}% match
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {result.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs px-1 py-0.5 bg-amber-800/30 text-amber-300 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="flex items-center justify-center py-8 text-indigo-400">
              <span>No results found for "{query}"</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
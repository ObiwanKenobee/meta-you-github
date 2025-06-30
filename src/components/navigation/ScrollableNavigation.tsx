import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Home, User, BarChart3, Trophy, Users, Settings, Brain, Zap } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
  active?: boolean;
}

interface ScrollableNavigationProps {
  items: NavigationItem[];
  onItemClick: (id: string) => void;
  orientation?: 'horizontal' | 'vertical';
  showScrollButtons?: boolean;
}

const ScrollableNavigation: React.FC<ScrollableNavigationProps> = ({
  items,
  onItemClick,
  orientation = 'horizontal',
  showScrollButtons = true
}) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeItem, setActiveItem] = useState(items[0]?.id);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkScrollability();
  }, [items]);

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (orientation === 'horizontal') {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    } else {
      setCanScrollLeft(container.scrollTop > 0);
      setCanScrollRight(
        container.scrollTop < container.scrollHeight - container.clientHeight
      );
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = orientation === 'horizontal' ? 200 : 100;
    const scrollValue = direction === 'left' ? -scrollAmount : scrollAmount;

    if (orientation === 'horizontal') {
      container.scrollBy({ left: scrollValue, behavior: 'smooth' });
    } else {
      container.scrollBy({ top: scrollValue, behavior: 'smooth' });
    }
  };

  const handleItemClick = (id: string) => {
    setActiveItem(id);
    onItemClick(id);
  };

  const containerClasses = orientation === 'horizontal'
    ? 'flex overflow-x-auto scrollbar-hide space-x-2 py-2'
    : 'flex flex-col overflow-y-auto scrollbar-hide space-y-2 px-2';

  const itemClasses = orientation === 'horizontal'
    ? 'flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200'
    : 'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200';

  return (
    <div className={`relative ${orientation === 'horizontal' ? 'w-full' : 'h-full'}`}>
      {/* Scroll Left/Up Button */}
      {showScrollButtons && canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className={`absolute z-10 bg-indigo-900/80 backdrop-blur-sm border border-indigo-700/50 rounded-full p-2 text-indigo-300 hover:text-white hover:bg-indigo-800/80 transition-all ${
            orientation === 'horizontal'
              ? 'left-0 top-1/2 -translate-y-1/2'
              : 'top-0 left-1/2 -translate-x-1/2'
          }`}
        >
          <ChevronLeft className={`w-4 h-4 ${orientation === 'vertical' ? 'rotate-90' : ''}`} />
        </button>
      )}

      {/* Scroll Right/Down Button */}
      {showScrollButtons && canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className={`absolute z-10 bg-indigo-900/80 backdrop-blur-sm border border-indigo-700/50 rounded-full p-2 text-indigo-300 hover:text-white hover:bg-indigo-800/80 transition-all ${
            orientation === 'horizontal'
              ? 'right-0 top-1/2 -translate-y-1/2'
              : 'bottom-0 left-1/2 -translate-x-1/2'
          }`}
        >
          <ChevronRight className={`w-4 h-4 ${orientation === 'vertical' ? 'rotate-90' : ''}`} />
        </button>
      )}

      {/* Navigation Container */}
      <div
        ref={scrollContainerRef}
        className={containerClasses}
        onScroll={checkScrollability}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`${itemClasses} ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-indigo-300 hover:text-white hover:bg-indigo-800/50'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`font-medium ${orientation === 'horizontal' ? 'whitespace-nowrap' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ScrollableNavigation;
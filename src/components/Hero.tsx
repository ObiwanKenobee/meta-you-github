import React, { useState, useCallback, useMemo } from 'react';
import Logo from './Logo';
import Navigation from './Navigation';
import Dashboard from './dashboard/Dashboard';
import { useTheme } from './theme/ThemeProvider';
import { MoonStar, Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  const { theme } = useTheme();
  const [moodState, setMoodState] = useState(85);
  
  const handleMoodChange = useCallback((newMood: number) => {
    setMoodState(newMood);
  }, []);

  // Memoize the floating particles to prevent re-renders
  const floatingParticles = useMemo(() => (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-indigo-500/10 animate-float will-change-transform"
          style={{
            width: `${Math.random() * 60 + 40}px`,
            height: `${Math.random() * 60 + 40}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 8 + 12}s`,
          }}
        ></div>
      ))}
    </div>
  ), []);

  // Memoize the header content with responsive design
  const headerContent = useMemo(() => (
    <header className="relative z-10 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center">
        <Logo />
        <div className="ml-3">
          <h1 className="text-lg sm:text-xl font-medium tracking-wide">Meta You</h1>
          <p className="text-xs text-indigo-300">AI-Powered Personal Operating System</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 sm:space-x-6">
        {/* Enhanced Mood Tracker - Responsive */}
        <div className="flex items-center space-x-2">
          <MoonStar className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-300" />
          <div className="w-16 sm:w-24 h-2 bg-indigo-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-400 to-amber-300 transition-all duration-700 ease-in-out will-change-transform"
              style={{ width: `${moodState}%` }}
            ></div>
          </div>
          <span className="text-xs font-medium text-indigo-300">{Math.round(moodState)}%</span>
        </div>
        
        {/* Status Indicator - Hidden on mobile */}
        <div className="hidden sm:flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
          <span className="text-xs text-amber-300 font-medium">Live Preview</span>
        </div>
        
        <button className="text-xs font-medium text-indigo-300 border border-indigo-700 rounded-full px-3 py-1 hover:bg-indigo-800/30 transition-colors">
          Connect
        </button>
      </div>
    </header>
  ), [moodState]);

  // Memoize the main content with responsive design
  const mainContent = useMemo(() => (
    <main className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
      {/* Left sidebar - Navigation - Responsive */}
      <div className="lg:w-16 order-2 lg:order-1">
        <Navigation />
      </div>
      
      {/* Main Content - Responsive */}
      <div className="flex-1 order-1 lg:order-2">
        <div className="mb-8 sm:mb-12 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 leading-tight bg-gradient-to-r from-white to-amber-300 bg-clip-text text-transparent">
            Design the mind.<br />Align the life.
          </h2>
          <p className="text-indigo-200 text-base sm:text-lg mb-4">
            Your AI-powered personal operating system for intentional living and growth.
          </p>
          <p className="text-indigo-300 text-sm sm:text-base mb-6 sm:mb-8">
            Featuring wisdom from <span className="text-amber-300 font-medium">Jim Rohn</span>, <span className="text-amber-300 font-medium">Steve Jobs</span>, <span className="text-amber-300 font-medium">Steve Wozniak</span>, <span className="text-amber-300 font-medium">Leonardo da Vinci</span>, and <span className="text-amber-300 font-medium">Eugène Delacroix</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <button className="relative group overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]">
              <span className="relative z-10 flex items-center justify-center">
                Launch My Path
                <span className="ml-2 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  →
                </span>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
            </button>
            
            <button className="text-indigo-200 hover:text-white px-6 py-3 border border-indigo-700/50 rounded-lg font-medium transition-all duration-300 hover:border-indigo-500 hover:bg-indigo-900/30">
              Read Your Soul Scroll
            </button>
          </div>

          {/* Preview Features - Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: '🧠', label: 'AI Mentorship', desc: '5 Legendary Minds' },
              { icon: '📊', label: 'Growth Tracking', desc: '6 Core Metrics' },
              { icon: '🎯', label: 'Age-Specific', desc: 'Tailored Challenges' },
              { icon: '🌟', label: 'Innovation Hub', desc: 'Creative Projects' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-indigo-900/30 border border-indigo-800/30 rounded-lg p-3 text-center hover:border-indigo-700/50 transition-colors">
                <div className="text-xl sm:text-2xl mb-1">{feature.icon}</div>
                <div className="text-xs sm:text-sm font-medium text-white">{feature.label}</div>
                <div className="text-xs text-indigo-300">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Dashboard Preview with section marker - Responsive */}
        <div data-section="dashboard">
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="text-xl sm:text-2xl font-serif text-white">Dashboard Preview</h3>
            <span className="text-xs px-3 py-1 bg-amber-800/30 text-amber-300 rounded-full self-start sm:self-auto">
              Live Demo
            </span>
          </div>
          <Dashboard />
        </div>
      </div>
    </main>
  ), []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-indigo-900 text-white overflow-hidden">
      {/* Hero Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(76,29,149,0.15),rgba(0,0,0,0))] pointer-events-none"></div>
      
      {/* Optimized floating particles with reduced count */}
      {floatingParticles}
      
      {/* Header Area */}
      {headerContent}

      {/* Main Content */}
      {mainContent}
    </div>
  );
};

export default React.memo(Hero);
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Download, Share2, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AuthModal from '../auth/AuthModal';
import AgeGroupSelector from './AgeGroupSelector';
import MentorSelector from './MentorSelector';
import InnovationHub from './InnovationHub';
import ChallengeTracker from './ChallengeTracker';
import ConnectedGrowthMetrics from '../dashboard/ConnectedGrowthMetrics';
import AdvancedAnalytics from '../analytics/AdvancedAnalytics';
import AchievementSystem from '../gamification/AchievementSystem';
import MultiGenerationalHub from '../collaboration/MultiGenerationalHub';
import { AgeGroup, GrowthMetrics as GrowthMetricsType } from '../../types';
import apiClient from '../../services/ApiClient';

interface ConnectedEnhancedSuperAppProps {
  onBack?: () => void;
}

const ConnectedEnhancedSuperApp: React.FC<ConnectedEnhancedSuperAppProps> = ({ onBack }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedAge, setSelectedAge] = useState<AgeGroup>('young-adults');
  const [selectedMentor, setSelectedMentor] = useState<string>('rohn');
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'achievements' | 'collaboration'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Enhanced state management
  const [growthMetrics, setGrowthMetrics] = useState<GrowthMetricsType>({
    wisdom: 0,
    creativity: 0,
    technical: 0,
    leadership: 0,
    emotional: 0,
    physical: 0,
  });

  const [historicalData, setHistoricalData] = useState<Array<{timestamp: number, metrics: GrowthMetricsType}>>([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      initializeApp();
    } else {
      setShowAuthModal(true);
    }
  }, [isAuthenticated, user]);

  const initializeApp = async () => {
    try {
      setIsLoading(true);
      await loadUserData();
      await generateHistoricalData();
    } catch (error) {
      console.error('Failed to initialize app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const response = await apiClient.getUserProfile();
      if (response.success && response.data) {
        setSelectedAge(response.data.ageGroup || 'young-adults');
        if (response.data.growthMetrics) {
          setGrowthMetrics(response.data.growthMetrics);
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const generateHistoricalData = async () => {
    try {
      const response = await apiClient.getGrowthHistory(30);
      if (response.success) {
        const formattedData = response.data.map((entry: any) => ({
          timestamp: entry.timestamp,
          metrics: entry.metrics
        }));
        setHistoricalData(formattedData);
      }
    } catch (error) {
      console.error('Failed to load historical data:', error);
      // Generate mock data for demo
      generateMockHistoricalData();
    }
  };

  const generateMockHistoricalData = () => {
    const data = [];
    const now = Date.now();
    
    for (let i = 29; i >= 0; i--) {
      const timestamp = now - (i * 24 * 60 * 60 * 1000);
      const baseMetrics = { ...growthMetrics };
      
      Object.keys(baseMetrics).forEach(key => {
        const variation = (Math.random() - 0.5) * 10;
        baseMetrics[key as keyof GrowthMetricsType] = Math.max(0, Math.min(100, 
          baseMetrics[key as keyof GrowthMetricsType] + variation - (i * 0.5)
        ));
      });
      
      data.push({ timestamp, metrics: baseMetrics });
    }
    
    setHistoricalData(data);
  };

  const handleMetricsUpdate = async (newMetrics: GrowthMetricsType) => {
    setGrowthMetrics(newMetrics);
    
    // Update historical data
    const newEntry = { timestamp: Date.now(), metrics: newMetrics };
    setHistoricalData(prev => [...prev.slice(-29), newEntry]);
  };

  const exportUserData = async () => {
    try {
      // This would call the backend export endpoint
      const data = {
        user,
        growthMetrics,
        historicalData,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meta-you-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  const shareProgress = async () => {
    const shareData = {
      title: 'My Meta You Progress',
      text: `I'm growing with Meta You! Current Renaissance Score: ${Math.round(Object.values(growthMetrics).reduce((a, b) => a + b, 0) / 6)}%`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Failed to share:', error);
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
      alert('Progress shared to clipboard!');
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowAuthModal(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-indigo-900">
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          initialMode="login"
        />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-serif text-white mb-4">Welcome to Meta You</h1>
            <p className="text-indigo-300 mb-8">Please sign in to continue your growth journey</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-amber-500 to-amber-400 text-white px-6 sm:px-8 py-3 rounded-lg font-medium hover:from-amber-400 hover:to-amber-300 transition-all duration-300"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-indigo-900 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your Meta You experience...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'collaboration', label: 'Collaboration', icon: '🤝' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-indigo-900 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(76,29,149,0.15),rgba(0,0,0,0))] pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Enhanced Header - Responsive */}
        <header className="border-b border-indigo-800/30 bg-indigo-950/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {onBack && (
                  <button
                    onClick={onBack}
                    className="p-2 text-indigo-300 hover:text-white hover:bg-indigo-800/30 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h1 className="text-xl sm:text-2xl font-serif bg-gradient-to-r from-white via-amber-300 to-white bg-clip-text text-transparent">
                    Meta You
                  </h1>
                  <p className="text-xs sm:text-sm text-indigo-300">
                    Welcome back, {user?.firstName}! Renaissance Score: {Math.round(Object.values(growthMetrics).reduce((a, b) => a + b, 0) / 6)}%
                  </p>
                </div>
              </div>
              
              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center space-x-3">
                <button
                  onClick={shareProgress}
                  className="p-2 text-indigo-300 hover:text-white hover:bg-indigo-800/30 rounded-lg transition-colors"
                  title="Share Progress"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={exportUserData}
                  className="p-2 text-indigo-300 hover:text-white hover:bg-indigo-800/30 rounded-lg transition-colors"
                  title="Export Data"
                >
                  <Download className="w-5 h-5" />
                </button>
                <div className="relative group">
                  <button className="p-2 text-indigo-300 hover:text-white hover:bg-indigo-800/30 rounded-lg transition-colors">
                    <User className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-indigo-900 border border-indigo-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-3 border-b border-indigo-700">
                      <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-indigo-300">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2 text-sm text-indigo-300 hover:text-white hover:bg-indigo-800/50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 text-indigo-300 hover:text-white hover:bg-indigo-800/30 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="sm:hidden mt-4 p-4 bg-indigo-900/50 rounded-lg border border-indigo-800/30">
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={shareProgress}
                    className="flex items-center text-indigo-300 hover:text-white transition-colors"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Progress
                  </button>
                  <button
                    onClick={exportUserData}
                    className="flex items-center text-indigo-300 hover:text-white transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-indigo-300 hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
            
            {/* Navigation Tabs - Responsive */}
            <div className="flex space-x-1 mt-4 bg-indigo-900/30 rounded-lg p-1 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 min-w-0 flex items-center justify-center py-2 px-2 sm:px-4 rounded-md transition-all text-sm ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-indigo-300 hover:text-white hover:bg-indigo-800/50'
                  }`}
                >
                  <span className="mr-1 sm:mr-2">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {activeTab === 'overview' && (
            <div className="space-y-6 sm:space-y-8">
              {/* Age Group Selection */}
              <AgeGroupSelector 
                selectedAge={selectedAge} 
                onAgeChange={setSelectedAge} 
              />

              {/* Mentor Selection */}
              <MentorSelector 
                selectedMentor={selectedMentor} 
                onMentorChange={setSelectedMentor} 
              />

              {/* Main Content Grid - Responsive */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
                {/* Innovation Hub - Takes 2 columns on xl screens */}
                <div className="xl:col-span-2">
                  <InnovationHub 
                    selectedAge={selectedAge} 
                    selectedMentor={selectedMentor} 
                  />
                </div>
                
                {/* Growth Metrics */}
                <div className="xl:col-span-1">
                  <ConnectedGrowthMetrics 
                    onMetricsUpdate={handleMetricsUpdate}
                  />
                </div>
              </div>

              {/* Challenge Tracker */}
              <ChallengeTracker selectedAge={selectedAge} />
            </div>
          )}

          {activeTab === 'analytics' && (
            <AdvancedAnalytics
              userId={user?.id || 'demo'}
              currentMetrics={growthMetrics}
              historicalData={historicalData}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementSystem userId={user?.id || 'demo'} />
          )}

          {activeTab === 'collaboration' && (
            <MultiGenerationalHub />
          )}
        </div>

        {/* Footer - Responsive */}
        <footer className="border-t border-indigo-800/30 bg-indigo-950/50 backdrop-blur-sm mt-16">
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 text-center">
            <div className="inline-flex items-center px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-800/50 to-indigo-700/50 rounded-full border border-indigo-600/50 mb-4">
              <span className="text-xs sm:text-sm text-indigo-300">
                Powered by the collective wisdom of history's greatest innovators
              </span>
            </div>
            <p className="text-xs text-indigo-400">
              Jim Rohn • Steve Jobs • Steve Wozniak • Leonardo da Vinci • Eugène Delacroix
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ConnectedEnhancedSuperApp;
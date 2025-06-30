import React, { useState, useEffect } from 'react';
import { Bell, Search, Menu, X, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ScrollableNavigation from '../navigation/ScrollableNavigation';
import AdvancedSearch from '../features/AdvancedSearch';
import NotificationCenter from '../features/NotificationCenter';
import RealTimeChat from '../features/RealTimeChat';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, currentPage, onPageChange }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: () => <span>🏠</span> },
    { id: 'analytics', label: 'Analytics', icon: () => <span>📊</span> },
    { id: 'achievements', label: 'Achievements', icon: () => <span>🏆</span>, badge: 2 },
    { id: 'collaboration', label: 'Collaboration', icon: () => <span>🤝</span> },
    { id: 'ai-chat', label: 'AI Chat', icon: () => <span>🧠</span> },
    { id: 'innovations', label: 'Innovations', icon: () => <span>💡</span> },
    { id: 'challenges', label: 'Challenges', icon: () => <span>🎯</span> },
    { id: 'community', label: 'Community', icon: () => <span>👥</span> },
    { id: 'settings', label: 'Settings', icon: () => <span>⚙️</span> }
  ];

  const handleSearch = async (query: string, filters: Record<string, any>) => {
    // Mock search implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: '1',
        title: `Innovation: ${query}`,
        description: 'A revolutionary approach to personal development',
        category: 'Innovation',
        tags: ['ai', 'growth'],
        date: new Date(),
        relevance: 0.95,
        type: 'innovation' as const
      },
      {
        id: '2',
        title: `User: ${query}`,
        description: 'Expert in creative problem solving',
        category: 'User',
        tags: ['creativity', 'leadership'],
        date: new Date(),
        relevance: 0.87,
        type: 'user' as const
      }
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-indigo-900 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(76,29,149,0.15),rgba(0,0,0,0))] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="flex-shrink-0 border-b border-indigo-800/30 bg-indigo-950/50 backdrop-blur-sm">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo and Title */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-indigo-300 hover:text-white hover:bg-indigo-800/30 rounded-lg transition-colors"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                
                <div>
                  <h1 className="text-xl sm:text-2xl font-serif bg-gradient-to-r from-white via-amber-300 to-white bg-clip-text text-transparent">
                    Meta You
                  </h1>
                  <p className="text-xs sm:text-sm text-indigo-300">
                    Welcome back, {user?.firstName}!
                  </p>
                </div>
              </div>

              {/* Search Bar - Desktop */}
              <div className="hidden md:block flex-1 max-w-2xl mx-8">
                <AdvancedSearch
                  onSearch={handleSearch}
                  placeholder="Search innovations, users, achievements..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Search Button - Mobile */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="md:hidden p-2 text-indigo-300 hover:text-white hover:bg-indigo-800/30 rounded-lg transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Notifications */}
                <button
                  onClick={() => setIsNotificationOpen(true)}
                  className="relative p-2 text-indigo-300 hover:text-white hover:bg-indigo-800/30 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </button>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 text-indigo-300 hover:text-white hover:bg-indigo-800/30 rounded-lg transition-colors">
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm">{user?.firstName}</span>
                  </button>
                  
                  <div className="absolute right-0 top-full mt-2 w-48 bg-indigo-900 border border-indigo-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-3 border-b border-indigo-700">
                      <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-indigo-300">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => onPageChange('settings')}
                        className="w-full flex items-center px-3 py-2 text-sm text-indigo-300 hover:text-white hover:bg-indigo-800/50 rounded transition-colors"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </button>
                      <button
                        onClick={logout}
                        className="w-full flex items-center px-3 py-2 text-sm text-indigo-300 hover:text-white hover:bg-indigo-800/50 rounded transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden mt-4 p-4 bg-indigo-900/50 rounded-lg border border-indigo-800/30">
                <ScrollableNavigation
                  items={navigationItems}
                  onItemClick={(id) => {
                    onPageChange(id);
                    setIsMobileMenuOpen(false);
                  }}
                  orientation="vertical"
                  showScrollButtons={false}
                />
              </div>
            )}
          </div>
        </header>

        {/* Navigation - Desktop */}
        <div className="hidden lg:block flex-shrink-0 border-b border-indigo-800/30 bg-indigo-950/30">
          <div className="px-6 py-2">
            <ScrollableNavigation
              items={navigationItems}
              onItemClick={onPageChange}
              orientation="horizontal"
            />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
              {children}
            </div>
          </div>
        </main>

        {/* Chat Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-amber-500 to-amber-400 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40"
        >
          <span className="text-xl">💬</span>
        </button>
      </div>

      {/* Mobile Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-16 md:hidden">
          <div className="bg-indigo-950/95 backdrop-blur-sm border border-indigo-800/50 rounded-2xl w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Search</h3>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-indigo-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <AdvancedSearch
              onSearch={handleSearch}
              placeholder="Search everything..."
            />
          </div>
        </div>
      )}

      {/* Notification Center */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* Real-time Chat */}
      {isChatOpen && (
        <div className="fixed inset-4 z-50 flex items-end justify-end">
          <div className="w-full max-w-md h-96">
            <RealTimeChat
              roomId="general"
              roomName="General Chat"
              onClose={() => setIsChatOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
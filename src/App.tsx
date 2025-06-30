import React, { useState, Suspense, useCallback, useMemo } from 'react';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { AuthProvider } from './hooks/useAuth';
import Hero from './components/Hero';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import MVPLandingPage from './components/mvp/MVPLandingPage';
import OnboardingFlow from './components/mvp/OnboardingFlow';
import FeatureShowcase from './components/mvp/FeatureShowcase';
import MVPMetrics from './components/mvp/MVPMetrics';
import AppLayout from './components/layout/AppLayout';

// Lazy load the Connected Enhanced Super App
const ConnectedEnhancedSuperApp = React.lazy(() => import('./components/super-app/ConnectedEnhancedSuperApp'));

type AppView = 'landing' | 'onboarding' | 'app';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [currentPage, setCurrentPage] = useState('overview');
  const [onboardingData, setOnboardingData] = useState(null);

  const handleGetStarted = useCallback(() => {
    setCurrentView('onboarding');
  }, []);

  const handleOnboardingComplete = useCallback((data: any) => {
    setOnboardingData(data);
    setCurrentView('app');
  }, []);

  const handleBackToLanding = useCallback(() => {
    setCurrentView('landing');
  }, []);

  const handlePageChange = useCallback((page: string) => {
    setCurrentPage(page);
  }, []);

  // Memoize the loading fallback to prevent re-renders
  const loadingFallback = useMemo(() => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-indigo-900 flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading Meta You Super App..." showProgress={true} />
    </div>
  ), []);

  // Memoize the CTA buttons to prevent re-renders
  const ctaButtons = useMemo(() => (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
      {/* Quick Start Button */}
      <button
        onClick={handleGetStarted}
        className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:scale-110 active:scale-105"
      >
        <span className="relative z-10 flex items-center">
          🚀 Start Your Journey
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
      </button>
      
      {/* Full App Button */}
      <button
        onClick={() => setCurrentView('app')}
        className="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:scale-110 active:scale-105"
      >
        <span className="relative z-10 flex items-center">
          ⚡ Full Platform Demo
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
      </button>
    </div>
  ), [handleGetStarted]);

  // Memoize the status indicator
  const statusIndicator = useMemo(() => (
    <div className="fixed bottom-8 left-8 z-50">
      <div className="bg-green-900/80 backdrop-blur-sm border border-green-700/50 rounded-xl p-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-300 font-medium">MVP Ready</span>
        </div>
        <div className="text-xs text-green-400 mt-1">
          Production-grade • Full-stack • AI-powered
        </div>
      </div>
    </div>
  ), []);

  if (currentView === 'onboarding') {
    return (
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
            <OnboardingFlow onComplete={handleOnboardingComplete} />
          </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    );
  }

  if (currentView === 'app') {
    return (
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
            <Suspense fallback={loadingFallback}>
              <AppLayout 
                currentPage={currentPage}
                onPageChange={handlePageChange}
              >
                <ConnectedEnhancedSuperApp onBack={handleBackToLanding} />
              </AppLayout>
            </Suspense>
          </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary>
          <div className="relative">
            {/* MVP Landing Page */}
            <MVPLandingPage />
            
            {/* Feature Showcase */}
            <FeatureShowcase />
            
            {/* MVP Metrics */}
            <MVPMetrics />
            
            {/* Original Hero Section for Demo */}
            <div className="border-t border-indigo-800/30">
              <Hero />
            </div>
            
            {/* Enhanced CTA Buttons */}
            {ctaButtons}

            {/* MVP Status Indicator */}
            {statusIndicator}
          </div>
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
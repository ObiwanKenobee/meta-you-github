import React, { memo } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import BeliefMapper from './BeliefMapper';
import PhilosophyEngine from './PhilosophyEngine';
import ConnectedMetaTwinChat from './ConnectedMetaTwinChat';

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Left column - Belief Mapper */}
      <div className="lg:col-span-1">
        <ErrorBoundary>
          <BeliefMapper />
        </ErrorBoundary>
      </div>
      
      {/* Middle column - Philosophy Engine */}
      <div className="lg:col-span-1">
        <ErrorBoundary>
          <PhilosophyEngine />
        </ErrorBoundary>
      </div>
      
      {/* Right column - Connected Meta Twin Chat */}
      <div className="lg:col-span-1">
        <ErrorBoundary>
          <ConnectedMetaTwinChat />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default memo(Dashboard);
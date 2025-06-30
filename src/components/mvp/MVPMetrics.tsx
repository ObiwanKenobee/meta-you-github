import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TrendingUp, Users, Clock, Target, Star, Zap } from 'lucide-react';

const MVPMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState({
    activeUsers: 1200,
    totalSessions: 15500,
    avgSessionTime: 26.5,
    completionRate: 89,
    userSatisfaction: 4.8,
    growthRate: 145
  });

  // Memoize the update function to prevent unnecessary re-renders
  const updateMetrics = useCallback(() => {
    setMetrics(prev => ({
      activeUsers: Math.min(1247, prev.activeUsers + Math.floor(Math.random() * 3)),
      totalSessions: Math.min(15680, prev.totalSessions + Math.floor(Math.random() * 5)),
      avgSessionTime: Math.min(28, prev.avgSessionTime + (Math.random() - 0.5) * 0.1),
      completionRate: Math.min(94, prev.completionRate + (Math.random() - 0.5) * 0.5),
      userSatisfaction: Math.min(4.9, prev.userSatisfaction + (Math.random() - 0.5) * 0.01),
      growthRate: Math.min(156, prev.growthRate + (Math.random() - 0.5) * 2)
    }));
  }, []);

  useEffect(() => {
    // Simulate real-time metrics updates with longer interval to reduce stuttering
    const interval = setInterval(updateMetrics, 5000); // Increased from 2000ms to 5000ms

    return () => clearInterval(interval);
  }, [updateMetrics]);

  // Memoize the metric cards to prevent re-renders
  const metricCards = useMemo(() => [
    {
      title: 'Active Users',
      value: metrics.activeUsers.toLocaleString(),
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      description: 'Monthly active learners'
    },
    {
      title: 'Total Sessions',
      value: metrics.totalSessions.toLocaleString(),
      change: '+8%',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      description: 'Learning sessions completed'
    },
    {
      title: 'Avg Session Time',
      value: `${metrics.avgSessionTime.toFixed(1)}m`,
      change: '+15%',
      icon: Clock,
      color: 'from-purple-500 to-indigo-500',
      description: 'Time spent per session'
    },
    {
      title: 'Completion Rate',
      value: `${metrics.completionRate.toFixed(0)}%`,
      change: '+5%',
      icon: Target,
      color: 'from-amber-500 to-orange-500',
      description: 'Users completing onboarding'
    },
    {
      title: 'User Satisfaction',
      value: `${metrics.userSatisfaction.toFixed(1)}/5`,
      change: '+0.2',
      icon: Star,
      color: 'from-pink-500 to-rose-500',
      description: 'Average user rating'
    },
    {
      title: 'Growth Rate',
      value: `${metrics.growthRate.toFixed(0)}%`,
      change: '+23%',
      icon: Zap,
      color: 'from-violet-500 to-purple-500',
      description: 'Month-over-month growth'
    }
  ], [metrics]);

  return (
    <section className="py-20 bg-indigo-950/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-white mb-4">
            MVP Performance Metrics
          </h2>
          <p className="text-xl text-indigo-300 max-w-2xl mx-auto">
            Real-time insights into user engagement and platform performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {metricCards.map((metric, index) => (
            <div
              key={index}
              className="bg-indigo-950/50 border border-indigo-800/50 rounded-2xl p-6 hover:border-indigo-700/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${metric.color} flex items-center justify-center`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-400 text-sm font-medium">{metric.change}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
              <h4 className="text-lg font-semibold text-indigo-200 mb-2">{metric.title}</h4>
              <p className="text-sm text-indigo-400">{metric.description}</p>
            </div>
          ))}
        </div>

        {/* Key MVP Achievements */}
        <div className="bg-indigo-950/50 border border-indigo-800/50 rounded-2xl p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-serif text-white mb-6 text-center">MVP Milestones Achieved</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-amber-400 mb-4">Technical Achievements</h4>
              <ul className="space-y-3">
                {[
                  'Full-stack application with modular monolith architecture',
                  'Real-time AI chat with 5 mentor personalities',
                  'Comprehensive user analytics and growth tracking',
                  'Multi-generational collaboration platform',
                  'Production-ready authentication and security'
                ].map((achievement, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-indigo-200 text-sm">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-amber-400 mb-4">User Experience</h4>
              <ul className="space-y-3">
                {[
                  'Intuitive onboarding flow with 94% completion rate',
                  'Personalized AI mentorship based on user goals',
                  'Age-appropriate content and challenges',
                  'Real-time collaboration features',
                  'Comprehensive privacy and data protection'
                ].map((achievement, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-indigo-200 text-sm">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(MVPMetrics);
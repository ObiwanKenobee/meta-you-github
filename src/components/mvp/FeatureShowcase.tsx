import React, { useState } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, TrendingUp, Users, Brain, Zap } from 'lucide-react';

const FeatureShowcase: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string>('ai-chat');
  const [isPlaying, setIsPlaying] = useState(false);

  const demos = [
    {
      id: 'ai-chat',
      title: 'AI Mentor Conversations',
      description: 'Chat with legendary minds and get personalized guidance',
      icon: Brain,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'growth-tracking',
      title: 'Growth Metrics Dashboard',
      description: 'Track your development across 6 core dimensions',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'collaboration',
      title: 'Multi-Generational Projects',
      description: 'Collaborate across age groups on meaningful projects',
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'insights',
      title: 'Predictive Insights',
      description: 'AI-powered recommendations for your growth journey',
      icon: Zap,
      color: 'from-amber-500 to-orange-500'
    }
  ];

  const renderDemo = () => {
    switch (activeDemo) {
      case 'ai-chat':
        return (
          <div className="bg-indigo-950/50 rounded-2xl p-6 h-96 overflow-hidden">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Jim Rohn</h3>
                <p className="text-indigo-300 text-sm">Personal Development Philosopher</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-4">
              <div className="flex justify-end">
                <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-br-sm max-w-xs">
                  I'm struggling to stay motivated with my goals. Any advice?
                </div>
              </div>
              
              <div className="flex justify-start">
                <div className="bg-indigo-900/50 border border-indigo-700/30 text-indigo-100 p-3 rounded-2xl rounded-bl-sm max-w-sm">
                  Motivation is what gets you started, but habit is what keeps you going. The key is to make your goals so clear and compelling that they pull you forward even when motivation wanes. What specific outcome are you working toward?
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-br-sm max-w-xs">
                  I want to build a successful business, but I keep getting distracted.
                </div>
              </div>
              
              <div className="flex justify-start">
                <div className="bg-indigo-900/50 border border-indigo-700/30 text-indigo-100 p-3 rounded-2xl rounded-bl-sm max-w-sm">
                  Success is nothing more than a few simple disciplines practiced every day. Focus on the fundamentals: clear vision, daily action, and consistent learning. What's one small action you can take today toward your business?
                </div>
              </div>
            </div>
            
            <div className="flex items-center text-xs text-indigo-400">
              <div className="flex space-x-1 mr-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-150"></div>
              </div>
              Jim is thinking...
            </div>
          </div>
        );

      case 'growth-tracking':
        return (
          <div className="bg-indigo-950/50 rounded-2xl p-6 h-96">
            <h3 className="text-white font-semibold mb-6">Your Growth Dashboard</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { name: 'Wisdom', value: 78, color: 'from-purple-400 to-indigo-400' },
                { name: 'Creativity', value: 85, color: 'from-pink-400 to-rose-400' },
                { name: 'Technical', value: 72, color: 'from-cyan-400 to-blue-400' },
                { name: 'Leadership', value: 68, color: 'from-amber-400 to-orange-400' }
              ].map((metric) => (
                <div key={metric.name} className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                    <span className="text-white font-bold">{metric.value}</span>
                  </div>
                  <h4 className="text-sm font-medium text-white">{metric.name}</h4>
                  <div className="w-full h-1 bg-indigo-800 rounded-full mt-1 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${metric.color} transition-all duration-1000`}
                      style={{ width: `${metric.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-indigo-900/30 rounded-xl p-4">
              <h4 className="text-white font-medium mb-2">Renaissance Score</h4>
              <div className="flex items-center justify-between">
                <span className="text-indigo-300">Overall Development</span>
                <span className="text-2xl font-bold text-amber-400">76%</span>
              </div>
              <div className="w-full h-2 bg-indigo-800 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-1000" style={{ width: '76%' }}></div>
              </div>
            </div>
          </div>
        );

      case 'collaboration':
        return (
          <div className="bg-indigo-950/50 rounded-2xl p-6 h-96 overflow-y-auto">
            <h3 className="text-white font-semibold mb-4">Active Collaborations</h3>
            
            <div className="space-y-4">
              {[
                {
                  title: 'Digital Wisdom Archive',
                  participants: ['👵 Eleanor (Senior)', '👨‍💻 Alex (Teen)'],
                  status: 'Active',
                  progress: 65
                },
                {
                  title: 'Sustainable Innovation Lab',
                  participants: ['👩‍🔬 Maya (Young Adult)', '👨‍💼 David (Adult)', '👩‍🔧 Sarah (Middle-age)'],
                  status: 'Planning',
                  progress: 25
                }
              ].map((project, index) => (
                <div key={index} className="bg-indigo-900/30 border border-indigo-800/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{project.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      project.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="text-sm text-indigo-300 mb-3">
                    {project.participants.join(' • ')}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-indigo-400">Progress</span>
                    <span className="text-xs text-indigo-300">{project.progress}%</span>
                  </div>
                  <div className="w-full h-1 bg-indigo-800 rounded-full overflow-hidden mt-1">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-1000"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'insights':
        return (
          <div className="bg-indigo-950/50 rounded-2xl p-6 h-96">
            <h3 className="text-white font-semibold mb-4">AI Insights & Predictions</h3>
            
            <div className="space-y-4">
              {[
                {
                  type: 'Growth Opportunity',
                  title: 'Creative Breakthrough Incoming',
                  description: 'Your creativity metrics show 23% acceleration. Consider starting that art project.',
                  confidence: 87,
                  timeframe: '2-3 weeks',
                  color: 'from-green-500 to-emerald-500'
                },
                {
                  type: 'Skill Synergy',
                  title: 'Technical + Creative Synergy',
                  description: 'Your technical and creative skills create powerful synergy. Perfect time for innovation.',
                  confidence: 92,
                  timeframe: '1 month',
                  color: 'from-purple-500 to-indigo-500'
                },
                {
                  type: 'Breakthrough Moment',
                  title: 'Leadership Development Peak',
                  description: 'Your overall development suggests a leadership breakthrough is approaching.',
                  confidence: 78,
                  timeframe: '2-6 weeks',
                  color: 'from-amber-500 to-orange-500'
                }
              ].map((insight, index) => (
                <div key={index} className="bg-indigo-900/30 border border-indigo-800/30 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-xs px-2 py-1 bg-amber-800/30 text-amber-300 rounded-full">
                        {insight.type}
                      </span>
                      <h4 className="text-white font-medium mt-2">{insight.title}</h4>
                    </div>
                    <span className="text-xs text-indigo-400">{insight.confidence}% confidence</span>
                  </div>
                  
                  <p className="text-sm text-indigo-200 mb-2">{insight.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-indigo-400">
                    <span>Timeframe: {insight.timeframe}</span>
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${insight.color}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="py-20 bg-indigo-900/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-white mb-4">
            See Meta You in action
          </h2>
          <p className="text-xl text-indigo-300 max-w-2xl mx-auto">
            Experience the power of AI-driven personal development
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Demo Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {demos.map((demo) => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className={`p-4 rounded-xl border transition-all text-left ${
                  activeDemo === demo.id
                    ? 'border-amber-500 bg-amber-500/20'
                    : 'border-indigo-700/50 bg-indigo-900/30 hover:border-indigo-600'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${demo.color} flex items-center justify-center mb-3`}>
                  <demo.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-medium text-sm mb-1">{demo.title}</h3>
                <p className="text-indigo-300 text-xs">{demo.description}</p>
              </button>
            ))}
          </div>

          {/* Demo Display */}
          <div className="relative">
            <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 bg-indigo-900/50 border border-indigo-700/50 rounded-lg text-white hover:bg-indigo-800/50 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button className="p-2 bg-indigo-900/50 border border-indigo-700/50 rounded-lg text-white hover:bg-indigo-800/50 transition-colors">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            
            {renderDemo()}
          </div>

          {/* Feature Highlights */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: CheckCircle,
                title: 'Production Ready',
                description: 'Full-stack application with real backend integration'
              },
              {
                icon: Zap,
                title: 'Real-time Updates',
                description: 'Live data synchronization and instant feedback'
              },
              {
                icon: Brain,
                title: 'AI-Powered',
                description: 'Advanced AI mentors with personalized responses'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-indigo-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
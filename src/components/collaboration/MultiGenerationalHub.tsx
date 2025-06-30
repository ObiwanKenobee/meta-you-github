import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Lightbulb, Heart, Star, Globe } from 'lucide-react';
import { AgeGroup } from '../../types';

interface CollaborationProject {
  id: string;
  title: string;
  description: string;
  ageGroups: AgeGroup[];
  participants: Participant[];
  status: 'planning' | 'active' | 'completed';
  category: 'innovation' | 'mentorship' | 'creative' | 'social-impact';
  createdAt: Date;
  completionDate?: Date;
}

interface Participant {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  role: 'mentor' | 'learner' | 'collaborator' | 'facilitator';
  expertise: string[];
  avatar: string;
}

interface WisdomExchange {
  id: string;
  fromParticipant: string;
  toParticipant: string;
  message: string;
  category: 'life-lesson' | 'technical-skill' | 'creative-insight' | 'emotional-wisdom';
  timestamp: Date;
  reactions: Record<string, number>;
}

const MultiGenerationalHub: React.FC = () => {
  const [activeProjects, setActiveProjects] = useState<CollaborationProject[]>([]);
  const [wisdomExchanges, setWisdomExchanges] = useState<WisdomExchange[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [newProjectForm, setNewProjectForm] = useState(false);

  useEffect(() => {
    initializeSampleData();
  }, []);

  const initializeSampleData = () => {
    const sampleProjects: CollaborationProject[] = [
      {
        id: 'proj-1',
        title: 'Digital Wisdom Archive',
        description: 'Seniors share life stories while teens create digital preservation tools',
        ageGroups: ['teens', 'seniors'],
        participants: [
          {
            id: 'p1',
            name: 'Eleanor Chen',
            ageGroup: 'seniors',
            role: 'mentor',
            expertise: ['Life Experience', 'Historical Perspective', 'Resilience'],
            avatar: '👵'
          },
          {
            id: 'p2',
            name: 'Alex Rivera',
            ageGroup: 'teens',
            role: 'learner',
            expertise: ['Web Development', 'Digital Design', 'Social Media'],
            avatar: '👨‍💻'
          }
        ],
        status: 'active',
        category: 'innovation',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'proj-2',
        title: 'Sustainable Innovation Lab',
        description: 'Cross-generational team developing eco-friendly solutions',
        ageGroups: ['young-adults', 'adults', 'middle-age'],
        participants: [
          {
            id: 'p3',
            name: 'Maya Patel',
            ageGroup: 'young-adults',
            role: 'collaborator',
            expertise: ['Environmental Science', 'Research', 'Data Analysis'],
            avatar: '👩‍🔬'
          },
          {
            id: 'p4',
            name: 'David Kim',
            ageGroup: 'adults',
            role: 'facilitator',
            expertise: ['Project Management', 'Business Strategy', 'Leadership'],
            avatar: '👨‍💼'
          },
          {
            id: 'p5',
            name: 'Sarah Johnson',
            ageGroup: 'middle-age',
            role: 'mentor',
            expertise: ['Engineering', 'Manufacturing', 'Quality Control'],
            avatar: '👩‍🔧'
          }
        ],
        status: 'active',
        category: 'social-impact',
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'proj-3',
        title: 'Creative Expression Bridge',
        description: 'Artists from different generations collaborate on multimedia projects',
        ageGroups: ['children', 'middle-age'],
        participants: [
          {
            id: 'p6',
            name: 'Luna Martinez',
            ageGroup: 'children',
            role: 'collaborator',
            expertise: ['Drawing', 'Imagination', 'Storytelling'],
            avatar: '👧'
          },
          {
            id: 'p7',
            name: 'Robert Thompson',
            ageGroup: 'middle-age',
            role: 'mentor',
            expertise: ['Photography', 'Art History', 'Digital Arts'],
            avatar: '👨‍🎨'
          }
        ],
        status: 'planning',
        category: 'creative',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ];

    const sampleExchanges: WisdomExchange[] = [
      {
        id: 'ex-1',
        fromParticipant: 'p1',
        toParticipant: 'p2',
        message: 'In my 70 years, I\'ve learned that the most important innovations come from understanding human needs, not just technology. What problems do you see in your generation that technology could solve?',
        category: 'life-lesson',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        reactions: { '❤️': 5, '💡': 3, '🙏': 2 }
      },
      {
        id: 'ex-2',
        fromParticipant: 'p2',
        toParticipant: 'p1',
        message: 'Thank you for that wisdom! I think mental health support and climate anxiety are huge issues for us. I\'m learning that your generation faced similar challenges with different contexts. Could you share how you dealt with uncertainty?',
        category: 'emotional-wisdom',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        reactions: { '🤝': 4, '💭': 2, '✨': 3 }
      },
      {
        id: 'ex-3',
        fromParticipant: 'p4',
        toParticipant: 'p3',
        message: 'Your research methodology is impressive! In my experience leading teams, I\'ve found that the best innovations come when we combine rigorous analysis with intuitive leaps. Have you considered how your findings might translate to policy recommendations?',
        category: 'technical-skill',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        reactions: { '🎯': 6, '📊': 2, '🚀': 1 }
      }
    ];

    setActiveProjects(sampleProjects);
    setWisdomExchanges(sampleExchanges);
  };

  const getAgeGroupColor = (ageGroup: AgeGroup) => {
    const colors = {
      children: 'from-pink-400 to-purple-400',
      teens: 'from-blue-400 to-cyan-400',
      'young-adults': 'from-green-400 to-emerald-400',
      adults: 'from-amber-400 to-orange-400',
      'middle-age': 'from-indigo-400 to-purple-400',
      seniors: 'from-violet-400 to-pink-400'
    };
    return colors[ageGroup] || 'from-gray-400 to-gray-500';
  };

  const getAgeGroupLabel = (ageGroup: AgeGroup) => {
    const labels = {
      children: 'Young Explorers',
      teens: 'Digital Natives',
      'young-adults': 'Builders',
      adults: 'Leaders',
      'middle-age': 'Wisdom Keepers',
      seniors: 'Sage Mentors'
    };
    return labels[ageGroup] || ageGroup;
  };

  const getCategoryIcon = (category: CollaborationProject['category']) => {
    switch (category) {
      case 'innovation': return '💡';
      case 'mentorship': return '🧠';
      case 'creative': return '🎨';
      case 'social-impact': return '🌍';
      default: return '🤝';
    }
  };

  const renderProjectCard = (project: CollaborationProject) => (
    <div
      key={project.id}
      className={`bg-indigo-900/30 border rounded-xl p-6 transition-all duration-300 cursor-pointer ${
        selectedProject === project.id
          ? 'border-amber-500/50 bg-indigo-800/50'
          : 'border-indigo-800/30 hover:border-indigo-700/50'
      }`}
      onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{getCategoryIcon(project.category)}</span>
          <div>
            <h3 className="text-lg font-semibold text-white">{project.title}</h3>
            <p className="text-sm text-indigo-300 capitalize">{project.category.replace('-', ' ')}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          project.status === 'active' ? 'bg-green-500/20 text-green-300' :
          project.status === 'planning' ? 'bg-yellow-500/20 text-yellow-300' :
          'bg-blue-500/20 text-blue-300'
        }`}>
          {project.status}
        </div>
      </div>

      <p className="text-sm text-indigo-200 mb-4">{project.description}</p>

      {/* Age Groups */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.ageGroups.map(ageGroup => (
          <div
            key={ageGroup}
            className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getAgeGroupColor(ageGroup)} text-white`}
          >
            {getAgeGroupLabel(ageGroup)}
          </div>
        ))}
      </div>

      {/* Participants */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.participants.slice(0, 4).map(participant => (
            <div
              key={participant.id}
              className="w-8 h-8 rounded-full bg-indigo-700 border-2 border-indigo-900 flex items-center justify-center text-sm"
              title={participant.name}
            >
              {participant.avatar}
            </div>
          ))}
          {project.participants.length > 4 && (
            <div className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-indigo-900 flex items-center justify-center text-xs text-white">
              +{project.participants.length - 4}
            </div>
          )}
        </div>
        <span className="text-xs text-indigo-400">
          {project.participants.length} participants
        </span>
      </div>

      {/* Expanded Details */}
      {selectedProject === project.id && (
        <div className="mt-6 pt-6 border-t border-indigo-800/30">
          <h4 className="text-sm font-medium text-white mb-3">Participants</h4>
          <div className="space-y-3">
            {project.participants.map(participant => (
              <div key={participant.id} className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center text-lg">
                  {participant.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white">{participant.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs bg-gradient-to-r ${getAgeGroupColor(participant.ageGroup)} text-white`}>
                      {getAgeGroupLabel(participant.ageGroup)}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-amber-800/30 text-amber-300 rounded-full">
                      {participant.role}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {participant.expertise.map(skill => (
                      <span key={skill} className="text-xs px-2 py-0.5 bg-indigo-800/50 text-indigo-200 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderWisdomExchange = (exchange: WisdomExchange) => {
    const fromParticipant = activeProjects
      .flatMap(p => p.participants)
      .find(p => p.id === exchange.fromParticipant);
    const toParticipant = activeProjects
      .flatMap(p => p.participants)
      .find(p => p.id === exchange.toParticipant);

    if (!fromParticipant || !toParticipant) return null;

    return (
      <div key={exchange.id} className="bg-indigo-900/30 border border-indigo-800/30 rounded-xl p-5">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-full bg-indigo-700 flex items-center justify-center text-xl">
            {fromParticipant.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-white">{fromParticipant.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs bg-gradient-to-r ${getAgeGroupColor(fromParticipant.ageGroup)} text-white`}>
                {getAgeGroupLabel(fromParticipant.ageGroup)}
              </span>
              <span className="text-xs text-indigo-400">→</span>
              <span className="text-sm text-indigo-300">{toParticipant.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                exchange.category === 'life-lesson' ? 'bg-purple-500/20 text-purple-300' :
                exchange.category === 'technical-skill' ? 'bg-blue-500/20 text-blue-300' :
                exchange.category === 'creative-insight' ? 'bg-pink-500/20 text-pink-300' :
                'bg-green-500/20 text-green-300'
              }`}>
                {exchange.category.replace('-', ' ')}
              </span>
            </div>
            
            <p className="text-sm text-indigo-100 mb-3">{exchange.message}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {Object.entries(exchange.reactions).map(([emoji, count]) => (
                  <button
                    key={emoji}
                    className="flex items-center space-x-1 text-xs text-indigo-300 hover:text-white transition-colors"
                  >
                    <span>{emoji}</span>
                    <span>{count}</span>
                  </button>
                ))}
              </div>
              <span className="text-xs text-indigo-400">
                {exchange.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-indigo-950/50 backdrop-blur-sm rounded-2xl p-6 border border-indigo-800/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Globe className="w-6 h-6 text-amber-400 mr-3" />
          <h2 className="text-2xl font-serif text-white">Multi-Generational Hub</h2>
        </div>
        
        <button
          onClick={() => setNewProjectForm(true)}
          className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-2 rounded-lg font-medium hover:from-amber-500 hover:to-amber-400 transition-all duration-300"
        >
          Start Collaboration
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-800/30">
          <div className="flex items-center mb-2">
            <Users className="w-5 h-5 text-blue-400 mr-2" />
            <span className="text-sm font-medium text-white">Active Projects</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{activeProjects.filter(p => p.status === 'active').length}</div>
        </div>

        <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-800/30">
          <div className="flex items-center mb-2">
            <MessageSquare className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-sm font-medium text-white">Wisdom Exchanges</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{wisdomExchanges.length}</div>
        </div>

        <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-800/30">
          <div className="flex items-center mb-2">
            <Heart className="w-5 h-5 text-pink-400 mr-2" />
            <span className="text-sm font-medium text-white">Connections</span>
          </div>
          <div className="text-2xl font-bold text-pink-400">
            {activeProjects.reduce((sum, p) => sum + p.participants.length, 0)}
          </div>
        </div>

        <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-800/30">
          <div className="flex items-center mb-2">
            <Star className="w-5 h-5 text-amber-400 mr-2" />
            <span className="text-sm font-medium text-white">Impact Score</span>
          </div>
          <div className="text-2xl font-bold text-amber-400">94</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Projects */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 text-amber-400 mr-2" />
            Collaboration Projects
          </h3>
          <div className="space-y-4">
            {activeProjects.map(renderProjectCard)}
          </div>
        </div>

        {/* Wisdom Exchanges */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 text-green-400 mr-2" />
            Recent Wisdom Exchanges
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            {wisdomExchanges.map(renderWisdomExchange)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiGenerationalHub;
import React, { useState, useEffect } from 'react';
import { Trophy, Star, Crown, Zap, Target, Award, Medal, Gift } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'growth' | 'innovation' | 'mentorship' | 'consistency' | 'breakthrough';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
  icon: React.ComponentType<any>;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  rewards: string[];
  rarity: number; // 1-100, higher = rarer
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: Date;
}

const AchievementSystem: React.FC<{ userId: string }> = ({ userId }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [recentUnlocks, setRecentUnlocks] = useState<Achievement[]>([]);

  useEffect(() => {
    initializeAchievements();
    loadUserProgress();
  }, [userId]);

  const initializeAchievements = () => {
    const achievementList: Achievement[] = [
      // Growth Achievements
      {
        id: 'first_steps',
        title: 'First Steps',
        description: 'Complete your first growth session',
        category: 'growth',
        tier: 'bronze',
        icon: Target,
        progress: 1,
        maxProgress: 1,
        unlocked: true,
        rewards: ['Growth Tracker Badge', '10 XP'],
        rarity: 95
      },
      {
        id: 'growth_streak_7',
        title: 'Week Warrior',
        description: 'Maintain a 7-day growth streak',
        category: 'consistency',
        tier: 'silver',
        icon: Zap,
        progress: 5,
        maxProgress: 7,
        unlocked: false,
        rewards: ['Consistency Badge', '50 XP', 'Streak Multiplier'],
        rarity: 70
      },
      {
        id: 'wisdom_master',
        title: 'Wisdom Master',
        description: 'Reach 90% in wisdom metrics',
        category: 'growth',
        tier: 'gold',
        icon: Crown,
        progress: 78,
        maxProgress: 90,
        unlocked: false,
        rewards: ['Wisdom Crown', '100 XP', 'Mentor Access'],
        rarity: 25
      },
      {
        id: 'renaissance_soul',
        title: 'Renaissance Soul',
        description: 'Achieve 80%+ in all growth metrics',
        category: 'breakthrough',
        tier: 'platinum',
        icon: Star,
        progress: 4,
        maxProgress: 6,
        unlocked: false,
        rewards: ['Renaissance Badge', '200 XP', 'Master Class Access'],
        rarity: 10
      },
      {
        id: 'legendary_innovator',
        title: 'Legendary Innovator',
        description: 'Complete 10 breakthrough innovations',
        category: 'innovation',
        tier: 'legendary',
        icon: Trophy,
        progress: 2,
        maxProgress: 10,
        unlocked: false,
        rewards: ['Legendary Status', '500 XP', 'Innovation Lab Access', 'Mentor Program'],
        rarity: 1
      },
      // Innovation Achievements
      {
        id: 'first_innovation',
        title: 'Innovation Spark',
        description: 'Complete your first innovation project',
        category: 'innovation',
        tier: 'bronze',
        icon: Zap,
        progress: 1,
        maxProgress: 1,
        unlocked: true,
        rewards: ['Innovator Badge', '25 XP'],
        rarity: 85
      },
      {
        id: 'multi_mentor',
        title: 'Multi-Mentor Mastery',
        description: 'Learn from all 5 legendary mentors',
        category: 'mentorship',
        tier: 'gold',
        icon: Award,
        progress: 3,
        maxProgress: 5,
        unlocked: false,
        rewards: ['Mentorship Master Badge', '150 XP', 'Exclusive Content'],
        rarity: 30
      },
      // Consistency Achievements
      {
        id: 'daily_devotion',
        title: 'Daily Devotion',
        description: 'Complete 30 consecutive days of growth activities',
        category: 'consistency',
        tier: 'gold',
        icon: Medal,
        progress: 12,
        maxProgress: 30,
        unlocked: false,
        rewards: ['Devotion Badge', '100 XP', 'Premium Features'],
        rarity: 40
      }
    ];

    setAchievements(achievementList);
  };

  const loadUserProgress = () => {
    // Simulate loading user progress from storage
    const sampleBadges: Badge[] = [
      {
        id: 'growth_tracker',
        name: 'Growth Tracker',
        description: 'Started your growth journey',
        icon: '📈',
        color: 'from-green-400 to-emerald-400',
        earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'innovator',
        name: 'Innovator',
        description: 'Completed first innovation',
        icon: '💡',
        color: 'from-yellow-400 to-amber-400',
        earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];

    setBadges(sampleBadges);
  };

  const getTierColor = (tier: Achievement['tier']) => {
    switch (tier) {
      case 'bronze': return 'from-amber-600 to-amber-700';
      case 'silver': return 'from-gray-400 to-gray-500';
      case 'gold': return 'from-yellow-400 to-yellow-500';
      case 'platinum': return 'from-purple-400 to-purple-500';
      case 'legendary': return 'from-gradient-to-r from-pink-500 via-purple-500 to-indigo-500';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'growth': return '🌱';
      case 'innovation': return '💡';
      case 'mentorship': return '🧠';
      case 'consistency': return '🔥';
      case 'breakthrough': return '⚡';
      default: return '🏆';
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const unlockedMatch = !showUnlockedOnly || achievement.unlocked;
    return categoryMatch && unlockedMatch;
  });

  const calculateOverallProgress = () => {
    const totalAchievements = achievements.length;
    const unlockedAchievements = achievements.filter(a => a.unlocked).length;
    return Math.round((unlockedAchievements / totalAchievements) * 100);
  };

  const calculateTotalXP = () => {
    return achievements
      .filter(a => a.unlocked)
      .reduce((total, achievement) => {
        const xpReward = achievement.rewards.find(r => r.includes('XP'));
        return total + (xpReward ? parseInt(xpReward.split(' ')[0]) : 0);
      }, 0);
  };

  return (
    <div className="bg-indigo-950/50 backdrop-blur-sm rounded-2xl p-6 border border-indigo-800/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Trophy className="w-6 h-6 text-amber-400 mr-3" />
          <h2 className="text-2xl font-serif text-white">Achievement System</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-lg font-bold text-amber-400">{calculateTotalXP()}</div>
            <div className="text-xs text-indigo-300">Total XP</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">{calculateOverallProgress()}%</div>
            <div className="text-xs text-indigo-300">Complete</div>
          </div>
        </div>
      </div>

      {/* Recent Unlocks */}
      {recentUnlocks.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl border border-amber-700/50">
          <h3 className="text-lg font-semibold text-amber-300 mb-3">🎉 Recent Achievements</h3>
          <div className="flex space-x-3">
            {recentUnlocks.map(achievement => (
              <div key={achievement.id} className="flex items-center space-x-2 bg-amber-800/30 rounded-lg p-2">
                <achievement.icon className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-medium text-white">{achievement.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          {['all', 'growth', 'innovation', 'mentorship', 'consistency', 'breakthrough'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-900/30 text-indigo-300 hover:bg-indigo-800/50'
              }`}
            >
              {category === 'all' ? '🏆' : getCategoryIcon(category as any)} {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        <label className="flex items-center space-x-2 text-sm text-indigo-300">
          <input
            type="checkbox"
            checked={showUnlockedOnly}
            onChange={(e) => setShowUnlockedOnly(e.target.checked)}
            className="rounded border-indigo-600 bg-indigo-900/50"
          />
          <span>Unlocked only</span>
        </label>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredAchievements.map(achievement => (
          <div
            key={achievement.id}
            className={`relative p-5 rounded-xl border transition-all duration-300 ${
              achievement.unlocked
                ? 'bg-gradient-to-br from-indigo-800/50 to-indigo-900/50 border-amber-500/50 shadow-lg shadow-amber-500/20'
                : 'bg-indigo-900/30 border-indigo-800/30 hover:border-indigo-700/50'
            }`}
          >
            {/* Rarity Indicator */}
            <div className="absolute top-2 right-2">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                achievement.rarity <= 5 ? 'bg-purple-500/30 text-purple-300' :
                achievement.rarity <= 20 ? 'bg-yellow-500/30 text-yellow-300' :
                achievement.rarity <= 50 ? 'bg-blue-500/30 text-blue-300' :
                'bg-gray-500/30 text-gray-300'
              }`}>
                {achievement.rarity <= 5 ? 'Legendary' :
                 achievement.rarity <= 20 ? 'Rare' :
                 achievement.rarity <= 50 ? 'Uncommon' : 'Common'}
              </div>
            </div>

            {/* Achievement Icon */}
            <div className={`w-16 h-16 mb-4 rounded-full bg-gradient-to-br ${getTierColor(achievement.tier)} flex items-center justify-center ${
              achievement.unlocked ? '' : 'opacity-50'
            }`}>
              <achievement.icon className="w-8 h-8 text-white" />
            </div>

            {/* Achievement Info */}
            <h3 className={`text-lg font-semibold mb-2 ${achievement.unlocked ? 'text-white' : 'text-indigo-300'}`}>
              {achievement.title}
            </h3>
            <p className="text-sm text-indigo-200 mb-4">{achievement.description}</p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-indigo-400 mb-1">
                <span>Progress</span>
                <span>{achievement.progress}/{achievement.maxProgress}</span>
              </div>
              <div className="w-full h-2 bg-indigo-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${getTierColor(achievement.tier)} transition-all duration-500`}
                  style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                />
              </div>
            </div>

            {/* Rewards */}
            <div>
              <div className="text-xs font-medium text-indigo-300 mb-2">Rewards:</div>
              <div className="flex flex-wrap gap-1">
                {achievement.rewards.map((reward, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 bg-amber-800/30 text-amber-300 rounded-full"
                  >
                    {reward}
                  </span>
                ))}
              </div>
            </div>

            {/* Unlock Status */}
            {achievement.unlocked && (
              <div className="absolute top-2 left-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Badge Collection */}
      <div className="border-t border-indigo-800/30 pt-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Medal className="w-5 h-5 text-amber-400 mr-2" />
          Badge Collection ({badges.length})
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {badges.map(badge => (
            <div
              key={badge.id}
              className="bg-indigo-900/30 border border-indigo-800/30 rounded-xl p-4 text-center hover:border-indigo-700/50 transition-all"
            >
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-2xl`}>
                {badge.icon}
              </div>
              <h4 className="text-sm font-medium text-white mb-1">{badge.name}</h4>
              <p className="text-xs text-indigo-300 mb-2">{badge.description}</p>
              <div className="text-xs text-indigo-400">
                {badge.earnedAt.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementSystem;
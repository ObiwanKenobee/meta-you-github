import React, { useState, useEffect } from 'react';
import { TrendingUp, Brain, Palette, Cpu, Crown, Heart, Zap, Save, RefreshCw } from 'lucide-react';
import { GrowthMetrics as GrowthMetricsType } from '../../types';
import apiClient from '../../services/ApiClient';
import { useAuth } from '../../hooks/useAuth';

interface ConnectedGrowthMetricsProps {
  onMetricsUpdate?: (metrics: GrowthMetricsType) => void;
}

const ConnectedGrowthMetrics: React.FC<ConnectedGrowthMetricsProps> = ({ onMetricsUpdate }) => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<GrowthMetricsType>({
    wisdom: 0,
    creativity: 0,
    technical: 0,
    leadership: 0,
    emotional: 0,
    physical: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const metricItems = [
    { key: 'wisdom', label: 'Wisdom', icon: Brain, color: 'from-purple-400 to-indigo-400' },
    { key: 'creativity', label: 'Creativity', icon: Palette, color: 'from-pink-400 to-rose-400' },
    { key: 'technical', label: 'Technical', icon: Cpu, color: 'from-cyan-400 to-blue-400' },
    { key: 'leadership', label: 'Leadership', icon: Crown, color: 'from-amber-400 to-orange-400' },
    { key: 'emotional', label: 'Emotional', icon: Heart, color: 'from-red-400 to-pink-400' },
    { key: 'physical', label: 'Physical', icon: Zap, color: 'from-green-400 to-emerald-400' },
  ];

  useEffect(() => {
    if (user) {
      loadMetrics();
    }
  }, [user]);

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getUserProfile();
      if (response.success && response.data.growthMetrics) {
        setMetrics(response.data.growthMetrics);
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetricChange = (key: keyof GrowthMetricsType, value: number) => {
    const newMetrics = { ...metrics, [key]: value };
    setMetrics(newMetrics);
    setHasChanges(true);
    onMetricsUpdate?.(newMetrics);
  };

  const saveMetrics = async () => {
    if (!hasChanges) return;

    try {
      setIsSaving(true);
      const response = await apiClient.updateGrowthMetrics({
        metrics,
        source: 'manual',
        notes: 'Manual update from dashboard'
      });

      if (response.success) {
        setHasChanges(false);
        setLastSaved(new Date());
        
        // Track analytics event
        await apiClient.trackEvent({
          eventType: 'growth_metrics_updated',
          eventData: { metrics, source: 'manual' }
        });
      }
    } catch (error) {
      console.error('Failed to save metrics:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const calculateOverallScore = () => {
    return Math.round(Object.values(metrics).reduce((a, b) => a + b, 0) / 6);
  };

  if (isLoading) {
    return (
      <div className="bg-indigo-950/50 backdrop-blur-sm rounded-2xl p-6 border border-indigo-800/50">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-indigo-950/50 backdrop-blur-sm rounded-2xl p-6 border border-indigo-800/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <TrendingUp className="w-6 h-6 text-amber-400 mr-3" />
          <h2 className="text-2xl font-serif text-white">Growth Metrics</h2>
        </div>
        
        <div className="flex items-center space-x-3">
          {lastSaved && (
            <span className="text-xs text-indigo-400">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={saveMetrics}
            disabled={!hasChanges || isSaving}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              hasChanges
                ? 'bg-amber-600 text-white hover:bg-amber-500'
                : 'bg-indigo-800/50 text-indigo-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {metricItems.map(({ key, label, icon: Icon, color }) => {
          const value = metrics[key];
          return (
            <div key={key} className="text-center">
              <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${color} flex items-center justify-center`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-sm font-medium text-white mb-2">{label}</h3>
              
              {/* Interactive slider */}
              <div className="mb-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => handleMetricChange(key, parseInt(e.target.value))}
                  className="w-full h-2 bg-indigo-800 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, rgb(139, 92, 246) 0%, rgb(139, 92, 246) ${value}%, rgb(55, 48, 163) ${value}%, rgb(55, 48, 163) 100%)`
                  }}
                />
              </div>
              
              <div className="text-lg font-bold text-white">{value}%</div>
              
              {/* Growth indicator */}
              <div className="flex items-center justify-center mt-1">
                <TrendingUp className="w-3 h-3 text-green-400 mr-1" />
                <span className="text-xs text-green-400">+{Math.floor(Math.random() * 5) + 1}% this week</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Progress */}
      <div className="p-4 bg-indigo-900/30 rounded-xl border border-indigo-800/30">
        <h3 className="text-lg font-semibold text-white mb-3">Overall Development</h3>
        <div className="flex items-center justify-between">
          <span className="text-indigo-300">Renaissance Score</span>
          <span className="text-2xl font-bold text-amber-400">
            {calculateOverallScore()}%
          </span>
        </div>
        <div className="w-full h-3 bg-indigo-800 rounded-full overflow-hidden mt-2">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-1000"
            style={{ width: `${calculateOverallScore()}%` }}
          ></div>
        </div>
        
        {hasChanges && (
          <div className="mt-3 text-xs text-amber-300 flex items-center">
            <span className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse"></span>
            Unsaved changes
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectedGrowthMetrics;
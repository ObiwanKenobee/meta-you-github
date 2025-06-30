import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, Brain, Target, Zap, Eye } from 'lucide-react';
import { GrowthMathematics, WisdomMetrics } from '../../utils/mathematics';
import { GrowthMetrics } from '../../types';

interface AnalyticsProps {
  userId: string;
  currentMetrics: GrowthMetrics;
  historicalData: Array<{timestamp: number, metrics: GrowthMetrics}>;
}

const AdvancedAnalytics: React.FC<AnalyticsProps> = ({ 
  userId, 
  currentMetrics, 
  historicalData 
}) => {
  const [selectedMetric, setSelectedMetric] = useState<keyof GrowthMetrics>('wisdom');
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  const [analysisType, setAnalysisType] = useState<'trend' | 'prediction' | 'correlation'>('trend');

  const analyticsData = useMemo(() => {
    const filteredData = historicalData.filter(entry => {
      const cutoff = Date.now() - (timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90) * 24 * 60 * 60 * 1000;
      return entry.timestamp >= cutoff;
    });

    const metricValues = filteredData.map(entry => entry.metrics[selectedMetric]);
    const momentum = GrowthMathematics.calculateMomentum(metricValues);
    const prediction = GrowthMathematics.predictNextValue(metricValues, 'polynomial');
    
    return {
      values: metricValues,
      momentum,
      prediction,
      growth: metricValues.length > 1 ? 
        ((metricValues[metricValues.length - 1] - metricValues[0]) / metricValues[0]) * 100 : 0
    };
  }, [historicalData, selectedMetric, timeframe]);

  const wisdomScore = useMemo(() => {
    return WisdomMetrics.calculateWisdomScore(
      currentMetrics.wisdom,
      currentMetrics.emotional,
      currentMetrics.leadership,
      currentMetrics.creativity
    );
  }, [currentMetrics]);

  const correlationMatrix = useMemo(() => {
    const metrics = Object.keys(currentMetrics) as Array<keyof GrowthMetrics>;
    const matrix: Record<string, Record<string, number>> = {};
    
    metrics.forEach(metric1 => {
      matrix[metric1] = {};
      metrics.forEach(metric2 => {
        if (metric1 === metric2) {
          matrix[metric1][metric2] = 1;
        } else {
          const values1 = historicalData.map(entry => entry.metrics[metric1]);
          const values2 = historicalData.map(entry => entry.metrics[metric2]);
          matrix[metric1][metric2] = calculateCorrelation(values1, values2);
        }
      });
    });
    
    return matrix;
  }, [historicalData, currentMetrics]);

  const calculateCorrelation = (x: number[], y: number[]): number => {
    if (x.length !== y.length || x.length === 0) return 0;
    
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  };

  const renderTrendAnalysis = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-800/30">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-sm font-medium text-white">Growth Rate</span>
          </div>
          <div className="text-2xl font-bold text-green-400">
            {analyticsData.growth > 0 ? '+' : ''}{analyticsData.growth.toFixed(1)}%
          </div>
          <div className="text-xs text-indigo-300">Over {timeframe}</div>
        </div>

        <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-800/30">
          <div className="flex items-center mb-2">
            <Zap className="w-5 h-5 text-amber-400 mr-2" />
            <span className="text-sm font-medium text-white">Momentum</span>
          </div>
          <div className="text-2xl font-bold text-amber-400">
            {analyticsData.momentum.toFixed(2)}
          </div>
          <div className="text-xs text-indigo-300">Points/period</div>
        </div>

        <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-800/30">
          <div className="flex items-center mb-2">
            <Eye className="w-5 h-5 text-purple-400 mr-2" />
            <span className="text-sm font-medium text-white">Prediction</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">
            {analyticsData.prediction.toFixed(0)}
          </div>
          <div className="text-xs text-indigo-300">Next period</div>
        </div>
      </div>

      <div className="bg-indigo-900/30 rounded-xl p-6 border border-indigo-800/30">
        <h3 className="text-lg font-semibold text-white mb-4">Growth Trajectory</h3>
        <div className="h-64 flex items-end justify-between space-x-1">
          {analyticsData.values.map((value, index) => (
            <div
              key={index}
              className="bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t flex-1 transition-all duration-300 hover:from-amber-500 hover:to-amber-400"
              style={{ height: `${(value / 100) * 100}%` }}
              title={`${value.toFixed(1)}%`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-indigo-400 mt-2">
          <span>Start</span>
          <span>Current</span>
        </div>
      </div>
    </div>
  );

  const renderPredictionAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-indigo-900/30 rounded-xl p-6 border border-indigo-800/30">
        <h3 className="text-lg font-semibold text-white mb-4">Predictive Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-indigo-300 mb-3">Growth Projections</h4>
            {Object.entries(currentMetrics).map(([metric, value]) => {
              const historical = historicalData.map(entry => entry.metrics[metric as keyof GrowthMetrics]);
              const prediction = GrowthMathematics.predictNextValue(historical, 'polynomial');
              const change = prediction - value;
              
              return (
                <div key={metric} className="flex items-center justify-between py-2">
                  <span className="text-sm text-white capitalize">{metric}</span>
                  <div className="flex items-center">
                    <span className="text-sm text-indigo-300 mr-2">{value.toFixed(0)}%</span>
                    <span className={`text-sm font-medium ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {change > 0 ? '+' : ''}{change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <h4 className="text-sm font-medium text-indigo-300 mb-3">Breakthrough Probability</h4>
            <div className="space-y-3">
              {Object.entries(currentMetrics).map(([metric, value]) => {
                const probability = Math.min(100, Math.max(0, (value - 60) * 2));
                return (
                  <div key={metric}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white capitalize">{metric}</span>
                      <span className="text-indigo-300">{probability.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-2 bg-indigo-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-400 to-amber-400 transition-all duration-500"
                        style={{ width: `${probability}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-900/30 rounded-xl p-6 border border-indigo-800/30">
        <h3 className="text-lg font-semibold text-white mb-4">Wisdom Integration Score</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(99, 102, 241, 0.3)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#wisdomGradient)"
                strokeWidth="8"
                strokeDasharray={`${(wisdomScore / 100) * 251.2} 251.2`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="wisdomGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">{wisdomScore.toFixed(0)}</div>
                <div className="text-xs text-indigo-300">Wisdom Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCorrelationAnalysis = () => (
    <div className="bg-indigo-900/30 rounded-xl p-6 border border-indigo-800/30">
      <h3 className="text-lg font-semibold text-white mb-4">Skill Correlation Matrix</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-sm font-medium text-indigo-300 p-2"></th>
              {Object.keys(currentMetrics).map(metric => (
                <th key={metric} className="text-center text-xs font-medium text-indigo-300 p-2 capitalize">
                  {metric.slice(0, 4)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(correlationMatrix).map(([metric1, correlations]) => (
              <tr key={metric1}>
                <td className="text-sm font-medium text-white p-2 capitalize">{metric1}</td>
                {Object.entries(correlations).map(([metric2, correlation]) => (
                  <td key={metric2} className="p-2">
                    <div 
                      className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium ${
                        correlation > 0.7 ? 'bg-green-500/30 text-green-300' :
                        correlation > 0.3 ? 'bg-yellow-500/30 text-yellow-300' :
                        correlation > -0.3 ? 'bg-gray-500/30 text-gray-300' :
                        'bg-red-500/30 text-red-300'
                      }`}
                    >
                      {correlation.toFixed(1)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-xs text-indigo-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500/30 rounded mr-1"></div>
            <span>Strong (0.7+)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500/30 rounded mr-1"></div>
            <span>Moderate (0.3-0.7)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-500/30 rounded mr-1"></div>
            <span>Weak (-0.3-0.3)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500/30 rounded mr-1"></div>
            <span>Negative (-0.3-)</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-indigo-950/50 backdrop-blur-sm rounded-2xl p-6 border border-indigo-800/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BarChart3 className="w-6 h-6 text-amber-400 mr-3" />
          <h2 className="text-2xl font-serif text-white">Advanced Analytics</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as keyof GrowthMetrics)}
            className="bg-indigo-900/50 border border-indigo-700 rounded-lg px-3 py-1 text-sm text-white"
          >
            {Object.keys(currentMetrics).map(metric => (
              <option key={metric} value={metric} className="capitalize">
                {metric}
              </option>
            ))}
          </select>
          
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="bg-indigo-900/50 border border-indigo-700 rounded-lg px-3 py-1 text-sm text-white"
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="quarter">Quarter</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-1 mb-6 bg-indigo-900/30 rounded-lg p-1">
        {[
          { key: 'trend', label: 'Trends', icon: TrendingUp },
          { key: 'prediction', label: 'Predictions', icon: Brain },
          { key: 'correlation', label: 'Correlations', icon: Target }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setAnalysisType(key as any)}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all ${
              analysisType === key
                ? 'bg-indigo-600 text-white'
                : 'text-indigo-300 hover:text-white hover:bg-indigo-800/50'
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </button>
        ))}
      </div>

      {analysisType === 'trend' && renderTrendAnalysis()}
      {analysisType === 'prediction' && renderPredictionAnalysis()}
      {analysisType === 'correlation' && renderCorrelationAnalysis()}
    </div>
  );
};

export default AdvancedAnalytics;
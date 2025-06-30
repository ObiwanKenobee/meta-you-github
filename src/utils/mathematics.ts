// Mathematical innovations and algorithms for Meta You
export class GoldenRatioCalculator {
  static readonly PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  
  static fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
  
  static fibonacciSequence(length: number): number[] {
    const sequence = [0, 1];
    for (let i = 2; i < length; i++) {
      sequence[i] = sequence[i - 1] + sequence[i - 2];
    }
    return sequence.slice(0, length);
  }
  
  static goldenRatioSpiral(steps: number): Array<{x: number, y: number, radius: number}> {
    const points = [];
    let angle = 0;
    const angleIncrement = (2 * Math.PI) / this.PHI;
    
    for (let i = 0; i < steps; i++) {
      const radius = Math.sqrt(i) * 10;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      points.push({ x, y, radius: radius / 10 });
      angle += angleIncrement;
    }
    
    return points;
  }
  
  static optimalGrowthRate(current: number, target: number, timeframe: number): number {
    return Math.pow(target / current, 1 / timeframe) - 1;
  }
}

export class PersonalityMathematics {
  static calculatePersonalityVector(traits: Record<string, number>): number[] {
    const values = Object.values(traits);
    const magnitude = Math.sqrt(values.reduce((sum, val) => sum + val * val, 0));
    return values.map(val => val / magnitude);
  }
  
  static personalityDistance(vector1: number[], vector2: number[]): number {
    return Math.sqrt(
      vector1.reduce((sum, val, i) => sum + Math.pow(val - vector2[i], 2), 0)
    );
  }
  
  static calculateSynergy(person1: number[], person2: number[]): number {
    const dotProduct = person1.reduce((sum, val, i) => sum + val * person2[i], 0);
    return Math.max(0, dotProduct); // Positive synergy only
  }
}

export class GrowthMathematics {
  static exponentialGrowth(initial: number, rate: number, time: number): number {
    return initial * Math.pow(1 + rate, time);
  }
  
  static logisticGrowth(time: number, carryingCapacity: number, growthRate: number, midpoint: number): number {
    return carryingCapacity / (1 + Math.exp(-growthRate * (time - midpoint)));
  }
  
  static calculateMomentum(values: number[]): number {
    if (values.length < 2) return 0;
    
    const changes = values.slice(1).map((val, i) => val - values[i]);
    const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    const acceleration = changes.length > 1 ? 
      (changes[changes.length - 1] - changes[0]) / (changes.length - 1) : 0;
    
    return avgChange + acceleration * 0.5;
  }
  
  static predictNextValue(values: number[], method: 'linear' | 'exponential' | 'polynomial' = 'linear'): number {
    if (values.length < 2) return values[0] || 0;
    
    switch (method) {
      case 'linear': {
        const slope = (values[values.length - 1] - values[0]) / (values.length - 1);
        return values[values.length - 1] + slope;
      }
      
      case 'exponential': {
        const growthRate = Math.pow(values[values.length - 1] / values[0], 1 / (values.length - 1)) - 1;
        return values[values.length - 1] * (1 + growthRate);
      }
      
      case 'polynomial': {
        // Simple quadratic fit for polynomial prediction
        const n = values.length;
        const x = Array.from({length: n}, (_, i) => i);
        const y = values;
        
        // Calculate quadratic coefficients using least squares
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        return slope * n + intercept;
      }
      
      default:
        return values[values.length - 1];
    }
  }
}

export class WisdomMetrics {
  static calculateWisdomScore(
    experience: number,
    reflection: number,
    application: number,
    teaching: number
  ): number {
    // Wisdom = Experience × Reflection × Application × Teaching (geometric mean)
    return Math.pow(experience * reflection * application * teaching, 0.25) * 100;
  }
  
  static calculateInsightPotential(
    curiosity: number,
    knowledge: number,
    creativity: number,
    intuition: number
  ): number {
    // Non-linear combination favoring balanced development
    const balance = 1 - this.calculateVariance([curiosity, knowledge, creativity, intuition]) / 100;
    const average = (curiosity + knowledge + creativity + intuition) / 4;
    return average * (1 + balance * 0.5);
  }
  
  private static calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }
}
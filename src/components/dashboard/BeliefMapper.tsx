import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { Network } from 'lucide-react';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';

interface Node {
  id: string;
  label: string;
  value: number;
  x: number;
  y: number;
}

interface Link {
  source: string;
  target: string;
  strength: number;
}

const BeliefMapper: React.FC = () => {
  usePerformanceMonitor('BeliefMapper');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  // Memoize static data to prevent unnecessary re-renders
  const nodes: Node[] = useMemo(() => [
    { id: 'growth', label: 'Growth', value: 8, x: 0.3, y: 0.3 },
    { id: 'compassion', label: 'Compassion', value: 10, x: 0.7, y: 0.2 },
    { id: 'wisdom', label: 'Wisdom', value: 6, x: 0.5, y: 0.6 },
    { id: 'balance', label: 'Balance', value: 9, x: 0.2, y: 0.7 },
    { id: 'authenticity', label: 'Authenticity', value: 7, x: 0.8, y: 0.8 },
  ], []);
  
  const links: Link[] = useMemo(() => [
    { source: 'growth', target: 'wisdom', strength: 0.7 },
    { source: 'compassion', target: 'balance', strength: 0.8 },
    { source: 'wisdom', target: 'authenticity', strength: 0.5 },
    { source: 'growth', target: 'compassion', strength: 0.6 },
    { source: 'balance', target: 'authenticity', strength: 0.9 },
  ], []);

  // Optimized resize handler with debouncing
  const resizeCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    resizeCanvas();
    
    // Throttled resize listener
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation variables
    let time = 0;
    let lastFrameTime = 0;
    
    const draw = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTime;
      
      // Limit to 60fps for performance
      if (deltaTime < 16.67) {
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }
      
      lastFrameTime = currentTime;
      time += 0.005;
      
      // Clear canvas with optimized method
      ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
      
      // Draw links with optimized rendering
      ctx.save();
      links.forEach(link => {
        const source = nodes.find(n => n.id === link.source);
        const target = nodes.find(n => n.id === link.target);
        
        if (source && target) {
          const sourceX = source.x * (canvas.width / (window.devicePixelRatio || 1));
          const sourceY = source.y * (canvas.height / (window.devicePixelRatio || 1));
          const targetX = target.x * (canvas.width / (window.devicePixelRatio || 1));
          const targetY = target.y * (canvas.height / (window.devicePixelRatio || 1));
          
          // Optimized gradient creation
          const gradient = ctx.createLinearGradient(sourceX, sourceY, targetX, targetY);
          gradient.addColorStop(0, `rgba(139, 92, 246, ${0.3 + Math.sin(time * 2) * 0.1})`);
          gradient.addColorStop(1, `rgba(217, 119, 6, ${0.3 + Math.cos(time * 2) * 0.1})`);
          
          ctx.beginPath();
          ctx.moveTo(sourceX, sourceY);
          ctx.lineTo(targetX, targetY);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2 * link.strength;
          ctx.stroke();
          
          // Optimized particle rendering
          const particleCount = Math.floor(link.strength * 2); // Reduced for performance
          for (let i = 0; i < particleCount; i++) {
            const t = (time * (0.5 + link.strength) + i / particleCount) % 1;
            const x = sourceX + (targetX - sourceX) * t;
            const y = sourceY + (targetY - sourceY) * t;
            
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(251, 191, 36, ${0.7 + Math.sin(time * 3) * 0.3})`;
            ctx.fill();
          }
        }
      });
      ctx.restore();
      
      // Draw nodes with optimized rendering
      ctx.save();
      nodes.forEach(node => {
        const x = node.x * (canvas.width / (window.devicePixelRatio || 1));
        const y = node.y * (canvas.height / (window.devicePixelRatio || 1));
        const radius = 10 + node.value * 1.5;
        
        // Optimized glow effect
        const glowRadius = radius + 10 + Math.sin(time * 3) * 3;
        const glow = ctx.createRadialGradient(x, y, radius, x, y, glowRadius);
        glow.addColorStop(0, 'rgba(139, 92, 246, 0.8)');
        glow.addColorStop(1, 'rgba(139, 92, 246, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
        
        // Node circle
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        const nodeGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        nodeGradient.addColorStop(0, 'rgba(167, 139, 250, 1)');
        nodeGradient.addColorStop(1, 'rgba(139, 92, 246, 1)');
        ctx.fillStyle = nodeGradient;
        ctx.fill();
        
        // Optimized text rendering
        ctx.font = '12px Inter, sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, x, y + radius + 15);
      });
      ctx.restore();
      
      animationFrameRef.current = requestAnimationFrame(draw);
    };
    
    animationFrameRef.current = requestAnimationFrame(draw);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearTimeout(resizeTimeout);
    };
  }, [nodes, links, resizeCanvas]);
  
  return (
    <div className="bg-indigo-950/50 backdrop-blur-sm rounded-2xl p-5 h-96 border border-indigo-800/50">
      <div className="flex items-center mb-4">
        <Network size={18} className="text-indigo-400 mr-2" />
        <h3 className="text-lg font-medium text-white">Belief Mapper</h3>
      </div>
      
      <canvas 
        ref={canvasRef} 
        className="w-full h-[calc(100%-2rem)] rounded-lg"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
};

export default React.memo(BeliefMapper);
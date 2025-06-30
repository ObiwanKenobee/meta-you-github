import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Star, Users, Brain, TrendingUp, Shield, Zap } from 'lucide-react';

const MVPLandingPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // In real implementation, this would call your backend
  };

  const features = [
    {
      icon: Brain,
      title: "AI Mentorship",
      description: "Learn from 5 legendary minds: Jim Rohn, Steve Jobs, Steve Wozniak, Leonardo da Vinci, and Eugène Delacroix",
      status: "live"
    },
    {
      icon: TrendingUp,
      title: "Growth Tracking",
      description: "Track 6 core metrics: Wisdom, Creativity, Technical, Leadership, Emotional, and Physical development",
      status: "live"
    },
    {
      icon: Users,
      title: "Multi-Generational Collaboration",
      description: "Connect across age groups for wisdom exchange and collaborative innovation projects",
      status: "live"
    },
    {
      icon: Shield,
      title: "Privacy-First Design",
      description: "Your data stays secure with enterprise-grade encryption and transparent data practices",
      status: "live"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Designer",
      content: "Meta You helped me integrate technical skills with creative thinking. The AI mentors provide insights I never would have discovered alone.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Engineering Student",
      content: "The multi-generational collaboration feature connected me with a retired engineer who became my mentor. Invaluable experience.",
      rating: 5
    },
    {
      name: "Dr. Emily Watson",
      role: "Researcher",
      content: "As someone in my 50s, I love how Meta You helps me share wisdom while learning new technologies from younger generations.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-indigo-900">
      {/* Hero Section - Responsive */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(76,29,149,0.15),rgba(0,0,0,0))]"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-xs sm:text-sm font-medium mb-6 sm:mb-8">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Now Live: Full-Stack AI-Powered Platform
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif mb-4 sm:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-amber-300 to-white bg-clip-text text-transparent">
                Design the mind.
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-white to-amber-300 bg-clip-text text-transparent">
                Align the life.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-indigo-200 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Your AI-powered personal operating system for intentional living and growth. 
              Learn from history's greatest minds while connecting across generations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12">
              <button className="w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-amber-500 to-amber-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] hover:scale-105">
                <span className="relative z-10 flex items-center justify-center">
                  Try Full Platform Free
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button className="w-full sm:w-auto text-indigo-200 hover:text-white px-6 sm:px-8 py-3 sm:py-4 border border-indigo-700/50 rounded-xl font-semibold transition-all duration-300 hover:border-indigo-500 hover:bg-indigo-900/30">
                Watch Demo (2 min)
              </button>
            </div>

            {/* Social Proof - Responsive */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-indigo-300">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 border-2 border-indigo-900 flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-sm">1,200+ active learners</span>
              </div>
              
              <div className="flex items-center">
                <div className="flex text-amber-400 mr-2">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />)}
                </div>
                <span className="text-sm">4.9/5 average rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Responsive */}
      <section className="py-12 sm:py-20 bg-indigo-900/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif text-white mb-4">
              Everything you need for personal transformation
            </h2>
            <p className="text-lg sm:text-xl text-indigo-300 max-w-2xl mx-auto">
              A complete ecosystem for growth, learning, and collaboration across generations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="bg-indigo-950/50 border border-indigo-800/50 rounded-2xl p-6 sm:p-8 hover:border-amber-500/50 transition-all duration-300">
                <div className="flex items-start mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl flex items-center justify-center mr-4">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center mb-2 gap-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-white">{feature.title}</h3>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-full self-start">
                        {feature.status}
                      </span>
                    </div>
                    <p className="text-indigo-200">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Responsive */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif text-white mb-4">
              Trusted by learners worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-indigo-950/50 border border-indigo-800/50 rounded-2xl p-6">
                <div className="flex text-amber-400 mb-4">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= testimonial.rating ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <p className="text-indigo-200 mb-6">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-indigo-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Responsive */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-indigo-900 to-indigo-800">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif text-white mb-4 sm:mb-6">
            Ready to transform your potential?
          </h2>
          <p className="text-lg sm:text-xl text-indigo-200 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of learners already growing with Meta You's AI-powered platform
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 rounded-lg bg-indigo-950/50 border border-indigo-700 text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-amber-400 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-400 hover:to-amber-300 transition-all duration-300"
              >
                Get Started
              </button>
            </form>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mr-3" />
                <span className="text-lg sm:text-xl font-semibold text-white">Thank you!</span>
              </div>
              <p className="text-indigo-200">
                We'll send you early access to Meta You's full platform.
              </p>
            </div>
          )}

          <div className="mt-6 sm:mt-8 text-sm text-indigo-400">
            Free 14-day trial • No credit card required • Cancel anytime
          </div>
        </div>
      </section>
    </div>
  );
};

export default MVPLandingPage;
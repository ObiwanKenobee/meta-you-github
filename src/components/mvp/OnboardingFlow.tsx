import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, User, Target, Brain, Sparkles } from 'lucide-react';
import { AgeGroup } from '../../types';

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

interface OnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  ageGroup: AgeGroup;
  goals: string[];
  preferredMentor: string;
  learningStyle: string;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<Partial<OnboardingData>>({
    goals: [],
  });

  const steps = [
    { title: 'Welcome', icon: Sparkles },
    { title: 'About You', icon: User },
    { title: 'Your Goals', icon: Target },
    { title: 'Choose Mentor', icon: Brain },
    { title: 'Complete', icon: CheckCircle }
  ];

  const ageGroups = [
    { value: 'children', label: 'Young Explorer (5-12)', emoji: '🌟' },
    { value: 'teens', label: 'Digital Native (13-17)', emoji: '🚀' },
    { value: 'young-adults', label: 'Builder (18-25)', emoji: '⚡' },
    { value: 'adults', label: 'Leader (26-40)', emoji: '👑' },
    { value: 'middle-age', label: 'Wisdom Keeper (41-60)', emoji: '🏔️' },
    { value: 'seniors', label: 'Sage Mentor (60+)', emoji: '⭐' }
  ];

  const goals = [
    'Develop leadership skills',
    'Enhance creativity',
    'Build technical expertise',
    'Improve emotional intelligence',
    'Find life purpose',
    'Start a business',
    'Learn new skills',
    'Connect with mentors',
    'Share wisdom with others',
    'Collaborate on projects'
  ];

  const mentors = [
    { id: 'rohn', name: 'Jim Rohn', specialty: 'Life Philosophy & Personal Development', emoji: '🧠' },
    { id: 'jobs', name: 'Steve Jobs', specialty: 'Innovation & Design Thinking', emoji: '💡' },
    { id: 'wozniak', name: 'Steve Wozniak', specialty: 'Technical Innovation & Problem Solving', emoji: '⚙️' },
    { id: 'davinci', name: 'Leonardo da Vinci', specialty: 'Renaissance Thinking & Creativity', emoji: '🎨' },
    { id: 'delacroix', name: 'Eugène Delacroix', specialty: 'Emotional Expression & Artistry', emoji: '🖌️' }
  ];

  const learningStyles = [
    { id: 'visual', name: 'Visual', description: 'Learn through images, diagrams, and visual aids', emoji: '👁️' },
    { id: 'auditory', name: 'Auditory', description: 'Learn through listening and discussion', emoji: '👂' },
    { id: 'kinesthetic', name: 'Kinesthetic', description: 'Learn through hands-on experience', emoji: '✋' },
    { id: 'reading', name: 'Reading/Writing', description: 'Learn through text and written materials', emoji: '📚' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data as OnboardingData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleGoal = (goal: string) => {
    const currentGoals = data.goals || [];
    if (currentGoals.includes(goal)) {
      setData({ ...data, goals: currentGoals.filter(g => g !== goal) });
    } else {
      setData({ ...data, goals: [...currentGoals, goal] });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-serif text-white mb-4">Welcome to Meta You!</h2>
            <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
              Let's personalize your journey with AI mentors and create your growth path. 
              This will take just 2 minutes.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {['🧠 AI Mentors', '📊 Growth Tracking', '🤝 Collaboration', '🎯 Personalized'].map((feature, idx) => (
                <div key={idx} className="bg-indigo-900/30 rounded-lg p-3 text-sm text-indigo-200">
                  {feature}
                </div>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div>
            <h2 className="text-3xl font-serif text-white mb-6 text-center">Tell us about yourself</h2>
            <div className="max-w-md mx-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-300 mb-2">First Name</label>
                  <input
                    type="text"
                    value={data.firstName || ''}
                    onChange={(e) => setData({ ...data, firstName: e.target.value })}
                    className="w-full px-4 py-3 bg-indigo-900/30 border border-indigo-700/50 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={data.lastName || ''}
                    onChange={(e) => setData({ ...data, lastName: e.target.value })}
                    className="w-full px-4 py-3 bg-indigo-900/30 border border-indigo-700/50 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="Last name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-indigo-300 mb-2">Email</label>
                <input
                  type="email"
                  value={data.email || ''}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full px-4 py-3 bg-indigo-900/30 border border-indigo-700/50 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-300 mb-4">Age Group</label>
                <div className="grid grid-cols-1 gap-3">
                  {ageGroups.map((group) => (
                    <button
                      key={group.value}
                      onClick={() => setData({ ...data, ageGroup: group.value as AgeGroup })}
                      className={`flex items-center p-3 rounded-lg border transition-all ${
                        data.ageGroup === group.value
                          ? 'border-amber-500 bg-amber-500/20'
                          : 'border-indigo-700/50 bg-indigo-900/30 hover:border-indigo-600'
                      }`}
                    >
                      <span className="text-2xl mr-3">{group.emoji}</span>
                      <span className="text-white font-medium">{group.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-3xl font-serif text-white mb-6 text-center">What are your goals?</h2>
            <p className="text-indigo-200 text-center mb-8">Select all that apply (you can change these later)</p>
            <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4">
              {goals.map((goal) => (
                <button
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    data.goals?.includes(goal)
                      ? 'border-amber-500 bg-amber-500/20 text-white'
                      : 'border-indigo-700/50 bg-indigo-900/30 text-indigo-200 hover:border-indigo-600'
                  }`}
                >
                  <div className="flex items-center">
                    {data.goals?.includes(goal) && (
                      <CheckCircle className="w-5 h-5 text-amber-400 mr-2" />
                    )}
                    <span className="font-medium">{goal}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-3xl font-serif text-white mb-6 text-center">Choose your primary mentor</h2>
            <p className="text-indigo-200 text-center mb-8">You can learn from all mentors, but start with one that resonates most</p>
            <div className="max-w-3xl mx-auto space-y-4">
              {mentors.map((mentor) => (
                <button
                  key={mentor.id}
                  onClick={() => setData({ ...data, preferredMentor: mentor.id })}
                  className={`w-full p-6 rounded-xl border text-left transition-all ${
                    data.preferredMentor === mentor.id
                      ? 'border-amber-500 bg-amber-500/20'
                      : 'border-indigo-700/50 bg-indigo-900/30 hover:border-indigo-600'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-3xl mr-4">{mentor.emoji}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{mentor.name}</h3>
                      <p className="text-indigo-200">{mentor.specialty}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="text-3xl font-serif text-white mb-4">You're all set!</h2>
            <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
              Your personalized Meta You experience is ready. Let's begin your transformation journey!
            </p>
            <div className="bg-indigo-900/30 rounded-xl p-6 max-w-md mx-auto mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Your Profile</h3>
              <div className="space-y-2 text-sm text-indigo-200">
                <div>Name: {data.firstName} {data.lastName}</div>
                <div>Age Group: {ageGroups.find(g => g.value === data.ageGroup)?.label}</div>
                <div>Primary Mentor: {mentors.find(m => m.id === data.preferredMentor)?.name}</div>
                <div>Goals: {data.goals?.length} selected</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return data.firstName && data.lastName && data.email && data.ageGroup;
      case 2: return data.goals && data.goals.length > 0;
      case 3: return data.preferredMentor;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-indigo-900 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  index <= currentStep 
                    ? 'border-amber-500 bg-amber-500 text-white' 
                    : 'border-indigo-700 text-indigo-400'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 transition-all ${
                    index < currentStep ? 'bg-amber-500' : 'bg-indigo-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-sm text-indigo-400">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </span>
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-12">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 0
                ? 'text-indigo-600 cursor-not-allowed'
                : 'text-indigo-300 hover:text-white hover:bg-indigo-800/30'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
              canProceed()
                ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-white hover:from-amber-400 hover:to-amber-300'
                : 'bg-indigo-800 text-indigo-400 cursor-not-allowed'
            }`}
          >
            {currentStep === steps.length - 1 ? 'Launch Meta You' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
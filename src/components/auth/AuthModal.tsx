import React, { useState } from 'react';
import { X, Mail, Lock, User, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AgeGroup } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, register } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    ageGroup: 'young-adults' as AgeGroup,
    confirmPassword: ''
  });

  const ageGroups = [
    { value: 'children', label: 'Young Explorers (5-12)' },
    { value: 'teens', label: 'Digital Natives (13-17)' },
    { value: 'young-adults', label: 'Builders (18-25)' },
    { value: 'adults', label: 'Leaders (26-40)' },
    { value: 'middle-age', label: 'Wisdom Keepers (41-60)' },
    { value: 'seniors', label: 'Sage Mentors (60+)' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const result = await login({
          email: formData.email,
          password: formData.password
        });

        if (result.success) {
          onClose();
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        const result = await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          ageGroup: formData.ageGroup
        });

        if (result.success) {
          setMode('login');
          setError(null);
          // Show success message
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-indigo-950 border border-indigo-800/50 rounded-2xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-indigo-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif text-white mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Join Meta You'}
          </h2>
          <p className="text-indigo-300">
            {mode === 'login' 
              ? 'Continue your growth journey' 
              : 'Begin your transformation today'
            }
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-300 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-indigo-900/30 border border-indigo-700/50 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      placeholder="First name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-300 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-indigo-900/30 border border-indigo-700/50 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      placeholder="Last name"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-300 mb-2">
                  Age Group
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-400" />
                  <select
                    name="ageGroup"
                    value={formData.ageGroup}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-indigo-900/30 border border-indigo-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  >
                    {ageGroups.map(group => (
                      <option key={group.value} value={group.value} className="bg-indigo-900">
                        {group.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-indigo-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-indigo-900/30 border border-indigo-700/50 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-indigo-900/30 border border-indigo-700/50 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-indigo-900/30 border border-indigo-700/50 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-white py-3 rounded-lg font-medium hover:from-amber-400 hover:to-amber-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
            }}
            className="text-indigo-300 hover:text-white transition-colors"
          >
            {mode === 'login' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Sparkles, Brain, Zap, Eye, Heart, Lightbulb } from 'lucide-react';
import apiClient from '../../services/ApiClient';
import { useAuth } from '../../hooks/useAuth';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: 'curious' | 'supportive' | 'insightful' | 'challenging';
  insights?: string[];
  actionItems?: string[];
  mentorName?: string;
}

const ConnectedMetaTwinChat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiMode, setAiMode] = useState<'rohn' | 'jobs' | 'wozniak' | 'davinci' | 'delacroix'>('rohn');
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      initializeChat();
    }
  }, [user]);

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: '1',
      text: `Welcome to Meta You, ${user?.firstName || 'friend'}. I am your AI mentor, ready to guide you on your growth journey. I can sense your patterns, predict opportunities, and adapt my guidance to your unique path. What would you like to explore today?`,
      sender: 'ai',
      timestamp: new Date(),
      emotion: 'supportive',
      insights: ['Neural pattern analysis active', 'Growth trajectory mapped'],
      mentorName: getMentorName(aiMode)
    };
    setMessages([welcomeMessage]);
  };

  const getMentorName = (mode: string) => {
    const names = {
      rohn: 'Jim Rohn',
      jobs: 'Steve Jobs',
      wozniak: 'Steve Wozniak',
      davinci: 'Leonardo da Vinci',
      delacroix: 'Eugène Delacroix'
    };
    return names[mode as keyof typeof names] || 'AI Mentor';
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'rohn': return <Brain size={14} />;
      case 'jobs': return <Zap size={14} />;
      case 'wozniak': return <Sparkles size={14} />;
      case 'davinci': return <Eye size={14} />;
      case 'delacroix': return <Heart size={14} />;
      default: return <Sparkles size={14} />;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'rohn': return 'text-emerald-300';
      case 'jobs': return 'text-blue-300';
      case 'wozniak': return 'text-cyan-300';
      case 'davinci': return 'text-amber-300';
      case 'delacroix': return 'text-pink-300';
      default: return 'text-indigo-300';
    }
  };
  
  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      // Track the interaction
      await apiClient.trackEvent({
        eventType: 'ai_interaction',
        eventData: {
          mentorId: aiMode,
          userMessage: currentInput,
          sessionId
        }
      });

      // Send to AI service
      const response = await apiClient.chatWithMentor({
        message: currentInput,
        mentorId: aiMode,
        sessionId,
        context: {
          userProfile: user,
          previousMessages: messages.slice(-5) // Last 5 messages for context
        }
      });

      if (response.success) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.data.response,
          sender: 'ai',
          timestamp: new Date(),
          emotion: response.data.sentiment?.label as any,
          insights: [
            `Processing time: ${response.data.processingTime}ms`,
            `Sentiment: ${response.data.sentiment?.label} (${response.data.sentiment?.score.toFixed(2)})`,
            `Intent: ${response.data.intent?.category} (${(response.data.intent?.confidence * 100).toFixed(0)}%)`
          ],
          mentorName: response.data.mentorName
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Fallback message on error
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
          sender: 'ai',
          timestamp: new Date(),
          emotion: 'supportive',
          mentorName: getMentorName(aiMode)
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm experiencing some technical difficulties. Let me try to reconnect...",
        sender: 'ai',
        timestamp: new Date(),
        emotion: 'supportive',
        mentorName: getMentorName(aiMode)
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  return (
    <div className="bg-indigo-950/50 backdrop-blur-sm rounded-2xl p-5 h-96 border border-indigo-800/50 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <MessageCircle size={18} className="text-indigo-400 mr-2" />
          <h3 className="text-lg font-medium text-white">Meta Twin Chat</h3>
        </div>
        
        {/* AI Mode Selector */}
        <div className="flex gap-1">
          {(['rohn', 'jobs', 'wozniak', 'davinci', 'delacroix'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setAiMode(mode)}
              className={`p-1.5 rounded-lg transition-all ${
                aiMode === mode 
                  ? 'bg-indigo-700/50 ' + getModeColor(mode)
                  : 'text-indigo-400 hover:bg-indigo-800/30'
              }`}
              title={getMentorName(mode)}
            >
              {getModeIcon(mode)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-3 rounded-2xl ${
                message.sender === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-indigo-900/50 border border-indigo-700/30'
              }`}
            >
              {message.sender === 'ai' && (
                <div className={`flex items-center mb-2 ${getModeColor(aiMode)}`}>
                  {getModeIcon(aiMode)}
                  <span className="text-xs font-medium ml-1">
                    {message.mentorName} • {message.emotion}
                  </span>
                </div>
              )}
              
              <p className="text-sm text-indigo-100 mb-2">{message.text}</p>
              
              {message.insights && (
                <div className="mt-2 p-2 bg-indigo-800/30 rounded-lg">
                  <div className="flex items-center mb-1 text-amber-300">
                    <Lightbulb size={12} className="mr-1" />
                    <span className="text-xs font-medium">AI Insights</span>
                  </div>
                  {message.insights.map((insight, idx) => (
                    <div key={idx} className="text-xs text-indigo-200 flex items-center">
                      <div className="w-1 h-1 bg-amber-300 rounded-full mr-2"></div>
                      {insight}
                    </div>
                  ))}
                </div>
              )}
              
              {message.actionItems && (
                <div className="mt-2 p-2 bg-green-900/20 rounded-lg border border-green-800/30">
                  <div className="text-xs font-medium text-green-300 mb-1">Suggested Actions</div>
                  {message.actionItems.map((action, idx) => (
                    <div key={idx} className="text-xs text-green-200 flex items-center">
                      <div className="w-1 h-1 bg-green-300 rounded-full mr-2"></div>
                      {action}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-indigo-900/50 border border-indigo-700/30 p-3 rounded-2xl">
              <div className={`flex items-center mb-1 ${getModeColor(aiMode)}`}>
                {getModeIcon(aiMode)}
                <span className="text-xs font-medium ml-1">{getMentorName(aiMode)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-150"></div>
                </div>
                <span className="text-xs text-indigo-300">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="mt-3 pt-3 border-t border-indigo-800/30">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Share with ${getMentorName(aiMode)}...`}
            className="flex-1 bg-indigo-900/30 border border-indigo-800/50 rounded-lg px-3 py-2 text-sm text-white placeholder-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="p-2 text-indigo-300 hover:text-amber-300 disabled:text-indigo-700 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectedMetaTwinChat;
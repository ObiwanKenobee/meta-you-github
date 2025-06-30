import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Phone, PhoneOff, Video, VideoOff, Users } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../services/ApiClient';

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'voice' | 'system';
  avatar?: string;
}

interface RealTimeChatProps {
  roomId: string;
  roomName: string;
  onClose?: () => void;
}

const RealTimeChat: React.FC<RealTimeChatProps> = ({ roomId, roomName, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isAudioCall, setIsAudioCall] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    connectWebSocket();
    return () => {
      disconnectWebSocket();
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectWebSocket = () => {
    const ws = apiClient.connectWebSocket((data) => {
      handleWebSocketMessage(data);
    });

    if (ws) {
      wsRef.current = ws;
      
      ws.onopen = () => {
        setIsConnected(true);
        // Join room
        ws.send(JSON.stringify({
          type: 'join_room',
          roomId,
          user: {
            id: user?.id,
            name: `${user?.firstName} ${user?.lastName}`,
            avatar: user?.avatar
          }
        }));
      };

      ws.onclose = () => {
        setIsConnected(false);
      };
    }
  };

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'message':
        setMessages(prev => [...prev, {
          id: data.id,
          userId: data.userId,
          userName: data.userName,
          content: data.content,
          timestamp: new Date(data.timestamp),
          type: data.messageType || 'text',
          avatar: data.avatar
        }]);
        break;
        
      case 'user_typing':
        if (data.userId !== user?.id) {
          setTypingUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
          setTimeout(() => {
            setTypingUsers(prev => prev.filter(id => id !== data.userId));
          }, 3000);
        }
        break;
        
      case 'users_online':
        setOnlineUsers(data.users);
        break;
        
      case 'system_message':
        setMessages(prev => [...prev, {
          id: data.id,
          userId: 'system',
          userName: 'System',
          content: data.content,
          timestamp: new Date(),
          type: 'system'
        }]);
        break;
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !wsRef.current || !isConnected) return;

    const message = {
      type: 'message',
      roomId,
      content: newMessage,
      messageType: 'text',
      timestamp: new Date().toISOString()
    };

    wsRef.current.send(JSON.stringify(message));
    setNewMessage('');
    stopTyping();
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);
    
    if (!isTyping && value.trim()) {
      setIsTyping(true);
      wsRef.current?.send(JSON.stringify({
        type: 'typing_start',
        roomId
      }));
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 1000);
  };

  const stopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      wsRef.current?.send(JSON.stringify({
        type: 'typing_stop',
        roomId
      }));
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      // Implement voice recording logic
    } catch (error) {
      console.error('Failed to start voice recording:', error);
    }
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    // Implement stop recording and send voice message
  };

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setIsVideoCall(true);
      
      // Send video call invitation
      wsRef.current?.send(JSON.stringify({
        type: 'video_call_start',
        roomId
      }));
    } catch (error) {
      console.error('Failed to start video call:', error);
    }
  };

  const endVideoCall = () => {
    setIsVideoCall(false);
    wsRef.current?.send(JSON.stringify({
      type: 'video_call_end',
      roomId
    }));
  };

  const startAudioCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsAudioCall(true);
      
      wsRef.current?.send(JSON.stringify({
        type: 'audio_call_start',
        roomId
      }));
    } catch (error) {
      console.error('Failed to start audio call:', error);
    }
  };

  const endAudioCall = () => {
    setIsAudioCall(false);
    wsRef.current?.send(JSON.stringify({
      type: 'audio_call_end',
      roomId
    }));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-indigo-950/50 backdrop-blur-sm rounded-2xl border border-indigo-800/50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-indigo-800/30">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            <h3 className="text-lg font-semibold text-white">{roomName}</h3>
          </div>
          <div className="flex items-center text-indigo-300">
            <Users className="w-4 h-4 mr-1" />
            <span className="text-sm">{onlineUsers.length}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Voice Call Button */}
          <button
            onClick={isAudioCall ? endAudioCall : startAudioCall}
            className={`p-2 rounded-lg transition-colors ${
              isAudioCall 
                ? 'bg-red-600 text-white' 
                : 'text-indigo-300 hover:text-white hover:bg-indigo-800/50'
            }`}
          >
            {isAudioCall ? <PhoneOff className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
          </button>
          
          {/* Video Call Button */}
          <button
            onClick={isVideoCall ? endVideoCall : startVideoCall}
            className={`p-2 rounded-lg transition-colors ${
              isVideoCall 
                ? 'bg-red-600 text-white' 
                : 'text-indigo-300 hover:text-white hover:bg-indigo-800/50'
            }`}
          >
            {isVideoCall ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="text-indigo-400 hover:text-white transition-colors"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.userId === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.type === 'system'
                  ? 'bg-indigo-800/30 text-indigo-300 text-center text-sm'
                  : message.userId === user?.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-900/50 text-indigo-100'
              }`}
            >
              {message.type !== 'system' && message.userId !== user?.id && (
                <div className="text-xs text-indigo-400 mb-1">{message.userName}</div>
              )}
              <div className="text-sm">{message.content}</div>
              <div className="text-xs opacity-70 mt-1">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-indigo-900/50 text-indigo-300 px-4 py-2 rounded-2xl text-sm">
              {typingUsers.length === 1 
                ? `Someone is typing...` 
                : `${typingUsers.length} people are typing...`
              }
              <div className="flex space-x-1 mt-1">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-indigo-800/30">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              disabled={!isConnected}
              className="w-full px-4 py-2 bg-indigo-900/30 border border-indigo-700/50 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />
          </div>
          
          {/* Voice Recording Button */}
          <button
            onMouseDown={startVoiceRecording}
            onMouseUp={stopVoiceRecording}
            onTouchStart={startVoiceRecording}
            onTouchEnd={stopVoiceRecording}
            className={`p-2 rounded-lg transition-colors ${
              isRecording 
                ? 'bg-red-600 text-white' 
                : 'text-indigo-300 hover:text-white hover:bg-indigo-800/50'
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="p-2 text-indigo-300 hover:text-white hover:bg-indigo-800/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealTimeChat;
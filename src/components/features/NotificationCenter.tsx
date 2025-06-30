import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Clock, AlertCircle, Info, CheckCircle, Star } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../services/ApiClient';

interface Notification {
  id: string;
  type: 'achievement' | 'reminder' | 'collaboration' | 'security' | 'system' | 'marketing';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  data?: any;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, filter]);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      // Mock data for demo - replace with actual API call
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'achievement',
          priority: 'high',
          title: 'New Achievement Unlocked!',
          message: 'You\'ve earned the "Wisdom Seeker" badge for completing 10 reflection sessions.',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          read: false,
          actionUrl: '/achievements',
          data: { achievementId: 'wisdom-seeker' }
        },
        {
          id: '2',
          type: 'collaboration',
          priority: 'medium',
          title: 'New Collaboration Invitation',
          message: 'Sarah Chen invited you to join the "Digital Wisdom Archive" project.',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          read: false,
          actionUrl: '/collaboration/projects/digital-wisdom-archive'
        },
        {
          id: '3',
          type: 'reminder',
          priority: 'medium',
          title: 'Daily Reflection Time',
          message: 'It\'s time for your daily reflection session with Jim Rohn.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: true,
          actionUrl: '/ai/chat/rohn'
        },
        {
          id: '4',
          type: 'system',
          priority: 'low',
          title: 'Weekly Growth Report Ready',
          message: 'Your weekly growth analytics report is now available.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          read: true,
          actionUrl: '/analytics'
        },
        {
          id: '5',
          type: 'security',
          priority: 'urgent',
          title: 'New Login Detected',
          message: 'We detected a new login from Chrome on Windows. Was this you?',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          read: false,
          actionUrl: '/security'
        }
      ];

      const filteredNotifications = mockNotifications.filter(notification => {
        if (filter === 'unread') return !notification.read;
        if (filter === 'important') return notification.priority === 'high' || notification.priority === 'urgent';
        return true;
      });

      setNotifications(filteredNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Update local state immediately
      setNotifications(prev => prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      ));

      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));

      // Call API to mark as read
      await apiClient.makeRequest(`/api/notifications/${notificationId}/read`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
      setUnreadCount(0);

      // Call API to mark all as read
      await apiClient.makeRequest('/api/notifications/mark-all-read', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));

      // Call API to delete notification
      await apiClient.makeRequest(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'achievement': return <Star className="w-5 h-5 text-amber-400" />;
      case 'reminder': return <Clock className="w-5 h-5 text-blue-400" />;
      case 'collaboration': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'security': return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'system': return <Info className="w-5 h-5 text-indigo-400" />;
      case 'marketing': return <Bell className="w-5 h-5 text-purple-400" />;
      default: return <Bell className="w-5 h-5 text-indigo-400" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500';
      case 'high': return 'border-l-amber-500';
      case 'medium': return 'border-l-blue-500';
      case 'low': return 'border-l-gray-500';
      default: return 'border-l-indigo-500';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-16">
      <div className="bg-indigo-950/95 backdrop-blur-sm border border-indigo-800/50 rounded-2xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-indigo-800/30">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-amber-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-indigo-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex space-x-1 p-4 bg-indigo-900/30">
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: 'Unread' },
            { key: 'important', label: 'Important' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                filter === key
                  ? 'bg-indigo-600 text-white'
                  : 'text-indigo-300 hover:text-white hover:bg-indigo-800/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="px-4 pb-2">
            <button
              onClick={markAllAsRead}
              className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
            >
              Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-1 p-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative p-4 rounded-lg border-l-4 transition-all cursor-pointer ${
                    notification.read
                      ? 'bg-indigo-900/20 border-l-indigo-700'
                      : 'bg-indigo-900/40 border-l-amber-500'
                  } ${getPriorityColor(notification.priority)} hover:bg-indigo-800/30`}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id);
                    }
                    if (notification.actionUrl) {
                      // Navigate to action URL
                      console.log('Navigate to:', notification.actionUrl);
                    }
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className={`text-sm font-medium ${
                          notification.read ? 'text-indigo-200' : 'text-white'
                        }`}>
                          {notification.title}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-indigo-400 hover:text-red-400 transition-colors ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className={`text-sm mt-1 ${
                        notification.read ? 'text-indigo-400' : 'text-indigo-200'
                      }`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-indigo-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-indigo-400">
              <Bell className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-center">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
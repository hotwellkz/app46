import React, { useState, useEffect } from 'react';
import { Bell, Building2, DollarSign, Package, User } from 'lucide-react';
import { subscribeToNotifications } from '../../services/notificationService';
import { Notification } from '../../types/chat';

export const DashboardNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToNotifications(
      (allNotifications) => {
        const unreadNotifications = allNotifications.filter(n => !n.isRead);
        setNotifications(unreadNotifications);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'inventory':
        return <Package className="w-5 h-5 text-purple-500" />;
      case 'client':
        return <User className="w-5 h-5 text-blue-500" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-emerald-500" />;
      case 'construction':
        return <Building2 className="w-5 h-5 text-amber-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Уведомления</h2>
      
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Нет новых уведомлений</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className="flex items-start space-x-3 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(notification.timestamp)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
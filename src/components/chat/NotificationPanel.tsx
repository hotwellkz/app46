import React from 'react';
import { X, Bell } from 'lucide-react';
import { Notification } from '../../types/chat';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
  isMobile?: boolean;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onClose,
  isMobile = false
}) => {
  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'estimate':
        return 'bg-blue-50 border-blue-200';
      case 'construction':
        return 'bg-emerald-50 border-emerald-200';
      case 'client':
        return 'bg-amber-50 border-amber-200';
      case 'payment':
        return 'bg-purple-50 border-purple-200';
      case 'inventory':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'estimate':
        return 'text-blue-500';
      case 'construction':
        return 'text-emerald-500';
      case 'client':
        return 'text-amber-500';
      case 'payment':
        return 'text-purple-500';
      case 'inventory':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatNotificationTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return format(date, 'HH:mm', { locale: ru });
  };

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
        <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-xl">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Уведомления</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <div className="max-h-[70vh] overflow-y-auto p-4 space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Нет уведомлений
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${getNotificationColor(
                    notification.type
                  )}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Bell className={`w-5 h-5 ${getNotificationIcon(notification.type)}`} />
                      <div>
                        <h3 className="font-medium">{notification.title}</h3>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatNotificationTime(notification.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[calc(100vh-200px)]">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Уведомления</h2>
      </div>
      <div className="overflow-y-auto p-4 space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Нет уведомлений
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${getNotificationColor(notification.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Bell className={`w-5 h-5 ${getNotificationIcon(notification.type)}`} />
                  <div>
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {formatNotificationTime(notification.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
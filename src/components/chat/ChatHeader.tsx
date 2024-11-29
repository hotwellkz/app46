import React from 'react';
import { ArrowLeft, Bell, Settings } from 'lucide-react';

interface ChatHeaderProps {
  unreadCount: number;
  onNotificationsClick: () => void;
  onSettingsClick: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  unreadCount,
  onNotificationsClick,
  onSettingsClick
}) => {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <button onClick={() => window.history.back()} className="mr-4">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Чат</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onNotificationsClick}
              className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={onSettingsClick}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
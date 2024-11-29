import React, { useState } from 'react';
import { X } from 'lucide-react';
import { NotificationSettings as Settings } from '../../types/chat';

interface NotificationSettingsProps {
  onClose: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onClose }) => {
  const [settings, setSettings] = useState<Settings>({
    estimates: true,
    construction: true,
    clients: true,
    payments: true,
    inventory: true,
    system: true,
    channels: {
      inApp: true,
      telegram: false,
      whatsapp: false
    }
  });

  const handleToggle = (key: keyof Settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleChannelToggle = (channel: keyof Settings['channels']) => {
    setSettings(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: !prev.channels[channel]
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Настройки уведомлений</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Типы уведомлений</h3>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.estimates}
                  onChange={() => handleToggle('estimates')}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="ml-3">Сметы</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.construction}
                  onChange={() => handleToggle('construction')}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="ml-3">Строительство</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.clients}
                  onChange={() => handleToggle('clients')}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <span className="ml-3">Клиенты</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.payments}
                  onChange={() => handleToggle('payments')}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <span className="ml-3">Платежи</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.inventory}
                  onChange={() => handleToggle('inventory')}
                  className="w-4 h-4 text-green-600 rounded"
                />
                <span className="ml-3">Склад</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Каналы уведомлений</h3>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.channels.inApp}
                  onChange={() => handleChannelToggle('inApp')}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="ml-3">В приложении</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.channels.telegram}
                  onChange={() => handleChannelToggle('telegram')}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="ml-3">Telegram</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.channels.whatsapp}
                  onChange={() => handleChannelToggle('whatsapp')}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="ml-3">WhatsApp</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};
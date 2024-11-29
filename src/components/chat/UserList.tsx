import React from 'react';
import { User } from 'lucide-react';

export const UserList: React.FC = () => {
  const users = [
    { id: '1', name: 'Виталий Милюк', status: 'online' },
    { id: '2', name: 'Лев Гросс', status: 'offline' },
    // Добавьте других пользователей здесь
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Сотрудники</h2>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                />
              </div>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500 capitalize">{user.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
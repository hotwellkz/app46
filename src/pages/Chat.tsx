import React, { useState, useEffect, useRef } from 'react';
import { MessageList } from '../components/chat/MessageList';
import { MessageInput } from '../components/chat/MessageInput';
import { NotificationPanel } from '../components/chat/NotificationPanel';
import { NotificationSettings } from '../components/chat/NotificationSettings';
import { UserList } from '../components/chat/UserList';
import { ChatHeader } from '../components/chat/ChatHeader';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Message, Notification } from '../types/chat';
import { ArrowLeft, Settings } from 'lucide-react';

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Подписка на сообщения
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(messagesData);
      
      // Подсчет непрочитанных сообщений
      const unread = messagesData.filter(msg => !msg.isRead).length;
      setUnreadCount(unread);
    });

    // Подписка на уведомления
    const notificationsQuery = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));
    const unsubscribeNotifications = onSnapshot(notificationsQuery, (snapshot) => {
      const notificationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      setNotifications(notificationsData);
    });

    return () => {
      unsubscribeMessages();
      unsubscribeNotifications();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (text: string, attachments?: File[]) => {
    try {
      await addDoc(collection(db, 'messages'), {
        text,
        senderId: 'current-user-id', // Заменить на реального пользователя
        senderName: 'Текущий пользователь', // Заменить на реального пользователя
        timestamp: serverTimestamp(),
        isRead: false,
        attachments: [] // Добавить логику загрузки файлов
      });
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Ошибка при отправке сообщения');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ChatHeader
        unreadCount={unreadCount}
        onNotificationsClick={() => setShowNotifications(true)}
        onSettingsClick={() => setShowSettings(true)}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Список пользователей */}
          <div className="hidden lg:block">
            <UserList />
          </div>

          {/* Основной чат */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-[calc(100vh-200px)] flex flex-col">
              <MessageList
                messages={messages}
                onScrollToBottom={scrollToBottom}
                messagesEndRef={messagesEndRef}
              />
              <MessageInput onSendMessage={handleSendMessage} />
            </div>
          </div>

          {/* Уведомления */}
          <div className="hidden lg:block">
            <NotificationPanel
              notifications={notifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>
        </div>
      </div>

      {/* Мобильные панели */}
      {showNotifications && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          isMobile
        />
      )}

      {showSettings && (
        <NotificationSettings
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};
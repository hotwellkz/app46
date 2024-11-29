import { User } from './user';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: any;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  mentions?: string[];
  isRead: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'estimate' | 'construction' | 'client' | 'payment' | 'inventory' | 'system';
  timestamp: any;
  createdAt: any; // Добавляем поле createdAt
  isRead: boolean;
  link?: string;
}

export interface NotificationSettings {
  estimates: boolean;
  construction: boolean;
  clients: boolean;
  payments: boolean;
  inventory: boolean;
  system: boolean;
  channels: {
    inApp: boolean;
    telegram: boolean;
    whatsapp: boolean;
  };
}

export interface ChatState {
  messages: Message[];
  notifications: Notification[];
  settings: NotificationSettings;
  users: User[];
  unreadCount: number;
}
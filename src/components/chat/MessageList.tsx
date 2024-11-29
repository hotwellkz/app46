import React from 'react';
import { Message } from '../../types/chat';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { FileText } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  onScrollToBottom: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  onScrollToBottom,
  messagesEndRef
}) => {
  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return format(date, 'HH:mm', { locale: ru });
  };

  const formatMessageDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return format(date, 'd MMMM yyyy', { locale: ru });
  };

  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach(message => {
      const date = formatMessageDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate();

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {Object.entries(groupedMessages).map(([date, messages]) => (
        <div key={date}>
          <div className="text-center mb-4">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
              {date}
            </span>
          </div>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === 'current-user-id' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] ${
                    message.senderId === 'current-user-id'
                      ? 'bg-emerald-500 text-white rounded-l-lg rounded-tr-lg'
                      : 'bg-gray-100 text-gray-900 rounded-r-lg rounded-tl-lg'
                  } p-3 shadow-sm`}
                >
                  {message.senderId !== 'current-user-id' && (
                    <div className="text-sm font-medium text-emerald-600 mb-1">
                      {message.senderName}
                    </div>
                  )}
                  <p className="text-sm">{message.text}</p>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <FileText className="w-4 h-4" />
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-emerald-200"
                          >
                            {attachment.name}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                  <div
                    className={`text-xs mt-1 ${
                      message.senderId === 'current-user-id'
                        ? 'text-emerald-100'
                        : 'text-gray-500'
                    }`}
                  >
                    {formatMessageTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
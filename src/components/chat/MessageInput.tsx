import React, { useState, useRef } from 'react';
import { Smile, Paperclip, Send } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

interface MessageInputProps {
  onSendMessage: (text: string, attachments?: File[]) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Здесь будет логика загрузки файлов
      console.log('Selected files:', files);
    }
  };

  const handleEmojiSelect = (emojiData: any) => {
    setMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="border-t bg-white p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="relative flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            >
              <Smile className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            >
              <Paperclip className="w-5 h-5" />
            </button>
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите сообщение..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {showEmojiPicker && (
            <div className="absolute bottom-full mb-2">
              <EmojiPicker onEmojiClick={handleEmojiSelect} />
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={!message.trim()}
          className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:bg-gray-300"
        >
          <Send className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
      </form>
    </div>
  );
};
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { IconSelector } from './IconSelector';
import { ColorSelector } from './ColorSelector';
import { updateCategory } from '../lib/firebase';
import { CategoryCardType } from '../types';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, writeBatch } from 'firebase/firestore';

interface EditCategoryModalProps {
  category: CategoryCardType;
  isOpen: boolean;
  onClose: () => void;
}

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  category,
  isOpen,
  onClose,
}) => {
  const [title, setTitle] = useState(category.title);
  const [amount, setAmount] = useState(category.amount.replace(/[^\d.-]/g, ''));
  const [selectedIcon, setSelectedIcon] = useState(category.iconName);
  const [selectedColor, setSelectedColor] = useState(category.color);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const formatAmount = (value: string): string => {
    const numericValue = value.replace(/[^\d.-]/g, '');
    return numericValue ? `${numericValue} ₸` : '0 ₸';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Форматируем сумму перед сохранением
      const formattedAmount = formatAmount(amount);

      // Обновляем данные категории
      await updateCategory(category.id, {
        title,
        amount: formattedAmount,
        icon: selectedIcon,
        color: selectedColor
      });

      // Если название изменилось, обновляем все связанные транзакции
      if (title !== category.title) {
        const batch = writeBatch(db);

        // Находим все транзакции, где категория является отправителем
        const fromQuery = query(
          collection(db, 'transactions'),
          where('fromUser', '==', category.title)
        );
        const fromSnapshots = await getDocs(fromQuery);

        fromSnapshots.forEach((doc) => {
          batch.update(doc.ref, { fromUser: title });
        });

        // Находим все транзакции, где категория является получателем
        const toQuery = query(
          collection(db, 'transactions'),
          where('toUser', '==', category.title)
        );
        const toSnapshots = await getDocs(toQuery);

        toSnapshots.forEach((doc) => {
          batch.update(doc.ref, { toUser: title });
        });

        // Применяем все изменения одной транзакцией
        await batch.commit();
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Ошибка при обновлении категории');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Редактировать категорию</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Сумма
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <IconSelector
              selectedIcon={selectedIcon}
              onSelectIcon={setSelectedIcon}
              categoryRow={category.row || 1}
            />

            <ColorSelector
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md text-white ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
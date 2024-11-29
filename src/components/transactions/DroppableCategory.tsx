import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { CategoryCardType } from '../../types';
import { CategoryCard } from './CategoryCard';
import { ContextMenu } from '../ContextMenu';
import { DeleteWarehouseItemModal } from '../modals/DeleteWarehouseItemModal';
import { EditWarehouseItemModal } from '../modals/EditWarehouseItemModal';
import { TransactionHistory } from '../transactions/TransactionHistory';
import { collection, query, where, getDocs, writeBatch, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { showErrorNotification } from '../../utils/notifications';

interface DroppableCategoryProps {
  category: CategoryCardType;
  onHistoryClick: () => void;
}

export const DroppableCategory: React.FC<DroppableCategoryProps> = ({
  category,
  onHistoryClick
}) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id: category.id,
    data: category
  });

  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    if (category.row === 4) {
      e.preventDefault();
      e.stopPropagation();
      
      // Получаем размеры экрана
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Предполагаемые размеры контекстного меню
      const menuWidth = 200;
      const menuHeight = 150;
      
      // Вычисляем позицию меню
      let x = e.clientX;
      let y = e.clientY;
      
      // Проверяем, не выходит ли меню за пределы экрана справа
      if (x + menuWidth > viewportWidth) {
        x = viewportWidth - menuWidth;
      }
      
      // Проверяем, не выходит ли меню за пределы экрана снизу
      if (y + menuHeight > viewportHeight) {
        y = viewportHeight - menuHeight;
      }
      
      setContextMenuPosition({ x, y });
      setShowContextMenu(true);
    }
  };

  const handleDeleteWithHistory = async () => {
    try {
      const batch = writeBatch(db);

      // Удаляем категорию
      batch.delete(doc(db, 'categories', category.id));

      // Находим и удаляем все связанные транзакции
      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('categoryId', '==', category.id)
      );
      
      const transactionsSnapshot = await getDocs(transactionsQuery);
      transactionsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      setShowDeleteModal(false);
      showErrorNotification('Категория успешно удалена');
    } catch (error) {
      console.error('Error deleting category with history:', error);
      showErrorNotification('Ошибка при удалении категории');
    }
  };

  const handleDeleteIconOnly = async () => {
    try {
      // Удаляем только категорию
      await deleteDoc(doc(db, 'categories', category.id));
      setShowDeleteModal(false);
      showErrorNotification('Категория успешно удалена');
    } catch (error) {
      console.error('Error deleting category:', error);
      showErrorNotification('Ошибка при удалении категории');
    }
  };

  const isValidDrop = () => {
    if (!active?.data.current) return false;
    
    const sourceCategory = active.data.current as CategoryCardType;
    const sourceRow = sourceCategory.row;
    const targetRow = category.row;

    // Клиент → Сотрудник
    if (sourceRow === 1 && targetRow === 2) return true;
    // Сотрудник → Проект
    if (sourceRow === 2 && targetRow === 3) return true;
    // Сотрудник ↔ Склад
    if ((sourceRow === 2 && targetRow === 4) || (sourceRow === 4 && targetRow === 2)) return true;

    return false;
  };

  const showDropIndicator = isOver && isValidDrop();

  return (
    <>
      <div
        ref={setNodeRef}
        className={`h-full flex items-center ${
          showDropIndicator ? 'ring-2 ring-emerald-500 ring-offset-2 rounded-lg' : ''
        }`}
        onContextMenu={handleContextMenu}
      >
        <CategoryCard 
          category={category} 
          onHistoryClick={() => {
            if (category.row !== 4) {
              onHistoryClick();
            }
          }}
        />
      </div>

      {showContextMenu && (
        <div 
          className="fixed bg-white rounded-lg shadow-lg py-1 z-50 min-w-[200px]"
          style={{
            left: `${contextMenuPosition.x}px`,
            top: `${contextMenuPosition.y}px`,
          }}
        >
          <button
            onClick={() => {
              setShowHistory(true);
              setShowContextMenu(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            История транзакций
          </button>
          <button
            onClick={() => {
              setShowEditModal(true);
              setShowContextMenu(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            Редактировать
          </button>
          <button
            onClick={() => {
              setShowDeleteModal(true);
              setShowContextMenu(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
          >
            Удалить
          </button>
        </div>
      )}

      {showDeleteModal && (
        <DeleteWarehouseItemModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDeleteWithHistory={handleDeleteWithHistory}
          onDeleteIconOnly={handleDeleteIconOnly}
          itemName={category.title}
        />
      )}

      {showEditModal && (
        <EditWarehouseItemModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          category={category}
        />
      )}

      {showHistory && (
        <TransactionHistory
          category={category}
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  );
};
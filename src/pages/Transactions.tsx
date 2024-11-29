import React, { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { CategoryRow } from '../components/transactions/CategoryRow';
import { useCategories } from '../hooks/useCategories';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CategoryCardType } from '../types';
import { TransactionHistory } from '../components/transactions/TransactionHistory';
import { TransferModal } from '../components/transactions/TransferModal';
import { AddWarehouseItemModal } from '../components/transactions/AddWarehouseItemModal';

export const Transactions: React.FC = () => {
  const { categories, loading, error } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<CategoryCardType | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showAddWarehouseModal, setShowAddWarehouseModal] = useState(false);
  const [transferData, setTransferData] = useState<{
    sourceCategory: CategoryCardType;
    targetCategory: CategoryCardType;
  } | null>(null);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const sourceCategory = active.data.current as CategoryCardType;
      const targetCategory = categories.find(c => c.id === over.id);
      
      if (targetCategory) {
        setTransferData({
          sourceCategory,
          targetCategory
        });
        setShowTransferModal(true);
      }
    }
  };

  const handleHistoryClick = (category: CategoryCardType) => {
    setSelectedCategory(category);
    setShowHistory(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-xl text-red-500 p-4 bg-white rounded-lg shadow">
          {error}
        </div>
      </div>
    );
  }

  // Фильтруем категории по видимости
  const visibleCategories = categories.filter(c => c.isVisible !== false);

  const clientCategories = visibleCategories.filter(c => c.row === 1);
  const employeeCategories = visibleCategories.filter(c => c.row === 2);
  const projectCategories = visibleCategories.filter(c => c.row === 3);
  const warehouseCategories = visibleCategories.filter(c => c.row === 4);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="p-2 sm:p-3 space-y-2">
        <CategoryRow
          title="Клиенты"
          categories={clientCategories}
          onHistoryClick={handleHistoryClick}
          rowNumber={1}
        />
        
        <CategoryRow
          title="Сотрудники"
          categories={employeeCategories}
          onHistoryClick={handleHistoryClick}
          rowNumber={2}
        />
        
        <CategoryRow
          title="Проекты"
          categories={projectCategories}
          onHistoryClick={handleHistoryClick}
          rowNumber={3}
        />
        
        <CategoryRow
          title="Склад"
          categories={warehouseCategories}
          onHistoryClick={handleHistoryClick}
          onAddCategory={() => setShowAddWarehouseModal(true)}
          rowNumber={4}
        />
      </div>

      {showHistory && selectedCategory && (
        <TransactionHistory
          category={selectedCategory}
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
        />
      )}

      {showTransferModal && transferData && (
        <TransferModal
          sourceCategory={transferData.sourceCategory}
          targetCategory={transferData.targetCategory}
          isOpen={showTransferModal}
          onClose={() => {
            setShowTransferModal(false);
            setTransferData(null);
          }}
        />
      )}

      {showAddWarehouseModal && (
        <AddWarehouseItemModal
          isOpen={showAddWarehouseModal}
          onClose={() => setShowAddWarehouseModal(false)}
        />
      )}
    </DndContext>
  );
};
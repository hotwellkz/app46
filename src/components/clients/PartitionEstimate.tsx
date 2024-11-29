import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc, collection, query, where, onSnapshot, or, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { PartitionEstimateTable } from './PartitionEstimateTable';
import { PartitionEstimateData } from '../../types/estimate';
import { Product } from '../../types/product';
import { prepareEstimateForSave } from '../../utils/estimateUtils';

interface PartitionEstimateProps {
  isEditing: boolean;
  clientId: string;
}

export const PartitionEstimate: React.FC<PartitionEstimateProps> = ({
  isEditing,
  clientId
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [estimateData, setEstimateData] = useState<PartitionEstimateData>({
    items: [
      { name: 'Гипсокартон 12,5мм стеновой (Для межкомнатных перегородок) пр-ва Knauf', unit: 'лист', quantity: 10, price: 2700, total: 26100 },
      { name: 'Гипсокартон 12,5мм влагостойкий стеновой (Для межком перег) пр-ва Knauf', unit: 'лист', quantity: 12, price: 3000, total: 35000 },
      { name: 'Профиль для перегородок 75x50x3000 пр-ва Stynergy', unit: 'шт', quantity: 850, price: 1700, total: 1445000 },
      { name: 'Направляющие для перегородочного проф. 75x40x3000 пр-ва Stynergy', unit: 'шт', quantity: 11, price: 1500, total: 16000 },
      { name: 'Мин вата Экотерм (Для заполнения меж-комнатных перегородок) (1рул-12м2)', unit: 'рул', quantity: 3, price: 6000, total: 19333 },
      { name: 'Шурупы 3 мелкая резьба (Для монтажа гипсокартона к профилям) 1п на 5 лис', unit: 'пач', quantity: 2, price: 700, total: 1353 },
      { name: 'Шурупы семечки (Для монтажа профилей межкомнатных перегородок)', unit: 'пач', quantity: 1, price: 700, total: 700 },
      { name: 'Вывоз мусора', unit: '', quantity: 0, price: 0, total: 20000 }
    ],
    totalMaterialsCost: 1563487,
    installationCost: 0,
    deliveryCost: 30000,
    totalCost: 1593487
  });

  useEffect(() => {
    const estimateRef = doc(db, 'estimates', clientId);
    const unsubscribe = onSnapshot(estimateRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const partitionProfile = data.lumberValues?.partitionProfile?.value || 0;
        
        setEstimateData(prev => {
          const newItems = [...prev.items];
          
          // Находим индекс профиля для перегородок
          const profileIndex = newItems.findIndex(item => 
            item.name === 'Профиль для перегородок 75x50x3000 пр-ва Stynergy'
          );
          
          if (profileIndex !== -1) {
            // Обновляем количество и пересчитываем общую стоимость для этой позиции
            newItems[profileIndex] = {
              ...newItems[profileIndex],
              quantity: partitionProfile,
              total: partitionProfile * newItems[profileIndex].price
            };
          }

          // Пересчитываем общую стоимость материалов
          const totalMaterialsCost = newItems.reduce((sum, item) => sum + item.total, 0);
          return {
            ...prev,
            items: newItems,
            totalMaterialsCost,
            totalCost: totalMaterialsCost + prev.installationCost + prev.deliveryCost
          };
        });
      }
    });

    return () => unsubscribe();
  }, [clientId]);

  useEffect(() => {
    const loadEstimateData = async () => {
      try {
        const estimateRef = doc(db, 'partitionEstimates', clientId);
        const estimateDoc = await getDoc(estimateRef);
        
        if (estimateDoc.exists()) {
          const data = estimateDoc.data() as PartitionEstimateData;
          // Сохраняем все данные, кроме профиля для перегородок
          const profileIndex = data.items.findIndex(item => 
            item.name === 'Профиль для перегородок 75x50x3000 пр-ва Stynergy'
          );
          
          if (profileIndex !== -1) {
            setEstimateData(prev => ({
              ...data,
              items: [
                ...data.items.slice(0, profileIndex),
                prev.items[profileIndex], // Оставляем текущее значение профиля
                ...data.items.slice(profileIndex + 1)
              ]
            }));
          } else {
            setEstimateData(data);
          }
        }
      } catch (error) {
        console.error('Error loading partition estimate data:', error);
      }
    };

    loadEstimateData();
  }, [clientId]);

  useEffect(() => {
    const saveEstimateData = async () => {
      if (!isEditing) return;

      try {
        const estimateRef = doc(db, 'partitionEstimates', clientId);
        const dataToSave = prepareEstimateForSave({
          ...estimateData,
          updatedAt: serverTimestamp()
        });
        await setDoc(estimateRef, dataToSave);
      } catch (error) {
        console.error('Error saving partition estimate data:', error);
      }
    };

    const debounceTimer = setTimeout(saveEstimateData, 500);
    return () => clearTimeout(debounceTimer);
  }, [clientId, isEditing, estimateData]);

  const handleUpdateItem = (index: number, field: keyof typeof estimateData.items[0], value: number) => {
    // Запрещаем изменение количества профиля для перегородок
    const isProfileItem = estimateData.items[index].name === 'Профиль для перегородок 75x50x3000 пр-ва Stynergy';
    if (isProfileItem && field === 'quantity') return;

    setEstimateData(prev => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        [field]: value,
        total: field === 'quantity' ? value * newItems[index].price : 
               field === 'price' ? value * newItems[index].quantity :
               value
      };

      const totalMaterialsCost = newItems.reduce((sum, item) => sum + item.total, 0);
      return {
        ...prev,
        items: newItems,
        totalMaterialsCost,
        totalCost: totalMaterialsCost + prev.installationCost + prev.deliveryCost
      };
    });
  };

  const handleUpdateCosts = (field: 'installationCost' | 'deliveryCost', value: number) => {
    setEstimateData(prev => ({
      ...prev,
      [field]: value,
      totalCost: prev.totalMaterialsCost + (field === 'installationCost' ? value : prev.installationCost) + (field === 'deliveryCost' ? value : prev.deliveryCost)
    }));
  };

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-gray-700 hover:text-gray-900 mb-4"
      >
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 mr-1" />
        ) : (
          <ChevronDown className="w-5 h-5 mr-1" />
        )}
        Смета Межкомнатных Перегородок
      </button>

      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-800 text-white text-center py-2">
            Перегородки несущие из профиля и гипсокартона
          </div>
          
          <PartitionEstimateTable
            items={estimateData.items}
            totalMaterialsCost={estimateData.totalMaterialsCost}
            installationCost={estimateData.installationCost}
            deliveryCost={estimateData.deliveryCost}
            totalCost={estimateData.totalCost}
            onUpdateItem={handleUpdateItem}
            onUpdateCosts={handleUpdateCosts}
            isEditing={isEditing}
          />
        </div>
      )}
    </div>
  );
};
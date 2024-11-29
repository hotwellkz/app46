import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Building2, Car, Globe, Hammer, Home, Package, User, Wallet } from 'lucide-react';
import { CategoryCardType } from '../types';
import React from 'react';

const iconMap: { [key: string]: React.ElementType } = {
  Car,
  User,
  Building2,
  Wallet,
  Home,
  Hammer,
  Globe,
  Package
};

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeCallbacks: (() => void)[] = [];

    // Подписываемся на изменения для каждой строки категорий
    [1, 2, 3, 4].forEach(row => {
      const q = query(
        collection(db, 'categories'),
        where('row', '==', row)
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          setCategories(prev => {
            const updatedCategories = [...prev];
            
            snapshot.docChanges().forEach(change => {
              const data = change.doc.data();
              const IconComponent = iconMap[data.icon] || Home;
              
              const categoryData: CategoryCardType = {
                id: change.doc.id,
                title: data.title,
                amount: data.amount,
                icon: React.createElement(IconComponent, { 
                  size: 24,
                  className: "text-white"
                }),
                iconName: data.icon,
                color: data.color || 'bg-emerald-500',
                row: data.row || 1,
                isVisible: data.isVisible !== false // По умолчанию true, если не указано иное
              };

              const index = updatedCategories.findIndex(cat => cat.id === categoryData.id);
              
              if (change.type === 'added' && index === -1) {
                updatedCategories.push(categoryData);
              } else if (change.type === 'modified' && index !== -1) {
                updatedCategories[index] = categoryData;
              } else if (change.type === 'removed' && index !== -1) {
                updatedCategories.splice(index, 1);
              }
            });

            return updatedCategories;
          });
          setLoading(false);
        },
        (error) => {
          console.error('Categories subscription error:', error);
          setError('Ошибка получения данных');
          setLoading(false);
        }
      );

      unsubscribeCallbacks.push(unsubscribe);
    });

    return () => {
      unsubscribeCallbacks.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  return { categories, loading, error };
};
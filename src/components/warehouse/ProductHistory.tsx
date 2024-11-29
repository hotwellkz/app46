import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Product, ProductHistory as History } from '../../types/warehouse';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ProductHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const ProductHistory: React.FC<ProductHistoryProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'productHistory'),
      where('productId', '==', product.id),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const historyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as History[];
      setHistory(historyData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [product.id]);

  if (!isOpen) return null;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    return format(timestamp.toDate(), 'd MMMM yyyy, HH:mm', { locale: ru });
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('ru-RU') + ' ₸';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">История операций</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-medium text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-500">
              Текущий остаток: {product.quantity} {product.unit}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              История операций пуста
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {record.type === 'add' ? 'Поступление' : 'Списание'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {record.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDate(record.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        record.type === 'add' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {record.type === 'add' ? '+' : '-'} {record.quantity} {product.unit}
                      </p>
                      {record.price && (
                        <p className="text-sm text-gray-600 mt-1">
                          {formatAmount(record.price)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {record.user.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
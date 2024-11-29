import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  fromUser: string;
  toUser: string;
  date: any;
}

export const FinancialWidget: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'transactions'),
      orderBy('date', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionsMap = new Map<string, Transaction>();
      
      snapshot.docs.forEach(doc => {
        const data = doc.data() as Transaction;
        // Создаем уникальный ключ для транзакции
        const key = `${data.fromUser}-${data.toUser}-${data.amount}-${data.date.seconds}`;
        
        // Для каждой пары транзакций оставляем только расход
        if (data.type === 'expense' || !transactionsMap.has(key)) {
          transactionsMap.set(key, {
            id: doc.id,
            ...data
          });
        }
      });

      // Преобразуем Map в массив и фильтруем только расходные транзакции
      const transactionsData = Array.from(transactionsMap.values())
        .filter(t => t.type === 'expense')
        .sort((a, b) => b.date.seconds - a.date.seconds)
        .slice(0, 5); // Оставляем только 5 последних транзакций

      setTransactions(transactionsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('ru-RU').format(Math.abs(amount)) + ' ₸';
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Последние операции</h2>
        <DollarSign className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-6">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Нет операций</p>
          </div>
        ) : (
          transactions.map(transaction => (
            <div
              key={transaction.id}
              className="flex items-start justify-between p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start space-x-3">
                <div className="mt-1 text-red-500">
                  <ArrowDownRight className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.fromUser}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium text-red-600">
                - {formatAmount(transaction.amount)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
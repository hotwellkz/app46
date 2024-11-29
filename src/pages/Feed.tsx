import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ArrowLeft } from 'lucide-react';

interface Transaction {
  id: string;
  fromUser: string;
  toUser: string;
  amount: number;
  description: string;
  date: {
    seconds: number;
    nanoseconds: number;
  };
  type: 'income' | 'expense';
  categoryId: string;
}

export const Feed: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'transactions'),
      orderBy('date', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transactionsMap = new Map<string, Transaction>();
      
      querySnapshot.docs.forEach(doc => {
        const data = doc.data() as Transaction;
        
        // Создаем уникальный ключ, включающий все важные поля
        const key = `${data.fromUser}-${data.toUser}-${data.amount}-${data.date.seconds}-${data.description}`;
        
        // Для каждой пары транзакций оставляем только расход
        if (data.type === 'expense' || !transactionsMap.has(key)) {
          transactionsMap.set(key, {
            id: doc.id,
            ...data
          });
        }
      });

      // Преобразуем Map в массив и сортируем по дате
      const sortedTransactions = Array.from(transactionsMap.values())
        .sort((a, b) => b.date.seconds - a.date.seconds)
        // Фильтруем, оставляя только транзакции с типом 'expense'
        .filter(t => t.type === 'expense');
      
      setTransactions(sortedTransactions);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    const date = new Date(timestamp.seconds * 1000);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'СЕГОДНЯ';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'ВЧЕРА';
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long'
      }).toUpperCase();
    }
  };

  const groupTransactionsByDate = () => {
    const grouped: { [key: string]: Transaction[] } = {};
    transactions.forEach(transaction => {
      const dateKey = formatDate(transaction.date);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(transaction);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const groupedTransactions = groupTransactionsByDate();

  return (
    <div className="max-w-3xl mx-auto bg-gray-100 min-h-screen">
      <div className="bg-emerald-500 text-white px-4 sm:px-6 py-3 flex items-center sticky top-0 z-10">
        <button onClick={() => window.history.back()} className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-medium">Лента</h1>
      </div>

      <div className="divide-y divide-gray-200">
        {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
          <div key={date}>
            <div className="bg-gray-100 px-4 py-2">
              <h2 className="text-gray-500 text-sm">{date}</h2>
            </div>
            <div className="bg-white">
              {dayTransactions.map((transaction) => (
                <div key={transaction.id} className="px-4 py-3 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-base font-medium">{transaction.fromUser}</span>
                      <span className="text-gray-600">{transaction.toUser}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-red-500 font-medium text-lg">
                        - {transaction.amount.toLocaleString()} ₸
                      </span>
                      <span className="text-gray-500 text-sm mt-1">
                        {transaction.description}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">История операций пуста</p>
        </div>
      )}
    </div>
  );
};
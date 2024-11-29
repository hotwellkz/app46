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

interface DailyTotal {
  [key: string]: {
    total: number;
    transactions: Transaction[];
  };
}

export const DailyReport: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [dates, setDates] = useState<string[]>([]);

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
      
      const uniqueDates = [...new Set(sortedTransactions.map(t => 
        new Date(t.date.seconds * 1000).toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      ))];
      
      setDates(uniqueDates);
      setSelectedDate(uniqueDates[0] || '');
      setTransactions(sortedTransactions);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const groupTransactionsByDate = () => {
    const grouped: DailyTotal = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date.seconds * 1000).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      if (!grouped[date]) {
        grouped[date] = {
          total: 0,
          transactions: []
        };
      }
      
      grouped[date].total += transaction.amount;
      grouped[date].transactions.push(transaction);
    });
    
    return grouped;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(Math.abs(amount)) + ' ₸';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const groupedData = groupTransactionsByDate();
  const currentDayData = groupedData[selectedDate];

  return (
    <div className="min-h-screen bg-white">
      {/* Шапка */}
      <div className="bg-emerald-500 text-white px-4 sm:px-6 py-3 flex items-center sticky top-0 z-10">
        <button onClick={() => window.history.back()} className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-medium">Отчет по дням</h1>
      </div>

      {/* Навигация по датам */}
      <div className="flex justify-center gap-2 py-4 px-4 overflow-x-auto sticky top-14 bg-white z-10 border-b">
        <div className="flex space-x-2 max-w-full overflow-x-auto pb-2 scrollbar-hide">
          {dates.map((date, index) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex-shrink-0 px-4 py-2 rounded-full transition-all ${
                date === selectedDate 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {date}
            </button>
          ))}
        </div>
      </div>

      {/* Основной контент */}
      {currentDayData && (
        <div className="max-w-3xl mx-auto">
          {/* Итоговая сумма за день */}
          <div className="text-center py-8 px-4">
            <h2 className="text-xl sm:text-2xl font-medium text-gray-800 mb-2">{selectedDate}</h2>
            <p className="text-3xl sm:text-4xl font-bold text-red-500">
              - {formatAmount(Math.abs(currentDayData.total))}
            </p>
          </div>

          {/* Список транзакций */}
          <div className="divide-y divide-gray-100">
            {currentDayData.transactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-base sm:text-lg font-medium text-gray-900">
                      {transaction.fromUser}
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                      {transaction.toUser}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-base sm:text-lg font-medium text-red-500">
                      - {formatAmount(transaction.amount)}
                    </span>
                    {transaction.description && (
                      <span className="text-sm text-gray-500 mt-1 text-right">
                        {transaction.description}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
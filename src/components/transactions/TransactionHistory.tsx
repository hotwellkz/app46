import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CategoryCardType } from '../../types';
import { GroupedTransactions, Transaction } from '../../types/transaction';
import { TransactionList } from './TransactionList';
import { formatDateKey } from '../../utils/dateUtils';
import { formatAmount } from '../../utils/formatUtils';

interface TransactionHistoryProps {
  category: CategoryCardType;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  category,
  isOpen,
  onClose
}) => {
  const [transactions, setTransactions] = useState<GroupedTransactions>({});
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const q = query(
      collection(db, 'transactions'),
      where('categoryId', '==', category.id),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const transactionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Transaction[];

        // Calculate total amount
        const total = transactionsData.reduce((sum, transaction) => {
          return sum + Math.abs(transaction.amount);
        }, 0);
        setTotalAmount(total);

        // Group transactions by date
        const grouped = transactionsData.reduce((groups: GroupedTransactions, transaction) => {
          const date = formatDateKey(transaction.date);
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(transaction);
          return groups;
        }, {});

        // Calculate daily totals and sort transactions
        Object.keys(grouped).forEach(date => {
          grouped[date].sort((a, b) => b.date.seconds - a.date.seconds);
        });

        setTransactions(grouped);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [category.id, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-10 z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl mx-4" style={{ maxHeight: '90vh' }}>
        <div className="sticky top-0 bg-white rounded-t-lg border-b border-gray-200 z-10">
          <div className="flex justify-between items-center p-4">
            <div>
              <h2 className="text-xl font-semibold">{category.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Общая сумма: {formatAmount(totalAmount)}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="overflow-auto" style={{ height: 'calc(100vh - 73px)' }}>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : Object.keys(transactions).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              История операций пуста
            </div>
          ) : (
            <TransactionList transactions={transactions} />
          )}
        </div>
      </div>
    </div>
  );
};
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Client } from '../types/client';

export interface PaymentStats {
  paidAmount: number;
  remainingAmount: number;
  progress: number;
}

export const useClientPayments = (client: Client) => {
  const [stats, setStats] = useState<PaymentStats>({
    paidAmount: 0,
    remainingAmount: client.totalAmount,
    progress: 0
  });

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const categoriesQuery = query(
          collection(db, 'categories'),
          where('title', '==', `${client.lastName} ${client.firstName}`),
          where('row', '==', 1)
        );
        
        const categorySnapshot = await getDocs(categoriesQuery);
        if (!categorySnapshot.empty) {
          const categoryId = categorySnapshot.docs[0].id;

          const transactionsQuery = query(
            collection(db, 'transactions'),
            where('categoryId', '==', categoryId)
          );
          
          const transactionsSnapshot = await getDocs(transactionsQuery);
          
          let totalPaid = 0;
          transactionsSnapshot.docs.forEach(doc => {
            const amount = doc.data().amount;
            if (amount < 0) {
              totalPaid += Math.abs(amount);
            }
          });

          const remainingAmount = client.totalAmount - totalPaid;
          const progress = client.totalAmount === 0 ? 0 : 
            Math.min(Math.round((totalPaid / client.totalAmount) * 100), 100);

          setStats({
            paidAmount: totalPaid,
            remainingAmount,
            progress
          });
        }
      } catch (error) {
        console.error('Error fetching payment history:', error);
      }
    };

    fetchPaymentHistory();
  }, [client]);

  return stats;
};
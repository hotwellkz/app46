import { collection, doc, runTransaction, serverTimestamp, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { db } from './config';
import { CategoryCardType } from '../../types';
import { formatAmount, parseAmount } from './categories';

export const transferFunds = async (
  sourceCategory: CategoryCardType,
  targetCategory: CategoryCardType,
  amount: number,
  description: string
): Promise<void> => {
  if (!amount || amount <= 0) {
    throw new Error('Сумма перевода должна быть больше нуля');
  }

  if (!description.trim()) {
    throw new Error('Необходимо указать комментарий к переводу');
  }

  try {
    await runTransaction(db, async (transaction) => {
      // Получаем документы категорий
      const sourceRef = doc(db, 'categories', sourceCategory.id);
      const targetRef = doc(db, 'categories', targetCategory.id);
      
      const sourceDoc = await transaction.get(sourceRef);
      const targetDoc = await transaction.get(targetRef);

      if (!sourceDoc.exists()) {
        throw new Error('Категория отправителя не найдена');
      }

      if (!targetDoc.exists()) {
        throw new Error('Категория получателя не найдена');
      }

      // Получаем текущие балансы
      const sourceBalance = parseAmount(sourceDoc.data().amount);
      const targetBalance = parseAmount(targetDoc.data().amount);

      // Создаем транзакцию списания для источника
      const withdrawalRef = doc(collection(db, 'transactions'));
      const timestamp = serverTimestamp();
      
      transaction.set(withdrawalRef, {
        categoryId: sourceCategory.id,
        fromUser: sourceCategory.title,
        toUser: targetCategory.title,
        amount: -amount,
        description,
        type: 'expense',
        date: timestamp,
        relatedTransactionId: withdrawalRef.id // Добавляем ID связанной транзакции
      });

      // Создаем транзакцию пополнения для получателя
      const depositRef = doc(collection(db, 'transactions'));
      transaction.set(depositRef, {
        categoryId: targetCategory.id,
        fromUser: sourceCategory.title,
        toUser: targetCategory.title,
        amount: amount,
        description,
        type: 'income',
        date: timestamp,
        relatedTransactionId: withdrawalRef.id // Используем тот же ID для связи
      });

      // Обновляем балансы
      transaction.update(sourceRef, {
        amount: formatAmount(sourceBalance - amount),
        updatedAt: timestamp
      });

      transaction.update(targetRef, {
        amount: formatAmount(targetBalance + amount),
        updatedAt: timestamp
      });
    });
  } catch (error) {
    console.error('Error transferring funds:', error);
    throw error;
  }
};

export const deleteTransaction = async (transactionId: string): Promise<void> => {
  try {
    await runTransaction(db, async (transaction) => {
      // Получаем данные транзакции
      const transactionRef = doc(db, 'transactions', transactionId);
      const transactionDoc = await transaction.get(transactionRef);
      
      if (!transactionDoc.exists()) {
        throw new Error('Transaction not found');
      }

      const transactionData = transactionDoc.data();

      // Находим связанную транзакцию по relatedTransactionId
      const relatedTransactionsQuery = query(
        collection(db, 'transactions'),
        where('relatedTransactionId', '==', transactionData.relatedTransactionId)
      );

      const relatedTransactionsSnapshot = await getDocs(relatedTransactionsQuery);
      const relatedTransaction = relatedTransactionsSnapshot.docs.find(
        doc => doc.id !== transactionId
      );

      // Обновляем баланс первой категории
      const categoryRef = doc(db, 'categories', transactionData.categoryId);
      const categoryDoc = await transaction.get(categoryRef);

      if (categoryDoc.exists()) {
        const currentAmount = parseAmount(categoryDoc.data().amount);
        const newAmount = transactionData.type === 'expense' 
          ? currentAmount + Math.abs(transactionData.amount)
          : currentAmount - transactionData.amount;

        transaction.update(categoryRef, {
          amount: formatAmount(newAmount),
          updatedAt: serverTimestamp()
        });
      }

      // Если найдена связанная транзакция, обновляем баланс второй категории
      if (relatedTransaction) {
        const relatedData = relatedTransaction.data();
        const relatedCategoryRef = doc(db, 'categories', relatedData.categoryId);
        const relatedCategoryDoc = await transaction.get(relatedCategoryRef);

        if (relatedCategoryDoc.exists()) {
          const currentAmount = parseAmount(relatedCategoryDoc.data().amount);
          const newAmount = relatedData.type === 'expense'
            ? currentAmount + Math.abs(relatedData.amount)
            : currentAmount - relatedData.amount;

          transaction.update(relatedCategoryRef, {
            amount: formatAmount(newAmount),
            updatedAt: serverTimestamp()
          });
        }

        // Удаляем связанную транзакцию
        transaction.delete(doc(db, 'transactions', relatedTransaction.id));
      }

      // Удаляем основную транзакцию
      transaction.delete(transactionRef);
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};
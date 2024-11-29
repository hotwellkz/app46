import { collection, query, orderBy, onSnapshot, where, QueryConstraint, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Client } from '../types/client';

export const subscribeToClients = (
  onUpdate: (clients: Client[]) => void,
  onError: (error: Error) => void,
  filters?: {
    status?: 'building' | 'deposit' | 'built';
    year?: number;
  }
) => {
  try {
    // Проверяем существование индекса перед подпиской
    const testQuery = query(
      collection(db, 'clients'),
      where('status', '==', 'building'),
      orderBy('createdAt', 'asc')  // Changed from 'desc' to 'asc'
    );
    
    getDocs(testQuery).catch((error) => {
      if (error.code === 'failed-precondition') {
        console.error('Missing required index. Please create the index in Firebase Console.');
        throw error;
      }
    });

    const constraints: QueryConstraint[] = [orderBy('createdAt', 'asc')];  // Changed from 'desc' to 'asc'
    
    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }
    
    if (filters?.year) {
      constraints.push(where('year', '==', filters.year));
    }

    const q = query(collection(db, 'clients'), ...constraints);

    return onSnapshot(
      q,
      (snapshot) => {
        const clients = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isIconsVisible: true // По умолчанию иконки видимы
        })) as Client[];
        onUpdate(clients);
      },
      (error) => {
        if (error.code === 'failed-precondition') {
          console.error('Missing required index. Please create the index in Firebase Console.');
        }
        onError(error);
      }
    );
  } catch (error) {
    console.error('Error subscribing to clients:', error);
    onError(error);
    return () => {}; // Return empty unsubscribe function
  }
};

export const getClients = async (filters?: {
  status?: 'building' | 'deposit' | 'built';
  year?: number;
}) => {
  try {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'asc')];  // Changed from 'desc' to 'asc'
    
    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }
    
    if (filters?.year) {
      constraints.push(where('year', '==', filters.year));
    }

    const q = query(collection(db, 'clients'), ...constraints);
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      isIconsVisible: true
    })) as Client[];
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};
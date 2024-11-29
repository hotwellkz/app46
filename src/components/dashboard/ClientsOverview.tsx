import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Users, Building2, CheckCircle2, Wallet } from 'lucide-react';

interface ClientStats {
  deposit: number;
  building: number;
  built: number;
  total: number;
}

export const ClientsOverview: React.FC = () => {
  const [stats, setStats] = useState<ClientStats>({
    deposit: 0,
    building: 0,
    built: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'clients'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const clientStats = snapshot.docs.reduce((acc, doc) => {
        const status = doc.data().status;
        return {
          ...acc,
          [status]: acc[status as keyof ClientStats] + 1,
          total: acc.total + 1
        };
      }, { deposit: 0, building: 0, built: 0, total: 0 });

      setStats(clientStats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categories = [
    { 
      label: 'Задаток', 
      value: stats.deposit, 
      icon: <Wallet className="w-5 h-5 text-amber-500" />,
      color: 'bg-amber-100'
    },
    { 
      label: 'Строим', 
      value: stats.building, 
      icon: <Building2 className="w-5 h-5 text-emerald-500" />,
      color: 'bg-emerald-100'
    },
    { 
      label: 'Построено', 
      value: stats.built, 
      icon: <CheckCircle2 className="w-5 h-5 text-blue-500" />,
      color: 'bg-blue-100'
    }
  ];

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Обзор клиентов</h2>
        <div className="flex items-center">
          <Users className="w-5 h-5 text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-500">
            Всего: {stats.total}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {categories.map((category) => (
          <div
            key={category.label}
            className="bg-white rounded-lg border p-3 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                  {category.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{category.label}</p>
                  <p className="text-xl font-semibold text-gray-900">{category.value}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {((category.value / stats.total) * 100 || 0).toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
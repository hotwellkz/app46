import React, { useEffect, useState } from 'react';
import { Building2, Users, DollarSign, BarChart } from 'lucide-react';
import { collection, query, where, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalClients: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const clientsQuery = query(collection(db, 'clients'));
        const clientsSnapshot = await getDocs(clientsQuery);
        
        const activeProjectsQuery = query(
          collection(db, 'clients'),
          where('status', '==', 'building')
        );
        const activeProjectsSnapshot = await getDocs(activeProjectsQuery);

        // Подписываемся на изменения в документе статистики
        const statsRef = doc(db, 'stats', 'dashboard');
        const unsubscribe = onSnapshot(statsRef, (doc) => {
          const data = doc.data();
          const totalRevenue = data?.totalIncome || 0;

          setStats({
            totalProjects: clientsSnapshot.size,
            activeProjects: activeProjectsSnapshot.size,
            totalClients: clientsSnapshot.size,
            totalRevenue
          });
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-12 bg-gray-200 rounded-full w-12 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-emerald-100">
            <Building2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500 truncate">Активные проекты</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.activeProjects}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500 truncate">Всего клиентов</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalClients}</p>
          </div>
        </div>
      </div>

      <div 
        className="bg-white rounded-lg shadow p-6"
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-amber-100">
            <DollarSign className="w-6 h-6 text-amber-600" />
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500 truncate">Общий доход</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.totalRevenue.toLocaleString()} ₸
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100">
            <BarChart className="w-6 h-6 text-purple-600" />
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500 truncate">Всего проектов</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalProjects}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
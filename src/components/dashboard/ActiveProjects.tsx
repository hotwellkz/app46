import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Building2, Calendar, DollarSign } from 'lucide-react';

interface Project {
  id: string;
  clientName: string;
  status: string;
  progress: number;
  deadline: any;
  budget: number;
}

export const ActiveProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'clients'),
      where('status', '==', 'building'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate() || new Date();
        const constructionDays = data.constructionDays || 45;
        const deadline = new Date(createdAt);
        deadline.setDate(deadline.getDate() + constructionDays);

        // Расчет прогресса
        const now = new Date();
        const totalDays = constructionDays;
        const elapsedDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
        const progress = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);

        return {
          id: doc.id,
          clientName: `${data.lastName} ${data.firstName}`,
          status: data.status,
          progress,
          deadline,
          budget: data.totalAmount || 0
        };
      });

      setProjects(projectsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Активные проекты</h2>
      
      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Нет активных проектов</p>
          </div>
        ) : (
          projects.map(project => (
            <div key={project.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">{project.clientName}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(project.deadline)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-sm font-medium text-gray-900">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {project.budget.toLocaleString()} ₸
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Прогресс</span>
                  <span className="text-sm font-medium text-gray-900">{Math.round(project.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(project.progress)}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
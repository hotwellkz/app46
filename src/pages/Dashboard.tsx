import React from 'react';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { ActiveProjects } from '../components/dashboard/ActiveProjects';
import { ClientsOverview } from '../components/dashboard/ClientsOverview';
import { FinancialWidget } from '../components/dashboard/FinancialWidget';
import { ProjectTimeline } from '../components/dashboard/ProjectTimeline';
import { DashboardNotifications } from '../components/dashboard/DashboardNotifications';

export const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Панель управления</h1>
          <p className="mt-1 text-sm text-gray-500">
            Обзор ключевых показателей и активных проектов
          </p>
        </div>

        <div className="space-y-6">
          {/* Статистика */}
          <DashboardStats />
          
          {/* Основной контент */}
          <div className="grid grid-cols-12 gap-6">
            {/* Левая колонка (8 колонок) */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <div className="bg-white rounded-lg shadow-sm">
                <ActiveProjects />
              </div>
              <div className="bg-white rounded-lg shadow-sm">
                <ProjectTimeline />
              </div>
            </div>

            {/* Правая колонка (4 колонки) */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-white rounded-lg shadow-sm">
                <ClientsOverview />
              </div>
              <div className="bg-white rounded-lg shadow-sm">
                <FinancialWidget />
              </div>
              <div className="bg-white rounded-lg shadow-sm">
                <DashboardNotifications />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
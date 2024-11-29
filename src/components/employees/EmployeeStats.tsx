import React from 'react';
import { Users, UserCheck, UserMinus, DollarSign } from 'lucide-react';

interface EmployeeStatsProps {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalSalary: number;
}

export const EmployeeStats: React.FC<EmployeeStatsProps> = ({
  totalEmployees,
  activeEmployees,
  inactiveEmployees,
  totalSalary
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-amber-100 mr-4">
            <Users className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Всего сотрудников</p>
            <p className="text-2xl font-semibold text-gray-900">{totalEmployees}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 mr-4">
            <UserCheck className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Активные</p>
            <p className="text-2xl font-semibold text-gray-900">{activeEmployees}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-100 mr-4">
            <UserMinus className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Неактивные</p>
            <p className="text-2xl font-semibold text-gray-900">{inactiveEmployees}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 mr-4">
            <DollarSign className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Общий фонд ЗП</p>
            <p className="text-2xl font-semibold text-gray-900">
              {totalSalary.toLocaleString()} ₸
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
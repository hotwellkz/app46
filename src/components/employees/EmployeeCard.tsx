import React from 'react';
import { Building2, Mail, Phone, Calendar, DollarSign, History, Edit2, Trash2 } from 'lucide-react';
import { Employee } from '../../types/employee';

interface EmployeeCardProps {
  employee: Employee;
  onEdit: () => void;
  onDelete: () => void;
  onViewHistory: () => void;
  onViewContract: () => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  onDelete,
  onViewHistory,
  onViewContract
}) => {
  const formatDate = (date: any) => {
    if (!date) return 'Не указано';
    return new Date(date.seconds * 1000).toLocaleDateString('ru-RU');
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-all duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-amber-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">
                {employee.lastName} {employee.firstName}
              </h3>
              <span className={'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' + 
                (employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                {employee.status === 'active' ? 'Активный' : 'Неактивный'}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onViewHistory}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
              title="История"
            >
              <History className="w-5 h-5" />
            </button>
            <button
              onClick={onEdit}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
              title="Редактировать"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full"
              title="Удалить"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Building2 className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-600">{employee.position}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-600">{employee.phone}</span>
          </div>
          <div className="flex items-center text-sm">
            <Mail className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-600">{employee.email}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              <Calendar className="w-4 h-4 inline mr-1" />
              Дата регистрации:
            </span>
            <span className="text-gray-900">{formatDate(employee.createdAt)}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Заработная плата:
            </span>
            <span className="text-gray-900">{employee.salary.toLocaleString()} ₸</span>
          </div>
        </div>
      </div>
    </div>
  );
};
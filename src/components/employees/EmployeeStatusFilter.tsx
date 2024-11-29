import React from 'react';

interface EmployeeStatusFilterProps {
  value: 'all' | 'active' | 'inactive';
  onChange: (value: 'all' | 'active' | 'inactive') => void;
}

export const EmployeeStatusFilter: React.FC<EmployeeStatusFilterProps> = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as 'all' | 'active' | 'inactive')}
      className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
    >
      <option value="all">Все сотрудники</option>
      <option value="active">Активные</option>
      <option value="inactive">Неактивные</option>
    </select>
  );
};
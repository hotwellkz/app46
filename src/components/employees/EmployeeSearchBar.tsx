import React from 'react';
import { Search } from 'lucide-react';

interface EmployeeSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const EmployeeSearchBar: React.FC<EmployeeSearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="flex-1 relative">
      <input
        type="text"
        placeholder="Поиск сотрудников..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
      <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
    </div>
  );
};
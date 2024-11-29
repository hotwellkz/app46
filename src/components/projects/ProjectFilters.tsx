import React from 'react';
import { Filter } from 'lucide-react';

interface ProjectFiltersProps {
  selectedYear: number;
  selectedStatus: 'all' | 'deposit' | 'building' | 'built';
  onYearChange: (year: number) => void;
  onStatusChange: (status: 'all' | 'deposit' | 'building' | 'built') => void;
}

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  selectedYear,
  selectedStatus,
  onYearChange,
  onStatusChange
}) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear + i);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-gray-400" />
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {yearOptions.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value as 'all' | 'deposit' | 'building' | 'built')}
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="all">Все проекты</option>
        <option value="deposit">Задаток</option>
        <option value="building">Строительство</option>
        <option value="built">Построенные</option>
      </select>
    </div>
  );
};
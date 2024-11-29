import React from 'react';
import { NewClient } from '../../types/client';

interface ClientFormProps {
  client: NewClient;
  onChange: (updates: Partial<NewClient>) => void;
  yearOptions: number[];
  isEditMode?: boolean;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  client,
  onChange,
  yearOptions,
  isEditMode = false
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Год строительства
          </label>
          <select
            value={client.year}
            onChange={(e) => onChange({ year: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Статус клиента
          </label>
          <select
            value={client.status}
            onChange={(e) => onChange({ status: e.target.value as 'building' | 'deposit' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          >
            <option value="deposit">Задаток</option>
            <option value="building">Строим</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Фамилия *
          </label>
          <input
            type="text"
            required
            value={client.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Имя *
          </label>
          <input
            type="text"
            required
            value={client.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Телефон *
          </label>
          <input
            type="tel"
            required
            value={client.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
      </div>
    </div>
  );
};
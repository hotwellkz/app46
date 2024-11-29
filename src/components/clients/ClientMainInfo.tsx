import React from 'react';
import { Client } from '../../types/client';

interface ClientMainInfoProps {
  formData: Client;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ClientMainInfo: React.FC<ClientMainInfoProps> = ({
  formData,
  isEditing,
  onChange
}) => {
  const formatAmount = (value: string): string => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const event = {
      target: {
        name: 'totalAmount',
        value: rawValue
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Номер клиента
        </label>
        <input
          type="text"
          name="clientNumber"
          value={formData.clientNumber}
          onChange={onChange}
          disabled={!isEditing}
          className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Фамилия
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
          disabled={!isEditing}
          className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Имя
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
          disabled={!isEditing}
          className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Отчество
        </label>
        <input
          type="text"
          name="middleName"
          value={formData.middleName}
          onChange={onChange}
          disabled={!isEditing}
          className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ИИН
        </label>
        <input
          type="text"
          name="iin"
          value={formData.iin}
          onChange={onChange}
          disabled={!isEditing}
          className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Телефон
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          disabled={!isEditing}
          className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          disabled={!isEditing}
          className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Адрес строительства
        </label>
        <input
          type="text"
          name="constructionAddress"
          value={formData.constructionAddress}
          onChange={onChange}
          disabled={!isEditing}
          className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Адрес прописки
        </label>
        <input
          type="text"
          name="livingAddress"
          value={formData.livingAddress}
          onChange={onChange}
          disabled={!isEditing}
          className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Название объекта
        </label>
        <input
          type="text"
          name="objectName"
          value={formData.objectName}
          onChange={onChange}
          disabled={!isEditing}
          className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Количество дней строительства
        </label>
        <input
          type="number"
          name="constructionDays"
          value={formData.constructionDays}
          onChange={onChange}
          disabled={!isEditing}
          className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Общая сумма строительства
        </label>
        <div className="relative">
          <input
            type="text"
            value={isEditing ? formatAmount(formData.totalAmount.toString()) : `${formatAmount(formData.totalAmount.toString())} тг`}
            onChange={handleAmountChange}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded-md disabled:bg-gray-50 text-right ${isEditing ? 'pr-12' : ''}`}
          />
          {isEditing && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              тг
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
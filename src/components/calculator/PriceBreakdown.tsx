import React from 'react';
import { CostBreakdown } from '../../types/calculator';

interface PriceBreakdownProps {
  pricePerSqm: number;
  totalPrice: number;
  costBreakdown: CostBreakdown;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  pricePerSqm,
  totalPrice,
  costBreakdown
}) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₸';
  };

  return (
    <div className="space-y-6">
      <div className="bg-emerald-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-emerald-800 mb-1">
              Стоимость за м²
            </h3>
            <p className="text-2xl font-bold text-emerald-900">
              {formatPrice(pricePerSqm)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-emerald-800 mb-1">
              Общая стоимость
            </h3>
            <p className="text-2xl font-bold text-emerald-900">
              {formatPrice(totalPrice)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Расшифровка стоимости
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Фундамент</span>
            <span className="font-medium">{formatPrice(costBreakdown.foundation)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Домокомплект</span>
            <span className="font-medium">{formatPrice(costBreakdown.houseKit)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Монтаж</span>
            <span className="font-medium">{formatPrice(costBreakdown.assembly)}</span>
          </div>
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Итого</span>
              <span className="font-bold text-emerald-600">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
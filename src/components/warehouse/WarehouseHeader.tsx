import React from 'react';
import { ArrowLeft, Plus, Package, AlertTriangle, DollarSign, Grid } from 'lucide-react';
import { WarehouseStats } from '../../types/warehouse';

interface WarehouseHeaderProps {
  stats: WarehouseStats;
  onAddProduct: () => void;
}

export const WarehouseHeader: React.FC<WarehouseHeaderProps> = ({
  stats,
  onAddProduct
}) => {
  const formatMoney = (amount: number) => {
    return amount.toLocaleString('ru-RU') + ' ₸';
  };

  return (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center">
              <button onClick={() => window.history.back()} className="mr-4">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Склад</h1>
            </div>
            <button
              onClick={onAddProduct}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
            >
              <Plus className="w-5 h-5 mr-1" />
              Добавить товар
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-emerald-100 mr-3">
                  <Package className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Всего товаров</p>
                  <p className="text-lg font-semibold">{stats.totalProducts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 mr-3">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Общая стоимость</p>
                  <p className="text-lg font-semibold">{formatMoney(stats.totalValue)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-red-100 mr-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Мало на складе</p>
                  <p className="text-lg font-semibold">{stats.lowStockCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-purple-100 mr-3">
                  <Grid className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Категорий</p>
                  <p className="text-lg font-semibold">{stats.categories}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
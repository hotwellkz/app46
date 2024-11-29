import React from 'react';
import { CalculatorState } from '../../types/calculator';

interface CalculatorFormProps {
  formData: CalculatorState;
  onChange: (data: CalculatorState) => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ formData, onChange }) => {
  const handleChange = (field: keyof CalculatorState, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Площадь дома (м²)
        </label>
        <input
          type="number"
          value={formData.area}
          onChange={(e) => handleChange('area', e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
          placeholder="Введите площадь"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Этажность
        </label>
        <select
          value={formData.floors}
          onChange={(e) => handleChange('floors', e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
        >
          <option value="1 этаж">1 этаж</option>
          <option value="2 этажа">2 этажа</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Высота 1-го этажа
        </label>
        <select
          value={formData.firstFloorHeight}
          onChange={(e) => handleChange('firstFloorHeight', e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
        >
          <option value="2,5 метра">2,5 метра</option>
          <option value="2,8 метра">2,8 метра</option>
          <option value="3,0 метра">3,0 метра</option>
        </select>
      </div>

      {formData.floors === '2 этажа' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Высота 2-го этажа
          </label>
          <select
            value={formData.secondFloorHeight}
            onChange={(e) => handleChange('secondFloorHeight', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
          >
            <option value="2,5 метра">2,5 метра</option>
            <option value="2,8 метра">2,8 метра</option>
            <option value="3,0 метра">3,0 метра</option>
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Тип крыши
        </label>
        <select
          value={formData.roofType}
          onChange={(e) => handleChange('roofType', e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
        >
          <option value="1-скатная">1-скатная</option>
          <option value="2-скатная">2-скатная</option>
          <option value="4-скатная">4-скатная</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Форма дома
        </label>
        <select
          value={formData.houseShape}
          onChange={(e) => handleChange('houseShape', e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
        >
          <option value="Простая форма">Простая форма</option>
          <option value="Сложная форма">Сложная форма</option>
        </select>
      </div>
    </div>
  );
};
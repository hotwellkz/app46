import React, { useState } from 'react';
import { ArrowLeft, Calculator as CalcIcon } from 'lucide-react';
import { CalculatorForm } from '../components/calculator/CalculatorForm';
import { PriceBreakdown } from '../components/calculator/PriceBreakdown';
import { calculatePrice, calculateCostBreakdown } from '../utils/calculatorUtils';
import { CommercialProposal } from '../components/calculator/CommercialProposal';
import { CalculatorState } from '../types/calculator';

const initialState: CalculatorState = {
  area: '',
  floors: '1 этаж',
  firstFloorHeight: '2,5 метра',
  secondFloorHeight: '2,5 метра',
  roofType: '1-скатная',
  houseShape: 'Простая форма'
};

export const Calculator: React.FC = () => {
  const [formData, setFormData] = useState<CalculatorState>(initialState);
  const [pricePerSqm, setPricePerSqm] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [costBreakdown, setCostBreakdown] = useState({
    foundation: 0,
    houseKit: 0,
    assembly: 0
  });
  const [showProposal, setShowProposal] = useState(false);

  const handleFormChange = (newData: CalculatorState) => {
    setFormData(newData);
    const { pricePerSqm: price, totalPrice: total } = calculatePrice(newData);
    setPricePerSqm(price);
    setTotalPrice(total);
    setCostBreakdown(calculateCostBreakdown(total));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button onClick={() => window.history.back()} className="mr-4">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">
                Калькулятор стоимости
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <CalcIcon className="w-8 h-8 text-emerald-500" />
            <h2 className="text-xl font-semibold">
              Расчет стоимости строительства дома
            </h2>
          </div>

          <div className="space-y-8">
            <CalculatorForm
              formData={formData}
              onChange={handleFormChange}
            />

            <PriceBreakdown
              pricePerSqm={pricePerSqm}
              totalPrice={totalPrice}
              costBreakdown={costBreakdown}
            />

            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={() => setShowProposal(true)}
                className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Сформировать КП
              </button>
            </div>
          </div>
        </div>
      </div>

      {showProposal && (
        <CommercialProposal
          formData={formData}
          pricePerSqm={pricePerSqm}
          totalPrice={totalPrice}
          costBreakdown={costBreakdown}
          onClose={() => setShowProposal(false)}
        />
      )}
    </div>
  );
};
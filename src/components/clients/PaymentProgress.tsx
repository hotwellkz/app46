import React from 'react';

interface PaymentProgressProps {
  progress: number;
  remainingAmount: number;
}

export const PaymentProgress: React.FC<PaymentProgressProps> = ({
  progress,
  remainingAmount
}) => {
  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const formatMoney = (amount: number): string => {
    return amount.toLocaleString('ru-RU') + ' ₸';
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="w-24 bg-gray-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-500 ${getProgressColor(progress)}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium text-gray-700">{progress}%</span>
        <span className="text-gray-500">
          {formatMoney(remainingAmount)}
        </span>
      </div>
    </div>
  );
};
import React from 'react';
import { Building2, Calendar, DollarSign, History, Eye, EyeOff } from 'lucide-react';
import { Client } from '../../types/client';
import { useClientPayments } from '../../hooks/useClientPayments';
import { PaymentProgress } from './PaymentProgress';

interface ClientCardProps {
  client: Client;
  onContextMenu: (e: React.MouseEvent, client: Client) => void;
  onClientClick: (client: Client) => void;
  onToggleVisibility: (client: Client) => void;
  onViewHistory: (client: Client) => void;
  type: 'building' | 'deposit' | 'built';
  rowNumber: string;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onContextMenu,
  onClientClick,
  onToggleVisibility,
  onViewHistory,
  type,
  rowNumber
}) => {
  const { progress, remainingAmount } = useClientPayments(client);

  const getStatusIcon = () => {
    switch (type) {
      case 'building':
        return <Building2 className="w-4 h-4 text-emerald-600" />;
      case 'deposit':
        return <DollarSign className="w-4 h-4 text-amber-600" />;
      case 'built':
        return <Calendar className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusColors = () => {
    switch (type) {
      case 'building':
        return 'border-emerald-500 bg-emerald-100';
      case 'deposit':
        return 'border-amber-500 bg-amber-100';
      case 'built':
        return 'border-blue-500 bg-blue-100';
    }
  };

  const isDeadlineNear = () => {
    if (type !== 'building') return false;
    
    const startDate = client.createdAt?.toDate() || new Date();
    const deadlineDate = new Date(startDate);
    deadlineDate.setDate(deadlineDate.getDate() + client.constructionDays);
    
    const now = new Date();
    const daysLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysLeft <= 5;
  };

  const isDeadlinePassed = () => {
    if (type !== 'building') return false;
    
    const startDate = client.createdAt?.toDate() || new Date();
    const deadlineDate = new Date(startDate);
    deadlineDate.setDate(deadlineDate.getDate() + client.constructionDays);
    
    return new Date() > deadlineDate;
  };

  const getCardStyle = () => {
    let baseStyle = `bg-white rounded-lg shadow hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 ${getStatusColors()}`;
    
    if (isDeadlinePassed() || isDeadlineNear()) {
      baseStyle += ' bg-red-50';
    }
    
    return baseStyle;
  };

  return (
    <div
      className={getCardStyle()}
      onContextMenu={(e) => onContextMenu(e, client)}
      onClick={() => onClientClick(client)}
    >
      <div className="px-4 py-2">
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-gray-500 w-12 flex-shrink-0">
            {rowNumber}
          </div>

          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
            type === 'building' ? 'bg-emerald-100' : 
            type === 'deposit' ? 'bg-amber-100' : 
            'bg-blue-100'
          }`}>
            {getStatusIcon()}
          </div>

          <div className="flex items-center space-x-2 min-w-0 w-48 flex-shrink-0">
            <span className={`font-medium text-sm truncate ${
              isDeadlinePassed() || isDeadlineNear() ? 'text-red-600' : 'text-gray-900'
            }`}>
              {client.lastName} {client.firstName}
            </span>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {client.clientNumber}
            </span>
          </div>

          <div className="text-sm text-gray-600 truncate min-w-0 w-48 flex-shrink-0">
            {client.objectName || '—'}
          </div>

          <div className="text-sm text-gray-600 truncate min-w-0 w-32 flex-shrink-0">
            {client.phone}
          </div>

          <div className="text-sm text-gray-600 truncate flex-1 min-w-0">
            {client.constructionAddress}
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <PaymentProgress
              progress={progress}
              remainingAmount={remainingAmount}
            />
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewHistory(client);
              }}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 flex-shrink-0"
              title="История транзакций"
            >
              <History className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(client);
              }}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 flex-shrink-0"
              title={client.isIconsVisible ? 'Скрыть иконки' : 'Показать иконки'}
            >
              {client.isIconsVisible ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
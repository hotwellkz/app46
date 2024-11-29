import React, { useState } from 'react';
import { Client } from '../../types/client';
import { ChevronDown, ChevronRight, Building2, Wallet, CheckCircle2 } from 'lucide-react';
import { ClientCard } from './ClientCard';

interface ClientSectionProps {
  title: string;
  subtitle: string;
  clients: Client[];
  onContextMenu: (e: React.MouseEvent, client: Client) => void;
  onClientClick: (client: Client) => void;
  onToggleVisibility: (client: Client) => void;
  onViewHistory: (client: Client) => void;
  type: 'building' | 'deposit' | 'built';
}

export const ClientSection: React.FC<ClientSectionProps> = ({
  title,
  subtitle,
  clients,
  onContextMenu,
  onClientClick,
  onToggleVisibility,
  onViewHistory,
  type
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'building':
        return <Building2 className="w-5 h-5 text-emerald-600" />;
      case 'deposit':
        return <Wallet className="w-5 h-5 text-amber-600" />;
      case 'built':
        return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'building':
        return {
          icon: 'text-emerald-600',
          title: 'text-emerald-900',
          badge: 'text-emerald-600 bg-emerald-50'
        };
      case 'deposit':
        return {
          icon: 'text-amber-600',
          title: 'text-amber-900',
          badge: 'text-amber-600 bg-amber-50'
        };
      case 'built':
        return {
          icon: 'text-blue-600',
          title: 'text-blue-900',
          badge: 'text-blue-600 bg-blue-50'
        };
    }
  };

  const colors = getColors();

  // Generate row numbers for clients
  const clientsWithRowNumbers = clients.map((client, index) => ({
    ...client,
    rowNumber: String(index + 1).padStart(3, '0')
  }));

  return (
    <div>
      <div 
        className="flex items-center justify-between mb-3 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          {isCollapsed ? (
            <ChevronRight className={`w-5 h-5 ${colors.icon}`} />
          ) : (
            <ChevronDown className={`w-5 h-5 ${colors.icon}`} />
          )}
          {getIcon()}
          <h3 className={`font-medium ${colors.title}`}>
            {title} ({clients.length})
          </h3>
        </div>
        <div className={`text-xs px-2 py-1 rounded-full ${colors.badge}`}>
          {subtitle}
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="space-y-2">
          {clientsWithRowNumbers.map(client => (
            <ClientCard
              key={client.id}
              client={client}
              onContextMenu={onContextMenu}
              onClientClick={onClientClick}
              onToggleVisibility={onToggleVisibility}
              onViewHistory={onViewHistory}
              type={type}
              rowNumber={client.rowNumber}
            />
          ))}
        </div>
      )}
    </div>
  );
};
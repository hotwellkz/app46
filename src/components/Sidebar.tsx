import React, { useState } from 'react';
import { 
  LayoutDashboard,
  ArrowLeftRight, 
  ScrollText, 
  Receipt, 
  FileText,
  Users,
  Menu,
  X,
  Package,
  Building2,
  Calculator,
  MessageCircle,
  Warehouse
} from 'lucide-react';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

interface SidebarProps {
  onPageChange: (page: 'dashboard' | 'transactions' | 'feed' | 'daily-report' | 'clients' | 'templates' | 'products' | 'employees' | 'projects' | 'calculator' | 'chat' | 'warehouse') => void;
  currentPage: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onPageChange, currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { 
      icon: <LayoutDashboard className="w-5 h-5" />, 
      label: 'Панель управления', 
      onClick: () => onPageChange('dashboard'),
      isActive: currentPage === 'dashboard'
    },
    { 
      icon: <ArrowLeftRight className="w-5 h-5" />, 
      label: 'Транзакции', 
      onClick: () => onPageChange('transactions'),
      isActive: currentPage === 'transactions'
    },
    { 
      icon: <ScrollText className="w-5 h-5" />, 
      label: 'Лента', 
      onClick: () => onPageChange('feed'),
      isActive: currentPage === 'feed'
    },
    { 
      icon: <Receipt className="w-5 h-5" />, 
      label: 'Отчет по дням', 
      onClick: () => onPageChange('daily-report'),
      isActive: currentPage === 'daily-report'
    },
    { 
      icon: <Users className="w-5 h-5" />, 
      label: 'Клиенты', 
      onClick: () => onPageChange('clients'),
      isActive: currentPage === 'clients'
    },
    { 
      icon: <FileText className="w-5 h-5" />, 
      label: 'Шаблоны договоров', 
      onClick: () => onPageChange('templates'),
      isActive: currentPage === 'templates'
    },
    { 
      icon: <Package className="w-5 h-5" />, 
      label: 'Товары и цены', 
      onClick: () => onPageChange('products'),
      isActive: currentPage === 'products'
    },
    { 
      icon: <Users className="w-5 h-5" />, 
      label: 'Сотрудники', 
      onClick: () => onPageChange('employees'),
      isActive: currentPage === 'employees'
    },
    { 
      icon: <Building2 className="w-5 h-5" />, 
      label: 'Проекты', 
      onClick: () => onPageChange('projects'),
      isActive: currentPage === 'projects'
    },
    { 
      icon: <Calculator className="w-5 h-5" />, 
      label: 'Калькулятор', 
      onClick: () => onPageChange('calculator'),
      isActive: currentPage === 'calculator'
    },
    { 
      icon: <MessageCircle className="w-5 h-5" />, 
      label: 'Чат', 
      onClick: () => onPageChange('chat'),
      isActive: currentPage === 'chat'
    },
    { 
      icon: <Warehouse className="w-5 h-5" />, 
      label: 'Склад', 
      onClick: () => onPageChange('warehouse'),
      isActive: currentPage === 'warehouse'
    }
  ];

  const handleMenuItemClick = (item: MenuItem) => {
    item.onClick();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-[60] lg:hidden bg-white p-2 rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[45] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-[50] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 lg:h-0" />
          
          <div className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuItemClick(item)}
                className={`w-full flex items-center px-6 py-3 text-gray-700 transition-colors ${
                  item.isActive 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className={item.isActive ? 'text-emerald-600' : 'text-emerald-500'}>
                  {item.icon}
                </span>
                <span className="ml-3 text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
          
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center text-sm text-gray-500">
              <span>
                Сегодня, {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
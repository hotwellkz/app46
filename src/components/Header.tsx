import React from 'react';
import { TopStats } from './TopStats';

interface HeaderProps {
  stats: Array<{ label: string; value: string; }>;
}

export const Header: React.FC<HeaderProps> = ({ stats }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TopStats stats={stats} />
      </div>
    </header>
  );
};
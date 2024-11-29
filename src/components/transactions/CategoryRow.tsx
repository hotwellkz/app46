import React, { useState, useRef } from 'react';
import { CategoryCardType } from '../../types';
import { DroppableCategory } from './DroppableCategory';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';

interface CategoryRowProps {
  title: string;
  categories: CategoryCardType[];
  onHistoryClick: (category: CategoryCardType) => void;
  onAddCategory?: () => void;
  rowNumber: number;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({
  title,
  categories,
  onHistoryClick,
  onAddCategory,
  rowNumber
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollStartX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current || rowNumber > 2) return;
    
    setIsScrolling(true);
    scrollStartX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeft.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isScrolling || !scrollContainerRef.current || rowNumber > 2) return;

    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - scrollStartX.current) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    setIsScrolling(false);
  };

  const handleMouseLeave = () => {
    setIsScrolling(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-3">
      <div 
        className="flex items-center justify-between mb-4 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          {isCollapsed ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          )}
          <h2 className="text-sm font-medium text-gray-900">{title}</h2>
        </div>
        <span className="text-xs text-gray-500">
          {categories.length} {categories.length === 1 ? 'элемент' : 'элементов'}
        </span>
      </div>

      {!isCollapsed && (
        <div 
          ref={scrollContainerRef}
          className={`${rowNumber <= 2 ? 'overflow-x-auto scrollbar-hide' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ 
            cursor: isScrolling ? 'grabbing' : 'grab',
            userSelect: 'none'
          }}
        >
          <div className={`flex ${rowNumber <= 2 ? 'space-x-4' : 'flex-wrap gap-4'}`}>
            {categories.map((category) => (
              <div 
                key={category.id} 
                className={rowNumber <= 2 ? 'flex-shrink-0' : ''}
                style={{ pointerEvents: isScrolling ? 'none' : 'auto' }}
              >
                <DroppableCategory
                  category={category}
                  onHistoryClick={() => onHistoryClick(category)}
                />
              </div>
            ))}
            
            {rowNumber === 4 && onAddCategory && (
              <div className="flex items-center">
                <div 
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center justify-center shadow-sm transition-colors cursor-pointer" 
                  onClick={onAddCategory}
                >
                  <Plus className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
import React, { useEffect, useRef } from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface ContextMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  title: string;
  editLabel?: string;
  hideDelete?: boolean;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  position,
  onClose,
  onEdit,
  onDelete,
  title,
  editLabel = "Редактировать",
  hideDelete = false
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleScroll = () => {
      onClose();
    };

    const handleResize = () => {
      onClose();
    };

    // Добавляем обработчики событий
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    // Проверяем и корректируем позицию меню
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let { x, y } = position;

      // Корректируем позицию по горизонтали
      if (x + rect.width > viewportWidth) {
        x = viewportWidth - rect.width - 10;
      }

      // Корректируем позицию по вертикали
      if (y + rect.height > viewportHeight) {
        y = viewportHeight - rect.height - 10;
      }

      // Применяем скорректированные координаты
      menuRef.current.style.left = `${Math.max(10, x)}px`;
      menuRef.current.style.top = `${Math.max(10, y)}px`;
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [onClose, position]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-lg py-1 z-[1000] min-w-[200px]"
      style={{
        position: 'fixed',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
      }}
    >
      <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
        {title}
      </div>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
      >
        <Edit2 className="w-4 h-4" />
        {editLabel}
      </button>

      {!hideDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Удалить
        </button>
      )}
    </div>
  );
};
import React from 'react';
import { Edit2, Trash2, GripVertical } from 'lucide-react';
import { Product } from '../../types/product';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableRowProps {
  product: Product;
  index: number;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const SortableRow: React.FC<SortableRowProps> = ({
  product,
  index,
  onEdit,
  onDelete
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? '#F3F4F6' : undefined,
  };

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <button
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {index + 1}
      </td>
      <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
        {product.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {product.unit}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {product.price.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
        <button
          onClick={() => onEdit(product)}
          className="text-blue-600 hover:text-blue-800 mr-3"
          title="Редактировать"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(product)}
          className="text-red-600 hover:text-red-800"
          title="Удалить"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};
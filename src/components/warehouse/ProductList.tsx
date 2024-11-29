import React, { useState } from 'react';
import { Product } from '../../types/warehouse';
import { Package, History, Plus, AlertTriangle, Trash2, Barcode, QrCode, Image } from 'lucide-react';
import { BarcodeModal } from './BarcodeModal';
import { BarcodeScanner } from './BarcodeScanner';
import { ContextMenu } from '../ContextMenu';
import { ImagePreview } from './ImagePreview';

interface ProductListProps {
  products: Product[];
  onAddBatch: (product: Product) => void;
  onViewHistory: (product: Product) => void;
  onWriteOff: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onAddBatch,
  onViewHistory,
  onWriteOff
}) => {
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    product: Product;
  } | null>(null);

  const formatMoney = (amount: number | undefined): string => {
    if (typeof amount !== 'number') return '0 ₸';
    return amount.toLocaleString('ru-RU') + ' ₸';
  };

  const handleShowBarcode = (product: Product) => {
    setSelectedProduct(product);
    setShowBarcodeModal(true);
  };

  const handleScanResult = (result: string) => {
    const product = products.find(p => p.id === result);
    if (product) {
      setSelectedProduct(product);
      setShowBarcodeModal(true);
    } else {
      alert('Товар не найден');
    }
  };

  const handleContextMenu = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      product
    });
  };

  const handleImageClick = (product: Product) => {
    if (product.image) {
      setSelectedProduct(product);
      setShowImagePreview(true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg">
        <div className="flex justify-end p-3 border-b">
          <button
            onClick={() => setShowScanner(true)}
            className="px-3 py-1.5 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors text-sm"
          >
            <QrCode className="w-4 h-4 mr-1.5 inline-block" />
            Сканировать код
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Товар</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Категория</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Количество</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Средняя цена</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Общая стоимость</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr 
                  key={product.id} 
                  className="hover:bg-gray-50"
                  onContextMenu={(e) => handleContextMenu(e, product)}
                >
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.quantity <= (product.minQuantity || 0) && (
                        <AlertTriangle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                      )}
                      <div className="flex items-center">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-8 h-8 rounded-lg object-cover mr-2 cursor-pointer flex-shrink-0"
                            onClick={() => handleImageClick(product)}
                          />
                        )}
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                          {product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-500 truncate max-w-[150px]">{product.category}</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right">
                    <span className={`text-sm font-medium ${
                      product.quantity <= (product.minQuantity || 0) ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {product.quantity} {product.unit}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">{formatMoney(product.averagePurchasePrice)}</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">{formatMoney(product.totalPurchasePrice)}</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => handleShowBarcode(product)}
                        className="p-1 text-gray-600 hover:text-gray-900"
                        title="Штрих-код"
                      >
                        <Barcode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onAddBatch(product)}
                        className="p-1 text-emerald-600 hover:text-emerald-900"
                        title="Добавить партию"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onWriteOff(product)}
                        className="p-1 text-red-600 hover:text-red-900"
                        title="Списать"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onViewHistory(product)}
                        className="p-1 text-blue-600 hover:text-blue-900"
                        title="История"
                      >
                        <History className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {contextMenu && (
        <ContextMenu
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={() => setContextMenu(null)}
          onEdit={() => {
            onAddBatch(contextMenu.product);
            setContextMenu(null);
          }}
          onDelete={() => {
            onWriteOff(contextMenu.product);
            setContextMenu(null);
          }}
          title={contextMenu.product.name}
          editLabel="Добавить партию"
        />
      )}

      {showBarcodeModal && selectedProduct && (
        <BarcodeModal
          isOpen={showBarcodeModal}
          onClose={() => {
            setShowBarcodeModal(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />
      )}

      {showScanner && (
        <BarcodeScanner
          isOpen={showScanner}
          onClose={() => setShowScanner(false)}
          onScan={handleScanResult}
        />
      )}

      {showImagePreview && selectedProduct?.image && (
        <ImagePreview
          imageUrl={selectedProduct.image}
          onClose={() => {
            setShowImagePreview(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </>
  );
};
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, NewProduct } from '../types/product';
import { ProductList } from '../components/products/ProductList';
import { ProductModal } from '../components/products/ProductModal';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('order'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      setProducts(productsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAdd = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm(`Вы уверены, что хотите удалить товар "${product.name}"?`)) {
      try {
        await deleteDoc(doc(db, 'products', product.id));
        
        // Обновляем порядок оставшихся продуктов
        const updatedProducts = products
          .filter(p => p.id !== product.id)
          .map((p, index) => ({ ...p, order: index }));
        
        const batch = writeBatch(db);
        updatedProducts.forEach(p => {
          batch.update(doc(db, 'products', p.id), { order: p.order });
        });
        await batch.commit();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Ошибка при удалении товара');
      }
    }
  };

  const handleSave = async (productData: NewProduct) => {
    try {
      if (selectedProduct) {
        await updateDoc(doc(db, 'products', selectedProduct.id), productData);
      } else {
        // Находим максимальный order и добавляем новый продукт в конец
        const maxOrder = products.reduce((max, p) => Math.max(max, p.order), -1);
        await addDoc(collection(db, 'products'), {
          ...productData,
          order: maxOrder + 1
        });
      }
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  };

  const handleReorder = async (reorderedProducts: Product[]) => {
    try {
      const batch = writeBatch(db);
      reorderedProducts.forEach(product => {
        batch.update(doc(db, 'products', product.id), { order: product.order });
      });
      await batch.commit();
    } catch (error) {
      console.error('Error reordering products:', error);
      alert('Ошибка при изменении порядка товаров');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button onClick={() => window.history.back()} className="mr-4">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">
                Список товаров и цен
              </h1>
            </div>
            <button
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
            >
              <Plus className="w-5 h-5 mr-1" />
              Добавить товар
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Список товаров пуст
              </div>
            ) : (
              <ProductList
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onReorder={handleReorder}
              />
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <ProductModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          product={selectedProduct || undefined}
          isEditMode={!!selectedProduct}
        />
      )}
    </div>
  );
};
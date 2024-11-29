import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, WarehouseStats } from '../types/warehouse';
import { ProductList } from '../components/warehouse/ProductList';
import { AddProductModal } from '../components/warehouse/AddProductModal';
import { ProductFilters } from '../components/warehouse/ProductFilters';
import { WarehouseHeader } from '../components/warehouse/WarehouseHeader';
import { ProductHistory } from '../components/warehouse/ProductHistory';
import { AddBatchModal } from '../components/warehouse/AddBatchModal';
import { WriteOffModal } from '../components/warehouse/WriteOffModal';

export const Warehouse: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showWriteOffModal, setShowWriteOffModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [stats, setStats] = useState<WarehouseStats>({
    totalProducts: 0,
    totalValue: 0,
    lowStockCount: 0,
    categories: 0
  });

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('name'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      setProducts(productsData);
      
      setStats({
        totalProducts: productsData.length,
        totalValue: productsData.reduce((sum, p) => sum + p.totalPurchasePrice, 0),
        lowStockCount: productsData.filter(p => p.quantity <= p.minQuantity).length,
        categories: new Set(productsData.map(p => p.category)).size
      });
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddBatch = (product: Product) => {
    setSelectedProduct(product);
    setShowBatchModal(true);
  };

  const handleWriteOff = (product: Product) => {
    setSelectedProduct(product);
    setShowWriteOffModal(true);
  };

  const handleViewHistory = (product: Product) => {
    setSelectedProduct(product);
    setShowHistory(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <WarehouseHeader
        stats={stats}
        onAddProduct={() => setShowAddModal(true)}
      />

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="mb-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <ProductFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            products={products}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <ProductList
            products={filteredProducts}
            onAddBatch={handleAddBatch}
            onWriteOff={handleWriteOff}
            onViewHistory={handleViewHistory}
          />
        )}
      </div>

      {showAddModal && (
        <AddProductModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showBatchModal && selectedProduct && (
        <AddBatchModal
          isOpen={showBatchModal}
          onClose={() => {
            setShowBatchModal(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />
      )}

      {showWriteOffModal && selectedProduct && (
        <WriteOffModal
          isOpen={showWriteOffModal}
          onClose={() => {
            setShowWriteOffModal(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />
      )}

      {showHistory && selectedProduct && (
        <ProductHistory
          isOpen={showHistory}
          onClose={() => {
            setShowHistory(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />
      )}
    </div>
  );
};
import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ProductService } from '../services/mockBackend';

interface HomePageProps {
  onAddToCart: (product: Product, quantity: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onAddToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Live Fish' | 'Supplies'>('All');

  useEffect(() => {
    ProductService.getAll().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  if (loading) return <div className="text-center py-20 text-deepSea text-xl font-bold animate-pulse">Loading Catalog...</div>;

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-deepSea">Catalog</h1>
        
        <div className="flex gap-2">
          {(['All', 'Live Fish', 'Supplies'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === cat 
                  ? 'bg-deepSea text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
};
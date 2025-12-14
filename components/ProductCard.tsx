import React, { useState } from 'react';
import { Product } from '../types';
import { formatCurrency } from '../utils/shipping';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  // Stock Status Logic
  let stockStatusLabel = "";
  let stockStatusColor = "";

  if (product.stockCount === 0) {
    stockStatusLabel = "No Stock";
    stockStatusColor = "text-red-500";
  } else if (product.stockCount <= 10) {
    stockStatusLabel = "Limited Stock";
    stockStatusColor = "text-orange-500";
  } else {
    stockStatusLabel = "In Stock";
    stockStatusColor = "text-green-600";
  }

  const handleIncrement = () => {
    if (quantity < 50 && quantity < product.stockCount) setQuantity(q => q + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      <div className="relative h-48 bg-gray-200">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        {product.stockCount === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">SOLD OUT</span>
          </div>
        )}
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-deepSea leading-tight">{product.name}</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.weight}g</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 flex-grow">{product.description || 'Premium quality aquatic product.'}</p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-deepSea">{formatCurrency(product.price)}</span>
          <span className={`text-xs font-semibold uppercase ${stockStatusColor}`}>
            {stockStatusLabel}
          </span>
        </div>

        {product.stockCount > 0 ? (
          <div className="flex items-center justify-between gap-3 mt-auto">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button 
                onClick={handleDecrement}
                className="p-2 hover:bg-gray-100 text-deepSea"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <input 
                type="text" 
                readOnly 
                value={quantity} 
                className="w-8 text-center text-sm font-semibold focus:outline-none"
              />
              <button 
                onClick={handleIncrement}
                className="p-2 hover:bg-gray-100 text-deepSea"
                disabled={quantity >= 50 || quantity >= product.stockCount}
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={() => onAddToCart(product, quantity)}
              className="flex-1 bg-coralPop hover:bg-red-500 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm font-bold transition-colors"
            >
              <ShoppingCart size={18} />
              Add
            </button>
          </div>
        ) : (
          <button disabled className="w-full bg-gray-300 text-gray-500 py-2 rounded-md font-bold cursor-not-allowed mt-auto">
            Unavailable
          </button>
        )}
      </div>
    </div>
  );
};
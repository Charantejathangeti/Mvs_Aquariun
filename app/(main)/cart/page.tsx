import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../../../types';
import { calculateShipping, formatCurrency } from '../../../utils/shipping';
import { Trash2, AlertCircle, ArrowRight, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';

interface CartPageProps {
  cartItems: CartItem[];
  onRemoveFromCart: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ cartItems, onRemoveFromCart, onUpdateQuantity }) => {
  const { totalWeight, cost: shippingCost } = calculateShipping(cartItems);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + shippingCost;
  
  // State for toggling shipping details
  const [isShippingExpanded, setIsShippingExpanded] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-400 mb-4">Your Cart is Empty</h2>
        <Link to="/" className="inline-block bg-deepSea text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  // Shipping Breakdown Calculation for UI Display
  const isTier1 = totalWeight < 1000;
  const additionalWeight = Math.max(0, totalWeight - 1000);
  const surchargeUnits = Math.ceil(additionalWeight / 1000);
  const surchargeAmount = isTier1 ? 0 : surchargeUnits * 50;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Items List */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold text-deepSea mb-4">Shopping Cart</h2>
        {cartItems.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-4 items-center">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md bg-gray-200" />
            <div className="flex-grow">
              <h3 className="font-bold text-deepSea">{item.name}</h3>
              <p className="text-sm text-gray-500">Weight: {item.weight}g/unit</p>
              
              <div className="mt-2 flex items-center gap-3">
                 <div className="flex items-center border border-gray-300 rounded-md bg-gray-50">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="p-1 px-2 hover:bg-gray-200 text-deepSea disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <input 
                        type="number" 
                        min="1" 
                        max="50"
                        value={item.quantity}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val >= 1) {
                                // Enforce stock and max limit if user types directly
                                const maxAllowed = Math.min(50, item.stockCount);
                                onUpdateQuantity(item.id, Math.min(val, maxAllowed));
                            }
                        }}
                        className="w-12 border-x border-gray-300 py-1 text-center text-sm font-semibold focus:outline-none bg-white appearance-none"
                    />
                    <button 
                      onClick={() => onUpdateQuantity(item.id, Math.min(50, Math.min(item.stockCount, item.quantity + 1)))}
                      className="p-1 px-2 hover:bg-gray-200 text-deepSea disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      disabled={item.quantity >= 50 || item.quantity >= item.stockCount}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                 </div>

                 <span className="text-sm font-semibold text-deepSea">
                    x {formatCurrency(item.price)}
                 </span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">{formatCurrency(item.price * item.quantity)}</p>
              <button 
                onClick={() => onRemoveFromCart(item.id)}
                className="text-red-500 hover:text-red-700 p-2 mt-2 transition-colors"
                aria-label="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary & Shipping Logic */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-deepSea sticky top-24">
          <h3 className="text-xl font-bold mb-4 text-deepSea">Order Summary</h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            
            <div className="flex justify-between text-gray-600 items-center">
              <button 
                onClick={() => setIsShippingExpanded(!isShippingExpanded)}
                className="flex items-center gap-1 text-deepSea hover:text-coralPop transition-colors text-sm underline underline-offset-2 focus:outline-none"
              >
                Shipping ({totalWeight}g) 
                {isShippingExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              <span>{formatCurrency(shippingCost)}</span>
            </div>
            
            {/* Dynamic Expandable Shipping Explanation */}
            {isShippingExpanded && (
               <div className="text-xs bg-blue-50 text-blue-900 p-3 rounded border border-blue-200 mt-2 space-y-2 animate-fade-in transition-all">
                  <div className="font-bold mb-1 text-deepSea border-b border-blue-200 pb-1">
                    Shipping Calculation (T.S. & A.P.)
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Total Weight:</span>
                    <span>{totalWeight}g</span>
                  </div>

                  {isTier1 ? (
                    <div className="flex justify-between text-green-700 font-semibold">
                      <span>Tier 1 (&lt; 1kg) Flat Rate:</span>
                      <span>{formatCurrency(80)}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>Base Rate (First 1kg):</span>
                        <span>{formatCurrency(80)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 pl-2">
                        <span>Extra Weight:</span>
                        <span>{additionalWeight}g</span>
                      </div>
                      <div className="flex justify-between text-orange-700 font-semibold pl-2">
                         <span>Surcharge ({surchargeUnits} x ₹50):</span>
                         <span>{formatCurrency(surchargeAmount)}</span>
                      </div>
                    </>
                  )}
                  
                  <div className="border-t border-blue-300 pt-1 mt-1 flex justify-between font-bold">
                    <span>Final Shipping Cost:</span>
                    <span>{formatCurrency(shippingCost)}</span>
                  </div>
               </div>
            )}

            <div className="border-t pt-3 flex justify-between items-center text-xl font-bold text-deepSea">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <Link 
            to="/cart/checkout" 
            className="w-full bg-coralPop hover:bg-red-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            Proceed to Checkout <ArrowRight size={20} />
          </Link>

          <p className="text-center text-xs text-gray-500 mt-4">
            Orders dispatched every <strong>MONDAY</strong> only.
          </p>
        </div>
      </div>
    </div>
  );
};